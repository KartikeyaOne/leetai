# LeetAI Assistant

[![LeetAI Assistant Logo]([https://via.placeholder.com/600x200.png?text=LeetAI+Assistant+Logo+Here)](https://github.com/KartikeyaOne/leetai/blob/main/leet-client/assets/leetailogo.png)](https://github.com/KartikeyaOne/leetai) 
<!-- Replace the placeholder.com URL above with a direct link to your logo/banner image if you have one -->

LeetAI Assistant is a discreet, keyboard-driven desktop application designed to provide on-demand AI analysis and context for on-screen content. It operates with a focus on efficiency and minimal intrusion, allowing users to quickly capture screen regions, extract text via OCR, and submit it for AI-powered insights without breaking their workflow.

The application is designed to be "invisible" during normal operation – it does not take focus, clicks pass through it, and its visibility is toggled via global keyboard shortcuts.

**Repository:** [https://github.com/KartikeyaOne/leetai](https://github.com/KartikeyaOne/leetai)

## Core Features

*   **Stealth Operation:** Runs as a transparent, non-focusable overlay. Clicks pass through to underlying applications. Includes a custom C++ native module to further enhance its ability to remain hidden from browser-based screen recording systems.
*   **Keyboard-Centric Design:** All primary interactions are handled via global keyboard shortcuts for maximum efficiency.
*   **Screen Capture & OCR:** Capture on-screen text content using robust OCR capabilities provided by the backend server.
*   **AI Analysis:** Submit captured text to a powerful AI model (via the backend server, defaulting to Google Gemini API) for:
    *   Code explanation and generation
    *   Text summarization
    *   Problem-solving assistance
    *   And more, depending on the AI's capabilities.
*   **Dynamic Content Display:** The content height and width are fixed, but you can move the content around and even scroll up and down the content using shortcut keys.
*   **Self-Hosted Backend:** Primarily designed to work with its dedicated, self-hostable backend server for OCR and AI processing, ensuring user control over data and API usage.
*   **Cross-Platform (Electron):** Built with Electron for potential compatibility across Windows, macOS, and Linux.

## Why LeetAI Assistant?

In a world of distracting UIs, LeetAI Assistant aims to be the opposite. It's for power users, developers, and anyone who needs quick AI insights without context switching or dealing with cumbersome interfaces. Its core principles are:

*   **Efficiency:** Get AI help with minimal keystrokes.
*   **Discretion:** Stays out of your way until you need it; designed to be "invisible" to screen recording software (by hiding its own window during capture).
*   **Control:** Users run their own backend server, managing their own API keys and data flow.

## Tech Stack

*   **Client (`leetai-client` directory):** Electron, HTML, CSS, JavaScript.
    *   *(C++ native module, buildable part)*
*   **Backend Server (`leetai-server` directory):** Node.js, Express.js.
*   **AI Integration (via Server):** Configurable through server environment variables, defaults to Google Gemini API.
*   **OCR Integration (via Server):** Configurable through server environment variables, capable of using various OCR services.

## Getting Started

This project consists of two main parts: the `leetai-client` (Electron application) and the `leetai-server` (Node.js/Express backend). You'll need to set up both.

### Prerequisites

*   **Node.js and npm:** Required for both the client and the server. Download from [nodejs.org](https://nodejs.org/).
*   **(For Client, if building native modules):** Build tools for C++ native modules (e.g., `windows-build-tools` on Windows, `g++`/`make` on Linux, Xcode Command Line Tools on macOS).
*   **API Keys:** You will need to acquire your own API keys for the services the backend server will use:
    *   **Google Gemini API Key:** For AI analysis. Obtainable from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **OCR Service API Key:** The server is designed to be flexible. You'll need an API key for whichever OCR service you configure it to use (e.g., Google Cloud Vision, Azure Computer Vision, etc.).

### 1. Setup the Backend Server (`leetai-server`)

1.  **Navigate to the server directory:**
    Assuming you have cloned the main `leetai` repository:
    ```bash
    cd leetai-server 
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    *   Locate the `.env.example` (or similar, e.g., `sample.env`) file in the `leetai-server` directory.
    *   Make a copy of this file and rename it to `.env`.
    *   Open the `.env copy` file and fill in your API keys and any other required configuration values. For example:
        ```env
        PORT=5000
        GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
        OCR_API_KEY="YOUR_OCR_SERVICE_API_KEY_HERE"
        # ... any other server-specific configurations ...
        ```
    *   Refer to the server's specific documentation (if any within its directory) for details on all environment variables.

4.  **Run the Server (Development Mode):**
    ```bash
    npm run dev
    ```
    This should start the backend server, typically on `http://localhost:5000` (or as configured in your `.env`). Keep this terminal window running.

### 2. Setup and Run the Client (`leetai-client`)

1.  **Navigate to the client directory:**
    Open a **new terminal window/tab**. From the root of the `leetai` repository:
    ```bash
    cd leetai-client
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *(This might also build any native C++ modules if your project uses them and they are configured in `package.json`.)*

3.  **(Under Development) Client Configuration (`config.json`):**
    The client is primarily designed to communicate with the `leetai-server`. If you need to adjust client-specific settings like default window opacity or the URL of your backend server (if it's not running on `http://127.0.0.1:5000`), you can create/modify a `config.json` file in the `leetai-client` root directory.

    Example `config.json` (if needed):
    ```json
    {
      "backendServer": {
        "ocrUrl": "http://127.0.0.1:5000/ocr",
        "aiUrl": "http://127.0.0.1:5000/gemini_analyze" 
      },
      "appearance": {
          "mainWindowOpacity": 0.8,
          "maxMainWindowHeightPercentage": 0.85
      }
    }
    ```
    By default, the client's `main.js` should have these URLs hardcoded to connect to the local server. This `config.json` provides an override mechanism.

4.  **Run the Client Application:**
    ```bash
    npm start
    ```
    The LeetAI Assistant window should appear (or be hidden, toggle with `Cmd/Ctrl + B`).

## Usage (Keyboard Shortcuts)

All interactions with LeetAI Assistant are performed via global keyboard shortcuts:

*   **`Cmd/Ctrl + Alt + Up/Down`**: Scroll the content within the assistant window.
*   **`Cmd/Ctrl + H`**: Capture the screen. The captured screen content will be sent to your self-hosted server for OCR, and the extracted text will be displayed in the assistant.
*   **`Cmd/Ctrl + Return`**: Submit the currently captured/displayed text to your self-hosted server for AI analysis. The AI's response will replace the captured text in the assistant window.
*   **`Cmd/Ctrl + B`**: Toggle the visibility (show/hide) of the assistant window.
*   **`Alt + Arrow Keys`**: Move the assistant window around the screen.
*   **`Cmd/Ctrl + Q`**: Quit the application.

## Contributing

Contributions are highly welcome! Whether it's bug reports, feature requests, documentation improvements, or code contributions, please feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/KartikeyaOne/leetai).


## License

This project is licensed under the **GNU General Public License v2.0**. See the [LICENSE](./LICENSE) file for the full license text.

## Acknowledgements

*   [Electron](https://www.electronjs.org/)
*   [Node.js](https://nodejs.org/)
*   [Express.js](https://expressjs.com/) (for the backend server)
*   [Axios](https://axios-http.com/)
*   [Highlight.js](https://highlightjs.org/)
*   And all the developers of the various npm packages that make this project possible!
