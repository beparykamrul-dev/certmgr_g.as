/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Sidebar from './components/Sidebar';
import AlertBanner from './components/AlertBanner';
import LatencyChart from './components/LatencyChart';
import EventHistory from './components/EventHistory';
import ChatAssistant from './components/ChatAssistant';
import ProviderPanel from './components/ProviderPanel';
import AuditTrail from './components/AuditTrail';
import Forecast from './components/Forecast';
import TrafficMap from './components/TrafficMap';
import TrafficTrendChart from './components/TrafficTrendChart';
import CertStatusChart from './components/CertStatusChart';
import UserSettingsModal from './components/UserSettingsModal';
import SmartRoutingModal from './components/SmartRoutingModal';
import ErrorBoundary from './components/ErrorBoundary';
import SmartSilkRouting from './components/SmartSilkRouting';
import { Moon, Sun, Search, Download, TrendingUp, TrendingDown, Settings, RotateCcw, AlertTriangle, Monitor, Globe, Smartphone } from 'lucide-react';

const PROVIDER_GROUPS = {
  "Cloud": ["Google", "AWS", "Cloudflare", "Tencent Cloud", "Alibaba Cloud", "Oracle Cloud", "IBM Cloud", "Microsoft Azure"],
  "Media/CDN": ["Netflix", "Akamai", "Fastly", "Bunny", "Facebook/Meta", "TikTok/ByteDance"],
  "ISP/Other": ["EdgeNext", "Ookla", "IMO", "PUBG", "Free Fire", "DigitalOcean", "Linode", "Vultr", "Hetzner", "OVHcloud"]
};

const INITIAL_SECTIONS = [
  { id: "Network Traffic Trend", name: "Network Traffic Trend", status: 'green', trend: 'up' },
  { id: "Certificate Health", name: "Certificate Health", status: 'yellow', trend: 'down' },
  { id: "Traffic Intelligence", name: "Traffic Intelligence", status: 'green', trend: 'up' },
  { id: "Smart Silk Routing", name: "Smart Silk Routing", status: 'green', trend: 'up' },
  { id: "FTN-AI Integration", name: "FTN-AI Integration", status: 'yellow', trend: 'up' },
  { id: "Auth / RBAC", name: "Auth / RBAC", status: 'green', trend: 'down' },
  { id: "ACME / CFSSL", name: "ACME / CFSSL", status: 'green', trend: 'down' },
  { id: "Certificate Transparency", name: "Certificate Transparency", status: 'green', trend: 'up' },
  { id: "GitHub Integration", name: "GitHub Integration", status: 'green', trend: 'up' },
  { id: "Provider Intelligence", name: "Provider Intelligence", status: 'green', trend: 'down' },
  { id: "ASN / Prefix Registry", name: "ASN / Prefix Registry", status: 'green', trend: 'up' },
  { id: "Monitoring", name: "Monitoring", status: 'green', trend: 'down' },
  { id: "Alerting", name: "Alerting", status: 'green', trend: 'up' },
  { id: "Audit", name: "Audit", status: 'green', trend: 'up' },
  { id: "Policy Engine", name: "Policy Engine", status: 'green', trend: 'down' },
  { id: "Approval Workflow", name: "Approval Workflow", status: 'green', trend: 'up' },
  { id: "Service Controller", name: "Service Controller", status: 'green', trend: 'up' },
  { id: "Health / Readiness", name: "Health / Readiness", status: 'green', trend: 'down' },
  { id: "PostgreSQL Storage", name: "PostgreSQL Storage", status: 'green', trend: 'up' },
  { id: "Prometheus Metrics", name: "Prometheus Metrics", status: 'green', trend: 'up' },
  { id: "Docker", name: "Docker", status: 'green', trend: 'down' },
  { id: "Systemd", name: "Systemd", status: 'green', trend: 'up' },
  { id: "CI/CD", name: "CI/CD", status: 'green', trend: 'up' },
  { id: "Tests", name: "Tests", status: 'green', trend: 'down' }
];

