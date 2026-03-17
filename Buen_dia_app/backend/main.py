from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import habits, deepseek

app = FastAPI(title="Buen Dia API")

# Configure CORS to allow the React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (update with specific frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the modular routers
app.include_router(habits.router, prefix="/api/habits", tags=["Habits"])
app.include_router(deepseek.router, prefix="/api/deepseek", tags=["DeepSeek"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Buen Dia Backend API"}
