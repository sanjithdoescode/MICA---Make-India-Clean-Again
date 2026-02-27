import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Trophy, MapPin, BarChart2, ShieldCheck,
  CheckCircle2, ChevronDown, Navigation, ArrowRight,
} from 'lucide-react';
interface HomePageProps {
  onEnter: () => void;
}

const fadeUpChild = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerSection = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const corePillars = [
  {
    PillarIcon: Camera,
    pillarTitle: 'Proof-Based Reporting',
    pillarDesc: 'Photo + geotag + SHA-256 hash = tamper-evident, court-admissible ticket.',
  },
  {
    PillarIcon: Trophy,
    pillarTitle: 'Gamification & Economics',
    pillarDesc: 'Points, leaderboards, kirana vouchers, festival team challenges.',
  },
  {
    PillarIcon: MapPin,
    pillarTitle: 'Proper Disposal Mapping',
    pillarDesc: 'Live map of bins, RVM-Lites, compost hubs, and kirana drop-points.',
  },
  {
    PillarIcon: BarChart2,
    pillarTitle: 'Ops & Transparency',
    pillarDesc: 'Municipal dashboard, SLA timers, weekly public ward heatmaps.',
  },
  {
    PillarIcon: ShieldCheck,
    pillarTitle: 'Anti-Fraud & Trust',
    pillarDesc: 'Perceptual hashing, GPS cross-checks, tiered human review.',
  },
];

const userJourneys = [
  {
    journeyStep: '01',
    journeyTitle: 'Quick Report',
    journeyDesc: 'Single-tap → photo → auto GPS + timestamp → category selection → SHA-256 ticket hash generated → SLA shown instantly.',
    innovationTag: 'report_hash = SHA256(photo + gps + ts + nonce)',
  },
  {
    journeyStep: '02',
    journeyTitle: 'Report Someone',
    journeyDesc: 'Evidence-gated: proof photo + location + witness or consecutive frames required. Legal disclaimer shown. Elevated moderation queue — no false accusations.',
    innovationTag: 'human review tier before enforcement escalation',
  },
  {
    journeyStep: '03',
    journeyTitle: 'Nearest Disposal',
    journeyDesc: '"Dispose Here" → radius map sorted by distance + waste type → one-tap navigation → after-photo proof-of-drop earns points + UPI cashback.',
    innovationTag: 'proof-of-drop awards credit automatically',
  },
  {
    journeyStep: '04',
    journeyTitle: 'Gamified Missions',
    journeyDesc: 'Daily micro-missions, festival event packs (temple/market), college and ward team leaderboards competing for sponsor prizes.',
    innovationTag: 'festival mode adapts to any regional calendar',
  },
  {
    journeyStep: '05',
    journeyTitle: 'Municipal Ops',
    journeyDesc: 'Tickets auto-categorized, assigned to ward officers. Field worker gets route + job, marks done with after-photo. Unresolved tickets auto-escalate past SLA.',
    innovationTag: 'SLA breach triggers automatic escalation',
  },
];

const judgingCriteria = [
  {
    criterionTitle: 'Problem Understanding & Relevance',
    criterionBody: "India generates 62M tonnes of solid waste annually — less than 20% is processed. MICA addresses this at the ward level with Madurai as the live pilot: ward-level data, Tamil + Hindi support, and local infrastructure (kirana stores, temples, markets) mapped to national equivalents across 4,041 ULBs.",
  },
  {
    criterionTitle: 'Innovation & Creativity',
    criterionBody: 'No existing civic app combines proof-hash reporting, gamified municipal accountability, WhatsApp/SMS fallback for feature phones, and festival event modes. The SHA-256 client hash makes every report tamper-evident before it leaves the device.',
  },
  {
    criterionTitle: 'Technical Implementation',
    criterionBody: 'SHA-256 client hashing, perceptual hash deduplication, offline-first PWA, GPS spoofing detection, Firebase + edge functions, and a city-config JSON that lets any ULB onboard MICA without touching the codebase.',
  },
  {
    criterionTitle: 'AI Utilization Effectiveness',
    criterionBody: 'On-device MobileNetV3 waste category classifier, perceptual hash fraud detection, GPS cross-validation engine, regional ASR + NLP (Tamil, Hindi, Telugu on roadmap), and a density ML model for ward-level heatmap prediction.',
  },
  {
    criterionTitle: 'Feasibility & Scalability',
    criterionBody: "Ward-by-ward rollout starting in Madurai's 100 wards. Kirana stores (12M+ nationally) serve as zero-cost drop-point infrastructure. Micro-franchise collectors handle last-mile logistics. The city-config model makes MICA a reusable platform — not a one-city app.",
  },
];

