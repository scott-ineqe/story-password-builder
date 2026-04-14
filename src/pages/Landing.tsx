// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Shield, AlertTriangle, Lock, Eye, 
  Globe, ArrowRight, Timer, Database, Search, 
  ShieldAlert, Smartphone, Key, Fingerprint, ShieldCheck
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
    pros: 'Easy to set up; no smartphone app required.',
    cons: 'Vulnerable to "SIM Swapping" and intercepted texts.',
    icon: Globe,
    color: 'text-amber-400',
  },
  {
    type: 'Authenticator Apps',
    level: 'Advanced',
    pros: 'Works offline; harder to intercept. (e.g., Google Authenticator, Authy)',
    cons: 'Requires you to have your device handy at all times.',
    icon: Smartphone,
    color: 'text-emerald-400',
  },
  {
    type: 'Hardware Keys',
    level: 'Legendary',
    pros: 'Immune to phishing. Physical "tap" required to log in. (e.g., YubiKey)',
    cons: 'Costs money; can be lost if not attached to a keychain.',
    icon: Key,
    color: 'text-primary',
  },
];

export default function Landing() {
  const [password, setPassword] = useState('');
  const [pwnedCount, setPwnedCount] = useState<number | null>(null);
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
          <p className="text-muted-foreground mt-2 text-sm sm:text-base flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" />
            Build a fortress for your digital identity.
          </p>
        </motion.div>

        {/* Password Checker */}
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
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-semibold">Overall Strength</p>
                  <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-2">Live Security Audit</p>
                  
                  {/* Breach Check Card */}
                  <motion.div
                    className={`p-4 rounded-xl border ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/10 border-destructive/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-primary" />
                        <span className="font-display text-sm font-bold uppercase tracking-tight">Data Breach Check</span>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/20 text-destructive' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {pwnedCount === null ? 'Scanning...' : pwnedCount > 0 ? 'VULNERABLE' : 'SECURE'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pwnedCount === null ? 'Querying local privacy-safe database...' : 
                       pwnedCount > 0 ? `This password has appeared in ${pwnedCount.toLocaleString()} known leaks. Stop using it immediately.` : 
                       'Zero matches found in known database breaches. Your pattern is unique!'}
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
                          <span className="font-display text-sm font-bold uppercase tracking-tight">{sim.name}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${sim.isVulnerable ? 'bg-destructive/20 text-destructive' : 'bg-emerald-500/20 text-emerald-400'}`}>
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

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-16">
          <Button size="lg" onClick={() => navigate('/forge')} className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl gold-glow font-bold uppercase tracking-widest">
            Forge a Stronger Password <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-muted-foreground/70 text-xs mt-3 italic">Memory Palace uses storytelling to help you remember complex keys.</p>
        </motion.div>

        {/* 2FA Education Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-display text-foreground font-bold gold-text-glow">The Two Keys to Your Kingdom</h2>
            <p className="text-muted-foreground text-center mt-2 max-w-md">Even the best password isn't enough. Two-Factor Authentication (2FA) adds a second layer of defense.</p>
          </div>

          

[Image of Two-Factor Authentication concept]


          <div className="bg-card/50 border border-border rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-display text-primary font-bold mb-4 uppercase tracking-wider">How 2FA Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Fingerprint className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Something You Know</h4>
                  <p className="text-xs text-muted-foreground mt-1">Your Memory Palace password or a master phrase.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Something You Have</h4>
                  <p className="text-xs text-muted-foreground mt-1">A physical device like your smartphone or a security key.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-bold text-center mb-4">Compare 2FA Methods</h3>
            {twoFactorMethods.map((method, i) => (
              <motion.div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <method.icon className={`w-5 h-5 ${method.color}`} />
                    <h4 className="font-display font-bold text-foreground uppercase tracking-tight">{method.type}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-secondary border border-border tracking-widest ${method.color}`}>{method.level}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold uppercase tracking-tighter">Pros:</span>
                    <p className="text-muted-foreground mt-1 leading-relaxed">{method.pros}</p>
                  </div>
                  <div>
                    <span className="text-destructive font-bold uppercase tracking-tighter">Cons:</span>
                    <p className="text-muted-foreground mt-1 leading-relaxed">{method.cons}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Existing Educational Content (Why It Matters) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl sm:text-2xl font-display text-foreground text-center mb-8 gold-text-glow font-bold uppercase">Why Security Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityContent.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-lg hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-destructive/20 border border-destructive/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-destructive" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base text-foreground font-bold tracking-tight">{item.title}</h3>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-16 mb-8 border-t border-border pt-8">
          <p className="text-muted-foreground/50 text-xs max-w-md mx-auto leading-relaxed">
            Memory Palace runs entirely in your browser. We never see, store, or transmit your passwords. Everything is computed locally on your device for maximum privacy.
          </p>
        </div>
      </div>
    </div>
  );
}