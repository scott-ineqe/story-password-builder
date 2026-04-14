// Add these to the end of src/lib/scenarios.ts

export interface AttackResult {
  name: string;
  timeLabel: string;
  description: string;
  isVulnerable: boolean;
  type: 'dictionary' | 'brute' | 'stuffing';
}

export function simulateAttacks(password: string): AttackResult[] {
  const common = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome', 'password123'];
  const isCommon = common.some(c => password.toLowerCase().includes(c));
  
  // 1. Dictionary Attack Simulation
  const dictionaryAttack: AttackResult = {
    name: 'Dictionary Attack',
    timeLabel: isCommon ? 'Instant' : '> 1 month',
    description: isCommon 
      ? 'Cracked instantly! Your password (or a part of it) was found in a common password dictionary.'
      : 'Secure. This password is not found in standard dictionary lists.',
    isVulnerable: isCommon,
    type: 'dictionary'
  };

  // 2. Brute Force Estimation
  // Basic entropy calculation: log2(charset^length)
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/\d/.test(password)) charsetSize += 10;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\`~]/.test(password)) charsetSize += 32;

  const combinations = Math.pow(charsetSize || 1, password.length);
  const guessesPerSecond = 10_000_000_000; // 10 Billion guesses/sec (Modern GPU)
  const secondsToCrack = combinations / guessesPerSecond;

  const formatTime = (s: number) => {
    if (s < 1) return 'Under 1 second';
    if (s < 60) return `${Math.floor(s)} seconds`;
    if (s < 3600) return `${Math.floor(s / 60)} minutes`;
    if (s < 86400) return `${Math.floor(s / 3600)} hours`;
    if (s < 2592000) return `${Math.floor(s / 86400)} days`;
    if (s < 31536000) return `${Math.floor(s / 2592000)} months`;
    if (s < 3153600000) return `${Math.floor(s / 31536000)} years`;
    return 'Centuries';
  };

  const bruteForceAttack: AttackResult = {
    name: 'Brute Force Attack',
    timeLabel: formatTime(secondsToCrack),
    description: secondsToCrack < 3600 
      ? 'Vulnerable. A modern computer can try every combination in a very short time.'
      : 'Strong defense. The sheer number of combinations makes brute-forcing mathematically improbable.',
    isVulnerable: secondsToCrack < 3600,
    type: 'brute'
  };

  // 3. Credential Stuffing Risk
  const isSimple = password.length < 10 || !/[!@#$%^&*]/.test(password);
  const stuffingAttack: AttackResult = {
    name: 'Credential Stuffing',
    timeLabel: isSimple ? 'High Risk' : 'Low Risk',
    description: isSimple
      ? 'Attackers use lists of leaked passwords from other sites. Simple passwords are the first targets.'
      : 'Your unique pattern is less likely to appear on automated "stuffing" lists used by hackers.',
    isVulnerable: isSimple,
    type: 'stuffing'
  };

  return [dictionaryAttack, bruteForceAttack, stuffingAttack];
}