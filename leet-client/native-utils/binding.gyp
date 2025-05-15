{
  "targets": [
    {
      "target_name": "native_utils",
      "sources": [ "src/native-utils.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS",
        "NODE_ADDON_API_DISABLE_DEPRECATED"
      ],
      "conditions": [
        ["OS=='win'", {
          "libraries": [
            "User32.lib" 
          ]
        }]
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": "0" 
        }
      }
    }
  ]
}