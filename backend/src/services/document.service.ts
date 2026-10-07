import { generateStructuredJSON, wrapUntrustedContent } from './ai.service';
import { redactSecrets } from './secretRedaction.service';
import fs from 'fs';
import path from 'path';

// Dynamic import or require for officeparser
let officeParser: any = null;
try {
  officeParser = require('officeparser');
} catch {
  // Graceful fallback if not yet installed
}

export const parseDocumentFromBuffer = async (buffer: Buffer, filename: string): Promise<string> => {
  const ext = path.extname(filename).toLowerCase();

  // Plain text and Markdown
  if (ext === '.txt' || ext === '.md') {
    return buffer.toString('utf-8');
  }

  // Office & PDF documents via officeparser
  if (officeParser) {
    try {
      const text = await officeParser.parseOfficeAsync(buffer);
      if (text && typeof text === 'string') {
        return text;
      }
    } catch (err) {
      console.warn(`officeparser failed on ${filename}, using fallback:`, err);
    }
  }

  // Fallback for string-convertible content
  return buffer.toString('utf-8');
};

export const parseDocumentFromUrl = async (documentUrl: string): Promise<string> => {
  try {
    const response = await fetch(documentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = new URL(documentUrl).pathname;
    const rawText = await parseDocumentFromBuffer(buffer, filename);
    return redactSecrets(rawText);
  } catch (error: any) {
    console.error(`Document fetch/parse error (${documentUrl}):`, error);
    return `[Document unreadable or inaccessible: ${error.message}]`;
  }
};

export interface ExtractedClaim {
  claim: string;
  category: 'feature' | 'technology' | 'architecture' | 'performance' | 'security' | 'business';
  expectedEvidence: string;
  sourceSection?: string;
}

export const extractClaimsFromDocument = async (text: string, docName: string = 'Document'): Promise<ExtractedClaim[]> => {
  const sanitizedText = redactSecrets(text).slice(0, 15000); // Token optimization boundary

  const prompt = `
You are an expert Document Intelligence agent for project due diligence.
Analyze the following project document and extract discrete, verifiable assertions/claims made by the builders.

Each claim must represent an objective assertion that could be proven or disproven by inspecting code, dependencies, or configuration.

${wrapUntrustedContent(sanitizedText, docName)}

Extract 5 to 15 key claims across:
- feature: specific features claimed to be built
- technology: frameworks, databases, or AI models claimed
- architecture: system structure, offline capabilities, or microservices
- security: auth methods, encryption, or secrets handling

Return ONLY a JSON object matching this schema:
{
  "claims": [
    {
      "claim": "Exact statement of claim",
      "category": "feature | technology | architecture | performance | security | business",
      "expectedEvidence": "Specific file, route, dependency, or function that would verify this",
      "sourceSection": "Section or heading where this claim appeared"
    }
  ]
}
`;

  // Deterministic fallback if AI is unavailable or offline
  const fallback = (): { claims: ExtractedClaim[] } => {
    const lines = sanitizedText.split('\n').filter(l => l.trim().length > 20);
    const sampleClaims: ExtractedClaim[] = lines.slice(0, 5).map((l, idx) => ({
      claim: l.trim().slice(0, 100),
      category: idx % 2 === 0 ? 'feature' : 'technology',
      expectedEvidence: 'Code inspection of implementation files',
      sourceSection: 'Document Body',
    }));
    return { claims: sampleClaims };
  };

  const result = await generateStructuredJSON<{ claims: ExtractedClaim[] }>(
    prompt,
    'gemini-1.5-flash',
    fallback
  );

  return result.claims || [];
};
