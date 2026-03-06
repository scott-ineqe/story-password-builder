import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, ArrowLeft, Sparkles, RotateCcw, Lock } from 'lucide-react';
import { Scenario, scorePassword, scoreCommonPassword } from '@/lib/scenarios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StrengthMeter from './StrengthMeter';
import { HistoryEntry } from './SessionHistory';

interface Props {
  scenario: Scenario;
  onBack: () => void;
  onPasswordForged?: (entry: HistoryEntry) => void;
}

export default function PasswordWizard({ scenario, onBack, onPasswordForged }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(scenario.steps.length).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const step = scenario.steps[currentStep];

  const handleNext = () => {
    const val = answers[currentStep].trim();
    if (!val) { setError('This field is required'); return; }
    if (step.validate) {
      const err = step.validate(val);
      if (err) { setError(err); return; }
    }
    setError(null);
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setError(null);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInput = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNext();
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers(Array(scenario.steps.length).fill(''));
    setError(null);
    setFinished(false);
  };

  if (finished) {
    const password = scenario.buildPassword(answers);
    const story = scenario.buildStory(answers);
    const result = scorePassword(password);
    const weakResult = scoreCommonPassword('P@ssword1');

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto space-y-6"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-display text-primary gold-text-glow">Password Forged!</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/50 rounded-xl p-6 border border-border gold-glow"
        >
          <p className="text-sm text-muted-foreground mb-2">Your password:</p>
          <div className="flex items-center gap-3 bg-background/50 rounded-lg p-4 border border-primary/30">
            <Lock className="w-5 h-5 text-primary shrink-0" />
            <code className="text-xl font-mono text-primary break-all">{password}</code>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your password</p>
            <StrengthMeter score={result.score} label={result.label} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">vs. "P@ssword1"</p>
            <StrengthMeter score={weakResult.score} label={weakResult.label} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-secondary/30 rounded-xl p-4 border border-border"
        >
          <p className="text-sm text-muted-foreground mb-1 font-display">Your Memory Story</p>
          <p className="text-foreground text-sm leading-relaxed">{story}</p>
        </motion.div>

        {result.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-1"
          >
            <p className="text-xs text-muted-foreground">Tips to go even higher:</p>
            {result.tips.map((tip, i) => (
              <p key={i} className="text-xs text-accent">• {tip}</p>
            ))}
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Button variant="outline" className="flex-1" onClick={onBack}>
            New Scenario
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Scenarios
        </button>
        <div className="flex gap-1.5">
          {scenario.steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= currentStep ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          Step {currentStep + 1} of {scenario.steps.length}
        </p>
        <h2 className="text-lg font-display text-primary">{scenario.title}</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="bg-secondary/30 rounded-xl p-6 border border-border space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-foreground font-medium">{step.prompt}</p>
                <p className="text-sm text-muted-foreground mt-1">{step.hint}</p>
              </div>
            </div>

            <Input
              value={answers[currentStep]}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={step.placeholder}
              className="bg-background/50 border-border focus:border-primary text-foreground"
              maxLength={step.type === 'special' ? 1 : step.type === 'number' ? 4 : 50}
              autoFocus
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {currentStep > 0 && (
          <Button variant="outline" onClick={handlePrev} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}
        <Button onClick={handleNext} className="flex-1">
          {currentStep < scenario.steps.length - 1 ? (
            <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
          ) : (
            <>Forge Password <Sparkles className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
