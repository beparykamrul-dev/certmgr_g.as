import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AnomalyCell {
  provider: string;
  time: string;
  deviationPct: number;
  baselineGbps: number;
  currentGbps: number;
  status: 'spike' | 'drop' | 'normal';
}

interface HeatmapApiResponse {
  providers: string[];
  timeSlots: string[];
  data: AnomalyCell[];
  lastUpdated: string;
}

export default function TrafficAnomalyHeatmap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<HeatmapApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'spike' | 'drop'>('all');
  const [hoveredCell, setHoveredCell] = useState<{
    cell: AnomalyCell;
    x: number;
    y: number;
  } | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/traffic-anomalies')
      .then(res => res.json())
      .then(json => {
        setData(json);
      })
      .catch(err => console.error('Error fetching traffic anomaly data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 15000);
    return () => clearInterval(timer);
  }, []);

  // Summary statistics
  const stats = useMemo(() => {
    if (!data?.data) return { spikes: 0, drops: 0, maxSpike: 0, nominal: 0 };
    let spikes = 0;
    let drops = 0;
    let maxSpike = 0;
    let nominal = 0;

    data.data.forEach(d => {
      if (d.status === 'spike') {
        spikes++;
        if (d.deviationPct > maxSpike) maxSpike = d.deviationPct;
      } else if (d.status === 'drop') {
        drops++;
      } else {
        nominal++;
      }
    });

    return { spikes, drops, maxSpike, nominal };
  }, [data]);

  // Render D3 Heatmap
  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 20, bottom: 40, left: 115 };
    const width = 850;
    const height = 340;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.timeSlots)
      .range([0, innerWidth])
      .padding(0.08);

    const yScale = d3.scaleBand()
      .domain(data.providers)
      .range([0, innerHeight])
      .padding(0.08);

    // Color interpolator for anomaly intensity (-60% to +60%)
    // Drops -> Indigo/Purple; Baseline -> Neutral/Slate; Spikes -> Amber/Crimson
    const colorScale = d3.scaleDiverging<string>()
      .domain([-50, 0, 50])
      .interpolator(d3.interpolateRgbBasis([
        '#6366f1', // -50% Drop (Indigo)
        '#3b82f6', // -25% Lower
        '#1f2937', // 0% Normal (Dark Slate)
        '#f59e0b', // +25% Surge (Amber)
        '#ef4444'  // +50% Critical Spike (Red)
      ]));

    // Draw X Axis (Time)
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call(axis => axis.select('.domain').remove())
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '11px')
      .style('font-weight', '600');

    // Draw Y Axis (Providers)
    const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(10);
    g.append('g')
      .call(yAxis)
      .call(axis => axis.select('.domain').remove())
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '11px')
      .style('font-weight', '600');

    // Filtered data for rendering
    const visibleData = data.data.filter(d => {
      if (filter === 'all') return true;
      return d.status === filter;
    });

    // Draw Heatmap Cells
    const cellGroups = g.selectAll<SVGGElement, AnomalyCell>('.heatmap-cell')
      .data(visibleData, (d: any) => `${d.provider}-${d.time}`)
      .enter()
      .append('g')
      .attr('class', 'heatmap-cell')
      .attr('transform', (d: AnomalyCell) => `translate(${xScale(d.time) || 0},${yScale(d.provider) || 0})`)
      .style('cursor', 'pointer');

    // Rectangles
    cellGroups.append('rect')
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', (d: AnomalyCell) => colorScale(d.deviationPct))
      .attr('stroke', (d: AnomalyCell) => {
        if (d.status === 'spike') return '#f87171';
        if (d.status === 'drop') return '#818cf8';
        return 'rgba(255, 255, 255, 0.08)';
      })
      .attr('stroke-width', (d: AnomalyCell) => d.status !== 'normal' ? 1.5 : 0.5)
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function(event: any, d: AnomalyCell) {
        d3.select(this)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .attr('filter', 'drop-shadow(0 0 8px rgba(255,255,255,0.3))');

        const bounds = containerRef.current?.getBoundingClientRect();
        if (bounds) {
          setHoveredCell({
            cell: d,
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
          });
        }
      })
      .on('mouseleave', function(event: any, d: AnomalyCell) {
        d3.select(this)
          .attr('stroke', d.status === 'spike' ? '#f87171' : d.status === 'drop' ? '#818cf8' : 'rgba(255, 255, 255, 0.08)')
          .attr('stroke-width', d.status !== 'normal' ? 1.5 : 0.5)
          .attr('filter', 'none');
        setHoveredCell(null);
      });

    // Label on significant anomaly cells
    cellGroups.each(function(d: AnomalyCell) {
      if (Math.abs(d.deviationPct) >= 25) {
        const text = d3.select(this).append('text')
          .attr('x', xScale.bandwidth() / 2)
          .attr('y', yScale.bandwidth() / 2 + 3.5)
          .attr('text-anchor', 'middle')
          .style('fill', '#ffffff')
          .style('font-size', '9px')
          .style('font-weight', '700')
          .style('pointer-events', 'none');

        text.text(`${d.deviationPct > 0 ? '+' : ''}${d.deviationPct}%`);
      }
    });

  }, [data, filter]);

  return (
    <div ref={containerRef} className="pt-2 relative flex flex-col justify-between">
      {/* Header controls & stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> Real-time Anomaly Intensity Grid
            </h3>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              D3 Engine
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Cross-provider traffic surges (+) and packet drop-offs (-) computed over baseline windows
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('spike')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'spike'
                  ? 'bg-red-500 text-white shadow-xs font-bold'
                  : 'text-red-500 hover:text-red-600'
              }`}
            >
              <ArrowUpRight size={12} /> Spikes ({stats.spikes})
            </button>
            <button
              onClick={() => setFilter('drop')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'drop'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              <ArrowDownRight size={12} /> Drops ({stats.drops})
            </button>
          </div>

          <button
            onClick={fetchData}
            title="Refresh Live Anomalies"
            className="p-1.5 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Badges */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-500" />
            <span className="text-[11px] font-semibold text-red-700 dark:text-red-400">Traffic Surges</span>
          </div>
          <span className="text-xs font-extrabold text-red-600 dark:text-red-300">+{stats.maxSpike}% Peak</span>
        </div>

        <div className="px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-indigo-500" />
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">Drops / Offloads</span>
          </div>
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-300">{stats.drops} Active</span>
        </div>

        <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Nominal Flow</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-300">{stats.nominal} Cells</span>
        </div>
      </div>

      {/* D3 Heatmap SVG Container */}
      <div className="w-full relative overflow-x-auto min-h-[300px] flex items-center justify-center bg-gray-50/50 dark:bg-[#0c0c0c] rounded-xl border border-gray-100 dark:border-white/5 p-2">
        <svg ref={svgRef} className="w-full h-auto max-h-[340px]" />

        {/* Floating Tooltip */}
        {hoveredCell && (
          <div
            className="absolute pointer-events-none z-50 bg-gray-900/95 text-white p-3 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-md min-w-[180px] text-xs"
            style={{
              left: Math.min(hoveredCell.x + 15, 600),
              top: Math.max(10, hoveredCell.y - 70)
            }}
          >
            <div className="flex items-center justify-between border-b border-gray-700 pb-1.5 mb-1.5">
              <span className="font-bold text-white">{hoveredCell.cell.provider}</span>
              <span className="text-[10px] text-gray-400">{hoveredCell.cell.time}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Observed Traffic:</span>
                <span className="font-bold">{hoveredCell.cell.currentGbps} Gbps</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Baseline Rate:</span>
                <span className="font-medium text-gray-300">{hoveredCell.cell.baselineGbps} Gbps</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-gray-800">
                <span className="text-gray-400">Variance:</span>
                <span className={`font-black ${
                  hoveredCell.cell.deviationPct > 0 
                    ? 'text-red-400' 
                    : hoveredCell.cell.deviationPct < 0 
                      ? 'text-indigo-400' 
                      : 'text-gray-400'
                }`}>
                  {hoveredCell.cell.deviationPct > 0 ? '+' : ''}{hoveredCell.cell.deviationPct}%
                </span>
              </div>
              <div className="pt-0.5">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  hoveredCell.cell.status === 'spike'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : hoveredCell.cell.status === 'drop'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-gray-700 text-gray-300'
                }`}>
                  {hoveredCell.cell.status === 'spike' ? 'Traffic Surge' : hoveredCell.cell.status === 'drop' ? 'Traffic Drop-off' : 'Nominal'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* D3 Gradient Scale Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-100 dark:border-white/5 mt-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
        <span className="font-semibold uppercase tracking-wider text-[10px]">Anomaly Intensity Scale</span>
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-bold">-50% Drop</span>
          <div className="w-32 h-2.5 rounded-full bg-gradient-to-r from-[#6366f1] via-[#1f2937] to-[#ef4444] border border-gray-200 dark:border-white/10" />
          <span className="text-red-400 font-bold">+50% Spike</span>
        </div>
      </div>
    </div>
  );
}
