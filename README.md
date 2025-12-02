# 📚 AI Knowledge Assistant Dashboard (Backend + Frontend)

This project is a mini version of an internal **AI Knowledge Assistant** that ingests documents, stores embeddings, and answers user questions based on uploaded knowledge.  
It consists of a **FastAPI backend** and a **Next.js frontend**.

---

## 🎯 Project Overview

The system allows users to:

- Upload multiple `.txt` or `.pdf` documents.
- Extract and process text content.
- Split text into chunks and generate embeddings.
- Store embeddings inside a vector database.
- Query the knowledge through a conversational API.

The frontend provides a simple dashboard to:

- Upload files  
- View processed documents and metadata  
- Ask questions and display answers with sources  

---

## 🧠 Backend Functionality (FastAPI + LangChain)

### **1️⃣ Document Upload & Processing**

The backend exposes an API to upload files, extract their text, split into chunks, embed them, and store them inside a vector database (Chroma).

#### **Endpoints**

### **POST `/api/upload`**
Upload one or more `.txt` or `.pdf` files.

**Process includes:**
- Reading file content  
- Text extraction  
- Splitting into chunks  
- Generating embeddings (LangChain)  
- Storing them in the vector database  

**Returns:**
- Filename  
- Number of processed chunks  

---

### **GET `/api/docs`**
Returns a list of uploaded documents with their metadata:

- Document/Collection name  
- Number of chunks  
- Number of embeddings  
- Source information  

Used by the frontend to show ingestion status and embedding count.

---

### **2️⃣ Ask the Assistant (Retrieval + LLM)**

### **POST `/api/ask`**
Request body:

```json
{ "question": "Your question here" }
```
Backend does:
- Retrieve relevant chunks using LangChain Retriever
- Generate an answer using an LLM (OpenAI or mock model)
- Return the answer + the source chunks used
- Response example:
```json
{
  "answer": "...",
  "sources": ["document1.pdf", "document2.txt"]
}
```

## 🎨 Frontend Functionality

The frontend of the AI Knowledge Assistant Dashboard is built with **Next.js** and provides a user-friendly interface for interacting with the backend and managing documents. Key functionalities include:

### 1. Upload Documents
- Users can upload one or multiple documents at a time.
- Each uploaded document is processed and split into chunks.
- Embeddings are generated for each document to enable semantic search.
- Real-time processing status is displayed for each file.

### 2. View Processed Documents
- Lists all documents that have been processed.
- Displays key information for each document:
  - File name
  - Number of chunks
  - Number of embeddings
- Supports scrolling when there are many documents.

### 3. Ask the AI Assistant
- Users can type a question in the chat interface.
- The assistant searches all processed documents and generates an answer.
- Answers include sources from the documents.
- Supports real-time updates with loading indicators while the assistant is generating a response.

### 4. Chat UI Features
- Messages are displayed in a chat-like interface.
- User questions and assistant answers are clearly differentiated.
- If the chat is empty, a placeholder message is shown: `"Start asking a question"`.
- Placeholder is automatically removed once the first message appears.

## Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Environment Variables

Before running the application, export your OpenAI API key:

```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

## **Running the Application with Docker**

1.  Clone the repository:
    

```
git clone https://github.com/imanmans/knowledge-assistant-dashboard

cd knowledge-assistant-dashboard
```

2. Build and start the services using Docker Compose:

```docker compose up --build```

This command will build and start the following containers:

-   backend → FastAPI backend running on port 8000 inside the container
    
-   frontend → Next.js frontend
    
-   nginx → Nginx reverse proxy serving the frontend on port 3000
    

3. Open your browser and navigate to:

```http://localhost:3000/```

The AI knowledge assistant dashboard should be accessible here.

## **Stopping the Application**

To stop the application and remove containers:

```docker compose down```