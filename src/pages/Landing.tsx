// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Shield, AlertTriangle, Lock, Eye, Globe, ArrowRight, 
  Timer, Database, Search, ShieldAlert, Smartphone, Key, ShieldCheck, 
  ChevronRight, Activity, Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { scorePassword, simulateAttacks, checkBreachedCount } from '@/lib/scenarios';
import StrengthMeter from '@/components/StrengthMeter';

const securityContent = [
  { icon: AlertTriangle, title: 'Breach Alert', desc: 'Over 22B records exposed in 2024. Weak links break first.' },
  { icon: Eye, title: 'Speed Kills', desc: 'Modern hardware tests billions of combinations every second.' },
  { icon: Globe, title: 'Credential Reuse', desc: 'Hackers try one leaked password across all your accounts.' },
  { icon: Lock, title: 'Identity Theft', desc: 'A bad password is the #1 gateway to financial loss.' },
];

const methods = [
  { name: 'SMS Codes', tier: 'Basic', pro: 'No app needed', con: 'SIM Swap risk', icon: Globe, color: 'text-amber-400' },
  { name: 'Auth Apps', tier: 'Pro', pro: 'Hard to intercept', con: 'Needs device', icon: Smartphone, color: 'text-emerald-400' },
  { name: 'YubiKeys', tier: 'Ultra', pro: 'Phish-proof', con: 'Physical loss', icon: Key, color: 'text-primary' },
];

export default function Landing() {
  const [password, setPassword] = useState('');
  const [pwnedCount, setPwnedCount] = useState<number | null>(null);
  const navigate = useNavigate();

  const scoreResult = password.length > 0 ? scorePassword(password) : null;
  const simulations = password.length > 0 ? simulateAttacks(password) : [];

  useEffect(() => {
    if (!password || password.length < 3) { setPwnedCount(null); return; }
    const t = setTimeout(async () => setPwnedCount(await checkBreachedCount(password)), 600);
    return () => clearTimeout(t);
  }, [password]);

  return (
    <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary selection:text-black">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-4 rounded-3xl bg-secondary/30 border border-border/50 mb-6 backdrop-blur-xl gold-glow">
            <KeyRound className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter gold-text-glow mb-4">
            Memory Palace
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
            Stop creating weak passwords. Start building uncrackable digital fortresses.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Interaction Card */}
          <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-7 bg-card/40 border border-border/60 rounded-[2.5rem] p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Instant Audit
            </h2>
            
            <div className="relative mb-8">
              <Input
                type="password"
                placeholder="Type your current password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-16 bg-secondary/50 border-border rounded-2xl px-6 text-xl font-mono focus:ring-2 focus:ring-primary/50 transition-all"
                aria-label="Enter password to check"
              />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 w-5 h-5" />
            </div>

            <AnimatePresence mode="wait">
              {scoreResult ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="p-6 rounded-3xl bg-secondary/20 border border-border/40">
                    <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                    <div className="mt-4 flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                        Rank: {scoreResult.rank}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-5 rounded-2xl border transition-colors ${pwnedCount ? 'bg-destructive/10 border-destructive/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black uppercase flex items-center gap-2 tracking-widest"><ShieldAlert className="w-4 h-4" /> Breached?</span>
                        <span className="font-mono text-xs font-bold">{pwnedCount === null ? 'Scanning...' : pwnedCount > 0 ? 'FAIL' : 'CLEAN'}</span>
                      </div>
                      <p className="text-sm opacity-80 leading-snug">
                        {pwnedCount === null ? 'Scanning leaks...' : pwnedCount > 0 ? `Matches ${pwnedCount.toLocaleString()} breaches.` : 'No matches found in leaks.'}
                      </p>
                    </div>

                    {simulations.map((sim, i) => (
                      <div key={i} className={`p-5 rounded-2xl border ${sim.isVulnerable ? 'bg-destructive/5 border-border/40' : 'bg-emerald-500/5 border-border/40'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold opacity-60 uppercase tracking-tighter">{sim.name}</span>
                          <span className={`font-mono text-sm font-black ${sim.isVulnerable ? 'text-destructive' : 'text-emerald-400'}`}>{sim.timeLabel}</span>
                        </div>
                        <p className="text-xs opacity-50">{sim.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                  <Activity className="w-12 h-12 mb-4 animate-pulse" />
                  <p className="font-display font-bold uppercase">Ready for Analysis</p>
                </div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* CTA & Education Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/forge')}
              className="w-full bg-primary text-black font-black p-8 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all gold-glow shadow-xl"
            >
              <ShieldCheck className="w-12 h-12" />
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest block opacity-70">Step 2</span>
                <span className="text-2xl font-display uppercase tracking-tight">Forge a Legend</span>
              </div>
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <div className="grid grid-cols-2 gap-4">
              {securityContent.map((item, i) => (
                <div key={i} className="p-4 rounded-3xl bg-secondary/20 border border-border/40 text-center">
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-primary opacity-60" />
                  <h4 className="text-[10px] font-black uppercase mb-1 tracking-widest">{item.title}</h4>
                  <p className="text-[10px] opacity-40 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2FA Command Center */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-border/50" />
            <h2 className="text-2xl font-display font-black uppercase tracking-widest text-primary italic">2FA Fortress</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methods.map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-card/40 border border-border/50 rounded-3xl p-6 relative overflow-hidden group backdrop-blur-sm"
              >
                <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${m.color}`}>
                  <m.icon className="w-20 h-20" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                    <h3 className="font-display font-bold uppercase text-sm tracking-widest">{m.name}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Benefit</span>
                      <p className="text-sm opacity-70">{m.pro}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-destructive uppercase tracking-widest block mb-1">Risk</span>
                      <p className="text-sm opacity-70">{m.con}</p>
                    </div>
                  </div>
                  <div className={`mt-6 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-border/60 ${m.color}`}>
                    Tier: {m.tier}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-border/40">
          <p className="text-xs text-muted-foreground/30 uppercase tracking-[0.3em] font-bold">
            Computed locally • No data sent • Privacy first
          </p>
        </footer>
      </div>
    </div>
  );
}