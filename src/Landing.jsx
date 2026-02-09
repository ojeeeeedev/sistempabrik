import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [statusColor, setStatusColor] = useState('bg-slate-500');
  const [statusText, setStatusText] = useState('Checking...');

  useEffect(() => {
    const checkStatus = async () => {
        // Using CORS mode. If the server is up but doesn't support CORS, this will fail (Outage).
        // If the server is down (1033/5xx), this will also fail (Outage).
        // This is a strict check suitable for "System Status" where we prefer False Negative (saying down when up)
        // over False Positive (saying up when down) for the user to investigate.
        const results = await Promise.allSettled([
          fetch('/api-proxy/inventory', { method: 'HEAD' }),
          fetch('/api-proxy/cctv', { method: 'HEAD' })
        ]);

        const failures = results.filter(r => r.status === 'rejected' || (r.value && !r.value.ok)).length;

        if (failures === 0) {
          setStatusColor('bg-emerald-700');
          setStatusText('Operational');
        } else if (failures === results.length) {
          setStatusColor('bg-red-700');
          setStatusText('Outage');
        } else {
          setStatusColor('bg-amber-600');
          setStatusText('Degraded');
        }
    };
    
    checkStatus();
  }, []);

  return (
    <div className="h-screen bg-[#0a2423] text-slate-200 flex flex-col overflow-hidden relative selection:bg-[#113b39]/50">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
      </div>

      {/* Header */}
      <header className="w-full py-2 px-4 md:py-3 md:px-12 z-50 bg-white shadow-lg flex items-center justify-between shrink-0">
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
      <main className="flex-grow flex items-center justify-center w-full px-4 py-2 z-10">
        <div className="grid grid-cols-2 gap-4 md:gap-12 w-full max-w-sm md:max-w-2xl">
          
          {/* Card: Akses CCTV */}
          <MenuCard 
            title="CCTV Access" 
            delay={0.2}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <footer className="w-full bg-[#081c1b] border-t border-white/5 py-3 md:py-6 z-10 relative shrink-0">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 text-slate-400 text-[9px] md:text-sm"
          >
            {/* Address */}
            <div className="flex flex-col gap-1 md:gap-3">
              <h3 className="text-white font-semibold uppercase tracking-wider mb-0.5">Office</h3>
              <a 
                href="https://maps.app.goo.gl/KPtoJYo3Kouk47bg8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors leading-tight"
              >
                Jl. Raya Ciomas No. 1, Ciawigebang,<br/>
                Kuningan 45591, West Java
              </a>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-1 md:gap-3">
              <h3 className="text-white font-semibold uppercase tracking-wider mb-0.5">Contact</h3>
              <a href="tel:+62232878966" className="hover:text-emerald-400 transition-colors">T. +62 232 878966</a>
              <a href="mailto:ukeyelashes@gmail.com" className="hover:text-emerald-400 transition-colors truncate">E. ukeyelashes@gmail.com</a>
            </div>

            {/* Copyright */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-3 md:text-right border-t border-white/5 pt-2 md:border-none md:pt-0 items-start md:items-end">
              <p>&copy; {new Date().getFullYear()} PT. UTAMA KORINDAH.<br className="hidden md:block" /> All rights reserved.</p>
              
              {/* Status Button */}
              <Link to="/status" className={`
                absolute bottom-full right-6 mb-6 z-50 shadow-2xl
                md:static md:mb-0 md:z-auto md:shadow-lg
                inline-flex items-center gap-2 px-4 py-2 md:py-1.5 rounded-full border border-white/10 transition-all text-xs font-semibold text-white group 
                ${statusColor} hover:brightness-110
              `}>
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:scale-125 transition-all"></span>
                {statusText}
              </Link>
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
        y: { duration: 0.15, ease: "easeOut" }
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2, ease: "easeOut" } 
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="
        relative group overflow-hidden w-full aspect-square rounded-3xl border
        flex flex-col items-center justify-center gap-3 md:gap-6 transition-colors duration-200
        bg-[#113b39]/10 backdrop-blur-md border-white/10 shadow-lg
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
        p-3 md:p-5 rounded-2xl bg-[#0a2423] ring-1 ring-white/10
        text-[#113b39] group-hover:text-emerald-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(17,59,57,0.3)]
        transition-all duration-300
      ">
        {icon}
      </div>

      <span className="
        text-base md:text-2xl font-semibold tracking-tight text-center px-4
        text-slate-200 group-hover:text-white transition-colors
      ">
        {title}
      </span>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#113b39] transition-all duration-500 group-hover:w-full" />
    </motion.button>
  );
}
