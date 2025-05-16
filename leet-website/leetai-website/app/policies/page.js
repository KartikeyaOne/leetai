// app/policies/PoliciesClientPage.js
"use client"; // THIS COMPONENT IS A CLIENT COMPONENT

import React, { useState, useEffect, useRef } from 'react';
import {
  LuFileText,
  LuScrollText,
  LuShieldCheck,
  LuUserCog,
  LuGitMerge,
  LuServer,
  LuTerminal, // Using LuTerminal as it's often more visually distinct
  LuTriangleAlert,
  LuInfo,
  LuDot,
} from 'react-icons/lu';
import { clsx } from 'clsx';
import Header from '../../components/Header'; // Adjust path if needed
import Footer from '../../components/Footer'; // Adjust path if needed

const policySections = [
  { id: 'project-overview', title: 'Project Overview', icon: LuInfo },
  { id: 'license', title: 'License (GPL v2.0)', icon: LuScrollText },
  { id: 'responsible-use', title: 'Responsible Use & Disclaimer', icon: LuShieldCheck },
  { id: 'contributing', title: 'Contributing to LeetAI', icon: LuGitMerge },
  { id: 'setup-note', title: 'Setup & Configuration', icon: LuTerminal },
];

const githubRepoUrl = "https://github.com/KartikeyaOne/leetai";
const licenseUrl = `${githubRepoUrl}/blob/main/LICENSE`;
const contributingUrl = `${githubRepoUrl}/blob/main/CONTRIBUTING.md`;

// Helper component for each policy section
const PolicySection = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="mb-16 lg:mb-20 scroll-mt-28">
    <div className="flex items-center mb-6 lg:mb-8">
      {Icon && <Icon className="w-8 h-8 md:w-9 md:h-9 text-cyan-400 mr-4 flex-shrink-0" />}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{title}</h2>
    </div>
    <div className="prose prose-invert prose-lg max-w-none
                    prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-ul:text-gray-400 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1
                    prose-ol:text-gray-400 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1
                    prose-strong:text-cyan-300 prose-headings:text-white
                    prose-a:text-cyan-400 prose-a:hover:text-cyan-300 prose-a:underline">
      {children}
    </div>
  </section>
);

