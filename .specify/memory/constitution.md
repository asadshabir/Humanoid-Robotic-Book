# Physical AI & Humanoid Robotics — Premium Spec-Driven Technical Book Constitution
<!-- Sync Impact Report:
Version change: N/A (initial creation) → 1.0.0
Modified principles: N/A
Added sections: Core Principles (Stability First, Academic Integrity, Premium UX, Spec Discipline), Standards and Requirements, Development Workflow, Governance
Removed sections: N/A
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/phr-template.prompt.md ⚠ pending
Follow-up TODOs: None
-->

## Core Principles

### Stability First
No UI or animation may compromise runtime stability. No direct DOM access without browser safety guards. Animations must be progressive-enhancement, not required for functionality.

### Academic Integrity
All technical claims must be verifiable. Citations are mandatory for non-trivial claims. Writing style: textbook-grade, not blog-style.

### Premium UX (Controlled)
Professional color system (limited palette, high contrast). Motion is subtle, purposeful, and optional. No gimmicks, no distracting effects.

### Spec Discipline
Every change must originate from a spec. No direct implementation without tasks. History and decisions are preserved.

### Standards and Requirements
Citation style: APA 7. Peer-reviewed ratio: ≥50%. Minimum sources: 20. Chapter length: 1,000–1,400 words. Total book size: 6,000–8,000 words. Accessibility: WCAG AA minimum. Animations: must degrade gracefully.

### Deliverables and Success Criteria
Deliverables: Stable Docusaurus site (GitHub Pages compatible), Clean PDF export, spec/ directory (constitution, specs, plans, tasks, ADRs), history/ with prompt evolution, assets/ (SVGs, diagrams, lightweight animations only). Success Criteria: Zero runtime crashes (SSR + client), Lighthouse accessibility score ≥90, All specs traceable to tasks and commits.

## Target Audience

Target Audience: Graduate students (Robotics, AI, CS), Robotics engineers and researchers, AI practitioners transitioning into Physical AI.

## Development Workflow

Development Workflow: Use Spec-Kit Plus to ensure traceability, reproducibility, and long-term maintainability. Mission: Produce a premium, academically credible, and industry-aligned technical book. The book must look, feel, and behave like a professional publication (not a demo). Deliver a stable, elegant Docusaurus website with refined animations and visual polish.

## Governance

The constitution supersedes all other practices. All development must adhere to the four core principles: Stability First, Academic Integrity, Premium UX (Controlled), and Spec Discipline. Amendments require documentation, approval, and migration plan when necessary. All PRs/reviews must verify compliance with these principles. Complexity must be justified with clear benefits that outweigh added maintenance costs.

**Version**: 1.0.0 | **Ratified**: 2025-12-18 | **Last Amended**: 2025-12-18
