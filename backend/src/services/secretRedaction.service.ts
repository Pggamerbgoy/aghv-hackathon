export interface SecretPattern {
  regex: RegExp;
  label: string;
}

export const SECRET_PATTERNS: SecretPattern[] = [
  // OpenAI & LLM API Keys
  { regex: /sk-(?:proj-|live-)?[a-zA-Z0-9_\-]{32,}/g, label: 'OPENAI_KEY' },
  { regex: /AIza[0-9A-Za-z\-_]{35}/g, label: 'FIREBASE_OR_GOOGLE_API_KEY' },
  { regex: /anthropic-[a-zA-Z0-9_\-]{32,}/g, label: 'ANTHROPIC_KEY' },

  // AWS Credentials
  { regex: /AKIA[0-9A-Z]{16}/g, label: 'AWS_ACCESS_KEY' },
  { regex: /(?:aws_secret_access_key|aws_secret_key)\s*[:=]\s*['"]?([a-zA-Z0-9/+=]{40})['"]?/gi, label: 'AWS_SECRET_KEY' },

  // GitHub Tokens
  { regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/g, label: 'GITHUB_TOKEN' },
  { regex: /github_pat_[a-zA-Z0-9_]{82}/g, label: 'GITHUB_FINE_GRAINED_TOKEN' },

  // Private Keys & Certificates
  { regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g, label: 'PRIVATE_KEY' },

  // Database Connection Strings with Passwords
  { regex: /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^\s'"]+/gi, label: 'DATABASE_CONNECTION_STRING' },

  // Payment & Messaging Gateways
  { regex: /(?:sk|rk)_(?:test|live)_[0-9a-zA-Z]{24,99}/g, label: 'STRIPE_SECRET_KEY' },
  { regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/g, label: 'SLACK_TOKEN' },

  // Generic Assignments (API keys, passwords, secrets in .env or configs)
  { regex: /(?:api[_-]?key|apikey|secret[_-]?key|client[_-]?secret|auth[_-]?token|access[_-]?token)\s*[:=]\s*["']?([a-zA-Z0-9_\-\.\$\/]{12,})["']?/gi, label: 'GENERIC_SECRET' },
  { regex: /(?:password|passwd|pwd)\s*[:=]\s*["']?([^"'\s\n]{6,})["']?/gi, label: 'PASSWORD' },
];

export interface RedactionResult {
  sanitized: string;
  redactedCount: number;
  detectedTypes: string[];
}

export const redactSecrets = (text: string): string => {
  if (!text || typeof text !== 'string') return text || '';
  
  let redacted = text;
  for (const pattern of SECRET_PATTERNS) {
    redacted = redacted.replace(pattern.regex, `[REDACTED_${pattern.label}]`);
  }
  return redacted;
};

export const auditAndRedactSecrets = (text: string): RedactionResult => {
  if (!text || typeof text !== 'string') {
    return { sanitized: '', redactedCount: 0, detectedTypes: [] };
  }

  let sanitized = text;
  let count = 0;
  const types = new Set<string>();

  for (const pattern of SECRET_PATTERNS) {
    const matches = sanitized.match(pattern.regex);
    if (matches && matches.length > 0) {
      count += matches.length;
      types.add(pattern.label);
      sanitized = sanitized.replace(pattern.regex, `[REDACTED_${pattern.label}]`);
    }
  }

  return {
    sanitized,
    redactedCount: count,
    detectedTypes: Array.from(types),
  };
};

export const containsSecrets = (text: string): boolean => {
  if (!text || typeof text !== 'string') return false;
  return SECRET_PATTERNS.some(pattern => pattern.regex.test(text));
};
