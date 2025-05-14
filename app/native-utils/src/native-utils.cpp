// Define Windows version macros first - target Windows 7 (0x0601) or later
#define _WIN32_WINNT 0x0601
#define WINVER 0x0601

// Include headers in the right order
#include <napi.h>
#include <windows.h>

// WDA_EXCLUDEFROMCAPTURE was introduced in Windows 10 2004
#define WDA_EXCLUDEFROMCAPTURE 0x00000011
// WDA_MONITOR is the older value (will be used on Windows 7-8.1)
#define WDA_MONITOR 0x00000001

Napi::Value SetWindowExcludeFromCapture(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // Check arguments
  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsNumber() || !info[1].IsBoolean()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Get the window handle from the first argument
  HWND hwnd = (HWND)info[0].As<Napi::Number>().Int64Value();
  
  // Get boolean value
  bool exclude = info[1].As<Napi::Boolean>().Value();
  
  // Set the window display affinity
  BOOL result = SetWindowDisplayAffinity(
    hwnd,
    exclude ? WDA_EXCLUDEFROMCAPTURE : 0
  );
  
  // Return success or failure
  return Napi::Boolean::New(env, result == TRUE);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("setWindowExcludeFromCapture", 
    Napi::Function::New(env, SetWindowExcludeFromCapture));
  return exports;
}

NODE_API_MODULE(native_utils, Init)
