from app.retriever import retrieve_relevant_docs
from app.generator import generate_answer_gemini

async def answer_question(subject: str, question: str) -> str:
    docs = retrieve_relevant_docs(question, subject)
    if not docs:
        return "Sorry, no relevant information found for this subject."
    answer = await generate_answer_gemini(question, docs)
    return answer
