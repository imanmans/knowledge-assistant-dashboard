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