import React from 'react';
import { ArrowRight, CheckCircle, X, ShieldAlert, Cpu } from 'lucide-react';

interface SmartRoutingModalProps {
  provider: string;
  health: number;
  onClose: () => void;
  onApply: () => void;
}

export default function SmartRoutingModal({ provider, health, onClose, onApply }: SmartRoutingModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-[#111] rounded-2xl shadow-2xl z-[101] overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Smart Routing Suggestion</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">Automated AI Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex items-start gap-4 p-4 mb-6 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10">
            <ShieldAlert className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-300">Degraded Provider Detected</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                <strong className="font-bold">{provider}</strong> health has fallen to <strong className="font-bold text-red-600 dark:text-red-400">{health}%</strong>. 
                FTN-AI suggests failing over traffic to secondary providers to maintain global latency SLAs.
              </p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">Proposed Configuration Diff</h3>
          
          <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden font-mono text-sm shadow-sm">
            <div className="grid grid-cols-2 bg-gray-100 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 dark:text-gray-400 p-2 px-4 uppercase tracking-wider">
              <div>Current (Failing)</div>
              <div>Proposed (Optimized)</div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-white/10">
              <div className="p-4 bg-red-50/50 dark:bg-red-500/5 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                  <X size={14} /> <span className="font-semibold">Removed Config</span>
                </div>
                <pre className="whitespace-pre-wrap">
{`route_map:
  primary: "${provider}"
  weight: 80
  failover: false
  health_check:
    interval: 10s
    timeout: 5s`}
                </pre>
              </div>
              <div className="p-4 bg-green-50/50 dark:bg-green-500/5 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                  <CheckCircle size={14} /> <span className="font-semibold">Added Config</span>
                </div>
                <pre className="whitespace-pre-wrap">
{`route_map:
  primary: "Cloudflare"
  secondary: "AWS"
  weight: 50
  failover: true
  health_check:
    interval: 5s
    timeout: 2s`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">1</div>
                  <span>Reroute traffic</span>
              </div>
              <ArrowRight size={16} className="hidden sm:block text-gray-300 dark:text-gray-600" />
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">2</div>
                  <span>Drain connections</span>
              </div>
              <ArrowRight size={16} className="hidden sm:block text-gray-300 dark:text-gray-600" />
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">3</div>
                  <span>Apply via Control API</span>
              </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a] flex justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            Ignore
          </button>
          <button onClick={onApply} className="px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2">
            Apply Configuration <Cpu size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
