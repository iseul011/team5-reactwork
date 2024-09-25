import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VoteCreate.css';

function VoteCreate() {
    const [isOpenToAllFriends, setIsOpenToAllFriends] = useState(true);  // 전체 친구 참여 여부 (초기값을 전체 참여로 설정)
    const [isAnonymous, setIsAnonymous] = useState(false);  // 익명 투표 여부
    const [endTime, setEndTime] = useState('');
    const [creatorId, setCreatorId] = useState('');
    const [voteTitle, setVoteTitle] = useState(''); // 투표 제목 상태 추가
    const [selectedWalkingCourses, setSelectedWalkingCourses] = useState([]); // 선택된 산책로 목록
    const [selectedRegion, setSelectedRegion] = useState(''); // 선택된 지역
    const [subRegions, setSubRegions] = useState([]); // 소속 지역 목록
    const [filteredSubRegions, setFilteredSubRegions] = useState([]); // 필터링된 소속 지역 목록
    const [walkingCourses, setWalkingCourses] = useState([]); // 산책로 후보 목록
    const [selectedCourseDetails, setSelectedCourseDetails] = useState(null); // 선택된 산책로 상세 정보
    const [regions] = useState([ // 지역 목록
        '강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '세종',
        '울산', '인천', '전남', '전북', '제주', '충남', '충북'
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 산책로 모달 창 상태

    const [isFriendModalOpen, setIsFriendModalOpen] = useState(false); // 친구 선택 모달 창 상태
    const [friends, setFriends] = useState([]); // 친구 목록
    const [selectedFriends, setSelectedFriends] = useState([]); // 선택된 친구 목록
    const [friendSearchResults, setFriendSearchResults] = useState([]); // 친구 검색 결과 목록

    // 소속 지역 변경 처리 함수
    const handleRegionChange = (e) => {
        const region = e.target.value;
        setSelectedRegion(region);

        if (region) {
            axios.get(`/api/walking/subregions/${region}`)
                .then(response => {
                    setSubRegions(response.data);
                    setFilteredSubRegions(response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            setSubRegions([]);
            setFilteredSubRegions([]);
        }
    };

    // 소속 지역 변경 시 산책로 목록 가져오기
    const handleSubRegionChange = (e) => {
        const subRegion = e.target.value;
        fetchWalkingCourse(subRegion);
    };

    const fetchWalkingCourse = (subRegion) => {
        axios.get('/api/walking/courses', {
            params: { subRegion: subRegion }
        })
            .then(response => {
                setWalkingCourses(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // 산책로 후보 추가
    const handleAddCourse = (course) => {
        if (!selectedWalkingCourses.some(c => c.esntlId === course.esntlId)) {
            setSelectedWalkingCourses([...selectedWalkingCourses, course]);
        }
        setIsModalOpen(false); // 모달 닫기
    };

    const handleCourseClick = (courseId) => {
        axios.get(`/api/walking/courses/${courseId}`)
            .then(response => {
                setSelectedCourseDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching course details:', error);
            });
    };
    
    // 친구 목록 불러오기
    useEffect(() => {
        axios.get('/friends/total', {
            params: { memId: localStorage.getItem('id') }, // 실제 로그인된 사용자 ID
        })
        .then(response => {
            console.log('친구 목록을 받았습니다:', response.data); // 서버에서 받은 데이터 확인
            setFriends(response.data); // 친구 목록 설정
            setFriendSearchResults(response.data); // 기본적으로 친구 목록 전체를 검색 결과로 표시
        })
        .catch(error => {
            console.error('친구 목록 불러오기 오류:', error);
        });
    }, []);

     // 친구 선택 시 선택된 친구 목록에 추가하는 함수
     const handleAddFriend = (friend) => {
         setSelectedFriends(prevSelectedFriends => {
             // 중복된 친구가 있는지 확인 (id로 비교)
             if (!prevSelectedFriends.some(f => f.id === friend.id)) {
                 console.log(friend);
                 return [...prevSelectedFriends, friend];  // 새로운 친구 목록 반환
                }
                console.log('selectedFriends : ', [...prevSelectedFriends, friend]);  // 추가된 친구 목록 로그 출력
            return prevSelectedFriends;  // 중복된 경우 이전 목록 반환
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // 새로운 투표 객체 생성
        const newVote = {
            memId: localStorage.getItem("id"),
            voteTitle: voteTitle || "제목",  // 투표 제목
            isOpenToAllFriends: isOpenToAllFriends,  // 전체 친구 참여 여부
            isAnonymous: isAnonymous,  // 익명 투표 여부
            endTime: endTime ? `${endTime}T00:00:00` : "2024-09-25T00:00:00",  // 종료 시간을 LocalDateTime 형식으로 변환
            creatorId: creatorId || "user01",  // 생성자 ID
            walkCourseName: selectedWalkingCourses[0]?.walkCourseName || '기본 산책로',  // 선택된 첫 번째 산책로 이름 또는 기본값
            friends: selectedFriends.length ? selectedFriends : ['defaultFriend'],  // 친구 목록
            isEnded: false
        };
    
        // 요청 데이터 콘솔에 출력 (로그를 확인해 서버와 데이터 구조를 비교)
        console.log("Sending vote data:", JSON.stringify(newVote));
    
        // 서버로 POST 요청
        axios.post('/votes/create', newVote, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            alert('투표가 성공적으로 생성되었습니다.');
        })
        .catch(error => {
            console.error('투표 생성 중 오류 발생:', error.response.data);  // 오류 응답 데이터를 확인
        });
    };

    return (
        <div className='voteBox'>
            <form onSubmit={handleSubmit}>
                <h2>투표 생성</h2>

                {/* 투표 제목 입력 */}
                <div>
                    <label>투표 제목:</label>
                    <input
                        type="text"
                        value={voteTitle}
                        onChange={(e) => setVoteTitle(e.target.value)}
                        placeholder="투표 제목을 입력하세요"
                    />
                </div>

                {/* 산책로 선택 */}
                <div>
                    <h3>산책로 후보 선택</h3>
                    {/* 선택된 산책로 목록 */}
                    <ul>
                        {selectedWalkingCourses.map(course => (
                            <li key={course.esntlId}>{course.walkCourseName}</li>
                        ))}
                    </ul>
                    {/* 산책로 후보 추가 버튼 */}
                    <button type="button" onClick={() => setIsModalOpen(true)}>
                        산책로 후보 추가
                    </button>
                </div>

                {/* 투표 종료 시간 */}
                <div>
                    <label>투표 종료 시간 (선택):</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>

                
                     {/* 전체 친구 참여 여부 */}
                <div className='checklist'>
                    <div>
                        <label>
                            <input
                                type="radio"
                                checked={isOpenToAllFriends}
                                onChange={() => setIsOpenToAllFriends(true)}
                            />
                            전체 친구 참여
                        </label>
                        <label>
                            <input
                                type="radio"
                                checked={!isOpenToAllFriends}
                                onChange={() => setIsOpenToAllFriends(false)}
                            />
                            선택 친구 참여
                        </label>
                        {/* 친구 선택하기 버튼 */}
                        {!isOpenToAllFriends && (
                            <div>
                                <button type="button" onClick={() => setIsFriendModalOpen(true)}>
                                    참여할 친구 선택하기
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 익명 투표 여부 */}
                    <div>
                        <label>익명 투표 여부:</label>
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                    </div>
                </div>

                {/* 투표 생성 버튼 */}
                <button type="submit">투표 생성하기</button>
            </form>

            {/* 산책로 후보 추가 모달 */}
            {isModalOpen && (
                <div className="vote-modal">
                    <div className="vote-modal-content">
                        <h3>산책로 검색</h3>
                        <div>
                            <label htmlFor="region-select">지역 선택:</label>
                            <select
                                id="region-select"
                                value={selectedRegion}
                                onChange={handleRegionChange}
                            >
                                <option value="">-- 지역 선택 --</option>
                                {regions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>
                        {selectedRegion && (
                            <div>
                                <label htmlFor="subregion-select">소속 지역 선택:</label>
                                <select
                                    id="subregion-select"
                                    onChange={handleSubRegionChange}
                                >
                                    <option value="">-- 소속 지역 선택 --</option>
                                    {filteredSubRegions.map(subRegion => (
                                        <option key={subRegion} value={subRegion}>{subRegion.slice(3)}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <h2>산책로 목록</h2>
                            <ul>
                                {walkingCourses.length > 0 ? (
                                    walkingCourses.map((course, index) => (
                                        <li key={index}>
                                            {course.walkCourseName}
                                            <button onClick={() => handleAddCourse(course)}>추가</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>검색된 산책로가 없습니다.</li>
                                )}
                            </ul>
                        </div>
                        <button onClick={() => setIsModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}

             {/* 친구 선택 모달 */}
             {isFriendModalOpen && (
                <div className="vote-modal">
                    <div className="vote-modal-content">
                        <h3>친구 검색 및 선택</h3>
                        
                        <div className="friend-list">
                            <h4>친구 목록</h4>
                            <ul>
                                {friendSearchResults.length > 0 ? (
                                    friendSearchResults.map(friend => (
                                        <li key={friend.id}>
                                            {friend.friendId}
                                            <button onClick={() => handleAddFriend(friend)}>추가</button>
                                        </li>
                                    ))
                                ) : (
                                    <li>검색된 친구가 없습니다.</li>
                                )}
                            </ul>
                        </div>
                        <button onClick={() => setIsFriendModalOpen(false)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VoteCreate;
