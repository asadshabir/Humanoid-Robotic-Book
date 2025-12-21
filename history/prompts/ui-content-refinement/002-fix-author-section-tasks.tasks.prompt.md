---
id: 002
title: fix-author-section-tasks
stage: tasks
date: 2025-12-19
surface: agent
model: Claude Sonnet 4.5
feature: ui-content-refinement
branch: 001-ui-content-refinement
user: Claude Code
command: /sp.tasks
labels: ["tasks", "author-section", "ui-ux", "content-update"]
links:
  spec: specs/003-ui-content-refinement/spec.md
  tasks: specs/003-ui-content-refinement/tasks.md
files: ["src/components/Homepage/AuthorSection.tsx", "src/pages/index.module.css", "README.md"]
tests: []
outcome: Tasks generated for fixing About the Author section with accurate content and proper styling
evaluation: Tasks organized by user story for independent implementation and testing
---

# Prompt History Record: Fix About the Author Section Tasks

## PROMPT_TEXT

### Task: Fix "About the Author" Section Content & UI

Replace the existing incorrect author information with the following **accurate, professional, and customized content**.

---

## Author Name
**Asad Shabir**

## Author Bio (Rewrite Professionally)

Asad Shabir is a certified **AI & Automation Engineer** and **Python Developer** based in Karachi, Pakistan. With over three years of hands-on coding experience, he specializes in building intelligent, scalable systems using modern AI and automation technologies.

His work focuses on practical AI applications, automation workflows, and intelligent assistants that solve real-world problems. He actively builds AI agents, automation pipelines, and custom chatbots for productivity, research, and business use cases.

---

## Core Expertise (Display as Animated Cards)

### AI Agent Development
Designing and deploying intelligent AI-powered agents using OpenAI Agents SDK and MCP-based architectures for research, automation, and knowledge retrieval.

### Workflow Automation
Building end-to-end automation workflows using **n8n** to eliminate repetitive tasks, optimize operations, and increase efficiency.

### Custom Chatbots
Developing tailored chatbots for customer support, lead generation, and multi-channel communication including Email and WhatsApp.

---

## Technical Stack (Badges or Cards)
- Python
- OpenAI Agents SDK
- MCP Servers
- n8n Automation
- Chainlit UI
- SQLite
- Docker (learning)
- Kubernetes (learning)

---

## Key Achievements (Realistic & Accurate)

### Pocket Buddy AI Assistant
Built a multi-functional personal AI assistant with voice interaction, reminders, and web search capabilities.

### Business Automation Systems
Designed automation systems that reduced human support workload through 24/7 AI-driven responses and content automation.

### Certified Professional
Currently completing the **Governor Initiative (GIAIC)** certification in **AI, Web 3.0, and Metaverse**.

---

## Profile Image
Use this image strictly:
`static/img/hero/creator-profile.png`

- Circular shape
- Soft neon border
- Slow glowing animation

## RESPONSE_TEXT

Created a comprehensive tasks.md file for fixing the About the Author section. The tasks include:

1. Setup phase: Creating backup of current component
2. Foundational phase: Verifying image assets and updating CSS styles
3. User Story 3 implementation: Updating author content with accurate information and proper styling including:
   - Accurate author name "Asad Shabir"
   - Professional bio about AI & Automation Engineering
   - Animated cards for Core Expertise sections
   - Technical stack badges
   - Achievement cards
   - Circular profile image with animated border glow
   - CSS-based animations respecting reduced motion preferences

The tasks are organized by user story for independent implementation and testing, following the required checklist format with proper IDs, story labels, and file paths. Each task is specific enough that an LLM can complete it without additional context.