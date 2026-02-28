import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, MapPin, Clock, CheckCircle, AlertTriangle,
  Trash2, Pill, PackageOpen, Sparkles, Loader2, ShieldAlert, AlertOctagon,
} from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

type WasteCategory = 'illegal-dump' | 'medical' | 'unsorted';
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
type FlowState = 'idle' | 'analyzing' | 'readyToSubmit' | 'uploading' | 'extracting' | 'success';

type WasteAnalysis = {
  garbageType: string;
  severityLevel: SeverityLevel;
  confidence: number;
  details: string;
};

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
  lat:    '9.9252° N',
  lng:    '78.1198° E',
  ts:     new Date().toLocaleString('en-IN', { hour12: false }),
  device: 'Samsung SM-G991B',
  hash:   'phash:a3f8bc91d2e74106',
};

async function classifyWastePhoto(base64: string, mimeType: string): Promise<WasteAnalysis> {
  const prompt = `You are a municipal waste classification expert. Analyze this image and classify any waste or garbage you see.

Return ONLY a valid JSON object (no markdown, no backticks) with these exact fields:
- garbageType: specific waste type string (e.g. "Plastic Bottles", "Medical Waste", "Construction Debris", "Organic Waste", "Electronic Waste", "Mixed Solid Waste", "Sewage", "Chemical Waste")
- severityLevel: exactly one of "low" | "medium" | "high" | "critical"
- confidence: float from 0.0 to 1.0
- details: 1-2 sentences describing what you observe and why you assigned this severity level

Severity criteria:
low = minor littering, small quantity, non-hazardous materials
medium = moderate accumulation, visible environmental impact, blocks drainage
high = large illegal dump, mixed with hazardous materials, near water bodies
critical = medical/chemical/biohazard waste, fire risk, major public health threat

If no waste is visible, use garbageType "None Detected", severityLevel "low", confidence 0, details "No waste visible in the photo."`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64 } },
          ],
        }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const payload = await res.json();
  return JSON.parse(payload.candidates[0].content.parts[0].text) as WasteAnalysis;
}

