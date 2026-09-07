import React from 'react';
import { 
  LayoutDashboard, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Globe, 
  Server, 
  BarChart2, 
  Activity, 
  Radio, 
  Lock, 
  X,
  FileCheck,
  CheckCircle2,
  PieChart,
  Network
} from 'lucide-react';

interface SidebarProps {
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard, badge: 'Live' },
  { id: 'production-center', name: 'Production & Safety Center', icon: ShieldCheck, badge: '1,048 Days' },
  { id: 'category-analysis', name: 'Category Analysis', icon: PieChart, badge: 'Protocols' },
  { id: 'transit-topology', name: 'Transit Mesh Topology', icon: Network, badge: '11 Peers' },
  { id: 'cyber-telemetry', name: 'Cyber Glow Telemetry', icon: BarChart2, badge: 'Spectra' },
  { id: 'edgeone', name: 'EdgeOne Security Gateway', icon: Zap, badge: 'Auto-Mitigate' },
  { id: 'cert-transparency', name: 'Certificate Transparency', icon: Shield, badge: 'RFC 6962' },
  { id: 'traffic-map', name: 'Global Traffic Map', icon: Globe, badge: 'Anycast' },
  { id: 'silk-routing', name: 'Smart Silk Routing', icon: Activity, badge: 'BDIX' },
  { id: 'anomaly-heatmap', name: 'Anomaly Intensity Grid', icon: Activity, badge: null },
  { id: 'audit-trail', name: 'Security & Audit Logs', icon: ShieldAlert, badge: null },
];

export default function Sidebar({ 
  activeSection = 'dashboard', 
  onSelectSection, 
  isMobileOpen = false, 
  onCloseMobile 
}: SidebarProps) {
  const handleItemClick = (id: string) => {
    if (onSelectSection) {
      onSelectSection(id);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
        />
      )}

      {/* Main Sidebar Component */}
      <aside 
        className={`
          w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-white/5 p-5 flex flex-col h-full
          fixed md:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header & Mobile Close Button */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
              F
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-1.5">
                FTN CertMgr
              </h2>
              <p className="text-[10px] text-gray-400 font-medium">EdgeOne & CT Control</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 md:hidden"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Real-time Status Banner in Sidebar */}
        <div className="mb-6 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-700 dark:text-blue-400">
            <span className="flex items-center gap-1.5">
              <Zap size={13} className="text-amber-500" />
              EdgeOne Shield
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <Radio size={9} className="animate-pulse text-emerald-500" /> ACTIVE
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
            <span>Auto-Mitigation:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Enforced</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
            <span>CT Merkle Logs:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">5/5 Verified</span>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
          <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Navigation Modules
          </span>
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon size={17} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span className="text-xs truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 dark:bg-[#1f1f1f] text-gray-500 dark:text-gray-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Admin Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-white/5 mt-auto">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">SecOps Admin</p>
              <p className="text-[10px] text-gray-400 truncate">admin@familytime.net</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
}
