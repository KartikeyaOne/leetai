const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  screen,
  nativeTheme,
} = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const screenshot = require("screenshot-desktop");

let mainWindow = null;
let isWindowsVisible = true;
let mainWindowTargetOpacity = 0.8;
let isTemporarilyHiddenForCapture = false;

const FIXED_MAIN_WINDOW_WIDTH = 500;
const MIN_MAIN_WINDOW_HEIGHT = 150;
let MAX_MAIN_WINDOW_HEIGHT = 600;

const MIN_OPACITY = 0.05;
const OCR_SERVER_URL = "http://0.0.0.0:5000/ocr";
const AI_SERVER_URL = "http://0.0.0.0:5000/gemini_analyze";
const SCREENSHOT_TEMP_DIR = path.join(app.getPath("temp"), "leetai-screenshots");

app.whenReady().then(() => {
  if (process.platform === "darwin") app.dock.hide();
  fs.promises.mkdir(SCREENSHOT_TEMP_DIR, { recursive: true })
    .catch(err => console.error("Failed to create screenshot temp directory:", err));

  try {
      const primaryDisplay = screen.getPrimaryDisplay();
      MAX_MAIN_WINDOW_HEIGHT = Math.floor(primaryDisplay.workArea.height * 0.85);
  } catch(e) {
      console.error("Could not get primary display work area, using default max height.", e);
  }

  createWindows();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindows();
    } else {
      setVisibility(isWindowsVisible, false);
    }
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function createWindows() {
  if (!createMainWindow()) {
    console.error("Failed to create main window. Exiting.");
    app.quit(); return;
  }

  if (!mainWindow) {
    console.error("Window creation incomplete. Exiting.");
    app.quit(); return;
  }
  
  positionWindows();
  setupEventHandlers();
  sendInitialStates();
  setVisibility(isWindowsVisible, false);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: FIXED_MAIN_WINDOW_WIDTH,
    height: MIN_MAIN_WINDOW_HEIGHT,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    resizable: false,
    show: true,
    opacity: 0,
    paintWhenInitiallyHidden: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  });

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.setWindowButtonVisibility?.(false);
  mainWindow.setTitle("LeetAI Assistant");
  mainWindow.setMenu(null);

  mainWindow.loadFile("index.html")
      .catch(err => console.error("Failed to load main window HTML:", err));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

   mainWindow.on('focus', () => {
     if (mainWindow && !mainWindow.isDestroyed()) {
     }
   });
   mainWindow.on('blur', () => {
     if (mainWindow && !mainWindow.isDestroyed()) {
     }
   });

  return mainWindow;
}

function positionWindows() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    console.warn("Positioning skipped: Main window invalid.");
    return;
  }
  try {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { workArea } = primaryDisplay;

    const mainX = Math.round((workArea.width - FIXED_MAIN_WINDOW_WIDTH) / 2) + workArea.x;
    const mainY = workArea.y + 20;

    mainWindow.setBounds({ x: mainX, y: mainY, width: FIXED_MAIN_WINDOW_WIDTH, height: mainWindow.getBounds().height });

  } catch (error) {
    console.error("Error positioning windows:", error);
  }
}

function setVisibility(visible, isToggle = true) {
   const targetVisible = isToggle ? !isWindowsVisible : visible;
   isWindowsVisible = targetVisible;

   const mainOpacity = isWindowsVisible ? mainWindowTargetOpacity : 0;
   const notificationMessage = isWindowsVisible ? "Overlay Shown" : "Overlay Hidden";

   if (mainWindow && !mainWindow.isDestroyed()) {
       mainWindow.setOpacity(mainOpacity);
       if (isToggle && mainWindow.webContents) {
           sendToMainWindow("toggle-visibility", { isVisible: isWindowsVisible });
           sendToMainWindow("show-notification", { type: "info", message: notificationMessage, duration: 1500 });
       }
   }
}

function updateMainWindowOpacity(opacityValue) {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    const newOpacity = Math.max(MIN_OPACITY, Math.min(1.0, parseFloat(opacityValue)));
    if (isNaN(newOpacity)) {
      console.warn(`Invalid opacity value received: ${opacityValue}. Ignoring.`);
      return;
    }
    if (newOpacity !== mainWindowTargetOpacity) {
        mainWindowTargetOpacity = newOpacity;
        if (isWindowsVisible) {
            mainWindow.setOpacity(mainWindowTargetOpacity);
        }
    }
}

function setupEventHandlers() {
  setupGlobalShortcuts();
  setupIpcHandlers();
  screen.on('display-metrics-changed', handleDisplayChange);
  screen.on('display-added', handleDisplayChange);
  screen.on('display-removed', handleDisplayChange);
}

