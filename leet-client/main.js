// leet-client/main.js
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

// --- NATIVE UTILS LOADING ---
let nativeUtils = { // Default fallback
  setWindowExcludeFromCapture: (hwnd, exclude) => {
    if (process.platform === 'win32') {
      console.warn('[Fallback] Native setWindowExcludeFromCapture called but module not loaded.');
    }
    return false;
  }
};

if (process.platform === 'win32') {
  try {
    // Assuming 'native-utils' is a folder in the root of your project ('leet-client')
    // require('./native-utils') will execute 'leet-client/native-utils/index.js'
    const loadedUtils = require('./native-utils');
    if (loadedUtils && typeof loadedUtils.setWindowExcludeFromCapture === 'function') {
      nativeUtils = loadedUtils;
      console.log("Native utils module loaded successfully.");
    } else {
      console.error("Native utils module loaded, but setWindowExcludeFromCapture is not a function. Using fallback.");
    }
  } catch (e) {
    console.error("Failed to load native_utils module. Window exclusion from capture will not work.", e);
    // The fallback defined above will be used.
  }
}
// --- END NATIVE UTILS LOADING ---

let mainWindow = null;
let isWindowsVisible = true;
let mainWindowTargetOpacity = 0.8;
let isTemporarilyHiddenForCapture = false;

const FIXED_MAIN_WINDOW_WIDTH = 500;
const MIN_MAIN_WINDOW_HEIGHT = 150;
let MAX_MAIN_WINDOW_HEIGHT = 600; // Will be updated

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
    } else if (mainWindow && !mainWindow.isDestroyed()) {
      // If app is activated and window exists, ensure it reflects current 'isWindowsVisible' state
      // This usually means showing it if it was hidden by the system (e.g. on macOS dock click)
      setVisibility(isWindowsVisible, false); // false means don't toggle, just apply current state
      if (isWindowsVisible) mainWindow.focus(); // Bring to front if meant to be visible
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

  // mainWindow should be set by createMainWindow()
  if (!mainWindow) {
    console.error("Main window object is null after creation attempt. Exiting.");
    app.quit(); return;
  }
  
  positionWindows();
  setupEventHandlers();
  sendInitialStates(); // Send initial states to renderer
  setVisibility(isWindowsVisible, false); // Apply initial visibility without toggling message
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
    focusable: false, // Critical for overlay behavior
    resizable: false,
    show: false, // Start hidden, then show after setup to avoid flash
    opacity: 0, // Start fully transparent
    paintWhenInitiallyHidden: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true, // Consider disabling if preload can handle all Node.js needs
      contextIsolation: false, // Consider enabling for better security with a well-defined preload
      backgroundThrottling: false,
    },
  });

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setIgnoreMouseEvents(true, { forward: true }); // Make window click-through
  if (process.platform === 'darwin' && mainWindow.setWindowButtonVisibility) {
    mainWindow.setWindowButtonVisibility(false);
  }
  mainWindow.setTitle("LeetAI Assistant");
  mainWindow.setMenu(null);

  mainWindow.loadFile("index.html")
    .then(() => {
        // Show the window after content is loaded and initial opacity is set
        // This avoids a flash of an unstyled or default-opacity window
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.show();
            // Initial visibility and opacity are handled by setVisibility called in createWindows
        }
    })
    .catch(err => console.error("Failed to load main window HTML:", err));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // --- SET EXCLUDE FROM CAPTURE ---
  if (process.platform === 'win32') {
    mainWindow.webContents.on('did-finish-load', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            try {
                const hwndBuffer = mainWindow.getNativeWindowHandle(); // Returns a Buffer
                let hwndNumber;

                if (hwndBuffer.length === 8) { // 64-bit system (HWND is a pointer, 8 bytes)
                    const bigHwnd = hwndBuffer.readBigUInt64LE(0);
                    hwndNumber = Number(bigHwnd); // Convert BigInt to Number
                    if (bigHwnd > BigInt(Number.MAX_SAFE_INTEGER)) {
                        console.warn("HWND as BigInt exceeds MAX_SAFE_INTEGER. Precision loss in Number conversion is possible but often ok for this API.");
                    }
                } else if (hwndBuffer.length === 4) { // 32-bit system (HWND is 4 bytes)
                    hwndNumber = hwndBuffer.readUInt32LE(0);
                } else {
                    console.error("Unexpected HWND buffer length:", hwndBuffer.length, "Cannot set exclude from capture.");
                    return;
                }

                if (isNaN(hwndNumber) || hwndNumber === 0) {
                     console.error("Failed to get a valid HWND number from buffer. Cannot set exclude from capture.");
                } else {
                    console.log(`Attempting to set exclude from capture for HWND: ${hwndNumber}`);
                    const success = nativeUtils.setWindowExcludeFromCapture(hwndNumber, true); // true to exclude
                    if (success) {
                        console.log("Successfully set WDA_EXCLUDEFROMCAPTURE for main window.");
                    } else {
                        // The native module's fallback in index.js will log if it's used.
                        // This else branch here means the C++ function was called but returned false.
                        console.warn("nativeUtils.setWindowExcludeFromCapture returned false. The overlay might be captured. This could be due to OS version or other system issues.");
                    }
                }
            } catch (e) {
                console.error("Error getting HWND or calling setWindowExcludeFromCapture:", e);
            }
        }
    });
  }
  // --- END SET EXCLUDE FROM CAPTURE ---

  return mainWindow; // Return the created window object
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
    const mainY = workArea.y + 20; // Small offset from top

    mainWindow.setBounds({ x: mainX, y: mainY, width: FIXED_MAIN_WINDOW_WIDTH, height: mainWindow.getBounds().height });
  } catch (error) {
    console.error("Error positioning windows:", error);
  }
}

