import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';

const GEO_URL = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function TrafficMap({ context }: { context: string }) {
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showLocal, setShowLocal] = useState(false);

  useEffect(() => {
    fetch('/api/traffic-map-data').then(res => res.json()).then(setData);
  }, []);

  return (
    <div className="pt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Global Traffic Intelligence</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time network flows and PoP latency (Context: <span className="font-semibold">{context}</span>)</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                {['Overview', 'Detail'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab ? 'bg-white dark:bg-[#222] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
        <div className="h-[400px] w-full bg-[#f8fafc] dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden relative shadow-inner">
          <button 
            onClick={() => setShowLocal(!showLocal)} 
            className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${showLocal ? 'bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white border-gray-200 text-gray-600 dark:bg-[#1a1a1a] dark:border-white/10 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#222]'}`}
          >
            {showLocal ? 'Local PoP Active' : 'Show Local PoP'}
          </button>
          <ComposableMap projection="geoEquirectangular" projectionConfig={{ scale: 140 }} width={800} height={400} className="w-full h-full">
            <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                geographies.map((geo) => (
                    <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="currentColor"
                        className="text-gray-200 dark:text-gray-800"
                        stroke="currentColor"
                        strokeWidth={0.5}
                        style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "rgba(59,130,246,0.1)" },
                            pressed: { outline: "none" },
                        }}
                    />
                ))
                }
            </Geographies>
            {/* Show different data based on context & tab */}
            {activeTab === 'Overview' && data.map(d => (
                <Marker key={d.name} coordinates={d.coordinates as [number, number]}>
                    <circle r={d.flow / 20} fill={d.flow > 500 ? '#ef4444' : '#3b82f6'} fillOpacity={0.6} stroke="#fff" strokeWidth={1} className={d.flow > 500 ? 'animate-pulse' : ''} />
                    <text textAnchor="middle" y={-(d.flow / 20) - 5} className="text-[8px] font-bold fill-gray-700 dark:fill-gray-300 pointer-events-none">
                        {d.name}
                    </text>
                </Marker>
            ))}
            {showLocal && (
                <>
                    {/* Active Silk Paths */}
                    {data.slice(0, 3).map((d, i) => (
                        <Line
                            key={`silk-${i}`}
                            from={[90.4125, 23.8103]}
                            to={d.coordinates as [number, number]}
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeLinecap="round"
                            className="opacity-70 animate-pulse"
                            style={{
                                strokeDasharray: "4 4",
                                strokeDashoffset: "10",
                                animation: "dash 5s linear infinite"
                            }}
                        />
                    ))}
                    
                    <Marker coordinates={[90.4125, 23.8103]}> {/* Dhaka */}
                        <circle r={6} fill="#f59e0b" className="animate-pulse" />
                        <circle r={12} fill="#f59e0b" fillOpacity={0.2} className="animate-ping" />
                        <text textAnchor="middle" y={-15} className="text-[10px] font-bold fill-amber-600 dark:fill-amber-400 pointer-events-none">Local PoP</text>
                    </Marker>
                </>
            )}
          </ComposableMap>
        </div>
    </div>
  );
}
