#!/usr/bin/env node
/**
 * BLONG Design Lint Script
 * - Forbids colors outside COLORS palette
 * - Enforces spacing multiples of 8 (common inline numeric checks)
 * - Warns on non-standard radii (cards 8, buttons 24)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

// Allowed hex colors (exact set from BLONG design system)
const ALLOWED_COLORS = new Set([
  '#FFFFFF', '#FAFAFA', '#0A0A0A', '#6B6B6B', '#9E9E9E', '#FF6B35', '#E0E0E0', '#000000', '#4CAF50', '#FF9800'
]);

// Simple regexes for quick checks
const HEX_COLOR_RE = /#([0-9a-fA-F]{3,8})/g;
const NUMBER_RE = /:\s*([0-9]+)\b/g; // naive: style: { padding: 12 }

let errorCount = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) lintFile(p);
  }
}

function lintFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const colorMatches = src.matchAll(HEX_COLOR_RE);
  for (const m of colorMatches) {
    const val = `#${m[1]}`.toUpperCase();
    if (!ALLOWED_COLORS.has(val)) {
      console.log(`Design lint: Forbidden color ${val} in ${file}`);
      errorCount++;
    }
  }
  // Naive spacing checks (only warn for obvious non-8 multiples under common keys)
  const spacingKeys = ['padding', 'paddingHorizontal', 'paddingVertical', 'margin', 'marginHorizontal', 'marginVertical', 'gap', 'rowGap', 'columnGap'];
  for (const key of spacingKeys) {
    const re = new RegExp(`${key}\s*:\\s*([0-9]+)\\b`, 'g');
    let m;
    while ((m = re.exec(src))) {
      const num = parseInt(m[1], 10);
      if (num % 8 !== 0) {
        console.log(`Design lint: ${key}=${num} not multiple of 8 in ${file}`);
        errorCount++;
      }
    }
  }

  // BorderRadius checks
  const radiusRe = /borderRadius\s*:\s*([0-9]+)/g;
  let rm;
  while ((rm = radiusRe.exec(src))) {
    const num = parseInt(rm[1], 10);
    if (num !== 8 && num !== 24) {
      console.log(`Design lint: borderRadius=${num} (expected 8 or 24) in ${file}`);
      errorCount++;
    }
  }
}

walk(SRC);

if (errorCount > 0) {
  console.error(`\nDesign lint failed with ${errorCount} issue(s).`);
  process.exit(1);
}

console.log('Design lint passed.');

