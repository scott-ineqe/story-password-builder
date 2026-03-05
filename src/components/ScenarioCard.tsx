import { motion } from 'framer-motion';
import { Scenario } from '@/lib/scenarios';

interface Props {
  scenario: Scenario;
  index: number;
  onSelect: () => void;
}

export default function ScenarioCard({ scenario, index, onSelect }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="w-full text-left bg-secondary/40 hover:bg-secondary/60 border border-border hover:border-primary/40 rounded-xl p-5 transition-colors group"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{scenario.icon}</span>
        <div>
          <h3 className="font-display text-foreground group-hover:text-primary transition-colors">
            {scenario.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
        </div>
      </div>
    </motion.button>
  );
}