function handleDisplayChange() {
    try {
        const primaryDisplay = screen.getPrimaryDisplay();
        MAX_MAIN_WINDOW_HEIGHT = Math.floor(primaryDisplay.workArea.height * 0.85);
    } catch(e) {
        console.error("Could not get primary display work area during display change.", e);
    }
    setTimeout(positionWindows, 300);
}

function setupGlobalShortcuts() {
  globalShortcut.unregisterAll();

  const shortcuts = {
    "CommandOrControl+B": () => setVisibility(isWindowsVisible, true),
    "CommandOrControl+H": triggerScreenshot,
    "CommandOrControl+Enter": triggerGeminiAnalysis,
    "Alt+Up": () => moveWindowUnit(0, -50),
    "Alt+Down": () => moveWindowUnit(0, 50),
    "Alt+Left": () => moveWindowUnit(-50, 0),
    "Alt+Right": () => moveWindowUnit(50, 0),
    "CommandOrControl+Alt+Up": () => scrollMainWindowContent("up"),
    "CommandOrControl+Alt+Down": () => scrollMainWindowContent("down"),
    "CommandOrControl+Q": () => { app.quit(); },
  };

  let registrationSuccess = true;
  for (const [accelerator, callback] of Object.entries(shortcuts)) {
    try {
      if (!globalShortcut.register(accelerator, callback)) {
        console.warn(` > FAILED to register: ${accelerator}.`);
        registrationSuccess = false;
      }
    } catch (error) {
      console.error(` > ERROR registering shortcut ${accelerator}:`, error);
      registrationSuccess = false;
    }
  }

  if (!registrationSuccess) {
      console.warn("Some global shortcuts failed to register.");
  }
}

function setupIpcHandlers() {
   ipcMain.on("request-initial-settings", handleRequestInitialSettings);
   ipcMain.on("update-always-on-top", handleUpdateAlwaysOnTop);
   ipcMain.on("update-opacity", (event, opacity) => {
       if (isEventFromMainWindow(event)) {
           updateMainWindowOpacity(opacity);
       }
   });
   ipcMain.on("ocr-text-response", (event, ocrText) => {
       if (isEventFromMainWindow(event)) {
            processGeminiAnalysis(ocrText);
       }
   });
   ipcMain.on("resize-main-window", (event, requestedHeight) => {
        if (mainWindow && !mainWindow.isDestroyed() && isEventFromMainWindow(event)) {
            let newHeight = Math.max(MIN_MAIN_WINDOW_HEIGHT, Math.ceil(requestedHeight));
            newHeight = Math.min(newHeight, MAX_MAIN_WINDOW_HEIGHT);

            const currentBounds = mainWindow.getBounds();
            if (currentBounds.height !== newHeight) {
                mainWindow.setBounds({
                    x: currentBounds.x,
                    y: currentBounds.y,
                    width: FIXED_MAIN_WINDOW_WIDTH,
                    height: newHeight
                }, false);
            }
        }
   });
}

function triggerScreenshot() {
  if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
    console.warn("Screenshot skipped: Main window invalid.");
    return;
  }
   if (isTemporarilyHiddenForCapture) {
       console.warn("Screenshot skipped: Capture already in progress.");
       return;
   }
  captureAndProcessScreenshot();
}

