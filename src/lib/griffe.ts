export type GriffeExpression =
  | string
  | number
  | boolean
  | null
  | {
      cls?: string;
      name?: string;
      member?: string | null;
      values?: GriffeExpression[];
      left?: GriffeExpression;
      right?: GriffeExpression;
      slice?: GriffeExpression;
      function?: GriffeExpression;
      arguments?: GriffeExpression[];
      body?: GriffeExpression;
      test?: GriffeExpression;
      orelse?: GriffeExpression;
      operator?: string;
    };

export interface GriffeDocstring {
  value: string;
  lineno?: number;
  endlineno?: number;
}

export interface GriffeParameter {
  name: string;
  kind?: string;
  annotation?: GriffeExpression;
  default?: GriffeExpression;
}

export interface GriffeDecorator {
  value?: GriffeExpression;
}

export interface GriffeGitInfo {
  commit_hash?: string;
  remote_url?: string;
  repository?: string;
  service?: string;
}

export interface GriffeMember {
  name?: string;
  kind: string;
  members?: Record<string, GriffeMember>;
  parameters?: GriffeParameter[];
  returns?: GriffeExpression;
  annotation?: GriffeExpression;
  default?: GriffeExpression;
  target_path?: string;
  bases?: GriffeExpression[];
  labels?: string[];
  decorators?: GriffeDecorator[];
  docstring?: GriffeDocstring | null;
  filepath?: string;
  lineno?: number;
  endlineno?: number;
  inherited?: boolean;
  runtime?: boolean;
  analysis?: string;
  git_info?: GriffeGitInfo;
  [key: string]: unknown;
}

export interface GriffeParagraphBlock {
  type: "paragraph";
  content: string;
}

export interface GriffeCodeBlock {
  type: "code";
  language: string;
  content: string;
}

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

export interface GriffeReferenceIndex {
  refs: Record<string, string>;
}

export type GriffeDocBlock = GriffeParagraphBlock | GriffeCodeBlock;
export type GriffeDump = Record<string, GriffeMember>;

const KIND_ORDER: Record<string, number> = {
  module: 0,
  class: 1,
  function: 2,
  attribute: 3,
  alias: 4,
};

const ALLOWED_DUNDER_NAMES = new Set([
  "__init__",
  "__new__",
  "__iter__",
  "__call__",
  "__await__",
  "__enter__",
  "__exit__",
  "__aenter__",
  "__aexit__",
  "__version__",
]);

const PYTHON_KEYWORDS = new Set([
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "False",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "None",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "True",
  "try",
  "while",
  "with",
  "yield",
]);

const PYTHON_BUILTINS = new Set([
  "Any",
  "Awaitable",
  "bool",
  "ClassVar",
  "dict",
  "float",
  "int",
  "list",
  "Never",
  "None",
  "set",
  "str",
  "Task",
  "tuple",
  "TypeVar",
]);

type TokenType =
  | "whitespace"
  | "comment"
  | "string"
  | "number"
  | "decorator"
  | "identifier"
  | "operator"
  | "punctuation"
  | "other";

interface CodeToken {
  text: string;
  type: TokenType;
}

