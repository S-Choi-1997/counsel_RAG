import React from 'react';

function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button 
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-md 
        text-gray-800 font-bold hover:bg-gray-100 transition duration-300"
      >
        Google로 로그인
      </button>
    </div>
  );
}

export default LoginPage;