function setVisibility(visible, isToggle = true) {
   const targetVisible = isToggle ? !isWindowsVisible : visible;
   
   // Only proceed if state is actually changing or if it's not a toggle (forced set)
   if (isToggle && targetVisible === isWindowsVisible && isToggle !== false) { // isToggle !== false to allow force set
    // console.log("Visibility state already matches target. No change.");
    return;
   }

   isWindowsVisible = targetVisible; // Update the global state

   const mainOpacity = isWindowsVisible ? mainWindowTargetOpacity : 0;
   const notificationMessage = isWindowsVisible ? "Overlay Shown" : "Overlay Hidden";

   if (mainWindow && !mainWindow.isDestroyed()) {
       mainWindow.setOpacity(mainOpacity);
       if (isToggle && mainWindow.webContents) { // Only show notification on user toggle
           sendToMainWindow("toggle-visibility", { isVisible: isWindowsVisible });
           sendToMainWindow("show-notification", { type: "info", message: notificationMessage, duration: 1500 });
       } else if (!isToggle && mainWindow.webContents) { // If force setting, still update renderer UI
           sendToMainWindow("toggle-visibility", { isVisible: isWindowsVisible });
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
        if (isWindowsVisible) { // Only apply if window is supposed to be visible
            mainWindow.setOpacity(mainWindowTargetOpacity);
        }
    }
}

function setupEventHandlers() {
  setupGlobalShortcuts();
  setupIpcHandlers();
  
  let displayChangeTimeout;
  const handleDisplayChangeDebounced = () => {
    clearTimeout(displayChangeTimeout);
    displayChangeTimeout = setTimeout(() => {
        console.log("Display metrics changed (debounced). Re-evaluating max height and position.");
        try {
            const primaryDisplay = screen.getPrimaryDisplay();
            MAX_MAIN_WINDOW_HEIGHT = Math.floor(primaryDisplay.workArea.height * 0.85);
        } catch(e) {
            console.error("Could not get primary display work area during display change.", e);
        }
        positionWindows();
    }, 300); // Debounce for 300ms
  }

  screen.on('display-metrics-changed', handleDisplayChangeDebounced);
  screen.on('display-added', handleDisplayChangeDebounced);
  screen.on('display-removed', handleDisplayChangeDebounced);
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

  let allShortcutsRegistered = true;
  for (const [accelerator, callback] of Object.entries(shortcuts)) {
    try {
      if (!globalShortcut.register(accelerator, callback)) {
        console.warn(` > FAILED to register global shortcut: ${accelerator}. It might be in use by another application.`);
        allShortcutsRegistered = false;
      }
    } catch (error) {
      console.error(` > ERROR registering shortcut ${accelerator}:`, error);
      allShortcutsRegistered = false;
    }
  }

  if (!allShortcutsRegistered) {
      sendErrorNotification("Some hotkeys failed to register. Check for conflicts.", null, 5000);
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
   ipcMain.on("ocr-text-response", (event, ocrText) => { // From renderer with its current OCR text
       if (isEventFromMainWindow(event)) {
            processGeminiAnalysis(ocrText);
       }
   });
   ipcMain.on("resize-main-window", (event, requestedHeightStr) => {
        if (mainWindow && !mainWindow.isDestroyed() && isEventFromMainWindow(event)) {
            const requestedHeight = parseFloat(requestedHeightStr);
            if (isNaN(requestedHeight)) {
                console.warn("Invalid height requested for resize-main-window:", requestedHeightStr);
                return;
            }

            let newHeight = Math.max(MIN_MAIN_WINDOW_HEIGHT, Math.ceil(requestedHeight));
            newHeight = Math.min(newHeight, MAX_MAIN_WINDOW_HEIGHT);

            const currentBounds = mainWindow.getBounds();
            if (currentBounds.height !== newHeight) {
                mainWindow.setBounds({
                    // x, y, width are maintained or fixed
                    height: newHeight
                }, false); // false = no animation on macOS
            }
        }
   });
}

function triggerScreenshot() {
  if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
    console.warn("Screenshot skipped: Main window invalid or no webContents.");
    sendErrorNotification("Cannot take screenshot, window not ready.", null, 2000);
    return;
  }
   if (isTemporarilyHiddenForCapture) {
       console.warn("Screenshot skipped: Capture already in progress.");
       sendToMainWindow("show-notification", { type: "info", message: "Capture already in progress...", duration: 1500 });
       return;
   }
  captureAndProcessScreenshot(); // This is async, don't await from shortcut
}

async function captureAndProcessScreenshot() {
  if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
      console.warn("Capture aborted: Main window became invalid before start.");
      return;
  }

  const wasMainWindowActuallyVisible = isWindowsVisible && mainWindow.getOpacity() > 0;
  const originalUserTargetOpacity = mainWindowTargetOpacity; // User's preferred opacity when visible
  
  isTemporarilyHiddenForCapture = true;
  sendToMainWindow("set-status-message", "Preparing Capture...");

  try {
      await fs.promises.mkdir(SCREENSHOT_TEMP_DIR, { recursive: true });
  } catch (mkdirError) {
      console.error("Failed to ensure screenshot directory:", mkdirError);
      sendErrorNotification("Screenshot setup failed.", mkdirError);
      isTemporarilyHiddenForCapture = false;
      sendToMainWindow("set-status-message", "Setup Error.");
      return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const screenshotPath = path.join(SCREENSHOT_TEMP_DIR, `screenshot-${timestamp}.png`);
  let finalPath = null;
  let visibilityRestored = false;

  const restoreVisibilityIfNeeded = () => {
    if (visibilityRestored) return;
    if (mainWindow && !mainWindow.isDestroyed()) {
        const restoreToOpacity = isWindowsVisible ? originalUserTargetOpacity : 0;
        mainWindow.setOpacity(restoreToOpacity);
    }
    visibilityRestored = true;
  };

  try {
    if (wasMainWindowActuallyVisible && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setOpacity(0); // Make it fully transparent for capture
    }
    // Delay for opacity change to take effect
    await new Promise(resolve => setTimeout(resolve, process.platform === "darwin" ? 50 : 150));

    sendToMainWindow("set-status-message", "Capturing...");

    const displays = await screenshot.listDisplays();
    if (!displays || displays.length === 0) throw new Error("No displays found for capture.");
    
    const primaryDisplayInfo = screen.getPrimaryDisplay();
    const targetDisplay = displays.find(d => d.id.toString() === primaryDisplayInfo.id.toString()) || displays[0];
    if (!targetDisplay) throw new Error("Could not determine target display.");

    await screenshot({ filename: screenshotPath, format: "png", screen: targetDisplay.id });
    finalPath = screenshotPath;

    restoreVisibilityIfNeeded(); // Restore ASAP after capture

    if (!fs.existsSync(finalPath)) throw new Error(`Screenshot file not found: ${finalPath}`);
    const stats = await fs.promises.stat(finalPath);
    if (stats.size === 0) {
        await fs.promises.unlink(finalPath).catch(e => console.warn("Couldn't delete empty screenshot:", e));
        finalPath = null;
        throw new Error(`Screenshot file is empty: ${path.basename(screenshotPath)}`);
    }

    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
        if (finalPath) await fs.promises.unlink(finalPath).catch(e => console.warn("Error deleting screenshot after window closed:", e));
        throw new Error("Window closed before sending screenshot.");
    }
    
    // Don't await, let it run in background. Errors handled within.
    sendScreenshotFileToServer(finalPath, mainWindow).catch(bgError => {
        console.error("Unhandled error from background sendScreenshotFileToServer:", bgError);
        sendErrorNotification("Internal error sending screenshot.", bgError);
    });
    finalPath = null; // Ownership of file passed to sendScreenshotFileToServer

  } catch (error) {
    console.error("Error during screenshot capture/validation:", error);
    sendErrorNotification(`Capture Error: ${error.message}`, null); // Don't pass full error to UI
    if (mainWindow && !mainWindow.isDestroyed()) sendToMainWindow("set-status-message", "Capture Error.");
    if (finalPath && fs.existsSync(finalPath)) {
       await fs.promises.unlink(finalPath).catch(delErr => console.error("Error deleting failed screenshot:", delErr));
    }
  } finally {
    restoreVisibilityIfNeeded(); // Ensure it's always restored
    isTemporarilyHiddenForCapture = false;
  }
}

