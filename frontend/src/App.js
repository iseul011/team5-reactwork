// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import MainPanel from './components/mainPanel/MainPanel';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login/Login.jsx';
import SignUpPage from './components/SignUpPage/SignUpPage.jsx';

function App() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hostId, setHostId] = useState(localStorage.getItem('id') || '');
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    
    if (token && id) {
      setShowContinuePrompt(true); // 로그인된 정보가 있으면 계속할지 물어보는 창 띄우기
    }
  }, []);

  const handleContinue = () => {
    setIsLoggedIn(true);
    setHostId(localStorage.getItem('id'));
    setShowContinuePrompt(false);
    navigate(`/home/${localStorage.getItem('id')}`);
  };

  const handleCancel = () => {
    setIsLoggedIn(false);
    setShowContinuePrompt(false);
    localStorage.clear(); // 로컬 스토리지 비우기
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setHostId(localStorage.getItem('id'));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate('/'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <div className="App">
      {showContinuePrompt ? (
        <div className="continue-prompt">
          <p>{localStorage.getItem('id')}님으로 계속 실행하시겠습니까?</p>
          <button onClick={handleContinue}>계속 진행</button>
          <button onClick={handleCancel}>취소</button>
        </div>
      ) : isLoggedIn ? (
        <MainPanel onLogout={handleLogout} hostId={hostId} setHostId={setHostId} />
      ) : (
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleLogin} />} />
          <Route path="/SignUpPage" element={<SignUpPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
