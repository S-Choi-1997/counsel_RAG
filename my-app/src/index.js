import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ 변경
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

// ✅ createRoot 사용
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppProvider>
        <App />
    </AppProvider>
);
