# Codex Masterclass

A content-first static learning guide. Plain HTML/CSS/JavaScript, no build step or runtime dependencies. GitHub Pages hosts the codex/session-outline branch at its root.

## Course structure

The five core topics total 60 minutes: models (12), work organization (10), pet demonstration (20), dots & Space (8), and build/delegate (10). Topic 06 is optional reading, outside that time budget.

- index.html: course map and optional further reading
- models.html: static benchmark comparison, model/effort lookup, costs and recommendations
- workspace.html: projects/chats/folders/repositories/worktrees
- pet.html: prepared prompt and the actual interactive Octopus sprite
- dots-space.html: concise live-session lesson
- dots-space-guide.html: detailed delegation, environment, Pages, sharing, and worked examples
- build-demo.html: personal apps, bounded computer use, and scheduled-task introduction
- scheduled-tasks-guide.html: setup, practical tips, and three copyable English classroom exercises
- further-uses.html: CLI, non-interactive mode, Developer Commands, and Agents API

Shared typography is in styles.css. The reading pages use assets/reading.css. The Octopus demo uses assets/pet-demo.css and assets/pet-demo.js. Preserve the original assets/octopus.webp; it is the user’s actual pet.

## Preview and checks

Run python3 -m http.server 8000 from this directory for a local preview in a browser that permits localhost. The task’s cloud browser may block localhost; verify the actual Pages deployment after authorized publication instead. All links are relative to support the GitHub Pages project path.

Check local links and fragments, one main/h1 per page, duplicate IDs, JavaScript syntax, navigation, lookup output, prompt copy, Pet pointer/keyboard/pause behavior, and reading disclosures. Validate shell example syntax without executing repository-changing examples. Doc-verified commands are teaching examples, not a claim that they ran against a real project. Use the supported browser APIs for visual QA; disclose unverified narrow-viewport checks.

## Sources and publication

Source dates and direct links appear with the relevant lesson. Model data is a dated snapshot, not a guarantee of current pricing or availability. AA broad-intelligence scores are not coding percentages. Benchmark cost, token unit prices, and subscription billing are separate quantities.

Publish only scoped approved changes. Preserve main and the original course repository. Verify the remote commit and compare deployed file bytes with the reviewed local versions; then inspect the actual rendered site and interactive behavior.

## Interactive workbook

All nine pages load assets/workbook.js/css and assets/workbook-tools.js/css. The tools progressively enhance the static reference: routes and locally saved review markers, model comparisons, scenarios, prompt customization, a local card-turn simulation, and CLI exploration. They do not send prompts or create/run agent tasks. Only review markers persist under the site-specific localStorage key; editable prompts remain in page memory.

Keep the original model measurements and prepared prompts as the source of truth. Missing model measurements must remain unmeasured. Exercises are illustrative, with explicit reset and copy behavior. Verify repeated inputs, blank/invalid values, copy races, keyboard focus, and local-storage denial as well as the first successful click.
