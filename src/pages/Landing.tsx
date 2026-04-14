// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Shield, AlertTriangle, Lock, Eye, Globe, ArrowRight, 
  Timer, Database, Search, ShieldAlert, Smartphone, Key, Fingerprint, 
  ShieldCheck, CheckCircle2, AlertCircle, ThumbsUp, MessageSquare,
  Activity, Info
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { scorePassword, simulateAttacks, checkBreachedCount } from '@/lib/scenarios';
import StrengthMeter from '@/components/StrengthMeter';

const securityContent = [
  { icon: AlertTriangle, title: 'Data Breaches', desc: 'Over 22 billion records were exposed in 2024. A weak password is the first domino to fall.' },
  { icon: Eye, title: 'Brute Force Speed', desc: 'Modern hardware tests billions of combinations per second. Short passwords crack instantly.' },
  { icon: Globe, title: 'Credential Stuffing', desc: 'Hackers try leaked passwords from one site everywhere else. Reuse is your biggest risk.' },
  { icon: Lock, title: 'Identity Theft', desc: 'Weak passwords are the #1 gateway to identity theft, leading to hundreds of hours of recovery.' },
];

const twoFactorMethods = [
  {
    type: 'SMS Codes',
    level: 'Basic',
    pros: ['Very easy to set up', 'Works on any phone'],
    cons: ['Messages can be hijacked', 'Less secure than other options'],
    icon: MessageSquare,
    color: 'text-amber-400',
    border: 'border-amber-500/20'
  },
  {
    type: 'Authenticator Apps',
    level: 'Strong',
    description: 'Examples: Google Authenticator, Authy',
    pros: ['Much harder to hack', 'Works even without signal'],
    cons: ['Needs access to your phone', 'Tricky if you lose your device'],
    icon: Smartphone,
    color: 'text-emerald-400',
    border: 'border-emerald-500/20'
  },
  {
    type: 'Security Keys',
    level: 'Maximum',
    description: 'Example: YubiKey',
    pros: ['Extremely secure', 'Protects against phishing'],
    cons: ['Costs money', 'Easy to lose if not careful'],
    icon: Key,
    color: 'text-primary',
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
    <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary selection:text-black">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-primary rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-5 rounded-[2rem] bg-secondary/30 border border-white/10 mb-6 backdrop-blur-2xl gold-glow">
            <KeyRound className="w-12 h-12 text-primary" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter gold-text-glow mb-4">Memory Palace</h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-medium">
            Stop reusing weak keys. Start building uncrackable digital fortresses.
          </p>
        </header>

        {/* Audit Tool */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-primary">
              <Activity className="w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Live Audit System</h2>
            </div>
            
            <div className="relative mb-10 group">
              <Input
                type="password"
                placeholder="Type a password to test..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-20 bg-black/40 border-white/10 rounded-3xl px-8 text-2xl font-mono focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-white/10"
              />
              <Lock className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 w-6 h-6 group-focus-within:text-primary transition-colors" />
            </div>

            <AnimatePresence mode="wait">
              {scoreResult ? (
                <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem]">
                    <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-6 rounded-[1.5rem] border transition-all ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" /> Leak Status
                        </span>
                        <span className="font-mono text-xs font-bold">{pwnedCount === null ? 'ANALYZING' : pwnedCount > 0 ? 'BREACHED' : 'CLEAN'}</span>
                      </div>
                      <p className="text-sm opacity-80 leading-relaxed font-medium">
                        {pwnedCount === null ? 'Scanning global breach databases...' : 
                         pwnedCount > 0 ? `Compromised! This pattern appeared in ${pwnedCount.toLocaleString()} leaks.` : 
                         'Privacy match: Zero matches found in known database leaks.'}
                      </p>
                    </div>

                    {simulations.map((sim, i) => (
                      <div key={i} className="p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 flex justify-between items-center group hover:bg-white/[0.04] transition-colors">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{sim.name}</h4>
                          <p className="text-xs font-bold opacity-80">{sim.description}</p>
                        </div>
                        <div className={`text-sm font-black font-mono ${sim.isVulnerable ? 'text-destructive' : 'text-emerald-400'}`}>
                          {sim.timeLabel}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-20">
                  <Activity className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                  <p className="text-sm font-black uppercase tracking-widest">Awaiting Analysis</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="lg:col-span-5 space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/forge')}
              className="w-full bg-primary text-black font-black p-10 rounded-[3rem] flex flex-col items-center gap-6 shadow-2xl gold-glow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
              <ShieldCheck className="w-16 h-16 relative z-10" />
              <div className="text-center relative z-10">
                <span className="text-xs uppercase tracking-[0.2em] opacity-60 block mb-1">Phase 2</span>
                <h3 className="text-3xl font-display uppercase tracking-tighter">Forge a Legend</h3>
              </div>
              <ArrowRight className="w-6 h-6 relative z-10" />
            </motion.button>

            <div className="grid grid-cols-1 gap-4">
              {securityContent.map((item, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:border-primary/20 transition-all">
                  <div className="p-3 rounded-2xl bg-destructive/10 text-destructive shrink-0 group-hover:bg-destructive/20 transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-[10px] opacity-40 leading-tight font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2FA Section - Simplified & Reworked */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black uppercase tracking-tighter gold-text-glow mb-4">Add a Second Lock</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Even a strong password isn't always enough. <span className="text-primary font-bold">2FA</span> adds a second step—so even if someone gets your key, they still can't get past the second lock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:bg-primary/[0.02] transition-colors">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Fingerprint className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest mb-3">1. Something You Know</h3>
              <p className="text-sm opacity-50 font-medium">Your Memory Palace password or a master phrase.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center text-center group hover:bg-emerald-500/[0.02] transition-colors">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest mb-3">2. Something You Have</h3>
              <p className="text-sm opacity-50 font-medium">A device you own, like your phone or a security key.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {twoFactorMethods.map((m, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className={`bg-white/[0.02] border ${m.border} rounded-[2rem] p-8 backdrop-blur-sm relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${m.color}`}>
                  <m.icon className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                    <h4 className="font-black uppercase tracking-widest text-sm">{m.type}</h4>
                  </div>
                  <div className="space-y-6 mb-8">
                    <div>
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2">👍 Pros</span>
                      <ul className="space-y-1.5">
                        {m.pros.map((p, idx) => (
                          <li key={idx} className="text-xs opacity-60 font-medium flex gap-2"><span>•</span> {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-destructive uppercase tracking-widest block mb-2">⚠️ Cons</span>
                      <ul className="space-y-1.5">
                        {m.cons.map((c, idx) => (
                          <li key={idx} className="text-xs opacity-60 font-medium flex gap-2"><span>•</span> {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-white/5 bg-white/5 ${m.color}`}>
                    Level: {m.level}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Question */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-20 bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <h3 className="text-2xl font-black uppercase tracking-widest mb-8 relative z-10">Do you use 2FA anywhere right now?</h3>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Button 
                variant={userHas2FA === 'yes' ? 'default' : 'outline'} 
                onClick={() => setUserHas2FA('yes')}
                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest transition-all"
              >
                Yes, I'm protected
              </Button>
              <Button 
                variant={userHas2FA === 'no' ? 'destructive' : 'outline'} 
                onClick={() => setUserHas2FA('no')}
                className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest transition-all"
              >
                Not yet
              </Button>
            </div>
            <AnimatePresence>
              {userHas2FA === 'yes' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary font-black uppercase tracking-widest text-xs mt-8 flex items-center justify-center gap-2">
                  <ThumbsUp className="w-4 h-4" /> Great! You're ahead of 90% of people online.
                </motion.p>
              )}
              {userHas2FA === 'no' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-2">
                  <p className="text-destructive font-black uppercase tracking-widest text-xs">Let's fix that!</p>
                  <p className="text-xs opacity-40 font-medium">Turn on 2FA for your email first—it's your most important account.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Why Security Matters */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-16">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-sm font-black uppercase tracking-[0.4em] opacity-30">Knowledge is Armor</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityContent.map((item, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 flex gap-6 hover:bg-white/[0.03] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                  <item.icon className="w-6 h-6 text-primary opacity-60" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-2">{item.title}</h4>
                  <p className="text-xs opacity-50 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-16 border-t border-white/5 opacity-20">
          <p className="text-[9px] font-black uppercase tracking-[0.5em]">
            Privacy Guaranteed • Local Computation • No Data Collected
          </p>
        </footer>
      </div>
    </div>
  );
}