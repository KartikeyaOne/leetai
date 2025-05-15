const { ipcRenderer, contextBridge } = require("electron"); // Added contextBridge for completeness if needed later

let feedbackIndicatorTimeout = null;

window.addEventListener("DOMContentLoaded", () => {
  console.log("Preload: DOM Ready.");
  try {
    createFeedbackIndicators();
    initializePreloadIpcListeners();
    console.log("Preload: Initialized.");
  } catch (error) {
    console.error("Preload initialization error:", error);
  }
});

function createFeedbackIndicators() {
    if (!document.body) { requestAnimationFrame(createFeedbackIndicators); return; }
    const fragment = document.createDocumentFragment();
    // Movement Feedback
    if (!document.getElementById("feedback-indicator")) {
        const el = document.createElement("div"); el.id = "feedback-indicator";
        el.style.cssText = `position: fixed; bottom: 12px; right: 12px; padding: 6px 12px; border-radius: 5px; background: rgba(22, 27, 34, 0.85); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.1); color: #E6EDF3; font-size: 12px; font-family: sans-serif; opacity: 0; transition: opacity 0.3s ease-out; pointer-events: none; z-index: 9999; text-align: center; min-width: 60px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);`;
        fragment.appendChild(el);
    }
    // Status Dot
    if (!document.getElementById("status-indicator")) {
        const el = document.createElement("div"); el.id = "status-indicator";
        el.style.cssText = `position: fixed; top: 12px; left: 12px; width: 10px; height: 10px; border-radius: 50%; background: #238636; opacity: 0; transition: opacity 0.3s ease, background-color 0.3s ease; pointer-events: none; z-index: 9999; box-shadow: 0 0 6px rgba(0,0,0,0.4);`;
        fragment.appendChild(el);
    }
    if (fragment.hasChildNodes()) document.body.appendChild(fragment);
}

function initializePreloadIpcListeners() {
  ipcRenderer.on("movement-indicator", (event, { direction }) => showMovementIndicator(direction));
  ipcRenderer.on("set-status-message", (event, message) => {
     const statusEl = document.getElementById("status-indicator"); if (!statusEl) return;
     const msg = (message || "").toLowerCase(); let bg = '#238636'; let show = false;
     if (msg.includes('analyzing') || msg.includes('extracting') || msg.includes('processing')) { bg = '#BB8009'; show = true; }
     else if (msg.includes('error') || msg.includes('failed')) { bg = '#CF222E'; show = true; }
     else if (msg.includes('complete') || msg.includes('ready') || msg.includes('captured')) { bg = '#238636'; show = false;}
     if(!message?.trim()){show = false;}
     statusEl.style.backgroundColor = bg; statusEl.style.opacity = show ? '1' : '0';
  });

  // Listen for scroll indicator requests coming FROM the renderer (index.html)
  // This is if index.html wants to trigger feedback after its internal scroll
  ipcRenderer.on("show-scroll-indicator-from-renderer", (event, direction) => {
    showScrollIndicator(direction);
  });

  // Also, listen for scroll commands coming from main.js (if we want feedback for those too)
  // This is a bit redundant if the renderer also sends a message, choose one or ensure they don't double-trigger.
  // For now, let's assume the renderer will tell preload to show feedback.
  // If main.js scroll commands should *also* directly trigger feedback without renderer intervention:
  // ipcRenderer.on("scroll-main-window-content", (event, direction) => showScrollIndicator(direction));

  console.log("Preload: IPC listeners ready.");
}

function showFeedbackIndicator(message) {
  let el = document.getElementById("feedback-indicator"); if (!el) { createFeedbackIndicators(); el = document.getElementById("feedback-indicator"); if (!el) return; };
  el.textContent = message; el.style.opacity = "1"; clearTimeout(feedbackIndicatorTimeout);
  feedbackIndicatorTimeout = setTimeout(() => { if(el) el.style.opacity = "0"; }, 700);
}
function showMovementIndicator(dir) { showFeedbackIndicator(`Move ${dir}`); }
function showScrollIndicator(dir) { showFeedbackIndicator(`Scroll ${dir === 'up' ? 'Up' : 'Down'}`); }


console.log("Preload: Script finished.");