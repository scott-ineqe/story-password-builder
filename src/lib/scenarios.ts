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
    id: 'food-fusion',
    title: 'The Food Fusion',
    description: 'Cook up a password from your favorite foods.',
    icon: '🍕',
    steps: [
      {
        id: 'food',
        prompt: 'Name your absolute favorite food.',
        hint: 'The one you could eat every day forever.',
        placeholder: 'e.g. Tacos',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'twist',
        prompt: 'Give it a creative twist — misspell or abbreviate it.',
        hint: 'Make it unique: Tacos → T4c0s, Pizza → P!zza',
        placeholder: 'e.g. T4c0s',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'At least 3 characters' : null,
      },
      {
        id: 'quantity',
        prompt: 'How many would you eat in one sitting? (Pick a number)',
        hint: 'Be honest... or exaggerate wildly.',
        placeholder: 'e.g. 99',
        type: 'number',
        validate: (v) => /^\d{1,3}$/.test(v) ? null : 'Enter 1–3 digits',
      },
      {
        id: 'spice',
        prompt: 'Add some spice — pick a special character.',
        hint: 'The secret ingredient: @ # $ ! & *',
        placeholder: 'e.g. &',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter 1 special character',
      },
    ],
    buildPassword: (a) => `${a[1]}${a[3]}${a[2]}x`,
    buildStory: (a) => `You love "${a[0]}", coded it as "${a[1]}", spiced it with "${a[3]}", and ordered ${a[2]} of them. Bon appétit!`,
  },
  {
    id: 'pet-kingdom',
    title: 'The Pet Kingdom',
    description: 'Your pet rules a kingdom — and your password.',
    icon: '🐾',
    steps: [
      {
        id: 'pet',
        prompt: "What's your pet's name? (Or dream pet's name)",
        hint: 'Real or imaginary — the ruler of your kingdom.',
        placeholder: 'e.g. Whiskers',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'kingdom',
        prompt: 'Name their kingdom (make it short & fun).',
        hint: 'e.g. Fluffton, Barkadia, Meowville',
        placeholder: 'e.g. Barkadia',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'At least 3 characters' : null,
      },
      {
        id: 'crown',
        prompt: 'Pick a crown symbol for your ruler.',
        hint: 'Their royal seal: ^ * # @ $',
        placeholder: 'e.g. ^',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter 1 special character',
      },
      {
        id: 'subjects',
        prompt: 'How many subjects in the kingdom? (2-3 digits)',
        hint: 'A number to seal the royal decree.',
        placeholder: 'e.g. 42',
        type: 'number',
        validate: (v) => /^\d{2,3}$/.test(v) ? null : 'Enter 2–3 digits',
      },
    ],
    buildPassword: (a) => `${a[0]}${a[2]}${a[1]}${a[3]}`,
    buildStory: (a) => `${a[0]} rules ${a[1]} with ${a[3]} loyal subjects, crowned with "${a[2]}".`,
  },
  {
    id: 'travel-log',
    title: 'The Travel Log',
    description: 'Turn your dream destination into a secret passphrase.',
    icon: '✈️',
    steps: [
      {
        id: 'destination',
        prompt: 'Name a city or country you dream of visiting.',
        hint: 'Somewhere that excites you — real or imaginary.',
        placeholder: 'e.g. Tokyo',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'twist',
        prompt: 'Twist the name — misspell or abbreviate it.',
        hint: 'Make it yours: Tokyo → T0ky0, Paris → P4r1s',
        placeholder: 'e.g. T0ky0',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'At least 3 characters' : null,
      },
      {
        id: 'year',
        prompt: 'What year will you go? (Pick any number)',
        hint: 'Future, past, or fantasy — 2-4 digits.',
        placeholder: 'e.g. 2030',
        type: 'number',
        validate: (v) => /^\d{2,4}$/.test(v) ? null : 'Enter 2–4 digits',
      },
      {
        id: 'stamp',
        prompt: 'Pick a passport stamp symbol.',
        hint: 'Your travel seal: @ # $ ! & *',
        placeholder: 'e.g. @',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter 1 special character',
      },
    ],
    buildPassword: (a) => `${a[1]}${a[3]}${a[2]}Go`,
    buildStory: (a) => `You're headed to "${a[0]}", coded as "${a[1]}", stamped with "${a[3]}" in ${a[2]}. Bon voyage!`,
  },
  {
    id: 'playlist-power',
    title: 'The Playlist Power',
    description: 'Turn your favorite song into an unbreakable key.',
    icon: '🎵',
    steps: [
      {
        id: 'song',
        prompt: 'Name a song you never skip.',
        hint: 'The one that always gets you hyped.',
        placeholder: 'e.g. Bohemian Rhapsody',
        type: 'text',
        validate: (v) => v.trim().length < 2 ? 'Enter at least 2 characters' : null,
      },
      {
        id: 'remix',
        prompt: 'Remix the title — abbreviate or leet-speak it.',
        hint: 'e.g. Bohemian Rhapsody → B0hRhap, Thriller → Thr!ll3r',
        placeholder: 'e.g. B0hRhap',
        type: 'text',
        validate: (v) => v.trim().length < 3 ? 'At least 3 characters' : null,
      },
      {
        id: 'bpm',
        prompt: 'Pick a "BPM" — any 2-3 digit number.',
        hint: 'Your rhythm number — fast or slow.',
        placeholder: 'e.g. 120',
        type: 'number',
        validate: (v) => /^\d{2,3}$/.test(v) ? null : 'Enter 2–3 digits',
      },
      {
        id: 'beat',
        prompt: 'Drop the beat — pick a special character.',
        hint: 'Your signature beat drop: ! @ # $ %',
        placeholder: 'e.g. !',
        type: 'special',
        validate: (v) => /^[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]$/.test(v) ? null : 'Enter 1 special character',
      },
    ],
    buildPassword: (a) => `${a[1]}${a[3]}${a[2]}Mix`,
    buildStory: (a) => `Your anthem "${a[0]}" became "${a[1]}", dropped with "${a[3]}" at ${a[2]} BPM. Now that's a banger!`,
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

  // Bonus for leet speak
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password) && password.length >= 8) score += 5;

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
