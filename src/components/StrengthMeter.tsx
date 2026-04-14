// src/components/StrengthMeter.tsx

import { motion } from 'framer-motion';

interface Props {
  score: number;
  label: string;
}

export default function StrengthMeter({ score, label }: Props) {
  const getColor = () => {
    if (score < 30) return 'bg-strength-weak';
    if (score < 50) return 'bg-strength-fair';
    if (score < 70) return 'bg-strength-good';
    if (score < 90) return 'bg-strength-strong';
    return 'bg-strength-legendary';
  };

  const getTextColor = () => {
    if (score < 30) return 'text-strength-weak';
    if (score < 50) return 'text-strength-fair';
    if (score < 70) return 'text-strength-good';
    if (score < 90) return 'text-strength-strong';
    return 'text-strength-legendary';
  };

  return (
    <div className="space-y-2" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`Password strength: ${label}`}>
      <div className="flex justify-between items-end mb-1">
        <span className={`text-xs font-bold uppercase tracking-widest ${getTextColor()}`}>
          Security Status: {label}
        </span>
        <span className={`text-xl font-display font-bold ${getTextColor()}`}>
          {score}%
        </span>
      </div>
      <div className="h-3 rounded-full bg-secondary/50 border border-border/50 overflow-hidden backdrop-blur-sm">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full shadow-lg ${getColor()}`}
        />
      </div>
    </div>
  );
}