async function captureAndProcessScreenshot() {
  if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
      console.warn("Capture aborted: Main window became invalid before start.");
      return;
  }

  const wasMainWindowVisible = isWindowsVisible && mainWindow.getOpacity() > 0;
  const originalMainWindowOpacity = mainWindowTargetOpacity;
  
  // Since mainWindow.setIgnoreMouseEvents(true) is the default and desired state,
  // we don't need to toggle it for screenshots specifically anymore.
  // The window should already be ignoring mouse events.

  isTemporarilyHiddenForCapture = true;
  sendToMainWindow("set-status-message", "Preparing Capture...");

  try {
      await fs.promises.mkdir(SCREENSHOT_TEMP_DIR, { recursive: true });
  } catch (mkdirError) {
      console.error("Failed to ensure screenshot directory:", mkdirError);
      sendErrorNotification("Failed to prepare for screenshot.", mkdirError);
      isTemporarilyHiddenForCapture = false;
      sendToMainWindow("set-status-message", "Setup Error.");
      return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const screenshotPath = path.join(SCREENSHOT_TEMP_DIR, `screenshot-${timestamp}.png`);
  let finalPath = null;
  let restorationDone = false;

  try {
    if (mainWindow && !mainWindow.isDestroyed() && wasMainWindowVisible) mainWindow.setOpacity(0);
    await new Promise(resolve => setTimeout(resolve, 150));

    sendToMainWindow("set-status-message", "Capturing...");

    const displays = await screenshot.listDisplays();
    if (!displays || displays.length === 0) {
        throw new Error("No displays found to capture.");
    }
    const primaryDisplayInfo = screen.getPrimaryDisplay();
    const targetDisplay = displays.find(d => d.id === primaryDisplayInfo.id) || displays[0];
    await screenshot({ filename: screenshotPath, format: "png", screen: targetDisplay.id });
    finalPath = screenshotPath;

    if (!fs.existsSync(finalPath)) {
      throw new Error(`Screenshot file not found: ${finalPath}`);
    }
    const stats = await fs.promises.stat(finalPath);
    if (stats.size === 0) {
        await fs.promises.unlink(finalPath).catch(e => console.warn("Couldn't delete empty screenshot:", e));
        finalPath = null;
        throw new Error(`Screenshot file is empty: ${path.basename(screenshotPath)}`);
    }

    const mainTargetOp = isWindowsVisible ? originalMainWindowOpacity : 0;
    if (mainWindow && !mainWindow.isDestroyed()) {
       mainWindow.setOpacity(mainTargetOp);
    }
    restorationDone = true;

    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
        if (finalPath && fs.existsSync(finalPath)) {
             await fs.promises.unlink(finalPath).catch(e => console.warn("Could not delete file after window closed pre-send:", e));
        }
        throw new Error("Window closed before sending screenshot for OCR.");
    }
    sendScreenshotFileToServer(finalPath, mainWindow).catch(sendError => {
          console.error("Error reported from background sendScreenshotFileToServer:", sendError);
      });

  } catch (captureOrValidationError) {
    console.error("Error during screenshot capture or validation phase:", captureOrValidationError);
    sendErrorNotification(`Capture/Validation Error: ${captureOrValidationError?.message || 'Unknown capture error'}`, captureOrValidationError);
    if (mainWindow && !mainWindow.isDestroyed()) {
        sendToMainWindow("set-status-message", "Capture/Validation Error.");
    }
    if (finalPath && fs.existsSync(finalPath)) {
       fs.promises.unlink(finalPath)
         .catch(delErr => console.error("Error deleting invalid screenshot file (main catch):", delErr));
    }
  } finally {
    if (!restorationDone) {
        console.warn("Restoring window visibility from 'finally' block...");
        const mainTargetOp = isWindowsVisible ? originalMainWindowOpacity : 0;
        if (mainWindow && !mainWindow.isDestroyed()) {
           mainWindow.setOpacity(mainTargetOp);
        }
    }
    isTemporarilyHiddenForCapture = false;
  }
}