function normalizeLiteral(value: string): string {
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatExpression(expression: GriffeExpression): string {
  if (expression === null || expression === undefined) return "";
  if (typeof expression === "string") return normalizeLiteral(expression);
  if (typeof expression === "number" || typeof expression === "boolean") {
    return String(expression);
  }

  const cls = expression.cls;

  switch (cls) {
    case "ExprName":
      return expression.name ?? "";
    case "ExprAttribute":
      return (expression.values ?? []).map(formatExpression).join(".");
    case "ExprSubscript":
      return `${formatExpression(expression.left ?? null)}[${formatExpression(expression.slice ?? null)}]`;
    case "ExprBinOp":
      return `${formatExpression(expression.left ?? null)} ${expression.operator ?? ""} ${formatExpression(expression.right ?? null)}`.trim();
    case "ExprCall": {
      const args = (expression.arguments ?? []).map(formatExpression).join(", ");
      return `${formatExpression(expression.function ?? null)}(${args})`;
    }
    case "ExprIfExp":
      return `${formatExpression(expression.body ?? null)} if ${formatExpression(expression.test ?? null)} else ${formatExpression(expression.orelse ?? null)}`;
    default:
      if (expression.name) return expression.name;
      return JSON.stringify(expression);
  }
}

export function formatParameter(parameter: GriffeParameter): string {
  const annotation = parameter.annotation
    ? `: ${formatExpression(parameter.annotation)}`
    : "";
  const defaultValue =
    parameter.default !== undefined && parameter.default !== null
      ? ` = ${formatExpression(parameter.default)}`
      : "";

  return `${parameter.name}${annotation}${defaultValue}`;
}

export function formatSignature(
  name: string,
  member: GriffeMember,
  { omitReceiver = false }: { omitReceiver?: boolean } = {},
): string | null {
  switch (member.kind) {
    case "module":
      return `module ${name}`;
    case "class": {
      const bases = member.bases?.length
        ? `(${member.bases.map(formatExpression).join(", ")})`
        : "";
      return `class ${name}${bases}`;
    }
    case "function": {
      const parameters = omitReceiver
        ? (member.parameters ?? []).filter(
            (parameter, index) =>
              !(index === 0 && (parameter.name === "self" || parameter.name === "cls")),
          )
        : (member.parameters ?? []);
      const renderedParameters = parameters.map(formatParameter).join(", ");
      const returns = member.returns
        ? ` -> ${formatExpression(member.returns)}`
        : "";
      return `${name}(${renderedParameters})${returns}`;
    }
    case "attribute": {
      const annotation = member.annotation
        ? `: ${formatExpression(member.annotation)}`
        : "";
      const defaultValue =
        member.default !== undefined && member.default !== null
          ? ` = ${formatExpression(member.default)}`
          : "";
      return `${name}${annotation}${defaultValue}`;
    }
    case "alias":
      return member.target_path ? `${name} = ${member.target_path}` : name;
    default:
      return null;
  }
}

export function parseDocstring(input?: string | null): GriffeDocBlock[] {
  if (!input?.trim()) return [];

  const blocks: GriffeDocBlock[] = [];
  const fencePattern = /```([^\n]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;

  for (const match of input.matchAll(fencePattern)) {
    const [fullMatch, language = "", code = ""] = match;
    const start = match.index ?? 0;
    const textBefore = input.slice(lastIndex, start);

    for (const paragraph of textBefore.split(/\n\s*\n/g)) {
      if (paragraph.trim()) {
        blocks.push({ type: "paragraph", content: paragraph.trim() });
      }
    }

    blocks.push({
      type: "code",
      language: language.trim(),
      content: code.replace(/\n$/, ""),
    });

    lastIndex = start + fullMatch.length;
  }

  const trailingText = input.slice(lastIndex);
  for (const paragraph of trailingText.split(/\n\s*\n/g)) {
    if (paragraph.trim()) {
      blocks.push({ type: "paragraph", content: paragraph.trim() });
    }
  }

  return blocks;
}

function getReferenceCandidates(reference: string): string[] {
  const cleaned = reference.trim().replace(/\(\)$/, "");
  if (!cleaned) return [];

  const parts = cleaned.split(".");
  const candidates = [cleaned];

  for (let i = 1; i < parts.length; i += 1) {
    candidates.push(parts.slice(i).join("."));
  }

  return [...new Set(candidates)];
}

export function resolveReferenceHref(
  reference: string,
  index?: GriffeReferenceIndex,
): string | null {
  if (!index) return null;

  for (const candidate of getReferenceCandidates(reference)) {
    const href = index.refs[candidate];
    if (href) return href;
  }

  return null;
}

function remarkVeniceReferences(index?: GriffeReferenceIndex) {
  return () => (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === "inlineCode") {
        const href = resolveReferenceHref(node.value, index);
        if (href) {
          node.type = "link";
          node.url = href;
          node.title = null;
          node.children = [{ type: "text", value: node.value }];
          node.data = {
            hName: "a",
            hProperties: { className: ["rf-inline-code", "rf-inline-code--link"] },
          };
        } else {
          node.data = {
            hName: "code",
            hProperties: { className: ["rf-inline-code"] },
          };
        }
      }

      if (node.type === "code") {
        const html = `<div class=\"my-3.5 overflow-hidden rounded-md border border-[#e1e4e8] bg-transparent\"><pre class=\"m-0 overflow-x-auto whitespace-pre px-[1.125rem] py-4 font-mono text-sm leading-6 text-[#24292e]\"><code>${renderCodeHtml(node.value, node.lang || "python")}</code></pre></div>`;
        node.type = "html";
        node.value = html;
      }
    });
  };
}