async function sendScreenshotFileToServer(filePath, targetWindow) {
  if (!targetWindow || targetWindow.isDestroyed() || !targetWindow.webContents) {
    console.warn(`Window destroyed, cannot send screenshot: ${path.basename(filePath)}`);
    if (filePath && fs.existsSync(filePath)) await fs.promises.unlink(filePath).catch(console.error);
    return;
  }

  let fileStream = null;
  try {
    if (!filePath || !fs.existsSync(filePath)) {
        throw new Error(`File missing before send: ${filePath ? path.basename(filePath) : "Invalid path"}`);
    }
    const stats = await fs.promises.stat(filePath);
    if (stats.size === 0) {
        await fs.promises.unlink(filePath).catch(console.warn);
        throw new Error(`File empty before send: ${path.basename(filePath)}`);
    }

    fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append("image", fileStream, { 
        filename: path.basename(filePath), contentType: 'image/png', knownLength: stats.size
    });

    if (targetWindow.isDestroyed()) throw new Error("Window closed before OCR POST.");
    sendToMainWindow("set-status-message", "Extracting Text...");

    const response = await axios.post(OCR_SERVER_URL, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 30000, maxContentLength: Infinity, maxBodyLength: Infinity,
    });

    if (targetWindow.isDestroyed()) return; // Don't proceed if window closed during request

    if (response.data?.success && typeof response.data.text === 'string') {
      targetWindow.webContents.send("ocr-result", response.data.text);
      targetWindow.webContents.send("set-status-message", "Text Captured. Ready (Cmd+Enter).");
    } else {
      throw new Error(response.data?.error || "Invalid OCR server response");
    }
  } catch (error) {
    console.error(`Error sending/processing screenshot ${filePath ? path.basename(filePath) : "unknown file"}:`, error);
    if (!targetWindow.isDestroyed() && targetWindow.webContents) {
        let msg = "OCR processing failed.";
        let payload = `**OCR Error:**\n${error.message || 'Unknown Error'}`;
        let status = "OCR Error.";
        if (error.code === 'ECONNABORTED') { msg = "OCR timeout."; payload = "**OCR Error:**\nTimeout"; status = "OCR Timeout."; }
        else if (error.response) { msg = `OCR Server Error (${error.response.status})`; payload = `**OCR Server Error (${error.response.status}):**\n${error.response.data?.error || 'Details unavailable'}`; status = `OCR Error (${error.response.status}).`;}
        sendErrorNotification(msg, null, 4000);
        targetWindow.webContents.send("ocr-result", payload);
        targetWindow.webContents.send("set-status-message", status);
    }
  } finally {
    if (fileStream) fileStream.destroy();
    if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath).catch(delErr => console.error(`Error deleting screenshot file ${path.basename(filePath)} in send finally:`, delErr));
    }
  }
}

