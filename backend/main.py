from fastapi import FastAPI, File, UploadFile
from typing import List
from processing import get_file_content, get_chunks, get_embeddings, store_embeddings, list_uploaded_docs
from chat_helper import generate_answer

app = FastAPI()

@app.post("/api/upload/")
async def upload_files(files: List[UploadFile] = File(..., description="Multiple files as UploadFile")):
    for file in files:
        # Extract text content
        content = get_file_content(file)
        collection_name = f"{file.filename.replace(' ', '_').replace('.pdf', '').replace('.txt', '')}"        
        # Process text: chunking, embedding, and storing
        chunks = get_chunks(content)
        embeddings = get_embeddings(chunks)
        store_embeddings(chunks, embeddings, collection_name)
    return {"message": "Files processed successfully."}

@app.get("/api/docs/")
def list_collections():
    return list_uploaded_docs()

@app.post("/api/ask/")
async def ask_question(question: str):
    return {"answer": generate_answer(question)}

