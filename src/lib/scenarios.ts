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
  {
    id: 'culinary-masterpiece',
    title: 'The Culinary Masterpiece',
    description: 'Whip up an uncrackable password based on your most memorable cooking triumph.',
    icon: '🧑‍🍳',
    steps: [
      {
        id: 'dish',
        prompt: "What's your signature dish?",
        hint: 'A meal you love to cook or eat.',
        placeholder: 'e.g. Lasagna',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'ingredient',
        prompt: 'Now intentionally misspell a favorite ingredient.',
        hint: 'Replace letters with numbers or mix case. e.g. Nutmeg → Nutm3g',
        placeholder: 'e.g. Nutm3g',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'Make it at least 3 characters' : null,
      },
      {
        id: 'number',
        prompt: 'Pick a 2-digit number (like a cooking temperature).',
        hint: 'Any 2 digits you will easily remember.',
        placeholder: 'e.g. 75',
        type: 'number',
        validate: (v) => /^\d{2}$/.test(v) ? null : 'Enter exactly 2 digits',
      },
      {
        id: 'shield',
        prompt: 'Choose a special character to garnish it.',
        hint: 'Your culinary stamp. Pick one: # @ ! $ & *',
        placeholder: 'e.g. @',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter exactly 1 special character',
      },
    ],
    buildPassword: (a) => `${a[1]}${a[2]}${a[3]}`,
    buildStory: (a) => `You took your "${a[0]}", spiced it up with "${a[1]}", baked it at ${a[2]} degrees, and garnished it with "${a[3]}".`,
  },
  {
    id: 'travel-adventure',
    title: 'The Travel Adventure',
    description: 'Chart a course to a strong password using your favorite vacation memories.',
    icon: '✈️',
    steps: [
      {
        id: 'destination',
        prompt: 'What is a memorable place you visited?',
        hint: 'A city, country, or specific landmark.',
        placeholder: 'e.g. Tokyo',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'misspell',
        prompt: 'Create a unique, misspelled version of that place.',
        hint: 'Twist it to make it yours. e.g. Tokyo → T0ky0',
        placeholder: 'e.g. T0ky0',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'Make it at least 3 characters' : null,
      },
      {
        id: 'year',
        prompt: 'What 2-digit year did you go (or want to go)?',
        hint: 'For example, 2019 becomes 19.',
        placeholder: 'e.g. 19',
        type: 'number',
        validate: (v) => /^\d{2}$/.test(v) ? null : 'Enter exactly 2 digits',
      },
      {
        id: 'shield',
        prompt: 'Add a punctuation mark to pack your bags.',
        hint: 'A symbol to secure the journey. Pick one: # @ ! $ & *',
        placeholder: 'e.g. $',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter exactly 1 special character',
      },
    ],
    buildPassword: (a) => `${a[1]}${a[3]}${a[2]}`,
    buildStory: (a) => `You traveled to "${a[0]}", remembered it uniquely as "${a[1]}", anchored it with the symbol "${a[3]}", and locked it in the year '${a[2]}.`,
  },
  {
    id: 'musical-journey',
    title: 'The Musical Journey',
    description: 'Compose a rock-solid password inspired by your favorite tunes.',
    icon: '🎸',
    steps: [
      {
        id: 'band',
        prompt: 'Name an unforgettable band, artist, or song.',
        hint: 'Something you never skip when it comes on.',
        placeholder: 'e.g. Queen',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'misspell',
        prompt: 'Remix the name with numbers or weird capitalization.',
        hint: 'e.g. Queen → Qu33N',
        placeholder: 'e.g. Qu33N',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'Make it at least 3 characters' : null,
      },
      {
        id: 'number',
        prompt: 'Pick a 2-digit number (like a track number or age).',
        hint: 'A personal number that fits the rhythm.',
        placeholder: 'e.g. 14',
        type: 'number',
        validate: (v) => /^\d{2}$/.test(v) ? null : 'Enter exactly 2 digits',
      },
      {
        id: 'shield',
        prompt: 'Pick a symbol to represent the music.',
        hint: 'The final beat. Pick one: # @ ! $ & *',
        placeholder: 'e.g. &',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter exactly 1 special character',
      },
    ],
    buildPassword: (a) => `${a[3]}${a[1]}${a[2]}`,
    buildStory: (a) => `You jammed to "${a[0]}", remixed it into "${a[1]}", set the tempo to ${a[2]}, and hit the final chord with "${a[3]}".`,
  }
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

export function scoreCommonPassword(password: string) {
  return scorePassword(password);
}

// "Have I Been Pwned" API Check (K-Anonymity)
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
      if (lineSuffix === suffix) {
        return parseInt(count.trim(), 10);
      }
    }
    return 0;
  } catch (error) {
    console.error('Breach check failed:', error);
    return 0;
  }
}

export function simulateAttacks(password: string): AttackResult[] {
  const common = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome', 'password123'];
  const isCommon = common.some(c => password.toLowerCase().includes(c));
  
  const dictionaryAttack: AttackResult = {
    name: 'Dictionary Attack',
    timeLabel: isCommon ? 'Instant' : '> 1 month',
    description: isCommon 
      ? 'Cracked instantly! Your password was found in a common dictionary.'
      : 'Secure. Not found in standard dictionary lists.',
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