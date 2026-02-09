import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function StatusLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const storedLogs = localStorage.getItem('status_logs');
        if (storedLogs) {
            setLogs(JSON.parse(storedLogs));
        }
      } catch (e) {
        console.error("Failed to load logs from localStorage", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-[#113b39]/50">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
            <Link to="/status" className="flex items-center gap-3 group">
                <div className="p-2 bg-[#113b39]/20 rounded-lg group-hover:bg-[#113b39]/40 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#113b39]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                </div>
                <span className="font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Back to Status</span>
            </Link>
          <img src="/logo_pt.png" alt="Logo" className="h-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
        </header>

        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white">System Logs</h1>
            <p className="text-slate-400 text-sm">Showing available history for the last 48 hours.</p>
        </div>

        {/* Logs Table */}
        <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-white/5 text-slate-200 font-semibold uppercase tracking-wider text-xs">
                    <tr>
                        <th className="p-4">Time</th>
                        <th className="p-4">System</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {loading ? (
                        <tr>
                            <td colSpan="4" className="p-8 text-center text-slate-500 animate-pulse">
                                Loading system logs...
                            </td>
                        </tr>
                    ) : logs.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="p-8 text-center text-slate-500 italic">
                                No logs recorded yet in the database.
                            </td>
                        </tr>
                    ) : (
                        logs.map((log, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 whitespace-nowrap font-mono text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-4">{log.system}</td>
                                <td className="p-4">
                                    <span className={`
                                        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                        ${log.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                          log.status === 'outage' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                          'bg-slate-500/10 text-slate-400 border border-slate-500/20'}
                                    `}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                            log.status === 'operational' ? 'bg-emerald-400' : 
                                            log.status === 'outage' ? 'bg-red-400' : 'bg-slate-400'
                                        }`}></span>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-xs opacity-75">
                                    {log.error || '-'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}
