const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  screen,
  nativeTheme, // Still included as it was in your original code
} = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const screenshot = require("screenshot-desktop");

let mainWindow = null;
let controlWindow = null;
let isWindowsVisible = true;
let mainWindowTargetOpacity = 1.0;
let isGhostMode = true; // Start in ghost mode
let isTemporarilyHiddenForCapture = false;

const CONTROL_WINDOW_HEIGHT = 52;
const CONTROL_WINDOW_WIDTH = 500;
const FIXED_MAIN_WINDOW_WIDTH = 500;
const FIXED_MAIN_WINDOW_HEIGHT = 500;
const GAP_PX = 8;
const MIN_OPACITY = 0.05;
const OCR_SERVER_URL = "https://leetai.onrender.com/ocr";
const AI_SERVER_URL = "https://leetai.onrender.com/gemini_analyze";
const SCREENSHOT_TEMP_DIR = path.join(app.getPath("temp"), "leetai-screenshots");

// --- App Lifecycle Handlers ---

app.whenReady().then(() => {
  console.log("Electron App Ready");
  if (process.platform === "darwin") app.dock.hide(); // Hide dock icon on macOS
  fs.promises.mkdir(SCREENSHOT_TEMP_DIR, { recursive: true })
    .then(() => console.log(`Screenshot temp directory ensured: ${SCREENSHOT_TEMP_DIR}`))
    .catch(err => console.error("Failed to create screenshot temp directory:", err));

  createWindows(); // Call the function to create our windows

  app.on("activate", () => {
    // On macOS re-create window if none are open and dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log("App activated with no windows open, recreating...");
      createWindows();
    } else {
      console.log("App activated, windows already exist. Ensuring visibility.");
      setVisibility(isWindowsVisible, false); // Re-apply current visibility state
    }
  });
});

app.on("will-quit", () => {
  console.log("Application quitting...");
  globalShortcut.unregisterAll(); // Clean up shortcuts
  console.log("Global shortcuts unregistered.");
});

app.on("window-all-closed", () => {
  console.log("All windows closed.");
  // Quit app unless on macOS
  if (process.platform !== "darwin") {
    console.log("Quitting application (non-macOS).");
    app.quit();
  } else {
    console.log("Staying active (macOS).");
  }
});

// --- Window Creation and Management ---

function createWindows() {
  // Create control window first
  if (!createControlWindow()) {
    console.error("Failed to create control window. Exiting.");
    app.quit(); return;
  }
  // Then create main window
  if (!createMainWindow()) {
    console.error("Failed to create main window. Exiting.");
    if (controlWindow && !controlWindow.isDestroyed()) controlWindow.close(); // Clean up control window if main failed
    app.quit(); return;
  }

  // Ensure both windows were created successfully
  if (!controlWindow || !mainWindow) {
    console.error("Window creation incomplete. Exiting.");
    // Clean up any potentially created window before exiting
    if (controlWindow && !controlWindow.isDestroyed()) controlWindow.close();
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
    app.quit(); return;
  }

  // *** MODIFICATION START: Set initial focusability AFTER window exists ***
  try {
      console.log(`Setting initial mainWindow focusability based on isGhostMode (${isGhostMode}): Focusable = ${!isGhostMode}`);
      // Set focusable state according to the initial isGhostMode value
      mainWindow.setFocusable(!isGhostMode);
  } catch (err) {
      console.error("Error setting initial main window focusability:", err);
      // Decide if this error is critical, maybe quit?
      // app.quit();
  }
  // *** MODIFICATION END ***

  // Proceed with positioning and setup
  positionWindows();
  setupEventHandlers();
  sendInitialStates();
  setVisibility(isWindowsVisible, false); // Apply initial visibility (likely showing them)
}

function createMainWindow() {
  console.log("Creating Main Window...");
  mainWindow = new BrowserWindow({
    width: FIXED_MAIN_WINDOW_WIDTH,
    height: FIXED_MAIN_WINDOW_HEIGHT,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,       // THIS REMAINS TRUE - Intention is to hide from taskbar
    hasShadow: false,
    // focusable: !isGhostMode, // <-- THIS LINE IS REMOVED FROM CONSTRUCTOR
    resizable: false,
    show: true, // Start hidden initially via opacity
    opacity: 0, // Set initial opacity to 0, setVisibility will fade it in
    paintWhenInitiallyHidden: false, // Optimisation
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,      // Consider security implications
      contextIsolation: false,    // Consider using contextIsolation: true + contextBridge
      backgroundThrottling: false,// Keep running smoothly in background
    },
  });

  // --- Configure mainWindow properties ---
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true }); // Important for overlay apps
  // Set initial mouse behavior based on the global state
  mainWindow.setIgnoreMouseEvents(isGhostMode, { forward: true });
  mainWindow.setWindowButtonVisibility?.(false); // Hide macos traffic lights if frame were visible
  mainWindow.setTitle(""); // No title bar text
  mainWindow.setMenu(null); // No default menu

  // --- Load content ---
  mainWindow.loadFile("index.html")
      .then(() => console.log("Main window HTML loaded."))
      .catch(err => console.error("Failed to load main window HTML:", err));

  // --- Event listeners for mainWindow ---
  mainWindow.on("closed", () => {
    console.log("Main window closed");
    mainWindow = null;
    // If main window closes, close control window too
    if (controlWindow && !controlWindow.isDestroyed()) controlWindow.close();
    // Trigger app quit if this was the last window (handled by window-all-closed)
  });

   // Send focus state changes to renderer for UI feedback *only if interactive*
   mainWindow.on('focus', () => {
     if (mainWindow && !mainWindow.isDestroyed() && !isGhostMode) {
       console.log("Main window focused (Interactive Mode)");
       sendToMainWindow("set-window-focus", true);
     }
   });
   mainWindow.on('blur', () => {
     if (mainWindow && !mainWindow.isDestroyed() && !isGhostMode) {
      console.log("Main window blurred (Interactive Mode)");
      sendToMainWindow("set-window-focus", false);
     }
   });

  return mainWindow; // Return the created window object
}

