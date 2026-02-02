import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const monitors = [
  { id: 'inventory', name: 'Inventory System', url: 'https://inventory.utamakorindah.com' },
  { id: 'cctv', name: 'CCTV System', url: 'https://cctv.utamakorindah.com' },
];

export default function StatusPage() {
  const [monitorData, setMonitorData] = useState({});
  const [globalStatus, setGlobalStatus] = useState('checking'); 
  const [lastChecked, setLastChecked] = useState(null);
  const [history, setHistory] = useState([]); // Graph data

  useEffect(() => {
    const checkStatus = async () => {
      let currentStatus = {};
      let apiHistory = [];
      
      // Perform Check
      try {
        const apiRes = await fetch('/api/status');
        if (apiRes.ok) {
            const data = await apiRes.json();
            currentStatus = data.current;
            apiHistory = data.history || [];
        } else {
            throw new Error("API not available");
        }
      } catch (e) {
        // Fallback Client-Side
        for (const monitor of monitors) {
            try {
                const res = await fetch(monitor.url, { mode: 'cors', method: 'HEAD' });
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
        // In fallback mode, we have no history
        apiHistory = []; 
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

      // Generate Graph from API History
      generateGraphData(apiHistory);
    };

    const generateGraphData = (logs) => {
        // We need 48 bars, representing the last 48 hours.
        const bars = [];
        const now = new Date();
        now.setMinutes(0, 0, 0); // Round down to current hour

        for (let i = 47; i >= 0; i--) {
            const hourStart = new Date(now);
            hourStart.setHours(hourStart.getHours() - i);
            const hourEnd = new Date(hourStart);
            hourEnd.setHours(hourEnd.getHours() + 1);

            // Find logs in this hour
            const logsInHour = logs.filter(l => {
                const t = new Date(l.timestamp);
                return t >= hourStart && t < hourEnd;
            });

            if (logsInHour.length === 0) {
                // No data -> Dark bar
                bars.push({ status: 'nodata', time: hourStart });
            } else {
                // Priority: Outage > Operational.
                const hasOutage = logsInHour.some(l => l.status === 'outage');
                bars.push({ status: hasOutage ? 'outage' : 'operational', time: hourStart });
            }
        }
        setHistory(bars);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-[#113b39]/50">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {/* Header */}
        <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 bg-[#113b39]/20 rounded-lg group-hover:bg-[#113b39]/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#113b39]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                </div>
                <span className="font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Back to Portal</span>
            </Link>
          <img src="/logo_pt.png" alt="Logo" className="h-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
        </header>

        {/* Global Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            w-full p-8 rounded-2xl border flex items-center justify-between shadow-2xl
            ${globalStatus === 'operational' ? 'bg-[#113b39]/10 border-[#113b39]/50' : 
              globalStatus === 'checking' ? 'bg-slate-900 border-slate-800' : 'bg-red-900/20 border-red-900/60'}
          `}
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {globalStatus === 'operational' ? 'All Systems Operational' : 
               globalStatus === 'checking' ? 'Checking Systems...' : 
               globalStatus === 'degraded' ? 'Partial Service' : 'System Outage'}
            </h1>
            <p className="text-slate-400">
                {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Initializing monitor...'}
            </p>
          </div>
          <div className={`
            h-4 w-4 md:h-6 md:w-6 rounded-full shadow-[0_0_20px_currentColor] animate-pulse
            ${globalStatus === 'operational' ? 'bg-emerald-700 text-emerald-700' : 
              globalStatus === 'checking' ? 'bg-slate-500 text-slate-500' : 'bg-red-700 text-red-700'}
          `} />
        </motion.div>

        {/* Monitors List */}
        <div className="flex flex-col gap-6">
          {monitors.map((monitor, index) => {
            const data = monitorData[monitor.id] || { status: 'checking', error: null };
            return (
              <MonitorCard 
                  key={monitor.id} 
                  monitor={monitor} 
                  status={data.status}
                  error={data.error}
                  delay={index * 0.1}
                  history={history} 
              />
            );
          })}
        </div>

         <div className="flex justify-center">
            <Link to="/status/logs" className="text-slate-500 hover:text-emerald-400 text-sm font-mono underline underline-offset-4 decoration-slate-700 transition-colors">
                View System Logs
            </Link>
         </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-6 text-xs text-slate-500 font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full bg-emerald-700"></span>
                Operational
            </div>
            <div className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full bg-red-700"></span>
                Outage
            </div>
             <div className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full bg-slate-800 border border-slate-700"></span>
                No Data
            </div>
        </div>

      </div>
    </div>
  );
}

function MonitorCard({ monitor, status, error, delay, history }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
                status === 'operational' ? 'bg-emerald-900/20 text-emerald-600' :
                status === 'checking' ? 'bg-slate-500/10 text-slate-500' :
                'bg-red-900/20 text-red-600'
            }`}>
                {status === 'operational' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                ) : status === 'outage' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                )}
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-200">{monitor.name}</h3>
                <div className="flex flex-col">
                    <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">{monitor.url}</a>
                    {error && (
                        <span className="text-[10px] text-red-600 mt-1 font-mono">{error}</span>
                    )}
                </div>
            </div>
          </div>

          <div className={`
            flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full border
            ${status === 'operational' ? 'bg-emerald-900/20 text-emerald-600 border-emerald-900/30' : 
            status === 'checking' ? 'bg-slate-500/5 text-slate-400 border-slate-500/20' : 
            'bg-red-900/20 text-red-600 border-red-900/30'}
          `}>
            {status === 'operational' ? 'Operational' : status === 'checking' ? 'Checking...' : 'Down'}
          </div>
      </div>

      {/* Bar Graph */}
      <div className="flex items-end gap-[3px] h-8 w-full opacity-90">
        {history.map((h, i) => (
            <div 
                key={i} 
                className={`
                    flex-1 h-full rounded-sm transition-all duration-200 group relative
                    ${h.status === 'operational' ? 'bg-emerald-700/50 hover:bg-emerald-600' : 
                      h.status === 'outage' ? 'bg-red-700/50 hover:bg-red-600' : 'bg-slate-800/50 hover:bg-slate-700'}
                `}
            >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap z-50">
                    <div className="bg-slate-900 text-slate-200 text-[10px] px-2 py-1 rounded border border-white/10 shadow-xl">
                        {h.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <br/>
                        <span className={h.status === 'operational' ? 'text-emerald-600' : h.status === 'outage' ? 'text-red-600' : 'text-slate-500'}>
                           {h.status === 'nodata' ? 'No Data' : h.status === 'operational' ? 'Operational' : 'Outage'}
                        </span>
                    </div>
                </div>
            </div>
        ))}
      </div>
      <div className="flex justify-between -mt-3 text-[10px] text-slate-600 font-medium uppercase tracking-wider">
        <span>48h Ago</span>
        <span>Today</span>
      </div>
    </motion.div>
  );
}