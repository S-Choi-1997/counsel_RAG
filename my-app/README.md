# AI Chatbot SPA

이 문서는 AI 챗봇 단일 페이지 애플리케이션(SPA)의 구조와 각 파일의 역할에 대해 자세히 설명합니다.

## 폴더 구조

```
my-app/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.js
    ├── App.css
    └── components/
        ├── LoginPage.js
        └── ChatPage.js
```

## 파일 설명

### 1. package.json
- **역할**: 프로젝트의 메타데이터와 의존성을 정의합니다. 필요한 패키지와 스크립트를 포함하고 있습니다.

### 2. public/index.html
- **역할**: 애플리케이션의 HTML 템플릿입니다. 리액트 애플리케이션이 렌더링될 `<div id="root"></div>` 요소를 포함하고 있습니다.

### 3. src/index.js
- **역할**: 애플리케이션의 진입점입니다. `ReactDOM`을 사용하여 `App` 컴포넌트를 렌더링합니다.
- **코드 연결**: 
  ```javascript
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
  ```

### 4. src/App.js
- **역할**: 애플리케이션의 주요 컴포넌트입니다. 라우팅을 설정하고 로그인 상태에 따라 다른 페이지를 표시합니다.
- **페이지**: 
  - `/` 경로: `LoginPage` 컴포넌트를 표시합니다.
  - `/chat` 경로: `ChatPage` 컴포넌트를 표시합니다.
- **코드 연결**:
  ```javascript
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import LoginPage from './components/LoginPage';
  import ChatPage from './components/ChatPage';
  ```

### 5. src/App.css
- **역할**: 애플리케이션의 스타일을 정의합니다. 기본적인 레이아웃과 디자인을 설정합니다.

### 6. src/components/LoginPage.js
- **역할**: 로그인 페이지 컴포넌트입니다. 사용자가 구글 소셜 로그인을 할 수 있는 버튼을 제공합니다.
- **코드 연결**:
  ```javascript
  const handleGoogleLogin = () => {
    const dummyUser = { name: "사용자", email: "user@example.com" };
    setUser(dummyUser);
  };
  ```

### 7. src/components/ChatPage.js
- **역할**: 채팅 페이지 컴포넌트입니다. 사용자가 메시지를 입력하고 전송할 수 있는 인터페이스를 제공합니다.
- **코드 연결**:
  ```javascript
  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: user.name, text: input }]);
    setInput("");
  };
  ```

## 실행 방법
1. `npm install`을 통해 필요한 패키지를 설치합니다.
2. `npm start`로 애플리케이션을 실행합니다.
3. 브라우저에서 `http://localhost:3000`에 접속하여 애플리케이션을 확인합니다.
