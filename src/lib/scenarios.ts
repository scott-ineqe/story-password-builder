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
];

export function scorePassword(password: string): {
  score: number;
  label: string;
  rank: string; // Added for UI engagement
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
  let rank: string;
  let color: string;
  if (score < 30) { label = 'Weak'; rank = 'Peasant'; color = 'strength-weak'; }
  else if (score < 50) { label = 'Fair'; rank = 'Squire'; color = 'strength-fair'; }
  else if (score < 70) { label = 'Good'; rank = 'Knight'; color = 'strength-good'; }
  else if (score < 90) { label = 'Strong'; rank = 'Warden'; color = 'strength-strong'; }
  else { label = 'Legendary'; rank = 'Overlord'; color = 'strength-legendary'; }

  return { score, label, rank, color, tips };
}

export function scoreCommonPassword(password: string) {
  return scorePassword(password);
}

export async function checkBreachedCount(password: string): Promise<number> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) return 0;
    const text = await response.text();
    const lines = text.split('\n');
    for (const line of lines) {
      const [lineSuffix, count] = line.split(':');
      if (lineSuffix === suffix) return parseInt(count.trim(), 10);
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

export function simulateAttacks(password: string): AttackResult[] {
  const common = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome', 'password123'];
  const isCommon = common.some(c => password.toLowerCase().includes(c));
  const dictionaryAttack: AttackResult = {
    name: 'Dictionary Attack',
    timeLabel: isCommon ? 'Instant' : '> 1 month',
    description: isCommon ? 'Found in common lists.' : 'Unique pattern.',
    isVulnerable: isCommon,
    type: 'dictionary'
  };
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]/.test(password)) charsetSize += 32;
  const combinations = Math.pow(charsetSize || 1, password.length);
  const secondsToCrack = combinations / 10_000_000_000;
  const formatTime = (s: number) => {
    if (s < 1) return '< 1s';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    if (s < 31536000) return `${Math.floor(s / 86400)}d`;
    return `${Math.floor(s / 31536000)}y`;
  };
  const bruteForceAttack: AttackResult = {
    name: 'Brute Force',
    timeLabel: formatTime(secondsToCrack),
    description: secondsToCrack < 3600 ? 'Fast Crack' : 'Mathematically Strong',
    isVulnerable: secondsToCrack < 3600,
    type: 'brute'
  };
  const isSimple = password.length < 10;
  const stuffingAttack: AttackResult = {
    name: 'Credential Stuffing',
    timeLabel: isSimple ? 'High Risk' : 'Low Risk',
    description: isSimple ? 'Target for leak lists.' : 'Unique footprint.',
    isVulnerable: isSimple,
    type: 'stuffing'
  };
  return [dictionaryAttack, bruteForceAttack, stuffingAttack];
}