export async function renderDocMarkdownHtml(
  input: string,
  index?: GriffeReferenceIndex,
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkVeniceReferences(index))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(input);

  return String(file);
}

function tokenizeCode(input: string): CodeToken[] {
  const parts = input.match(
    /#[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|@[A-Za-z_][A-Za-z0-9_.]*|==|!=|<=|>=|->|:=|\*\*|\/\/|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|[][(){}.,:;]|[-+*/%<>|&^~=]|./g,
  );

  return (parts ?? []).map((text) => {
    if (/^\s+$/.test(text)) return { text, type: "whitespace" };
    if (text.startsWith("#")) return { text, type: "comment" };
    if (text.startsWith('"') || text.startsWith("'")) {
      return { text, type: "string" };
    }
    if (/^\d/.test(text)) return { text, type: "number" };
    if (text.startsWith("@")) return { text, type: "decorator" };
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(text)) {
      return { text, type: "identifier" };
    }
    if (/^[][(){}.,:;]$/.test(text)) return { text, type: "punctuation" };
    if (/^(==|!=|<=|>=|->|:=|\*\*|\/\/|[-+*/%<>|&^~=])$/.test(text)) {
      return { text, type: "operator" };
    }
    return { text, type: "other" };
  });
}

function getPreviousMeaningfulToken(tokens: CodeToken[], index: number): CodeToken | null {
  for (let i = index - 1; i >= 0; i -= 1) {
    if (tokens[i]?.type !== "whitespace") return tokens[i] ?? null;
  }

  return null;
}

function getTokenClass(tokens: CodeToken[], index: number): string | null {
  const token = tokens[index];
  if (!token) return null;

  switch (token.type) {
    case "comment":
      return "rf-token-comment";
    case "string":
      return "rf-token-string";
    case "number":
      return "rf-token-number";
    case "decorator":
      return "rf-token-decorator";
    case "operator":
      return "rf-token-operator";
    case "punctuation":
      return null;
    case "identifier": {
      if (PYTHON_KEYWORDS.has(token.text)) return "rf-token-keyword";

      const previous = getPreviousMeaningfulToken(tokens, index);

      if (previous?.text === "def") return "rf-token-function";
      if (PYTHON_BUILTINS.has(token.text) || /^[A-Z][A-Za-z0-9_]*$/.test(token.text)) {
        return "rf-token-type";
      }
      return null;
    }
    default:
      return null;
  }
}

export function renderCodeHtml(input: string, _language = "python"): string {
  const tokens = tokenizeCode(input);

  return tokens
    .map((token, index) => {
      const tokenClass = getTokenClass(tokens, index);
      const escaped = escapeHtml(token.text);
      if (!tokenClass) return escaped;
      return `<span class=\"${tokenClass}\">${escaped}</span>`;
    })
    .join("");
}

function isTypingAlias(member: GriffeMember): boolean {
  if (!member.target_path) return false;

  return /^(typing|__future__|importlib)(\.|$)/.test(member.target_path);
}

