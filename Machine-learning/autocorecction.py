import re
from collections import Counter

def extract_words(text):
    # Extract individual words from the given text
    return re.findall(r'\w+', text.lower())

def calculate_probability(word, total_words):
    # Calculate the probability of `word` in the dataset
    return WORD_COUNT[word] / total_words

def correct_spelling(word):
    # Find the most probable spelling correction for `word`
    return max(get_candidates(word), key=lambda x: calculate_probability(x, sum(WORD_COUNT.values())))

def get_candidates(word):
    # Generate possible spelling corrections for `word`
    return (get_known([word]) or get_known(get_edits1(word)) or get_known(get_edits2(word)) or [word])

def get_known(words):
    # Return the subset of `words` that appear in the dictionary WORD_COUNT
    return set(w for w in words if w in WORD_COUNT)

def get_edits1(word):
    # Generate all edits that are one edit away from `word`
    letters = 'abcdefghijklmnopqrstuvwxyz'
    splits = [(word[:i], word[i:]) for i in range(len(word) + 1)]
    deletes = [L + R[1:] for L, R in splits if R]
    transposes = [L + R[1] + R[0] + R[2:] for L, R in splits if len(R) > 1]
    replaces = [L + c + R[1:] for L, R in splits if R for c in letters]
    inserts = [L + c + R for L, R in splits for c in letters]
    return set(deletes + transposes + replaces + inserts)

def get_edits2(word):
    # Generate all edits that are two edits away from `word`
    return (e2 for e1 in get_edits1(word) for e2 in get_edits1(e1))

def correct_sentence(sentence):
    # Correct the spelling of each word in the sentence
    corrected_words = []
    words_list = extract_words(sentence)
    for word in words_list:
        corrected_word = correct_spelling(word)
        corrected_words.append(corrected_word)
    return ' '.join(corrected_words)

# Load the dictionary of words
WORD_COUNT = Counter(extract_words(open('kata-dasar-id.csv').read()))