function createControlWindow() {
  console.log("Creating Control Window...");
  controlWindow = new BrowserWindow({
    width: CONTROL_WINDOW_WIDTH,
    height: CONTROL_WINDOW_HEIGHT,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true, // THIS REMAINS TRUE - Control bar also hidden
    hasShadow: false,
    type: "toolbar", // Suggests OS to treat as a utility panel
    resizable: false,
    maximizable: false,
    minimizable: false,
    focusable: true,   // Control window is always focusable
    show: true,        // Start hidden initially via opacity
    opacity: 0,        // Set initial opacity to 0
    paintWhenInitiallyHidden: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  });

  // --- Configure controlWindow properties ---
  controlWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  controlWindow.setWindowButtonVisibility?.(false);
  controlWindow.setTitle("");
  controlWindow.setMenu(null);

  // --- Load content ---
  controlWindow.loadFile("control.html")
     .then(() => console.log("Control window HTML loaded."))
     .catch(err => console.error("Failed to load control window HTML:", err));

  // --- Event listeners for controlWindow ---
  controlWindow.on("closed", () => {
    console.log("Control window closed");
    controlWindow = null;
    // If control window closes, close main window too
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
    // Trigger app quit if this was the last window (handled by window-all-closed)
  });

  return controlWindow; // Return the created window object
}

function positionWindows() {
  if (!mainWindow || !controlWindow || mainWindow.isDestroyed() || controlWindow.isDestroyed()) {
    console.log("Positioning skipped: One or both windows invalid.");
    return;
  }
  try {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { workArea } = primaryDisplay; // Use workArea to avoid OS taskbars/docks

    const ctlX = Math.round((workArea.width - CONTROL_WINDOW_WIDTH) / 2) + workArea.x;
    const ctlY = workArea.y + 20; // Position near top of work area
    const mainX = Math.round((workArea.width - FIXED_MAIN_WINDOW_WIDTH) / 2) + workArea.x;
    const mainY = ctlY + CONTROL_WINDOW_HEIGHT + GAP_PX; // Position main below control

    console.log(`Positioning Windows: Control (${CONTROL_WINDOW_WIDTH}x${CONTROL_WINDOW_HEIGHT}) @ ${ctlX},${ctlY} | Main (${FIXED_MAIN_WINDOW_WIDTH}x${FIXED_MAIN_WINDOW_HEIGHT}) @ ${mainX},${mainY}`);
    // Use setBounds for atomic positioning and sizing
    controlWindow.setBounds({ x: ctlX, y: ctlY, width: CONTROL_WINDOW_WIDTH, height: CONTROL_WINDOW_HEIGHT });
    mainWindow.setBounds({ x: mainX, y: mainY, width: FIXED_MAIN_WINDOW_WIDTH, height: FIXED_MAIN_WINDOW_HEIGHT });

  } catch (error) {
    console.error("Error positioning windows:", error);
    // Optionally notify user or attempt fallback positioning
  }
}

// --- Visibility and Mode Toggles ---

function setVisibility(visible, isToggle = true) {
   // Determine the target visibility state based on current state and if it's a toggle
   const targetVisible = isToggle ? !isWindowsVisible : visible;

   // Optional: Only proceed if the state is actually changing
   // if (targetVisible === isWindowsVisible && isToggle) {
   //     console.log(`Visibility state already ${isWindowsVisible}. No change.`);
   //     return;
   // }

   isWindowsVisible = targetVisible; // Update the global state
   console.log(`Setting Overall Visibility: ${isWindowsVisible}`);

   // Calculate target opacities
   const mainOpacity = isWindowsVisible ? mainWindowTargetOpacity : 0;
   const controlOpacity = isWindowsVisible ? 1.0 : 0; // Control is always fully opaque when visible
   const notificationMessage = isWindowsVisible ? "Overlay Shown" : "Overlay Hidden";

   // Apply opacity changes to windows if they exist
   if (mainWindow && !mainWindow.isDestroyed()) {
       console.log(` > Setting main window opacity to: ${mainOpacity}`);
       mainWindow.setOpacity(mainOpacity);
       // If this was a toggle action, notify the renderer
       if (isToggle && mainWindow.webContents) {
           sendToMainWindow("toggle-visibility", { isVisible: isWindowsVisible });
           sendToMainWindow("show-notification", { type: "info", message: notificationMessage, duration: 1500 });
       }
   }
   if (controlWindow && !controlWindow.isDestroyed()) {
       console.log(` > Setting control window opacity to: ${controlOpacity}`);
       controlWindow.setOpacity(controlOpacity);
        // If this was a toggle action, notify the renderer
        if (isToggle && controlWindow.webContents) {
            sendToControlWindow("toggle-visibility", { isVisible: isWindowsVisible });
        }
   }
}

function toggleGhostMode() {
  if (!mainWindow || mainWindow.isDestroyed()) {
      console.warn("Cannot toggle ghost mode, main window invalid.");
      return;
  }

  isGhostMode = !isGhostMode; // Flip the state
  console.log(`Ghost Mode Toggled: ${isGhostMode ? "ON (Click Through)" : "OFF (Interactive)"}`);

  try {
    // Update main window properties based on the new ghost mode state
    console.log(` > Setting ignore mouse events: ${isGhostMode}`);
    mainWindow.setIgnoreMouseEvents(isGhostMode, { forward: true });
    console.log(` > Setting focusable: ${!isGhostMode}`);
    mainWindow.setFocusable(!isGhostMode); // Set focusable based on the NEW mode state

    // Update UI in both windows to reflect the change
    updateAllWindowsGhostModeUI();

    // Show notification only if windows are currently visible
    if (mainWindow.webContents && !mainWindow.webContents.isDestroyed() && isWindowsVisible) {
      sendToMainWindow("show-notification", {
        type: "info", message: `Ghost Mode ${isGhostMode ? "Enabled" : "Disabled"}`, duration: 1800
      });
    }
  } catch (error) {
    console.error("Error toggling ghost mode properties:", error);
    sendErrorNotification("Error toggling mode", error);
  }
}

