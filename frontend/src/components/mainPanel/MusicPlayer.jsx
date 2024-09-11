// // src/components/MusicPlayer.js
// import React, { useState } from 'react';
// import ReactPlayer from 'react-player'; // react-player를 import
// import './MusicPlayer.css';

// function MusicPlayer() {
//   const [playing, setPlaying] = useState(false); // 재생 상태를 관리

//   const handlePlayPause = () => {
//     setPlaying(!playing); // 재생 및 일시정지 상태 전환
//   };

//   return (
//     <div className="music-player">
//       {/* react-player 컴포넌트 */}
//       <ReactPlayer
//         url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // 재생할 오디오 파일 URL
//         playing={playing} // 재생 상태
//         controls={true} // 플레이어 기본 컨트롤 표시
//         width="100%" // 플레이어 너비
//         height="50px" // 플레이어 높이
//       />
//       <div className="player-controls">
//         <button onClick={handlePlayPause}>
//           {playing ? '⏸️ Pause' : '▶️ Play'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MusicPlayer;

import React, { useState } from "react";
import MusicPlayerHandle from "../music/MusicPlayerHandle";
import allMusic from "../music/musicData";  // 음악 데이터를 가져옴

function  MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 재생/일시정지 버튼 클릭 시 호출되는 함수
  const handlePlayPauseClick = () => {
    setIsPlaying(prev => !prev);
  };

  // 다음 곡 또는 이전 곡 버튼 클릭 시 호출되는 함수
  const handleNextPrevClick = (next) => {
    setCurrentSongIndex(prevIndex => {
      let newIndex = next ? prevIndex + 1 : prevIndex - 1;
      if (newIndex < 0) newIndex = allMusic.length - 1;
      if (newIndex >= allMusic.length) newIndex = 0;
      return newIndex;
    });
    setIsPlaying(true);
  };

  // 특정 곡을 선택했을 때 호출되는 함수
  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);  // 선택한 곡의 인덱스로 설정
    setIsPlaying(true);  // 곡을 선택하면 자동으로 재생 상태로 전환
  };

  return (
    <div className="MusicPlayer">
      <div className="wrap__music">
        <MusicPlayerHandle
          currentSong={allMusic[currentSongIndex]}  // 현재 재생 중인 곡의 데이터를 전달
          isPlaying={isPlaying}  // 재생 상태를 전달
          onPlayPauseClick={handlePlayPauseClick}  // 재생/일시정지 버튼 클릭 이벤트 핸들러를 전달
          onNextPrevClick={handleNextPrevClick}  // 다음/이전 곡 버튼 클릭 이벤트 핸들러를 전달
          allMusic={allMusic}  // 전체 음악 목록 전달
          currentSongIndex={currentSongIndex}  // 현재 곡 인덱스 전달
          onSongSelect={handleSongSelect}  // 곡 선택 핸들러 전달
        />
      </div>
    </div>
  );
}

export default MusicPlayer;

