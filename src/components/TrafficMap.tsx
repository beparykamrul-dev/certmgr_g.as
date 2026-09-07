import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Globe, 
  MapPin, 
  Activity, 
  Maximize2, 
  Radio, 
  Layers, 
  Key, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface TrafficPoP {
  id: string;
  name: string;
  city: string;
  country: string;
  coords: [number, number]; // [lng, lat]
  flowGbps: number;
  latency: number;
  role: string;
  provider: string;
  health: number;
}

const GLOBAL_POPS: TrafficPoP[] = [
  { id: 'dhaka', name: 'Dhaka BDIX Core Gateway', city: 'Dhaka', country: 'BD', coords: [90.4125, 23.8103], flowGbps: 420, latency: 6, role: 'National IX & Peering', provider: 'BDIX / Local', health: 99 },
  { id: 'sg', name: 'EdgeOne Singapore Anycast Hub', city: 'Singapore', country: 'SG', coords: [103.8198, 1.3521], flowGbps: 980, latency: 18, role: 'Regional EdgeOne Gateway', provider: 'Tencent Cloud', health: 98 },
  { id: 'hk', name: 'Hong Kong EdgeOne Shield', city: 'Hong Kong', country: 'HK', coords: [114.1694, 22.3193], flowGbps: 840, latency: 15, role: 'WAF & Anti-DDoS Scrubbing', provider: 'Tencent Cloud', health: 99 },
  { id: 'tokyo', name: 'Tokyo EdgeOne Gateway', city: 'Tokyo', country: 'JP', coords: [139.6917, 35.6895], flowGbps: 620, latency: 26, role: 'APAC East Acceleration', provider: 'Tencent Cloud', health: 97 },
  { id: 'mumbai', name: 'Mumbai Edge Core', city: 'Mumbai', country: 'IN', coords: [72.8777, 19.0760], flowGbps: 540, latency: 22, role: 'South Asia Shield', provider: 'Google / AWS', health: 96 },
  { id: 'frankfurt', name: 'Frankfurt Origin Gateway', city: 'Frankfurt', country: 'DE', coords: [8.6821, 50.1109], flowGbps: 710, latency: 95, role: 'EU Primary Transit & CT Mirror', provider: 'Equinix / Linode', health: 99 },
  { id: 'sv', name: 'Silicon Valley Anycast Hub', city: 'San Jose', country: 'US', coords: [-121.8863, 37.3382], flowGbps: 890, latency: 135, role: 'US West CDN & RFC 6962 STH Sync', provider: 'Cloudflare / AWS', health: 98 },
  { id: 'london', name: 'London EdgeOne Node', city: 'London', country: 'UK', coords: [-0.1278, 51.5074], flowGbps: 630, latency: 98, role: 'EU West Gateway & Let\'s Encrypt Staging', provider: 'Fastly / EdgeOne', health: 97 },
  { id: 'sydney', name: 'Sydney Anycast Edge', city: 'Sydney', country: 'AU', coords: [151.2093, -33.8688], flowGbps: 380, latency: 155, role: 'Oceania Edge PoP', provider: 'Cloudflare', health: 95 }
];

