import { useEffect, useRef, useState } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { AgentService } from '../../services/agentService';
import { ProfessionalAccessService } from '../../services/professionalAccessService';
import {
  MapService,
  MapCommunityBoundary,
  MapCommunityMetrics,
  MapCommunitySummary,
  COMMUNITY_CENTERS
} from '../../services/mapService';
import L from 'leaflet';
import {
  Sparkles,
  Compass,
  ZoomIn,
  ZoomOut,
  Layers,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Check,
  X,
  TrendingUp,
  FileSpreadsheet,
  Home,
  FileText
} from 'lucide-react';

interface MapsGeospatialProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function MapsGeospatial({
  onNavigateToModule,
  triggerToast = () => {}
}: MapsGeospatialProps) {
  const { user } = useAuth();
  const isAgent = user?.role === 'agent';
  const verification = isAgent ? AgentService.getVerificationStatus() : null;
  const hasProfAccess = ProfessionalAccessService.hasProfessionalAccess(user, verification);

  const { communityId, setCommunityId } = useAnalysisContext();
  const { selectedCommunity } = useMarketAnalytics();

  const [boundaries, setBoundaries] = useState<MapCommunityBoundary[]>([]);
  const [metrics, setMetrics] = useState<MapCommunityMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Metric switching state
  const [selectedMetric, setSelectedMetric] = useState<string>('priceGrowth');
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);

  // Overlay state for verified agents
  const [overlayActive, setOverlayActive] = useState(false);

  // Sync selected metric to localStorage for context panel legend (Scenario 2)
  useEffect(() => {
    localStorage.setItem('acot_maps_selected_metric', selectedMetric);
    window.dispatchEvent(new Event('acot_maps_metric_changed'));
  }, [selectedMetric]);

  // Hover state
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Summary state for clicked / active community
  const [summary, setSummary] = useState<MapCommunitySummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Map references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsGroupRef = useRef<L.FeatureGroup | null>(null);

  const METRIC_OPTIONS = [
    { value: 'priceGrowth', label: 'Price Growth (YoY %)', shortLabel: 'Growth' },
    { value: 'transactionVolume', label: 'Transaction Volume', shortLabel: 'Volume' },
    { value: 'medianPrice', label: 'Median Price (AED/sqft)', shortLabel: 'Price' },
    { value: 'rentalYield', label: 'Rental Yield (Net %)', shortLabel: 'Yield' },
    { value: 'marketActivity', label: 'Market Activity (Occupancy %)', shortLabel: 'Activity' }
  ];

  // Load boundaries & metrics once on mount
  useEffect(() => {
    let active = true;
    Promise.all([
      MapService.getCommunityBoundaries(),
      MapService.getCommunityMetrics()
    ]).then(([boundData, metricData]) => {
      if (!active) return;
      setBoundaries(boundData);
      setMetrics(metricData);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center of Dubai
    const initialCenter: [number, number] = [25.1200, 55.2300];
    const initialZoom = 11;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      minZoom: 9,
      maxZoom: 16
    }).setView(initialCenter, initialZoom);

    mapInstanceRef.current = map;

    // Add Premium Voyager light-themed raster tiles from CartoDB (perfect fit for our UI)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      minZoom: 9
    }).addTo(map);

    const polygonsGroup = L.featureGroup().addTo(map);
    polygonsGroupRef.current = polygonsGroup;

    // On load, fly to currently selected community if exists
    if (communityId) {
      const meta = COMMUNITY_CENTERS[communityId];
      if (meta) {
        map.setView(meta.center, 12);
      }
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      polygonsGroupRef.current = null;
    };
  }, []);

  // Fetch summary on community change
  useEffect(() => {
    if (communityId) {
      setLoadingSummary(true);
      MapService.getCommunitySummary(communityId).then(data => {
        setSummary(data);
        setLoadingSummary(false);
      });
    } else {
      setSummary(null);
    }
  }, [communityId]);

  // Center/Fly to active community on context update (Scenario 5)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !communityId) return;
    const meta = COMMUNITY_CENTERS[communityId];
    if (meta) {
      const currentCenter = map.getCenter();
      const targetCenter = L.latLng(meta.center[0], meta.center[1]);
      if (currentCenter.distanceTo(targetCenter) > 200) { // fly only if changed
        map.flyTo(meta.center, 12.5, { duration: 1 });
      }
    }
  }, [communityId]);

  // Helper metrics methods
  const getMetricValue = (commId: string, metricKey: string): number => {
    const item = metrics.find(m => m.id === commId);
    if (!item) return 0;
    if (metricKey === 'priceGrowth') return item.priceGrowth;
    if (metricKey === 'transactionVolume') return item.transactionVolume;
    if (metricKey === 'medianPrice') return item.medianPrice;
    if (metricKey === 'rentalYield') return item.rentalYield;
    if (metricKey === 'marketActivity') return item.marketActivity;
    return 0;
  };

  const getFormattedMetricValue = (commId: string, metricKey: string): string => {
    const val = getMetricValue(commId, metricKey);
    if (metricKey === 'priceGrowth') {
      return `${val > 0 ? '+' : ''}${val}%`;
    }
    if (metricKey === 'transactionVolume') {
      return `${val.toLocaleString()} Trxs`;
    }
    if (metricKey === 'medianPrice') {
      return `AED ${val.toLocaleString()}/sqft`;
    }
    if (metricKey === 'rentalYield') {
      return `${val}% Yield`;
    }
    if (metricKey === 'marketActivity') {
      return `${val}% Occ`;
    }
    return `${val}`;
  };

  const getColorForMetric = (commId: string, metricKey: string): string => {
    const val = getMetricValue(commId, metricKey);
    if (metricKey === 'priceGrowth') {
      if (val >= 15) return '#047857'; // High positive
      if (val >= 8) return '#10b981';  // Medium positive
      if (val >= 0) return '#fbbf24';  // Low positive
      if (val >= -3) return '#f97316'; // Slow contraction
      return '#ef4444';                // Negative
    }
    if (metricKey === 'transactionVolume') {
      if (val >= 4000) return '#047857';
      if (val >= 2500) return '#10b981';
      if (val >= 1500) return '#fbbf24';
      if (val >= 1000) return '#f97316';
      return '#ef4444';
    }
    if (metricKey === 'medianPrice') {
      if (val >= 2000) return '#047857';
      if (val >= 1500) return '#10b981';
      if (val >= 1200) return '#fbbf24';
      if (val >= 1000) return '#f97316';
      return '#ef4444';
    }
    if (metricKey === 'rentalYield') {
      if (val >= 7.5) return '#047857';
      if (val >= 6.8) return '#10b981';
      if (val >= 6.0) return '#fbbf24';
      if (val >= 5.5) return '#f97316';
      return '#ef4444';
    }
    if (metricKey === 'marketActivity') {
      if (val >= 93) return '#047857';
      if (val >= 90) return '#10b981';
      if (val >= 85) return '#fbbf24';
      if (val >= 80) return '#f97316';
      return '#ef4444';
    }
    return '#10b981';
  };

  // Re-draw polygons whenever state parameters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = polygonsGroupRef.current;
    if (!map || !group || boundaries.length === 0 || metrics.length === 0) return;

    group.clearLayers();

    boundaries.forEach(b => {
      const isSelected = b.id === communityId;
      const isHovered = b.id === hoveredId;
      const fillColor = getColorForMetric(b.id, selectedMetric);

      const polyStyle: L.PathOptions = {
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.70 : isHovered ? 0.60 : 0.45,
        color: isSelected ? '#4f46e5' : isHovered ? '#6366f1' : '#e2e8f0',
        weight: isSelected ? 3 : isHovered ? 2 : 1.2,
        dashArray: isSelected ? '' : '3',
      };

      const poly = L.polygon(b.polygon, polyStyle);

      poly.on('mouseover', (e) => {
        setHoveredId(b.id);
        setHoverPosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        poly.setStyle({
          fillOpacity: b.id === communityId ? 0.70 : 0.60,
          weight: b.id === communityId ? 3 : 2,
          color: b.id === communityId ? '#4f46e5' : '#6366f1'
        });
      });

      poly.on('mousemove', (e) => {
        setHoverPosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
      });

      poly.on('mouseout', () => {
        setHoveredId(null);
        poly.setStyle({
          fillOpacity: b.id === communityId ? 0.70 : 0.45,
          weight: b.id === communityId ? 3 : 1.2,
          color: b.id === communityId ? '#4f46e5' : '#e2e8f0'
        });
      });

      poly.on('click', () => {
        setCommunityId(b.id);
        triggerToast(`Context aligned: ${b.name}`);
        map.flyTo(b.center, 12.5, { duration: 1 });
      });

      // Customized lightweight vector label marker inside Leaflet
      const labelMarkup = `
        <div class="pointer-events-none select-none transition-all" style="opacity: 0.95;">
          <div class="text-[9px] font-extrabold text-slate-800 text-center drop-shadow-sm px-1.5 py-0.5 rounded-md border border-slate-200/50 flex flex-col items-center justify-center" style="background: rgba(255,255,255,0.92); backdrop-filter: blur(2px); box-shadow: 0 2px 4px rgba(0,0,0,0.04); min-width: 65px; line-height: 1.1;">
            <span class="font-extrabold tracking-tight text-slate-900 block truncate" style="max-width: 75px;">${b.name.replace(' (JLT)', '').replace('JVC (Jumeirah Village Circle)', 'JVC')}</span>
            <span class="font-mono text-[8px] font-bold block mt-0.5 text-[${fillColor}]" style="color: ${fillColor}; font-weight: 800;">${getFormattedMetricValue(b.id, selectedMetric)}</span>
          </div>
        </div>
      `;

      const labelMarker = L.marker(b.center, {
        icon: L.divIcon({
          className: 'custom-map-label',
          html: labelMarkup,
          iconSize: [80, 26],
          iconAnchor: [40, 13]
        }),
        interactive: false
      });

      group.addLayer(poly);
      group.addLayer(labelMarker);
    });

    if (overlayActive && communityId) {
      const meta = COMMUNITY_CENTERS[communityId];
      if (meta) {
        const c = meta.center;
        // Draw 3 beautiful mini polygons around the center to simulate plots
        const offsetRange = [
          { dLat: 0.003, dLng: 0.003, name: "Plot 40A - Premium Residential Area", progress: "94% Completed", legal: "Fully Registered & Verified", index: "AED 2,850/sqft" },
          { dLat: -0.003, dLng: 0.003, name: "Plot 42C - Mixed Use Commercial Complex", progress: "45% Completed", legal: "Escrow Cleared & Inspected", index: "AED 1,980/sqft" },
          { dLat: 0.003, dLng: -0.003, name: "Plot 15B - Community Infrastructure", progress: "100% Completed", legal: "Municipal Handover Cleared", index: "N/A" }
        ];
        
        offsetRange.forEach((offset) => {
          const plotCoords = [
            [c[0] + offset.dLat - 0.001, c[1] + offset.dLng - 0.001],
            [c[0] + offset.dLat + 0.001, c[1] + offset.dLng - 0.001],
            [c[0] + offset.dLat + 0.001, c[1] + offset.dLng + 0.001],
            [c[0] + offset.dLat - 0.001, c[1] + offset.dLng + 0.001]
          ] as L.LatLngExpression[];
          
          const plotPoly = L.polygon(plotCoords, {
            fillColor: '#4f46e5',
            fillOpacity: 0.35,
            color: '#6366f1',
            weight: 2,
            dashArray: '3, 4'
          }).addTo(group);
          
          plotPoly.bindTooltip(`
            <div class="font-sans text-[10px] p-1.5 space-y-0.5 text-slate-800">
              <p class="font-extrabold text-indigo-700">${offset.name}</p>
              <p>Progress: <span class="font-bold text-emerald-600">${offset.progress}</span></p>
              <p>Legal: <span class="font-semibold text-slate-700">${offset.legal}</span></p>
              <p>Index: <span class="font-mono font-bold text-slate-800">${offset.index}</span></p>
            </div>
          `, { permanent: true, direction: "top", opacity: 0.95 });
        });
      }
    }
  }, [boundaries, metrics, selectedMetric, communityId, hoveredId, overlayActive]);

  // Controls Handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (communityId) {
      const meta = COMMUNITY_CENTERS[communityId];
      if (meta) {
        mapInstanceRef.current?.flyTo(meta.center, 12.5, { duration: 1 });
        return;
      }
    }
    mapInstanceRef.current?.flyTo([25.1200, 55.2300], 11, { duration: 1 });
    triggerToast('Map centered to Dubai metropolitan macro view.');
  };

  const handleExploreCommunity = () => {
    if (!communityId) return;
    const currentName = summary?.name || communityId;
    triggerToast(`Routing context to Community Deep Analysis for ${currentName}.`);
    
    // Dispatch events to navigate inside Market Analytics workspace
    window.dispatchEvent(new CustomEvent('acot-market-analytics-tab', { detail: 'deep' }));
    window.dispatchEvent(new CustomEvent('acot-sidebar-route', { detail: 'Market Analytics & Cycles' }));
    
    if (onNavigateToModule) {
      onNavigateToModule('Market Analytics & Cycles');
    }
  };

  const getMetricLabel = (key: string) => {
    return METRIC_OPTIONS.find(o => o.value === key)?.label || key;
  };

  const activeHoverData = hoveredId && metrics.find(m => m.id === hoveredId);

  return (
    <div className="space-y-6 md:space-y-8 relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Maps & Geospatial
            </h2>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3 h-3" />
              Verified DLD Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Discover Dubai real estate markets spatially. Use the heat layer to compare community metrics and select locations to deep-dive.
          </p>
        </div>

        {/* METRIC SELECTOR DROPDOWN */}
        <div className="relative shrink-0">
          <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold mb-1">
            Color By
          </span>
          <button
            onClick={() => setMetricDropdownOpen(!metricDropdownOpen)}
            className="flex items-center justify-between gap-3 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all shadow-sm min-w-[210px] cursor-pointer"
          >
            <span>{getMetricLabel(selectedMetric)}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${metricDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {metricDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMetricDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-1.5 w-[230px] bg-white border border-slate-100 rounded-2xl shadow-xl z-30 py-1.5 overflow-hidden">
                {METRIC_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSelectedMetric(opt.value);
                      setMetricDropdownOpen(false);
                      triggerToast(`Map metric changed: ${opt.label}`);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-left font-semibold cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    {selectedMetric === opt.value && <Check className="w-3.5 h-3.5 text-indigo-600 font-extrabold" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PRIMARY WORKSPACE MAP CANVAS CONTAINER */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm relative overflow-hidden h-[540px] md:h-[580px] lg:h-[620px] flex flex-col">
        
        {/* Real Leaflet Map viewport */}
        <div ref={mapContainerRef} className="w-full h-full rounded-[1.75rem] bg-slate-50 relative z-0" />

        {/* FLOATING CUSTOM LEAFLET CONTROLS */}
        <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 bg-white border border-slate-100 rounded-xl shadow-md hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 bg-white border border-slate-100 rounded-xl shadow-md hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRecenter}
            className="w-9 h-9 bg-white border border-slate-100 rounded-xl shadow-md hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            title="Recenter Map"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* FLOATING HOVER TOOLTIP (PORTAL-LIKE EMULATION FOR PREMIUM FEEL) */}
        {hoveredId && activeHoverData && (
          <div
            className="fixed pointer-events-none z-40 bg-slate-900/95 backdrop-blur-md text-white text-xs px-3 py-2 rounded-xl shadow-xl flex flex-col gap-0.5 border border-slate-800"
            style={{
              left: `${hoverPosition.x + 15}px`,
              top: `${hoverPosition.y + 15}px`,
              transform: 'translate3d(0, 0, 0)',
              transition: 'left 0.1s ease, top 0.1s ease'
            }}
          >
            <span className="font-extrabold text-[11px] block">{activeHoverData.name}</span>
            <div className="flex items-center gap-2 mt-0.5 font-medium text-[10px] text-slate-300">
              <span>{METRIC_OPTIONS.find(o => o.value === selectedMetric)?.shortLabel}:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {getFormattedMetricValue(hoveredId, selectedMetric)}
              </span>
            </div>
          </div>
        )}

        {/* FLOATING COMMUNITY POPUP DETAIL CARD */}
        {summary && (
          <div className="absolute top-5 right-5 z-10 w-[380px] bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col">
            <div className="flex gap-4 p-4 items-start">
              <img
                src={summary.image}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
                alt={summary.name}
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate pr-2 max-w-[150px]" title={summary.name}>
                    {summary.name}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 text-[9px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                      Selected
                    </span>
                    <button
                      onClick={() => setCommunityId('')}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-sans">
                  <div>
                    <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Median Price</span>
                    <span className="font-extrabold text-slate-800">AED {summary.medianPrice.toLocaleString()}/sqft</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Price Growth</span>
                    <span className={`font-extrabold flex items-center gap-0.5 ${summary.priceGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {summary.priceGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary.priceGrowth)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Trxs (12M)</span>
                    <span className="font-extrabold text-slate-800">{summary.transactionVolume.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Rental Yield</span>
                    <span className="font-extrabold text-emerald-600">{summary.rentalYield}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="px-4 pb-3">
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal italic">
                "{summary.description.slice(0, 110)}..."
              </p>
            </div>

            {/* Explore Button */}
            <div className="px-4 pb-4">
              <button
                onClick={handleExploreCommunity}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Community</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GEOSPATIAL REGISTRY OVERLAY PANEL */}
      {hasProfAccess && (
        <div className="bg-slate-900 text-white rounded-[2rem] border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden" id="geospatial-registry-overlay-card">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800 pb-5">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-500/35">
                <Layers className="w-3.5 h-3.5 text-indigo-300" />
                Professional Geospatial Services
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Geospatial Registry Overlay
                <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase border border-indigo-500/20">
                  DLD Vector CAD Layers
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Overlay parcel coordinate boundaries, legal disputes, and real-time construction progress surveys directly onto the viewport.
              </p>
            </div>
            
            {/* Interactive Toggle Button */}
            <div className="shrink-0">
              <button
                onClick={() => {
                  if (!communityId) {
                    setCommunityId('dubai-marina');
                    triggerToast('Default community set: Dubai Marina');
                  }
                  setOverlayActive(!overlayActive);
                  triggerToast(overlayActive ? 'Geospatial Registry Overlay disabled' : 'Geospatial Registry Overlay enabled on active center!');
                }}
                className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 shadow-md cursor-pointer ${
                  overlayActive 
                    ? 'bg-indigo-600 text-white shadow-indigo-600/25 border border-indigo-500 hover:bg-indigo-500' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${overlayActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></div>
                <span>{overlayActive ? 'DISENGAGE OVERLAY' : 'ENGAGE REGISTRY OVERLAY'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative z-10 font-mono text-xs">
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Plot Boundaries</span>
                <span className={`w-1.5 h-1.5 rounded-full ${overlayActive ? 'bg-indigo-400' : 'bg-slate-600'}`}></span>
              </div>
              <p className="font-extrabold text-slate-200">{overlayActive ? '3 Active Plots Drawn' : 'Hidden'}</p>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">Displays precise DLD land-cadastre corners.</p>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Construction Progress</span>
                <span className={`w-1.5 h-1.5 rounded-full ${overlayActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
              </div>
              <p className="font-extrabold text-slate-200">{overlayActive ? 'Active Tracker Live' : 'Hidden'}</p>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">Integrates real-time municipality builder logs.</p>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Legal Status</span>
                <span className={`w-1.5 h-1.5 rounded-full ${overlayActive ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              </div>
              <p className="font-extrabold text-slate-200">{overlayActive ? 'Fully Compliant / Cleared' : 'Hidden'}</p>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">Checks active land disputes or pending bank liens.</p>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Valuation Indexes</span>
                <span className={`w-1.5 h-1.5 rounded-full ${overlayActive ? 'bg-indigo-400' : 'bg-slate-600'}`}></span>
              </div>
              <p className="font-extrabold text-slate-200">{overlayActive ? 'DLD Hedonic Median Active' : 'Hidden'}</p>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">Unlocks historical algorithmic valuations per plot.</p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACCESS PANEL (Bottom Area of Space) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
          Quick Access to Market Intelligence
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            { name: 'Community Analysis', icon: TrendingUp, detail: 'Deep dive into any community', route: 'Market Analytics & Cycles', action: () => {
              window.dispatchEvent(new CustomEvent('acot-market-analytics-tab', { detail: 'deep' }));
              window.dispatchEvent(new CustomEvent('acot-sidebar-route', { detail: 'Market Analytics & Cycles' }));
            }},
            { name: 'Price History', icon: Compass, detail: 'View historical price trends', route: 'Market Analytics & Cycles', action: () => {
              window.dispatchEvent(new CustomEvent('acot-market-analytics-tab', { detail: 'history' }));
              window.dispatchEvent(new CustomEvent('acot-sidebar-route', { detail: 'Market Analytics & Cycles' }));
            }},
            { name: 'Transaction Intelligence', icon: FileSpreadsheet, detail: 'Explore verified transactions', route: 'Transaction Intelligence' },
            { name: 'Rental Intelligence', icon: Home, detail: 'Analyze rental performance', route: 'Rental Intelligence' },
            { name: 'Investor Tools', icon: Compass, detail: 'Calculate & compare', route: 'Investor Tools & Calculators' },
            { name: 'AI Intelligence', icon: Sparkles, detail: 'Ask AI for insights', route: 'AI Intelligence Suite' },
            { name: 'Reports', icon: FileText, detail: 'Generate insights report', route: 'Reports Engine' }
          ].map((card, i) => (
            <button
              key={i}
              onClick={() => {
                if (card.action) {
                  card.action();
                } else if (onNavigateToModule) {
                  onNavigateToModule(card.route);
                  triggerToast(`Navigating to ${card.name}.`);
                }
              }}
              className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors mb-2.5">
                <card.icon className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 tracking-tight leading-snug">
                {card.name}
              </h4>
              <p className="text-[9px] text-slate-400 mt-1 block leading-normal line-clamp-1 group-hover:text-slate-500">
                {card.detail}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
