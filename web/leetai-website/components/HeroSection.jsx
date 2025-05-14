"use client";

import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
// Using only the icons needed for the simplified features
import { LuShieldCheck, LuZap, LuTarget } from 'react-icons/lu';
import styles from './HeroSection.module.css'; // Assuming your CSS module path

// --- Simplified Data for Hero Features ---
const heroFeaturesData = [
  {
    IconComponent: LuShieldCheck,
    title: "Stealth Mode",
    description: "Works silently, undetected.",
    iconColorClass: "text-green-400",
  },
  {
    IconComponent: LuZap,
    title: "Instant AI",
    description: "Quick solutions & code.",
    iconColorClass: "text-yellow-400",
  },
  {
    IconComponent: LuTarget,
    title: "Solve Smarter",
    description: "Focus on skills, not memorization.",
    iconColorClass: "text-purple-400", // Changed from cyan for variety if LuBrainCircuit was removed
  },
];

// --- Helper Function for Particle Effect (remains the same) ---
function setupParticleEffect(particleContainer, createdParticles, particleStyles) {
  if (!particleContainer) return null;

  const createParticle = () => {
    if (createdParticles.length >= 20) return; // Slightly reduced particle count
    const particle = document.createElement('div');
    particle.className = particleStyles.floatingParticle;
    const size = Math.random() * 40 + 8; // Slightly smaller max size
    const left = Math.random() * 100;
    const animDuration = Math.random() * 15 + 10; // Slightly adjusted duration
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${animDuration}s`;
    particleContainer.appendChild(particle);
    createdParticles.push(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
        const index = createdParticles.indexOf(particle);
        if (index > -1) {
          createdParticles.splice(index, 1);
        }
      }
    }, animDuration * 1000);
  };

  Array(10).fill(0).forEach(createParticle); // Reduced initial particles
  const intervalId = setInterval(createParticle, 2000); // Generate slightly slower
  return intervalId;
}

// --- Helper Function for Data Stream Effect (remains the same) ---
function setupDataStreamEffect(streamContainer, createdDataStreams, streamStyles) {
  if (!streamContainer) return;
  streamContainer.innerHTML = '';
  Array(10).fill(0).forEach((_, i) => { // Reduced number of streams
    const stream = document.createElement('div');
    stream.className = streamStyles.dataStream;
    stream.style.left = `${(i / 10) * 100 + Math.random() * 5 - 2.5}%`;
    stream.style.animationDelay = `${Math.random() * 5}s`;
    stream.style.animationDuration = `${Math.random() * 5 + 10}s`;
    streamContainer.appendChild(stream);
    createdDataStreams.push(stream);
  });
}

// --- Sub-component: HeroFeatureItem (Adjusted icon size) ---
const HeroFeatureItem = ({ IconComponent, title, description, iconColorClass }) => (
  <div className="flex flex-col items-center text-center p-2.5 rounded-lg border border-gray-700/40 bg-black/20 backdrop-blur-sm">
    <IconComponent className={`w-7 h-7 md:w-8 md:h-8 ${iconColorClass} mb-1.5`} /> {/* Smaller icons */}
    <h3 className="text-sm font-semibold text-white mb-0.5">{title}</h3>
    <p className="text-xs text-gray-400">{description}</p>
  </div>
);

// --- Sub-component: AnimatedGeometricShapes (remains the same) ---
const AnimatedGeometricShapes = ({ styles }) => (
  <div className={styles.shapesContainer}>
    <div className={`${styles.shape} ${styles.circle}`}></div>
    <div className={`${styles.shape} ${styles.square}`}></div>
    <div className={`${styles.shape} ${styles.triangle}`}></div>
    <div className={`${styles.shape} ${styles.hexagon}`}></div>
    {/* Removed some shapes for less visual noise if needed, but keeping for now */}
    <div className={`${styles.shape} ${styles.diamond}`}></div>
    <div className={`${styles.shape} ${styles.star}`}></div>
    <div className={`${styles.shape} ${styles.circle} ${styles.shapeOffset1}`}></div>
  </div>
);


const HeroSection = () => {
  const cardRef = useRef(null);
  const dataStreamContainerRef = useRef(null);
  const particlesContainerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - left - width / 2) * 0.07; // Slightly reduced intensity
    const y = (event.clientY - top - height / 2) * 0.07; // Slightly reduced intensity
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useTransform(mouseY, [-120, 120], [7, -7]); // Adjusted range
  const rotateY = useTransform(mouseX, [-160, 160], [-7, 7]); // Adjusted range

  useEffect(() => {
    const createdParticles = [];
    const createdDataStreams = [];

    const particleIntervalId = setupParticleEffect(particlesContainerRef.current, createdParticles, styles);
    setupDataStreamEffect(dataStreamContainerRef.current, createdDataStreams, styles);

    return () => {
      if (particleIntervalId) clearInterval(particleIntervalId);
      createdParticles.forEach(p => p.remove());
      createdDataStreams.forEach(s => s.remove());
    };
  }, []);

  return (
    <section
      style={{ perspective: '1600px' }} // Slightly reduced perspective
      className="min-h-[85vh] py-20 md:py-28 flex items-center justify-center bg-black relative overflow-hidden isolate" // Adjusted padding and min-height
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- Background Elements Container --- */}
      <div ref={particlesContainerRef} id="particles-container-unique-id" className="absolute inset-0 z-0 overflow-hidden">
        <div aria-hidden="true" className={`absolute inset-0 z-[-3] ${styles.gridBackground}`} />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[-2] opacity-60 mix-blend-screen" // Slightly reduced opacity
          style={{
            animation: `${styles.auroraShift} 16s linear infinite alternate`, // Slightly slower
            backgroundImage: `
              radial-gradient(at 20% 80%, hsla(210, 90%, 70%, 0.25) 0px, transparent 55%),
              radial-gradient(at 80% 10%, hsla(180, 85%, 60%, 0.2) 0px, transparent 55%),
              radial-gradient(at 5% 30%, hsla(300, 90%, 70%, 0.15) 0px, transparent 50%),
              radial-gradient(at 95% 75%, hsla(120, 90%, 70%, 0.15) 0px, transparent 50%)
            `, // Simplified gradients
            backgroundSize: '180% 180%', // Adjusted size
            filter: 'blur(25px)', // Slightly less blur
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[-1] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.95) 100%)' }} // Adjusted vignette
        />
        <AnimatedGeometricShapes styles={styles} />
        <div ref={dataStreamContainerRef} className={styles.dataStreamContainer} />
      </div>

      {/* --- Content Container --- */}
      <motion.div
        ref={cardRef}
        className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center"
        style={{ rotateX, rotateY, transition: 'transform 0.05s linear' }}
        initial={{ opacity: 0, y: 25 }}
        animate={{
          opacity: 1, y: 0,
          transition: { duration: 0.6, ease: [0.1, 0.7, 0.3, 1.0], staggerChildren: 0.08 }
        }}
      >
        <motion.div
          className={styles.versionAnnouncement}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className={`${styles.versionPill} text-sm`}>🎉 LeetAI v1.0 is Live!</span> {/* Slightly smaller text */}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Reduced largest font size
          className={`${styles.glowingText} text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none mb-3 text-white tracking-tight relative`}
        >
          <span className={styles.textHighlight}></span>
          Leet<span className={styles.silverText}>AI</span>: Your Undetectable Edge
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl text-cyan-400 mb-5 font-medium tracking-tight" // Reduced bottom margin
        >
          Ace Interviews. Focus on <span className="text-white underline decoration-cyan-500/70 decoration-2 underline-offset-2">Solving</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          // Shortened paragraph, reduced max-width and bottom margin
          className="text-base text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed"
        >
          LeetAI runs silently, taking the pressure off interviews. Demonstrate your problem-solving skills, not just memory, and conquer coding challenges.
        </motion.p>

        {/* Simplified Key Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          // Uses md:grid-cols-3 for a more compact layout on medium screens
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-lg sm:max-w-2xl mx-auto mb-8" // Reduced gaps and max-width
        >
          {heroFeaturesData.map((feature, index) => (
            <HeroFeatureItem
              key={index}
              IconComponent={feature.IconComponent}
              title={feature.title}
              description={feature.description}
              iconColorClass={feature.iconColorClass}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4" // Reduced spacing
        >
          <motion.button
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 30px rgba(100, 200, 255, 0.6)", // Slightly reduced glow
              transition: { type: "spring", stiffness: 300, damping: 10 }
            }}
            whileTap={{ scale: 0.97 }}
            // Adjusted padding and text size
            className={`${styles.ultimateCTAButton} group relative inline-flex items-center justify-center gap-x-2 py-3 px-7 md:px-8 rounded-md text-base md:text-lg font-semibold overflow-hidden w-full sm:w-auto`}
          >
            <span className={styles.buttonGlow}></span>
            <span className={styles.buttonBorder}></span>
            <span className={styles.buttonBg}></span>
            <span className="relative z-20">Get LeetAI Now</span>
            <motion.span
              className="relative z-20 inline-block"
              animate={{ x: [0, 5, 0] }} // Slightly reduced movement
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
            >
              <FiArrowRight className="w-5 h-5" /> {/* Slightly smaller icon */}
            </motion.span>
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.03,
              borderColor: '#9ae6b4', // Changed to a soft green for subtle difference
              color: '#ffffff',
              boxShadow: "0 0 20px rgba(154, 230, 180, 0.3)",
              backgroundColor: 'rgba(154, 230, 180, 0.1)',
            }}
            whileTap={{ scale: 0.98 }}
            // Adjusted padding and text size
            className="backdrop-blur-sm border border-gray-500 text-gray-200 hover:text-white font-medium py-3 px-7 rounded-md text-base transition-all duration-200 w-full sm:w-auto"
          >
            How it Works
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;