function updateMainWindowOpacity(opacityValue) {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    // Sanitize and clamp the opacity value
    const newOpacity = Math.max(MIN_OPACITY, Math.min(1.0, parseFloat(opacityValue)));

    if (isNaN(newOpacity)) {
      console.warn(`Invalid opacity value received: ${opacityValue}. Ignoring.`);
      return;
    }

    if (newOpacity !== mainWindowTargetOpacity) {
        console.log(`Setting Main Window Target Opacity to: ${newOpacity}`);
        mainWindowTargetOpacity = newOpacity;

        // Apply the new opacity immediately *only if* the windows are supposed to be visible
        if (isWindowsVisible) {
            mainWindow.setOpacity(mainWindowTargetOpacity);
        }
    }
}

// --- Event Handling Setup ---

function setupEventHandlers() {
  setupGlobalShortcuts();
  setupIpcHandlers();
  // Listen for screen changes to reposition windows if necessary
  screen.on('display-metrics-changed', handleDisplayChange);
  screen.on('display-added', handleDisplayChange);
  screen.on('display-removed', handleDisplayChange);
  console.log("Screen event listeners added.");
}

function handleDisplayChange(display, oldMetrics) {
    console.log("Display change detected. Repositioning windows...");
    // Add a small delay to allow the system to settle, especially on metrics changes
    setTimeout(positionWindows, 300);
}

function setupGlobalShortcuts() {
  // Unregister all first to ensure clean state, especially during development (hot-reloading)
  globalShortcut.unregisterAll();
  console.log("Unregistered all shortcuts before re-registering.");

  const shortcuts = {
    "CommandOrControl+B": () => setVisibility(isWindowsVisible, true), // Toggle visibility
    "CommandOrControl+G": toggleGhostMode,
    "CommandOrControl+H": triggerScreenshot, // Capture Screenshot and OCR
    "CommandOrControl+Enter": triggerGeminiAnalysis, // Analyze captured text
    "Alt+Up": () => moveWindowUnit(0, -50),
    "Alt+Down": () => moveWindowUnit(0, 50),
    "Alt+Left": () => moveWindowUnit(-50, 0),
    "Alt+Right": () => moveWindowUnit(50, 0),
    "CommandOrControl+Up": () => scrollMainWindow("up"),
    "CommandOrControl+Down": () => scrollMainWindow("down"),
    "CommandOrControl+Q": () => { console.log("Cmd/Ctrl+Q pressed, quitting."); app.quit(); }, // Standard quit shortcut
  };

  let registrationSuccess = true;
  console.log("Registering global shortcuts:");
  for (const [accelerator, callback] of Object.entries(shortcuts)) {
    try {
      if (!globalShortcut.register(accelerator, callback)) {
        console.warn(` > FAILED to register: ${accelerator}. It might be in use by another application.`);
        registrationSuccess = false; // Keep track if any failed
      } else {
         console.log(` > Registered: ${accelerator}`);
      }
    } catch (error) {
      console.error(` > ERROR registering shortcut ${accelerator}:`, error);
      registrationSuccess = false;
    }
  }

  if (registrationSuccess) {
      console.log("All intended global shortcuts registered successfully (or were already registered).");
  } else {
      console.warn("Some global shortcuts failed to register. Check warnings above.");
      // Maybe notify the user?
      // sendErrorNotification("Some keyboard shortcuts could not be registered.", null, 5000);
  }
}

function setupIpcHandlers() {
   console.log("Setting up IPC Handlers:");
   // Listen for requests from renderer processes for initial state
   ipcMain.on("request-initial-settings", handleRequestInitialSettings);
   // Listen for requests to change always-on-top status
   ipcMain.on("update-always-on-top", handleUpdateAlwaysOnTop);
   // Listen for requests to change main window opacity (from main window UI)
   ipcMain.on("update-opacity", (event, opacity) => {
       if (isEventFromMainWindow(event)) {
           updateMainWindowOpacity(opacity);
       } else {
           console.warn("Received 'update-opacity' from unexpected sender.");
       }
   });
   // Listen for requests to toggle ghost mode (from control window UI)
   ipcMain.on("toggle-ghost-mode", (event) => {
      if (isEventFromControlWindow(event)) {
          toggleGhostMode();
      } else {
          console.warn("Received 'toggle-ghost-mode' from unexpected sender.");
      }
   });
   // Listen for tab switches (from control window UI)
   ipcMain.on("switch-tab", (event, tabId) => {
       if (isEventFromControlWindow(event)) {
           // Currently only one tab, but keep structure
           console.log(`Switch tab request received for tab: ${tabId}`);
           sendToMainWindow("display-tab", tabId); // Tell main window to show the content
       } else {
           console.warn("Received 'switch-tab' from unexpected sender.");
       }
   });
   // Listen for the main window sending back its OCR text when requested for analysis
   ipcMain.on("ocr-text-response", (event, ocrText) => {
       if (isEventFromMainWindow(event)) {
            console.log("Received ocr-text-response from main window for AI analysis.");
            processGeminiAnalysis(ocrText); // Proceed with analysis using the provided text
       } else {
            console.warn("Received 'ocr-text-response' from unexpected sender.");
       }
   });
   console.log("IPC handlers set up complete.");
}

