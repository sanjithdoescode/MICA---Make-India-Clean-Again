import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Zap, Gift, ChevronRight, Star } from 'lucide-react';
import { PointsTicker } from '../components/PointsTicker';
import { RankBadge } from '../components/RankBadge';

type LeaderboardTab = 'college' | 'ward';

interface MissionItem {
  id: string;
  title: string;
  desc: string;
  reward: number;
  progress: number;
  total: number;
  icon: typeof Target;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badge?: string;
}

const activeMissions: MissionItem[] = [
  { id: 'm1', title: 'Street Sweep',  desc: '5 reports in your ward this week',  reward: 200, progress: 3, total: 5,  icon: Target },
  { id: 'm2', title: 'Plastic Buster', desc: 'Drop 2kg plastic at any RVM-Lite',  reward: 150, progress: 1, total: 2,  icon: Zap },
  { id: 'm3', title: 'Consistent',    desc: '7-day reporting streak',            reward: 300, progress: 4, total: 7,  icon: Star },
];

const collegeLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Meenakshi College',        points: 12840, badge: '🥇' },
  { rank: 2, name: 'Lady Doak College',         points: 11220, badge: '🥈' },
  { rank: 3, name: 'Madurai Kamaraj University',points: 9870,  badge: '🥉' },
  { rank: 4, name: 'Thiagarajar College',       points: 7650 },
  { rank: 5, name: 'American College',          points: 6310 },
];

const wardLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Ward 14 — Goripalayam',    points: 18900, badge: '🥇' },
  { rank: 2, name: 'Ward 22 — KK Nagar',       points: 16450, badge: '🥈' },
  { rank: 3, name: 'Ward 8 — Anna Nagar',      points: 14200, badge: '🥉' },
  { rank: 4, name: 'Ward 31 — Tallakulam',     points: 11780 },
  { rank: 5, name: 'Ward 5 — Sellur',          points: 9320 },
];

const NEXT_VOUCHER_THRESHOLD = 1000;
const USER_POINTS = 740;
const USER_RANK = 23;