async function sendScreenshotFileToServer(filePath, targetWindow) {
  if (!targetWindow || targetWindow.isDestroyed() || !targetWindow.webContents) {
    console.warn(`Window destroyed before attempting to send screenshot file: ${path.basename(filePath)}`);
    try {
        if (filePath && fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    } catch (deleteError) {
        console.error(`Error deleting screenshot file after finding window closed:`, deleteError);
    }
    return; 
  }

  let fileStream = null;
  try {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Screenshot file missing right before send: ${path.basename(filePath)}`);
    }
    const stats = await fs.promises.stat(filePath);
    if (stats.size === 0) {
        await fs.promises.unlink(filePath).catch(e => console.warn("Could not delete empty file pre-send check:", e));
        throw new Error(`Screenshot file is empty (pre-send check): ${path.basename(filePath)}`);
    }

    fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append("image", fileStream, { 
        filename: path.basename(filePath),
        contentType: 'image/png', 
        knownLength: stats.size
    });

    sendToMainWindow("set-status-message", "Extracting Text...");

    const response = await axios.post(OCR_SERVER_URL, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 30000, 
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });


    if (targetWindow.isDestroyed() || !targetWindow.webContents) {
      console.warn(`Window destroyed after OCR request completed for ${path.basename(filePath)}.`);
      return;
    }

    if (response.data?.success && typeof response.data.text === 'string') {
      targetWindow.webContents.send("ocr-result", response.data.text);
      targetWindow.webContents.send("set-status-message", "Text Captured. Ready (Cmd+Enter).");
    } else {
      const errorMessage = response.data?.error || "Unknown or invalid format in OCR server response";
      console.error("OCR Server Error Response Structure:", response.data);
      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error(`Error within sendScreenshotFileToServer for ${path.basename(filePath)}:`, error);
    if (!targetWindow.isDestroyed() && targetWindow.webContents) {
        let notificationMessage = "OCR processing failed.";
        let ocrResultPayload = `**OCR Processing Error:**\n${error.message || 'Unknown Error'}`;
        let statusMessage = "OCR Error.";
        if (error.message?.includes('missing right before send')) {
            notificationMessage = "OCR Error: File disappeared."; statusMessage = "File Error."; ocrResultPayload = `**OCR File Error:**\nFile not found.`;
        } else if (error.message?.includes('empty (pre-send check)')) {
            notificationMessage = "OCR Error: Screenshot empty."; statusMessage = "Empty File Error."; ocrResultPayload = `**OCR File Error:**\nScreenshot file was empty.`;
        } else if (error.code === 'ECONNABORTED') {
            notificationMessage = "OCR request timed out."; ocrResultPayload = "**OCR Error:**\nRequest Timed Out"; statusMessage = "OCR Timeout.";
        } else if (error.response) {
            const status = error.response.status;
            const serverError = error.response.data?.error || error.response.data || `Server Status ${status}`;
            notificationMessage = `OCR Server Error (${status}): ${serverError}`; ocrResultPayload = `**OCR Server Error (${status}):**\n${serverError}`; statusMessage = `OCR Error (${status}).`;
            console.error(" > Full Server Error Response:", error.response.data);
        } else if (error.request) {
            notificationMessage = "OCR server no response."; ocrResultPayload = "**OCR Error:**\nNo Response From Server"; statusMessage = "OCR No Response.";
        }
        sendErrorNotification(notificationMessage, error, 4000);
        targetWindow.webContents.send("ocr-result", ocrResultPayload);
        targetWindow.webContents.send("set-status-message", statusMessage);
    } else {
        console.warn(`Window closed before OCR error for ${path.basename(filePath)} could be reported.`);
    }
  } finally {
    if (fileStream && !fileStream.destroyed) {
        fileStream.destroy();
    }
    try {
      if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (deleteError) {
      console.error(`Error deleting screenshot file ${path.basename(filePath)} in send finally:`, deleteError);
    }
  }
}

function triggerGeminiAnalysis() {
    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
         console.warn("AI analysis skipped: Main window invalid.");
         return;
     }
    if (isTemporarilyHiddenForCapture) {
        console.warn("AI analysis skipped: Screenshot capture active.");
        sendErrorNotification("Wait for capture to complete", null, 2000);
        return;
    }
    mainWindow.webContents.send("request-ocr-text");
}

async function processGeminiAnalysis(ocrText) {
     if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
         console.warn("AI analysis stopped: Main window became invalid.");
         return;
     }
    const textToAnalyze = ocrText?.trim();
    if (!textToAnalyze) {
      sendToMainWindow("show-notification", { type: "warning", message: "No text captured. Use Cmd+H first.", duration: 3000 });
      sendToMainWindow("set-status-message", "No Text To Analyze.");
      return;
    }

    sendToMainWindow("set-status-message", "Analyzing with AI...");

    try {
      const payload = { text: textToAnalyze };
      const response = await axios.post(AI_SERVER_URL, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 90000,
      });

      if (mainWindow.isDestroyed() || !mainWindow.webContents) {
        console.warn("Window destroyed after AI analysis request.");
        return;
      }

      if (response.data?.success && typeof response.data.text === 'string') {
        mainWindow.webContents.send("gemini-response", response.data.text);
        mainWindow.webContents.send("set-status-message", "Analysis Complete.");
      } else {
         const errorMessage = response.data?.error || "Unknown error or invalid format in AI server response";
         console.error("AI Server Error Response Structure:", response.data);
         throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error calling AI analysis server:", error);
      if (mainWindow.isDestroyed() || !mainWindow.webContents) {
           console.warn("Window closed before AI error could be reported.");
           return;
       }
      let notificationMessage = "AI analysis request failed.";
      let geminiResultPayload = `**AI Network/Server Error:**\n${error.message || 'Unknown Error'}`;
      let statusMessage = "AI Error.";
       if (error.code === 'ECONNABORTED') {
           notificationMessage = "AI analysis timed out."; geminiResultPayload = "**AI Error:**\nRequest Timed Out"; statusMessage = "AI Timeout.";
       } else if (error.response) {
           const status = error.response.status;
           const serverError = error.response.data?.error || error.response.data || `Server Status ${status}`;
           notificationMessage = `AI Server Error (${status}): ${serverError}`; geminiResultPayload = `**AI Server Error (${status}):**\n${serverError}`; statusMessage = `AI Error (${status}).`;
            console.error(" > Full AI Server Error Response:", error.response.data);
       } else if (error.request) {
           notificationMessage = "AI server did not respond."; geminiResultPayload = "**AI Error:**\nNo Response From Server"; statusMessage = "AI No Response.";
       }
       sendErrorNotification(notificationMessage, error, 4000);
       mainWindow.webContents.send("gemini-response", geminiResultPayload);
       mainWindow.webContents.send("set-status-message", statusMessage);
    }
}

function moveWindowUnit(deltaX, deltaY) {
  if (!mainWindow || mainWindow.isDestroyed()) {
      console.warn("Window move skipped: Main window invalid.");
      return;
  }
  try {
    const [mainX, mainY] = mainWindow.getPosition();
    const newMainX = mainX + deltaX;
    const newMainY = mainY + deltaY;
    mainWindow.setPosition(newMainX, newMainY, false);

    let direction = "Moved";
    if (deltaX > 0) direction = "Right"; else if (deltaX < 0) direction = "Left";
    else if (deltaY > 0) direction = "Down"; else if (deltaY < 0) direction = "Up";
    sendToMainWindow("movement-indicator", { direction: direction });
  } catch (error) {
    console.error("Error moving window unit:", error);
  }
}

function scrollMainWindowContent(direction) {
    if (isWindowsVisible && mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
        mainWindow.webContents.send("scroll-main-window-content", direction);
    } else {
        console.warn(`Scroll command skipped (Window hidden or invalid): ${direction}`);
    }
}

function handleRequestInitialSettings(event) {
   const sender = event.sender;
   if (isEventFromMainWindow(event) && sender && !sender.isDestroyed()) {
       const alwaysOnTopState = (mainWindow && !mainWindow.isDestroyed()) ? mainWindow.isAlwaysOnTop() : true;
       const payload = {
           alwaysOnTop: alwaysOnTopState,
           isVisible: isWindowsVisible,
           currentOpacity: mainWindowTargetOpacity
       };
       sender.send("initial-settings-data", payload);
       sender.send("toggle-visibility", { isVisible: isWindowsVisible });
   } else {
       console.warn(`Sender for 'request-initial-settings' is invalid or not main window.`);
   }
}

function handleUpdateAlwaysOnTop(event, enable) {
    const shouldBeOnTop = Boolean(enable);
    const level = shouldBeOnTop ? "screen-saver" : "normal";
    try {
      if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.setAlwaysOnTop(shouldBeOnTop, level);
      }
    } catch (err) {
      console.error("Error setting Always On Top property:", err);
      sendErrorNotification("Failed to set Always On Top state", err);
    }
}

function sendToMainWindow(channel, ...args) {
  if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
    try {
        mainWindow.webContents.send(channel, ...args);
    } catch(error) {
        console.error(`Error sending IPC [${channel}] to Main Window:`, error);
    }
  }
}

function sendInitialStates() {
    const alwaysOnTopState = (mainWindow && !mainWindow.isDestroyed()) ? mainWindow.isAlwaysOnTop() : true;
    const payload = {
        alwaysOnTop: alwaysOnTopState,
        isVisible: isWindowsVisible,
        currentOpacity: mainWindowTargetOpacity
    };
    sendToMainWindow("initial-settings-data", payload);
    sendToMainWindow("toggle-visibility", { isVisible: isWindowsVisible });
}

function sendErrorNotification(message, error = null, duration = 4000) {
    if (error) console.error(`[Notification Error] ${message}`, error);
    else console.error(`[Notification Error] ${message}`);
    const displayMessage = `${message}${error ? `: ${error.message}` : ''}`;
    sendToMainWindow("show-notification", {
        type: "error",
        message: displayMessage.substring(0, 200),
        duration: duration
    });
}

function isEventFromMainWindow(event) {
    return mainWindow && !mainWindow.isDestroyed() && event.sender === mainWindow.webContents;
}

process.on("uncaughtException", (error, origin) => {
  console.error("<<<<< UNCAUGHT EXCEPTION >>>>>");
  console.error(`Origin: ${origin}`);
  console.error(error);
  sendErrorNotification(`Critical Error: ${error.message}`, error, 6000);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("<<<<< UNHANDLED PROMISE REJECTION >>>>>");
  console.error("Reason:", reason);
   const message = (reason instanceof Error) ? reason.message : String(reason);
   sendErrorNotification(`Background Error: ${message}`, (reason instanceof Error ? reason : null), 6000);
});