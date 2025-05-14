import express from "express";
import multer from "multer";
// REMOVED: import Tesseract from "tesseract.js";
import { ImageAnnotatorClient } from '@google-cloud/vision'; // Google Cloud Vision client
import axios from "axios";
import axiosRetry from "axios-retry";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
import cluster from "cluster";
import pino from "pino";
import pinoHttp from "pino-http";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
// REMOVED: import fs from "fs";

// --- Basic Setup ---
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const LOG_LEVEL = process.env.LOG_LEVEL || (IS_PRODUCTION ? "info" : "debug");
const numCPUs = os.cpus().length;

// --- Logger Setup ---
const logger = pino({
    level: LOG_LEVEL,
    ...(IS_PRODUCTION ? {} : { transport: { target: 'pino-pretty' } })
});
const httpLogger = pinoHttp({
    logger,
    ...(IS_PRODUCTION && {
        autoLogging: { ignore: (req) => req.method === 'GET' && req.url === '/' },
        serializers: { req: pino.stdSerializers.req, res: pino.stdSerializers.res, err: pino.stdSerializers.err },
        customLogLevel: function (req, res, err) { if (res.statusCode >= 400 && res.statusCode < 500) return 'warn'; if (res.statusCode >= 500 || err) return 'error'; if (res.statusCode >= 300 && res.statusCode < 400) return 'silent'; return 'info'; },
        customSuccessMessage: function (req, res) { if (res.statusCode === 200 && req.method !== 'GET') return `${req.method} ${req.url} completed ${res.statusCode}`; return ''; },
        customErrorMessage: function (req, res, err) { return `${req.method} ${req.url} Error ${res.statusCode}: ${err?.message || 'Unknown error'}`; }
    })
});

// --- REMOVED: Tesseract Path Resolution Logic ---

// --- Gemini Key Check ---
if (!GEMINI_API_KEY && IS_PRODUCTION) { logger.fatal("FATAL ERROR: GEMINI_API_KEY environment variable not set."); process.exit(1); }
else if (!GEMINI_API_KEY) { logger.warn("GEMINI_API_KEY environment variable not set. AI features will be unavailable."); }

// --- Check for Google Credentials ---
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    logger.warn("GOOGLE_APPLICATION_CREDENTIALS environment variable not set. Cloud Vision AI OCR will likely fail.");
}

