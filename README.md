# LeetAI Assistant

LeetAI Assistant is a discreet, keyboard-driven desktop application designed to provide on-demand AI analysis and context for on-screen content. It operates with a focus on efficiency and minimal intrusion, allowing users to quickly capture screen regions, extract text via OCR, and submit it for AI-powered insights without breaking their workflow.

The application is designed to be "invisible" during normal operation – it does not take focus, clicks pass through it, and its visibility is toggled via global keyboard shortcuts.

## Core Features

*   **Stealth Operation:** Runs as a transparent, non-focusable overlay. Clicks pass through to underlying applications.
*   **Keyboard-Centric Design:** All primary interactions are handled via global keyboard shortcuts for maximum efficiency.
*   **Screen Capture & OCR:** Capture on-screen text content using robust OCR capabilities.
*   **AI Analysis:** Submit captured text to a powerful AI model (defaulting to Google Gemini via API) for:
    *   Code explanation and generation
    *   Text summarization
    *   Problem-solving assistance
    *   And more, depending on the AI's capabilities.
*   **Dynamic Content Display:** The assistant window dynamically adjusts its height to fit the AI's response, with keyboard-driven scrolling for longer content.
*   **Customizable Backend:** Users can configure the client to use their own API keys for AI and OCR services, or point to a self-hosted instance of the LeetAI backend server.
*   **Cross-Platform (Electron):** Built with Electron for potential compatibility across Windows, macOS, and Linux.

## Why LeetAI Assistant?

In a world of distracting UIs, LeetAI Assistant aims to be the opposite. It's for power users, developers, and anyone who needs quick AI insights without context switching or dealing with cumbersome interfaces. Its core principles are:

*   **Efficiency:** Get AI help with minimal keystrokes.
*   **Discretion:** Stays out of your way until you need it; designed to be "invisible" to screen recording software (by hiding its own window during capture).
*   **Control:** Users manage their own API costs by providing their own keys, or can self-host the backend for full data privacy.

## Tech Stack

*   **Client:** Electron, HTML, CSS, JavaScript
*   **Backend Server** Javascript (express), with integrations for OCR and AI model APIs.
*   **AI Integration:** Configurable, defaults to Google Gemini API.
*   **OCR Integration:** Configurable, can use cloud OCR services or a self-hosted solution.

## Getting Started

### Prerequisites

*   Node.js and npm (for building/running the client from source).
*   Python 3.x and pip (if you intend to run the self-hosted backend server).
*   API Keys:
    *   **Google Gemini API Key:** Required for AI analysis. Obtainable from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Cloud OCR API Key:** If you don't use the self-hosted OCR server and want to use a cloud OCR provider directly from the client (e.g., Google Cloud Vision API).
 in the root of the `leetai-client` directory.

