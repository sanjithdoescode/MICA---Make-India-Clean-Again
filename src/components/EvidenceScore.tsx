import { motion } from 'framer-motion';

interface EvidenceScoreProps {
  score: number;
  showLabel?: boolean;
}

function scoreColor(score: number) {
  if (score >= 0.7) return { bar: 'bg-civic-green', text: 'text-civic-green' };
  if (score >= 0.4) return { bar: 'bg-civic-amber', text: 'text-civic-amber' };
  return { bar: 'bg-civic-crimson', text: 'text-civic-crimson' };
}

export function EvidenceScore({ score, showLabel = true }: EvidenceScoreProps) {
  const clamped = Math.max(0, Math.min(1, score));
  const { bar, text } = scoreColor(clamped);

  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-civic-slate-mid rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped * 100}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      {showLabel && (
        <span className={`font-mono text-xs font-semibold tabular-nums ${text}`}>
          {clamped.toFixed(2)}
        </span>
      )}
    </div>
  );
}
