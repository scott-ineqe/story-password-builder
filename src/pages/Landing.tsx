// src/pages/Landing.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Shield, AlertTriangle, Lock, Eye, Globe, ArrowRight, 
  Timer, Database, Search, ShieldAlert, Smartphone, Key, Fingerprint, 
  ShieldCheck, CheckCircle2, AlertCircle, ThumbsUp, MessageSquare, Activity, Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { scorePassword, simulateAttacks, checkBreachedCount } from '@/lib/scenarios';
import StrengthMeter from '@/components/StrengthMeter';

const securityContent = [
  { icon: AlertTriangle, title: 'Data Breaches', desc: 'Over 22 billion records exposed in 2024. Weak passwords are the first targets.' },
  { icon: Eye, title: 'Brute Force speed', desc: 'Modern hardware tests billions of combinations per second. Short passwords crack instantly.' },
  { icon: Globe, title: 'Credential Stuffing', desc: 'Hackers reuse leaked passwords everywhere. One breach can compromise all accounts.' },
  { icon: Lock, title: 'Identity Theft', desc: 'Weak passwords are the #1 gateway to identity theft and hundreds of recovery hours.' },
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
    <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-4 rounded-3xl bg-secondary/30 border border-white/10 mb-6 gold-glow backdrop-blur-xl">
            <KeyRound className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter gold-text-glow mb-4">Memory Palace</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium">How safe is your digital identity? Audit your current key below.</p>
        </header>

        {/* Security Audit Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-primary">
              <Activity className="w-5 h-5" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]">Live Audit System</h2>
            </div>
            
            <div className="relative mb-8 group">
              <Input
                type="password"
                placeholder="Type your current password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-16 bg-black/40 border-white/10 rounded-2xl px-6 text-xl font-mono focus:ring-4 focus:ring-primary/20 transition-all"
              />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 w-5 h-5 group-focus-within:text-primary transition-colors" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {checklistItems.map((item, idx) => {
                const isMet = password.length > 0 && item.check(password);
                return (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMet ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isMet ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/20'}`}>
                      {isMet && <Check className="w-3 h-3" strokeWidth={4} />}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {scoreResult ? (
                <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                    <StrengthMeter score={scoreResult.score} label={scoreResult.label} />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className={`p-5 rounded-2xl border transition-all ${pwnedCount && pwnedCount > 0 ? 'bg-destructive/10 border-destructive/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Leak Scan</span>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/20">{pwnedCount === null ? 'SCANNIG' : pwnedCount > 0 ? 'BREACHED' : 'CLEAN'}</span>
                      </div>
                      <p className="text-xs opacity-70 leading-relaxed">
                        {pwnedCount === null ? 'Querying local privacy database...' : 
                         pwnedCount > 0 ? `Compromised! This pattern appears in ${pwnedCount.toLocaleString()} known leaks.` : 
                         'No matches found in known public data breaches. Your pattern is unique.'}
                      </p>
                    </div>

                    {simulations.map((sim, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase opacity-40 mb-0.5">{sim.name}</span>
                          <span className="text-[11px] font-bold opacity-80">{sim.description}</span>
                        </div>
                        <span className={`text-xs font-black font-mono ${sim.isVulnerable ? 'text-destructive' : 'text-emerald-400'}`}>{sim.timeLabel}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl opacity-20">
                  <Activity className="w-10 h-10 mx-auto mb-3 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Analysis</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-5 space-y-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/forge')}
              className="w-full bg-primary text-black font-black p-10 rounded-[2.5rem] flex flex-col items-center gap-6 shadow-2xl gold-glow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
              <ShieldCheck className="w-16 h-16 relative z-10" />
              <div className="text-center relative z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] block opacity-60 mb-1">Step 2</span>
                <h3 className="text-3xl font-display uppercase tracking-tighter">Forge a Legend</h3>
              </div>
              <ArrowRight className="w-6 h-6 relative z-10" />
            </motion.button>

            <div className="grid grid-cols-1 gap-4">
              {securityContent.map((item, i) => (
                <div key={i} className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:border-primary/20 transition-all">
                  <div className="p-3 rounded-xl bg-destructive/10 text-destructive shrink-0 group-hover:bg-destructive/20 transition-colors">
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

        {/* 2FA Education Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-black uppercase tracking-tighter gold-text-glow mb-4">Add a Second Lock</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Even a strong password isn't always enough. <span className="text-primary font-bold">2FA</span> adds a second step—so even if someone gets your key, they still can't get past the second lock.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
                <Fingerprint className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest mb-2">1. Something You Know</h3>
              <p className="text-xs opacity-50 font-medium">Your Memory Palace password or a master phrase.</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 border border-emerald-500/20">
                <Smartphone className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest mb-2">2. Something You Have</h3>
              <p className="text-xs opacity-50 font-medium">A device you own, like your phone or a security key.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: 'SMS Codes', level: 'Basic', icon: MessageSquare, color: 'text-amber-400', p: 'Easy to set up', c: 'SIM hijacking risk' },
              { type: 'Auth Apps', level: 'Strong', icon: Smartphone, color: 'text-emerald-400', p: 'Offline support', c: 'Device dependent' },
              { type: 'Security Keys', level: 'Maximum', icon: Key, color: 'text-primary', p: 'Immune to phishing', c: 'Physical key needed' }
            ].map((m, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${m.color}`}>
                  <m.icon className="w-20 h-20" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                    <h4 className="font-black uppercase tracking-widest text-xs">{m.type}</h4>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="text-[10px] opacity-60">👍 {m.p}</div>
                    <div className="text-[10px] opacity-60">⚠️ {m.c}</div>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase bg-white/5 border border-white/5 ${m.color}`}>
                    Security: {m.level}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Question */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-20 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 relative z-10">Do you use 2FA anywhere right now?</h3>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Button variant={userHas2FA === 'yes' ? 'default' : 'outline'} onClick={() => setUserHas2FA('yes')} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest">Yes, I'm protected</Button>
              <Button variant={userHas2FA === 'no' ? 'destructive' : 'outline'} onClick={() => setUserHas2FA('no')} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest">Not yet</Button>
            </div>
            <AnimatePresence>
              {userHas2FA === 'yes' && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-primary font-black uppercase text-[10px] mt-8 tracking-widest flex items-center justify-center gap-2">
                  <ThumbsUp className="w-4 h-4" /> Great work! Your data is much safer.
                </motion.p>
              )}
              {userHas2FA === 'no' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-2">
                  <p className="text-destructive font-black uppercase text-[10px] tracking-widest">Let's fix that!</p>
                  <p className="text-[11px] opacity-40 font-medium leading-relaxed">Secure your email first — it's your digital life support.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-16 border-t border-white/5 opacity-30">
          <p className="text-[9px] font-black uppercase tracking-[0.4em]">Privacy First • Local Only • No Tracking</p>
        </footer>
      </div>
    </div>
  );
}