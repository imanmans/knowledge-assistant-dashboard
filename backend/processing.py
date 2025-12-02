
from fastapi import UploadFile
from typing import List
import pdfplumber
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
import chromadb
from functools import lru_cache

persist_directory="./chroma_db"
chromadb_client = chromadb.PersistentClient(path=persist_directory)    
embed_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

processing_status = {} # To track processing status of files


def get_file_content(file: UploadFile) -> str:
    if file.content_type == "text/plain":
        return file.file.read().decode("utf-8")
    elif file.content_type == "application/pdf":
        content = ""
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                content += page.extract_text() + "\n"
        return content
    else:
        raise ValueError(f"Unsupported file type: {file.content_type}")

def get_chunks(text: str) -> List[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    return text_splitter.split_text(text)

def get_embeddings(chunks: List[str]) -> List[List[float]]:
    return [embed_model.embed_query(chunk) for chunk in chunks]


def store_embeddings(chunks: List[str], embeddings: List[List[float]], collection_name: str):
    collection = chromadb_client.get_or_create_collection(name=collection_name)
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[f"{collection_name}_{i}"]
        )
    print(f"Collection '{collection_name}' created with {len(chunks)} chunks.")

def list_uploaded_docs():
    collections = get_all_collections()
    output = []

    for col in collections:
        collection = chromadb_client.get_collection(col.name)
        items = collection.get(include=["documents", "embeddings"])
        num_chunks = len(items["documents"])
        num_embeddings = len(items["embeddings"]) if items.get("embeddings") is not None else 0
        output.append({
            "collection": col.name,
            "chunks": num_chunks,
            "embeddings": num_embeddings
            })

    return {"documents": output}

@lru_cache
def get_all_collections():
    return chromadb_client.list_collections()

def process_file(file: UploadFile):
    # Initial processing status
    file_name = file.filename
    processing_status[file_name] = {
        "status": "processing",
        "chunks": 0,
        "embeddings": 0
    }

    # Extract text content
    content = get_file_content(file)
    collection_name = f"{file.filename.replace(' ', '_').replace('.pdf', '').replace('.txt', '')}"
    # Process text: chunking, embedding, storing
    chunks = get_chunks(content)
    embeddings = get_embeddings(chunks)
    store_embeddings(chunks, embeddings, collection_name)
    # Update processing status
    processing_status[file_name]["status"] = "completed"
    processing_status[file_name]["chunks"] = len(chunks)
    processing_status[file_name]["embeddings"] = len(embeddings)