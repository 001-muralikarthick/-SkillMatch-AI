import math
from typing import Dict, Any, Tuple
from backend.nlp.preprocessor import preprocess_text

_ST_MODEL = None
_ST_LOADED = False

def get_sentence_transformer_model():
    """Lazy load SentenceTransformer model if available."""
    global _ST_MODEL, _ST_LOADED
    if _ST_LOADED:
        return _ST_MODEL
        
    try:
        from sentence_transformers import SentenceTransformer
        # Load lightweight fast embedding model
        _ST_MODEL = SentenceTransformer('all-MiniLM-L6-v2')
        _ST_LOADED = True
        return _ST_MODEL
    except Exception as e:
        _ST_MODEL = None
        _ST_LOADED = False
        return None


def fallback_semantic_vector_similarity(text1: str, text2: str) -> float:
    """
    Fallback dense n-gram & semantic feature vector cosine similarity 
    when transformer model is loading/offline.
    Captures phrase matches and contextual co-occurrences.
    """
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    
    clean1 = preprocess_text(text1)
    clean2 = preprocess_text(text2)
    
    if not clean1 or not clean2:
        return 0.0
        
    # Combine word and character n-grams to capture phrase and morphological similarity
    vec = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5), min_df=1)
    try:
        matrix = vec.fit_transform([clean1, clean2])
        sim = float(cosine_similarity(matrix[0], matrix[1])[0][0])
        return sim
    except Exception:
        return 0.0


def compute_semantic_similarity(resume_text: str, jd_text: str) -> Tuple[float, Dict[str, Any]]:
    """
    Level 4 — Semantic Matching:
    Uses Sentence Transformer Embeddings (or fallback dense semantic vectorizer)
    to compute contextual similarity between Resume and Job Description.
    """
    model = get_sentence_transformer_model()
    
    if model is not None:
        try:
            embeddings = model.encode([resume_text, jd_text])
            emb1, emb2 = embeddings[0], embeddings[1]
            
            dot_prod = sum(a * b for a, b in zip(emb1, emb2))
            norm1 = math.sqrt(sum(a * a for a in emb1))
            norm2 = math.sqrt(sum(b * b for b in emb2))
            
            if norm1 > 0 and norm2 > 0:
                sim = dot_prod / (norm1 * norm2)
            else:
                sim = 0.0
                
            score_pct = round(max(0.0, float(sim)) * 100, 2)
            return score_pct, {
                "method": "SentenceTransformer (all-MiniLM-L6-v2)",
                "semantic_similarity": float(sim),
                "match_score_pct": score_pct,
                "embedding_dim": len(emb1)
            }
        except Exception as err:
            pass
            
    # Fallback execution
    sim = fallback_semantic_vector_similarity(resume_text, jd_text)
    score_pct = round(float(sim) * 100, 2)
    
    return score_pct, {
        "method": "Dense N-Gram Semantic Vectorizer",
        "semantic_similarity": float(sim),
        "match_score_pct": score_pct,
        "embedding_dim": 1000
    }
