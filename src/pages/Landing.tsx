// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Shield, AlertTriangle, Lock, Eye, 
  Globe, ArrowRight, Timer, Database, Search, 
  ShieldAlert, Smartphone, Key, Fingerprint, ShieldCheck,
  CheckCircle2, AlertCircle, ThumbsUp, MessageSquare, Check, Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { scorePassword, simulateAttacks, checkBreachedCount } from '@/lib/scenarios';
import StrengthMeter from '@/components/StrengthMeter';

const securityContent = [
  { icon: AlertTriangle, title: 'Data Breaches', description: 'Over 22 billion records were exposed in 2024. A weak password is the first domino to fall.' },
  { icon: Eye, title: 'Brute Force Speed', description: 'Modern hardware tests billions of combinations per second. Short passwords crack instantly.' },
  { icon: Globe, title: 'Credential Stuffing', description: 'Hackers reuse leaked passwords everywhere. One breach can compromise all accounts.' },
  { icon: Lock, title: 'Identity Theft', description: 'Weak passwords are the #1 gateway to identity theft and hundreds of recovery hours.' },
];

const checklistItems = [
  { label: '8+ Characters', check: (p: string) => p.length >= 8 },
  { label: 'Uppercase & Lowercase', check: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: 'Numbers Included', check: (p: string) => /\d/.test(p) },
  { label: 'Special Symbols', check: (p: string) => /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]/.test(p) },
];

