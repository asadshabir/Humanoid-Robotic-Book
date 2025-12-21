---
id: 2
title: Create Docusaurus Book Plan
stage: plan
date: 2025-12-18
surface: agent
model: Claude Sonnet 4.5
feature: 001-docusaurus-book
branch: 001-docusaurus-book
user: Asad Shabir
command: /sp.plan
labels: [plan,book,docusaurus,robotics,architecture]
links:
  spec: specs/001-docusaurus-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-docusaurus-book/plan.md
  - specs/001-docusaurus-book/research.md
  - specs/001-docusaurus-book/data-model.md
  - specs/001-docusaurus-book/quickstart.md
  - specs/001-docusaurus-book/contracts/content-api.yaml
  - history/prompts/001-docusaurus-book/2-create-docusaurus-book-plan.plan.prompt.md
tests:
---

## Prompt

```
You are operating under Spec-Kit Plus.

Create a **complete technical planning document** for rebuilding the book
"Physical AI & Humanoid Robotics" as a **premium, professional, and stable Docusaurus-based book site**.

This plan must be derived **100% from the business requirements** and the active `/sp.constitution`.

════════════════════════════════════════════════
MANDATORY TECHNICAL REQUIREMENTS (NON-NEGOTIABLE)
════════════════════════════════════════════════

1. **Docusaurus is REQUIRED**
   - The book MUST be implemented using **Docusaurus (latest stable version)**.
   - You MUST consult **official Docusaurus documentation** for:
     - Project structure
     - MDX usage
     - Theming
     - Layout components
     - Navbar / Footer
     - SSR behavior
     - Static asset handling
     - Deployment (GitHub Pages + Vercel compatibility)

2. **Context7 MCP is REQUIRED**
   - You MUST use **Context7 MCP** to retrieve the **most up-to-date Docusaurus documentation**.
   - Do NOT rely on outdated knowledge or assumptions.
   - Any architectural or UI decision must be consistent with the current Docusaurus docs.

3. **Planning Only**
   - This is a **planning phase**, NOT implementation.
   - Do NOT write book content, chapters, or UI code.
   - Focus on architecture, structure, validation, and execution flow.

════════════════════════════════════════════════
PROJECT CONSTRAINTS
════════════════════════════════════════════════

- Modules: **EXACTLY 4 modules**
  1) The Robotic Nervous System (ROS 2)
  2) The Digital Twin (Gazebo & Unity)
  3) The AI-Robot Brain (NVIDIA Isaac)
  4) Vision-Language-Action (VLA) + Capstone

- Goal: **Spec → Build → Test → Deploy**
- Output: **Docusaurus website deployed to GitHub Pages**
- Design priority: **Stability > Performance > UX > Animation**
- GPU constraints must be realistic and documented
- Robotics reproducibility must be explicitly planned

════════════════════════════════════════════════
OUTPUT FORMAT (STRICT)
════════════════════════════════════════════════

Produce **ONE single YAML document** with the following top-level sections
(in this exact order):

1. project_summary
   - 2–3 sentences
   - Explicitly state:
     "Output target: Docusaurus site deployed via GitHub Pages."

2. docusaurus_compliance
   - Docusaurus version strategy (latest stable)
   - Key docs consulted via Context7 MCP
   - SSR constraints and implications
   - MDX usage rules
   - Asset handling rules
   - Navbar / Footer architecture
   - Theme customization boundaries

3. workflow_overview
   - Spec-Kit Plus lifecycle
   - Where specs live
   - Where Docusaurus files live
   - How Claude Code interacts with the repo

4. architecture_sketch
   - Textual diagram describing:
     - Spec artifacts → MDX → Docusaurus build → deployment
     - Simulation artifacts (URDF, Gazebo, Isaac)
   - Explicit SSR safety boundaries

5. module_section_structure
   - 4 modules ONLY
   - 3–5 chapters per module
   - Each chapter includes:
     - Objective
     - Planned artifacts
     - Validation hooks

6. research_approach
   - Research-concurrent workflow
   - Citation logging system
   - Evidence traceability plan

7. quality_validation
   - Acceptance criteria per module
   - Validation checks
   - Tooling and pass/fail rules

8. testing_strategy
   - CI jobs
   - Docusaurus build tests
   - SSR safety tests
   - Robotics smoke tests (CPU vs GPU)

9. decisions_log
   - At least 8 architectural decisions
   - Include:
     - Docusaurus theming approach
     - Animation limits
     - SSR policy
     - Deployment strategy

10. tradeoffs_analysis
    - Simulation vs Real Robots
    - Cloud vs On-Prem
    - Include mitigations

11. milestones_and_timeline
    - 8-week plan
    - Research → Foundation → Analysis → Synthesis

12. outputs_and_next_actions
    - Exact files to be created
    - Exact next Claude commands
    - Docusaurus build + deploy commands

════════════════════════════════════════════════
CRITICAL RULES
════════════════════════════════════════════════

- Explicitly mention **Docusaurus** in:
  - architecture_sketch
  - workflow_overview
  - outputs_and_next_actions
- No speculative APIs
- No unsafe DOM access assumptions
- Plan must prevent SSR crashes by design
- Animations must be optional and non-blocking

════════════════════════════════════════════════
END OF /sp.plan
════════════════════════════════════════════════
```

## Response snapshot

Created a comprehensive technical planning document for the Physical AI & Humanoid Robotics book as a Docusaurus-based site. The plan includes:

- Complete YAML implementation plan with all 12 required sections
- Research document covering Docusaurus technology, SSR safety, and content integration
- Data model defining core entities (Module, Chapter, ContentReference, ReproducibilityArtifact)
- Quickstart guide with setup instructions and development workflow
- Content API contract in OpenAPI format
- All artifacts organized in the specs/001-docusaurus-book/ directory

The plan addresses all constraints including Docusaurus compliance, SSR safety, 4-module structure, GitHub Pages deployment, and constitution principles (Stability First, Academic Integrity, etc.). All content is structured to support the Spec-Kit Plus lifecycle with proper research, validation, and traceability.

## Outcome

- ✅ Impact: Complete technical architecture plan created with all required sections and supporting artifacts
- 🧪 Tests: No automated tests run for this planning phase
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, contracts/content-api.yaml, and PHR record
- 🔁 Next prompts: Ready to proceed with task generation using /sp.tasks
- 🧠 Reflection: Plan comprehensively addresses all requirements with proper Docusaurus compliance and SSR safety measures

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate implementation tasks with /sp.tasks