// --- Core Functionality: Screenshot, OCR, AI ---

function triggerScreenshot() {
  // Basic checks before proceeding
  if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
    console.warn("Screenshot skipped: Main window invalid.");
    return;
  }
   if (isTemporarilyHiddenForCapture) {
       console.warn("Screenshot skipped: Capture already in progress.");
       // Maybe provide feedback? sendErrorNotification("Capture already in progress", null, 1500);
       return;
   }
  console.log("Screenshot shortcut triggered... Initiating capture process.");
  captureAndProcessScreenshot(); // Call the async function (runs in background)
}

async function captureAndProcessScreenshot() {
  // Re-check window validity inside async context
  if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
      console.warn("Capture aborted: Main window became invalid before start.");
      return;
  }

  // Store original states for restoration
  const wasMainWindowVisible = isWindowsVisible && mainWindow.getOpacity() > 0;
  // Check controlWindow validity before accessing its properties
  const wasControlWindowVisible = controlWindow && !controlWindow.isDestroyed() && isWindowsVisible && controlWindow.getOpacity() > 0;
  const originalMainWindowOpacity = mainWindowTargetOpacity; // Use the target, not current opacity

  isTemporarilyHiddenForCapture = true; // Set flag
  sendToMainWindow("set-status-message", "Preparing Capture..."); // Update UI

  // Ensure temp directory exists
  try {
      await fs.promises.mkdir(SCREENSHOT_TEMP_DIR, { recursive: true });
  } catch (mkdirError) {
      console.error("Failed to ensure screenshot directory:", mkdirError);
      sendErrorNotification("Failed to prepare for screenshot.", mkdirError);
      isTemporarilyHiddenForCapture = false; // Reset flag on failure
      sendToMainWindow("set-status-message", "Setup Error.");
      return; // Stop the process
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const screenshotPath = path.join(SCREENSHOT_TEMP_DIR, `screenshot-${timestamp}.png`);
  let finalPath = null;
  let restorationDone = false; // Flag to track if restoration happened

  try {
    // --- Hide windows ---
    console.log("Hiding windows for capture...");
    if (mainWindow && !mainWindow.isDestroyed() && wasMainWindowVisible) mainWindow.setOpacity(0);
    if (controlWindow && !controlWindow.isDestroyed() && wasControlWindowVisible) controlWindow.setOpacity(0);
    // Wait a short moment for the OS to process the opacity change
    await new Promise(resolve => setTimeout(resolve, 150));

    // --- Capture ---
    console.log(`Capturing screenshot to: ${screenshotPath}`);
    sendToMainWindow("set-status-message", "Capturing...");

    // Use screenshot-desktop to capture the primary display
    // Refined capture logic for potentially more robust results
    const displays = await screenshot.listDisplays();
    if (!displays || displays.length === 0) {
        throw new Error("No displays found to capture.");
    }
    // Prefer primary display if possible
    const primaryDisplayInfo = screen.getPrimaryDisplay();
    const targetDisplay = displays.find(d => d.id === primaryDisplayInfo.id) || displays[0]; // Fallback to first display
    console.log(`Attempting capture on display ID: ${targetDisplay.id} (${targetDisplay.name || 'N/A'})`);

    await screenshot({ filename: screenshotPath, format: "png", screen: targetDisplay.id });
    finalPath = screenshotPath; // Assume success if screenshot call doesn't throw

    // --- Validate ---
    if (!fs.existsSync(finalPath)) {
      throw new Error(`Screenshot file not found at expected path after capture: ${finalPath}`);
    }
    const stats = await fs.promises.stat(finalPath);
    if (stats.size === 0) {
        await fs.promises.unlink(finalPath).catch(e => console.warn("Couldn't delete empty screenshot file during validation:", e));
        finalPath = null; // Prevent further processing
        throw new Error(`Screenshot file is empty: ${path.basename(screenshotPath)}`);
    }
    console.log(`Screenshot captured successfully: ${path.basename(finalPath)} (${(stats.size / 1024).toFixed(1)} KB)`);

    // --- Restore windows immediately after successful capture & validation ---
    console.log("Restoring windows immediately after capture/validation...");
    const mainTargetOp = isWindowsVisible ? originalMainWindowOpacity : 0;
    const controlTargetOp = isWindowsVisible ? 1.0 : 0;
    if (mainWindow && !mainWindow.isDestroyed()) {
       mainWindow.setOpacity(mainTargetOp);
    }
    if (controlWindow && !controlWindow.isDestroyed()) {
        controlWindow.setOpacity(controlTargetOp);
    }
    restorationDone = true; // Mark restoration as done via the normal path
    console.log(`Windows restored early. Main Opacity: ${mainTargetOp}, Control Opacity: ${controlTargetOp}`);

    // --- Send for OCR (run in background) ---
    // Check window validity *again* right before sending off the task
    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
        // If window closed just now, attempt cleanup
        if (finalPath && fs.existsSync(finalPath)) {
             await fs.promises.unlink(finalPath).catch(e => console.warn("Could not delete file after window closed pre-send:", e));
             console.log(`Cleaned up ${path.basename(finalPath)} as window closed before send.`);
        }
        throw new Error("Window closed before sending screenshot for OCR."); // Will be caught below
    }
    // Don't await this; let it run independently. Errors handled within.
    sendScreenshotFileToServer(finalPath, mainWindow).catch(sendError => {
          // Log errors reported specifically from the sending function if they bubble up
          console.error("Error reported from background sendScreenshotFileToServer:", sendError);
      });

  } catch (captureOrValidationError) {
    // Handle errors during hiding, capture, validation, or pre-send checks
    console.error("Error during screenshot capture or validation phase:", captureOrValidationError);
    sendErrorNotification(`Capture/Validation Error: ${captureOrValidationError?.message || 'Unknown capture error'}`, captureOrValidationError);
    if (mainWindow && !mainWindow.isDestroyed()) {
        // Update status in the UI if possible
        sendToMainWindow("set-status-message", "Capture/Validation Error.");
    }

    // Attempt cleanup if a file path was determined but it failed validation or window closed
    if (finalPath && fs.existsSync(finalPath)) {
       console.log("Attempting cleanup of failed screenshot file from main capture catch block...")
       fs.promises.unlink(finalPath)
         .then(() => console.log("Cleaned up invalid/unsendable screenshot file (main catch)."))
         .catch(delErr => console.error("Error deleting invalid/unsendable screenshot file (main catch):", delErr));
    }

  } finally {
    // This 'finally' block ensures windows are restored *even if* an error occurred
    // *before* the planned early restoration point.
    if (!restorationDone) {
        console.warn("Restoring window visibility from 'finally' block (error occurred before normal restoration)...");
        const mainTargetOp = isWindowsVisible ? originalMainWindowOpacity : 0;
        const controlTargetOp = isWindowsVisible ? 1.0 : 0;
        // Check window validity before attempting restoration in finally
        if (mainWindow && !mainWindow.isDestroyed()) {
           mainWindow.setOpacity(mainTargetOp);
           console.log(` > Main Window Opacity restored via finally: ${mainTargetOp}`);
        } else {
           console.log(" > Main Window was destroyed, cannot restore opacity in finally.");
        }
        if (controlWindow && !controlWindow.isDestroyed()) {
            controlWindow.setOpacity(controlTargetOp);
            console.log(` > Control Window Opacity restored via finally: ${controlTargetOp}`);
        } else {
            console.log(" > Control Window was destroyed, cannot restore opacity in finally.");
        }
    }

    isTemporarilyHiddenForCapture = false; // Reset the flag regardless of outcome
    console.log("Capture process function finished execution.");
  }
}


