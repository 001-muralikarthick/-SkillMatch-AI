import numpy as np
from typing import Dict, Any, List
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

class ResumeSuitabilityClassifier:
    """
    Level 3 — Machine Learning:
    Model that evaluates feature vectors extracted from Resume + Job Description
    and predicts candidate suitability ('Suitable' vs 'Not Suitable') along with probability.
    """
    def __init__(self):
        self.rf_model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.lr_model = LogisticRegression(random_state=42)
        self._is_trained = False
        self._train_models()

    def _train_models(self):
        """Train classifier models on synthetic representative feature samples."""
        # Features: [tfidf_sim (0-1), skill_coverage (0-1), exp_match (0-1), edu_match (0-1), keyword_density (0-1)]
        X_train = np.array([
            [0.85, 0.90, 0.80, 1.00, 0.75],
            [0.92, 0.95, 0.90, 1.00, 0.85],
            [0.78, 0.85, 0.75, 0.80, 0.70],
            [0.70, 0.75, 0.70, 0.80, 0.65],
            [0.65, 0.60, 0.60, 0.70, 0.55],
            # Unsuitable / Weak cases
            [0.30, 0.20, 0.30, 0.40, 0.25],
            [0.25, 0.15, 0.20, 0.30, 0.20],
            [0.40, 0.35, 0.40, 0.50, 0.30],
            [0.10, 0.05, 0.10, 0.20, 0.10],
            [0.50, 0.45, 0.50, 0.50, 0.40]
        ])
        # Y: 1 = Suitable, 0 = Not Suitable
        y_train = np.array([1, 1, 1, 1, 1, 0, 0, 0, 0, 0])
        
        self.rf_model.fit(X_train, y_train)
        self.lr_model.fit(X_train, y_train)
        self._is_trained = True

    def predict_suitability(
        self, 
        tfidf_sim: float, 
        skill_coverage: float, 
        exp_match: float, 
        edu_match: float, 
        keyword_density: float
    ) -> Dict[str, Any]:
        """
        Predict suitability given 5 normalized candidate feature scores (0.0 to 1.0).
        """
        feature_vector = np.array([[tfidf_sim, skill_coverage, exp_match, edu_match, keyword_density]])
        
        rf_prob = float(self.rf_model.predict_proba(feature_vector)[0][1])
        lr_prob = float(self.lr_model.predict_proba(feature_vector)[0][1])
        
        # Ensemble average probability
        ensemble_prob = round((rf_prob * 0.6 + lr_prob * 0.4) * 100, 2)
        is_suitable = ensemble_prob >= 60.0
        
        status_label = "Highly Suitable" if ensemble_prob >= 80 else ("Suitable" if is_suitable else "Not Suitable")
        
        return {
            "prediction": "Suitable" if is_suitable else "Not Suitable",
            "status_label": status_label,
            "suitability_probability_pct": ensemble_prob,
            "random_forest_prob_pct": round(rf_prob * 100, 2),
            "logistic_regression_prob_pct": round(lr_prob * 100, 2),
            "feature_weights": {
                "tfidf_similarity": round(tfidf_sim * 100, 1),
                "skill_coverage": round(skill_coverage * 100, 1),
                "experience_match": round(exp_match * 100, 1),
                "education_match": round(edu_match * 100, 1),
                "keyword_density": round(keyword_density * 100, 1)
            }
        }


# Global instance
ml_model = ResumeSuitabilityClassifier()
