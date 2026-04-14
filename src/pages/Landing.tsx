// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Shield, AlertTriangle, Lock, Eye, 
  Globe, ArrowRight, Timer, Database, Search, 
  ShieldAlert, Smartphone, Key, Fingerprint, ShieldCheck,
  CheckCircle2, AlertCircle, ThumbsUp, MessageSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { scorePassword, simulateAttacks, checkBreachedCount } from '@/lib/scenarios';
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

const twoFactorMethods = [
  {
    type: 'SMS Codes',
    level: 'Basic',
    pros: ['Very easy to set up', 'Works on any phone'],
    cons: ['Messages can be hijacked', 'Less secure than apps'],
    icon: MessageSquare,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    type: 'Authenticator Apps',
    level: 'Strong',
    pros: ['Much harder to hack', 'Works without signal'],
    description: 'e.g. Google Authenticator, Authy',
    cons: ['Needs your phone handy', 'Lose phone = lose access'],
    icon: Smartphone,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    type: 'Security Keys',
    level: 'Maximum',
    pros: ['Extremely secure', 'Protects against phishing'],
    description: 'e.g. YubiKey',
    cons: ['Costs money', 'Easy to lose if tiny'],
    icon: Key,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20'
  },
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
            Forge uncrackable keys for your digital kingdom.
          </p>
        </motion.div>

        {/* Password Checker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
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
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-bold opacity-80">Current Strength</p>
                  <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-2 opacity-80">Security Audit</p>
                  
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
                      {pwnedCount === null ? 'Checking databases for matches...' : 
                       pwnedCount > 0 ? `Vulnerable! This pattern appeared in ${pwnedCount.toLocaleString()} known data leaks. Change it immediately.` : 
                       'Great! This password pattern has not been found in any known public leaks.'}
                    </p>
                  </motion.div>

                  {/* Simulation Cards */}
                  {simulations.map((sim, i) => (
                    <motion.div
                      key={sim.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl border ${sim.isVulnerable ? 'bg-destructive/10 border-destructive/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
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
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-20">
          <Button size="lg" onClick={() => navigate('/forge')} className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl gold-glow font-bold uppercase tracking-widest transition-all hover:scale-105">
            Forge a Legend <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-muted-foreground/70 text-xs mt-4 italic">Build unforgettable, complex passwords using storytelling.</p>
        </motion.div>

        {/* 2FA Education Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-display text-foreground font-black gold-text-glow mb-3">Add a Second Lock to Your Account</h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Even a strong password isn't always enough. <span className="text-primary font-bold">Two-Factor Authentication (2FA)</span> adds a second step—so even if someone gets your password, they still can't get in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                <Fingerprint className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Something You Know</h3>
              <p className="text-sm text-muted-foreground">Your Memory Palace password or a secret phrase.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Something You Have</h3>
              <p className="text-sm text-muted-foreground">A device you own (like your phone or a security key).</p>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-3xl p-6 mb-12 border border-border/50 text-center">
             <p className="text-foreground font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="text-emerald-400 w-5 h-5" />
                Think of it like: <span className="text-primary">Password = Your Key</span> and <span className="text-emerald-400">2FA = A Second Lock</span>
             </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold text-center">Compare Your Options</h3>
            <div className="grid grid-cols-1 gap-4">
              {twoFactorMethods.map((m, i) => (
                <motion.div key={i} className={`bg-card border ${m.border} rounded-2xl p-6 transition-all hover:bg-secondary/20`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${m.bg}`}>
                        <m.icon className={`w-5 h-5 ${m.color}`} />
                      </div>
                      <div>
                        <h4 className="font-display font-black text-foreground uppercase tracking-tight leading-none">{m.type}</h4>
                        <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">{m.level} Security</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-2">
                      <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5"><ThumbsUp className="w-3 h-3" /> Pros</span>
                      <ul className="space-y-1">
                        {m.pros.map((p, idx) => (
                          <li key={idx} className="text-muted-foreground text-xs flex items-start gap-2">
                            <span className="text-emerald-500">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <span className="text-destructive font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Cons</span>
                      <ul className="space-y-1">
                        {m.cons.map((c, idx) => (
                          <li key={idx} className="text-muted-foreground text-xs flex items-start gap-2">
                            <span className="text-destructive">•</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {m.description && (
                    <p className="mt-4 text-[11px] text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50 inline-block font-medium">
                      {m.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center shadow-lg">
            <h4 className="font-display font-bold text-primary mb-2 flex items-center justify-center gap-2 uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" /> Recommended Next Steps
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Best balance: <span className="text-foreground font-bold">Authenticator Apps</span>. <br />
              Top security: <span className="text-foreground font-bold">Security Keys</span>. <br />
              <span className="block mt-4 text-xs font-bold text-foreground">👉 Turn on 2FA for your email first (it's your most important account!)</span>
            </p>
          </div>
        </motion.div>

        {/* Optional UX Upgrade: Interactive Question */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-20 bg-card border border-border rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h3 className="text-xl font-display font-black mb-6 uppercase tracking-tight">Do you use 2FA anywhere right now?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant={userHas2FA === 'yes' ? 'default' : 'outline'} 
              onClick={() => setUserHas2FA('yes')}
              className="rounded-xl px-8 font-bold"
            >
              Yes, I do!
            </Button>
            <Button 
              variant={userHas2FA === 'no' ? 'destructive' : 'outline'} 
              onClick={() => setUserHas2FA('no')}
              className="rounded-xl px-8 font-bold"
            >
              Not yet.
            </Button>
          </div>
          <AnimatePresence>
            {userHas2FA === 'yes' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary font-bold mt-6 flex items-center justify-center gap-2">
                <ThumbsUp className="w-4 h-4" /> Awesome! You're ahead of 90% of people online.
              </motion.p>
            )}
            {userHas2FA === 'no' && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive font-bold mt-6">
                Let's fix that! It only takes 2 minutes to protect your life.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Why Security Matters Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl sm:text-2xl font-display text-foreground text-center mb-8 gold-text-glow font-bold uppercase tracking-wider">Why Security Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityContent.map((item, i) => (
              <motion.div key={i} className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-md hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0 group-hover:bg-destructive/20 transition-colors">
                    <item.icon className="w-4 h-4 text-destructive" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base text-foreground font-black tracking-tight uppercase">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center mt-20 mb-10 border-t border-border pt-10">
          <p className="text-muted-foreground/40 text-[10px] max-w-sm mx-auto leading-relaxed uppercase tracking-[0.2em] font-bold">
            Computed locally on your device • Zero data collected • Privacy first always
          </p>
        </footer>
      </div>
    </div>
  );
}