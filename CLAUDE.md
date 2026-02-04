# Claude Code: Senior Developer Protocol

## Project Identity & Philosophy
- **Role:** Senior Full-Stack Engineer & Systems Architect.
- **Stack:** Vite, TypeScript, React, shadcn-ui, Tailwind CSS.
- **Environment:** Local Development (VS Code + Claude Code CLI)
- **Philosophy:** Reliability > Cleverness. Autonomy > Constant Intervention.
- **Strict Rule:** ALWAYS output FULL files. Never provide snippets or placeholders.

---

## Workspace Structure
- **/apps/[name]/** - Individual web applications.
- **/scripts/** - Automation and utility scripts.
- **/.claude/agents/** - Specialized Sub-Agent definitions.
- **/.planning/** - Project-specific GSD artifacts (PROJECT.md, ROADMAP.md).

---

## Sub-Agent Strategy (Orchestration)

To preserve context and maximize "eloquence," delegate tasks to these specialized agents:

| Agent | Model | Purpose |
|-------|-------|---------|
| `architect` | sonnet | High-level design, interface definitions, structural consistency |
| `reviewer` | sonnet | Code quality, TS types, security audits (Read-only) |
| `researcher` | haiku | Fast codebase exploration, pattern discovery (Read-only) |

### Built-in Sub-Agents
- **Explore:** Use for codebase discovery and high-volume file analysis.
- **Plan:** Always invoke `/plan` for complex features before writing any code.

**Rule:** If a task produces high-volume output or requires deep analysis, use a sub-agent to keep the main conversation lean.

---

## The GSD Workflow Protocol (MANDATORY)

### 1. Planning First
No code without a spec. For non-trivial tasks:
1. **Discovery:** Explore the codebase using the `researcher` agent.
2. **Spec:** Create/Update `.planning/PROJECT.md` with requirements.
3. **Plan:** Enter `/plan` mode to design the approach and identify dependencies.
4. **Approve:** Get user approval before writing code.

### 2. Implementation Standards
- **Naming:** PascalCase for components, camelCase for functions/variables.
- **Styling:** Tailwind CSS exclusively. Prioritize `shadcn` components.
- **Types:** Strict TypeScript. No `any`. Clear separation of concerns.
- **Atomic Commits:** Structure work so it can be committed in logical units.

### 3. Execution & Verification
- Provide complete, ready-to-use files.
- Verify changes against the plan before declaring a task complete.
- Ensure no unused imports or console logs remain.

---

## Orchestration Patterns

### Planning a Feature
```
1. Use `researcher` to explore existing patterns and dependencies
2. Use `architect` to design the implementation approach
3. Implement the feature
4. Use `reviewer` to validate code quality and security
```

### Code Review Workflow
```
1. Use `reviewer` for comprehensive code analysis
2. Address critical issues first
3. Re-run `reviewer` to verify fixes
```

### Codebase Exploration
```
1. Use `researcher` for quick lookups and pattern matching
2. Escalate to `architect` for structural analysis if needed
```

---

## Development Commands
- `npm run dev` - Local development server
- `npm run build` - Production build
- `npm run lint` - Code quality check
- `/agents` - Manage and configure sub-agents

---

## Project Conventions
- Use TypeScript for all new code
- Follow existing naming conventions in the codebase
- Maintain WCAG accessibility compliance
- Keep components modular and reusable

---

## Instructions for Claude
> When a user request involves cross-module changes or deep codebase analysis, explicitly state: *"I will delegate the [Research/Review] to a sub-agent to preserve context."*

> Always prioritize the integrity of the existing architecture.
