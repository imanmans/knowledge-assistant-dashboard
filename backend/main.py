from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from typing import List
from sse_starlette.sse import EventSourceResponse
import asyncio
from processing import process_file, list_uploaded_docs, processing_status
from chat_helper import generate_answer
from cors import setup_cors 
import json

app = FastAPI()

setup_cors(app)


@app.post("/api/upload/")
async def upload_files(files: List[UploadFile] = File(...), background_tasks: BackgroundTasks = None):
    for file in files:
        background_tasks.add_task(process_file, file)
    return {"message": "Files uploaded successfully. Processing in background."}

@app.get("/api/stream/{file_name}")
async def stream_file(file_name: str):
    async def event_generator():
        while True:
            await asyncio.sleep(1) # Polling interval
            file_data = processing_status.get(file_name)
            if file_data and file_data["status"] == "completed":
                yield {
                "event": "done",
                "data": json.dumps({
                    "file_name": file_name,
                    "chunks": file_data["chunks"],
                    "embeddings": file_data["embeddings"]
                })
            }
                break
    return EventSourceResponse(event_generator())

@app.get("/api/docs/")
def list_collections():
    return list_uploaded_docs()

@app.post("/api/ask/")
async def ask_question(question: str):
    return {"answer": generate_answer(question)}

