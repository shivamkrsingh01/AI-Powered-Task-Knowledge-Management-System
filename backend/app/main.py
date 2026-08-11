from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, tasks, documents, search, analytics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task & Knowledge Management System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(documents.router)
app.include_router(search.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {"message": "Task & Knowledge Management System API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
