import re
import string
from typing import List

# Standard English stop words fallback list
DEFAULT_STOPWORDS = set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
    "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
    "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
    "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
    "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
    "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
    "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through",
    "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've",
    "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who",
    "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
    "you're", "you've", "your", "yours", "yourself", "yourselves"
])

def clean_text(text: str) -> str:
    """Normalize text by converting to lower case and replacing special characters."""
    if not text:
        return ""
    text = text.lower()
    # Keep alphanumeric characters, hashes, pluses (for C++, C#), dots (for Node.js), dashes (for REST-API)
    text = re.sub(r'[^a-z0-9\s\+\#\.\-]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase words while preserving tech symbols like C++, C#, .NET."""
    cleaned = clean_text(text)
    tokens = cleaned.split()
    return tokens


def remove_stopwords(tokens: List[str]) -> List[str]:
    """Filter out standard English stop words."""
    return [token for token in tokens if token not in DEFAULT_STOPWORDS and len(token) > 1]


def lemmatize_token(token: str) -> str:
    """Simple rule-based lemmatizer/stemmer for common English suffixes."""
    # Preserve tech keywords
    if token in ['c++', 'c#', '.net', 'js', 'ts', 'aws', 'gcp', 'css', 'html']:
        return token
        
    if token.endswith("ing") and len(token) > 5:
        return token[:-3]
    if token.endswith("ed") and len(token) > 4:
        return token[:-2]
    if token.endswith("es") and len(token) > 4:
        return token[:-2]
    if token.endswith("s") and len(token) > 3 and not token.endswith("ss"):
        return token[:-1]
    return token


def preprocess_text(text: str) -> str:
    """
    Complete Level 1 NLP preprocessing pipeline:
    Raw Text -> Lowercase & Clean -> Tokenize -> Remove Stop Words -> Lemmatize -> Processed String
    """
    tokens = tokenize(text)
    filtered = remove_stopwords(tokens)
    lemmatized = [lemmatize_token(tok) for tok in filtered]
    return " ".join(lemmatized)
