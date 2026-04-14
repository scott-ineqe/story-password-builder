import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Shield, AlertTriangle, Lock, Eye, Globe, ArrowRight, Timer, Database, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { scorePassword, simulateAttacks } from '@/lib/scenarios';
import StrengthMeter from '@/components/StrengthMeter';

const securityContent = [
  {
    icon: AlertTriangle,
    title: 'Data Breaches Are Rampant',
    description: 'Over 22 billion records were exposed in 2024. A weak password is often the first domino to fall.',
  },
  {
    icon: Eye,
    title: 'Brute Force Is Faster',
    description: 'Modern hardware tests billions of combinations per second. A 6-character password can be cracked instantly.',
  },
  {
    icon: Globe,
    title: 'Credential Stuffing',
    description: 'Hackers take leaked passwords from one site and try them everywhere else. Reuse is the biggest risk.',
  },
  {
    icon: Lock,
    title: 'Identity Theft',
    description: 'Weak passwords are the #1 gateway to identity theft, leading to hundreds of hours of recovery time.',
  },
];

export default function Landing() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const scoreResult = password.length > 0 ? scorePassword(password) : null;
  const simulations = password.length > 0 ? simulateAttacks(password) : [];

  return (
    <div className="min-h-screen palace-gradient flex flex-col items-center p-4 sm:p-8">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/30 border border-primary/40 mb-4 gold-glow">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-foreground gold-text-glow">Memory Palace</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" />
            Test your password against modern cyber attacks.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-display text-foreground mb-4 font-bold">Rate Your Current Password</h2>
          <Input
            type="password"
            placeholder="Enter your current password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/60 mb-6 text-lg font-mono"
          />

          <AnimatePresence>
            {scoreResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-semibold">Overall Strength</p>
                  <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-2">Attack Simulation</p>
                  {simulations.map((sim, i) => (
                    <motion.div
                      key={sim.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl border ${sim.isVulnerable ? 'bg-destructive/5 border-destructive/20' : 'bg-strength-good/5 border-strength-good/20'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          {sim.type === 'dictionary' && <Search className="w-4 h-4 text-primary" />}
                          {sim.type === 'brute' && <Timer className="w-4 h-4 text-primary" />}
                          {sim.type === 'stuffing' && <Database className="w-4 h-4 text-primary" />}
                          <span className="font-display text-sm font-bold">{sim.name}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${sim.isVulnerable ? 'bg-destructive/20 text-destructive' : 'bg-strength-good/20 text-strength-good'}`}>
                          {sim.timeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{sim.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-12">
          <Button size="lg" onClick={() => navigate('/forge')} className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl gold-glow font-bold">
            Forge a Stronger Password <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h2 className="text-xl sm:text-2xl font-display text-foreground text-center mb-6 gold-text-glow">Why It Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityContent.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-lg hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-destructive/20 border border-destructive/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-destructive" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base text-foreground font-bold">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}