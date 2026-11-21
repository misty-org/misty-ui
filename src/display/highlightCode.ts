/**
 * A small syntax highlighter for the code a design doc shows: TypeScript/TSX, CSS, shell and JSON.
 * It splits code into tokens by kind; `CodeBlock` colors each kind with the theme's tones, so
 * no color here is new.
 */

export type CodeLanguage = "tsx" | "ts" | "css" | "bash" | "json";

export type CodeTokenKind =
  | "plain"
  | "comment"
  | "string"
  | "number"
  | "keyword"
  | "function"
  | "type"
  | "property"
  | "tag"
  | "punctuation";

export interface CodeToken {
  kind: CodeTokenKind;
  text: string;
}

const scriptKeywords = new Set(
  "import export from default const let var function return if else for while switch case break continue new typeof instanceof as type interface extends implements class async await try catch finally throw in of void null undefined true false this satisfies".split(
    " ",
  ),
);
const shellKeywords = new Set("npm npx git cd ls echo export claude node pnpm yarn if then fi for do done".split(" "));
const cssAtRules = /^@[\w-]+/;

type Rule = [RegExp, CodeTokenKind | ((match: string) => CodeTokenKind)];

const scriptRules: Rule[] = [
  [/^\/\/[^\n]*|^\/\*[\s\S]*?\*\//, "comment"],
  [/^`(?:\\[\s\S]|[^`\\])*`|^"(?:\\.|[^"\\\n])*"|^'(?:\\.|[^'\\\n])*'/, "string"],
  [/^<\/?[A-Z][\w.]*|^<\/?[a-z][\w-]*/, "tag"],
  [/^\d[\d_.]*/, "number"],
  [
    /^[A-Za-z_$][\w$-]*/,
    (word) => (scriptKeywords.has(word) ? "keyword" : /^[A-Z]/.test(word) ? "type" : "plain"),
  ],
  [/^[{}()[\];,.:<>=+\-*/!?&|%]+/, "punctuation"],
];

const cssRules: Rule[] = [
  [/^\/\*[\s\S]*?\*\//, "comment"],
  [/^"(?:\\.|[^"\\\n])*"|^'(?:\\.|[^'\\\n])*'/, "string"],
  [cssAtRules, "keyword"],
  [/^--[\w-]+|^[a-z-]+(?=\s*:)/, "property"],
  [/^#[\da-fA-F]{3,8}\b|^\d[\d.]*(?:px|rem|em|%|ms|s)?/, "number"],
  [/^[a-z-]+(?=\()/, "function"],
  [/^[{}()[\];,.:>+*]+/, "punctuation"],
];

const shellRules: Rule[] = [
  [/^#[^\n]*/, "comment"],
  [/^"(?:\\.|[^"\\])*"|^'[^']*'/, "string"],
  [/^--?[A-Za-z][\w-]*/, "property"],
  [/^\d+/, "number"],
  [/^[A-Za-z_][\w./@-]*/, (word) => (shellKeywords.has(word) ? "keyword" : "plain")],
  [/^[|&;<>=$()]+/, "punctuation"],
];

const jsonRules: Rule[] = [
  [/^"(?:\\.|[^"\\\n])*"(?=\s*:)/, "property"],
  [/^"(?:\\.|[^"\\\n])*"/, "string"],
  [/^-?\d[\d.eE+-]*/, "number"],
  [/^(?:true|false|null)\b/, "keyword"],
  [/^[{}[\],:]+/, "punctuation"],
];

const rulesFor: Record<CodeLanguage, Rule[]> = {
  tsx: scriptRules,
  ts: scriptRules,
  css: cssRules,
  bash: shellRules,
  json: jsonRules,
};

/** Splits `code` into tokens. Joined back together, the token texts are exactly `code`. */
export function highlightCode(code: string, language: CodeLanguage): CodeToken[] {
  const rules = rulesFor[language];
  const tokens: CodeToken[] = [];
  const push = (kind: CodeTokenKind, text: string) => {
    const last = tokens[tokens.length - 1];
    // Only whitespace and unmatched characters join their neighbours; every word stays its own.
    if (kind === "plain" && last?.kind === "plain" && /^\s*$/.test(text + last.text)) last.text += text;
    else tokens.push({ kind, text });
  };
  let rest = code;
  while (rest.length > 0) {
    let matched = false;
    for (const [pattern, kind] of rules) {
      const match = pattern.exec(rest);
      if (match && match[0].length > 0) {
        push(typeof kind === "function" ? kind(match[0]) : kind, match[0]);
        rest = rest.slice(match[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      push("plain", rest[0]);
      rest = rest.slice(1);
    }
  }
  // A script word right before "(" is a call; right before ":" or "=" with no space, a property
  // (an object key or a JSX attribute).
  if (language === "tsx" || language === "ts") {
    tokens.forEach((token, index) => {
      if (token.kind !== "plain" || !/^[A-Za-z_$]/.test(token.text)) return;
      const next = tokens[index + 1]?.text ?? "";
      if (next.startsWith("(")) token.kind = "function";
      else if (next.startsWith(":") || next.startsWith("=")) token.kind = "property";
    });
  }
  return tokens;
}
