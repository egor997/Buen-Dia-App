from pydantic import BaseModel

class DeepSeekRequest(BaseModel):
    model: str = "deepseek-chat"
    system_prompt: str = "You are a helpful coding assistant"
    user_prompt: str
    temperature: float = 1.0
    stream: bool = False
