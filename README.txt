3D Log Analytics Platform
 Overview
The 3D Log Analytics Platform is a full-stack web application that processes large log files, extracts insights, and visualizes them in an interactive 3D dashboard.
It uses a background job queue to handle heavy processing, stores results in a secure Supabase Postgres database, and renders real-time analytics in Three.js.
✨ Features
	•	Asynchronous Data Processing with Node.js, BullMQ, and Redis.
	•	3D Visualization of processed logs via React + Three.js.
	•	Supabase Integration for authentication, Postgres database, and real-time updates.
	•	Containerized Setup with Docker & Docker Compose for easy deployment.
	•	Secure Access Control using Supabase Row Level Security (RLS).
	•	Modular Architecture for scalability and maintainability.
🛠 Tech Stack
Frontend:
	•	Next.js
	•	React
	•	Three.js / @rea

Backend:
	•	Node.js
	•	BullMQ
	•	Redis
Database & Auth:
	•	Supabase (Postgres + Auth + Realtime)
DevOps:
	•	Docker & Docker Compose
	•	Git & LazyGit for version control

PROJECT SETUP :

1. Clone repository
git clone https://github.com/mohsinshabir1234/3DLogAnalytics.git
cd 3DLogAnalytics
2. Set Up Environment Variables
Create `.env` files for backend and frontend:
	•	`SUPABASE_URL` – Your Supabase project URL
	•	`SUPABASE_ANON_KEY` – Public anon key for frontend
	•	`SUPABASE_SERVICE_ROLE_KEY` – Service key for backend (never expose in frontend)
	•	Redis connection details
3. Run with docker 
docker Compose up --build

--------------------------------------
Supabase Schema
Main tables:
	•	`log_stats`
	•	`log_spatial_data`
	•	`log_animations`
	•	`visualization_configs`
These track processed log summaries, spatial 3D coordinates, animation states, and user visualization preferences.
 Data Flow
    1.  Frontend uploads the log files
	2.	Frontend requests log processing from backend.
	3.	Backend enqueues job in BullMQ (Redis).
	4.	Worker processes logs → stores results in Supabase.
	5.	Frontend listens via Supabase Realtime → updates 3D visualization.

Contributors
Mohsin Shabir