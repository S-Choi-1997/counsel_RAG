# Dockerfile

# Python 3.9 버전의 기본 이미지 사용(원하는 버전으로 조정 가능)
FROM python:3.9

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt만 먼저 복사 후 패키지 설치 (레이어 캐싱 최적화)
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 전체 복사
COPY . /app

# Cloud Run은 기본적으로 PORT=8080 환경변수를 사용
ENV PORT 8080

# uvicorn으로 FastAPI 앱 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
