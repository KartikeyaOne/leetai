// This file is still referenced by control.html's BrowserWindow webPreferences,
// but its core functionality (tab switching) has been moved to the
// inline script in control.html for simplicity in this example.
// It could be used for more complex preload tasks if needed later.

console.log("Control Preload: Script executed (currently minimal).");

// Example: If you needed context isolation later, you'd expose IPC here:
// const { contextBridge, ipcRenderer } = require('electron');
// contextBridge.exposeInMainWorld('electronAPI', {
//   send: (channel, data) => ipcRenderer.send(channel, data),
//   on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
// });