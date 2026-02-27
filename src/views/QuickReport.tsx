import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Clock, CheckCircle, AlertTriangle, Trash2, Pill, PackageOpen } from 'lucide-react';

type WasteCategory = 'illegal-dump' | 'medical' | 'unsorted';
type FlowState = 'idle' | 'uploading' | 'extracting' | 'success';

const wasteCategories: { id: WasteCategory; label: string; icon: typeof Trash2; desc: string }[] = [
  { id: 'illegal-dump', label: 'Illegal Dump',  icon: AlertTriangle, desc: 'Unauthorized waste deposit' },
  { id: 'medical',      label: 'Medical Waste', icon: Pill,          desc: 'Biohazard / pharma waste' },
  { id: 'unsorted',     label: 'Unsorted',      icon: PackageOpen,   desc: 'Mixed, unlabelled waste' },
];

function generateReportHash() {
  return 'RPT-' + Math.random().toString(36).slice(2, 6).toUpperCase() +
         '-' + Date.now().toString(36).slice(-4).toUpperCase();
}

const mockExif = {
  lat:  '9.9252° N',
  lng:  '78.1198° E',
  ts:   new Date().toLocaleString('en-IN', { hour12: false }),
  device: 'Samsung SM-G991B',
  hash:   'phash:a3f8bc91d2e74106',
};

