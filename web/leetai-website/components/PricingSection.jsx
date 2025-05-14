// components/PricingSection.js
"use client";

import { motion } from 'framer-motion';
import { LuCheck, LuZap, LuStar, LuDatabaseZap } from 'react-icons/lu';
import React from 'react';

// --- HUMANIZED Pricing Plans Data ---
const pricingPlans = [
  {
    title: 'Essential',
    price: '$10',
    frequency: '/month',
    description: 'Great if you need a helping hand now and then, or just want to try things out.', // Humanized description
    credits: 50,
    features: [
      { text: '50 Credits/Month', icon: LuDatabaseZap, highlight: true },
      { text: 'Standard AI Help', icon: LuCheck }, // Slightly rephrased
      { text: 'Works on Major Platforms', icon: LuCheck }, // Rephrased
      { text: 'Standard Response Speed', icon: LuCheck },
      { text: 'Community Forum Access', icon: LuCheck }, // Rephrased
      { text: 'Undetectable Performance', icon: LuCheck }, // Rephrased
    ],
    cta: 'Get Started', // Standard CTA
    popular: false,
    delay: 0.1,
  },
  {
    title: 'Pro',
    price: '$25',
    frequency: '/month',
    description: 'The go-to choice for serious coders and frequent interviewees who want the full toolkit.', // Humanized description
    credits: 50,
    features: [
      { text: '50 Credits/Month', icon: LuDatabaseZap, highlight: true },
      { text: 'Everything in Essential, plus:', icon: LuCheck, highlight: true }, // Standard phrasing
      { text: 'Smarter AI (Auto Model Switching)', icon: LuCheck }, // Humanized feature
      { text: 'Faster Email Support', icon: LuCheck }, // Humanized feature
      { text: 'Quicker Responses', icon: LuCheck }, // Humanized feature
      // { text: 'Advanced Undetectable Mode', icon: LuCheck }, // Kept commented out
      // { text: 'Real-Time Solutions & Explanations', icon: LuCheck }, // Kept commented out
      // { text: 'Seamless Integration (All Platforms)', icon: LuCheck }, // Kept commented out
    ],
    cta: 'Go Pro', // Humanized CTA
    popular: true,
    delay: 0.2,
  },
];

// Animation Variants (No changes needed)
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay,
      duration: 0.6,
    },
  }),
};

