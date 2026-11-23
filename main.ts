import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Candidate words a grandma might text about AI, scored 0-5 on the
// judge's criteria in order: grandma-like, warm/baffled voice, funny,
// tied to AI/robots, fresh yet instantly readable.
const candidates = [
  { word: "robit", scores: [5, 5, 5, 5, 4] },
  { word: "robut", scores: [4, 4, 4, 5, 3] },
  { word: "contraption", scores: [4, 3, 3, 3, 3] },
  { word: "gadget", scores: [3, 2, 2, 3, 2] },
  { word: "doohickey", scores: [4, 4, 3, 1, 3] },
  { word: "thingamajig", scores: [4, 4, 3, 1, 2] },
];

// Plain-JS syntax (valid TypeScript too) so `node --check` and the
// grader's plain `node main.ts` both accept the file as-is.
function total(c) {
  return c.scores.reduce((a, b) => a + b, 0);
}

// Highest total wins; ties break to the shorter word, then alphabetically,
// so the choice is fully deterministic.
const best = [...candidates].sort((a, b) => {
  return total(b) - total(a) || a.word.length - b.word.length
    || a.word.localeCompare(b.word);
})[0];

const word = best.word;
// Fail loudly if the pick ever stops being exactly one word:
// 1-30 chars, no whitespace at all, and no trailing newline is written.
if (!/^\S{1,30}$/.test(word) || Buffer.byteLength(word, "utf8") > 30) {
  throw new Error(`Invalid entry word: ${JSON.stringify(word)}`);
}

const outPath = process.env.OUTPUT_PATH || "/output/entry.txt";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, word, "utf8");
