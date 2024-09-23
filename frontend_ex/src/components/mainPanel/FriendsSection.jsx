import React, { useState } from 'react';
import FriendsRequest from '../friends/FriendsRequest';
import PendingRequests from '../friends/PendingRequests';
import FriendsList from '../friends/FriendsList';
import './FriendsSection.css';

function FriendsSection({ hostId, setHostId }) {
  const [view, setView] = useState(''); // 어떤 폼을 열지 선택하는 상태

  return (
    <div className="friends-section">
      <h3>친구 관리</h3>
      <div className="button-container">
        <button className="request-button" onClick={() => setView('friendsList')}>
          친구 목록
        </button>
        <button className="request-button" onClick={() => setView('friendsRequest')}>
          친구 추가
        </button>
        <button className="request-button" onClick={() => setView('pendingRequests')}>
          친구 요청
        </button>
      </div>
      
      {/* 각각의 폼이 버튼에 따라 슬라이드 */}
      {view === 'friendsList' && <FriendsList hostId={hostId} setHostId={setHostId} isOpen={view === 'friendsList'} />}
      {view === 'friendsRequest' && <FriendsRequest isOpen={view === 'friendsRequest'} />}
      {view === 'pendingRequests' && <PendingRequests isOpen={view === 'pendingRequests'} />}
    </div>
  );
}

export default FriendsSection;
