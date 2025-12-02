from langchain_community.llms import OpenAI
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

from processing import embed_model, get_all_collections, persist_directory

def search_all_collections(query, persist_dir=persist_directory, k=3):
    results = []

    collections = get_all_collections()

    # loop through all collections
    for col in collections:
        col_name = col.name
        
        # load as LangChain Chroma
        lc_db = Chroma(
            collection_name=col_name,
            embedding_function=embed_model,
            persist_directory=persist_dir,
        )

        retriever = lc_db.as_retriever(search_kwargs={"k": k})
        docs = retriever.get_relevant_documents(query)

        # add results tagged with collection name
        for d in docs:
            d.metadata["source"] = col_name
            results.append(d)

    return results

def build_prompt():
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
    You are an AI assistant. Use the following context to answer the question.

    Context:
    {context}

    Question:
    {question}

    Answer:
    """
    )
    return prompt

def generate_answer(question: str, k: int = 3):
    docs = search_all_collections(question)[:k]
    context = "\n\n".join([doc.page_content for doc in docs])
    
    prompt = build_prompt()
    llm = OpenAI(temperature=0)
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    answer = qa_chain.run({"context": context, "question": question})
    
    sources = list({d.metadata.get("source", "unknown") for d in docs})
    
    return {"answer": answer, "sources": sources}