async function sendScreenshotFileToServer(filePath, targetWindow) {
  // --- Pre-send Checks ---
  // Check target window validity at the very start
  if (!targetWindow || targetWindow.isDestroyed() || !targetWindow.webContents) {
    console.warn(`Window destroyed before attempting to send screenshot file: ${path.basename(filePath)}`);
    // Attempt to clean up the file since it won't be processed
    try {
        if (filePath && fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log(`Cleaned up screenshot file due to closed window before send: ${path.basename(filePath)}`);
        }
    } catch (deleteError) {
        console.error(`Error deleting screenshot file after finding window closed:`, deleteError);
    }
    return; // Exit function, nothing more to do
  }

  let fileStream = null;
  try {
    // Verify file exists and isn't empty *right before* creating the stream
    if (!fs.existsSync(filePath)) {
        console.error(`File ${path.basename(filePath)} does not exist when trying to create stream!`);
        // No file to delete here, just report error
        throw new Error(`Screenshot file missing right before send: ${path.basename(filePath)}`);
    }
    const stats = await fs.promises.stat(filePath);
    if (stats.size === 0) {
        // File exists but is empty - treat as an error and clean up.
        await fs.promises.unlink(filePath).catch(e => console.warn("Could not delete empty file pre-send check:", e));
        throw new Error(`Screenshot file is empty (pre-send check): ${path.basename(filePath)}`);
    }

    // --- Prepare and Send ---
    console.log(`Sending screenshot file for OCR (${(stats.size / 1024).toFixed(1)} KB): ${path.basename(filePath)}`);
    fileStream = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append("image", fileStream, { // Pass options object for FormData
        filename: path.basename(filePath),
        contentType: 'image/png', // Explicitly set content type
        knownLength: stats.size   // Provide size if known
    });


    sendToMainWindow("set-status-message", "Extracting Text..."); // Update UI

    // Make the OCR request using Axios
    const response = await axios.post(OCR_SERVER_URL, formData, {
      headers: {
          ...formData.getHeaders(), // Get boundary headers from FormData
          // Add any other headers if needed, e.g., API keys
      },
      timeout: 30000, // 30 second timeout for OCR server
      maxContentLength: Infinity, // Allow large uploads if necessary
      maxBodyLength: Infinity,
    });

    // --- Process Response ---
    console.log(`OCR Server Response Status for ${path.basename(filePath)}: ${response.status}`);

    // Check window validity *again* after the request completes
    if (targetWindow.isDestroyed() || !targetWindow.webContents) {
      console.warn(`Window destroyed after OCR request completed but before processing response for ${path.basename(filePath)}.`);
      // No need to throw, but we won't send results. Cleanup happens in finally.
      return;
    }

    // Process successful response based on expected server structure
    if (response.data?.success && typeof response.data.text === 'string') {
      console.log("OCR Success.");
      targetWindow.webContents.send("ocr-result", response.data.text); // Send result to renderer
      targetWindow.webContents.send("set-status-message", "Text Captured. Ready (Cmd+Enter)."); // Update UI status
    } else {
      // Handle unsuccessful but valid responses from the server (e.g., { success: false, error: '...' })
      const errorMessage = response.data?.error || "Unknown or invalid format in OCR server response";
      console.error("OCR Server Error Response Structure:", response.data); // Log the actual response
      throw new Error(errorMessage); // Treat as an error to be caught below
    }

  } catch (error) {
    // --- Error Handling ---
    console.error(`Error within sendScreenshotFileToServer for ${path.basename(filePath)}:`, error);

    // Check window validity one last time before sending error info
    if (!targetWindow.isDestroyed() && targetWindow.webContents) {
        let notificationMessage = "OCR processing failed.";
        // Provide more specific feedback based on error type
        let ocrResultPayload = `**OCR Processing Error:**\n${error.message || 'Unknown Error'}`;
        let statusMessage = "OCR Error.";

        // Refined error categorization
        if (error.message && error.message.includes('missing right before send')) {
            notificationMessage = "OCR Error: File disappeared before sending."; statusMessage = "File Error."; ocrResultPayload = `**OCR File Error:**\nFile not found.`;
        } else if (error.message && error.message.includes('empty (pre-send check)')) {
            notificationMessage = "OCR Error: Screenshot file was empty."; statusMessage = "Empty File Error."; ocrResultPayload = `**OCR File Error:**\nScreenshot file was empty.`;
        } else if (error.code === 'ECONNABORTED') { // Axios timeout
            notificationMessage = "OCR request timed out (30s)."; ocrResultPayload = "**OCR Error:**\nRequest Timed Out"; statusMessage = "OCR Timeout.";
        } else if (error.response) { // HTTP error response (4xx, 5xx)
            const status = error.response.status;
            const serverError = error.response.data?.error || error.response.data || `Server responded with Status ${status}`; // Try to get error message
            notificationMessage = `OCR Server Error (${status}): ${serverError}`;
            ocrResultPayload = `**OCR Server Error (${status}):**\n${serverError}`;
            statusMessage = `OCR Error (${status}).`;
            console.error(" > Full Server Error Response:", error.response.data);
        } else if (error.request) { // No response received from server
            notificationMessage = "OCR server did not respond."; ocrResultPayload = "**OCR Error:**\nNo Response From Server"; statusMessage = "OCR No Response.";
        } else if (error.code === 'ENOENT'){ // Filesystem error (less likely here after initial check)
             notificationMessage = "OCR Error: File system error."; statusMessage = "FS Error."; ocrResultPayload = `**OCR File Error:**\n${error.message}`;
        }
        // else: Generic error message is already set based on error.message

        sendErrorNotification(notificationMessage, error, 4000); // Show user notification
        targetWindow.webContents.send("ocr-result", ocrResultPayload); // Send error details to display in UI
        targetWindow.webContents.send("set-status-message", statusMessage); // Update status bar
    } else {
        console.warn(`Window closed before OCR error for ${path.basename(filePath)} could be reported to it.`);
    }
    // Do not re-throw here. Log/notify and let finally handle cleanup.

  } finally {
    // --- Cleanup ---
    // Ensure the file stream is destroyed if it was created
    if (fileStream && !fileStream.destroyed) {
        fileStream.destroy();
        console.log(`File stream for ${path.basename(filePath)} destroyed.`);
    }
    // Always attempt to delete the temporary file
    try {
      // Check existence *before* unlinking to avoid errors if already deleted
      if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`Deleted temporary screenshot: ${path.basename(filePath)} (sendScreenshotFileToServer finally)`);
      } else {
        // This is normal if the file was invalid (empty) and deleted earlier, or if cleanup already happened.
        console.log(`Temporary screenshot already deleted or did not exist at final cleanup: ${path.basename(filePath)}`)
      }
    } catch (deleteError) {
      // Log deletion errors but don't let them crash the app
      console.error(`Error deleting screenshot file ${path.basename(filePath)} in sendScreenshotFileToServer finally:`, deleteError);
    }
  }
}