export default function PoliciesClientPage() {
  const [activeSection, setActiveSection] = useState(policySections[0]?.id || '');
  const sectionRefs = useRef({});
  const sidebarRef = useRef(null);
  const STICKY_HEADER_HEIGHT_REM = 6;

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const getRootFontSize = () => {
      if (typeof window !== 'undefined') {
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
      }
      return 16;
    };

    const rootFontSizePx = getRootFontSize();
    const topMarginPx = STICKY_HEADER_HEIGHT_REM * rootFontSizePx;

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
           if (entry.boundingClientRect.top <= topMarginPx + 100) {
             setActiveSection(entry.target.id);
           }
        }
      });
    };

    const observerOptions = {
      rootMargin: `-${topMarginPx}px 0px -40% 0px`,
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentSectionRefs = {};

    policySections.forEach(section => {
      const el = document.getElementById(section.id);
      if (el) {
        currentSectionRefs[section.id] = el;
        observer.observe(el);
      }
    });
    sectionRefs.current = currentSectionRefs;

    return () => {
      Object.values(currentSectionRefs).forEach(el => {
        if (el) observer.unobserve(el);
      });
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    // This outer div would typically be in page.js or layout.js
    // If this component is the direct child of page.js,
    // and page.js only returns <PoliciesClientPage />,
    // then this div becomes the main page wrapper.
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-950 to-black text-gray-100 font-sans">
      <Header /> {/* HEADER ADDED HERE */}

      <main className="flex-grow pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16 lg:mb-24">
            <LuFileText className="w-16 h-16 mx-auto mb-6 text-cyan-500" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tighter">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-cyan-400">
                Policies & Guidelines
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Navigate our clear guidelines on using LeetAI Assistant, its open-source license, and community contributions.
            </p>
          </div>

          {/* Main content layout with sidebar */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Sticky Sidebar Navigation */}
            <aside
              ref={sidebarRef}
              className="lg:w-1/4 xl:w-1/5 lg:sticky lg:self-start transition-all duration-300 ease-in-out"
              style={{ top: `${(STICKY_HEADER_HEIGHT_REM + 1) * 16}px` }}
            >
              <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700/60 shadow-xl backdrop-blur-md">
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
                  On this page
                </h3>
                <nav>
                  <ul className="space-y-1">
                    {policySections.map((section) => (
                      <li key={section.id}>
                        <button
                          onClick={() => handleScrollToSection(section.id)}
                          className={clsx(
                            "w-full text-left px-4 py-2.5 rounded-md transition-all duration-200 ease-in-out flex items-center group focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:ring-offset-2 focus:ring-offset-gray-900",
                            activeSection === section.id
                              ? "bg-cyan-600/20 text-cyan-300 font-semibold shadow-inner"
                              : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/40"
                          )}
                        >
                          <span className={clsx(
                            "mr-3 h-2 w-2 rounded-full transition-all duration-200 ease-in-out",
                             activeSection === section.id ? "bg-cyan-400 scale-125" : "bg-gray-600 group-hover:bg-gray-400"
                          )}></span>
                          {section.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Policy Sections Content */}
            <div className="lg:w-3/4 xl:w-4/5 space-y-12 lg:space-y-16">
            <PolicySection id="project-overview" title="Project Overview" icon={LuInfo}>
                <p>LeetAI Assistant is an open-source, keyboard-driven desktop application designed for on-demand AI analysis of on-screen content. It is intended for power users and developers seeking efficiency and control.</p>
                <p><strong>Key Aspects:</strong></p>
                <ul>
                   <li><span className="font-semibold text-cyan-300">Self-Hosted:</span> Users set up and run their own backend server, managing their API keys and data flow.</li>
                   <li><span className="font-semibold text-cyan-300">Open Source:</span> The project code is publicly available on GitHub, encouraging community contributions and transparency.</li>
                   <li><span className="font-semibold text-cyan-300">User Control:</span> You are responsible for acquiring necessary API keys (e.g., Google Gemini, OCR services) and configuring the backend.</li>
                </ul>
                <p className="mt-4">
                  This model ensures you have full control over your data, API usage, and the operational aspects of the assistant.
                </p>
              </PolicySection>

              <PolicySection id="license" title="License (GNU GPL v2.0)" icon={LuScrollText}>
                 <p>LeetAI Assistant is licensed under the <span className="font-semibold text-white">GNU General Public License v2.0 (GPL-2.0)</span>.</p>
                 <p>This license grants you certain freedoms, including:</p>
                 <ul>
                   <li>The freedom to run the program for any purpose.</li>
                   <li>The freedom to study how the program works and change it to make it do what you wish.</li>
                   <li>The freedom to redistribute copies.</li>
                   <li>The freedom to distribute copies of your modified versions to others.</li>
                 </ul>
                 <p className="mt-4">
                   It also comes with certain obligations, particularly regarding the distribution of modified versions (they must also be licensed under the GPL).
                   Please review the full license text for complete details.
                 </p>
                 <a href={licenseUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                     View Full License on GitHub
                 </a>
              </PolicySection>

              <PolicySection id="responsible-use" title="Responsible Use & Disclaimer" icon={LuShieldCheck}>
                 <p>LeetAI Assistant is a powerful tool designed to aid in understanding and analyzing on-screen content. While it aims for discretion, users bear full responsibility for its use.</p>
                 <div className="my-6 p-4 border-l-4 border-yellow-500 bg-yellow-900/20 rounded-r-md">
                    <h3 className="text-xl font-semibold text-yellow-300 mb-2 flex items-center"><LuTriangleAlert className="w-6 h-6 mr-2"/>Important Considerations:</h3>
                    <ul className="list-disc list-inside pl-4 space-y-1.5 text-yellow-200/95">
                       <li><strong>Academic Integrity & Testing Policies:</strong> Using LeetAI Assistant (or any similar tool) during exams, interviews, or any situation where such assistance is prohibited by academic integrity rules or terms of service is strongly discouraged and is done at your own risk. Such use may lead to severe consequences.</li>
                       <li><strong>Ethical Use:</strong> The tool is intended for learning, productivity, and understanding. Misusing it to deceive or gain unfair advantages in prohibited scenarios is unethical.</li>
                       <li><strong>No Guarantees of Undetectability:</strong> While designed for discretion, no tool can guarantee 100% undetectability against all current and future monitoring or proctoring technologies. User behavior and the specifics of the monitoring system play significant roles.</li>
                    </ul>
                 </div>
                 <div>
                    <h3 className="text-xl font-semibold text-white mb-3 flex items-center"><LuUserCog className="w-6 h-6 mr-2 text-purple-400"/>User Responsibilities:</h3>
                    <p className="text-gray-400 mb-2">You agree to:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-gray-400">
                       <li>Use LeetAI Assistant in compliance with all applicable laws and regulations.</li>
                       <li>Adhere to the terms of service of any platform or institution where you might consider using the tool.</li>
                       <li>Understand that the developers of LeetAI Assistant are not liable for any misuse of the software or any consequences arising from such misuse.</li>
                    </ul>
                 </div>
                 <p className="mt-6 italic text-gray-500">LeetAI Assistant is provided "as is" without any warranties. The developers disclaim all liability for any direct, indirect, incidental, or consequential damages arising from your use or inability to use the software.</p>
              </PolicySection>

              <PolicySection id="contributing" title="Contributing to LeetAI" icon={LuGitMerge}>
                <p>Contributions to LeetAI Assistant are highly welcome and encouraged! As an open-source project, community involvement is key to its growth and improvement.</p>
                <p>You can contribute in various ways:</p>
                <ul>
                   <li>Reporting bugs or issues.</li>
                   <li>Suggesting new features or enhancements.</li>
                   <li>Improving documentation.</li>
                   <li>Submitting code contributions via pull requests.</li>
                </ul>
                <p className="mt-4">
                  Please visit our GitHub repository to learn more about our contribution guidelines, open issues, and how to get started.
                </p>
                 <a href={contributingUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                     View Contribution Guidelines on GitHub
                 </a>
                 <p className="mt-2">All contributions will be subject to the project's license (GNU GPL v2.0).</p>
              </PolicySection>

              <PolicySection id="setup-note" title="Setup & Configuration" icon={LuTerminal}>
                <p>As LeetAI Assistant requires a self-hosted backend, you are responsible for the setup and configuration of both the client and server components. This includes managing environment variables for API keys (e.g., Google Gemini API, OCR service API).</p>
                <p>Detailed instructions are provided in the `README.md` file within the project's GitHub repository.</p>
                <ul>
                   <li>Ensure you have Node.js and npm installed.</li>
                   <li>Acquire necessary API keys for AI and OCR services.</li>
                   <li>Follow the server setup steps (install dependencies, configure `.env`).</li>
                   <li>Follow the client setup steps (install dependencies, optionally configure `config.json`).</li>
                </ul>
                 <a href={`${githubRepoUrl}#getting-started`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                     View Full Setup Guide on GitHub
                 </a>
              </PolicySection>
            </div>
          </div>
        </div>
      </main>

      <Footer /> {/* FOOTER ADDED HERE */}
    </div>
  );
}