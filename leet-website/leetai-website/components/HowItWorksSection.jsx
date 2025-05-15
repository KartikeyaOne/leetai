"use client"; // Required for Framer Motion

import { motion } from 'framer-motion';
// Using react-icons for visual flair in the step numbers
import { LuCheckCircle } from 'react-icons/lu'; // Example checkmark

// Animation Variants for the Section and Steps
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Stagger the appearance of each step
      delayChildren: 0.2,  // Small delay before steps start animating
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -50 }, // Start faded out and slightly to the left
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut", // Using a standard valid easing function
    },
  },
};

// Enhanced Step Component
const Step = ({ number, title, description }) => (
  <motion.div
    variants={stepVariants}
    className="group relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-10 md:mb-14" // Added gap for spacing
  >
    {/* Step Number Indicator - Enhanced Styling */}
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5, transition: { type: 'spring', stiffness: 300 } }}
      className="
        flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full
        flex items-center justify-center
        bg-gradient-to-br from-gray-700/80 via-gray-800/90 to-gray-900/80
        border-2 border-gray-600/70
        shadow-md group-hover:shadow-lg group-hover:shadow-gray-600/30
        transition-all duration-300 ease-out
        relative z-10" // Ensure number is above potential lines
    >
       {/* Inner glow effect */}
       <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
       {/* Checkmark or Number */}
       <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 relative z-10">
         {number}
       </span>
    </motion.div>

    {/* Step Content - Enhanced Styling */}
    <motion.div
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
      className="
        flex-grow p-5 md:p-6 rounded-lg
        bg-gradient-to-b from-gray-900/60 to-black/50 backdrop-blur-sm
        border border-gray-700/50
        group-hover:border-gray-500/70
        transition-colors duration-300 relative overflow-hidden" // Added relative overflow hidden for pattern
    >
       {/* Subtle pattern inside content card (optional) */}
        <div className="absolute inset-0 z-[-1] opacity-[0.03] rounded-lg" style={{backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

      <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed">{description}</p>
    </motion.div>

     {/* Vertical Connecting Line (Styled) - Visible only between steps */}
     <div
       aria-hidden="true"
       className="
         absolute left-[23px] md:left-[27px] top-14 md:top-[calc(3.5rem)] /* Position below number */
         h-[calc(100%-3.5rem+2.5rem)] md:h-[calc(100%-3.5rem+3.5rem)] /* Extend line length */
         w-[2px]
         bg-gradient-to-b from-gray-700/0 via-gray-600/50 to-gray-700/0 /* Faded gradient line */
         group-hover:via-gray-500/80 transition-colors duration-300
         md:hidden" /* Hide on medium screens where layout changes */
      />
  </motion.div>
);


const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-black py-20 lg:py-32 relative overflow-hidden">
        {/* Subtle Background Effect - Similar to Features */}
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
          {/* --- HUMANIZED HEADER --- */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400 mb-4">
            Getting Started is Simple
          </h2>
          {/* --- HUMANIZED DESCRIPTION --- */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            It only takes three quick steps to get LeetAI working for you, all designed to be fast and completely hidden.
          </p>
        </motion.div>

        {/* Steps Container - Animated */}
        <motion.div
          className="max-w-3xl mx-auto cursor-default" // Increased max-width slightly
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible" // Trigger animation when container is in view
          viewport={{ once: true, amount: 0.2 }} // Trigger earlier for steps
        >
          {/* --- HUMANIZED STEP CONTENT --- */}
          <Step
            number="1"
            title="Grab the Problem"
            description="Hit a simple keyboard shortcut. That's it. LeetAI instantly snaps a picture of whatever coding problem or question is on your screen."
          />
           <Step
            number="2"
            title="Get Your Answer Instantly"
            description="Working silently behind the scenes, LeetAI figures out the problem and pops up an accurate solution with clear explanations, thanks to its smart AI."
          />
           <Step
            number="3"
            title="Ace Your Response"
            description="Use the answer and explanation to quickly grasp the concept. Now you can confidently explain your thinking like you knew it all along – nobody will suspect a thing."
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;