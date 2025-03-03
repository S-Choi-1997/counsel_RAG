import os
import uvicorn
from fastapi import FastAPI
from .auth import router as auth_router

app = FastAPI()

# /auth 관련 라우터 등록
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Cloud Run!"}

# Cloud Run에서 실행할 때 필요한 부분 추가
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # Cloud Run에서 제공하는 PORT 사용
    uvicorn.run(app, host="0.0.0.0", port=port)
