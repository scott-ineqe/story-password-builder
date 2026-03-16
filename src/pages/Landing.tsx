import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Shield, AlertTriangle, Lock, Eye, Globe, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { scorePassword } from '@/lib/scenarios';
import StrengthMeter from '@/components/StrengthMeter';

const securityContent = [
  {
    icon: AlertTriangle,
    title: 'Data Breaches Are Rampant',
    description:
      'Over 22 billion records were exposed in data breaches in 2024 alone. A weak password is often the first domino to fall — giving attackers access to your email, banking, and personal accounts.',
  },
  {
    icon: Eye,
    title: 'Brute Force Is Getting Faster',
    description:
      'Modern hardware can test billions of password combinations per second. A simple 6-character password can be cracked in under a second, while a strong 16-character one could take centuries.',
  },
  {
    icon: Globe,
    title: 'Credential Stuffing Attacks',
    description:
      'Hackers take leaked passwords from one site and try them everywhere else. If you reuse passwords, a single breach can compromise all your accounts across the internet.',
  },
  {
    icon: Lock,
    title: 'Identity Theft & Financial Loss',
    description:
      'Weak passwords are the #1 gateway to identity theft. Victims spend an average of 200+ hours and thousands of dollars recovering from stolen identities — all preventable with better passwords.',
  },
];

export default function Landing() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const result = password.length > 0 ? scorePassword(password) : null;

  return (
    <div className="min-h-screen palace-gradient flex flex-col items-center p-4 sm:p-8">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 mt-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/30 border border-primary/40 mb-4 gold-glow">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-foreground gold-text-glow">
            Memory Palace
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4" />
            How strong is your password? Find out below.
          </p>
        </motion.div>

        {/* Password Checker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6"
        >
          <h2 className="text-lg sm:text-xl font-display text-foreground mb-4">
            Rate Your Current Password
          </h2>
          <Input
            type="password"
            placeholder="Enter your current password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground/60 mb-4"
          />
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <StrengthMeter score={result.score} label={result.label} />
              {result.score < 50 && (
                <p className="text-sm text-destructive mt-3">
                  ⚠️ Your password is vulnerable. Consider building a stronger one below!
                </p>
              )}
              {result.score >= 50 && result.score < 80 && (
                <p className="text-sm text-strength-good mt-3">
                  Not bad, but there's room for improvement. Try forging a stronger one below!
                </p>
              )}
              {result.score >= 80 && (
                <p className="text-sm text-strength-legendary mt-3">
                  ✨ Great password! Want to see if you can forge an even better one?
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <Button
            size="lg"
            onClick={() => navigate('/forge')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 rounded-xl gold-glow"
          >
            Forge a Stronger Password
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-muted-foreground/70 text-xs mt-3">
            Build an unforgettable password through storytelling
          </p>
        </motion.div>

        {/* Security Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h2 className="text-xl sm:text-2xl font-display text-foreground text-center mb-6 gold-text-glow">
            Why Password Security Matters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityContent.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-destructive/20 border border-destructive/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-destructive" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-10 mb-6">
          <p className="text-muted-foreground/50 text-xs">
            Your password never leaves your browser. Everything runs locally.
          </p>
        </div>
      </div>
    </div>
  );
}
