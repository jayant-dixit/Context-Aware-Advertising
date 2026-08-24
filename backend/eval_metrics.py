from sentence_transformers import SentenceTransformer, util

print("[*] Loading Embedding Model for Evaluation...")
eval_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

def get_semantic_similarity(expected_text: str, generated_text: str) -> float:
    """
    Calculates the cosine similarity between two strings using dense embeddings.
    Returns a float between 0.0 (completely different) and 1.0 (identical meaning).
    """
    if not expected_text or not generated_text:
        return 0.0
        
    emb1 = eval_model.encode(expected_text)
    emb2 = eval_model.encode(generated_text)
    
    cosine_sim = util.cos_sim(emb1, emb2)
    return cosine_sim.item()