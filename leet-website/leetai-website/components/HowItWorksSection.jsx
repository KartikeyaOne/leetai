"use client"; // Required for Framer Motion

import { motion } from 'framer-motion';
// Using react-icons for visual flair in the step numbers
import { LuCheckCircle } from 'react-icons/lu'; // Example checkmark, not actively used in visible output of Step but present in original import

// Animation Variants for the Section and Steps (NO CHANGES HERE)
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, 
      delayChildren: 0.2,  
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -50 }, 
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut", 
    },
  },
};

// Enhanced Step Component (NO CHANGES HERE)
const Step = ({ number, title, description }) => (
  <motion.div
    variants={stepVariants}
    className="group relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-10 md:mb-14"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5, transition: { type: 'spring', stiffness: 300 } }}
      className="
        flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full
        flex items-center justify-center
        bg-gradient-to-br from-gray-700/80 via-gray-800/90 to-gray-900/80
        border-2 border-gray-600/70
        shadow-md group-hover:shadow-lg group-hover:shadow-gray-600/30
        transition-all duration-300 ease-out
        relative z-10"
    >
       <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
       <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 relative z-10">
         {number}
       </span>
    </motion.div>

    <motion.div
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
      className="
        flex-grow p-5 md:p-6 rounded-lg
        bg-gradient-to-b from-gray-900/60 to-black/50 backdrop-blur-sm
        border border-gray-700/50
        group-hover:border-gray-500/70
        transition-colors duration-300 relative overflow-hidden"
    >
        <div className="absolute inset-0 z-[-1] opacity-[0.03] rounded-lg" style={{backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

      <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed">{description}</p>
    </motion.div>

     <div
       aria-hidden="true"
       className="
         absolute left-[23px] md:left-[27px] top-14 md:top-[calc(3.5rem)] 
         h-[calc(100%-3.5rem+2.5rem)] md:h-[calc(100%-3.5rem+3.5rem)] 
         w-[2px]
         bg-gradient-to-b from-gray-700/0 via-gray-600/50 to-gray-700/0 
         group-hover:via-gray-500/80 transition-colors duration-300
         md:hidden"
      />
  </motion.div>
);


const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-black py-14 lg:py-26 relative overflow-hidden">
        {/* Subtle Background Effect - Similar to Features (NO CHANGES HERE) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 opacity-[0.05] blur-[120px]"
           style={{
             backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(192, 192, 192, 0.4), transparent 60%), radial-gradient(circle at 80% 70%, rgba(128, 128, 128, 0.3), transparent 60%)',
             backgroundSize: '150% 150%',
             backgroundRepeat: 'no-repeat',
           }}
        ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Animated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
          {/* --- UPDATED SECTION TITLE --- */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400 mb-4">
            Using LeetAI is Simple
          </h2>
          {/* --- UPDATED SECTION DESCRIPTION --- */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Three quick keyboard-driven steps to leverage LeetAI for on-screen analysis, designed for speed and discretion.
          </p>
        </motion.div>

        {/* Steps Container - Animated */}
        <motion.div
          className="max-w-3xl mx-auto cursor-default" 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }} 
        >
          {/* --- UPDATED STEP CONTENT BASED ON README "USAGE" SECTION --- */}
          <Step
            number="1"
            title="Capture & View Text" // UPDATED
            description="Press Cmd/Ctrl + H. LeetAI captures the on-screen content, sends it for OCR via your server, and displays the extracted text right in the assistant window." // UPDATED
          />
           <Step
            number="2"
            title="Submit for AI Insights" // UPDATED
            description="With text ready, hit Cmd/Ctrl + Return. The content is sent to your AI model for analysis (e.g., code explanation, summarization). The AI's response then appears in the window." // UPDATED
          />
           <Step
            number="3"
            title="Control Your Assistant" // UPDATED
            description="Toggle LeetAI's visibility with Cmd/Ctrl + B. Scroll content using Cmd/Ctrl + Alt + Up/Down, and move the window with Alt + Arrow Keys to fit your workflow." // UPDATED
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;