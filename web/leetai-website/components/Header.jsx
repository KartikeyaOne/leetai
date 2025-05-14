// components/Header.js
"use client";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; // Combined imports
import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';

// --- Animation Variants (Keep As Is) ---
const headerVariants = { /* ... */ };
const itemVariants = { /* ... */ };
const navLinkHover = { /* ... */ };
// --- Scroll Config (Keep As Is) ---
const SCROLL_THRESHOLD = 50;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Define background/shadow styles for consistency
  const scrolledBg = "bg-gray-950/80"; // Slightly darker base, good opacity
  const scrolledBlur = "backdrop-blur-lg";
  const scrolledShadow = "shadow-lg"; // Refined shadow

  const topBg = "bg-black/85";
  const topBlur = "backdrop-blur-md";
  const topBorder = ""; // Keep top border

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? `py-2 ${scrolledShadow}` : `py-0 shadow-sm ${topBorder}` // Apply shadow/border to outer only
      )}
    >
      {/* Inner container: Handles width, margin, rounding, AND background/blur */}
      <div
        className={clsx(
          "mx-auto transition-all duration-300 ease-in-out",
           // Apply background, blur directly here now
          isScrolled
            ? `mt-2 max-w-6xl rounded-xl ${scrolledBg} ${scrolledBlur}` // Added background/blur, slightly less margin-top
            : `max-w-none rounded-none ${topBg} ${topBlur}` // Apply top bg/blur here too
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={clsx(
              "flex justify-between items-center transition-height duration-300 ease-in-out",
              isScrolled ? "h-14 md:h-16" : "h-16 md:h-20"
            )}
          >
            {/* Logo */}
            <motion.div variants={itemVariants}>
                <motion.div
                    whileHover={{ scale: 1.03, rotateZ: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                    <Link href="/" legacyBehavior>
                        <a
                            className={clsx(
                                "font-bold text-white transition-all duration-300 ease-in-out flex items-center group", // Added group for hover effect below
                                isScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
                            )}
                            onClick={closeMobileMenu}
                        >
                            Leet
                            <span className="relative ml-px inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-500">
                                    AI
                                </span>
                                {/* Adjusted Glow */}
                                <span className="absolute -inset-1 blur-sm group-hover:opacity-75 opacity-0 bg-gradient-to-r from-cyan-500/30 via-white/30 to-cyan-600/30 transition-opacity duration-300 rounded-full" aria-hidden="true"></span>
                            </span>
                        </a>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav
              variants={itemVariants}
              className="hidden md:flex items-center space-x-8"
            >
               {/* Added focus styles for accessibility */}
               <NavLinkDesktop href="/#features">Features</NavLinkDesktop>
               <NavLinkDesktop href="/about">About</NavLinkDesktop>
               <NavLinkDesktop href="/#pricing">Pricing</NavLinkDesktop>
               <NavLinkDesktop href="/policies">Policies</NavLinkDesktop>
            </motion.nav>

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 md:gap-4">
              {/* Login Button */}
               <motion.button
                 initial={{ background: 'transparent', color: '#e5e7eb', borderColor: '#6b7280' }}
                 whileHover={{
                   scale: 1.05,
                   background: 'rgba(6, 182, 212, 0.1)',
                   borderColor: '#22d3ee',
                   color: '#ffffff',
                   boxShadow: "0px 0px 15px rgba(34, 211, 238, 0.3)"
                 }}
                 whileTap={{ scale: 0.97, opacity: 0.9 }}
                 transition={{ duration: 0.2, ease: 'easeInOut' }}
                 className="hidden md:inline-block font-semibold py-2 px-5 rounded-lg border transition-colors text-gray-200 border-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                 // onClick={() => router.push('/login')}
               >
                 Login
               </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-400 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-600 rounded-md"
                aria-label="Open main menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <motion.path
                    strokeLinecap="round" strokeLinejoin="round"
                    variants={{ closed: { d: "M4 6h16M4 12h16M4 18h16" }, open: { d: "M6 18L18 6M6 6l12 12" } }}
                    animate={isMobileMenuOpen ? "open" : "closed"}
                    initial={false}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                   />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }} // Slightly faster exit
            className={clsx(
                "md:hidden absolute top-full left-0 right-0 shadow-xl", // Use shadow-xl for consistency
                // Apply matching background/blur for the dropdown
                isScrolled ? `${scrolledBg} ${scrolledBlur}` : `${topBg} ${topBlur}`
            )}
            // Adjust width/position/rounding when header is shrunk
             style={isScrolled ? { width: 'calc(100% - 1rem)', left: '0.5rem', right: '0.5rem', margin: '0 auto', borderRadius: '0 0 0.75rem 0.75rem' } : { borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} // Add top border only when *not* scrolled
          >
            <nav className="px-4 pt-4 pb-5 space-y-3">
              <MobileNavLink href="/#features" closeMenu={closeMobileMenu}>Features</MobileNavLink>
              <MobileNavLink href="/about" closeMenu={closeMobileMenu}>About</MobileNavLink>
              <MobileNavLink href="/#pricing" closeMenu={closeMobileMenu}>Pricing</MobileNavLink>
               <MobileNavLink href="/policies" closeMenu={closeMobileMenu}>Policies</MobileNavLink>
              <MobileNavLink href="/login" isButton closeMenu={closeMobileMenu}>Login</MobileNavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Helper Components ---

// Desktop Nav Link Helper
const NavLinkDesktop = ({ href, children }) => (
    <Link href={href} legacyBehavior passHref>
        <motion.a
            initial={{ color: '#d1d5db' }}
            whileHover={navLinkHover}
            className="text-base font-medium cursor-pointer text-gray-300 focus:outline-none focus:text-white focus:underline underline-offset-4 rounded" // Added focus style
        >
            {children}
        </motion.a>
    </Link>
);


// Mobile Nav Link Helper (Keep As Is)
const MobileNavLink = ({ href, children, isButton = false, closeMenu }) => (
  <Link href={href} legacyBehavior>
    <a
      onClick={closeMenu}
      className={clsx(
        "block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-600/50", // Added focus style
        isButton
          ? "bg-cyan-600/80 text-white hover:bg-cyan-500/80 text-center"
          : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
      )}
    >
      {children}
    </a>
  </Link>
);


export default Header;