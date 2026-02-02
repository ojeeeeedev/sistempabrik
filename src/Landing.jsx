import React from 'react';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a2423] text-slate-200 flex flex-col overflow-hidden relative selection:bg-[#113b39]/50">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
      </div>

      {/* Header */}
      <header className="w-full py-3 px-4 md:py-4 md:px-12 z-20 bg-white shadow-lg flex items-center justify-between">
        {/* Left: Logo & Company Name */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <img src="/logo_pt.png" alt="PT Utama Korindah Logo" className="h-10 md:h-16 w-auto object-contain" />
          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-[#113b39] leading-tight">
              PT. UTAMA KORINDAH
            </h1>
            {/* Online Portal text for mobile - visible below name */}
            <h2 className="text-[10px] md:hidden font-bold text-slate-400 tracking-[0.2em] uppercase">
              Online Portal
            </h2>
          </div>
        </motion.div>

        {/* Right: H2 Content for Desktop */}
        <motion.h2 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-xl font-semibold text-slate-500 tracking-wider uppercase hidden md:block"
        >
          Online Portal
        </motion.h2>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center w-full px-4 z-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Card: Akses CCTV */}
          <MenuCard 
            title="CCTV Access" 
            delay={0.2}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            }
            onClick={() => window.location.href = "https://cctv.utamakorindah.com"}
          />

          {/* Card: Akses IT Inventory */}
          <MenuCard 
            title="IT Inventory Access" 
            delay={0.3}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            }
            onClick={() => window.location.href = "https://inventory.utamakorindah.com"}
          />

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#081c1b] border-t border-white/5 py-12 z-10 relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-400 text-sm"
          >
            {/* Address */}
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-semibold uppercase tracking-wider mb-1">Office</h3>
              <a 
                href="https://maps.app.goo.gl/NW1Wk3kG3Cc4CNf87" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex gap-2 items-start"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>
                  Jl. Raya Ciomas No. 1 RT. 04 RW. 02<br/>
                  Desa Ciomas, Ciawigebang,<br/>
                  Kuningan 45591 - West Java - Indonesia
                </span>
              </a>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <h3 className="text-white font-semibold uppercase tracking-wider mb-1">Contact</h3>
              <div className="flex flex-col gap-2">
                <a href="tel:+62232878966" className="hover:text-emerald-400 transition-colors flex gap-2 items-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  T. +62 232 878966
                </a>
                <div className="flex gap-2 items-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  <span>F. +62 232 878965</span>
                </div>
                <a href="mailto:ukeyelashes@gmail.com" className="hover:text-emerald-400 transition-colors flex gap-2 items-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  E. ukeyelashes@gmail.com
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col gap-3 md:text-right">
              <h3 className="text-white font-semibold uppercase tracking-wider mb-1">Legal</h3>
              <p>&copy; {new Date().getFullYear()} PT. UTAMA KORINDAH<br/>All rights reserved.</p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

function MenuCard({ title, icon, delay, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        // This ensures returning from hover is snappy
        y: { duration: 0.15, ease: "easeOut" }
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2, ease: "easeOut" } 
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="
        relative group overflow-hidden w-full h-48 md:h-56 rounded-3xl border
        flex flex-col items-center justify-center gap-6 transition-colors duration-200
        bg-[#113b39]/10 backdrop-blur-md border-white/10
        hover:border-[#113b39] hover:bg-[#113b39]/20 hover:shadow-[0_20px_40px_-15px_rgba(17,59,57,0.4)]
        cursor-pointer
      "
    >
      {/* Gloss Effect */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700
        bg-gradient-to-br from-white via-transparent to-transparent
      " />

      <div className="
        p-5 rounded-2xl bg-[#0a2423] ring-1 ring-white/10
        text-[#113b39] group-hover:text-emerald-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(17,59,57,0.3)]
        transition-all duration-300
      ">
        {icon}
      </div>

      <span className="
        text-xl md:text-2xl font-semibold tracking-tight
        text-slate-200 group-hover:text-white transition-colors
      ">
        {title}
      </span>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#113b39] transition-all duration-500 group-hover:w-full" />
    </motion.button>
  );
}
