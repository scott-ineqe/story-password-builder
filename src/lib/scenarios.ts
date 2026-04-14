// src/lib/scenarios.ts

export interface ScenarioStep {
  id: string;
  prompt: string;
  hint: string;
  placeholder: string;
  type: 'text' | 'number' | 'special';
  validate?: (value: string) => string | null;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: ScenarioStep[];
  buildPassword: (answers: string[]) => string;
  buildStory: (answers: string[]) => string;
}

// Interface for the attack simulation results
export interface AttackResult {
  name: string;
  timeLabel: string;
  description: string;
  isVulnerable: boolean;
  type: 'dictionary' | 'brute' | 'stuffing';
}

export const scenarios: Scenario[] = [
  {
    id: 'childhood-movie',
    title: 'The Childhood Epic',
    description: 'Turn your favorite childhood movie into an uncrackable password.',
    icon: '🎬',
    steps: [
      {
        id: 'movie',
        prompt: "What's your favorite childhood movie?",
        hint: 'Think of something memorable — a movie you loved as a kid.',
        placeholder: 'e.g. Lion King',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'number',
        prompt: 'Pick a random 2-digit number.',
        hint: 'A number that means something to you — birthday, lucky number, jersey.',
        placeholder: 'e.g. 88',
        type: 'number',
        validate: (v) => /^\d{2}$/.test(v) ? null : 'Enter exactly 2 digits',
      },
      {
        id: 'shield',
        prompt: 'Choose a special character to "shield" your password.',
        hint: 'This is your armor. Pick one: # @ ! $ & *',
        placeholder: 'e.g. #',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter exactly 1 special character',
      },
      {
        id: 'misspell',
        prompt: 'Now intentionally misspell the movie name — make it yours.',
        hint: 'Replace letters with numbers or mix case. e.g. Lion King → Ly0nKing',
        placeholder: 'e.g. Ly0nKing',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'Make it at least 3 characters' : null,
      },
    ],
    buildPassword: (a) => `${a[3]}${a[2]}${a[1]}.`,
    buildStory: (a) => `You took "${a[0]}", twisted it into "${a[3]}", shielded it with "${a[2]}", stamped it with ${a[1]}, and sealed it with a period.`,
  },
  {
    id: 'hero-quest',
    title: 'The Hero Quest',
    description: 'Build a password from your personal hero and a quest.',
    icon: '⚔️',
    steps: [
      {
        id: 'hero',
        prompt: 'Name a personal hero or someone you admire.',
        hint: 'Real or fictional — someone whose name sticks in your mind.',
        placeholder: 'e.g. Batman',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'action',
        prompt: 'Pick an action verb — something powerful.',
        hint: 'What does your hero do? Fights, Builds, Flies, Saves...',
        placeholder: 'e.g. Saves',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter a verb' : null,
      },
      {
        id: 'year',
        prompt: 'Pick a meaningful year.',
        hint: 'Birth year, graduation, a year you\'ll never forget.',
        placeholder: 'e.g. 2003',
        type: 'number',
        validate: (v) => /^\d{4}$/.test(v) ? null : 'Enter a 4-digit year',
      },
      {
        id: 'symbol',
        prompt: 'Choose your battle symbol.',
        hint: 'A special character: ! @ # $ % ^',
        placeholder: 'e.g. !',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter exactly 1 special character',
      },
    ],
    buildPassword: (a) => `${a[0]}${a[1]}${a[3]}${a[2]}`,
    buildStory: (a) => `Your hero "${a[0]}" ${a[1].toLowerCase()} the day, marked by ${a[3]} in the year ${a[2]}.`,
  },
];

export function scorePassword(password: string): {
  score: number;
  label: string;
  color: string;
  tips: string[];
} {
  let score = 0;
  const tips: string[] = [];

  if (password.length >= 8) score += 20;
  else tips.push('Make it at least 8 characters');
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 10;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 15;
  else tips.push('Mix uppercase and lowercase');

  if (/\d/.test(password)) score += 15;
  else tips.push('Add some numbers');

  if (/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]/.test(password)) score += 15;
  else tips.push('Include a special character');

  if (!/(.)\1{2,}/.test(password)) score += 10;
  else tips.push('Avoid repeating characters');

  const common = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome'];
  if (!common.some(c => password.toLowerCase().includes(c))) score += 10;

  score = Math.min(100, score);

  let label: string;
  let color: string;
  if (score < 30) { label = 'Weak'; color = 'strength-weak'; }
  else if (score < 50) { label = 'Fair'; color = 'strength-fair'; }
  else if (score < 70) { label = 'Good'; color = 'strength-good'; }
  else if (score < 90) { label = 'Strong'; color = 'strength-strong'; }
  else { label = 'Legendary'; color = 'strength-legendary'; }

  return { score, label, color, tips };
}

export function simulateAttacks(password: string): AttackResult[] {
  const common = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome', 'password123'];
  const isCommon = common.some(c => password.toLowerCase().includes(c));
  
  // 1. Dictionary Attack Simulation
  const dictionaryAttack: AttackResult = {
    name: 'Dictionary Attack',
    timeLabel: isCommon ? 'Instant' : '> 1 month',
    description: isCommon 
      ? 'Cracked instantly! Your password was found in a common dictionary.'
      : 'Secure. Not found in standard dictionary lists.',
    isVulnerable: isCommon,
    type: 'dictionary'
  };

  // 2. Brute Force Estimation (10 Billion guesses/sec)
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]/.test(password)) charsetSize += 32;

  const combinations = Math.pow(charsetSize || 1, password.length);
  const secondsToCrack = combinations / 10_000_000_000;

  const formatTime = (s: number) => {
    if (s < 1) return 'Under 1 sec';
    if (s < 3600) return `${Math.floor(s / 60)} mins`;
    if (s < 86400) return `${Math.floor(s / 3600)} hours`;
    if (s < 31536000) return `${Math.floor(s / 86400)} days`;
    return `${Math.floor(s / 31536000)} years`;
  };

  const bruteForceAttack: AttackResult = {
    name: 'Brute Force Attack',
    timeLabel: formatTime(secondsToCrack),
    description: secondsToCrack < 3600 
      ? 'Vulnerable to modern high-speed cracking hardware.'
      : 'Mathematically strong against guessing attacks.',
    isVulnerable: secondsToCrack < 3600,
    type: 'brute'
  };

  // 3. Credential Stuffing Risk
  const isSimple = password.length < 10;
  const stuffingAttack: AttackResult = {
    name: 'Credential Stuffing',
    timeLabel: isSimple ? 'High Risk' : 'Low Risk',
    description: isSimple
      ? 'Simple passwords are the primary targets in automated leak lists.'
      : 'Your unique pattern is harder to find in leaked databases.',
    isVulnerable: isSimple,
    type: 'stuffing'
  };

  return [dictionaryAttack, bruteForceAttack, stuffingAttack];
}