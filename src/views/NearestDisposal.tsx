import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Star, ChevronDown, Check, Timer, Recycle, Leaf, Package } from 'lucide-react';

type WasteTag = 'Wet' | 'Dry' | 'Plastic' | 'E-Waste' | 'Medical';

interface DisposalSite {
  id: string;
  name: string;
  type: 'Municipal Bin' | 'RVM-Lite' | 'Temple Compost Hub' | 'Collection Centre';
  distance: string;
  distanceNum: number;
  address: string;
  hours: string;
  tags: WasteTag[];
  pointsPerKg: number;
  upiRate?: string;
  rating: number;
  open: boolean;
}

const tagConfig: Record<WasteTag, { bg: string; text: string; icon: typeof Leaf }> = {
  Wet:      { bg: 'bg-green-100',  text: 'text-green-700',  icon: Leaf },
  Dry:      { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: Package },
  Plastic:  { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: Recycle },
  'E-Waste':{ bg: 'bg-purple-100', text: 'text-purple-700', icon: Star },
  Medical:  { bg: 'bg-red-100',    text: 'text-red-700',    icon: Star },
};

const disposalSites: DisposalSite[] = [
  {
    id: 'bin-01', name: 'Goripalayam Market Bin', type: 'Municipal Bin',
    distance: '0.3 km', distanceNum: 0.3, address: '14, Anna Nagar Main Road',
    hours: '6:00 AM – 10:00 PM', tags: ['Wet', 'Dry'],
    pointsPerKg: 5, upiRate: '₹3/kg', rating: 4.2, open: true,
  },
  {
    id: 'rvm-01', name: 'Meenakshi College RVM-Lite', type: 'RVM-Lite',
    distance: '0.8 km', distanceNum: 0.8, address: 'Near Gate 2, Meenakshi College',
    hours: '9:00 AM – 6:00 PM', tags: ['Plastic', 'Dry'],
    pointsPerKg: 10, upiRate: '₹5/kg', rating: 4.7, open: true,
  },
  {
    id: 'temple-01', name: 'Thiruparankundram Temple Hub', type: 'Temple Compost Hub',
    distance: '1.4 km', distanceNum: 1.4, address: 'Thiruparankundram Temple Complex',
    hours: '7:00 AM – 12:00 PM, 4:00 PM – 8:00 PM', tags: ['Wet'],
    pointsPerKg: 8, rating: 4.9, open: true,
  },
  {
    id: 'cc-01', name: 'Ward 14 Collection Centre', type: 'Collection Centre',
    distance: '2.1 km', distanceNum: 2.1, address: '44, Bharathiar St, Ward 14',
    hours: '8:00 AM – 5:00 PM (Mon–Sat)', tags: ['Wet', 'Dry', 'Plastic', 'E-Waste'],
    pointsPerKg: 12, upiRate: '₹6/kg', rating: 4.5, open: false,
  },
];

export default function NearestDisposal() {
  const [expandedId, setExpandedId] = useState<string | null>('rvm-01');
  const [dropTimerId, setDropTimerId] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-civic-slate px-5 pt-10 pb-28">
      {/* Header */}
      <div className="mb-7">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-civic-slate-dark mb-2">
          Near You · Ward 14, Madurai
        </p>
        <h1 className="font-serif font-black text-display-lg text-civic-navy leading-[1.02]">
          Dispose <span className="italic text-civic-green">Right.</span>
        </h1>
        <p className="font-sans text-sm text-civic-slate-dark mt-2">
          Earn points. Get UPI cashback. Every drop counts.
        </p>
      </div>

      {/* Distance filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {['Nearest', 'Open Now', 'Plastic', 'Wet', 'E-Waste'].map((filter) => (
          <button
            key={filter}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full border border-civic-slate-mid bg-white font-sans text-xs font-semibold text-civic-navy/70 hover:border-civic-green hover:text-civic-green transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Site cards */}
      <div className="space-y-3">
        {disposalSites.map((site, idx) => (
          <SiteCard
            key={site.id}
            site={site}
            idx={idx}
            isExpanded={expandedId === site.id}
            onToggle={() => toggleExpand(site.id)}
            isDropActive={dropTimerId === site.id}
            onDropStart={() => setDropTimerId(site.id)}
            onDropEnd={() => setDropTimerId(null)}
          />
        ))}
      </div>
    </div>
  );
}