// --- Clustering Setup ---
if (cluster.isPrimary && IS_PRODUCTION && numCPUs > 1) {
    // --- Primary Process Logic ---
    logger.info(`Primary ${process.pid} starting up on ${os.hostname()}...`);
    logger.info(`Found ${numCPUs} CPUs. Forking ${numCPUs} workers...`);
    for (let i = 0; i < numCPUs; i++) { cluster.fork(); }
    cluster.on('online', (worker) => { logger.info(`Worker ${worker.process.pid} is online.`); });
    cluster.on('exit', (worker, code, signal) => {
        const workerPid = worker.process.pid; const exitReason = signal ? `signal ${signal}` : `code ${code}`;
        if (worker.exitedAfterDisconnect === true) { logger.info(`Worker ${workerPid} exited gracefully (${exitReason}).`); }
        else if (shuttingDownPrimary) { logger.info(`Worker ${workerPid} exited during primary shutdown (${exitReason}).`); }
        else { if (code === 1) { logger.error(`Worker ${workerPid} exited unexpectedly likely due to an error (${exitReason}). Forking replacement...`); } else { logger.warn(`Worker ${workerPid} died unexpectedly (${exitReason}). Forking replacement...`); } setTimeout(() => { if (!shuttingDownPrimary) { logger.info(`Forking replacement for worker ${workerPid}...`); cluster.fork(); } }, 1500); }
    });
    let shuttingDownPrimary = false;
    const shutdownPrimary = async () => {
        if (shuttingDownPrimary) return; shuttingDownPrimary = true; logger.info('Shutdown signal received on primary. Signaling workers to stop...'); const workers = Object.values(cluster.workers); const totalWorkers = workers.length; if (totalWorkers === 0) { logger.info("No active workers found. Primary exiting now."); process.exit(0); return; } logger.info(`Waiting for ${totalWorkers} workers to exit...`); let workersExited = 0;
        const exitPromises = workers.map(worker => { return new Promise((resolve) => { if (worker && worker.isConnected()) { logger.info(`Sending 'shutdown' message to worker ${worker.process.pid}`); worker.send('shutdown'); worker.on('exit', () => { logger.info(`Worker ${worker.process.pid} confirmed exit.`); workersExited++; resolve(); }); const timeout = setTimeout(() => { if (worker && !worker.isDead()) { logger.warn(`Worker ${worker.process.pid} did not exit within timeout. Forcing kill.`); worker.kill('SIGKILL'); } }, 8000); worker.on('exit', () => clearTimeout(timeout)); } else { logger.warn(`Worker ${worker?.process?.pid || 'unknown'} is not connected or already exited. Counting as exited.`); workersExited++; resolve(); } }); });
        await Promise.all(exitPromises); logger.info(`All ${workersExited}/${totalWorkers} workers have exited (or timed out). Primary process exiting.`); setTimeout(() => process.exit(0), 500); setTimeout(() => { logger.error("Primary shutdown sequence timed out. Forcing exit."); process.exit(1); }, 15000);
    };
    process.on('SIGINT', () => { logger.warn("SIGINT received on primary."); shutdownPrimary(); }); process.on('SIGTERM', () => { logger.warn("SIGTERM received on primary."); shutdownPrimary(); });

} else {
    // --- Worker Process ---
    const app = express();
    const workerPid = process.pid;
    const workerId = cluster.worker?.id || 'N/A';
    logger.info(`Worker ${workerPid} (ID: ${workerId}) started on ${os.hostname()}.`);

    // --- Instantiate Google Vision Client ---
    let visionClient;
    try {
         visionClient = new ImageAnnotatorClient();
         logger.info(`Worker ${workerPid}: Google Cloud Vision client initialized successfully.`);
    } catch (err) {
         logger.fatal({ err, workerPid }, `Worker ${workerPid}: CRITICAL - Failed to initialize Google Cloud Vision client.`);
         process.exit(1);
    }

    // --- Essential Middleware ---
    app.use(httpLogger); app.use(cors()); app.use(helmet()); app.use(compression());
    app.use(express.json({ limit: '10mb' })); app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // --- Rate Limiting ---
    const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: IS_PRODUCTION ? 100 : 500, message: { success: false, error: 'Too many requests from this IP, please try again after 15 minutes' }, standardHeaders: true, legacyHeaders: false, keyGenerator: (req) => req.ip, handler: (req, res, next, options) => { logger.warn({ ip: req.ip, url: req.originalUrl, limit: options.max, windowMs: options.windowMs, workerPid }, `Rate limit exceeded for IP`); res.status(options.statusCode).send(options.message); } });
    app.use('/ocr', apiLimiter); app.use('/gemini_analyze', apiLimiter);

    // --- Axios Instance ---
    const axiosInstance = axios.create({ timeout: 60000 });
    axiosRetry(axiosInstance, { retries: 3, retryDelay: (retryCount, error) => Math.min(axiosRetry.exponentialDelay(retryCount), 5000), retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || [429, 500, 502, 503, 504].includes(error.response?.status), onRetry: (retryCount, error, requestConfig) => logger.warn({ retryCount, url: requestConfig.url, method: requestConfig.method, status: error.response?.status, message: error.message, workerPid }, `Retrying Axios request (attempt ${retryCount})`) });

    // --- Multer Config ---
    const storage = multer.memoryStorage(); const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/bmp", "image/tiff", "image/webp"];
    const fileFilter = (req, file, cb) => { if (allowedMimeTypes.includes(file.mimetype)) { cb(null, true); } else { const err = new Error(`Invalid file type: ${file.mimetype}. Only ${allowedMimeTypes.join(', ')} are allowed.`); err.status = 400; err.code = 'INVALID_FILE_TYPE'; cb(err, false); } };
    const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 15 * 1024 * 1024, files: 1 } }).single("image");

    // --- API Endpoints ---
    app.get("/", (req, res) => { res.status(200).json({ status: "ready", workerPid: workerPid, workerId: workerId, ocrService: "Google Cloud Vision AI", uptime: process.uptime(), message: `Worker ${workerPid} is running.` }); });

    // === UPDATED OCR Endpoint (using Google Cloud Vision AI) ===
    app.post("/ocr", (req, res, next) => {
         upload(req, res, async (err) => {
             if (err) { if (err instanceof multer.MulterError) { let message = `File upload error: ${err.message}`; if (err.code === 'LIMIT_FILE_SIZE') message = 'File size exceeds the 15MB limit.'; if (err.code === 'LIMIT_UNEXPECTED_FILE') message = `Unexpected field '${err.field}'. Expected 'image'.`; const multerErr = new Error(message); multerErr.status = 400; multerErr.code = err.code; return next(multerErr); } else if (err.code === 'INVALID_FILE_TYPE') { return next(err); } else { logger.error({ err, workerPid }, "Unexpected error during file upload processing."); return next(err); } }
             if (!req.file) { return res.status(400).json({ success: false, error: "No image file provided in the 'image' field" }); }

             const startTime = Date.now();
             try {
                 logger.info({ ip: req.ip, filename: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype, workerPid }, "Starting Google Cloud Vision OCR job...");
                 const request = {
                     image: { content: req.file.buffer.toString('base64') },
                     features: [ { type: 'TEXT_DETECTION' } ], // Specify the feature type
                 };

                 // ***** THE FIX: Use annotateImage instead of textDetection *****
                 const [result] = await visionClient.annotateImage(request);
                 const duration = Date.now() - startTime;

                 const detections = result.textAnnotations;
                 let detectedText = "";
                 if (detections && detections.length > 0) { detectedText = detections[0].description || ""; }

                 if (result.error) { logger.error({ ip: req.ip, durationMs: duration, workerPid, visionError: result.error }, `Google Vision API returned an error.`); const visionApiError = new Error(`Vision API Error: ${result.error.message || 'Unknown error'}`); visionApiError.status = result.error.code === 3 ? 400 : 500; visionApiError.details = result.error; return next(visionApiError); }

                 logger.info({ ip: req.ip, durationMs: duration, textLength: detectedText.length, workerPid }, `Google Vision OCR successful`);
                 res.json({ success: true, text: detectedText.trim() });

             } catch (error) {
                 const duration = Date.now() - startTime; logger.error({ err: error, ip: req.ip, durationMs: duration, workerPid }, `Google Vision OCR job failed`);
                 let clientMessage = "Failed to process image with OCR service."; let statusCode = 500;
                 if (error.code === 7 || error.message.includes('permission denied')) { statusCode = 503; clientMessage = "OCR service permission denied. Check credentials/API enablement."; logger.error("Possible Permission Denied error."); }
                 else if (error.code === 3) { statusCode = 400; clientMessage = "Invalid request sent to OCR service. Check image format/content."; }
                 else if (error.message.includes('Could not load the default credentials')) { statusCode = 503; clientMessage = "OCR service credentials not found. Check environment setup."; logger.error("Authentication error: GOOGLE_APPLICATION_CREDENTIALS likely missing/invalid."); }
                 else if (error.message.includes('annotateImage method instead')) { statusCode = 500; clientMessage = "Internal server error: Incorrect OCR method used."; logger.error("Incorrect Vision API method called internally.");} // Added for clarity if error persists
                 const processingError = new Error(clientMessage); processingError.status = statusCode; processingError.details = error.message; next(processingError);
             }
         });
     });

    // === Gemini Analysis Endpoint ===
    // (Remains the same)
    app.post("/gemini_analyze", async (req, res, next) => {
        const { text: textToAnalyze } = req.body; if (!textToAnalyze || typeof textToAnalyze !== 'string' || textToAnalyze.trim().length < 1) { return res.status(400).json({ success: false, error: "Invalid or empty 'text' field provided in request body. Must be a non-empty string." }); } if (textToAnalyze.length > 50000) { return res.status(413).json({ success: false, error: "Input text exceeds maximum allowed length." }); } if (!GEMINI_API_KEY) { logger.error({ ip: req.ip, workerPid }, "Gemini request received, but API key is missing or invalid."); return res.status(503).json({ success: false, error: "AI Service is not configured or unavailable." }); } const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`; const payload = { contents: [{ parts: [{ text: `You are an expert coding assistant helping with a LeetCode-style problem. Analyze the following problem description and provide insights, potential approaches, data structures, and algorithms. Problem description:\n\n---\n${textToAnalyze}\n---` }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2048, topP: 0.9, topK: 40 }, safetySettings: [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, ] }; const headers = { "Content-Type": "application/json" }; const startTime = Date.now();
        try {
            logger.info({ ip: req.ip, inputLength: textToAnalyze.length, workerPid }, "Sending request to Gemini API..."); const response = await axiosInstance.post(GEMINI_API_URL, payload, { headers }); const duration = Date.now() - startTime; let geminiText = null, finishReason = null, safetyRatings = null, blockReason = null; if (response && response.data) { const candidates = response.data.candidates; if (Array.isArray(candidates) && candidates.length > 0) { const firstCandidate = candidates[0]; finishReason = firstCandidate.finishReason; safetyRatings = firstCandidate.safetyRatings; if (firstCandidate.content && Array.isArray(firstCandidate.content.parts) && firstCandidate.content.parts.length > 0) { geminiText = firstCandidate.content.parts[0].text; } } if(response.data.promptFeedback && response.data.promptFeedback.blockReason) { blockReason = response.data.promptFeedback.blockReason; } }
             if (blockReason) { logger.warn({ ip: req.ip, durationMs: duration, blockReason, safetyRatings, workerPid }, `Gemini request blocked. Reason: ${blockReason}`); return res.status(400).json({ success: false, error: `AI request blocked due to safety filters or other policy violation (Reason: ${blockReason}). Please modify the input text.` }); } if (finishReason && !["STOP", "MAX_TOKENS"].includes(finishReason)) { logger.warn({ ip: req.ip, durationMs: duration, finishReason, safetyRatings, workerPid }, `Gemini response finished with non-standard reason: ${finishReason}`); return res.status(502).json({ success: false, error: `AI service returned an incomplete or problematic response (Reason: ${finishReason}).` }); } if (typeof geminiText === 'string') { logger.info({ ip: req.ip, durationMs: duration, responseLength: geminiText.length, finishReason, workerPid }, `Gemini request successful`); res.json({ success: true, text: geminiText }); } else { logger.error({ responseData: response?.data, ip: req.ip, durationMs: duration, workerPid }, `Invalid or unexpected response structure from Gemini API (No text found)`); res.status(502).json({ success: false, error: "Received an invalid or empty response format from the AI service." }); }
        } catch (error) {
             const duration = Date.now() - startTime; logger.error({ err: { message: error.message, code: error.code, status: error.response?.status }, responseData: error.response?.data, requestUrl: GEMINI_API_URL, ip: req.ip, durationMs: duration, workerPid }, `Gemini API request failed`); const status = error.response?.status || 500; let clientMessage = "Failed to communicate with the AI service."; if (status === 400) clientMessage = "Bad request sent to AI service (check input formatting or safety filters)."; if (status === 429) clientMessage = "AI service is currently overloaded. Please try again later."; if (status >= 500) clientMessage = "The AI service encountered an internal error."; const apiError = new Error(clientMessage); apiError.status = status; apiError.details = error.response?.data?.error?.message || error.message; next(apiError);
        }
    });

    // --- 404 Not Found Handler ---
    app.use((req, res, next) => { res.status(404).json({ success: false, error: `Not Found: ${req.method} ${req.originalUrl}` }); });

    // --- Centralized Error Handling Middleware ---
    app.use((err, req, res, next) => {
        const statusCode = (typeof err.status === 'number' && err.status >= 400 && err.status < 600) ? err.status : 500; const logFn = res.log ? (statusCode >= 500 ? res.log.error : res.log.warn) : logger.error; logFn.call(res.log || logger, { err: { message: err.message, stack: (IS_PRODUCTION && statusCode < 500) ? undefined : err.stack, status: statusCode, code: err.code, details: err.details }, workerPid }, `Request failed: ${err.message}`); if (res.headersSent) { logger.warn({ workerPid }, "Headers already sent, cannot send error response."); return; } const clientErrorMsg = (IS_PRODUCTION && statusCode >= 500) ? "An internal server error occurred." : err.message || "An unexpected error occurred."; res.status(statusCode).json({ success: false, error: clientErrorMsg });
    });

    // --- Start Server ---
    let server;
    server = app.listen(PORT, HOST, () => { logger.info(`Worker ${workerPid} listening at http://${HOST}:${PORT}. OCR Service: Google Cloud Vision AI`); if (cluster.isWorker && typeof process.send === 'function') { process.send('ready'); } });
    server.on('error', (error) => { if (error.code === 'EADDRINUSE') { logger.fatal({ port: PORT, host: HOST, workerPid }, `Port ${PORT} is already in use.`); } else { logger.fatal({ err: error, workerPid }, `Server failed to start.`); } process.exit(1); });

    // --- Graceful Shutdown for Worker ---
     let shuttingDownWorker = false;
     const handleShutdownSignal = async (signal) => {
         if (shuttingDownWorker) return; shuttingDownWorker = true; logger.warn({ signal, workerPid }, `[${signal}] received on worker ${workerPid}. Initiating graceful shutdown...`); logger.info({ workerPid }, `Closing HTTP server...`); const serverClosePromise = new Promise((resolve, reject) => { if (!server) { logger.warn({ workerPid }, "Server not running, skipping close."); return resolve(); } server.close((err) => { if (err) { logger.error({ err, workerPid }, `Error closing HTTP server.`); reject(err); } else { logger.info({ workerPid }, `HTTP server closed successfully.`); resolve(); } }); setTimeout(() => { logger.warn({ workerPid }, "Server close timed out."); resolve(); }, 5000); }); if (cluster.isWorker && typeof process.disconnect === 'function') { logger.info({ workerPid }, `Worker disconnecting from cluster.`); try { process.disconnect(); } catch (disconnectErr) { logger.warn({ err: disconnectErr, workerPid }, `Error disconnecting worker.`); } }
         try { await serverClosePromise; } catch (serverCloseError) { logger.error({ workerPid }, `Continuing shutdown despite server close error.`); }
         logger.info({ workerPid }, `Worker ${workerPid} finished cleanup. Exiting now.`); setTimeout(() => process.exit(0), 500); setTimeout(() => { logger.error({ workerPid }, `Graceful shutdown timed out. Forcing exit.`); process.exit(1); }, 12000);
     };
    process.on('SIGINT', () => handleShutdownSignal('SIGINT')); process.on('SIGTERM', () => handleShutdownSignal('SIGTERM')); if (cluster.isWorker) { process.on('message', (msg) => { if (msg === 'shutdown') handleShutdownSignal('Cluster Shutdown Request'); }); }
    process.on('unhandledRejection', (reason, promise) => { logger.fatal({ err: reason, promiseDetails: promise, workerPid }, `Unhandled Rejection detected. Forcing shutdown.`); handleShutdownSignal('Unhandled Rejection'); setTimeout(() => process.exit(1), 3000); }); process.on('uncaughtException', (error, origin) => { logger.fatal({ err: error, origin, workerPid }, `Uncaught Exception detected. Forcing shutdown immediately.`); console.error(`FATAL: Uncaught Exception on worker ${workerPid}. Origin: ${origin}. Error: ${error.stack || error}`); process.exit(1); });
} // End of worker process logic