function triggerGeminiAnalysis() {
    // Check window validity
    if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
         console.warn("AI analysis skipped: Main window invalid.");
         return;
     }
    // Prevent analysis if a capture is still in progress (windows might be hidden/busy)
    if (isTemporarilyHiddenForCapture) {
        console.warn("AI analysis skipped: Screenshot capture/processing is still active.");
        sendErrorNotification("Wait for capture & text extraction to complete", null, 2000);
        return;
    }
    console.log("AI analysis shortcut triggered (Cmd+Enter)... Requesting current OCR text from main window.");
    // Ask the renderer process for the currently held OCR text
    mainWindow.webContents.send("request-ocr-text");
}

async function processGeminiAnalysis(ocrText) {
     // Check window validity at the start of the async operation
     if (!mainWindow || mainWindow.isDestroyed() || !mainWindow.webContents) {
         console.warn("AI analysis stopped: Main window became invalid before processing.");
         return;
     }

    const textToAnalyze = ocrText?.trim(); // Safely trim the received text

    // Handle case where no text was available (e.g., OCR failed or no capture yet)
    if (!textToAnalyze) {
      console.log("No text received from main window for AI analysis. Aborting.");
      sendToMainWindow("show-notification", { type: "warning", message: "No text captured/available. Use Cmd+H first.", duration: 3000 });
      sendToMainWindow("set-status-message", "No Text To Analyze.");
      return;
    }

    console.log(`Sending ${textToAnalyze.length} characters to AI server for analysis: ${AI_SERVER_URL}`);
    sendToMainWindow("set-status-message", "Analyzing with AI..."); // Update UI

    try {
      const payload = { text: textToAnalyze }; // Structure expected by the server
      // Make the AI analysis request
      const response = await axios.post(AI_SERVER_URL, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 90000, // 90 second timeout for potentially long AI responses
      });

      // Check window validity *again* after the request completes
      if (mainWindow.isDestroyed() || !mainWindow.webContents) {
        console.warn("Window destroyed after AI analysis request completed but before processing response.");
        return;
      }

      console.log("AI Server Response Status:", response.status);

      // Process successful response based on expected server structure
      if (response.data?.success && typeof response.data.text === 'string') {
        console.log("AI Analysis Success.");
        mainWindow.webContents.send("gemini-response", response.data.text); // Send result to UI
        mainWindow.webContents.send("set-status-message", "Analysis Complete."); // Update status
      } else {
         // Handle unsuccessful but valid server responses
         const errorMessage = response.data?.error || "Unknown error or invalid format in AI server response";
         console.error("AI Server Error Response Structure:", response.data);
         throw new Error(errorMessage); // Treat as an error
      }

    } catch (error) {
      // --- Error Handling ---
      console.error("Error calling AI analysis server:", error);

      // Check window validity one last time before sending error info
      if (mainWindow.isDestroyed() || !mainWindow.webContents) {
           console.warn("Window closed before AI error could be reported to it.");
           return; // Exit if window is gone
       }

      // Prepare detailed error messages for UI
      let notificationMessage = "AI analysis request failed.";
      let geminiResultPayload = `**AI Network/Server Error:**\n${error.message || 'Unknown Error'}`;
      let statusMessage = "AI Error.";

       // Refine error messages based on type
       if (error.code === 'ECONNABORTED') { // Axios timeout
           notificationMessage = "AI analysis timed out (90s)."; geminiResultPayload = "**AI Error:**\nRequest Timed Out"; statusMessage = "AI Timeout.";
       } else if (error.response) { // HTTP error response
           const status = error.response.status;
           const serverError = error.response.data?.error || error.response.data || `Server responded with Status ${status}`;
           notificationMessage = `AI Server Error (${status}): ${serverError}`; geminiResultPayload = `**AI Server Error (${status}):**\n${serverError}`; statusMessage = `AI Error (${status}).`;
            console.error(" > Full AI Server Error Response:", error.response.data);
       } else if (error.request) { // No response
           notificationMessage = "AI server did not respond."; geminiResultPayload = "**AI Error:**\nNo Response From Server"; statusMessage = "AI No Response.";
       }
       // else: Generic error message is already set

       // Send error feedback to the main window
       sendErrorNotification(notificationMessage, error, 4000);
       mainWindow.webContents.send("gemini-response", geminiResultPayload); // Show error in response area
       mainWindow.webContents.send("set-status-message", statusMessage); // Update status bar
    }
}