function triggerGeminiAnalysis() {
    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
         console.warn("AI analysis skipped: Main window invalid.");
         sendErrorNotification("Cannot analyze, window not ready.", null, 2000);
         return;
     }
    if (isTemporarilyHiddenForCapture) {
        console.warn("AI analysis skipped: Screenshot capture active.");
        sendErrorNotification("Wait for capture to complete.", null, 2000);
        return;
    }
    mainWindow.webContents.send("request-ocr-text"); // Ask renderer for its current OCR text
}

async function processGeminiAnalysis(ocrText) { // ocrText comes from renderer via IPC
     if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
         console.warn("AI analysis stopped: Main window became invalid.");
         return;
     }
    const textToAnalyze = (typeof ocrText === 'string' ? ocrText.trim() : "");
    if (!textToAnalyze) {
      sendToMainWindow("show-notification", { type: "warning", message: "No text to analyze. Capture first (Cmd+H).", duration: 3000 });
      sendToMainWindow("set-status-message", "No Text To Analyze.");
      return;
    }

    sendToMainWindow("set-status-message", "Analyzing with AI...");
    try {
      const response = await axios.post(AI_SERVER_URL, { text: textToAnalyze }, {
        headers: { "Content-Type": "application/json" }, timeout: 90000,
      });

      if (mainWindow.isDestroyed()) return;

      if (response.data?.success && typeof response.data.text === 'string') {
        mainWindow.webContents.send("gemini-response", response.data.text);
        mainWindow.webContents.send("set-status-message", "Analysis Complete.");
      } else {
         throw new Error(response.data?.error || "Invalid AI server response");
      }
    } catch (error) {
      console.error("Error calling AI analysis server:", error);
      if (mainWindow.isDestroyed()) return;
      let msg = "AI analysis failed.";
      let payload = `**AI Error:**\n${error.message || 'Unknown Error'}`;
      let status = "AI Error.";
      if (error.code === 'ECONNABORTED') { msg = "AI analysis timeout."; payload = "**AI Error:**\nTimeout"; status = "AI Timeout."; }
      else if (error.response) { msg = `AI Server Error (${error.response.status})`; payload = `**AI Server Error (${error.response.status}):**\n${error.response.data?.error || 'Details unavailable'}`; status = `AI Error (${error.response.status}).`;}
      sendErrorNotification(msg, null, 4000);
      mainWindow.webContents.send("gemini-response", payload);
      mainWindow.webContents.send("set-status-message", status);
    }
}