const rolloutPhases = [
  {
    phaseLabel: 'Phase 1 — Pilot',
    phaseYear: '2025',
    phaseDetails: ['Madurai', '100 wards', '3 lakh citizens', '4 colleges', '200 kirana drop-points'],
  },
  {
    phaseLabel: 'Phase 2 — Tamil Nadu',
    phaseYear: '2026',
    phaseDetails: ['Chennai, Coimbatore, Trichy, Salem', '10 cities', 'State govt partnership', 'SWM Act compliance'],
  },
  {
    phaseLabel: 'Phase 3 — National',
    phaseYear: '2027+',
    phaseDetails: ['SBM 2.0 integration', '4,041 ULBs', 'Hindi / Telugu / Kannada / Bengali', 'Central MoHUA dashboard'],
  },
];

const aiPipeline = [
  { aiInput: 'Photo Upload',    aiProcessor: 'On-device MobileNetV3',    aiOutput: 'Waste Category' },
  { aiInput: 'Photo Upload',    aiProcessor: 'Perceptual Hash',           aiOutput: 'Duplicate / Fraud Flag' },
  { aiInput: 'GPS + Timestamp', aiProcessor: 'Cross-validation Engine',   aiOutput: 'Spoofing Alert' },
  { aiInput: 'Voice Note',      aiProcessor: 'Regional ASR + NLP',        aiOutput: 'Structured Tag' },
  { aiInput: 'All Reports',     aiProcessor: 'Density ML',                aiOutput: 'Ward Heatmap Prediction' },
];

const pilotProjections = [
  { projectionFigure: '50,000+', projectionLabel: 'citizens engaged through missions & gamified reporting in year 1' },
  { projectionFigure: '~200T',   projectionLabel: 'waste redirected through kirana stores & RVM drop-points' },
  { projectionFigure: '100',     projectionLabel: 'wards with live SLA-tracked municipal ticket resolution' },
  { projectionFigure: '200+',    projectionLabel: 'kirana stores onboarded as zero-cost drop-point infrastructure' },
];