// --- Window Movement and Scrolling ---

function moveWindowUnit(deltaX, deltaY) {
  // Ensure both windows are valid before attempting to move
  if (!mainWindow || !controlWindow || mainWindow.isDestroyed() || controlWindow.isDestroyed()) {
      console.warn("Window move skipped: One or both windows invalid.");
      return;
  }
  try {
    const [ctlX, ctlY] = controlWindow.getPosition();
    const [mainX, mainY] = mainWindow.getPosition();

    const newCtlX = ctlX + deltaX;
    const newCtlY = ctlY + deltaY;
    const newMainX = mainX + deltaX;
    const newMainY = mainY + deltaY;

    // Move both windows atomically (or as close as possible)
    // The 'false' argument prevents OS animation, making it snappier
    controlWindow.setPosition(newCtlX, newCtlY, false);
    mainWindow.setPosition(newMainX, newMainY, false);

    // Provide visual feedback in the main window about the movement
    let direction = "Moved"; // Default/fallback
    if (deltaX > 0) direction = "Right";
    else if (deltaX < 0) direction = "Left";
    else if (deltaY > 0) direction = "Down";
    else if (deltaY < 0) direction = "Up";
    sendToMainWindow("movement-indicator", { direction: direction });

  } catch (error) {
    // Catch potential errors during getPosition/setPosition (less likely but possible)
    console.error("Error moving window unit:", error);
  }
}

function scrollMainWindow(direction) {
    // Check if main window is valid and visible before sending scroll command
    if (isWindowsVisible && mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
        console.log(`Sending scroll command to main window: ${direction}`);
        mainWindow.webContents.send("scroll-main-window-content", direction);
    } else {
        console.log(`Scroll command skipped (Window hidden or invalid): ${direction}`);
    }
}

// --- IPC Message Handlers ---

function handleRequestInitialSettings(event) {
   const sender = event.sender;
   // Identify which window sent the request
   const isMainWindowEvent = isEventFromMainWindow(event);
   const isControlWindowEvent = isEventFromControlWindow(event);
   const windowType = isMainWindowEvent ? "Main" : isControlWindowEvent ? "Control" : "Unknown";

   console.log(`Received 'request-initial-settings' from: ${windowType} Window`);

   // Ensure the sender window still exists before replying
   if (sender && !sender.isDestroyed()) {
       // Get the current alwaysOnTop state reliably from a valid window (prefer main)
       const alwaysOnTopState = (mainWindow && !mainWindow.isDestroyed())
                                ? mainWindow.isAlwaysOnTop()
                                : (controlWindow && !controlWindow.isDestroyed()
                                    ? controlWindow.isAlwaysOnTop()
                                    : true); // Default fallback if both somehow invalid

       // Prepare the payload with current states
       const payload = {
           isGhostMode: isGhostMode,
           alwaysOnTop: alwaysOnTopState,
           isVisible: isWindowsVisible,
           currentOpacity: mainWindowTargetOpacity // Send the target opacity
       };

       console.log(` > Sending initial settings data to ${windowType}:`, payload);
       sender.send("initial-settings-data", payload);

       // Send specific UI updates relevant at startup
       sender.send("update-ghost-mode-ui", isGhostMode);
       sender.send("toggle-visibility", { isVisible: isWindowsVisible });

   } else {
       console.warn(`Sender for 'request-initial-settings' is destroyed or invalid (Origin: ${windowType}). Cannot send reply.`);
   }
}