function moveWindowUnit(deltaX, deltaY) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  try {
    const [x, y] = mainWindow.getPosition();
    mainWindow.setPosition(x + deltaX, y + deltaY, false);
    // Feedback can be sent via sendToMainWindow if needed
  } catch (error) {
    console.error("Error moving window unit:", error);
  }
}

function scrollMainWindowContent(direction) {
    if (isWindowsVisible && mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
        mainWindow.webContents.send("scroll-main-window-content", direction);
    }
}

function handleRequestInitialSettings(event) {
   if (isEventFromMainWindow(event) && event.sender && !event.sender.isDestroyed()) {
       const alwaysOnTopState = mainWindow ? mainWindow.isAlwaysOnTop() : true;
       event.sender.send("initial-settings-data", {
           alwaysOnTop: alwaysOnTopState,
           isVisible: isWindowsVisible,
           currentOpacity: mainWindowTargetOpacity
       });
       event.sender.send("toggle-visibility", { isVisible: isWindowsVisible }); // Ensure UI consistency
   }
}

function handleUpdateAlwaysOnTop(event, enable) {
    if (!isEventFromMainWindow(event)) return;
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        mainWindow.setAlwaysOnTop(Boolean(enable), "floating"); // "floating" is typical
      } catch (err) {
        console.error("Error setting Always On Top:", err);
        sendErrorNotification("Failed to update always on top.", err);
      }
    }
}

function sendToMainWindow(channel, ...args) {
  if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
    try { mainWindow.webContents.send(channel, ...args); }
    catch(e) { console.error(`IPC Send Error on [${channel}]:`, e); }
  }
}

function sendInitialStates() {
    const alwaysOnTopState = mainWindow ? mainWindow.isAlwaysOnTop() : true;
    sendToMainWindow("initial-settings-data", {
        alwaysOnTop: alwaysOnTopState,
        isVisible: isWindowsVisible,
        currentOpacity: mainWindowTargetOpacity
    });
    sendToMainWindow("toggle-visibility", { isVisible: isWindowsVisible });
}

function sendErrorNotification(message, errorObj = null, duration = 4000) {
    console.error(`[App Notification Error] ${message}`, errorObj || '');
    const displayMessage = `${message}${errorObj && errorObj.message ? `: ${errorObj.message.substring(0,100)}` : ''}`;
    sendToMainWindow("show-notification", {
        type: "error", message: displayMessage.substring(0, 250), duration: duration
    });
}

function isEventFromMainWindow(event) {
    return mainWindow && !mainWindow.isDestroyed() && 
           mainWindow.webContents && !mainWindow.webContents.isDestroyed() &&
           event.sender === mainWindow.webContents;
}

process.on("uncaughtException", (error, origin) => {
  console.error("<<<<< UNCAUGHT EXCEPTION >>>>>", { error, origin });
  sendErrorNotification(`Critical Error: ${error.message}`, null, 7000);
  // Consider fs.writeFileSync to a log file for critical errors
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("<<<<< UNHANDLED PROMISE REJECTION >>>>>", { reason });
  const message = (reason instanceof Error) ? reason.message : String(reason);
  sendErrorNotification(`Background Error: ${message}`, null, 7000);
});