export default function MissionsProfile() {
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardTab>('college');

  const leaderboardData = leaderboardTab === 'college' ? collegeLeaderboard : wardLeaderboard;
  const progressPct = (USER_POINTS / NEXT_VOUCHER_THRESHOLD) * 100;

  return (
    <div className="min-h-screen bg-civic-slate px-5 pt-10 pb-28">
      {/* Profile hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-civic-navy rounded-3xl p-6 mb-6 relative overflow-hidden"
      >
        {/* Decorative serif watermark */}
        <div
          className="absolute -right-4 -top-4 font-serif font-black text-white/5 leading-none select-none pointer-events-none"
          style={{ fontSize: '9rem' }}
          aria-hidden
        >
          CM
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-sans text-xs text-white/50 uppercase tracking-widest mb-1.5">CleanMap ID</p>
              <p className="font-mono text-xs text-civic-green-light">CM-2024-09821</p>
            </div>
            <RankBadge rank="Ward Hero" />
          </div>

          <h2 className="font-serif font-black text-white text-2xl mb-1">Arjun Selvam</h2>
          <p className="font-sans text-xs text-white/50 mb-5">Goripalayam, Ward 14 · Joined Jan 2025</p>

          {/* Giant points display */}
          <div className="flex items-end gap-3 mb-5">
            <div>
              <p className="font-sans text-xs text-white/50 uppercase tracking-widest mb-1">Total Points</p>
              <PointsTicker
                target={USER_POINTS}
                className="font-serif font-black text-civic-green-light"
                style={{ fontSize: 'clamp(3rem, 12vw, 4.5rem)', lineHeight: 1 } as React.CSSProperties}
              />
            </div>
            <div className="mb-2">
              <p className="font-sans text-xs text-white/50">Rank</p>
              <p className="font-serif font-bold text-3xl text-white/70">#{USER_RANK}</p>
            </div>
          </div>

          {/* Voucher progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Gift size={13} className="text-civic-amber" />
                <span className="font-sans text-xs text-white/60">Next Kirana Voucher (₹50)</span>
              </div>
              <span className="font-mono text-xs text-civic-amber font-semibold">
                {USER_POINTS}/{NEXT_VOUCHER_THRESHOLD} pts
              </span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-civic-amber to-civic-amber-light rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
            <p className="font-sans text-xs text-white/40 mt-1.5">
              {NEXT_VOUCHER_THRESHOLD - USER_POINTS} pts to unlock
            </p>
          </div>
        </div>
      </motion.div>

      {/* Active missions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-xl text-civic-navy">Active Missions</h3>
          <button className="font-sans text-xs text-civic-green font-semibold flex items-center gap-1">
            All <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {activeMissions.map((mission, i) => (
            <MissionCard key={mission.id} mission={mission} delay={i * 0.1} />
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <h3 className="font-serif font-bold text-xl text-civic-navy mb-4">Leaderboard</h3>

        {/* Tab switcher */}
        <div className="flex bg-civic-slate-mid rounded-xl p-1 mb-4">
          {(['college', 'ward'] as LeaderboardTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setLeaderboardTab(tab)}
              className={`flex-1 py-2.5 rounded-lg font-sans text-sm font-semibold capitalize transition-all duration-200
                ${leaderboardTab === tab ? 'bg-white text-civic-navy shadow-sm' : 'text-civic-slate-dark'}`}
            >
              {tab === 'college' ? 'College Teams' : 'Ward Teams'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={leaderboardTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl border border-civic-slate-mid overflow-hidden shadow-sm"
          >
            {leaderboardData.map((entry, i) => (
              <LeaderboardRow key={entry.name} entry={entry} idx={i} total={leaderboardData.length} />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function MissionCard({ mission, delay }: { mission: MissionItem; delay: number }) {
  const pct = (mission.progress / mission.total) * 100;
  const Icon = mission.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-white rounded-2xl border border-civic-slate-mid p-4 shadow-sm"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-civic-green/10 flex items-center justify-center flex-shrink-0">
          <Icon size={17} className="text-civic-green" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-serif font-bold text-sm text-civic-navy">{mission.title}</p>
            <span className="font-serif font-bold text-sm text-civic-amber flex-shrink-0">+{mission.reward} pts</span>
          </div>
          <p className="font-sans text-xs text-civic-slate-dark mt-0.5">{mission.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex-1 h-1.5 bg-civic-slate rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-civic-green rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: delay + 0.3 }}
          />
        </div>
        <span className="font-mono text-xs text-civic-slate-dark tabular-nums flex-shrink-0">
          {mission.progress}/{mission.total}
        </span>
      </div>
    </motion.div>
  );
}

function LeaderboardRow({ entry, idx, total }: { entry: LeaderboardEntry; idx: number; total: number }) {
  const isPodium = entry.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.3 }}
      className={`flex items-center gap-4 px-4 py-3.5 ${idx < total - 1 ? 'border-b border-civic-slate-mid' : ''}
        ${isPodium ? 'bg-civic-green/4' : ''}`}
    >
      <div className="w-7 flex-shrink-0 text-center">
        {entry.badge ? (
          <span className="text-lg">{entry.badge}</span>
        ) : (
          <span className="font-sans text-sm font-semibold text-civic-slate-dark">#{entry.rank}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-sans text-sm truncate ${isPodium ? 'font-bold text-civic-navy' : 'font-medium text-civic-navy/80'}`}>
          {entry.name}
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Trophy size={13} className={isPodium ? 'text-civic-amber' : 'text-civic-slate-dark'} />
        <span className={`font-serif font-bold text-sm tabular-nums ${isPodium ? 'text-civic-navy' : 'text-civic-navy/70'}`}>
          {entry.points.toLocaleString('en-IN')}
        </span>
      </div>
    </motion.div>
  );
}
