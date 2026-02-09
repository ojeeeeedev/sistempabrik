import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const monitors = [
  { id: 'inventory', name: 'Inventory System', url: 'https://inventory.utamakorindah.com' },
  { id: 'cctv', name: 'CCTV System', url: 'https://cctv.utamakorindah.com' },
];

export default function StatusPage() {
  const [monitorData, setMonitorData] = useState({});
  const [globalStatus, setGlobalStatus] = useState('checking'); 
  const [lastChecked, setLastChecked] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');

  const checkStatus = useCallback(async (manual) => {
      const isManual = manual === true || (typeof manual === 'object' && manual !== null);
      setIsRefreshing(true);
      
      if (isManual) {
        // Add a 2 second delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      let currentStatus = {};
      
      // Client-Side Check
      for (const monitor of monitors) {
          try {
              const checkUrl = monitor.id === 'inventory' ? '/api-proxy/inventory' : '/api-proxy/cctv';
              const res = await fetch(checkUrl, { method: 'HEAD' });
              if (res.status >= 520 && res.status <= 530) {
                    currentStatus[monitor.id] = { status: 'outage', error: `Cloudflare Error ${res.status}` };
              } else if (!res.ok) {
                    currentStatus[monitor.id] = { status: 'outage', error: `Error ${res.status}` };
              } else {
                    currentStatus[monitor.id] = { status: 'operational', error: null };
              }
          } catch (error) {
              currentStatus[monitor.id] = { status: 'outage', error: "Connection Failed" };
          }
      }

      // Update State
      setMonitorData(currentStatus);
      setLastChecked(new Date());

      // Global Status Logic
      const values = Object.values(currentStatus);
      let gStatus = 'degraded';
      if (values.every(d => d.status === 'operational')) gStatus = 'operational';
      else if (values.every(d => d.status === 'outage')) gStatus = 'outage';
      setGlobalStatus(gStatus);
      
      // Save to LocalStorage
      const logEntries = Object.entries(currentStatus).map(([id, data]) => ({
          timestamp: new Date().toISOString(),
          system: monitors.find(m => m.id === id)?.name || id,
          status: data.status,
          error: data.error
      }));
      
      try {
          const existingLogs = JSON.parse(localStorage.getItem('status_logs') || '[]');
          const updatedLogs = [...logEntries, ...existingLogs].slice(0, 100); 
          localStorage.setItem('status_logs', JSON.stringify(updatedLogs));
      } catch (e) {
          console.error("Failed to save logs to localStorage", e);
      }

      setIsRefreshing(false);

      if (isManual) {
          setToastType(gStatus === 'operational' ? 'success' : 'error');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
      }
    }, []);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 300000); // 5 mins
    return () => clearInterval(interval);
  }, [checkStatus]);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-[#113b39]/50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-8 md:gap-12">
        
        {/* Header */}
        <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                <div className="p-1.5 md:p-2 bg-[#113b39]/20 rounded-lg group-hover:bg-[#113b39]/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-[#113b39]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                </div>
                <span className="font-semibold text-sm md:text-base text-slate-400 group-hover:text-slate-200 transition-colors">Portal</span>
            </Link>
          <img src="/logo_pt.png" alt="Logo" className="h-8 md:h-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
        </header>

        {/* Global Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            w-full p-6 md:p-8 rounded-2xl border flex items-center justify-between shadow-2xl
            ${globalStatus === 'operational' ? 'bg-[#113b39]/10 border-[#113b39]/50' : 
              globalStatus === 'checking' ? 'bg-slate-900 border-slate-800' : 'bg-red-900/20 border-red-900/60'}
          `}
        >
          <div className="flex flex-col gap-1 pr-4">
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight leading-tight">
              {globalStatus === 'operational' ? 'All Systems Operational' : 
               globalStatus === 'checking' ? 'Checking Systems...' : 
               globalStatus === 'degraded' ? 'Partial Service' : 'System Outage'}
            </h1>
            <div className="flex items-center gap-3">
                <p className="text-xs md:text-sm text-slate-400">
                    {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Initializing monitor...'}
                </p>
                <button 
                    onClick={checkStatus} 
                    disabled={isRefreshing}
                    className={`
                        cursor-pointer group flex items-center 
                        fixed bottom-6 right-6 z-50 px-4 py-3 gap-2 rounded-full bg-slate-800 border border-slate-700 shadow-2xl
                        md:static md:z-auto md:px-2 md:py-2 md:gap-0 md:hover:gap-2 md:bg-white/5 md:hover:bg-white/10 md:border-white/10 md:shadow-none
                        transition-all duration-300 
                        ${isRefreshing ? 'animate-pulse' : ''}
                    `}
                    title="Refresh Status"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-white md:text-slate-400 md:group-hover:text-white transition-colors ${isRefreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                    <span className="md:hidden text-sm font-medium text-white">
                        Refresh
                    </span>
                    <span className="hidden md:block max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 text-xs font-medium text-slate-300 group-hover:text-white whitespace-nowrap">
                        Refresh Status
                    </span>
                </button>
            </div>
          </div>
          <div className={`
            h-4 w-4 md:h-6 md:w-6 rounded-full shrink-0 shadow-[0_0_20px_currentColor] animate-pulse
            ${globalStatus === 'operational' ? 'bg-emerald-700 text-emerald-700' : 
              globalStatus === 'checking' ? 'bg-slate-500 text-slate-500' : 'bg-red-700 text-red-700'}
          `} />
        </motion.div>

        {/* Monitors List */}
        <div className="flex flex-col gap-4 md:gap-6">
          {monitors.map((monitor, index) => {
            const data = monitorData[monitor.id] || { status: 'checking', error: null };
            return (
              <MonitorCard 
                  key={monitor.id} 
                  monitor={monitor} 
                  status={data.status}
                  error={data.error}
                  delay={index * 0.1}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center md:justify-end gap-6 text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full bg-emerald-700"></span>
                Operational
            </div>
            <div className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full bg-red-700"></span>
                Outage
            </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 ${
                        toastType === 'success' ? 'bg-white text-slate-900' : 'bg-red-900 text-white border border-red-700'
                    }`}
                >
                    {toastType === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    )}
                    <span className="font-semibold text-xs text-wrap: pretty">{toastType === 'success' ? 'Update Successful' : 'Issues Detected'}</span>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MonitorCard({ monitor, status, error, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 md:p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm flex flex-col gap-4 md:gap-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2.5 md:p-3 rounded-full shrink-0 ${
                status === 'operational' ? 'bg-emerald-900/20 text-emerald-600' :
                status === 'checking' ? 'bg-slate-500/10 text-slate-500' :
                'bg-red-900/20 text-red-600'
            }`}>
                {status === 'operational' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                ) : status === 'outage' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base md:text-lg text-slate-200 truncate">{monitor.name}</h3>
                <div className="flex flex-col">
                    <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs text-slate-500 hover:text-emerald-400 transition-colors truncate block">
                        {monitor.url.replace('https://', '')}
                    </a>
                    {error && (
                        <span className="text-[9px] md:text-[10px] text-red-600 mt-1 font-mono break-words">{error}</span>
                    )}
                </div>
            </div>
          </div>

          <div className={`
            self-start sm:self-auto flex items-center gap-2 text-[10px] md:text-sm font-medium px-3 md:px-4 py-1 md:py-1.5 rounded-full border
            ${status === 'operational' ? 'bg-emerald-900/20 text-emerald-600 border-emerald-900/30' : 
            status === 'checking' ? 'bg-slate-500/5 text-slate-400 border-slate-500/20' : 
            'bg-red-900/20 text-red-600 border-red-900/30'}
          `}>
            {status === 'operational' ? 'Operational' : status === 'checking' ? 'Checking...' : 'Down'}
          </div>
      </div>
    </motion.div>
  );
}