export default function TrafficMap({ context }: { context: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [selectedPoP, setSelectedPoP] = useState<TrafficPoP>(GLOBAL_POPS[0]);
  const [mapMode, setMapMode] = useState<'carto-dark' | 'custom-token'>('carto-dark');
  const [customToken, setCustomToken] = useState<string>('');
  const [isTokenSaved, setIsTokenSaved] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [hasWebGLError, setHasWebGLError] = useState<boolean>(false);

  // Self-contained Dark Matter style requiring zero API key and zero external tokens
  const freeRasterStyle: any = {
    version: 8,
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        ],
        tileSize: 256,
        attribution: '&copy; CartoDB &copy; OpenStreetMap'
      }
    },
    layers: [
      {
        id: 'carto-dark-layer',
        type: 'raster',
        source: 'carto-dark',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  };

  const initMap = () => {
    if (!mapContainer.current) return;

    if (map.current) {
      try {
        map.current.remove();
      } catch {
        // ignore
      }
      map.current = null;
    }

    // Check if WebGL is supported in the current browser/iframe sandbox
    if (!mapboxgl.supported || !mapboxgl.supported()) {
      setHasWebGLError(true);
      return;
    }

    try {
      // Set dummy token for non-vector or use custom token
      mapboxgl.accessToken = (mapMode === 'custom-token' && customToken.trim()) 
        ? customToken.trim() 
        : 'pk.eyJ1IjoiZGVtbyIsImEiOiJjbDFhNm1tMTAwMDIzM2pwZzg4M3Qyc2R3In0.demo';

      const styleToUse = (mapMode === 'custom-token' && customToken.trim())
        ? 'mapbox://styles/mapbox/dark-v11'
        : freeRasterStyle;

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: styleToUse,
        center: [55, 25], // Centered around Asia / Middle East / Indian Ocean
        zoom: 2,
        pitch: 35,
        bearing: 0,
        attributionControl: false
      });

      newMap.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

      newMap.on('load', () => {
        setMapLoaded(true);
        setHasWebGLError(false);
        renderMarkers(newMap);
      });

      newMap.on('error', (e: any) => {
        // CRITICAL FIX: Extract primitive string message ONLY. Never log 'e' directly as it has
        // circular references (e.target -> map -> _controls -> _map) which crashes iframe JSON serializers.
        const msg = (e && e.error && e.error.message) 
          ? String(e.error.message) 
          : (e && e.message) 
            ? String(e.message) 
            : 'Map tile notice';
        
        // Filter out benign telemetry and events 401s from dummy demo token
        if (!msg.includes('401') && !msg.includes('Unauthorized') && !msg.includes('events.mapbox.com')) {
          console.warn('Mapbox notice:', msg);
        }
      });

      map.current = newMap;
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.warn('Mapbox WebGL initialization notice:', msg);
      setHasWebGLError(true);
    }
  };

  const renderMarkers = (mapInstance: mapboxgl.Map) => {
    // Clear previous markers safely
    markersRef.current.forEach(m => {
      try {
        m.remove();
      } catch {
        // ignore
      }
    });
    markersRef.current = [];

    GLOBAL_POPS.forEach(pop => {
      // Custom HTML Marker
      const el = document.createElement('div');
      el.className = 'group cursor-pointer flex flex-col items-center';
      
      const pingRing = document.createElement('div');
      pingRing.className = `w-5 h-5 rounded-full flex items-center justify-center relative shadow-lg ${
        pop.id === 'dhaka' 
          ? 'bg-emerald-500 ring-4 ring-emerald-500/30' 
          : pop.provider.includes('Tencent')
            ? 'bg-amber-500 ring-4 ring-amber-500/30'
            : 'bg-blue-500 ring-4 ring-blue-500/30'
      }`;
      
      const innerDot = document.createElement('div');
      innerDot.className = 'w-2 h-2 rounded-full bg-white animate-ping';
      pingRing.appendChild(innerDot);

      const label = document.createElement('div');
      label.className = 'mt-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-white border border-white/20 whitespace-nowrap backdrop-blur shadow-md';
      label.innerText = `${pop.city} (${pop.latency}ms)`;

      el.appendChild(pingRing);
      el.appendChild(label);

      el.addEventListener('click', () => {
        setSelectedPoP(pop);
        try {
          mapInstance.flyTo({
            center: pop.coords,
            zoom: 4.5,
            speed: 1.2,
            curve: 1.4,
            essential: true
          });
        } catch {
          // ignore
        }
      });

      try {
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(pop.coords)
          .addTo(mapInstance);
        markersRef.current.push(marker);
      } catch {
        // ignore
      }
    });
  };

  useEffect(() => {
    initMap();
    return () => {
      markersRef.current.forEach(m => {
        try {
          m.remove();
        } catch {
          // ignore
        }
      });
      markersRef.current = [];
      if (map.current) {
        try {
          map.current.remove();
        } catch {
          // ignore
        }
        map.current = null;
      }
    };
  }, [mapMode]);

  const handleApplyCustomToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customToken.trim()) return;
    setMapMode('custom-token');
    setIsTokenSaved(true);
    initMap();
  };

  const handleResetToFreeMap = () => {
    setMapMode('carto-dark');
    setCustomToken('');
    setIsTokenSaved(false);
  };

  const handleFlyToPoP = (pop: TrafficPoP) => {
    setSelectedPoP(pop);
    if (map.current) {
      try {
        map.current.flyTo({
          center: pop.coords,
          zoom: 4.5,
          speed: 1.2,
          essential: true
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div id="section-traffic-map" className="pt-2 flex flex-col space-y-4">
      {/* Header with Mode Switching & Context Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Globe size={20} className="text-blue-500" />
              Global Traffic Intelligence & Anycast PoP Map
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              WebGL 3D Active
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time Tencent Cloud EdgeOne Anycast mesh, BDIX fast-lanes, and Certificate Transparency log mirrors (Context: <span className="font-semibold text-gray-700 dark:text-gray-300">{context}</span>)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center bg-gray-100 dark:bg-[#181818] p-1 rounded-xl border border-gray-200 dark:border-white/10">
            <button
              onClick={handleResetToFreeMap}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                mapMode === 'carto-dark'
                  ? 'bg-white dark:bg-[#252525] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Dark WebGL (Zero Token)
            </button>
            <button
              onClick={() => setMapMode('custom-token')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                mapMode === 'custom-token'
                  ? 'bg-white dark:bg-[#252525] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Key size={11} /> Custom Mapbox Token
            </button>
          </div>

          <button
            onClick={() => {
              if (map.current) {
                map.current.flyTo({ center: [55, 25], zoom: 2, pitch: 35, bearing: 0 });
              }
            }}
            className="p-1.5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#252525] border border-gray-200 dark:border-white/10 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
            title="Reset Map View"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Optional Token Drawer if custom-token mode is selected */}
      {mapMode === 'custom-token' && (
        <form onSubmit={handleApplyCustomToken} className="p-3 bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl flex flex-col sm:flex-row items-center gap-2 text-xs animate-in fade-in">
          <Key size={14} className="text-blue-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Paste your pk.eyJ... Mapbox Access Token here"
            value={customToken}
            onChange={e => setCustomToken(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-lg font-mono text-xs focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
            >
              Apply Token
            </button>
            <button
              type="button"
              onClick={handleResetToFreeMap}
              className="px-3 py-1.5 bg-gray-200 dark:bg-[#252525] hover:bg-gray-300 text-gray-700 dark:text-gray-300 rounded-lg font-semibold"
            >
              Use Free Mode
            </button>
          </div>
        </form>
      )}

      {/* Main Mapbox Container & Selected PoP Telemetry Overlay */}
      <div className="relative w-full h-[460px] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-inner bg-[#0a0f18]">
        {hasWebGLError ? (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            {/* 2D Anycast Topology Mesh Visualizer for Sandboxed / Non-WebGL Environments */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>
                <linearGradient id="fiber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              {/* Lat/Lng Reference Lines */}
              <circle cx="50%" cy="50%" r="35%" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1" />
              
              {/* Anycast Route Lines linking Dhaka Core to Singapore, HK, Tokyo, Frankfurt, SV, etc */}
              <path d="M 680 200 Q 700 230 720 250" stroke="url(#fiber-grad)" strokeWidth="2" fill="none" strokeDasharray="6 3" />
              <path d="M 680 200 Q 720 205 760 210" stroke="url(#fiber-grad)" strokeWidth="2" fill="none" strokeDasharray="6 3" />
              <path d="M 680 200 Q 650 210 620 220" stroke="url(#fiber-grad)" strokeWidth="2" fill="none" />
              <path d="M 680 200 Q 560 150 480 130" stroke="url(#fiber-grad)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <path d="M 480 130 Q 300 120 180 160" stroke="url(#fiber-grad)" strokeWidth="2" fill="none" strokeDasharray="6 3" />
            </svg>

            <div className="absolute inset-0 p-6 pointer-events-auto">
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Anycast Mesh Topology Active (2D Accelerated)
              </div>

              {/* Interactive Nodes Placed by Coordinates */}
              {GLOBAL_POPS.map(pop => {
                // Map coordinates roughly to percentage bounds for 2D container
                const xPct = pop.id === 'sv' ? 18 
                  : pop.id === 'london' ? 44 
                  : pop.id === 'frankfurt' ? 49 
                  : pop.id === 'mumbai' ? 62 
                  : pop.id === 'dhaka' ? 68 
                  : pop.id === 'sg' ? 72 
                  : pop.id === 'hk' ? 76 
                  : pop.id === 'tokyo' ? 84 
                  : 88; // Sydney
                
                const yPct = pop.id === 'sv' ? 36 
                  : pop.id === 'london' ? 26 
                  : pop.id === 'frankfurt' ? 28 
                  : pop.id === 'mumbai' ? 46 
                  : pop.id === 'dhaka' ? 42 
                  : pop.id === 'sg' ? 56 
                  : pop.id === 'hk' ? 44 
                  : pop.id === 'tokyo' ? 34 
                  : 76; // Sydney

                const isSelected = selectedPoP?.id === pop.id;

                return (
                  <button
                    key={pop.id}
                    onClick={() => setSelectedPoP(pop)}
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center cursor-pointer transition-transform hover:scale-125 focus:outline-none z-20"
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center relative shadow-lg ${
                      pop.id === 'dhaka' 
                        ? 'bg-emerald-500 ring-4 ring-emerald-500/30' 
                        : pop.provider.includes('Tencent')
                          ? 'bg-amber-500 ring-4 ring-amber-500/30'
                          : 'bg-blue-500 ring-4 ring-blue-500/30'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </div>
                    <span className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all whitespace-nowrap ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-110' 
                        : 'bg-black/80 text-gray-200 border-white/20'
                    }`}>
                      {pop.city} ({pop.latency}ms)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div ref={mapContainer} className="w-full h-full" />
        )}

        {/* Floating PoP Detail Card */}
        {selectedPoP && (
          <div className="absolute top-3 left-3 z-10 max-w-xs w-full bg-white/95 dark:bg-[#111]/95 backdrop-blur-md border border-gray-200 dark:border-white/15 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-white/10 pb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-blue-500" />
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{selectedPoP.name}</h4>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {selectedPoP.city}, {selectedPoP.country} • {selectedPoP.provider}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedPoP.latency < 20 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                  : selectedPoP.latency < 60
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
              }`}>
                {selectedPoP.latency}ms Ping
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Operational Role:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPoP.role}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Active Throughput:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">{selectedPoP.flowGbps} Gbps</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Health & Availability:</span>
                <span className="font-bold text-emerald-500">{selectedPoP.health}% Nominal</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] text-gray-400">
              <span>BGP Anycast AS-Path: Verified</span>
              <span className="text-blue-500 font-semibold flex items-center gap-1">
                Active Peer <Radio size={10} className="animate-pulse text-emerald-500" />
              </span>
            </div>
          </div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-white/15 text-[10px] space-y-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Dhaka BDIX Core
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Tencent EdgeOne PoP
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Global Anycast Hub
            </span>
          </div>
        </div>
      </div>

      {/* Quick Jump Buttons to PoP Nodes */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-gray-400 flex-shrink-0">Quick Fly-To:</span>
        {GLOBAL_POPS.map(pop => (
          <button
            key={pop.id}
            onClick={() => handleFlyToPoP(pop)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shadow-xs ${
              selectedPoP?.id === pop.id
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white dark:bg-[#141414] hover:bg-gray-100 dark:hover:bg-[#202020] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10'
            }`}
          >
            {pop.city} ({pop.latency}ms)
          </button>
        ))}
      </div>
    </div>
  );
}