export default function QuickReport() {
  const [category, setCategory]   = useState<WasteCategory>('illegal-dump');
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [progress, setProgress]   = useState(0);
  const [reportHash, setReportHash] = useState('');

  const startUpload = useCallback(() => {
    if (flowState !== 'idle') return;
    setFlowState('uploading');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          setFlowState('extracting');
          setTimeout(() => {
            setReportHash(generateReportHash());
            setFlowState('success');
          }, 1600);
          return 100;
        }
        return p + Math.random() * 18 + 5;
      });
    }, 120);
  }, [flowState]);

  const reset = () => {
    setFlowState('idle');
    setProgress(0);
    setReportHash('');
  };

  return (
    <div className="min-h-screen bg-civic-slate px-5 pt-10 pb-28">
      <AnimatePresence mode="wait">
        {flowState === 'success' ? (
          <SuccessState key="success" reportHash={reportHash} category={category} onReset={reset} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="mb-8">
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-civic-slate-dark mb-2">
                Madurai CleanMap
              </p>
              <h1 className="font-serif font-black text-display-lg text-civic-navy leading-[1.0] text-balance">
                Snap the<br />
                <span className="italic text-civic-green">Mess.</span>
              </h1>
              <p className="font-sans text-sm text-civic-slate-dark mt-3 leading-relaxed">
                One tap. Geotagged. Timestamped. Every report gets reviewed within 24 hrs.
              </p>
            </div>

            {/* Category selector */}
            <div className="mb-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-civic-slate-dark mb-3">
                What are you reporting?
              </p>
              <div className="flex flex-col gap-2.5">
                {wasteCategories.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setCategory(id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                      ${category === id
                        ? 'border-civic-green bg-white shadow-md'
                        : 'border-civic-slate-mid bg-white/60 hover:border-civic-green/40'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${category === id ? 'bg-civic-green text-white' : 'bg-civic-slate text-civic-slate-dark'}`}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-serif font-bold text-base ${category === id ? 'text-civic-navy' : 'text-civic-navy/70'}`}>
                        {label}
                      </p>
                      <p className="font-sans text-xs text-civic-slate-dark mt-0.5">{desc}</p>
                    </div>
                    {category === id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-civic-green flex items-center justify-center flex-shrink-0"
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload state */}
            <AnimatePresence mode="wait">
              {flowState === 'idle' && (
                <motion.button
                  key="cta"
                  onClick={startUpload}
                  className="w-full relative overflow-hidden"
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="animate-pulse-ring bg-civic-green text-white rounded-2xl p-5 flex items-center justify-center gap-4 shadow-lg shadow-civic-green/20">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                      <Camera size={28} strokeWidth={1.8} />
                    </motion.div>
                    <div className="text-left">
                      <p className="font-serif font-bold text-xl leading-tight">Capture Evidence</p>
                      <p className="font-sans text-sm opacity-80 mt-0.5">Photo + GPS + Timestamp</p>
                    </div>
                  </div>
                </motion.button>
              )}

              {(flowState === 'uploading' || flowState === 'extracting') && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-5 border border-civic-slate-mid shadow-sm"
                >
                  {flowState === 'uploading' && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-sans text-sm font-semibold text-civic-navy">Uploading evidence...</p>
                        <span className="font-mono text-xs text-civic-slate-dark">{Math.min(100, Math.round(progress))}%</span>
                      </div>
                      <div className="h-2 bg-civic-slate rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-civic-green rounded-full"
                          style={{ width: `${Math.min(100, progress)}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </>
                  )}

                  {flowState === 'extracting' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="font-sans text-sm font-semibold text-civic-navy mb-3">
                        Extracting metadata
                        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                          ...
                        </motion.span>
                      </p>
                      <div className="space-y-2">
                        {[
                          { icon: MapPin, label: 'GPS Coordinates', value: `${mockExif.lat}, ${mockExif.lng}` },
                          { icon: Clock, label: 'Device Timestamp', value: mockExif.ts },
                          { icon: Camera, label: 'Device ID', value: mockExif.device },
                        ].map(({ icon: Icon, label, value }, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.25 }}
                            className="flex items-start gap-2.5 text-xs"
                          >
                            <Icon size={13} className="text-civic-green mt-0.5 flex-shrink-0" />
                            <span className="font-sans text-civic-slate-dark">{label}:</span>
                            <span className="font-mono text-civic-navy font-medium">{value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessState({ reportHash, category, onReset }: {
  reportHash: string;
  category: WasteCategory;
  onReset: () => void;
}) {
  const categoryLabel = wasteCategories.find((c) => c.id === category)?.label ?? category;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center pt-8"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
        className="w-20 h-20 bg-civic-green rounded-full flex items-center justify-center mb-6 shadow-lg shadow-civic-green/30"
      >
        <CheckCircle size={40} className="text-white" strokeWidth={1.8} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-serif font-black text-display-md text-civic-navy">
          Report <span className="italic text-civic-green">Filed.</span>
        </h2>
        <p className="font-sans text-sm text-civic-slate-dark mt-2 mb-7">
          {categoryLabel} · Ward 14, Madurai
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full bg-civic-navy rounded-2xl p-5 mb-4 text-left"
      >
        <p className="font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">Report Hash</p>
        <p className="font-mono text-lg font-semibold text-white tracking-wider">{reportHash}</p>
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="font-sans text-xs text-white/50 mb-0.5">Perceptual Hash (anti-fraud)</p>
          <p className="font-mono text-xs text-civic-green-light">{mockExif.hash}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="w-full bg-civic-amber-muted border border-civic-amber-light rounded-2xl p-4 mb-7 flex items-center gap-3"
      >
        <Clock size={18} className="text-civic-amber flex-shrink-0" />
        <div className="text-left">
          <p className="font-sans text-xs font-semibold text-civic-amber uppercase tracking-wide">SLA: 24 Hours</p>
          <p className="font-sans text-xs text-civic-navy/70 mt-0.5">Ward officer notified. Action expected by tomorrow.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="w-full bg-civic-green-muted border border-civic-green-light rounded-2xl p-4 mb-8 flex items-center gap-3"
      >
        <div className="text-left">
          <p className="font-serif font-bold text-2xl text-civic-green">+50 pts</p>
          <p className="font-sans text-xs text-civic-navy/60 mt-0.5">Added to your CleanMap wallet</p>
        </div>
      </motion.div>

      <button onClick={onReset} className="civic-btn-ghost w-full">
        Report Another Issue
      </button>
    </motion.div>
  );
}
