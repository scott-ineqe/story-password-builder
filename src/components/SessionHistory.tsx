import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { useState } from 'react';

export interface HistoryEntry {
  id: string;
  scenarioTitle: string;
  scenarioIcon: string;
  password: string;
  score: number;
  label: string;
  story: string;
  timestamp: Date;
}

interface Props {
  entries: HistoryEntry[];
}

export default function SessionHistory({ entries }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (entries.length === 0) return null;

  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-strength-weak';
    if (score < 50) return 'text-strength-fair';
    if (score < 70) return 'text-strength-good';
    if (score < 90) return 'text-strength-strong';
    return 'text-strength-legendary';
  };

  const getBgColor = (score: number) => {
    if (score < 30) return 'bg-strength-weak';
    if (score < 50) return 'bg-strength-fair';
    if (score < 70) return 'bg-strength-good';
    if (score < 90) return 'bg-strength-strong';
    return 'bg-strength-legendary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto mt-6"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between bg-secondary/50 hover:bg-secondary/70 border border-border rounded-xl px-4 py-3 transition-colors group"
      >
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
          <History className="w-4 h-4" />
          <span className="text-sm font-display">Session History</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {entries.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-2">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-secondary/30 border border-border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{entry.scenarioIcon}</span>
                      <span className="text-sm font-display text-foreground">
                        {entry.scenarioTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${getBgColor(entry.score)}`} />
                      <span className={`text-xs font-mono font-semibold ${getScoreColor(entry.score)}`}>
                        {entry.score}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-background/30 rounded px-2.5 py-1.5">
                    <Shield className="w-3 h-3 text-primary shrink-0" />
                    <code className="text-xs font-mono text-primary break-all">{entry.password}</code>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{entry.story}</p>

                  <p className="text-[10px] text-muted-foreground/50">
                    {entry.timestamp.toLocaleTimeString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
