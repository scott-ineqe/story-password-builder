import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Shield } from 'lucide-react';
import { scenarios } from '@/lib/scenarios';
import ScenarioCard from '@/components/ScenarioCard';
import PasswordWizard from '@/components/PasswordWizard';

const Index = () => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  return (
    <div className="min-h-screen palace-gradient flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ffffff] rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header — always visible */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ffffff] border border-primary/20 mb-4 gold-glow">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-display text-foreground gold-text-glow">
            Memory Palace
          </h1>
          <p className="text-muted-foreground mt-2 text-sm flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Build unforgettable passwords through stories (I made an edit!) (I made another edit)
          </p>
        </motion.div>

        {/* Content */}
        {selectedScenario === null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-4">
              Choose your path
            </p>
            {scenarios.map((scenario, i) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                index={i}
                onSelect={() => setSelectedScenario(i)}
              />
            ))}
          </motion.div>
        ) : (
          <PasswordWizard
            scenario={scenarios[selectedScenario]}
            onBack={() => setSelectedScenario(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
