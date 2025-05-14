const path = require('path');
const bindings = require('bindings');

try {
  // Try to load the native module
  const nativeUtils = bindings('native_utils');
  
  module.exports = nativeUtils;
} catch (err) {
  // Fallback if the native module fails to load
  console.error('Failed to load native utils module:', err);
  
  // Provide a dummy implementation
  module.exports = {
    setWindowExcludeFromCapture: function(hwnd, exclude) {
      console.warn('Native setWindowExcludeFromCapture not available');
      return false;
    }
  };
}
