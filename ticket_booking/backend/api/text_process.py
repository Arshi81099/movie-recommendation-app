from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
import regex as re
import pandas as pd

class TextProcessor(BaseEstimator, TransformerMixin):
    stop_words = set(ENGLISH_STOP_WORDS)
    stop_words.update(['film', 'films', 'movie', 'movies', 'director', 'plot', 'story', 'actor', 'actors', 'cast',
                       'scene', 'scenes', 'cinema', 'hollywood', 'script', 'screenplay', 'character', 'charaters', 'role',
                       'roles', 'actress', 'actresses', 'genre', 'genres', 'sequel', 'prequel', 'remake', 'remakes', 'original',
                       'version', 'versions', 'franchise', 'franchises', 'cinematography', 'cinematographer', 'cinematographers',
                       'cinematographic', 'cinematographics', 'cinematic', 'cinematics', 'cinematograph', 'cinematographs', 
                       'cinematographical', 'cinematographically', 'like', 'just', 'review', 'reviews', 'storyline', 'storylines',
                       'story', 'stories', 'plotline', 'dont', 'didnt', 'doesnt', 'cant', 'couldnt', 'wouldnt', 'shouldnt', 'wont',
                       'just', 'isnt', 'arent', 'wasnt', 'werent', 'havent', 'hasnt', 'hadnt', 'having', 'got', 'get',
                       'gets', 'gotten', 'im', 'ive', 'id', 'ill', 'youre', 'youve', 'youll', 'youd', 'theyre', 'theyve',
                       'theyll', 'theyd', 'weve', 'wed', 'were', 'wasnt'
                      ])
    

    process_pattern = re.compile(r"\s|[.,?!;:-_]")
    whitespace_pattern = re.compile(r"\s+")
    
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X: pd.Series, y=None, stem=False):
        X = X.copy()
        X.fillna("", inplace=True)
        X = X.apply(self.process_text)
        return X
    
    def process_text(self, text):
        text = text.lower()

        words_without_apostrophe = []
        for word in text.split():
            if "'" not in word:
                words_without_apostrophe.append(word)
        text = " ".join(words_without_apostrophe)

        text_characters = []
        for character in text:
            if character.isalpha() or character.isspace():
                text_characters.append(character)
        text = "".join(text_characters)

        words = []
        for word in text.split():
            if len(word) > 2 and word not in self.stop_words:
                words.append(word)
        text = " ".join(words)

        whitespace_removed = []
        words = text.split()
        for word in words:
            if word:
                whitespace_removed.append(word)
        text = " ".join(whitespace_removed)

        return text
