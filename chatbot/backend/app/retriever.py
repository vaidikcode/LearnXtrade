from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

qdrant = QdrantClient(host="localhost", port=6333)

def retrieve_relevant_docs(question: str, subject: str, top_k: int = 5):
    question_embedding = embedding_model.encode(question).tolist()
    collection_name = f"lms_{subject}_collection"
    try:
        search_results = qdrant.search(
            collection_name=collection_name,
            query_vector=question_embedding,
            limit=top_k,
        )
        docs = [hit.payload["text"] for hit in search_results]
        return docs
    except Exception:
        # Collection not found or other error
        return []
