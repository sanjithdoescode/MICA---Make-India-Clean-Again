import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Camera, Users, ShieldAlert, ChevronRight, CheckCircle, Eye } from 'lucide-react';

type AccusationStage = 'warning' | 'capture' | 'confirm' | 'submitted';

const offenseTypes = [
  { id: 'illegal-dumping',    label: 'Illegal Dumping' },
  { id: 'burning-waste',      label: 'Burning Waste' },
  { id: 'commercial-bypass',  label: 'Commercial Bypass' },
  { id: 'repeat-offender',    label: 'Repeat Offence' },
];

export default function ReportSomeone() {
  const [stage, setStage] = useState<AccusationStage>('warning');
  const [witnessEnabled, setWitnessEnabled] = useState(false);
  const [liveCapture, setLiveCapture] = useState(false);
  const [offense, setOffense] = useState('illegal-dumping');
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="min-h-screen bg-civic-navy text-white px-5 pt-10 pb-28">
      <AnimatePresence mode="wait">
        {stage === 'warning' && (
          <WarningStage
            key="warning"
            understood={understood}
            onToggleUnderstood={() => setUnderstood((p) => !p)}
            onProceed={() => setStage('capture')}
          />
        )}
        {stage === 'capture' && (
          <CaptureStage
            key="capture"
            offense={offense}
            onOffenseChange={setOffense}
            liveCapture={liveCapture}
            onToggleLive={() => setLiveCapture((p) => !p)}
            witnessEnabled={witnessEnabled}
            onToggleWitness={() => setWitnessEnabled((p) => !p)}
            onNext={() => setStage('confirm')}
          />
        )}
        {stage === 'confirm' && (
          <ConfirmStage
            key="confirm"
            offense={offenseTypes.find((o) => o.id === offense)?.label ?? offense}
            onSubmit={() => setStage('submitted')}
          />
        )}
        {stage === 'submitted' && (
          <SubmittedState key="submitted" onReset={() => { setStage('warning'); setUnderstood(false); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function WarningStage({
  understood, onToggleUnderstood, onProceed
}: { understood: boolean; onToggleUnderstood: () => void; onProceed: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-7">
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
        >
          <ShieldAlert size={28} className="text-civic-crimson-light" strokeWidth={1.8} />
        </motion.div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-civic-crimson-light">
          Accountability Report
        </p>
      </div>

      <h1 className="font-serif font-black leading-[1.0] mb-6" style={{ fontSize: 'clamp(2.2rem, 9vw, 3.8rem)' }}>
        You are{' '}
        <span className="italic text-civic-crimson-light">accusing</span>
        <br />a person.
      </h1>

      <div className="border-l-4 border-civic-crimson pl-5 mb-8">
        <p className="font-serif italic text-lg text-white/80 leading-relaxed">
          "This report will be reviewed by ward officers and cross-referenced with municipal records.{' '}
          <strong className="text-white not-italic">False or malicious claims</strong> may result in a
          penalty deduction of up to 500 points and potential account suspension."
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {[
          { icon: Camera,       text: 'Live photo of the individual or vehicle is mandatory.' },
          { icon: Eye,          text: 'Evidence is hashed and stored on municipal servers.' },
          { icon: AlertOctagon, text: 'Your identity remains confidential but is logged.' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
            <Icon size={16} className="text-civic-crimson-light mt-0.5 flex-shrink-0" strokeWidth={1.8} />
            <p className="font-sans text-sm text-white/70 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onToggleUnderstood}
        className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 mb-5 transition-all duration-200
          ${understood ? 'border-civic-crimson bg-civic-crimson/15' : 'border-white/20 bg-white/5'}`}
      >
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
          ${understood ? 'border-civic-crimson-light bg-civic-crimson-light' : 'border-white/30'}`}>
          {understood && <div className="w-2.5 h-2.5 rounded-sm bg-white" />}
        </div>
        <p className="font-sans text-sm text-white/80 text-left">
          I understand the consequences and confirm this report is truthful.
        </p>
      </button>

      <motion.button
        onClick={onProceed}
        disabled={!understood}
        className={`w-full py-4 rounded-2xl font-serif font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2
          ${understood
            ? 'bg-civic-crimson text-white shadow-lg shadow-civic-crimson/30 hover:bg-opacity-90'
            : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
        whileTap={understood ? { scale: 0.97 } : {}}
      >
        Proceed to Capture
        <ChevronRight size={20} />
      </motion.button>
    </motion.div>
  );
}

function CaptureStage({
  offense, onOffenseChange, liveCapture, onToggleLive, witnessEnabled, onToggleWitness, onNext
}: {
  offense: string;
  onOffenseChange: (v: string) => void;
  liveCapture: boolean;
  onToggleLive: () => void;
  witnessEnabled: boolean;
  onToggleWitness: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-civic-crimson-light mb-2">
        Step 2 of 3
      </p>
      <h2 className="font-serif font-black text-display-md text-white mb-7">
        Document the <span className="italic text-civic-crimson-light">Offence</span>
      </h2>

      {/* Offense type */}
      <div className="mb-6">
        <p className="font-sans text-xs uppercase tracking-widest text-white/50 mb-3">Offense Type</p>
        <div className="grid grid-cols-2 gap-2.5">
          {offenseTypes.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onOffenseChange(id)}
              className={`px-4 py-3 rounded-xl border text-left transition-all duration-200
                ${offense === id
                  ? 'border-civic-crimson-light bg-civic-crimson/20 text-white'
                  : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30'}`}
            >
              <p className="font-sans text-sm font-semibold">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Live capture toggle */}
      <div className="mb-4">
        <ToggleRow
          icon={Camera}
          label="Live Photo Capture"
          sub="Required: camera opens directly, no gallery access"
          active={liveCapture}
          onToggle={onToggleLive}
          accentColor="civic-crimson-light"
          required
        />
      </div>

      {/* Witness toggle */}
      <div className="mb-8">
        <ToggleRow
          icon={Users}
          label="Add Witness"
          sub="Optional: request another CleanMap user to co-sign"
          active={witnessEnabled}
          onToggle={onToggleWitness}
          accentColor="white"
        />
      </div>

      <motion.button
        onClick={onNext}
        disabled={!liveCapture}
        className={`w-full py-4 rounded-2xl font-serif font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200
          ${liveCapture
            ? 'bg-civic-crimson text-white shadow-lg shadow-civic-crimson/30'
            : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
        whileTap={liveCapture ? { scale: 0.97 } : {}}
      >
        Review & Submit
        <ChevronRight size={20} />
      </motion.button>
    </motion.div>
  );
}

function ToggleRow({
  icon: Icon, label, sub, active, onToggle, accentColor, required = false
}: {
  icon: typeof Camera; label: string; sub: string;
  active: boolean; onToggle: () => void;
  accentColor: string; required?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
        ${active ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
        ${active ? `bg-${accentColor}/20` : 'bg-white/5'}`}>
        <Icon size={18} className={active ? `text-${accentColor}` : 'text-white/40'} strokeWidth={1.8} />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="font-sans text-sm font-semibold text-white">{label}</p>
          {required && <span className="text-[10px] font-sans font-bold text-civic-crimson-light bg-civic-crimson/20 px-1.5 py-0.5 rounded uppercase">Required</span>}
        </div>
        <p className="font-sans text-xs text-white/50 mt-0.5">{sub}</p>
      </div>
      <div className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 flex-shrink-0
        ${active ? 'bg-civic-crimson' : 'bg-white/15'}`}>
        <motion.div
          className="w-5 h-5 bg-white rounded-full shadow"
          animate={{ x: active ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        />
      </div>
    </button>
  );
}

function ConfirmStage({ offense, onSubmit }: { offense: string; onSubmit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-civic-crimson-light mb-2">
        Step 3 of 3 — Final Review
      </p>
      <h2 className="font-serif font-black text-display-md text-white mb-6">
        Confirm <span className="italic text-civic-crimson-light">Report</span>
      </h2>

      <div className="bg-white/5 border border-white/15 rounded-2xl p-5 mb-6 space-y-3">
        {[
          { label: 'Type', value: offense },
          { label: 'Location', value: '9.9252° N, 78.1198° E' },
          { label: 'Timestamp', value: new Date().toLocaleString('en-IN', { hour12: false }) },
          { label: 'Photo Hash', value: 'phash:f2a1c847d9e30b56' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <span className="font-sans text-xs text-white/50 uppercase tracking-wide flex-shrink-0">{label}</span>
            <span className="font-mono text-xs text-white/90 text-right">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-civic-crimson/10 border border-civic-crimson/40 rounded-2xl p-4 mb-7">
        <p className="font-serif italic text-sm text-civic-crimson-light">
          "Submitting this report is a civic act. Municipal officers will investigate within 48 hours."
        </p>
      </div>

      <motion.button
        onClick={onSubmit}
        className="w-full py-4 rounded-2xl bg-civic-crimson text-white font-serif font-bold text-lg shadow-lg shadow-civic-crimson/30 flex items-center justify-center gap-2"
        whileTap={{ scale: 0.97 }}
      >
        <AlertOctagon size={20} strokeWidth={2} />
        Submit Accountability Report
      </motion.button>
    </motion.div>
  );
}

function SubmittedState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center pt-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="w-20 h-20 bg-civic-crimson rounded-full flex items-center justify-center mb-6 shadow-lg shadow-civic-crimson/40"
      >
        <CheckCircle size={40} className="text-white" strokeWidth={1.8} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-serif font-black text-display-md text-white">
          Report <span className="italic text-civic-crimson-light">Registered.</span>
        </h2>
        <p className="font-sans text-sm text-white/60 mt-3 mb-8 leading-relaxed max-w-xs mx-auto">
          Your accountability report has been logged. Expect officer action within 48 hours.
          Reference ID: <span className="font-mono text-civic-crimson-light">ACC-{Math.random().toString(36).slice(2,8).toUpperCase()}</span>
        </p>
      </motion.div>

      <button
        onClick={onReset}
        className="border border-white/20 text-white font-sans font-medium rounded-xl px-6 py-3 hover:bg-white/10 transition-colors"
      >
        Return to Home
      </button>
    </motion.div>
  );
}
