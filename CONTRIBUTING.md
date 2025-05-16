# Contributing to LeetAI Assistant

Thank you for your interest in contributing to LeetAI Assistant. This monorepo contains both the desktop client (`leetai-client`) and the backend server (`leetai-server`). We welcome contributions in the form of code, documentation, issue reporting, and feature suggestions.

## Repository Structure

leetai/
├── leetai-client/ # Electron-based desktop application
├── leetai-server/ # Node.js/Express backend server
├── LICENSE
├── README.md
├── CONTRIBUTING.md

bash
Copy
Edit

## Getting Started

### 1. Fork and Clone the Repository

```bash
git clone https://github.com/KartikeyaOne/leetai.git
cd leetai
2. Install Dependencies
Backend Setup (leetai-server)
bash
Copy
Edit
cd leetai-server
npm install
cp .env.example .env
# Fill in your API keys and configuration in the .env file
npm run dev
The backend server will start at http://localhost:5000 by default.

Client Setup (leetai-client)
In a separate terminal window:

bash
Copy
Edit
cd ../leetai-client
npm install
npm start
The client will launch the Electron application. You can control its behavior with keyboard shortcuts (see the README for usage details).

Ways to Contribute
Bug Reports
If you find a bug, please open an issue and include the following:

Steps to reproduce the problem

Expected and actual behavior

Environment details (operating system, Node.js version)

Any relevant logs, screenshots, or screen recordings

Feature Requests
If you have an idea for a feature, please open an issue with a clear description. Include:

The problem the feature solves

A proposed solution or design

Alternatives you've considered, if applicable

Code Contributions
We welcome pull requests for bug fixes, new features, refactoring, and documentation updates.

Workflow
Create a new branch:

bash
Copy
Edit
git checkout -b feature/your-feature-name
Make changes in the appropriate directory:

leetai-client/ for frontend (Electron)

leetai-server/ for backend (Express)

Commit your changes using conventional commit format.

Push to your fork and open a pull request to the main branch.

Environment Configuration
Server environment: Configure your .env file in leetai-server/ with required API keys and settings.

Client configuration: You may optionally create a config.json file in leetai-client/ to override backend URLs and appearance settings.

Example config.json:

json
Copy
Edit
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
Coding Standards
Use const and let (do not use var)

Follow existing indentation and formatting styles

Keep UI and user interaction minimal and efficient

Use descriptive variable and function names

Add comments where logic may not be immediately obvious

Commit Guidelines
We follow the Conventional Commits specification:

feat(client): Add a new feature to the client

fix(server): Fix a bug in the server

docs: Update or improve documentation

refactor: Code cleanup or reorganization

test: Add or update tests

chore: Maintenance changes (build tools, dependencies, etc.)

Example:

pgsql
Copy
Edit
feat(client): add shortcut to move overlay window
fix(server): handle empty OCR responses correctly
Pull Request Checklist
Before submitting a pull request:

Test your code changes thoroughly

Make sure the client and server both start without errors

Keep the pull request focused on a single change

Use clear, descriptive commit messages

Reference related issues in the pull request description (e.g., Closes #42)

License
By contributing to this repository, you agree that your code will be licensed under the GNU General Public License v2.0.

If you have questions about contributing, feel free to open a discussion or issue.
