# 🤖 Physical AI & Humanoid Robotics — Interactive Book

> *"What if learning robotics felt like living inside the future?"*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Book-blue?style=for-the-badge)](https://physical-ai-book-asadshabir.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Built%20With-Docusaurus%20%2B%20RAG%20%2B%20Gemini-green?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Educational-orange?style=for-the-badge)]()

---

## The Story Behind This Book

It started with a question that refused to leave me alone: *Why is cutting-edge robotics knowledge locked inside dense PDFs and paywalled research papers?*

Humanoid robots are no longer science fiction. **Boston Dynamics** is selling them. **NVIDIA Isaac** is powering them. **Figure AI** and **Tesla Optimus** are deploying them. The Physical AI revolution is here — and yet, most developers have no clear path to learn it.

So I built one.

This isn't just a documentation site. It's a **living, AI-powered textbook** — the kind I wish existed when I started. Every chapter is paired with an interactive simulation. Every concept is backed by a RAG-powered chatbot that answers your questions in real-time. Every module builds toward one goal: giving you the knowledge to build the next generation of intelligent machines.

---

## What Makes This Different

### 🧠 AI That Reads the Book With You
An embedded **RAG (Retrieval-Augmented Generation) chatbot**, powered by **Gemini 2.0 Flash** and **Qdrant vector search**, lets you ask any question about the book's content and get precise, grounded answers — not hallucinations.

### ⚙️ Interactive Physics Simulations
No more reading about robotics without *feeling* it. Every key concept — trajectory planning, inverse kinematics, sensor fusion — comes with browser-native simulations you can manipulate in real time.

### 📚 Four Modules. One Complete Journey.

| Module | Focus | Core Technologies |
|--------|-------|-------------------|
| **The Robotic Nervous System** | ROS 2 architecture & communication | ROS 2, DDS, Topics, Services, Actions |
| **The Digital Twin** | Simulation & virtual testing | Gazebo, Unity Robotics Hub |
| **The AI-Robot Brain** | Perception & intelligent control | NVIDIA Isaac, PyTorch, OpenCV |
| **VLA + Capstone** | Vision-Language-Action integration | Transformers, End-to-End AI |

---

## Tech Stack

```
Frontend:   Docusaurus 3 · React · CSS Animations · Three.js Simulations
Backend:    FastAPI · Python · Vercel Serverless Functions
AI/ML:      Gemini 2.0 Flash Lite · Cohere Embeddings · Qdrant Vector DB
Deployment: Vercel (Frontend + Backend) · GitHub Actions
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+ (for backend)
- API Keys: Gemini, Cohere, Qdrant

### Run Locally

```bash
# Clone the repo
git clone https://github.com/asadshabir/physical-ai-humanoid-robotics-book.git
cd physical-ai-humanoid-robotics-book

# Install frontend dependencies
npm install

# Start the Docusaurus dev server
npm start
# → http://localhost:3000
```

### Run the RAG Backend

```bash
cd backend

# Install Python dependencies
pip install fastapi uvicorn python-dotenv qdrant-client cohere google-generativeai

# Configure your API keys
cp .env.example .env
# Edit .env with your keys

# Start the API server
python api_main.py
# → http://localhost:8000
# → Swagger docs at http://localhost:8000/docs
```

### Environment Variables

```env
COHERE_API_KEY=your_cohere_key
GEMINI_API_KEY=your_gemini_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_key
```

---

## Project Architecture

```
physical-ai-humanoid-robotics-book/
├── docs/                          # Book content (Markdown chapters)
│   ├── robotic-nervous-system/    # Module 1: ROS 2
│   ├── digital-twin/              # Module 2: Gazebo & Unity
│   ├── ai-robot-brain/            # Module 3: NVIDIA Isaac
│   └── vla-capstone/              # Module 4: VLA Integration
├── src/
│   ├── components/
│   │   ├── Chatbot/               # RAG Chatbot (Gemini + Qdrant)
│   │   ├── InteractiveSimulation/ # Physics simulations
│   │   └── Homepage/              # Landing page
│   └── pages/
├── backend/
│   ├── api/index.py               # Vercel serverless handler
│   └── api_main.py                # FastAPI RAG server
└── specs/                         # Spec-Driven Development artifacts
```

---

## About the Author

**Asad Shabir** — AI & Automation Engineer, Karachi, Pakistan

Three years building intelligent systems. Certified through **GIAIC** (Governor Initiative for AI & Computing). Obsessed with making AI accessible, practical, and powerful.

- [LinkedIn](https://www.linkedin.com/in/asad-shabir-programmer110/)
- [GitHub](https://github.com/asadshabir/)
- [Portfolio](https://asadshabir.netlify.app/)

---

## Built With Spec-Driven Development

This project follows **SDD (Spec-Driven Development)** — every feature begins with a spec, goes through architectural planning, and is implemented with full traceability. All decisions are documented in `/specs/` and `/history/`.

---

## License

Licensed for educational and research purposes. Content © Asad Shabir 2025–2026.

---

<p align="center">
  <i>Built to inspire the next generation of robotics engineers.</i><br>
  <b>The future is physical. The future is AI. The future is now.</b>
</p>
