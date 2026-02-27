# 🚀 SpecDraft AI (Requirement to Spec Copilot)

[![Frontend](https://img.shields.io/badge/Frontend-Deployed_on_Vercel-black?logo=vercel)](#)
[![Backend](https://img.shields.io/badge/Backend-Deployed_on_Hugging_Face-yellow?logo=huggingface)](#)
[![Database](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](#)
[![AI](https://img.shields.io/badge/AI-Mistral_7B-blue)](#)

**SpecDraft AI** is a production-ready generative AI application that transforms unstructured product requirements into clean, developer-ready specifications. Simply upload or paste raw requirements, and instantly generate structured user stories, RESTful API endpoints, database schemas, and edge case analysis.

---

## 🌐 Live Demo

- **Frontend:** [SpecDraft AI on Vercel](https://api-copilot-plbhdcf8z-yoyoharishankar-6711s-projects.vercel.app/)
- **Backend API:** [FastAPI Swagger UI on Hugging Face](https://harishankar000-specdraft-api.hf.space/docs)

---

## ✨ Features

- **Secure Authentication** – Supabase Auth with user sign-up, login, and session management
- **Multi-Modal Input** – Accept raw text or upload documents (`.txt`, `.pdf`)
- **Intelligent Parsing** – LangChain + Mistral-7B for feature extraction and analysis
- **Structured Output Generation:**
    - 👤 User Stories (role-based feature mapping)
    - 🔌 API Endpoints (HTTP methods, paths, descriptions)
    - 🗄️ Database Schema (table definitions and relationships)
    - ⚠️ Edge Cases (technical risk analysis)
- **Cloud Storage** – Secure file uploads and historical output tracking via Supabase

---

## 🛠️ Tech Stack

**Frontend:** React.js (Vite) | Tailwind CSS | Axios | Vercel  
**Backend:** Python 3.10 | FastAPI | LangChain | Mistral-7B | Docker  
**Infrastructure:** Supabase (PostgreSQL, Auth, Storage)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Installation

1. **Clone the repository:**
     ```bash
     git clone https://github.com/your-username/API-Copilot.git
     cd API-Copilot
     ```

2. **Backend setup:**
     ```bash
     cd backend
     python3 -m venv venv
     source venv/bin/activate  # Windows: venv\Scripts\activate
     pip install -r requirements.txt
     ```

3. **Configure environment variables:**
     Create `.env` in the `backend/` directory:
     ```env
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_KEY=your_supabase_service_role_key
     HUGGINGFACEHUB_API_TOKEN=your_huggingface_token
     ```

4. **Start the backend:**
     ```bash
     uvicorn main:app --reload --port 7860
     ```

5. **Frontend setup** (new terminal):
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
     Update `src/api.js` to point to `http://localhost:7860` if testing locally.

