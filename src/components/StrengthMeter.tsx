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
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-semibold ${getTextColor()}`}>{label}</span>
        <span className={`text-sm font-mono ${getTextColor()}`}>{score}/100</span>
      </div>
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
    </div>
  );
}
