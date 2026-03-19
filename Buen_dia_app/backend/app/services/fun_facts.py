import json
import random
import os

class FunFacts:
    def __init__(self):
        # We assume the file is sitting at backend/data/fun_facts.json
        self.path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'fun_facts.json')

    def get_facts(self):
        if not os.path.exists(self.path):
            return []
        with open(self.path, 'r', encoding='utf-8') as f:
            try:
                facts = json.load(f)
                return facts
            except json.JSONDecodeError:
                return []

    def get_random_fact(self):
        facts = self.get_facts()
        if not facts:
            return "No fun facts available. Check data/fun_facts.json"
        
        # Determine format of the JSON (list of strings vs list of dicts)
        fact = random.choice(facts)
        # If the facts list is just strings:
        if isinstance(fact, str):
            return {"fact": fact}
        # If it's a dict, safely return it as-is
        return fact

    def add_fun_fact(self, new_fact: str):
        facts = self.get_facts()
        if new_fact not in facts:
            facts.append(new_fact)
            with open(self.path, 'w', encoding='utf-8') as f:
                json.dump(facts, f, indent=4, ensure_ascii=False)
            return True
        return False

    def remove_fun_fact(self, fact_to_remove: str):
        facts = self.get_facts()
        # Find exactly the fact to remove
        original_len = len(facts)
        
        # Depending on if it's a string or dict, handle appropriately
        if facts and isinstance(facts[0], str):
            facts = [f for f in facts if f != fact_to_remove]
        elif facts and isinstance(facts[0], dict):
            # Assume dict has a "fact" key or similar
            facts = [f for f in facts if (f.get("fact", "") if isinstance(f, dict) else "") != fact_to_remove]
            
        if len(facts) < original_len:
            with open(self.path, 'w', encoding='utf-8') as f:
                json.dump(facts, f, indent=4, ensure_ascii=False)
            return True
        return False