const SortableSection = ({ section, context }: { section: any, context: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  const isChart = section.name === "Traffic Intelligence" || section.name === "Network Traffic Trend" || section.name === "Certificate Health" || section.name === "Smart Silk Routing";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`bg-white dark:bg-[#111] p-5 rounded-2xl shadow-sm border dark:border-white/5 border-gray-200 cursor-grab hover:shadow-md transition-shadow ${isChart ? 'md:col-span-2' : ''}`}>
      {section.name !== "Smart Silk Routing" && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
              <div className={`w-2.5 h-2.5 rounded-full ${section.status === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : section.status === 'yellow' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'} inline-block mr-3`} />
              <h2 className="text-[15px] font-bold tracking-tight text-gray-800 dark:text-gray-100">{section.name}</h2>
          </div>
          {section.trend === 'up' ? <TrendingUp size={16} className="text-green-500 dark:text-green-400" /> : <TrendingDown size={16} className="text-red-500 dark:text-red-400" />}
        </div>
      )}
      {section.name === "Traffic Intelligence" && <LatencyChart context={context} />}
      {section.name === "Network Traffic Trend" && <TrafficTrendChart context={context} />}
      {section.name === "Certificate Health" && <CertStatusChart />}
      {section.name === "Smart Silk Routing" && <SmartSilkRouting />}
      {!isChart && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
            section.status === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
            section.status === 'yellow' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
            'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
          }`}>
            {section.status.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('History');
  const [isConnected, setIsConnected] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [providerHealth, setProviderHealth] = useState<any[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [healthCount, setHealthCount] = useState<Record<string, number>>({});
  const [deviceContext, setDeviceContext] = useState('Global');
  const [, setPollInterval] = useState(5000);
  const [routingSuggestion, setRoutingSuggestion] = useState<{provider: string, health: number} | null>(null);
  const [ignoredSuggestions, setIgnoredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/network-status').then(res => res.json()).then(data => setIsConnected(data.connected)).catch(() => setIsConnected(false));
    
    const fetchHealth = () => fetch('/api/health-check').then(res => res.json()).then(data => {
        setProviderHealth(data);
        setHealthCount(prev => {
            const next = { ...prev };
            data.forEach((h: any) => {
                if (h.health < 75) next[h.name] = (next[h.name] || 0) + 1;
                else next[h.name] = 0;
            });
            return next;
        });

        // Smart Routing Detection
        setIgnoredSuggestions(prevIgnored => {
          setRoutingSuggestion(current => {
             if (current) return current; // Keep current modal open
             const degraded = data.find((h: any) => h.health < 60 && !prevIgnored.includes(h.name));
             if (degraded) {
               return { provider: degraded.name, health: degraded.health };
             }
             return null;
          });
          return prevIgnored;
        });
    });
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    const ws = setInterval(() => {
        if (Math.random() > 0.95) setAlert("Critical: Global error rate threshold (2%) exceeded on Cloudflare");
    }, 10000);
    return () => { clearInterval(interval); clearInterval(ws); };
  }, []);

  const pinnedProviders = useMemo(() => {
      return [...providerHealth].sort((a,b) => a.health - b.health).slice(0, 5).map(p => p.name);
  }, [providerHealth]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const exportReport = () => window.location.href = '/api/export-report';
  const performBulkAction = async (action: string) => {
    await fetch('/api/bulk-action', { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ action, providers: selectedProviders }) 
    });
    alert(`${action} performed on ${selectedProviders.length} providers`);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} font-sans antialiased text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#0a0a0a] min-h-screen flex selection:bg-blue-500/30`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isConnected && (
          <div className="bg-amber-500/10 text-amber-500 border-b border-amber-500/20 p-3 text-center text-sm font-medium flex items-center justify-center gap-2">
            <AlertTriangle size={16} /> Connection lost, data might be stale.
          </div>
        )}
        {alert && (
          <div className="bg-red-500/10 text-red-500 border-b border-red-500/20 p-3 text-center text-sm font-bold flex justify-center items-center gap-2 animate-pulse">
            <AlertTriangle size={16}/> {alert}
          </div>
        )}
        <AlertBanner />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className={`flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'} shadow-sm transition-all duration-300 ${isLive ? 'ring-2 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : ''}`}>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">FTN <span className="text-blue-500">CertControl</span></h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Global Infrastructure & Certificate Intelligence</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select value={deviceContext} onChange={e => setDeviceContext(e.target.value)} className="appearance-none pl-9 pr-8 py-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      <option>Global</option>
                      <option>Regional PoP</option>
                      <option>Local Device</option>
                  </select>
                </div>
                <button onClick={() => setShowSettings(true)} className="p-2.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl transition-colors" title="Settings"><Settings size={18} /></button>
                <button onClick={exportReport} className="p-2.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl transition-colors" title="Export Report"><Download size={18} /></button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl transition-colors" title="Toggle Theme">{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
              </div>
            </header>
            
            <div className="flex flex-wrap gap-3 items-center">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl text-sm font-semibold transition-colors"><RotateCcw size={16}/> Reload All</button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-sm font-semibold transition-colors"><AlertTriangle size={16}/> Clear Alerts</button>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sections.map(section => <SortableSection key={section.id} section={section} context={deviceContext} />)}
                </div>
              </SortableContext>
            </DndContext>
            
            <ErrorBoundary fallbackName="Traffic Providers">
              <div className={`p-6 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Traffic Providers</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pinned: <span className="font-medium text-gray-700 dark:text-gray-300">{pinnedProviders.join(', ')}</span></p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => performBulkAction('Route Optimization')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">Route Opt</button>
                      <button onClick={() => performBulkAction('Cache Purge')} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">Cache Purge</button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {Object.entries(PROVIDER_GROUPS).map(([group, providers]) => (
                      <div key={group} className="pt-4 border-t border-gray-100 dark:border-white/5 first:border-0 first:pt-0">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{group}</h4>
                        <div className="flex flex-wrap gap-2">
                          {providers.map(provider => {
                            const health = providerHealth.find(h => h.name === provider);
                            const isGlow = (healthCount[provider] || 0) >= 3;
                            const isSelected = selectedProviders.includes(provider);
                            
                            return (
                              <button 
                                key={provider}
                                onClick={() => setSelectedProviders(prev => isSelected ? prev.filter(p => p !== provider) : [...prev, provider])}
                                title={health?.error ? `Error ${health.error}` : ''}
                                className={`
                                  relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-2
                                  ${health?.error 
                                    ? 'border-red-500/50 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' 
                                    : isSelected 
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:border-gray-300 dark:hover:border-white/20 text-gray-700 dark:text-gray-300'
                                  }
                                  ${isGlow ? 'animate-pulse ring-2 ring-red-500/50' : ''}
                                `}
                              >
                                {provider} 
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${health?.health && health.health > 80 ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                  {health?.health || 0}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </ErrorBoundary>

            <div className={`p-6 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-[#111] border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-6">
                    {['History', 'Forecast', 'Traffic Map'].map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                      >
                        {tab}
                        {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />}
                      </button>
                    ))}
                </div>
                <div className="min-h-[400px]">
                  <ErrorBoundary fallbackName={activeTab}>
                    {activeTab === 'History' ? <EventHistory /> : activeTab === 'Forecast' ? <Forecast /> : <TrafficMap context={deviceContext} />}
                  </ErrorBoundary>
                </div>
            </div>
            
            <AuditTrail />
          </div>
        </main>
      </div>
      <ChatAssistant />
      {showSettings && <UserSettingsModal onClose={() => setShowSettings(false)} onSave={setPollInterval} />}
      {selectedProvider && <ProviderPanel provider={selectedProvider} onClose={() => setSelectedProvider(null)} />}
      {routingSuggestion && (
        <SmartRoutingModal 
          provider={routingSuggestion.provider}
          health={routingSuggestion.health}
          onClose={() => {
            setIgnoredSuggestions(prev => [...prev, routingSuggestion.provider]);
            setRoutingSuggestion(null);
          }}
          onApply={() => {
            // Replace with actual API call to Control API
            const evt = new CustomEvent('addAuditLog', { detail: { action: `Smart Routing Applied: Rerouted traffic from ${routingSuggestion.provider}`, user: 'System / FTN-AI' } });
            window.dispatchEvent(evt);
            setIgnoredSuggestions(prev => [...prev, routingSuggestion.provider]);
            setRoutingSuggestion(null);
          }}
        />
      )}
    </div>
  );
}
