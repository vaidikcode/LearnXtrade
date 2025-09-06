import os
from typing import List
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
qdrant = QdrantClient(host="localhost", port=6333)

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    chunks = []
    start = 0
    text_length = len(text)
    while start < text_length:
        end = min(start + chunk_size, text_length)
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def read_text_files(folder: str) -> List[str]:
    texts = []
    for filename in os.listdir(folder):
        filepath = os.path.join(folder, filename)

        if filename.endswith('.txt'):
            with open(filepath, 'r', encoding='utf-8') as f:
                full_text = f.read()
                chunks = chunk_text(full_text)
                texts.extend(chunks)

        elif filename.endswith('.pdf'):
            try:
                reader = PdfReader(filepath)
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                chunks = chunk_text(text)
                texts.extend(chunks)
            except Exception as e:
                print(f"Failed to read PDF {filename}: {e}")
    return texts

def upload_subject_docs(subject_folder: str, subject_name: str):
    texts = read_text_files(subject_folder)
    if not texts:
        print(f"No valid text or PDF documents found in folder '{subject_folder}'")
        return

    embeddings = embedding_model.encode(texts).tolist()
    collection_name = f"lms_{subject_name}_collection"

    # Safe overwrite logic
    if qdrant.collection_exists(collection_name):
        print(f"Deleting existing collection '{collection_name}'")
        qdrant.delete_collection(collection_name)

    print(f"Creating collection '{collection_name}'")
    qdrant.create_collection(
        collection_name=collection_name,
        vectors_config={"size": len(embeddings[0]), "distance": "Cosine"},
    )

    points = [
        PointStruct(
            id=idx,
            vector=embeddings[idx],
            payload={"text": texts[idx]}
        )
        for idx in range(len(texts))
    ]

    qdrant.upload_points(collection_name=collection_name, points=points)
    print(f"Uploaded {len(points)} document chunks to collection '{collection_name}'")

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 3:
        print("Usage: python upload_subject_docs.py <subject_folder> <subject_name>")
        sys.exit(1)
    folder = sys.argv[1]
    subject = sys.argv[2]
    upload_subject_docs(folder, subject)
