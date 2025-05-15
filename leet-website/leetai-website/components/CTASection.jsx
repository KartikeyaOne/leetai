"use client"; // Required for Framer Motion

import { motion } from 'framer-motion';
import React from 'react';
import { FiArrowRight } from 'react-icons/fi'; // Keeping the action arrow

// --- Animation Variants (Refined for Precision) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, staggerChildren: 0.18, when: "beforeChildren" }}
};
const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }} // Sine Out easing
};
const buttonVariants = {
  hidden: { scale: 0.85, opacity: 0 }, // Start slightly larger than before
  visible: { scale: 1, opacity: 1, transition: { delay: 0.35, duration: 0.55, type: "spring", stiffness: 170, damping: 18 }} // Slightly punchier spring
};

// --- Keyframes for Subtle Background Animations (Applied via inline style) ---
/*
@keyframes grid-pan-subtle {
  0% { background-position: 0% 0%; }
  100% { background-position: 25px 25px; }
}

@keyframes core-pulse {
  0%, 100% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

@keyframes energy-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
*/

const CTASectionFinalSick = () => {

  return (
    <section
      // Apply perspective for subtle depth, even without tilt
      style={{ perspective: '1200px' }}
      className="
        min-h-[70vh] md:min-h-[75vh] /* Controlled height */
        py-24 lg:py-32 /* Adjusted padding */
        flex items-center justify-center
        bg-gradient-to-b from-black via-zinc-950 to-slate-900 /* Deep, focused gradient */
        relative overflow-hidden isolate"
    >
      {/* --- Refined & Focused Background Layers --- */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {/* Layer 1: Ultra-Subtle Grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[-3] w-full h-full opacity-[0.05]" // Very subtle
          style={{
            animation: 'grid-pan-subtle 12s linear infinite',
            backgroundImage: 'linear-gradient(to right, #3f3f46 0.5px, transparent 0.5px), linear-gradient(to bottom, #3f3f46 0.5px, transparent 0.5px)', // zinc-700 lines
            backgroundSize: '25px 25px', // Fine grid
          }}
        ></div>

        {/* Layer 2: Focused Core Pulse */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-2]
                     w-[65vw] h-[65vh] max-w-[600px] max-h-[600px] /* Controlled size */
                     bg-gradient-radial from-cyan-800/25 via-teal-900/15 to-transparent /* Slightly stronger core */
                     rounded-full blur-[70px] /* Sharper blur */"
           style={{
             animation: 'core-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
           }}
        ></div>

         {/* Layer 3: Subtle Energy/Data Flow */}
         <div
           aria-hidden="true"
           className="absolute inset-0 z-[-1] opacity-[0.12] mix-blend-overlay" // Slightly more visible flow
         >
           <div
             className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent bg-[length:300%_100%]"
             style={{ animation: 'energy-flow 9s ease-in-out infinite' }} // Faster flow
            ></div>
           <div
             className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-700/30 to-transparent bg-[length:100%_300%]"
             style={{ animation: 'energy-flow 11s 0.5s ease-in-out infinite reverse' }} // Offset flow
            ></div>
         </div>
      </div>

      {/* Content Container */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {/* Headline: Sharper, More Direct */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl /* Capped at 6xl */
                     font-extrabold mb-4
                     leading-tight tracking-tighter /* Even tighter tracking */
                     text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-cyan-400
                     drop-shadow-[0_2px_8px_rgba(180,210,255,0.15)]" // Slightly enhanced shadow
        >
          Stop Reciting.
          <br className="hidden md:block" /> Start <span className="text-cyan-400">Architecting.</span>
        </motion.h2>

        {/* Sub-headline/Problem Statement: Concise & Relatable */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-xl /* Capped at xl */
                     text-slate-300/85 /* Slightly brighter */
                     max-w-xl lg:max-w-2xl mx-auto mb-10 lg:mb-12 /* Tighter max-width on smaller screens */
                     leading-relaxed"
        >
          Coding interviews shouldn't be memory tests. LeetAI handles the recall pressure, letting your true problem-solving brilliance shine. Focus, solve, impress – <span className="font-semibold text-slate-200">discreetly</span>.
        </motion.p>

        {/* --- THE ULTIMATE CONVINCER BUTTON --- */}
        <motion.div variants={buttonVariants} className="inline-block"> {/* Wrap button for independent animation & positioning */}
          <motion.button
            whileHover={{
              scale: 1.06, // Slightly more pop
              boxShadow: "0px 8px 30px -6px rgba(0, 220, 255, 0.5)", // Brighter, tighter cyan shadow
              transition: { type: "spring", stiffness: 280, damping: 14 }
            }}
            whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            className="
              group relative inline-flex items-center justify-center gap-x-3
              /* High-contrast base */
              bg-gradient-to-br from-zinc-800 via-black to-zinc-900
              text-white /* Bright white text */
              font-semibold /* Slightly less bold for sharpness */
              /* Sharp border, intense hover */
              border-2 border-zinc-700 group-hover:border-cyan-400
              py-3.5 px-10 md:py-4 md:px-12 /* Fine-tuned padding */
              rounded-lg /* Standard rounding */
              text-lg md:text-xl lg:text-2xl /* Controlled text size */
              shadow-lg group-hover:shadow-xl /* Standard shadows */
              overflow-hidden /* Essential for effects */
              transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
              transform hover:-translate-y-1 /* Subtle lift */
            "
          >
            {/* Advanced Background Shine Effect (Fast & Sharp) */}
            <span className="absolute inset-0 z-0 overflow-hidden rounded-lg">
              <span className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] /* Angled shine */
                             bg-gradient-to-br from-transparent via-white/15 to-transparent
                             transform -rotate-45 transition-transform duration-500 ease-out
                             group-hover:translate-x-[100px] group-hover:translate-y-[50px] /* Diagonal movement */
                             group-hover:duration-700">
              </span>
            </span>

            {/* Intense Inner Border Glow (Focused) */}
            <span
               className="absolute -inset-0.5 z-[-1] rounded-lg /* Match radius */
                          /* Focused cyan gradient */
                          bg-gradient-to-r from-cyan-600/70 via-cyan-400/90 to-cyan-600/70
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          blur-md /* Medium blur for defined glow */"
               aria-hidden="true"
            ></span>

            {/* Button Text */}
            <span className="relative z-10">Get Your Undetectable Edge</span>

            {/* Icon with Subtle Nudge Animation */}
            <motion.span
               className="relative z-10 inline-block"
               animate={{ x: [0, 3, 0] }} // Subtle side nudge
               transition={{
                 duration: 1.6, // Slightly faster loop
                 repeat: Infinity,
                 repeatType: "loop",
                 ease: "easeInOut",
                 delay: 0.2 // Start slightly after initial render
               }}
            >
              <FiArrowRight className="w-5 h-5 md:w-6 md:h-6" /> {/* Adjusted icon size */}
            </motion.span> 
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASectionFinalSick;