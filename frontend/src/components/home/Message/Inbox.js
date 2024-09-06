import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inbox = () => {
  const [messages, setMessages] = useState([]);  // 받은 메시지 상태
  const [newMessages, setNewMessages] = useState(false);  // 새로운 메시지 확인 상태

  // 메시지 조회 함수
  const fetchMessages = () => {
    axios.get(`/api/messages/received/user02`)
      .then(response => {
        setMessages(response.data);
        if (response.data.length > 0) {
          setNewMessages(true);  // 새 메시지 알림 설정
        }
      })
      .catch(error => console.error("Error fetching messages:", error));
  };

  // 페이지 로드 시 받은 메시지 불러오기
  useEffect(() => {
    fetchMessages();
  }, []);

  // 메시지가 로드되었는지 확인하고 렌더링
  if (!messages || messages.length === 0) {
    return <div>메시지가 없습니다.</div>;
  }

  // 메시지 삭제 함수
  const deleteMessage = (mNum) => {
    axios.delete(`/api/messages/delete/${mNum}`)
      .then(() => {
        fetchMessages();  // 삭제 후 목록 새로고침
      })
      .catch(error => console.error("Error deleting message:", error));
  };

  // 새로운 메시지 읽음 처리
  const markMessagesAsRead = () => {
    setNewMessages(false);  // 새로운 메시지 알림 제거
  };

  return (
    <div>
      <h2>쪽지함</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>  
            {/* memId가 존재하는지 확인한 후 출력 */}
            {message && message.memId ? message.memId : "발신자 정보 없음"}: {message && message.mContent ? message.mContent : "내용 없음"} ({message.createSysdate})&emsp;
            <button onClick={() => deleteMessage(message.mNum)}>삭제</button> {/* 삭제 버튼 */}
          </div>
        ))}
      </div>

      {/* 새로운 메시지 알림 */}
      {newMessages && (
        <div style={{ color: 'red' }}>
          <p>You have new messages!</p>
          <button onClick={markMessagesAsRead}>Mark as Read</button> {/* 읽음 처리 버튼 */}
        </div>
      )}
      
      <div class="moveTopBtn">맨 위로</div>
      <div class="moveBottomBtn">맨 아래로</div>

    </div>
  );
}

export default Inbox;
