// src/App.js
import React from 'react';
import ProfileSection from './ProfileSection';
import StickerSection from './StickerSection';
import CommentsSection from './CommentsSection';

// 쪽지관련 컴포넌트
import { Routes, Route, useNavigate } from 'react-router-dom';  // 라우팅 관련 import
import WriteMessage from './Message/WriteMessage';
import Inbox from './Message/Inbox';

import '../../App.css';
import TopCommnets from '../mainPanel/TopComments';

function Home() {

    const navigate = useNavigate();

    return (
      <div className="">
        <main className="main-content">

          <ProfileSection />
          <TopCommnets/>
          <StickerSection />
          <CommentsSection />
        </main>

        {/* 라우팅 설정 */}
        <Routes>
          <Route path="/write" element={<WriteMessage />} />   {/* 쪽지 보내기 페이지 */}
          <Route path="/inbox" element={<Inbox />} />          {/* 쪽지함 페이지 */}
        </Routes>

      </div>
    );
  }
  export default Home;