export default function HomePage({ onEnter }: HomePageProps) {
  const [openCriterionIdx, setOpenCriterionIdx] = useState<number | null>(null);

  const scrollToContent = () => {
    document.getElementById('mica-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Section 1: Hero ─────────────────────────────────── */}
      <section className="relative min-h-screen bg-white flex flex-col justify-center overflow-hidden">

        {/* India outline — subtle decorative background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
          <svg viewBox="0 0 500 600" className="h-[90vh] max-h-[700px]" fill="none">
            <path
              d="M278,28 L302,22 L330,26 L358,38 L378,55 L395,78 L408,104 L418,132 L423,162 L422,192 L413,218 L398,240 L382,258 L395,272 L408,290 L415,310 L408,330 L390,345 L370,360 L348,378 L325,400 L302,422 L280,445 L268,462 L258,445 L240,422 L215,398 L190,372 L165,345 L142,318 L122,288 L105,258 L92,228 L82,196 L78,162 L80,128 L90,96 L108,68 L132,46 L162,32 L195,24 L232,22 Z"
              stroke="#1a6b3c"
              strokeWidth="1.5"
              fill="#1a6b3c"
              fillOpacity="0.15"
            />
          </svg>
        </div>

        {/* GDG badge */}
        <div className="absolute top-6 right-6 z-10">
          <span className="font-sans text-xs font-semibold text-civic-green tracking-widest uppercase">
            Built for GDG Madurai · 2025
          </span>
        </div>

        {/* Hero content */}
        <motion.div
          variants={staggerSection}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center"
        >
          <motion.div variants={fadeUpChild} className="mb-5 flex justify-center">
            <span className="font-sans text-xs font-black tracking-[0.3em] uppercase text-civic-amber border-b-2 border-civic-amber pb-0.5">
              MICA
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpChild}
            className="text-display-xl font-serif text-civic-navy text-balance mb-6"
          >
            Make India<br className="hidden sm:block" /> Clean Again
          </motion.h1>

          <motion.p
            variants={fadeUpChild}
            className="font-sans text-lg text-civic-navy/60 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          >
            Proof-based waste reporting. Gamified civic action. Real municipal accountability —
            starting in Madurai, scaling to every Indian city.
          </motion.p>

          <motion.div
            variants={fadeUpChild}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={onEnter}
              className="civic-btn-primary flex items-center gap-2 text-base px-8 py-3.5"
            >
              Enter the App <ArrowRight size={18} />
            </button>
            <button
              onClick={scrollToContent}
              className="flex items-center gap-2 font-sans font-medium text-civic-navy/45 hover:text-civic-navy transition-colors px-4 py-3.5"
            >
              See How It Works <ChevronDown size={18} />
            </button>
          </motion.div>
        </motion.div>

        {/* Pilot badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="absolute bottom-8 left-6 z-10 flex items-center gap-2 bg-civic-green-muted rounded-xl px-4 py-2.5 border border-civic-green/20"
        >
          <Navigation size={13} className="text-civic-green" />
          <span className="font-sans text-sm text-civic-green font-semibold">Pilot: Madurai, Tamil Nadu</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="absolute bottom-9 right-6 z-10 font-serif italic text-civic-navy/30 text-sm"
        >
          Starting in Madurai. Built for India.
        </motion.p>
      </section>

      {/* ── Section 2: The Problem ───────────────────────────── */}
      <section id="mica-content" className="bg-civic-slate py-24 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-5xl mx-auto"
        >
          <motion.p variants={fadeUpChild} className="font-sans text-xs font-bold tracking-widest uppercase text-civic-slate-dark mb-3">
            The Challenge
          </motion.p>
          <motion.h2 variants={fadeUpChild} className="text-display-md font-serif text-civic-navy mb-12 text-balance">
            India's waste crisis needs a systemic answer
          </motion.h2>

          <motion.div variants={staggerSection} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { statFigure: '62M tonnes', statDetail: 'of solid waste generated in India annually' },
              { statFigure: '<20%',        statDetail: 'actually processed or recycled nationwide' },
              { statFigure: '4,041 ULBs', statDetail: 'with inadequate waste management systems' },
            ].map(({ statFigure, statDetail }) => (
              <motion.div key={statFigure} variants={fadeUpChild} className="civic-card p-6">
                <div className="text-3xl font-serif font-bold text-civic-crimson mb-2">{statFigure}</div>
                <div className="font-sans text-sm text-civic-navy/65 leading-snug">{statDetail}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUpChild}
            className="bg-civic-amber-muted border border-civic-amber/30 rounded-2xl px-6 py-5 mb-10 flex flex-wrap gap-x-8 gap-y-3 items-center"
          >
            <span className="font-sans text-xs font-bold tracking-widest uppercase text-civic-amber w-full sm:w-auto">
              Madurai Pilot Data
            </span>
            {[
              { pilotFigure: '47 tonnes', pilotContext: 'illegally dumped / day' },
              { pilotFigure: '72 hrs',    pilotContext: 'avg municipal response' },
              { pilotFigure: '<12%',      pilotContext: 'waste segregated at source' },
            ].map(({ pilotFigure, pilotContext }) => (
              <div key={pilotFigure} className="flex items-baseline gap-1.5">
                <span className="font-sans font-bold text-civic-amber text-lg">{pilotFigure}</span>
                <span className="font-sans text-sm text-civic-navy/55">{pilotContext}</span>
              </div>
            ))}
          </motion.div>

          <motion.p variants={fadeUpChild} className="italic-serif text-lg text-civic-navy/65 max-w-3xl text-balance leading-relaxed">
            "India's waste crisis isn't a single city's problem. But it can be solved one city at a time — with the right proof, the right incentives, and the right infrastructure."
          </motion.p>
        </motion.div>
      </section>

      {/* ── Section 3: Five Core Pillars ────────────────────── */}
      <section className="bg-white py-24 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-5xl mx-auto"
        >
          <motion.p variants={fadeUpChild} className="font-sans text-xs font-bold tracking-widest uppercase text-civic-slate-dark mb-3">
            How MICA Works
          </motion.p>
          <motion.h2 variants={fadeUpChild} className="text-display-md font-serif text-civic-navy mb-12 text-balance">
            Five pillars. One platform.
          </motion.h2>

          <motion.div variants={staggerSection} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {corePillars.map(({ PillarIcon, pillarTitle, pillarDesc }) => (
              <motion.div
                key={pillarTitle}
                variants={fadeUpChild}
                className="civic-card p-6 border-l-4 border-l-civic-green hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-civic-green-muted flex items-center justify-center mb-4">
                  <PillarIcon size={20} className="text-civic-green" />
                </div>
                <h3 className="font-sans font-semibold text-civic-navy text-base mb-2">{pillarTitle}</h3>
                <p className="font-sans text-sm text-civic-navy/60 leading-relaxed">{pillarDesc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p variants={fadeUpChild} className="font-sans text-sm text-civic-slate-dark italic text-center">
            Every pillar is city-agnostic. Plug in any ULB's ward map and MICA runs.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Section 4: Five User Journeys ───────────────────── */}
      <section className="bg-civic-green py-24 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-4xl mx-auto"
        >
          <motion.p variants={fadeUpChild} className="font-sans text-xs font-bold tracking-widest uppercase text-white/55 mb-3">
            The Five Flows
          </motion.p>
          <motion.h2 variants={fadeUpChild} className="text-display-md font-serif text-white mb-14 text-balance">
            Every citizen. Every officer. Every scenario.
          </motion.h2>

          <div className="relative">
            <div className="absolute left-7 top-8 bottom-8 w-px bg-white/20 hidden sm:block" />

            <motion.div variants={staggerSection} className="space-y-10">
              {userJourneys.map(({ journeyStep, journeyTitle, journeyDesc, innovationTag }) => (
                <motion.div key={journeyStep} variants={fadeUpChild} className="flex gap-6 items-start">
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                    <span className="font-mono text-sm font-bold text-white/70">{journeyStep}</span>
                  </div>
                  <div className="pt-1.5 min-w-0">
                    <h3 className="font-sans font-semibold text-white text-lg mb-2">{journeyTitle}</h3>
                    <p className="font-sans text-sm text-white/65 leading-relaxed mb-3">{journeyDesc}</p>
                    <span className="inline-block font-mono text-xs bg-white/15 text-white px-3 py-1.5 rounded-lg border border-white/25">
                      {innovationTag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Section 5: Why MICA Wins ─────────────────────────── */}
      <section className="bg-civic-slate py-24 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-4xl mx-auto"
        >
          <motion.p variants={fadeUpChild} className="font-sans text-xs font-bold tracking-widest uppercase text-civic-slate-dark mb-3">
            Judging Criteria
          </motion.p>
          <motion.h2 variants={fadeUpChild} className="text-display-md font-serif text-civic-navy mb-12 text-balance">
            Why MICA wins on every dimension
          </motion.h2>

          <motion.div variants={staggerSection} className="space-y-3">
            {judgingCriteria.map(({ criterionTitle, criterionBody }, criterionIdx) => (
              <motion.div key={criterionTitle} variants={fadeUpChild} className="civic-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenCriterionIdx(openCriterionIdx === criterionIdx ? null : criterionIdx)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2 size={20} className="text-civic-green flex-shrink-0" />
                    <span className="font-sans font-semibold text-civic-navy text-base">{criterionTitle}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: openCriterionIdx === criterionIdx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={18} className="text-civic-slate-dark" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openCriterionIdx === criterionIdx && (
                    <motion.div
                      key="criterion-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 font-sans text-sm text-civic-navy/70 leading-relaxed border-t border-civic-slate-mid pl-[3.25rem]">
                        {criterionBody}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 6: National Scale Vision ────────────────── */}
      <section className="bg-civic-green py-24 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-5xl mx-auto"
        >
          <motion.p variants={fadeUpChild} className="font-sans text-xs font-bold tracking-widest uppercase text-white/55 mb-3">
            Madurai Is Just The Beginning
          </motion.p>
          <motion.h2 variants={fadeUpChild} className="text-display-md font-serif text-white mb-4 text-balance">
            A three-phase national rollout
          </motion.h2>
          <motion.p variants={fadeUpChild} className="font-sans text-base text-white/65 mb-16 max-w-2xl">
            The architecture is already city-agnostic. Adding a new city is a config file, not a codebase.
          </motion.p>

          <motion.div variants={staggerSection} className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Dashed connector — desktop only */}
            <div
              className="hidden md:block absolute top-8 h-px border-t-2 border-dashed border-white/25 z-0"
              style={{ left: '18%', right: '18%' }}
            />

            {rolloutPhases.map(({ phaseLabel, phaseYear, phaseDetails }, phaseIdx) => (
              <motion.div
                key={phaseLabel}
                variants={fadeUpChild}
                className="relative z-10 flex flex-col items-center text-center px-4"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border-2 ${
                  phaseIdx === 0
                    ? 'bg-white border-white'
                    : 'bg-white/15 border-white/35'
                }`}>
                  <span className={`font-mono font-bold text-xl ${phaseIdx === 0 ? 'text-civic-green' : 'text-white'}`}>
                    0{phaseIdx + 1}
                  </span>
                </div>
                <div className="font-sans text-xs font-bold tracking-widest uppercase text-white/45 mb-1">{phaseYear}</div>
                <div className="font-sans font-semibold text-white text-base mb-4">{phaseLabel}</div>
                <ul className="space-y-2 w-full">
                  {phaseDetails.map((phaseDetail) => (
                    <li key={phaseDetail} className="font-sans text-sm text-white/65 flex items-start gap-1.5 text-left justify-center">
                      <span className="text-white/35 mt-0.5">·</span>
                      {phaseDetail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 7: AI Backbone ───────────────────────────── */}
      <section className="bg-white py-24 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-4xl mx-auto"
        >
          <motion.p variants={fadeUpChild} className="font-sans text-xs font-bold tracking-widest uppercase text-civic-slate-dark mb-3">
            The AI Backbone
          </motion.p>
          <motion.h2 variants={fadeUpChild} className="text-display-md font-serif text-civic-navy mb-3 text-balance">
            Intelligence at every step
          </motion.h2>
          <motion.p variants={fadeUpChild} className="font-sans text-sm text-civic-slate-dark italic mb-12">
            All classifiers run on-device first — works offline, protects privacy.
          </motion.p>

          <motion.div variants={staggerSection} className="space-y-3">
            {aiPipeline.map(({ aiInput, aiProcessor, aiOutput }) => (
              <motion.div
                key={aiProcessor}
                variants={fadeUpChild}
                className="flex items-center gap-3 flex-wrap sm:flex-nowrap"
              >
                <div className="flex-shrink-0 bg-civic-slate rounded-xl px-4 py-3 font-mono text-xs font-semibold text-civic-navy/65 w-full sm:w-36 text-center">
                  {aiInput}
                </div>
                <ArrowRight size={15} className="text-civic-slate-dark flex-shrink-0 hidden sm:block mx-1" />
                <div className="flex-1 bg-civic-green-muted rounded-xl px-4 py-3 font-sans text-sm font-semibold text-civic-green text-center border border-civic-green/20">
                  {aiProcessor}
                </div>
                <ArrowRight size={15} className="text-civic-slate-dark flex-shrink-0 hidden sm:block mx-1" />
                <div className="flex-shrink-0 bg-civic-green rounded-xl px-4 py-3 font-mono text-xs font-semibold text-white w-full sm:w-44 text-center">
                  {aiOutput}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 8: Impact Vision ─────────────────────────── */}
      <section className="bg-civic-amber-muted py-24 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-5xl mx-auto"
        >
          <motion.p variants={fadeUpChild} className="font-sans text-xs font-bold tracking-widest uppercase text-civic-amber mb-3">
            What the Madurai Pilot Unlocks
          </motion.p>
          <motion.h2 variants={fadeUpChild} className="text-display-md font-serif text-civic-navy mb-4 text-balance">
            Year-one targets for the pilot
          </motion.h2>
          <motion.p variants={fadeUpChild} className="font-sans text-sm text-civic-navy/55 mb-12 max-w-2xl">
            Projected outcomes based on Madurai's 100 wards, 3 lakh citizens, and existing kirana + RVM infrastructure.
          </motion.p>

          <motion.div variants={staggerSection} className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {pilotProjections.map(({ projectionFigure, projectionLabel }) => (
              <motion.div key={projectionFigure} variants={fadeUpChild} className="civic-card p-6 text-center">
                <div className="font-serif font-bold text-3xl text-civic-green mb-2">{projectionFigure}</div>
                <div className="font-sans text-xs text-civic-navy/55 leading-snug">{projectionLabel}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* National projection */}
          <motion.div variants={fadeUpChild} className="bg-civic-green rounded-2xl px-8 py-6 mb-10">
            <p className="font-sans text-xs font-bold tracking-widest uppercase text-white/55 mb-4">
              At Scale Across India
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                '60M reports / year',
                '2M tonnes redirected',
                '12M kirana drop-points',
                '4,041 ULBs covered',
              ].map((nationalProjection) => (
                <div key={nationalProjection} className="font-sans font-semibold text-white text-sm">
                  {nationalProjection}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p variants={fadeUpChild} className="font-serif italic text-2xl text-civic-navy text-center text-balance">
            "One city proves it. One country needs it."
          </motion.p>
        </motion.div>
      </section>

      {/* ── Section 9: Enter App CTA ─────────────────────────── */}
      <section className="bg-civic-green py-28 px-6">
        <motion.div
          variants={staggerSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUpChild} className="text-display-lg font-serif text-white mb-5 text-balance">
            Ready to make India cleaner?
          </motion.h2>
          <motion.p variants={fadeUpChild} className="font-sans text-base text-white/70 mb-12 text-balance leading-relaxed">
            Start in Madurai. See how it works. Imagine your city next.
          </motion.p>

          <motion.div variants={fadeUpChild}>
            <button
              onClick={onEnter}
              className="bg-white text-civic-green font-sans font-semibold rounded-xl px-10 py-4 text-lg inline-flex items-center gap-3 transition-all duration-200 active:scale-95 hover:bg-white/90"
            >
              Enter MICA <ArrowRight size={20} />
            </button>
          </motion.div>

          <motion.div variants={fadeUpChild} className="mt-16 space-y-2">
            <p className="font-serif italic text-2xl text-white/45">சுத்தமான இந்தியா</p>
            <p className="font-sans text-xs text-white/45 tracking-widest uppercase">
              GDG Madurai 2025 · A platform for every Indian city
            </p>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
