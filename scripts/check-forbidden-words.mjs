#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const ROOT = resolve(process.cwd())

const FORBIDDEN_WORDS = [
  'leverage',
  'seamless',
  'robust',
  'comprehensive',
  'holistic',
  'synergy',
  'delve',
  'spearhead',
  'passionate',
  'thrilled',
  'results-driven',
  'cutting-edge',
  'world-class',
  'game-changer',
  'rockstar',
  'ninja',
  'guru',
  'transformative',
  'revolutionary',
  'supercharge',
  'unlock',
  'empower',
  'elevate',
  'force multiplier',
]

const FORBIDDEN_PHRASES = [
  'excited about',
  'hope this email finds you well',
  'looking forward to hearing from you',
  'thank you for your time and consideration',
  "I'm a quick learner",
  "I'm a team player",
  'wear many hats',
  'go above and beyond',
  'passionate about',
  'love what I do',
]

const FORBIDDEN_DASHES = {
  '—': 'em-dash',
  '–': 'en-dash',
  '‒': 'figure-dash',
  '―': 'horizontal-bar',
}

const SCAN_DIRS = ['src', '.next/server/app']
const TARGET_EXTS = new Set(['.ts', '.tsx', '.md', '.mdx'])
const DASH_EXTS = new Set(['.tsx', '.md', '.mdx'])
const SKIP_DIRS = new Set(['node_modules', '.git', '.next/cache', 'dist', 'out', 'build'])

const ALLOW_LINE_MARKER = '// allow-forbidden'

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    const rel = relative(ROOT, full).replaceAll('\\', '/')
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SKIP_DIRS.has(rel)) continue
      walk(full, out)
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase()
      if (TARGET_EXTS.has(ext)) out.push(full)
    }
  }
  return out
}

function stripCodeFences(content) {
  return content.replace(/```[\s\S]*?```/g, (m) => '\n'.repeat((m.match(/\n/g) || []).length))
}

function scanFile(file) {
  const issues = []
  const ext = extname(file).toLowerCase()
  const raw = readFileSync(file, 'utf8')
  const isMarkdown = ext === '.md' || ext === '.mdx'
  const content = isMarkdown ? stripCodeFences(raw) : raw
  const lines = content.split(/\r?\n/)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line || line.includes(ALLOW_LINE_MARKER)) continue
    const lineNum = i + 1

    for (const word of FORBIDDEN_WORDS) {
      const escaped = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      const re = new RegExp(`\\b${escaped}\\b`, 'i')
      const match = re.exec(line)
      if (match) {
        issues.push({ file, lineNum, col: match.index + 1, kind: 'word', value: match[0] })
      }
    }

    for (const phrase of FORBIDDEN_PHRASES) {
      const escaped = phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      const re = new RegExp(escaped, 'i')
      const match = re.exec(line)
      if (match) {
        issues.push({ file, lineNum, col: match.index + 1, kind: 'phrase', value: match[0] })
      }
    }

    if (DASH_EXTS.has(ext)) {
      for (let j = 0; j < line.length; j++) {
        const ch = line[j]
        if (FORBIDDEN_DASHES[ch]) {
          issues.push({
            file,
            lineNum,
            col: j + 1,
            kind: 'dash',
            value: `${ch} (${FORBIDDEN_DASHES[ch]})`,
          })
        }
      }
    }
  }
  return issues
}

const files = []
for (const dir of SCAN_DIRS) {
  const full = join(ROOT, dir)
  try {
    if (statSync(full).isDirectory()) walk(full, files)
  } catch {
    // dir does not exist (e.g. .next not built yet) — skip silently
  }
}

let total = 0
for (const file of files) {
  const issues = scanFile(file)
  if (issues.length === 0) continue
  for (const issue of issues) {
    const relPath = relative(ROOT, issue.file).replaceAll('\\', '/')
    console.error(
      `${relPath}:${issue.lineNum}:${issue.col} forbidden ${issue.kind}: "${issue.value}"`,
    )
    total++
  }
}

if (total > 0) {
  console.error(`\n${total} forbidden term${total === 1 ? '' : 's'} found.`)
  console.error('Rewrite the offending lines, or append "// allow-forbidden" to allow a line.')
  process.exit(1)
} else {
  console.log('Forbidden-words check passed.')
}
