import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import { ScenarioStep } from '@/lib/scenarios';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Requirement {
  label: string;
  hint: string;
  check: (password: string) => boolean;
}

interface Props {
  steps: ScenarioStep[];
  answers: string[];
  password: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function usePasswordRequirements(steps: ScenarioStep[], answers: string[]): Requirement[] {
  return useMemo(() => {
    const reqs: Requirement[] = [];

    steps.forEach((step, i) => {
      const answer = answers[i]?.trim();
      if (!answer) return;

      if (step.type === 'special') {
        reqs.push({
          label: `Special character "${answer}"`,
          hint: `Include your chosen shield: ${answer}`,
          check: (pw) => pw.includes(answer),
        });
      } else if (step.type === 'number') {
        reqs.push({
          label: `Number "${answer}"`,
          hint: `Include your number: ${answer}`,
          check: (pw) => pw.includes(answer),
        });
      } else if (step.id === 'misspell' || step.id === 'twist') {
        reqs.push({
          label: `Creative spelling "${answer}"`,
          hint: `Include your twisted word: ${answer}`,
          check: (pw) => pw.toLowerCase().includes(answer.toLowerCase()),
        });
      }
    });

    // Always require min length
    reqs.push({
      label: 'At least 8 characters',
      hint: 'Your password should be at least 8 characters long',
      check: (pw) => pw.length >= 8,
    });

    return reqs;
  }, [steps, answers]);
}

export default function PasswordComposer({ steps, answers, password, onChange, onKeyDown }: Props) {
  const requirements = usePasswordRequirements(steps, answers);
  const allMet = requirements.every((r) => r.check(password));

  return (
    <div className="space-y-4">
      <div className="bg-secondary/30 rounded-xl p-6 border border-border space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground font-medium">
              Now forge your password!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Combine all your ingredients into one powerful password. Make sure to include everything below.
            </p>
          </div>
        </div>

        <Input
          value={password}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your password here..."
          className="bg-background/50 border-border focus:border-primary text-foreground font-mono text-lg"
          autoFocus
        />

        {/* Requirements checklist */}
        <TooltipProvider delayDuration={200}>
          <div className="space-y-1.5 pt-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Ingredients Checklist
            </p>
            {requirements.map((req, i) => {
              const met = req.check(password);
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-default transition-colors ${
                        met
                          ? 'bg-strength-good/10 text-strength-good'
                          : 'bg-secondary/50 text-muted-foreground'
                      }`}
                    >
                      {met ? (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{req.label}</span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-secondary border-border text-foreground"
                  >
                    <p className="text-xs">{req.hint}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {!allMet && password.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center"
        >
          Include all ingredients to forge your password ✨
        </motion.p>
      )}
    </div>
  );
}

export function areAllRequirementsMet(
  steps: ScenarioStep[],
  answers: string[],
  password: string
): boolean {
  const reqs: Requirement[] = [];
  steps.forEach((step, i) => {
    const answer = answers[i]?.trim();
    if (!answer) return;
    if (step.type === 'special') {
      reqs.push({ label: '', hint: '', check: (pw) => pw.includes(answer) });
    } else if (step.type === 'number') {
      reqs.push({ label: '', hint: '', check: (pw) => pw.includes(answer) });
    } else if (step.id === 'misspell' || step.id === 'twist') {
      reqs.push({ label: '', hint: '', check: (pw) => pw.toLowerCase().includes(answer.toLowerCase()) });
    }
  });
  reqs.push({ label: '', hint: '', check: (pw) => pw.length >= 8 });
  return reqs.every((r) => r.check(password));
}
