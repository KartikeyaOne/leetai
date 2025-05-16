"use client"; // Required for Framer Motion

import { motion } from 'framer-motion';
import React from 'react';
// Updated to include FiGithub
import { FiArrowRight, FiGithub } from 'react-icons/fi'; 

// --- Animation Variants (Refined for Precision) --- (NO CHANGES HERE)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, staggerChildren: 0.18, when: "beforeChildren" }}
};
const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }} 
};
const buttonVariants = {
  hidden: { scale: 0.85, opacity: 0 }, 
  visible: { scale: 1, opacity: 1, transition: { delay: 0.35, duration: 0.55, type: "spring", stiffness: 170, damping: 18 }} 
};

// --- Keyframes for Subtle Background Animations (Applied via inline style) --- (NO CHANGES HERE)
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
      // Apply perspective for subtle depth, even without tilt (NO CHANGES HERE)
      style={{ perspective: '1200px' }}
      className="
        min-h-[70vh] md:min-h-[75vh] 
        py-24 lg:py-32 
        flex items-center justify-center
        bg-gradient-to-b from-black via-zinc-950 to-slate-900 
        relative overflow-hidden isolate"
    >
      {/* --- Refined & Focused Background Layers --- (NO CHANGES HERE) */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        {/* Layer 1: Ultra-Subtle Grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[-3] w-full h-full opacity-[0.05]"
          style={{
            animation: 'grid-pan-subtle 12s linear infinite',
            backgroundImage: 'linear-gradient(to right, #3f3f46 0.5px, transparent 0.5px), linear-gradient(to bottom, #3f3f46 0.5px, transparent 0.5px)', 
            backgroundSize: '25px 25px', 
          }}
        ></div>

        {/* Layer 2: Focused Core Pulse */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-2]
                     w-[65vw] h-[65vh] max-w-[600px] max-h-[600px] 
                     bg-gradient-radial from-cyan-800/25 via-teal-900/15 to-transparent 
                     rounded-full blur-[70px] "
           style={{
             animation: 'core-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
           }}
        ></div>

         {/* Layer 3: Subtle Energy/Data Flow */}
         <div
           aria-hidden="true"
           className="absolute inset-0 z-[-1] opacity-[0.12] mix-blend-overlay"
         >
           <div
             className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent bg-[length:300%_100%]"
             style={{ animation: 'energy-flow 9s ease-in-out infinite' }} 
            ></div>
           <div
             className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-700/30 to-transparent bg-[length:100%_300%]"
             style={{ animation: 'energy-flow 11s 0.5s ease-in-out infinite reverse' }} 
            ></div>
         </div>
      </div>

      {/* Content Container (NO CHANGES HERE) */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {/* Headline: Sharper, More Direct (NO CHANGES HERE) */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl 
                     font-extrabold mb-4
                     leading-tight tracking-tighter 
                     text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-cyan-400
                     drop-shadow-[0_2px_8px_rgba(180,210,255,0.15)]" 
        >
          Stop Reciting.
          <br className="hidden md:block" /> Start <span className="text-cyan-400">Architecting.</span>
        </motion.h2>

        {/* Sub-headline/Problem Statement: Concise & Relatable (NO CHANGES HERE) */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-xl 
                     text-slate-300/85 
                     max-w-xl lg:max-w-2xl mx-auto mb-10 lg:mb-12 
                     leading-relaxed"
        >
          Coding interviews shouldn't be memory tests. LeetAI handles the recall pressure, letting your true problem-solving brilliance shine. Focus, solve, impress – <span className="font-semibold text-slate-200">discreetly</span>.
        </motion.p>

        {/* --- UPDATED BUTTON: Now an <a> tag linking to GitHub --- */}
        <motion.div variants={buttonVariants} className="inline-block">
          <motion.a // CHANGED from motion.button to motion.a
            href="https://github.com/KartikeyaOne/leetai" // ADDED: GitHub link
            target="_blank" // ADDED: Open in new tab
            rel="noopener noreferrer" // ADDED: Security for external links
            whileHover={{
              scale: 1.06, 
              boxShadow: "0px 8px 30px -6px rgba(0, 220, 255, 0.5)", 
              transition: { type: "spring", stiffness: 280, damping: 14 }
            }}
            whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            className="
              group relative inline-flex items-center justify-center gap-x-3
              bg-gradient-to-br from-zinc-800 via-black to-zinc-900
              text-white 
              font-semibold 
              border-2 border-zinc-700 group-hover:border-cyan-400
              py-3.5 px-10 md:py-4 md:px-12 
              rounded-lg 
              text-lg md:text-xl lg:text-2xl 
              shadow-lg group-hover:shadow-xl 
              overflow-hidden 
              transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
              transform hover:-translate-y-1 
            "
          >
            {/* Advanced Background Shine Effect (Fast & Sharp) (NO CHANGES HERE) */}
            <span className="absolute inset-0 z-0 overflow-hidden rounded-lg">
              <span className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] 
                             bg-gradient-to-br from-transparent via-white/15 to-transparent
                             transform -rotate-45 transition-transform duration-500 ease-out
                             group-hover:translate-x-[100px] group-hover:translate-y-[50px] 
                             group-hover:duration-700">
              </span>
            </span>

            {/* Intense Inner Border Glow (Focused) (NO CHANGES HERE) */}
            <span
               className="absolute -inset-0.5 z-[-1] rounded-lg 
                          bg-gradient-to-r from-cyan-600/70 via-cyan-400/90 to-cyan-600/70
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          blur-md "
               aria-hidden="true"
            ></span>

            {/* Button Text & Icon */}
            <FiGithub className="relative z-10 w-5 h-5 md:w-6 md:h-6" /> {/* ADDED GitHub Icon */}
            <span className="relative z-10">View on GitHub</span> {/* UPDATED Text */}
            
            {/* Arrow Icon with Subtle Nudge Animation (Kept for visual flair) */}
            <motion.span
               className="relative z-10 inline-block"
               animate={{ x: [0, 3, 0] }} 
               transition={{
                 duration: 1.6, 
                 repeat: Infinity,
                 repeatType: "loop",
                 ease: "easeInOut",
                 delay: 0.2 
               }}
            >
              <FiArrowRight className="w-5 h-5 md:w-6 md:h-6" /> 
            </motion.span> 
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASectionFinalSick;