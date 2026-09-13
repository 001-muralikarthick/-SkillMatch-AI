from typing import Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.nlp.preprocessor import preprocess_text

def compute_tfidf_similarity(resume_text: str, jd_text: str) -> Tuple[float, Dict[str, Any]]:
    """
    Level 1 — Basic NLP:
    Computes TF-IDF vectors and Cosine Similarity score between preprocessed resume and job description.
    Returns (score_percentage, metadata_dict).
    """
    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(jd_text)
    
    if not clean_resume or not clean_jd:
        return 0.0, {
            "cosine_similarity": 0.0,
            "match_score_pct": 0.0,
            "top_shared_terms": [],
            "vocab_size": 0
        }
        
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_jd])
    
    feature_names = vectorizer.get_feature_names_out()
    resume_vector = tfidf_matrix[0]
    jd_vector = tfidf_matrix[1]
    
    sim = cosine_similarity(resume_vector, jd_vector)[0][0]
    score_pct = round(float(sim) * 100, 2)
    
    # Extract top overlapping n-grams with highest combined TF-IDF weights
    overlap_features = []
    resume_dense = resume_vector.toarray()[0]
    jd_dense = jd_vector.toarray()[0]
    
    for idx, feature in enumerate(feature_names):
        r_val = resume_dense[idx]
        j_val = jd_dense[idx]
        if r_val > 0 and j_val > 0:
            score = float(r_val * j_val)
            overlap_features.append((feature, score))
            
    overlap_features.sort(key=lambda x: x[1], reverse=True)
    top_terms = [item[0] for item in overlap_features[:10]]
    
    return score_pct, {
        "cosine_similarity": float(sim),
        "match_score_pct": score_pct,
        "top_shared_terms": top_terms,
        "vocab_size": len(feature_names)
    }