export default function Landing() {
  const [password, setPassword] = useState('');
  const [pwnedCount, setPwnedCount] = useState<number | null>(null);
  const [userHas2FA, setUserHas2FA] = useState<string | null>(null);
  const navigate = useNavigate();

  const scoreResult = password.length > 0 ? scorePassword(password) : null;
  const simulations = password.length > 0 ? simulateAttacks(password) : [];

  useEffect(() => {
    if (!password || password.length < 3) {
      setPwnedCount(null);
      return;
    }
    const timer = setTimeout(async () => {
      const count = await checkBreachedCount(password);
      setPwnedCount(count);
    }, 600);
    return () => clearTimeout(timer);
  }, [password]);

  return (
    <div className="min-h-screen palace-gradient flex flex-col items-center p-4 sm:p-8">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/30 border border-primary/40 mb-4 gold-glow">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-foreground gold-text-glow font-bold uppercase tracking-tight">Memory Palace</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base flex items-center justify-center gap-1.5 font-medium">
            <Shield className="w-4 h-4" />
            Audit your digital security and forge uncrackable keys.
          </p>
        </motion.div>

        {/* Re-designed Password Audit Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
          <h2 className="text-lg sm:text-xl font-display text-foreground mb-1 font-bold">How Safe is Your Password?</h2>
          <p className="text-xs text-muted-foreground mb-6">Type below to run a real-time security audit.</p>
          
          <div className="relative mb-6">
            <Input
              type="password"
              placeholder="Enter your current password…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/60 h-14 text-lg font-mono px-4 focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Audit Checklist (Always Visible) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {checklistItems.map((item, idx) => {
              const isMet = password.length > 0 && item.check(password);
              return (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMet ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-secondary/50 border-border opacity-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isMet ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-muted-foreground/30'}`}>
                    {isMet && <Check className="w-3 h-3" strokeWidth={4} />}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {scoreResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                <div className="bg-secondary/30 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-bold">Overall Strength</p>
                  <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-2">Security Audit Results</p>
                  
                  {/* Breach Check Card */}
                  <motion.div
                    className={`p-4 rounded-xl border transition-colors ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/10 border-destructive/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-primary" />
                        <span className="font-display text-sm font-bold uppercase">Breach Check</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/20 text-destructive' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {pwnedCount === null ? 'Scanning...' : pwnedCount > 0 ? 'COMPROMISED' : 'CLEAN'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pwnedCount === null ? 'Querying local privacy-safe database...' : 
                       pwnedCount > 0 ? `Vulnerable! This pattern appeared in ${pwnedCount.toLocaleString()} known leaks. Stop using it immediately.` : 
                       'Zero matches found in known database breaches. Your pattern is unique!'}
                    </p>
                  </motion.div>

                  {/* Attack Simulations */}
                  {simulations.map((sim, i) => (
                    <motion.div
                      key={sim.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl border ${sim.isVulnerable ? 'bg-destructive/5 border-border' : 'bg-emerald-500/5 border-border'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          {sim.type === 'dictionary' && <Search className="w-4 h-4 text-primary" />}
                          {sim.type === 'brute' && <Timer className="w-4 h-4 text-primary" />}
                          {sim.type === 'stuffing' && <Database className="w-4 h-4 text-primary" />}
                          <span className="font-display text-sm font-bold uppercase">{sim.name}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${sim.isVulnerable ? 'bg-destructive/20 text-destructive' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {sim.timeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{sim.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {!scoreResult && (
               <div className="py-10 text-center opacity-20 flex flex-col items-center">
                 <Activity className="w-10 h-10 mb-3 animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Live Audit</p>
               </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-20">
          <Button size="lg" onClick={() => navigate('/forge')} className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl gold-glow font-bold uppercase tracking-widest transition-all">
            Forge a Legendary Password <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-muted-foreground/70 text-xs mt-3 italic leading-relaxed">Turn your memories into complex, uncrackable keys.</p>
        </motion.div>

        {/* Simplified 2FA Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-display text-foreground font-black gold-text-glow mb-3 uppercase tracking-tighter">Add a Second Lock</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              A strong password is just the first lock. <span className="text-primary font-bold">Two-Factor Authentication (2FA)</span> adds a second step—keeping hackers out even if they have your key.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <Fingerprint className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-base mb-1 uppercase tracking-wider">1. Something You Know</h3>
              <p className="text-[11px] text-muted-foreground">Your Memory Palace password or a master phrase.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-base mb-1 uppercase tracking-wider">2. Something You Have</h3>
              <p className="text-[11px] text-muted-foreground">A device you own (like your phone or a security key).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { type: 'SMS Codes', level: 'Basic', icon: MessageSquare, color: 'text-amber-400', p: 'Easy to set up', c: 'SIM hijacks are possible' },
              { type: 'Auth Apps', level: 'Strong', icon: Smartphone, color: 'text-emerald-400', p: 'Harder to hack', c: 'Needs your phone device' },
              { type: 'Security Keys', level: 'Maximum', icon: Key, color: 'text-primary', p: 'Immune to phishing', c: 'Requires physical key' }
            ].map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:bg-secondary/20 transition-all group overflow-hidden relative">
                <div className="flex items-center gap-3 mb-4">
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                  <h4 className="font-display font-bold text-foreground text-sm uppercase">{m.type}</h4>
                </div>
                <div className="space-y-1 mb-4">
                  <div className="text-[10px] opacity-60">👍 {m.p}</div>
                  <div className="text-[10px] opacity-60">⚠️ {m.c}</div>
                </div>
                <div className={`text-[9px] font-black uppercase tracking-widest ${m.color}`}>Security: {m.level}</div>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-12 bg-card border border-border rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <h3 className="text-lg font-display font-black mb-6 uppercase tracking-widest">Do you use 2FA anywhere right now?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant={userHas2FA === 'yes' ? 'default' : 'outline'} onClick={() => setUserHas2FA('yes')} className="rounded-xl px-8 font-bold">Yes, I'm protected!</Button>
              <Button variant={userHas2FA === 'no' ? 'destructive' : 'outline'} onClick={() => setUserHas2FA('no')} className="rounded-xl px-8 font-bold">Not yet.</Button>
            </div>
            <AnimatePresence>
              {userHas2FA === 'yes' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary font-bold mt-6 text-xs uppercase tracking-widest">Great! Your data is much safer.</motion.p>
              )}
              {userHas2FA === 'no' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive font-bold mt-6 text-xs uppercase tracking-widest underline decoration-wavy">Start by securing your email first.</motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Why Security Matters Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl sm:text-2xl font-display text-foreground text-center mb-8 gold-text-glow font-bold uppercase tracking-widest">Why Security Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityContent.map((item, i) => (
              <motion.div key={i} className="bg-card border border-border rounded-xl p-5 shadow-md hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-destructive" />
                  </div>
                  <h3 className="font-display text-sm text-foreground font-black uppercase tracking-tight">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center mt-20 mb-10 border-t border-border pt-10">
          <p className="text-muted-foreground/40 text-[10px] uppercase tracking-[0.2em] font-bold">
            Computed locally on your device • Zero data collected • Privacy first always
          </p>
        </footer>
      </div>
    </div>
  );
}