function handleUpdateAlwaysOnTop(event, enable) {
    // Explicitly convert the received value to boolean
    const shouldBeOnTop = Boolean(enable);
    console.log(`Handling 'update-always-on-top' request: Set to ${shouldBeOnTop}`);

    // Determine the appropriate level string for setAlwaysOnTop API
    // 'screen-saver' is typically higher than most standard windows.
    // 'floating' is another common level. Check Electron docs for details.
    const level = shouldBeOnTop ? "screen-saver" : "normal";

    try {
      // Apply the setting to both windows if they exist
      if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.setAlwaysOnTop(shouldBeOnTop, level);
          console.log(` > Main window alwaysOnTop set to ${shouldBeOnTop} (Level: ${level})`);
      }
      if (controlWindow && !controlWindow.isDestroyed()) {
          // Even toolbar windows benefit from explicit setting for consistency
          controlWindow.setAlwaysOnTop(shouldBeOnTop, level);
           console.log(` > Control window alwaysOnTop set to ${shouldBeOnTop} (Level: ${level})`);
      }
    } catch (err) {
      console.error("Error setting Always On Top property:", err);
      sendErrorNotification("Failed to set Always On Top state", err);
    }
}

// --- Utility Functions ---

function sendToAllWindows(channel, ...args) {
  // Helper to send an IPC message to both windows safely
  sendToMainWindow(channel, ...args);
  sendToControlWindow(channel, ...args);
}

function sendToMainWindow(channel, ...args) {
  // Safely send IPC message to main window's renderer process
  if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
    try {
        // console.log(`Sending IPC to Main [${channel}] with args:`, args); // Verbose logging
        mainWindow.webContents.send(channel, ...args);
    } catch(error) {
        // Catch potential errors during the send operation itself
        console.error(`Error sending IPC [${channel}] to Main Window:`, error);
    }
  } else {
      // console.log(`Skipped sending IPC to Main [${channel}]: Window invalid.`); // Verbose logging
  }
}
function sendToControlWindow(channel, ...args) {
    // Safely send IPC message to control window's renderer process
    if (controlWindow?.webContents && !controlWindow.webContents.isDestroyed()) {
        try {
            // console.log(`Sending IPC to Control [${channel}] with args:`, args); // Verbose logging
            controlWindow.webContents.send(channel, ...args);
        } catch (error) {
            console.error(`Error sending IPC [${channel}] to Control Window:`, error);
        }
    } else {
        // console.log(`Skipped sending IPC to Control [${channel}]: Window invalid.`); // Verbose logging
    }
}

function sendInitialStates() {
    // Get reliable alwaysOnTop state at the time of sending
    const alwaysOnTopState = (mainWindow && !mainWindow.isDestroyed())
                           ? mainWindow.isAlwaysOnTop()
                           : (controlWindow && !controlWindow.isDestroyed()
                               ? controlWindow.isAlwaysOnTop()
                               : true); // Fallback
    const payload = {
        isGhostMode: isGhostMode,
        alwaysOnTop: alwaysOnTopState,
        isVisible: isWindowsVisible,
        currentOpacity: mainWindowTargetOpacity
    };
    console.log("Sending initial states payload to all windows:", payload);
    // Send the full initial state bundle
    sendToAllWindows("initial-settings-data", payload);
    // Also send individual state updates for UI elements that depend on them
    sendToAllWindows("update-ghost-mode-ui", isGhostMode);
    sendToAllWindows("toggle-visibility", { isVisible: isWindowsVisible });
}

function updateAllWindowsGhostModeUI() {
  // Send only the ghost mode state update to both windows
  console.log(`Updating Ghost Mode UI in renderers. Is Ghost: ${isGhostMode}`);
  sendToAllWindows("update-ghost-mode-ui", isGhostMode);
}

function sendErrorNotification(message, error = null, duration = 4000) {
    // Central function to log errors and notify the user via the main window's UI
    if (error) {
        // Log detailed error if provided
        console.error(`[Notification Error] ${message}`, error);
    } else {
        console.error(`[Notification Error] ${message}`);
    }
    // Format message for display, include error message if available, truncate if too long
    const displayMessage = `${message}${error ? `: ${error.message}` : ''}`;
    // Send notification only to the main window where notifications are usually displayed
    sendToMainWindow("show-notification", {
        type: "error",
        message: displayMessage.substring(0, 200), // Limit length for display
        duration: duration
    });
}

// Helper functions to check event origin reliably
function isEventFromMainWindow(event) {
    // Check if the event sender matches the main window's webContents
    return mainWindow && !mainWindow.isDestroyed() && event.sender === mainWindow.webContents;
}

function isEventFromControlWindow(event) {
    // Check if the event sender matches the control window's webContents
    return controlWindow && !controlWindow.isDestroyed() && event.sender === controlWindow.webContents;
}

// --- Global Error Handling ---

process.on("uncaughtException", (error, origin) => {
  // Catch errors that slip through standard try/catch blocks
  console.error("<<<<< UNCAUGHT EXCEPTION >>>>>");
  console.error(`Origin: ${origin}`);
  console.error(error);
  console.error("<<<<< /UNCAUGHT EXCEPTION >>>>>");
  // Attempt to notify the user via the main window if possible
  sendErrorNotification(`Critical Error (Uncaught Exception): ${error.message}`, error, 6000);
  // Consider exiting the app on critical errors to prevent unstable state?
  // For example: setTimeout(() => app.quit(), 1000);
});

process.on("unhandledRejection", (reason, promise) => {
  // Catch errors from Promises that don't have a .catch() handler
  console.error("<<<<< UNHANDLED PROMISE REJECTION >>>>>");
  console.error("Reason:", reason); // Can be an Error object or any other value
  // console.error("Promise:", promise); // Can be verbose, uncomment if needed
  console.error("<<<<< /UNHANDLED PROMISE REJECTION >>>>>");
   // Format the reason for notification
   const message = (reason instanceof Error) ? reason.message : String(reason);
   // Attempt to notify the user
   sendErrorNotification(`Background Error (Unhandled Rejection): ${message}`, (reason instanceof Error ? reason : null), 6000);
});