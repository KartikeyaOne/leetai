// pages/about.js
import Head from 'next/head';
import Image from 'next/image'; // Import Next.js Image component
import {
  LuShieldCheck,
  LuBrainCircuit,
  LuNetwork,
  LuZap,
  LuEyeOff,
  LuKeyboard,
  LuTarget,
  LuCircleHelp,
  LuTrendingUp,
  LuBadgeAlert
} from 'react-icons/lu';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import React from 'react';

// Define placeholder image details - ADJUST WIDTH/HEIGHT FOR EACH ACTUAL IMAGE
// Assuming a base 2:1 aspect ratio for placeholders, adjust as needed!
const defaultImageWidth = 450;
const defaultImageHeight = 205; // Adjust if aspect ratio is different

export default function AboutPage() {
  console.log("Rendering Enhanced AboutPage component WITHOUT Motion, WITH Icons...");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-950 to-black text-gray-100 font-sans">
      <Head>
        <title>About LeetAI | Stop Memorizing, Start Solving</title>
        <meta name="description" content="Tired of coding tests that feel like memory quizzes? LeetAI helps you show your real skills. Learn about the undetectable AI assistant built for developers." />
        <meta property="og:title" content="About LeetAI | Stop Memorizing, Start Solving" />
        <meta property="og:description" content="Coding assessments are tough. LeetAI gives you a fair shot by handling the recall, so you can focus on problem-solving. Undetectable, fast, and built for you." />
        {/* <meta property="og:image" content="/og-image.jpg" />  Example */}
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
                About LeetAI
              </span>
            </h1>
             <p className="text-xl sm:text-2xl lg:text-3xl text-cyan-400 mb-8 font-semibold tracking-tight">
                 Focus On Solving, Not Just Recalling.
              </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Let's be real: coding interviews often feel more like memory tests than skill assessments. LeetAI cuts through the noise. It's your smart, invisible assistant, handling recall so you can *think* and show what you really know.
            </p>
            <div>
               <Link href="/#pricing" passHref legacyBehavior>
                 <a
                    className="inline-block bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-400/40 text-lg transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
                 >
                    Explore Features & Pricing
                 </a>
               </Link>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-20 lg:py-28 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text Content */}
              <div>
                 <div className="flex items-center mb-4">
                    <LuBadgeAlert className="w-8 h-8 text-yellow-400 mr-3 flex-shrink-0" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Sound Familiar? The Interview Treadmill</h2>
                </div>
                <p className="text-gray-400 mb-4 leading-relaxed text-base md:text-lg">
                  You know the drill. Technical interviews, timed tests, proctored exams... they claim to measure skill, but often test rote memorization under pressure.
                </p>
                 <p className="text-gray-400 mb-4 leading-relaxed text-base md:text-lg">
                   It's stressful, artificial, and punishes deep thinkers who don't just cram solutions. Your real problem-solving talent gets masked by anxiety or the ticking clock.
                </p>
                <p className="text-gray-400 font-semibold leading-relaxed text-base md:text-lg">
                  It's nothing like real-world coding. The system needs a reality check.
                </p>
              </div>
              {/* Box Content */}
              <div className="relative p-8 border border-cyan-700/30 rounded-xl bg-gradient-to-br from-gray-900 via-black to-black shadow-xl ring-1 ring-cyan-900/20">
                 <LuTrendingUp className="absolute top-5 right-5 w-10 h-10 text-cyan-600 opacity-20" />
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight flex items-center">
                     <LuTarget className="w-8 h-8 text-cyan-400 mr-3 flex-shrink-0"/>
                     Our Goal: Give You Back Your Brainpower
                 </h2>
                 <p className="text-gray-300 mb-4 leading-relaxed text-base md:text-lg">
                   We built LeetAI because we've been there. We wanted to level the playing field against unfair tests. LeetAI is your discreet AI sidekick.
                 </p>
                 <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                   It bypasses the memorization hurdles, letting you showcase analysis, logic, and application. LeetAI handles recall, you handle the thinking. It's your silent edge.
                 </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles Section */}
         <section className="py-20 lg:py-28 bg-gray-950 border-t border-b border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16"> How LeetAI Rolls </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
               {/* Pillar 1: Stealth */}
               <div className="p-8 border border-gray-700/60 rounded-xl bg-black/40 shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:bg-gray-900/60 transform hover:-translate-y-1">
                  <LuEyeOff className="w-12 h-12 mx-auto mb-5 text-cyan-400" />
                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3">Totally Undetectable</h3>
                  <p className="text-gray-400 text-sm lg:text-base leading-relaxed">Built from the ground up to be invisible. Native app design avoids common detection methods used by proctors or monitoring software.</p>
               </div>
               {/* Pillar 2: Performance */}
               <div className="p-8 border border-gray-700/60 rounded-xl bg-black/40 shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:bg-gray-900/60 transform hover:-translate-y-1">
                  <LuZap className="w-12 h-12 mx-auto mb-5 text-cyan-400" />
                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3">Wicked Smart & Fast</h3>
                  <p className="text-gray-400 text-sm lg:text-base leading-relaxed">Leverages leading AI models for accurate, explained solutions—delivered instantly. No waiting when the pressure's on.</p>
               </div>
                {/* Pillar 3: Empowerment */}
               <div className="p-8 border border-gray-700/60 rounded-xl bg-black/40 shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:bg-gray-900/60 transform hover:-translate-y-1">
                  <LuTarget className="w-12 h-12 mx-auto mb-5 text-cyan-400" />
                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3">Focus on What Matters</h3>
                  <p className="text-gray-400 text-sm lg:text-base leading-relaxed">Stop wasting mental energy on recall. LeetAI frees your cognitive load to focus on problem analysis, logic, and showcasing true engineering skill.</p>
               </div>
            </div>
          </div>
         </section>

        {/* --- Technology Deep Dive Section --- */}
        <section id="features-detailed" className="py-20 lg:py-28 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-20 lg:mb-24"> The Tech Behind Your Edge </h2>
            <div className="space-y-24 lg:space-y-32"> {/* Increased spacing */}

              {/* Feature 1: Undetectable AI Assistance (Text Left, Image Right) */}
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                 {/* Text Content */}
                 <div>
                    <div className="flex items-center mb-4">
                        <LuShieldCheck className="w-9 h-9 text-green-500 mr-3 flex-shrink-0" />
                        <h3 className="text-2xl lg:text-3xl font-semibold text-white">Stays Hidden, No Sweat</h3>
                    </div>
                    <p className="text-gray-300 mb-3 leading-relaxed text-base lg:text-lg">
                      Our native app architecture is key. It runs independently, avoiding browser hooks and video feed manipulations that trigger monitoring flags.
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2 mb-4">
                        <li>Operates outside monitored application processes.</li>
                        <li>Optimized for minimal resource usage (CPU/RAM).</li>
                        <li>Interaction designed to avoid screen-sharing detection.</li>
                        <li>Continuously updated against evolving proctoring tech.</li>
                    </ul>
                     <p className="text-gray-400 italic text-sm">Use confidently. Focus on the test, not on being watched.</p>
                 </div>
                 {/* Image Content */}
                 <div className="flex justify-center items-center">
                   <Image
                       src="/flowdiagram.jpg" // Replace with your specific image path
                       alt="Diagram illustrating LeetAI's undetectable native app architecture running separately from monitored tools."
                       width={defaultImageWidth} // ADJUST ASPECT RATIO
                       height={defaultImageHeight} // ADJUST ASPECT RATIO
                       className="object-contain rounded-xl shadow-xl hover:shadow-cyan-400/40 transition-shadow duration-300"
                   />
                 </div>
              </div>

              {/* Feature 2: Real-Time AI-Powered Solutions (Image Left, Text Right) */}
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Image Content: Comes first in markup, but visually second on mobile (default) and first on md+ */}
                  <div className="flex justify-center items-center md:order-first">
                     <Image
                         src="/flowdiagram.jpg" // Replace with your specific image path
                         alt="Flowchart: Shortcut captures problem -> LeetAI analyzes -> Delivers code solution & step-by-step explanation."
                         width={defaultImageWidth} // ADJUST ASPECT RATIO
                         height={defaultImageHeight} // ADJUST ASPECT RATIO
                         className=" object-contain rounded-xl shadow-xl hover:shadow-cyan-400/40 transition-shadow duration-300"
                         priority // Load this early if it's high on the page visually
                     />
                  </div>
                  {/* Text Content: Comes second in markup, but visually first on mobile (default) and second on md+ */}
                  <div className="md:order-last">
                      <div className="flex items-center mb-4">
                         <LuBrainCircuit className="w-9 h-9 text-cyan-400 mr-3 flex-shrink-0" />
                         <h3 className="text-2xl lg:text-3xl font-semibold text-white">Instant Answers & Explanations</h3>
                     </div>
                     <p className="text-gray-300 mb-3 leading-relaxed text-base lg:text-lg">
                       Stuck? A simple hotkey screenshots the problem. Our AI engine analyzes it contextually and delivers:
                     </p>
                      <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2 mb-4">
                         <li>Clean, efficient code solutions (in your chosen language).</li>
                         <li>Clear, step-by-step explanations of the logic.</li>
                         <li>Time/Space complexity analysis (Big O) when relevant.</li>
                     </ul>
                     <p className="text-gray-400 italic text-sm">Get the 'what' and the 'why' instantly, so you can articulate your understanding.</p>
                  </div>
               </div>

               {/* Feature 3: Seamless Integration (Text Left, Image Right) */}
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                 {/* Text Content */}
                 <div>
                     <div className="flex items-center mb-4">
                        <LuNetwork className="w-9 h-9 text-purple-400 mr-3 flex-shrink-0" />
                         <h3 className="text-2xl lg:text-3xl font-semibold text-white">Works Everywhere You Need It</h3>
                     </div>
                    <p className="text-gray-300 mb-3 leading-relaxed text-base lg:text-lg">
                      LeetAI operates seamlessly across the diverse platforms used for technical assessments:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-gray-400/90 pl-2 space-y-1.5 mb-4">
                        <li>Video Calls: Zoom, Google Meet, MS Teams, etc.</li>
                        <li>Coding Pads: CoderPad, CodeSignal Screen, HackerRank, etc.</li>
                        <li>Practice Sites: LeetCode, HackerRank, Codeforces, TopCoder.</li>
                        <li>Proctored Exams: Discreet assistance (use responsibly).</li>
                    </ul>
                     <p className="text-gray-400 italic text-sm">Your universal toolkit for any coding challenge environment.</p>
                 </div>
                 {/* Image Content */}
                 <div className="flex justify-center items-center">
                     <Image
                         src="/comp.png" // Make sure this image exists
                         alt="Visual diagram showing LeetAI icon connecting to icons representing Zoom, LeetCode, CoderPad etc."
                         width={defaultImageWidth} // ADJUST ASPECT RATIO
                         height={defaultImageHeight} // ADJUST ASPECT RATIO
                         className=" object-contain rounded-xl shadow-xl hover:shadow-cyan-400/40 transition-shadow duration-300"
                     />
                  </div>
              </div>

               {/* Feature 4: Adaptive AI (Image Left, Text Right) */}
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                 {/* Image Content: Comes first in markup, visually second mobile, first md+ */}
                 <div className="flex justify-center items-center md:order-first">
                     <Image
                         src="/models.png" // Make sure this image exists
                         alt="Diagram: Problem input routed through multiple AI models (GPT-4, Gemini, Claude) via LeetAI synthesis engine for best result."
                         width={defaultImageWidth} // ADJUST ASPECT RATIO
                         height={defaultImageHeight} // ADJUST ASPECT RATIO
                         className=" object-contain rounded-xl shadow-xl hover:shadow-cyan-400/40 transition-shadow duration-300"
                     />
                  </div>
                 {/* Text Content: Comes second in markup, visually first mobile, second md+ */}
                 <div className="md:order-last">
                     <div className="flex items-center mb-4">
                         <LuZap className="w-9 h-9 text-yellow-400 mr-3 flex-shrink-0" />
                        <h3 className="text-2xl lg:text-3xl font-semibold text-white">Multiple AIs = Better Accuracy</h3>
                    </div>
                    <p className="text-gray-300 mb-3 leading-relaxed text-base lg:text-lg">
                      We don't bet on a single AI. LeetAI integrates multiple leading models (like GPT-4, Gemini, Claude). Our system intelligently routes queries or synthesizes results for optimal accuracy.
                    </p>
                     <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2 mb-4">
                         <li>Handles diverse problem types more reliably.</li>
                         <li>Internal confidence checks trigger multi-model analysis.</li>
                         <li>Continuously evaluates and incorporates the best models.</li>
                     </ul>
                    <p className="text-gray-400 italic text-sm">Benefit from a team of AI experts, ensuring robust and reliable answers.</p>
                 </div>
              </div>

               {/* Feature 5: Efficient & Discreet UX (Text Left, Image Right) */}
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                 {/* Text Content */}
                 <div>
                    <div className="flex items-center mb-4">
                        <LuKeyboard className="w-9 h-9 text-gray-300 mr-3 flex-shrink-0" />
                        <h3 className="text-2xl lg:text-3xl font-semibold text-white">Simple & Sneaky Controls</h3>
                    </div>
                    <p className="text-gray-300 mb-3 leading-relaxed text-base lg:text-lg">
                      No complex UI or obvious windows. LeetAI prioritizes speed and discretion through customizable hotkeys:
                    </p>
                     <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2 mb-4">
                         <li>User-defined shortcuts for all core actions.</li>
                         <li>Instantly capture, solve, copy, and hide.</li>
                         <li>Minimalist overlay appears only when needed.</li>
                         <li>Designed for keyboard-only interaction.</li>
                     </ul>
                     <p className="text-gray-400 italic text-sm">Stay focused on the assessment, not on managing the tool.</p>
                 </div>
                 {/* Image Content */}
                 <div className="flex justify-center items-center">
                     <Image
                         src="/hotkey.png" // Replace with your specific image path
                         alt="Visual representation of keyboard shortcut icons (e.g., Ctrl+Shift+L) triggering LeetAI actions like Solve, Copy, Hide."
                         width={defaultImageWidth} // ADJUST ASPECT RATIO
                         height={defaultImageHeight} // ADJUST ASPECT RATIO
                         className=" object-contain rounded-xl shadow-xl hover:shadow-cyan-400/40 transition-shadow duration-300"
                     />
                  </div>
              </div>
            </div> {/* End of space-y wrapper */}
          </div> {/* End of container */}
        </section>
        {/* --- End Technology Deep Dive Section --- */}

        {/* Redefining Assessments Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-t from-black via-gray-950 to-black border-t border-gray-800">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <LuTrendingUp className="w-14 h-14 mx-auto mb-6 text-cyan-500" />
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Time to Fix Technical Testing</h2>
                 <p className="text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                     Current coding assessments often reward speed-memorization over genuine problem-solving ability, overlooking talented engineers who excel in real-world scenarios.
                 </p>
                 <p className="text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-semibold">
                     LeetAI challenges this outdated approach. It empowers you to bypass artificial constraints and demonstrate your core engineering skills: analysis, logic, and effective application of knowledge.
                 </p>
                 <p className="mt-8 text-cyan-400 text-xl font-bold">Beat the flawed system. Showcase your real talent with LeetAI.</p>
             </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 lg:py-28 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-16"> Got Questions? We've Got Answers. </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {[
                 // FAQ Items remain the same as before...
                 {
                  q: "Seriously, is this thing REALLY undetectable?",
                  a: "We've engineered it for maximum discretion. As a native app, it avoids common browser/extension detection methods. It's lightweight and designed to mimic normal system activity. While we constantly update against new proctoring techniques, ultimate undetectability also depends on user behavior. Act naturally, avoid suspicious mouse movements or rapid context switching, and you significantly minimize risk."
                },
                {
                  q: "Okay, but is it cheating? Is it ethical?",
                  a: "It's a tool to counter assessments that often unfairly test memory over true skill. Think of it like using a calculator for complex arithmetic when the goal is to assess mathematical reasoning. LeetAI handles the recall, letting you focus on logic and explanation. You still need to understand and articulate the solution. However, always be aware of the specific rules of your test or interview. Responsible usage is key, and the decision is ultimately yours."
                },
                {
                  q: "What platforms, languages, and computers does it work on?",
                  a: "Platforms: Broad compatibility including Zoom, Teams, Meet, CoderPad, CodeSignal, HackerRank (Screen & Practice), LeetCode, Codeforces, and discreet operation alongside proctoring software.\nLanguages: Python, Java, JavaScript, C++, C#, Go, Ruby, Swift, Kotlin, with more planned.\nComputers: Native apps for Windows (10/11) and macOS (Monterey or newer). Requires an active internet connection."
                },
                {
                  q: "How good are the answers? What if one's wrong?",
                  a: "Accuracy is very high due to our multi-model approach (GPT-4, Gemini, Claude etc.). However, no AI is infallible, especially on novel or poorly defined problems. Always use the provided explanations to verify the logic yourself. If you consistently encounter issues, contact support (Pro plan offers priority)."
                },
                {
                  q: "How does the 'credit' system work?",
                  a: "Each plan includes monthly credits. A typical query (solution + explanation) uses 1 credit. Credits reset monthly according to your plan details (check specific terms for rollover). Your balance is always visible within the app."
                },
                {
                  q: "What if I need help? What computer specs?",
                  a: "Help: Comprehensive documentation and tutorials are available. Basic plans include community forum access, while Pro plans get priority email support.\nSpecs: Runs smoothly on most modern systems capable of handling development tasks or video calls (recommend 8GB+ RAM). It's designed to be lightweight."
                },
                 {
                   q: "Is it hard to set up and use?",
                   a: "Setup is straightforward: download, install, log in. Usage primarily involves simple, customizable keyboard shortcuts. A brief onboarding tour guides you through the essentials."
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
                      dangerouslySetInnerHTML={{ __html: item.a.replace(/\n/g, '<br />') }} // Keep rendering newlines
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