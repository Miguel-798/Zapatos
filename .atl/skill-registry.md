# Skill Registry

**Orchestrator use only.** Read this registry once per session to resolve skill paths, then pass pre-resolved paths directly to each sub-agent's launch prompt. Sub-agents receive the path and load the skill directly — they do NOT read this registry.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| the user asks to build web components, pages, or applications | frontend-design | file:///C:/Users/Miguel/.config/opencode/skills/frontend-design/SKILL.md |

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| (none found) | | Empty project - no conventions detected |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