export default function QuickReport() {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>('illegal-dump');
  const [flowState, setFlowState]               = useState<FlowState>('idle');
  const [uploadProgress, setUploadProgress]     = useState(0);
  const [reportHash, setReportHash]             = useState('');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState('');
  const [wasteAnalysis, setWasteAnalysis]       = useState<WasteAnalysis | null>(null);
  const [analysisError, setAnalysisError]       = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);

  const openPhotoCapture = () => photoInputRef.current?.click();

  const onPhotoSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];
    if (!photoFile) return;

    setCapturedPhotoUrl(URL.createObjectURL(photoFile));
    setFlowState('analyzing');
    setAnalysisError('');
    setWasteAnalysis(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(photoFile);
      });

      const result = await classifyWastePhoto(base64, photoFile.type || 'image/jpeg');
      setWasteAnalysis(result);
    } catch {
      setAnalysisError('AI analysis failed. You can still submit the report manually.');
    } finally {
      setFlowState('readyToSubmit');
    }
  }, []);

  const submitReport = useCallback(() => {
    if (flowState !== 'readyToSubmit') return;
    setFlowState('uploading');
    setUploadProgress(0);

    const tick = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(tick);
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

  const resetFlow = () => {
    setFlowState('idle');
    setUploadProgress(0);
    setReportHash('');
    setCapturedPhotoUrl('');
    setWasteAnalysis(null);
    setAnalysisError('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-civic-slate px-5 pt-10 pb-28">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onPhotoSelected}
      />

      <AnimatePresence mode="wait">
        {flowState === 'success' ? (
          <SuccessState key="success" reportHash={reportHash} category={selectedCategory} onReset={resetFlow} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
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

            <div className="mb-7">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-civic-slate-dark mb-3">
                What are you reporting?
              </p>
              <div className="flex flex-col gap-2.5">
                {wasteCategories.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCategory(id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left
                      ${selectedCategory === id
                        ? 'border-civic-green bg-white shadow-md'
                        : 'border-civic-slate-mid bg-white/60 hover:border-civic-green/40'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${selectedCategory === id ? 'bg-civic-green text-white' : 'bg-civic-slate text-civic-slate-dark'}`}>
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-serif font-bold text-base ${selectedCategory === id ? 'text-civic-navy' : 'text-civic-navy/70'}`}>
                        {label}
                      </p>
                      <p className="font-sans text-xs text-civic-slate-dark mt-0.5">{desc}</p>
                    </div>
                    {selectedCategory === id && (
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

            <AnimatePresence mode="wait">
              {flowState === 'idle' && (
                <motion.button
                  key="capture-cta"
                  onClick={openPhotoCapture}
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

              {(flowState === 'analyzing' || flowState === 'readyToSubmit') && (
                <motion.div
                  key="analysis-panel"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {capturedPhotoUrl && (
                    <div className="relative mb-4 rounded-2xl overflow-hidden border border-civic-slate-mid shadow-sm">
                      <img
                        src={capturedPhotoUrl}
                        alt="Captured waste evidence"
                        className="w-full h-52 object-cover"
                      />
                      {flowState === 'analyzing' && (
                        <div className="absolute inset-0 bg-civic-navy/65 flex flex-col items-center justify-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          >
                            <Loader2 size={30} className="text-white" strokeWidth={2} />
                          </motion.div>
                          <div className="text-center">
                            <p className="font-sans text-xs font-bold text-white uppercase tracking-[0.18em]">
                              Analysing with Gemini AI
                            </p>
                            <p className="font-sans text-[10px] text-white/60 mt-1">Classifying waste type & severity…</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {flowState === 'readyToSubmit' && wasteAnalysis && (
                    <WasteAnalysisCard analysis={wasteAnalysis} />
                  )}

                  {flowState === 'readyToSubmit' && analysisError && (
                    <div className="mb-4 p-4 bg-civic-amber-muted border border-civic-amber-light rounded-2xl">
                      <p className="font-sans text-xs font-semibold text-civic-amber uppercase tracking-wide mb-1">
                        AI Analysis Unavailable
                      </p>
                      <p className="font-sans text-xs text-civic-navy/70">{analysisError}</p>
                    </div>
                  )}

                  {flowState === 'readyToSubmit' && (
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={openPhotoCapture}
                        className="flex-shrink-0 border border-civic-slate-mid bg-white text-civic-navy font-sans font-medium rounded-xl px-4 py-3 text-sm hover:bg-civic-slate transition-colors"
                      >
                        Retake
                      </button>
                      <motion.button
                        onClick={submitReport}
                        className="flex-1 bg-civic-green text-white font-serif font-bold text-base rounded-xl py-3 shadow-lg shadow-civic-green/20 flex items-center justify-center gap-2"
                        whileTap={{ scale: 0.97 }}
                      >
                        <CheckCircle size={18} strokeWidth={2} />
                        Submit Report
                      </motion.button>
                    </div>
                  )}
                </motion.div>
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
                        <span className="font-mono text-xs text-civic-slate-dark">
                          {Math.min(100, Math.round(uploadProgress))}%
                        </span>
                      </div>
                      <div className="h-2 bg-civic-slate rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-civic-green rounded-full"
                          style={{ width: `${Math.min(100, uploadProgress)}%` }}
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
                          { icon: MapPin,  label: 'GPS Coordinates', value: `${mockExif.lat}, ${mockExif.lng}` },
                          { icon: Clock,   label: 'Device Timestamp', value: mockExif.ts },
                          { icon: Camera,  label: 'Device ID',        value: mockExif.device },
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

const severityConfig: Record<SeverityLevel, {
  label: string;
  badgeClass: string;
  barClass: string;
  icon: typeof Trash2;
}> = {
  low:      { label: 'Low Severity',      badgeClass: 'bg-civic-green/15 text-civic-green border-civic-green/30',          barClass: 'bg-civic-green',   icon: Trash2 },
  medium:   { label: 'Medium Severity',   badgeClass: 'bg-civic-amber/15 text-civic-amber border-civic-amber/30',          barClass: 'bg-civic-amber',   icon: AlertTriangle },
  high:     { label: 'High Severity',     badgeClass: 'bg-civic-crimson/15 text-civic-crimson border-civic-crimson/30',    barClass: 'bg-civic-crimson', icon: ShieldAlert },
  critical: { label: 'Critical Hazard',   badgeClass: 'bg-red-500/15 text-red-400 border-red-400/30',                     barClass: 'bg-red-500',       icon: AlertOctagon },
};

function WasteAnalysisCard({ analysis }: { analysis: WasteAnalysis }) {
  const { label, badgeClass, barClass, icon: SeverityIcon } = severityConfig[analysis.severityLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-civic-slate-mid p-4 mb-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={13} className="text-civic-green" strokeWidth={2} />
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-civic-slate-dark">
          Gemini AI Classification
        </p>
      </div>

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <p className="font-serif font-bold text-xl text-civic-navy leading-tight">{analysis.garbageType}</p>
          <p className="font-sans text-xs text-civic-slate-dark mt-1.5 leading-relaxed">{analysis.details}</p>
        </div>
        <span className={`flex-shrink-0 flex items-center gap-1.5 border rounded-xl px-2.5 py-1.5 text-xs font-sans font-bold ${badgeClass}`}>
          <SeverityIcon size={11} strokeWidth={2.5} />
          {label}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="font-sans text-[10px] uppercase tracking-widest text-civic-slate-dark">Detection Confidence</p>
          <p className="font-mono text-[10px] font-semibold text-civic-navy">{Math.round(analysis.confidence * 100)}%</p>
        </div>
        <div className="h-1.5 bg-civic-slate rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${analysis.confidence * 100}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
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
