# FMD pointer

This project uses **Foundational Matrix Documents (FMD)** via a zero-footprint pointer. Do not duplicate FMD rules here. Follow the pinned engine.

**Pinned engine:** FMD v3.0.1

## How to operate FMD in this repo

1. **Session start:** Follow the FMD v3.0.1 operating guide for routing, trigger phrases, file naming, and workflow. This pointer defers to it entirely.

2. **Routing surface:** Use the FMD v3.0.1 trigger matrix when you need to map a request to an artifact. It holds the signal register and every artifact's trigger and non-trigger conditions.

3. **Templates on demand:** When a trigger fires, use the FMD v3.0.1 template for that artifact. Read the `> **Agent Instructions**` blockquote first.

4. **Guides on demand:** Detailed reference (orchestrator, milestones, context, knowledge, agents, frameworks, business development, engineering ladder, public surfaces, workflows) is in the FMD v3.0.1 guides. Read only the guide the current task needs. Do not preload the set.

5. **Validation:** After generating docs, run the FMD v3.0.1 validator against `docs/`. Add `--strict` for CI-grade checks.

6. **Cockpit (visual progress):** Regenerate only on cockpit trigger or explicit request. This writes `cockpit.html` at the project root (it is listed in `.gitignore`; it is a generated artifact).

7. **Generated output:** Save filled artifacts to `docs/{{type}}-{{slug}}.md` per FMD v3.0.1. Keep the operating position in `docs/state.md` by hand. After each artifact write or gate, update `docs/index.md` (stamped "Built on FMD v3.0.1") and append to `docs/log-{{slug}}.md`.

## Reference-only (never auto-load into build context)

`examples/`, `Playbook.md`, `CHANGELOG.md`, and `benchmarks/` stay with the engine. They are not part of this repo.

This public tree records the engine as plain text: FMD v3.0.1. It does not include an engine clone URL or a local engine path.
