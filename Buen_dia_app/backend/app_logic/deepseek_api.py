''' required:
    model (string)  "deepseek-chat", "deepseek-reasoner"
    model="deepseek-chat"

    role: Either "system", "user", or "assistant"

    optional:
    temperature=1.0 (def)
    Coding / Math   	0.0
    Data Cleaning / Data Analysis	1.0
    General Conversation	1.3
    Translation	1.3
    Creative Writing / Poetry	1.5

    stream (boolean)
    Purpose: Whether to stream responses
        True: Get responses chunk by chunk
        False: Get complete response at once
    stream=False  (def)

    top_p - The "Vocabulary Filter"

    100 tokens = 75 words

    response = client.chat.completions.create(
    model="deepseek-chat",  # Required
    messages=[  # Required
        {"role": "system", "content": "You are a helpful coding assistant"},
        {"role": "user", "content": "Write a Python function to calculate factorial"}
    ],
    max_tokens=1000,  # Optional
    temperature=0.7,  # Optional
    top_p=0.9,  # Optional
    stream=False  # Optional
)
'''

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "check the spelling"},
        {"role": "user", "content": "Enter temperature, default 1.0"},
    ],
    stream=False
)

print(response.choices[0].message.content)
