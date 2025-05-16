// pages/about.js
import Head from 'next/head';
import {
  LuShieldCheck,
  LuBrainCircuit,
  LuNetwork, // Kept for potential generic use, or could be removed
  LuZap,
  LuEyeOff,
  LuKeyboard,
  LuTarget,
  LuCircleHelp,
  LuTrendingUp, // Kept for potential generic use
  LuGitMerge,   // For Contributing
  LuScrollText, // For License
  LuServer,     // For Self-Hosted Backend / Control
  LuScanText,   // For Screen Capture & OCR
  LuMove,       // For Dynamic Content Display
  LuLaptop,     // For Cross-Platform
  LuSettings2,  // For Tech Stack / Setup
  LuInfo,       // General Info
  LuBox,        // For Tech Stack items
  LuTerminal, // For Code/Setup
  LuShare2,       // For Contributing
  LuBookOpen,     // For License
  LuHeartHandshake, // For Acknowledgements
} from 'react-icons/lu';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import React from 'react';

// Helper component for section titles
const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex flex-col items-center text-center mb-12 md:mb-16">
    {Icon && <Icon className="w-12 h-12 md:w-14 md:h-14 text-cyan-400 mb-4" />}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
      {children}
    </h2>
  </div>
);

// Helper component for feature/principle cards
const InfoCard = ({ icon: Icon, title, description, iconColorClass = "text-cyan-400" }) => (
  <div className="p-6 lg:p-8 border border-gray-700/60 rounded-xl bg-black/40 shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:bg-gray-900/60 transform hover:-translate-y-1">
    {Icon && <Icon className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-5 ${iconColorClass}`} />}
    <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 text-center">{title}</h3>
    <p className="text-gray-400 text-sm lg:text-base leading-relaxed">{description}</p>
  </div>
);


export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-950 to-black text-gray-100 font-sans">
      <Head>
        <title>About LeetAI Assistant | Discreet AI for Developers</title>
        <meta name="description" content="Learn about LeetAI Assistant: a keyboard-driven, discreet desktop app for on-demand AI analysis of on-screen content. Built for efficiency and user control." />
        <meta property="og:title" content="About LeetAI Assistant | Discreet AI for Developers" />
        <meta property="og:description" content="Discover LeetAI Assistant – your stealthy, efficient tool for AI-powered insights. Features, tech stack, and how to get started." />
        {/* <meta property="og:image" content="/og-about-leetai.jpg" />  Consider adding a specific OG image */}
      </Head>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="pt-32 pb-24 lg:pt-48 lg:pb-36 relative overflow-hidden border-b border-gray-800"
          style={{
            background: `radial-gradient(ellipse 50% 40% at top left, rgba(10, 50, 70, 0.4) 0%, transparent 50%),
                         radial-gradient(ellipse 50% 40% at bottom right, rgba(50, 10, 70, 0.3) 0%, transparent 50%),
                         linear-gradient(180deg, rgba(5, 8, 12, 0.9) 0%, rgba(10, 12, 16, 1) 100%)`
          }}
        >
          <div aria-hidden="true" className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-cyan-300">
                About LeetAI Assistant
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-cyan-400 mb-8 font-semibold tracking-tight">
              Discreet, Keyboard-Driven AI for On-Screen Content Analysis.
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              LeetAI Assistant is a desktop application designed for on-demand AI analysis of your screen content. It prioritizes efficiency and minimal intrusion, allowing you to quickly capture, OCR, and submit text for AI insights without disrupting your workflow. It's built to be "invisible" non-focusable, click-through, with visibility toggled by global hotkeys.
            </p>
            <div>
              <Link href="https://github.com/KartikeyaOne/leetai" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-400/40 text-lg transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
                >
                  View on GitHub
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Why LeetAI Assistant? Section */}
        <section className="py-20 lg:py-28 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={LuTarget}>Why LeetAI Assistant?</SectionTitle>
            <p className="text-center text-gray-300 max-w-3xl mx-auto mb-12 md:mb-16 text-base md:text-lg leading-relaxed">
              In a world of distracting UIs, LeetAI Assistant aims to be the opposite. It's for power users, developers, and anyone who needs quick AI insights without context switching or dealing with cumbersome interfaces. Its core principles are:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              <InfoCard
                icon={LuZap}
                title="Efficiency"
                description="Get AI help with minimal keystrokes and without breaking your focus."
              />
              <InfoCard
                icon={LuEyeOff}
                title="Discretion"
                description="Stays out of your way until needed. Designed to be 'invisible' to screen recording software by hiding its own window during capture."
              />
              <InfoCard
                icon={LuServer}
                title="Control"
                description="Users run their own backend server, managing their own API keys and data flow, ensuring privacy and customization."
                iconColorClass="text-green-400"
              />
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20 lg:py-28 bg-gray-950 border-t border-b border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={LuBrainCircuit}>Core Features</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              <InfoCard
                icon={LuShieldCheck}
                title="Stealth Operation"
                description="Runs as a transparent, non-focusable overlay. Clicks pass through. Includes a C++ native module to enhance invisibility to browser-based screen recording."
                iconColorClass="text-green-400"
              />
              <InfoCard
                icon={LuKeyboard}
                title="Keyboard-Centric Design"
                description="All primary interactions are handled via global keyboard shortcuts for maximum efficiency."
              />
              <InfoCard
                icon={LuScanText}
                title="Screen Capture & OCR"
                description="Capture on-screen text content using robust OCR capabilities provided by the self-hosted backend server."
              />
              <InfoCard
                icon={LuBrainCircuit}
                title="AI Analysis"
                description="Submit captured text to a powerful AI (e.g., Google Gemini API) for code explanation, generation, summarization, and problem-solving."
                iconColorClass="text-yellow-400"
              />
              <InfoCard
                icon={LuMove}
                title="Dynamic Content Display"
                description="Move the assistant window and scroll content using shortcuts, all within a fixed-size overlay."
              />
              <InfoCard
                icon={LuServer}
                title="Self-Hosted Backend"
                description="Primarily works with its dedicated, self-hostable backend for OCR/AI, ensuring user control over data and API usage."
              />
              {/* <InfoCard
                icon={LuLaptop}
                title="Cross-Platform (Electron)"
                description="Built with Electron for potential compatibility across Windows, macOS, and Linux."
                iconColorClass="text-purple-400"
              /> */}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20 lg:py-28 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={LuSettings2}>Technology Stack</SectionTitle>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              <div className="p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                <div className="flex items-center mb-3">
                  <LuLaptop className="w-7 h-7 text-cyan-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Client (leetai-client)</h3>
                </div>
                <p className="text-gray-400">Electron, HTML, CSS, JavaScript. Includes a buildable C++ native module for enhanced stealth.</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                <div className="flex items-center mb-3">
                  <LuServer className="w-7 h-7 text-cyan-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">Backend Server (leetai-server)</h3>
                </div>
                <p className="text-gray-400">Node.js, Express.js. Handles OCR and AI API interactions.</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                <div className="flex items-center mb-3">
                  <LuBrainCircuit className="w-7 h-7 text-cyan-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">AI Integration</h3>
                </div>
                <p className="text-gray-400">Via the server, configurable through environment variables. Defaults to Google Gemini API.</p>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                <div className="flex items-center mb-3">
                  <LuScanText className="w-7 h-7 text-cyan-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">OCR Integration</h3>
                </div>
                <p className="text-gray-400">Via the server, configurable. Can use various OCR services (e.g., Google Cloud Vision, Azure Computer Vision).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Overview Section */}
        <section className="py-20 lg:py-28 bg-gray-950 border-t border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={LuTerminal}>Getting Started Overview</SectionTitle>
            <p className="text-center text-gray-300 max-w-3xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
              LeetAI Assistant involves setting up a client application and a self-hosted backend server. Here’s a brief outline:
            </p>
            <div className="max-w-4xl mx-auto space-y-10">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center"><LuInfo className="w-6 h-6 text-cyan-400 mr-3" />Prerequisites</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400 pl-5">
                  <li>Node.js and npm (for both client and server).</li>
                  <li>Build tools for C++ native modules (if building the client's native parts, e.g., windows-build-tools, g++/make, Xcode).</li>
                  <li>API Keys: Your own keys for AI (e.g., Google Gemini) and your chosen OCR service.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center"><LuServer className="w-6 h-6 text-cyan-400 mr-3" />1. Setup Backend Server (leetai-server)</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-400 pl-5">
                  <li>Navigate to `leetai-server` directory.</li>
                  <li>Install dependencies: `npm install`.</li>
                  <li>Copy `.env.example` to `.env` and fill in your API keys and configurations.</li>
                  <li>Run the server: `npm run dev` (typically on `http://localhost:5000`).</li>
                </ol>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center"><LuLaptop className="w-6 h-6 text-cyan-400 mr-3" />2. Setup & Run Client (leetai-client)</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-400 pl-5">
                  <li>Navigate to `leetai-client` directory.</li>
                  <li>Install dependencies: `npm install` (may build native modules).</li>
                  <li>(Optional) Modify `config.json` for custom server URLs or appearance settings.</li>
                  <li>Run the client: `npm start`.</li>
                </ol>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link href="https://github.com/KartikeyaOne/leetai#getting-started" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg text-md"
                >
                  View Full Setup Guide on GitHub
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Usage (Keyboard Shortcuts) Section */}
        <section className="py-20 lg:py-28 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={LuKeyboard}>Usage (Keyboard Shortcuts)</SectionTitle>
            <p className="text-center text-gray-300 max-w-3xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
              All primary interactions with LeetAI Assistant are performed via global keyboard shortcuts:
            </p>
            <div className="max-w-2xl mx-auto space-y-3">
              {[
                { shortcut: "Cmd/Ctrl + Alt + Up/Down", action: "Scroll the content within the assistant window." },
                { shortcut: "Cmd/Ctrl + H", action: "Capture screen. Sends to server for OCR, displays text." },
                { shortcut: "Cmd/Ctrl + Return", action: "Submit displayed text for AI analysis. AI response replaces text." },
                { shortcut: "Cmd/Ctrl + B", action: "Toggle visibility (show/hide) of the assistant window." },
                { shortcut: "Alt + Arrow Keys", action: "Move the assistant window around the screen." },
                { shortcut: "Cmd/Ctrl + Q", action: "Quit the application." },
              ].map(item => (
                <div key={item.shortcut} className="flex justify-between items-center p-3 bg-gray-900/50 border border-gray-700/50 rounded-md">
                  <span className="font-mono text-cyan-400 text-sm">{item.shortcut}</span>
                  <span className="text-gray-300 text-sm text-right">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community & Project Info Section */}
        <section className="py-20 lg:py-28 bg-gray-950 border-t border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={LuInfo}>Community & Project Information</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 text-center">
              <InfoCard
                icon={LuShare2}
                title="Contributing"
                description="Contributions are highly welcome! Whether it's bug reports, feature requests, documentation, or code, please check our GitHub repository to get started."
                iconColorClass="text-green-400"
              />
              <InfoCard
                icon={LuBookOpen}
                title="License"
                description="This project is licensed under the GNU General Public License v2.0. See the LICENSE file on GitHub for the full text."
              />
              <InfoCard
                icon={LuHeartHandshake}
                title="Acknowledgements"
                description="Special thanks to Electron, Node.js, Express.js, Axios, Highlight.js, and all developers of the various npm packages that make this project possible!"
                iconColorClass="text-yellow-400"
              />
            </div>
            <div className="text-center mt-12">
               <Link href="https://github.com/KartikeyaOne/leetai/blob/main/CONTRIBUTING.md" passHref legacyBehavior> 
                 {/* Assuming you might create a CONTRIBUTING.md, else link to repo */}
                 <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-2"
                 >
                    Learn How to Contribute
                 </a>
               </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section - Revised */}
        <section id="faq" className="py-20 lg:py-28 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={LuCircleHelp}>Frequently Asked Questions</SectionTitle>
            <div className="max-w-4xl mx-auto space-y-4">
              {[
                {
                  q: "What's the main purpose of LeetAI Assistant?",
                  a: "To provide discreet, keyboard-driven, on-demand AI analysis and context for on-screen content. It focuses on efficiency and minimal user intrusion, allowing quick capture, OCR, and AI insights without breaking workflow."
                },
                {
                  q: "How does 'Stealth Operation' work?",
                  a: "LeetAI runs as a transparent, non-focusable overlay where clicks pass through to underlying applications. It includes a custom C++ native module to help it remain hidden from browser-based screen recording systems. Its own window is also hidden during its screen capture process."
                },
                {
                  q: "Do I need my own API keys?",
                  a: "Yes. The self-hosted backend requires your API keys for AI analysis (e.g., Google Gemini API Key) and for the OCR service you configure (e.g., Google Cloud Vision API Key). This gives you full control over your API usage and data."
                },
                {
                  q: "What is the 'Self-Hosted Backend'?",
                  a: "LeetAI Assistant uses a Node.js and Express.js server component that you host yourself. This server handles all OCR and AI API calls, processes requests from the client, and returns results. This architecture ensures your data and API keys remain under your control."
                },
                {
                  q: "What technologies are used in LeetAI?",
                  a: "The client is an Electron application built with HTML, CSS, and JavaScript, also featuring a C++ native module. The backend server uses Node.js and Express.js. It integrates with configurable AI services (defaulting to Google Gemini API) and various OCR services."
                },
                {
                  q: "Is it difficult to set up?",
                  a: "Setup involves configuring and running both the Node.js backend server and the Electron client. This requires familiarity with Node.js, npm, and managing environment variables for API keys. The README.md on GitHub provides detailed setup instructions."
                },
                {
                  q: "How can I contribute to the project?",
                  a: "Contributions are highly encouraged! You can contribute through bug reports, feature requests, documentation improvements, or code contributions. Please refer to our GitHub repository for guidelines and to open an issue or submit a pull request."
                }
              ].map((item, index) => (
                <details key={index} className="group border border-gray-700/70 rounded-lg overflow-hidden bg-black/30 transition-colors duration-300 hover:border-gray-600/80 [&_summary]:hover:bg-gray-800/40">
                  <summary className="flex items-center justify-between p-4 lg:p-5 cursor-pointer list-none transition-colors duration-200">
                    <span className="font-medium text-base lg:text-lg text-gray-100 group-hover:text-white">{item.q}</span>
                    <div className="transform transition-transform duration-300 group-open:rotate-180 ml-3 flex-shrink-0">
                      <LuCircleHelp className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 group-hover:text-cyan-400" />
                    </div>
                  </summary>
                  <div className="p-4 lg:p-5 border-t border-gray-700/50 bg-gray-900/40">
                    <p
                      className="text-gray-300 text-sm lg:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.a.replace(/\n/g, '<br />') }}
                    />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}