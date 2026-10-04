export type RuleMatch = { text: string; matched: boolean };

// Keep the existing keyword-style automation as a fast path.
// Replace the URLs/text below with the creator's real resources.
const RULES = [
  { keywords: ["guide"], reply: "Here is the guide: https://example.com/guide" },
  { keywords: ["template"], reply: "Here is the template: https://example.com/template" },
  { keywords: ["notes"], reply: "Here are the notes: https://example.com/notes" },
];

export function matchRule(message: string): RuleMatch {
  const normalized = message.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((keyword) => new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(normalized))) {
      return { text: rule.reply, matched: true };
    }
  }
  return { text: "", matched: false };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}
