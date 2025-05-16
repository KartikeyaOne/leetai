// components/Footer.js
"use client"; // Required for Framer Motion and event handlers

import Link from 'next/link';
import { motion } from 'framer-motion';
// Removed FiTwitter from imports as it's commented out
import { FiGithub, FiLinkedin } from 'react-icons/fi'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants (NO CHANGES HERE)
  const footerVariants = {
    hidden: { opacity: 0, y: 20 }, 
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Helper component for cleaner links (NO CHANGES HERE)
  const FooterLink = ({ href, children }) => (
    <Link href={href} legacyBehavior>
      <a className="text-sm text-gray-400 hover:text-cyan-300 transition-colors duration-300 hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded px-1 py-0.5">
        {children}
      </a>
    </Link>
  );

  // Helper component for cleaner social links (NO CHANGES HERE)
 const SocialLink = ({ href, children, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label} 
      className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1"
    >
      {children}
    </a>
  );


  return (
    <motion.footer
      className="bg-gray-950 border-t border-gray-800/60 relative overflow-hidden" 
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} 
    >
      {/* Subtle Background Elements (NO CHANGES HERE) */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-800/30 to-transparent opacity-50" 
      ></div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 opacity-[0.02]" style={{backgroundImage: 'linear-gradient(to right, #52525b 0.5px, transparent 0.5px), linear-gradient(to bottom, #52525b 0.5px, transparent 0.5px)', backgroundSize: '25px 25px'}}></div>

      {/* Main Content Area (NO CHANGES HERE) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">

          {/* Left Side: Brand & Copyright (NO CHANGES HERE) */}
          <div className="text-center md:text-left">
            <Link href="/" legacyBehavior>
              <a className="text-xl font-bold text-gray-100 hover:text-white transition-colors duration-300 mb-2 inline-block focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded px-1">
                Leet<span className="text-cyan-400">AI</span> 
              </a>
            </Link>
            <p className="text-xs text-gray-500"> 
              © {currentYear} LeetAI. All rights reserved. 
            </p>
          </div>

          {/* Right Side: Navigation & Social Links */}
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
             {/* Footer Navigation (NO CHANGES HERE) */}
             <nav className="flex flex-wrap justify-center items-center gap-x-5 sm:gap-x-6 gap-y-2">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/about#faq">FAQ</FooterLink> 
                <FooterLink href="/terms">Terms</FooterLink> 
                <FooterLink href="/policies">Privacy Policies</FooterLink> 
                <FooterLink href="/contact">Contact</FooterLink>
             </nav>

             {/* Social Icons */}
             <div className="flex space-x-4 items-center sm:pl-6 sm:ml-6 sm:border-l border-gray-700/60">
                {/* UPDATED GitHub Link */}
                <SocialLink href="https://github.com/KartikeyaOne/leetai" label="GitHub">
                   <FiGithub className="w-5 h-5" /> 
                </SocialLink>
                {/* COMMENTED OUT Twitter Link
                 <SocialLink href="https://twitter.com/YOUR_TWITTER" label="Twitter">
                    <FiTwitter className="w-5 h-5" />
                 </SocialLink>
                */}
                 {/* UPDATED LinkedIn Link */}
                 <SocialLink href="https://www.linkedin.com/in/kartikeyaasharmaa/" label="LinkedIn">
                     <FiLinkedin className="w-5 h-5" /> 
                 </SocialLink>
            </div>
          </div>

        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;