# Architecture of AI Knowledge Assistant Dashboard

This document explains the high-level architecture of the AI Knowledge Assistant Dashboard, including how the frontend, backend, and reverse proxy interact within Docker.

## Components

1. **Frontend (Next.js)**
   - Web interface for uploading documents, viewing processed documents, and interacting with AI assistant.
   - Handles user inputs and displays responses from the backend.
   - Served through Nginx in production.

2. **Backend (FastAPI)**
   - Handles API requests from the frontend.
   - Processes uploaded documents, generates embeddings, performs semantic search, and answers queries using OpenAI API.
   - Exposes REST endpoints on port 8000 inside the container.

3. **Nginx Reverse Proxy**
   - Serves frontend on port 3000 (mapped to host).
   - Forwards `/api` requests to backend container.
   - Handles SPA routing for Next.js frontend.

4. **Docker**
   - Each component runs in its own container.
   - Docker Compose orchestrates containers.
   - Environment variables (e.g., `OPENAI_API_KEY`) passed to backend container.

---

## Architecture Diagram

```mermaid
graph LR
  A[User Browser http://localhost:3000] --> B[Nginx Reverse Proxy]
  B --> C[Next.js Frontend]
  B --> D[FastAPI Backend]
  D --> E[OpenAI API]
  D --> F[Document Storage & Embeddings]

  subgraph Containers
    C
    D
  end

  subgraph External Services
    E
    F
  end