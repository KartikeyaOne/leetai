"use client"; // Needed for Framer Motion

import { motion } from 'framer-motion';
// Import specific icons from Lucide Icons
import {
  LuEyeOff,       // Undetectable
  LuCpu,          // Real-Time Solutions
  LuNetwork,      // Seamless Integration
  LuBrainCircuit, // Adaptive AI
  LuKeyboard,     // Efficient UX
  LuTarget        // Redefining Assessments
} from 'react-icons/lu';

// --- Humanized Features Content ---
const features = [
  {
    title: "Fly Under the Radar",
    description: "LeetAI works completely undetected. Interviewers, proctors, and anti-cheat software won't know it's there. It just runs quietly in the background.",
    icon: LuEyeOff // Stay hidden
  },
  {
    title: "Instant Solutions, On Demand",
    description: "Just grab a quick screenshot of the problem. LeetAI instantly gives you accurate answers with easy-to-understand explanations. Solve problems faster and sound like a pro.",
    icon: LuCpu // Get answers fast
  },
  {
    title: "Works Everywhere You Do",
    description: "Use it seamlessly with Zoom, CoderPad, CodeSignal, Teams, LeetCode, HackerRank, Codeforces, online exams – pretty much anywhere you need it.",
    icon: LuNetwork // Connects anywhere
  },
  {
    title: "Smart AI Gets It Right",
    description: "Our system uses multiple AI models and cleverly picks the best one for your specific problem, ensuring you always get top-notch solutions.",
    icon: LuBrainCircuit // Intelligent problem-solving
  },
  {
    title: "Simple & Stealthy Controls",
    description: "Handy keyboard shortcuts let you capture, generate, and hide LeetAI in a flash. It stays out of sight, out of mind – until you need it.",
    icon: LuKeyboard // Easy to use
  },
  {
    title: "Beyond Memorization",
    description: "Tired of just memorizing answers? LeetAI helps you focus on *applying* knowledge, offering smart assistance right when you need it.",
    icon: LuTarget // Focus on understanding
  }
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
    <section id="features" className="bg-black py-20 lg:py-32 relative overflow-hidden">
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
          className="text-center mb-16 md:mb-20"
        >
          {/* --- Humanized Header --- */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400 mb-4">
            What Makes LeetAI Different?
          </h2>
          {/* --- Humanized Description --- */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Check out the powerful features that give you an undetectable edge, combining stealth with smart, real-time assistance.
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
                  {/* Render the specific icon for this feature */}
                  <IconComponent className="w-6 h-6 text-gray-200 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {/* Feature Title (Humanized) */}
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {/* Feature Description (Humanized) */}
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