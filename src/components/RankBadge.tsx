import { motion } from 'framer-motion';

type CivicRank = 'Rookie' | 'Ward Hero' | 'City Savior' | 'Clean Champion';

const rankConfig: Record<CivicRank, { color: string; bg: string; border: string; glyph: string }> = {
  Rookie:         { color: 'text-civic-slate-dark', bg: 'bg-slate-100',           border: 'border-slate-300',         glyph: '◦' },
  'Ward Hero':    { color: 'text-civic-amber',      bg: 'bg-civic-amber-muted',    border: 'border-civic-amber-light', glyph: '✦' },
  'City Savior':  { color: 'text-civic-green',      bg: 'bg-civic-green-muted',    border: 'border-civic-green-light', glyph: '❋' },
  'Clean Champion': { color: 'text-civic-crimson',  bg: 'bg-civic-crimson-muted',  border: 'border-civic-crimson-light', glyph: '★' },
};

interface RankBadgeProps {
  rank: CivicRank;
  showLabel?: boolean;
}

export function RankBadge({ rank, showLabel = true }: RankBadgeProps) {
  const cfg = rankConfig[rank] ?? rankConfig['Rookie'];

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.border}`}
    >
      <span className={`text-lg leading-none ${cfg.color}`}>{cfg.glyph}</span>
      {showLabel && (
        <span className={`font-serif font-bold text-sm italic ${cfg.color}`}>{rank}</span>
      )}
    </motion.div>
  );
}
