// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Shield, AlertTriangle, Lock, Eye, 
  Globe, ArrowRight, Timer, Database, Search, 
  ShieldAlert, Smartphone, Key, Fingerprint, ShieldCheck,
  CheckCircle2, AlertCircle, ThumbsUp, MessageSquare, Info
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
    border: 'border-amber-500/30'
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
    border: 'border-emerald-500/30'
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
    border: 'border-primary/30'
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
      {/* Responsive background blur to prevent horizontal scroll */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[150vw] sm:w-[600px] h-[150vw] sm:h-[600px] bg-primary/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/40 mb-4 gold-glow">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display text-foreground gold-text-glow font-bold uppercase tracking-tight">Memory Palace</h1>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg flex items-center justify-center gap-2 font-medium">
            <Shield className="w-5 h-5" />
            Forge uncrackable keys for your digital kingdom.
          </p>
        </motion.div>

        {/* Password Checker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-display text-foreground mb-4 font-bold">Rate Your Current Password</h2>
          <Input
            type="password"
            placeholder="Enter your current password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary/60 border-white/10 text-foreground placeholder:text-muted-foreground/60 mb-6 text-xl p-6 font-mono shadow-inner"
          />

          <AnimatePresence mode="wait">
            {!password ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Info className="w-5 h-5 shrink-0" />
                  <p className="text-base">Start typing to see a real-time security audit.</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold opacity-80 mb-3">What we check</p>
                  
                  {/* 2x2 Grid Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl border bg-secondary/40 backdrop-blur-md border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <ShieldAlert className="w-5 h-5 text-primary" />
                          <span className="font-display text-base font-bold uppercase text-foreground">Breach Check</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We securely check known databases to see if your password has been exposed in previous data leaks.
                        </p>
                    </div>
                    
                    <div className="p-5 rounded-xl border bg-secondary/40 backdrop-blur-md border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <Search className="w-5 h-5 text-primary" />
                          <span className="font-display text-base font-bold uppercase text-foreground">Dictionary Attack</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We analyze if your password uses common words or patterns that are easy for hackers to guess.
                        </p>
                    </div>

                    <div className="p-5 rounded-xl border bg-secondary/40 backdrop-blur-md border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <Timer className="w-5 h-5 text-primary" />
                          <span className="font-display text-base font-bold uppercase text-foreground">Brute Force</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We estimate how long it would take modern hardware to crack your password by trying every combination.
                        </p>
                    </div>

                    <div className="p-5 rounded-xl border bg-secondary/40 backdrop-blur-md border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <Database className="w-5 h-5 text-primary" />
                          <span className="font-display text-base font-bold uppercase text-foreground">Stuffing</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We evaluate the risk of your password being used in automated attacks across multiple websites.
                        </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : scoreResult && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }} 
                className="space-y-6 overflow-hidden"
              >
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3 font-bold opacity-80">Current Strength</p>
                  <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold opacity-80 mb-3">Security Audit</p>
                  
                  {/* 2x2 Grid Layout for Audit Results */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Breach Check Card */}
                    <motion.div
                      className={`p-5 rounded-xl border transition-colors backdrop-blur-md ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/15 border-destructive/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
                          <span className="font-display text-base font-bold uppercase">Breach Check</span>
                        </div>
                      </div>
                      <span className={`inline-block mb-3 text-xs font-mono font-bold px-3 py-1 rounded-full ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/30 text-white' : 'bg-emerald-500/30 text-emerald-300'}`}>
                        {pwnedCount === null ? 'Scanning...' : pwnedCount > 0 ? 'COMPROMISED' : 'CLEAN'}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pwnedCount === null ? 'Checking databases for matches...' : 
                         pwnedCount > 0 ? `Vulnerable! Pattern appeared in ${pwnedCount.toLocaleString()} known data leaks. Change it immediately.` : 
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
                        className={`p-5 rounded-xl border backdrop-blur-md ${sim.isVulnerable ? 'bg-destructive/15 border-destructive/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {sim.type === 'dictionary' && <Search className="w-5 h-5 text-primary shrink-0" />}
                            {sim.type === 'brute' && <Timer className="w-5 h-5 text-primary shrink-0" />}
                            {sim.type === 'stuffing' && <Database className="w-5 h-5 text-primary shrink-0" />}
                            <span className="font-display text-base font-bold uppercase">{sim.name}</span>
                          </div>
                        </div>
                        <span className={`inline-block mb-3 text-xs font-mono font-bold px-3 py-1 rounded-full ${sim.isVulnerable ? 'bg-destructive/30 text-white' : 'bg-emerald-500/30 text-emerald-300'}`}>
                          {sim.timeLabel}
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{sim.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA (with text-wrapping and horizontal scroll fix) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-20 px-4 sm:px-0">
          <Button 
            onClick={() => navigate('/forge')} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-lg px-6 sm:px-10 py-6 sm:py-8 rounded-xl gold-glow font-bold uppercase tracking-wider sm:tracking-widest transition-all hover:scale-105 h-auto !whitespace-normal w-full sm:w-auto max-w-[320px] sm:max-w-none mx-auto flex flex-row items-center justify-center gap-2 sm:gap-3"
          >
            <span className="leading-tight text-center">Forge a secure password</span> 
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          </Button>
          <p className="text-muted-foreground/80 text-sm mt-5 italic">Build unforgettable, complex passwords using storytelling.</p>
        </motion.div>

        {/* Why Security Matters Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-2xl sm:text-3xl font-display text-foreground text-center mb-10 gold-text-glow font-bold uppercase tracking-wider">Why Security Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {securityContent.map((item, i) => (
              <motion.div key={i} className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl hover:bg-card/60 hover:border-primary/40 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center shrink-0 group-hover:bg-destructive/25 transition-colors">
                    <item.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg text-foreground font-black tracking-tight uppercase">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 2FA Education Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display text-foreground font-black gold-text-glow mb-4">Add a Second Lock to Your Account</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
              Even a strong password isn't always enough. <span className="text-primary font-bold">Two-Factor Authentication (2FA)</span> adds a second step—so even if someone gets your password, they still can't get in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-5 border border-primary/30">
                <Fingerprint className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">1. Something You Know</h3>
              <p className="text-base text-muted-foreground">Your Memory Palace password or a secret phrase.</p>
            </div>
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-5 border border-emerald-500/30">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-xl mb-3">2. Something You Have</h3>
              <p className="text-base text-muted-foreground">A device you own (like your phone or a security key).</p>
            </div>
          </div>

          <div className="bg-secondary/40 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/10 text-center shadow-lg">
             <p className="text-foreground text-lg font-bold flex flex-col sm:flex-row items-center justify-center gap-3">
                <ShieldCheck className="text-emerald-400 w-6 h-6 shrink-0" />
                <span>Think of it like: <span className="text-primary">Password = Your Key</span> and <span className="text-emerald-400">2FA = A Second Lock</span></span>
             </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-bold text-center">Compare Your Options</h3>
            <div className="grid grid-cols-1 gap-5">
              {twoFactorMethods.map((m, i) => (
                <motion.div key={i} className={`bg-card/40 backdrop-blur-xl border ${m.border} rounded-2xl p-8 transition-all hover:bg-secondary/50 shadow-lg`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${m.bg}`}>
                        <m.icon className={`w-6 h-6 ${m.color}`} />
                      </div>
                      <div>
                        <h4 className="font-display text-xl font-black text-foreground uppercase tracking-tight leading-none">{m.type}</h4>
                        <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest">{m.level} Security</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-base">
                    <div className="space-y-3">
                      <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><ThumbsUp className="w-4 h-4" /> Pros</span>
                      <ul className="space-y-2">
                        {m.pros.map((p, idx) => (
                          <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <span className="text-destructive font-bold uppercase tracking-widest text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Cons</span>
                      <ul className="space-y-2">
                        {m.cons.map((c, idx) => (
                          <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                            <span className="text-destructive font-bold">•</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {m.description && (
                    <p className="mt-5 text-sm text-muted-foreground bg-secondary/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 inline-block font-medium">
                      {m.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-primary/10 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 text-center shadow-2xl">
            <h4 className="font-display text-lg font-bold text-primary mb-3 flex items-center justify-center gap-2 uppercase tracking-widest">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> Recommended Next Steps
            </h4>
            <p className="text-base text-muted-foreground leading-relaxed">
              Best balance: <span className="text-foreground font-bold">Authenticator Apps</span>. <br />
              Top security: <span className="text-foreground font-bold">Security Keys</span>. <br />
              <span className="block mt-5 text-sm font-bold text-foreground bg-primary/20 inline-block px-4 py-2 rounded-lg">👉 Turn on 2FA for your email first (it's your most important account!)</span>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center mt-24 mb-10 border-t border-white/10 pt-10">
          <p className="text-muted-foreground/60 text-xs max-w-sm mx-auto leading-relaxed uppercase tracking-[0.2em] font-bold">
            Computed locally on your device • Zero data collected • Privacy first always
          </p>
        </footer>
      </div>
    </div>
  );
}