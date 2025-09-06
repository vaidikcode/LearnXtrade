from fastapi import FastAPI, HTTPException
from app.models import QueryRequest
from app.subjects import answer_question

app = FastAPI()

@app.post("/ask/")
async def ask_question(query: QueryRequest):
    subject = query.subject.lower()
    question = query.question
    
    if not subject or not question:
        raise HTTPException(status_code=400, detail="Subject and question are required")
    
    answer = await answer_question(subject, question)
    return {"answer": answer}