function SiteCard({
  site, idx, isExpanded, onToggle, isDropActive, onDropStart, onDropEnd
}: {
  site: DisposalSite;
  idx: number;
  isExpanded: boolean;
  onToggle: () => void;
  isDropActive: boolean;
  onDropStart: () => void;
  onDropEnd: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isDropActive) { setTimeLeft(30); return; }
    if (timeLeft <= 0) { onDropEnd(); return; }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isDropActive, timeLeft, onDropEnd]);

  const startDrop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDropStart();
  }, [onDropStart]);

  const typeIconColors: Record<string, string> = {
    'RVM-Lite':           'bg-blue-50 text-blue-600',
    'Temple Compost Hub': 'bg-green-50 text-green-700',
    'Municipal Bin':      'bg-amber-50 text-amber-700',
    'Collection Centre':  'bg-slate-100 text-slate-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.4 }}
      className={`bg-white rounded-2xl border overflow-hidden transition-shadow duration-300
        ${isExpanded ? 'border-civic-green/40 shadow-md shadow-civic-green/10' : 'border-civic-slate-mid shadow-sm'}`}
    >
      {/* Card header — always visible */}
      <button onClick={onToggle} className="w-full p-4 text-left flex items-start gap-3.5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${typeIconColors[site.type] ?? 'bg-slate-100 text-slate-600'}`}>
          <MapPin size={20} strokeWidth={1.8} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-serif font-bold text-base text-civic-navy leading-tight">{site.name}</p>
              <p className="font-sans text-xs text-civic-slate-dark mt-0.5">{site.type}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="font-sans font-bold text-sm text-civic-navy tabular-nums">{site.distance}</span>
              <span className={`text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded-full ${
                site.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
              }`}>
                {site.open ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Waste tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {site.tags.map((tag) => {
              const cfg = tagConfig[tag];
              return (
                <span key={tag} className={`waste-tag ${cfg.bg} ${cfg.text}`}>{tag}</span>
              );
            })}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown size={18} className="text-civic-slate-dark" />
        </motion.div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="pt-1 border-t border-civic-slate-mid mb-4" />

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-civic-slate-dark mt-0.5 flex-shrink-0" />
                  <p className="font-sans text-xs text-civic-navy/70">{site.address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={13} className="text-civic-slate-dark mt-0.5 flex-shrink-0" />
                  <p className="font-sans text-xs text-civic-navy/70">{site.hours}</p>
                </div>
              </div>

              {/* Point incentive */}
              <div className="bg-civic-green/8 border border-civic-green/20 rounded-xl p-3 mb-4 flex items-center justify-between">
                <div>
                  <p className="font-serif font-bold text-civic-green text-lg leading-tight">
                    {site.pointsPerKg} pts/kg
                  </p>
                  {site.upiRate && (
                    <p className="font-sans text-xs text-civic-green/70 mt-0.5">+ {site.upiRate} UPI cashback</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-civic-amber fill-civic-amber" />
                  <span className="font-sans text-xs font-semibold text-civic-navy">{site.rating}</span>
                </div>
              </div>

              {/* Drop Here button / timer */}
              {isDropActive ? (
                <DropTimer timeLeft={timeLeft} onComplete={onDropEnd} />
              ) : (
                <motion.button
                  onClick={startDrop}
                  disabled={!site.open}
                  className={`w-full py-3.5 rounded-xl font-serif font-bold text-base flex items-center justify-center gap-2 transition-all
                    ${site.open
                      ? 'bg-civic-green text-white shadow-md shadow-civic-green/25 active:scale-95'
                      : 'bg-civic-slate text-civic-slate-dark cursor-not-allowed'}`}
                  whileTap={site.open ? { scale: 0.97 } : {}}
                >
                  <Check size={18} strokeWidth={2.5} />
                  Drop Here
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DropTimer({ timeLeft }: { timeLeft: number; onComplete?: () => void }) {
  const pct = ((30 - timeLeft) / 30) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-civic-green rounded-xl p-4 text-white"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer size={16} strokeWidth={2} />
          <p className="font-sans text-sm font-semibold">Proof of Drop</p>
        </div>
        <span className="font-mono font-bold text-xl">{timeLeft}s</span>
      </div>
      <div className="h-2 bg-white/25 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full"
          style={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="font-sans text-xs text-white/70 mt-2.5">
        Stay near the bin. Your drop will be logged automatically.
      </p>
    </motion.div>
  );
}
