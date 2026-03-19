import requests
import json
from bs4 import BeautifulSoup

def export_quizlet_words(url, output_file="my_words.json"):
    """Export new words from Quizlet URL"""
    
    print(f"📥 Fetching: {url}")
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching URL: {e}")
        return []
        
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all cards
    words = []
    cards = soup.find_all('div', class_='SetPageTerms-term')
    
    for card in cards:
        term = card.find('span', class_='TermText')
        definition = card.find('span', class_='DefinitionText')
        
        if term and definition:
            words.append({
                'word': term.text.strip(),
                'meaning': definition.text.strip(),
                'language': 'Spanish',  # Change as needed
                'date_added': '2024-01-15'
            })
    
    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(words, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Exported {len(words)} words to {output_file}")
    
    # Show first 5 words
    print("\n📖 First 5 words:")
    for i, word in enumerate(words[:5]):
        print(f"{i+1}. {word['word']} -> {word['meaning']}")
    
    return words