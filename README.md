<div align="center">

# 🚀 Physical AI & Humanoid Robotics Book

### *A living, interactive AI-powered textbook built for learners of tomorrow* 🤖📘

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Now-4A90E2?style=for-the-badge)](https://physical-ai-book-asadshabir.vercel.app)
[![RAG Powered](https://img.shields.io/badge/🧠%20Powered%20By-RAG%20%2B%20Gemini%202.0-8A2BE2?style=for-the-badge)]()
[![Built With](https://img.shields.io/badge/⚡%20Built%20With-Docusaurus%20%2B%20FastAPI-00C896?style=for-the-badge)]()
[![License](https://img.shields.io/badge/📜%20License-Educational-F5A623?style=for-the-badge)]()

<br/>

> *"What if your textbook could actually talk back to you?"*

</div>

---

## 🎯 What Is This Project?

Imagine a robotics textbook that **can answer your questions in real time** — an AI guide that not only teaches you concepts but has read every page of the book and remembers it all. 💬

That's exactly what this is:

> A **cutting-edge interactive learning platform** on Humanoid Robotics & Physical AI, powered by Docusaurus, intelligent vector search, and Gemini 2.0 Flash — all packaged as a beautiful, browsable book.

Humanoid robots are no longer science fiction. **Boston Dynamics** is selling them. **NVIDIA Isaac** is powering them. **Figure AI** and **Tesla Optimus** are deploying them. The Physical AI revolution is happening now — and yet most developers have no clear path to learn it.

**So I built one.** 🛠️

---

## 🧠 Why This Matters

Traditional textbooks are **static**. You read… but you can't interact.

What if instead, you could:

| Old Way | This Book |
|---------|-----------|
| 📄 Read a PDF and hope | 💬 Ask your AI guide anything |
| 🔍 Google every concept | 🎯 Get answers grounded in the actual book |
| 😴 Passive learning | ⚡ Interactive simulations & real-time Q&A |
| 🇬🇧 English only | 🌍 English + Urdu support |

**Learning just went from passive → interactive!** 🎉

---

## ✨ Core Features

<table>
<tr>
<td width="50%">

### 🤖 AI Chatbot (RAG-Powered)
Ask complex robotics questions and get context-aware answers drawn directly from the book — not hallucinations.

</td>
<td width="50%">

### ⚙️ Interactive Simulations
Explore trajectory planning, inverse kinematics, and sensor fusion through browser-native physics simulations.

</td>
</tr>
<tr>
<td width="50%">

### 📚 4 Structured Modules
Clean, real-world robotics topics organized from fundamentals to advanced AI integration.

</td>
<td width="50%">

### 🌐 Multilingual Support
Learn in both **English** and **Urdu** — making advanced robotics accessible beyond language barriers.

</td>
</tr>
<tr>
<td width="50%">

### 📱 Fully Responsive UI
Beautiful on desktop, tablet, and phone. Read on any device, anywhere.

</td>
<td width="50%">

### ⚡ Deployed & Always Live
Hosted on Vercel for fast, global access — no setup required for readers.

</td>
</tr>
</table>

---

## 📖 What You'll Learn

Whether you're a beginner or an advanced developer, this book guides you through a complete journey:

```
Module 1 → The Robotic Nervous System (ROS 2)
           └── Architecture · DDS · Topics · Services · Actions

Module 2 → The Digital Twin (Gazebo & Unity)
           └── Simulation · Virtual Testing · Digital Twin Concepts

Module 3 → The AI-Robot Brain (NVIDIA Isaac)
           └── Perception · PyTorch · OpenCV · Intelligent Control

Module 4 → Vision-Language-Action + Capstone
           └── Transformers · End-to-End AI · Real-World Integration
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Docusaurus 3 · React · CSS Animations |
| **AI / ML** | Gemini 2.0 Flash Lite · Cohere Embeddings |
| **Vector Search** | Qdrant Cloud (RAG retrieval) |
| **Backend** | FastAPI · Python · Vercel Serverless |
| **Deployment** | Vercel · GitHub Actions |
| **Methodology** | Spec-Driven Development (SDD) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- API Keys: Gemini · Cohere · Qdrant

### Run the Frontend

```bash
# Clone the repo
git clone https://github.com/asadshabir/Humanoid-Robotic-Book.git
cd Humanoid-Robotic-Book

# Install dependencies
npm install

# Start dev server → http://localhost:3000
npm start
```

### Run the RAG Backend

```bash
cd backend

# Install Python dependencies
pip install fastapi uvicorn python-dotenv qdrant-client cohere google-generativeai

# Set up environment variables
cp .env.example .env
# Edit .env with your keys (see below)

# Start the API → http://localhost:8000
python api_main.py

# Swagger docs → http://localhost:8000/docs
```

### Environment Variables

```env
COHERE_API_KEY=your_cohere_key
GEMINI_API_KEY=your_gemini_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_key
```

---

## 🏗️ Project Architecture

```
Humanoid-Robotic-Book/
│
├── 📚 docs/                        # Book chapters (Markdown)
│   ├── robotic-nervous-system/     # Module 1: ROS 2
│   ├── digital-twin/               # Module 2: Gazebo & Unity
│   ├── ai-robot-brain/             # Module 3: NVIDIA Isaac
│   └── vla-capstone/               # Module 4: VLA Integration
│
├── ⚛️  src/
│   ├── components/
│   │   ├── Chatbot/                # RAG Chatbot (Gemini + Qdrant)
│   │   ├── InteractiveSimulation/  # Physics simulations
│   │   └── Homepage/               # Landing page components
│   └── pages/
│
├── 🐍 backend/
│   ├── api/index.py                # Vercel serverless handler
│   ├── api_main.py                 # FastAPI RAG server
│   └── agents/                     # AI agent pipeline
│
└── 📋 specs/                       # SDD artifacts (spec · plan · tasks)
```

---

## 🌐 Live Demo

**👉 Try it live right now:**

> **[https://physical-ai-book-asadshabir.vercel.app](https://physical-ai-book-asadshabir.vercel.app)**

Open the chatbot, ask it anything about humanoid robotics, and watch it pull context-aware answers straight from the book. 🤖

---

## 🙌 Contributing

This project is built in the open. Contributions are welcome!

```bash
# Fork → Clone → Branch → Build → PR
git checkout -b feat/your-feature-name
git commit -m "feat: describe your change"
git push origin feat/your-feature-name
# Open a Pull Request on GitHub
```

**Ideas for contributions:**
- 📝 Add or improve book chapters
- 🌏 Add Urdu translations
- 🔧 Improve the RAG chatbot accuracy
- 🎨 Enhance UI components or simulations
- 🐛 Report bugs via [GitHub Issues](https://github.com/asadshabir/Humanoid-Robotic-Book/issues)

---

## 👤 About the Author

<table>
<tr>
<td width="70%">

**Asad Shabir** — AI & Automation Engineer, Karachi 🇵🇰

Three years building intelligent systems. Certified through **GIAIC** (Governor Initiative for AI, Web 3.0 & Metaverse). Obsessed with making AI accessible, practical, and powerful for everyone.

**Connect:**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-asad--shabir-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/asad-shabir-programmer110/)
[![GitHub](https://img.shields.io/badge/GitHub-asadshabir-181717?style=flat-square&logo=github)](https://github.com/asadshabir/)
[![Portfolio](https://img.shields.io/badge/Portfolio-asadshabir.netlify.app-00C896?style=flat-square)](https://asadshabir.netlify.app/)

</td>
</tr>
</table>

---

## 📜 License

Licensed for educational and research purposes. Content © Asad Shabir 2025–2026.

---

<div align="center">

### ⭐ If this project helped you, give it a star!

*Built to inspire the next generation of robotics engineers.*

**The future is physical. The future is AI. The future is now.**

🤖 · 🚀 · 🌍

</div>
