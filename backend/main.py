# app/main.py
from fastapi import FastAPI
from .auth import router as auth_router

app = FastAPI()

# /auth 관련 라우터 등록
app.include_router(auth_router, prefix="/auth", tags=["auth"])


@app.get("/")
def read_root():
    """
    간단한 테스트용 엔드포인트
    Cloud Run에 배포 후 이 URL로 접속했을 때 동작하는지 확인 가능
    """
    return {"message": "Hello from FastAPI on Cloud Run!"}
