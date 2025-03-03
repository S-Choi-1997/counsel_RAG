# app/auth.py
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
import requests
import google.oauth2.id_token
import google.auth.transport.requests
import os

router = APIRouter()

# 환경 변수에서 CLIENT_ID, CLIENT_SECRET, REDIRECT_URI 가져오기
CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:8080/auth/google/callback")

@router.get("/google/login")
def google_login():
    """
    1) Google OAuth 동의 화면으로 리다이렉트
    """
    if not CLIENT_ID:
        raise HTTPException(status_code=500, detail="구글 OAuth CLIENT_ID가 설정되지 않았습니다.")

    # Google OAuth 2.0 인증 URL 생성
    # scope: 기본적으로 'profile', 'email' 정도
    google_auth_endpoint = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        "&prompt=consent"
    )
    return RedirectResponse(url=google_auth_endpoint)

@router.get("/google/callback")
def google_callback(code: str):
    """
    2) Google에서 code를 받고, 토큰 교환 후 사용자 정보 파싱
    """
    if not CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="구글 OAuth CLIENT_SECRET이 설정되지 않았습니다.")

    token_endpoint = "https://oauth2.googleapis.com/token"

    # code -> {access_token, id_token, refresh_token...} 교환
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    r = requests.post(token_endpoint, data=data)
    if r.status_code != 200:
        raise HTTPException(status_code=400, detail="구글 토큰 교환 실패")

    tokens = r.json()  # {access_token, id_token, refresh_token, ...}
    id_token_jwt = tokens.get("id_token")
    if not id_token_jwt:
        raise HTTPException(status_code=400, detail="ID 토큰이 없습니다.")

    # ID 토큰 검증
    request_session = google.auth.transport.requests.Request()
    try:
        id_info = google.oauth2.id_token.verify_oauth2_token(
            id_token_jwt, request_session, CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="ID 토큰 검증 실패")

    # 사용자 정보 예시
    user_email = id_info.get("email")
    user_name = id_info.get("name")
    user_sub = id_info.get("sub")  # Google 내 유니크한 사용자 ID

    # 여기서는 단순히 사용자 정보를 JSON으로 리턴
    return {
        "message": "구글 OAuth 로그인 성공!",
        "email": user_email,
        "name": user_name,
        "sub": user_sub,
    }
