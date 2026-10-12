#!/usr/bin/env node
// SessionStart hook: surface dev-workflow features that are waiting for review, blocked or in progress.
// Reads docs/superpowers/runs/*/status.json in the project. Prints nothing when there is nothing to report.
// Every error is swallowed (exit 0) so the session is never disturbed.
"use strict";
const fs = require("fs");
const path = require("path");

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function main() {
  const input = readStdin();
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const runsDir = path.join(root, "docs", "superpowers", "runs");
  if (!fs.existsSync(runsDir)) return;

  const items = [];
  for (const slug of fs.readdirSync(runsDir)) {
    const file = path.join(runsDir, slug, "status.json");
    if (!fs.existsSync(file)) continue;
    try {
      const s = JSON.parse(fs.readFileSync(file, "utf8"));
      if (s.status && s.status !== "done") items.push({ slug, ...s });
    } catch {
      // malformed status.json: skip it, /dev-workflow:status reports details
    }
  }
  if (!items.length) return;

  const order = { blocked: 0, waiting_review: 1, in_progress: 2, todo: 3 };
  items.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));

  const label = { blocked: "blocked", waiting_review: "waiting for review", in_progress: "in progress", todo: "not started" };
  const line = (s) =>
    `- ${s.title || s.slug} [${s.slug}] · ${s.phase || "?"} · ${label[s.status] || s.status}` +
    (s.status === "blocked" && s.blockedReason ? ` · ${s.blockedReason}` : "") +
    (s.summary ? ` · ${s.summary}` : "");

  const attention = items.filter((s) => s.status === "blocked" || s.status === "waiting_review");
  const out = {
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext:
        "dev-workflow: unfinished features in this repo (from docs/superpowers/runs/*/status.json):\n" +
        items.map(line).join("\n") +
        "\nIf the user wants to continue one of them, use the dev-workflow:run skill and read its status.json first. Reply in the user's language.",
    },
  };
  if (attention.length) {
    out.systemMessage =
      `dev-workflow: ${attention.length} feature(s) need you: ` +
      attention.map((s) => `${s.slug} (${label[s.status]})`).join(", ") +
      ". Run /dev-workflow:status for details.";
  }
  process.stdout.write(JSON.stringify(out));
}

try {
  main();
} catch {
  // stay silent
}
process.exit(0);
