from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import habits, deepseek

app = FastAPI(title="Buen Dia API", description="Backend API for the Buen Dia App")

# Configure CORS to allow the React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    # Allows all origins
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the modular routers
app.include_router(habits.router, prefix="/api/habits", tags=["Habits"])
app.include_router(deepseek.router, prefix="/api/deepseek", tags=["DeepSeek"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Buen Dia Backend API. Scalable Architecture Edition!"}
