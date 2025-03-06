import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/chat"); // 2초 후 채팅 페이지로 이동
    }, 2000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">로그인 성공!</h1>
      <p className="text-gray-600">잠시 후 채팅 페이지로 이동합니다...</p>
    </div>
  );
}

export default LoginSuccess;
