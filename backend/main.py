from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from typing import List
from processing import get_file_content, get_chunks, get_embeddings, store_embeddings, list_uploaded_docs
from chat_helper import generate_answer
from cors import setup_cors 

app = FastAPI()

setup_cors(app)

def process_file(file: UploadFile):
    # Extract text content
    content = get_file_content(file)
    collection_name = f"{file.filename.replace(' ', '_').replace('.pdf', '').replace('.txt', '')}"
    # Process text: chunking, embedding, storing
    chunks = get_chunks(content)
    embeddings = get_embeddings(chunks)
    store_embeddings(chunks, embeddings, collection_name)

@app.post("/api/upload/")
async def upload_files(files: List[UploadFile] = File(...), background_tasks: BackgroundTasks = None):
    for file in files:
        background_tasks.add_task(process_file, file)
    return {"message": "Files uploaded successfully. Processing in background."}

@app.get("/api/docs/")
def list_collections():
    return list_uploaded_docs()

@app.post("/api/ask/")
async def ask_question(question: str):
    return {"answer": generate_answer(question)}