const PricingSection = () => {
  return (
    <section id="pricing" className="bg-black py-24 lg:py-32 relative overflow-hidden">
      {/* Background Elements (No changes needed) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 opacity-[0.08] blur-[120px]"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, hsla(200, 80%, 70%, 0.3), transparent 60%),
            radial-gradient(circle at 80% 70%, hsla(280, 70%, 60%, 0.25), transparent 60%),
            radial-gradient(circle at 50% 90%, hsla(0, 0%, 100%, 0.15), transparent 50%)
          `,
          backgroundSize: '150% 150%',
          animation: 'pulseGlow 15s ease-in-out infinite alternate',
        }}
      />
       <div
         aria-hidden="true"
         className="absolute inset-0 z-[-1] opacity-[0.06]"
         style={{
           backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
           backgroundSize: '40px 40px',
         }}
       ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - HUMANIZED */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-20"
        >
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400">
               Simple Pricing, Powerful Advantage {/* Humanized Title */}
             </span>
           </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
             Pick the plan that fits how you work. No complicated tiers, just straightforward pricing to give you the boost you need. {/* Humanized Description */}
          </p>
           <p className="text-sm text-gray-500 mt-4">
             Heads up: Usage is credit-based (like 1 credit per answer, 0.5 per screenshot). Plans give you a monthly stash. {/* Humanized Credit Info */}
           </p>
        </motion.div>

        {/* Pricing Grid (No changes needed structurally) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {pricingPlans.map((plan, index) => {
            const iconColor = plan.popular ? 'text-cyan-400' : 'text-green-500';
            const highlightIconColor = plan.popular ? 'text-cyan-300' : 'text-teal-400';

            return (
            <motion.div
              key={index}
              custom={plan.delay}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
              className={`
                relative flex flex-col rounded-xl overflow-hidden h-full
                border backdrop-blur-md
                transition-all duration-300 ease-out group
                ${plan.popular
                  ? 'border-cyan-400/60 bg-gradient-to-br from-gray-900/80 via-black/70 to-cyan-900/30 shadow-cyan-500/20 shadow-2xl'
                  : 'border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-black/70 hover:border-gray-500/70'
                }
              `}
            >
              {/* Popular Badge (No changes needed) */}
              {plan.popular && (
                <div className="absolute top-0 right-0 mr-5 mt-5 z-20">
                  <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                    <LuStar className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Subtle Glow Effect (No changes needed) */}
              <div className={`absolute inset-0 z-[-1] opacity-0 ${plan.popular ? 'group-hover:opacity-40' : 'group-hover:opacity-20'} transition-opacity duration-500`}
                   style={{
                      background: plan.popular
                        ? 'radial-gradient(circle at center, rgba(0, 220, 255, 0.3) 0%, transparent 70%)'
                        : 'radial-gradient(circle at center, rgba(200, 200, 200, 0.15) 0%, transparent 70%)',
                   }}
              />

              {/* Card Content */}
              <div className="p-6 lg:p-8 flex flex-col flex-grow">
                {/* Plan Header - Displays Humanized Description */}
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">{plan.title}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price (No changes needed) */}
                <div className="mb-8 flex items-baseline">
                  <span className={`text-4xl lg:text-5xl font-bold tracking-tight ${plan.popular ? 'text-cyan-300' : 'text-white'}`}>{plan.price}</span>
                  <span className="ml-1 text-lg text-gray-400">{plan.frequency}</span>
                </div>

                {/* Features List - Displays Humanized Features */}
                <ul className="space-y-3 text-sm mb-10 flex-grow">
                  {plan.features.map((feature, fIndex) => {
                    const CurrentIcon = feature.icon;
                    const currentIconColor = feature.highlight ? highlightIconColor : iconColor;
                    const textStyle = feature.highlight ? 'font-semibold text-gray-200' : 'text-gray-300';

                    return (
                      <li key={fIndex} className="flex items-start">
                        <CurrentIcon className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${currentIconColor}`} />
                        <span className={textStyle}>{feature.text}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA Button - Displays Humanized CTA */}
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: plan.popular
                        ? "0 0 25px rgba(0, 220, 255, 0.5)"
                        : "0 0 20px rgba(255, 255, 255, 0.25)",
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full mt-auto py-3 px-6 rounded-lg text-base font-semibold transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
                    ${plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white focus:ring-cyan-500 shadow-lg hover:shadow-cyan-500/40'
                      : 'bg-white/10 hover:bg-white/20 border border-gray-600 hover:border-gray-400 text-gray-200 focus:ring-gray-500'
                    }
                  `}
                >
                  {plan.cta}
                  <LuZap className="inline-block w-4 h-4 ml-2 opacity-70" />
                </motion.button>
              </div>
            </motion.div>
            );
          })}
        </motion.div>

        {/* Optional Footer Info - HUMANIZED */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, amount: 0.5 }}
           transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
           className="text-center mt-16 text-gray-500 text-sm leading-relaxed" // Added leading-relaxed for better spacing
        >
           Need a bigger plan or something custom for your team?{' '}
           <a href="#contact" className="text-cyan-400 hover:text-cyan-300 underline">Get in touch</a>.
           <br /> Try it risk-free! All plans have a 24 hours money-back guarantee.
        </motion.div>

      </div>
       {/* Keyframes for background animation (No changes needed) */}
       <style jsx>{`
         @keyframes pulseGlow {
           0% { transform: scale(1); opacity: 0.08; }
           50% { transform: scale(1.1); opacity: 0.12; }
           100% { transform: scale(1); opacity: 0.08; }
         }
       `}</style>
    </section>
  );
};

export default PricingSection;