import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav, type ViewId } from './components/BottomNav';
import QuickReport from './views/QuickReport';
import ReportSomeone from './views/ReportSomeone';
import NearestDisposal from './views/NearestDisposal';
import MissionsProfile from './views/MissionsProfile';
import MunicipalDashboard from './views/MunicipalDashboard';
import HomePage from './views/HomePage';
import { LayoutDashboard, X } from 'lucide-react';

const citizenViews: Record<ViewId, React.ComponentType> = {
  report:   QuickReport,
  disposal: NearestDisposal,
  missions: MissionsProfile,
  profile:  MissionsProfile,
};

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  in:      { opacity: 1, y: 0 },
  out:     { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.35,
  ease: 'easeOut' as const,
};

export default function App() {
  const [showHomePage, setShowHomePage] = useState(true);
  const [activeView, setActiveView]     = useState<ViewId>('report');
  const [showReport, setShowReport]     = useState(false);
  const [isDashboard, setIsDashboard]   = useState(false);

  const ActiveCitizenView = citizenViews[activeView];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {showHomePage ? (
          <motion.div
            key="home"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <HomePage onEnter={() => setShowHomePage(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="app-shell"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {/* Municipal dashboard / citizen toggle — top right */}
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
              {!isDashboard && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setShowReport((p) => !p)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-semibold border transition-all duration-200
                    ${showReport
                      ? 'bg-civic-navy text-white border-civic-navy'
                      : 'bg-white border-civic-slate-mid text-civic-navy shadow-sm'}`}
                >
                  <X size={13} className={showReport ? 'block' : 'hidden'} />
                  {showReport ? 'Cancel' : '⚑ Report Someone'}
                </motion.button>
              )}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setIsDashboard((p) => !p); setShowReport(false); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-sans text-xs font-semibold border shadow-sm transition-all duration-200
                  ${isDashboard
                    ? 'bg-civic-navy text-white border-civic-navy'
                    : 'bg-white border-civic-slate-mid text-civic-navy hover:border-civic-navy/40'}`}
                title={isDashboard ? 'Citizen View' : 'Municipal Ops'}
              >
                <LayoutDashboard size={15} />
                {isDashboard ? 'Citizen View' : 'Ops Dashboard'}
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {isDashboard ? (
                <motion.div
                  key="dashboard"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MunicipalDashboard />
                </motion.div>
              ) : showReport ? (
                <motion.div
                  key="report-someone"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ReportSomeone />
                  <BottomNav activeView={activeView} onNavigate={(v) => { setActiveView(v); setShowReport(false); }} onHome={() => { setShowHomePage(true); setShowReport(false); }} />
                </motion.div>
              ) : (
                <motion.div
                  key={activeView}
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ActiveCitizenView />
                  <BottomNav activeView={activeView} onNavigate={setActiveView} onHome={() => setShowHomePage(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
