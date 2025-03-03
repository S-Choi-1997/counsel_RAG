import os
import uvicorn
from fastapi import FastAPI
from .auth import router as auth_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Cloud Run!"}
