import React from 'react';
import { LayoutDashboard, AlertCircle, Shield, BarChart2, Server } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'API Gateway', icon: Shield },
  { name: 'Certificates', icon: Shield },
  { name: 'Monitoring', icon: Server },
  { name: 'Network Intel', icon: BarChart2 },
  { name: 'Alerting', icon: AlertCircle },
  { name: 'System', icon: Server },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-white/5 p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">F</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">FTN CertMgr</h2>
      </div>
      <nav className="space-y-1.5 flex-1">
        {MENU_ITEMS.map((item, index) => (
          <a key={item.name} href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${index === 0 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 font-medium'}`}>
            <item.icon size={18} />
            <span className="text-sm">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="pt-6 border-t border-gray-200 dark:border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">System Admin</p>
                <p className="text-xs text-gray-500 truncate">admin@familytime.net</p>
            </div>
        </div>
      </div>
    </aside>
  );
}
