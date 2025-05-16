"use client"; // Needed for Framer Motion

import { motion } from 'framer-motion';
// Import specific icons from Lucide Icons based on README Core Features
import {
  LuEyeOff,       // Stealth Operation
  LuKeyboard,     // Keyboard-Centric Design
  LuScanText,     // Screen Capture & OCR
  LuBrainCircuit, // AI Analysis
  LuMove,         // Dynamic Content Display
  LuServer,       // Self-Hosted Backend
  LuLaptop        // Cross-Platform (Electron)
} from 'react-icons/lu';

// --- Features Content based on README.md Core Features ---
const features = [
  {
    title: "Stealth Operation",
    description: "Runs as a transparent, non-focusable overlay. Clicks pass through, and it's designed to remain hidden from screen recording systems.",
    icon: LuEyeOff
  },
  {
    title: "Keyboard-Centric Design",
    description: "All primary interactions are handled via global keyboard shortcuts for maximum efficiency, keeping you in the flow.",
    icon: LuKeyboard
  },
  {
    title: "Screen Capture & OCR",
    description: "Capture on-screen text content using robust OCR capabilities provided by your self-hosted backend server.",
    icon: LuScanText
  },
  {
    title: "AI Analysis",
    description: "Submit captured text to a powerful AI (e.g., Google Gemini) for code explanation, generation, summarization, and problem-solving.",
    icon: LuBrainCircuit
  },
  {
    title: "Dynamic Content Display",
    description: "Move the assistant window and scroll through content using shortcuts, all within a consistently sized overlay.",
    icon: LuMove
  },
  {
    title: "Self-Hosted Backend",
    description: "Primarily works with its dedicated, self-hostable backend, ensuring you control your data and API usage.",
    icon: LuServer
  },
];

// Animation Variants for Staggering
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Controls delay between each card animating in
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 }, // Start slightly down and faded out
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const FeaturesSection = () => {
  return (
    <section
      id="features"
      // REDUCED PADDING HERE: Was py-20 lg:py-32, now py-16 lg:py-24
      className="bg-black  relative overflow-hidden"
    >
       {/* Optional Subtle Background Mesh Gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 opacity-[0.06] blur-[100px]"
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(192, 192, 192, 0.5), transparent 70%), radial-gradient(circle at 10% 90%, rgba(128, 128, 128, 0.4), transparent 70%), radial-gradient(circle at 90% 80%, rgba(160, 160, 160, 0.4), transparent 70%)',
             backgroundSize: '150% 150%',
             backgroundRepeat: 'no-repeat',
           }}
        ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} // Trigger when 50% is visible
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20" // This margin is for space between header and grid
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400 mb-4">
            Core Features of LeetAI
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Discover how LeetAI combines stealth, efficiency, and powerful AI to provide on-demand insights for your on-screen content.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10" // Grid layout
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible" // Animate when the grid comes into view
          viewport={{ once: true, amount: 0.1 }} // Trigger animation early
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon; // Get the icon component
            return (
              <motion.div
                key={index}
                variants={cardVariants} // Apply card animation variant
                whileHover={{ scale: 1.03, y: -5, transition: { type: 'spring', stiffness: 300, damping: 15 } }} // Springy hover effect
                className="
                  group relative p-6 lg:p-8 rounded-xl overflow-hidden
                  bg-gradient-to-br from-gray-900/80 to-black/70 backdrop-blur-sm
                  border border-gray-700/40
                  shadow-lg transition-all duration-300 ease-out
                  hover:border-gray-500/60 hover:shadow-xl hover:shadow-gray-700/20
                " // Styling for the card
              >
                {/* Subtle Background Glow on Hover */}
                 <motion.div
                   className="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{
                      background: 'radial-gradient(circle at center, rgba(180, 180, 180, 0.15) 0%, transparent 70%)',
                   }}
                 />

                {/* Icon Container */}
                <div className="mb-5 inline-block p-3 rounded-lg border border-gray-700/80 bg-gradient-to-br from-gray-700/70 to-gray-800/60 group-hover:border-gray-500/90 transition-colors duration-300">
                  <IconComponent className="w-6 h-6 text-gray-200 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;