export function isVisibleMember(name: string, member: GriffeMember): boolean {
  if (member.inherited) return false;
  if (member.runtime === false) return false;

  if (name.startsWith("__") && !ALLOWED_DUNDER_NAMES.has(name)) {
    return false;
  }

  if (name.startsWith("_") && !name.startsWith("__")) {
    return false;
  }

  if (member.kind === "alias" && isTypingAlias(member)) {
    return false;
  }

  return true;
}

export function getVisibleMembers(
  members: Record<string, GriffeMember> | undefined,
): Array<[string, GriffeMember]> {
  if (!members) return [];

  return Object.entries(members)
    .filter(([name, member]) => isVisibleMember(name, member))
    .sort(([leftName, leftMember], [rightName, rightMember]) => {
      const leftOrder = KIND_ORDER[leftMember.kind] ?? 99;
      const rightOrder = KIND_ORDER[rightMember.kind] ?? 99;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return leftName.localeCompare(rightName);
    });
}

export function getMemberId(path: string[]): string {
  return path.join(".");
}

function collectVisiblePaths(
  path: string[],
  member: GriffeMember,
  output: string[][],
): void {
  output.push(path);
  for (const [childName, childMember] of getVisibleMembers(member.members)) {
    collectVisiblePaths([...path, childName], childMember, output);
  }
}

export function buildReferenceIndex(dump: GriffeDump): GriffeReferenceIndex {
  const refs: Record<string, string> = {};
  const suffixCounts = new Map<string, number>();
  const allPaths: string[][] = [];

  for (const [moduleName, module] of Object.entries(dump)) {
    collectVisiblePaths([moduleName], module, allPaths);
  }

  for (const path of allPaths) {
    const localPath = path.slice(1);
    for (let i = 0; i < localPath.length; i += 1) {
      const suffix = localPath.slice(i).join(".");
      suffixCounts.set(suffix, (suffixCounts.get(suffix) ?? 0) + 1);
    }
  }

  for (const path of allPaths) {
    const href = `#${getMemberId(path)}`;
    refs[path.join(".")] = href;

    const localPath = path.slice(1);
    if (localPath.length > 0) {
      refs[localPath.join(".")] = href;
    }

    for (let i = 0; i < localPath.length; i += 1) {
      const suffix = localPath.slice(i).join(".");
      if ((suffixCounts.get(suffix) ?? 0) === 1) {
        refs[suffix] = href;
      }
    }
  }

  return { refs };
}

export function formatLocation(member: GriffeMember): string | null {
  if (!member.filepath) return null;
  if (!member.lineno) return member.filepath;
  if (!member.endlineno || member.endlineno === member.lineno) {
    return `${member.filepath}:${member.lineno}`;
  }

  return `${member.filepath}:${member.lineno}-${member.endlineno}`;
}

function normalizeRemoteUrl(url: string): string {
  if (url.startsWith("git@github.com:")) {
    return `https://github.com/${url.slice("git@github.com:".length)}`.replace(/\.git$/, "");
  }

  return url.replace(/\.git$/, "");
}

export function getSourceUrl(member: GriffeMember, root: GriffeMember): string | null {
  const gitInfo = root.git_info;
  if (!gitInfo?.remote_url || !gitInfo.commit_hash || !gitInfo.repository || !member.filepath) {
    return null;
  }

  const normalizedRepository = gitInfo.repository.endsWith("/")
    ? gitInfo.repository.slice(0, -1)
    : gitInfo.repository;
  if (!member.filepath.startsWith(normalizedRepository)) return null;

  const relativePath = member.filepath
    .slice(normalizedRepository.length + 1)
    .replaceAll("\\", "/");
  const lineFragment = member.lineno
    ? member.endlineno && member.endlineno !== member.lineno
      ? `#L${member.lineno}-L${member.endlineno}`
      : `#L${member.lineno}`
    : "";

  return `${normalizeRemoteUrl(gitInfo.remote_url)}/blob/${gitInfo.commit_hash}/${relativePath}${lineFragment}`;
}
