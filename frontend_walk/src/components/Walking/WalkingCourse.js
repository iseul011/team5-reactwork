// import axios from 'axios';
// import React, { useState, useEffect} from 'react';
// import './WalkingCourse.css';
// import { useNavigate, Navigate  } from 'react-router-dom';

// function WalkingCourse() {
//     const [selectedRegion, setSelectedRegion] = useState('');
//     const [subRegions, setSubRegions] = useState([]);
//     const [filteredSubRegions, setFilteredSubRegions] = useState([]);
//     const [walkingCourses, setWalkingCourses] = useState([]);
//     const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
//     const [regions] = useState([
//         '강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '세종',
//         '울산', '인천', '전남', '전북', '제주', '충남', '충북'
//     ]);
//     // 투표버튼 드랍
//     const [dropdownVisible, setDropdownVisible] = useState(false);
//     const navigate = useNavigate();
//     const handleRegionChange = (e) => {
//         const region = e.target.value;
//         setSelectedRegion(region);

//         if (region) {
//             axios.get(`/api/walking/subregions/${region}`)
//                 .then(response => {
//                     setSubRegions(response.data);
//                     setFilteredSubRegions(response.data);
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//         } else {
//             setSubRegions([]);
//             setFilteredSubRegions([]);
//         }
//     };

//     const handleSubRegionChange = (e) => {
//         const subRegion = e.target.value;
//         fetchWalkingCourse(subRegion);
//     };

//     const fetchWalkingCourse = (subRegion) => {
//         axios.get('/api/walking/courses', {
//             params: { subRegion: subRegion }
//         })
//             .then(response => {
//                 setWalkingCourses(response.data);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//     };

//     const handleCourseClick = (courseId) => {
//         axios.get(`/api/walking/courses/${courseId}`)
//             .then(response => {
//                 setSelectedCourseDetails(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching course details:', error);
//             });
//     };

//     const handleViewVotes = () => {
//         // 투표 목록 창으로 이동하는 로직
//         window.location.href = '/votes'; // 또는 navigate('/votes') 같은 방법으로 이동
//     };

//     const handleCreateVote = () => {
//         // 투표 생성 페이지로 이동하는 로직
//         window.location.href = '/create-vote'; // 또는 navigate('/create-vote') 같은 방법으로 이동
//     };

//     useEffect(() => {
//         if (selectedRegion) {
//             setFilteredSubRegions(subRegions.filter(subRegion => subRegion !== selectedRegion));
//         } else {
//             setFilteredSubRegions(subRegions);
//         }
//     }, [selectedRegion, subRegions]);

//     //투표 드랍 기능
//     const toggleDropdown = () => {
//         setDropdownVisible(!dropdownVisible);
//     };

//     const handleVoteCreate = () => {
//         navigate(`/vote-create/${localStorage.getItem("id")}`); // 경로가 정확한지 확인
//     };

//     const VoteList = () => {
//         navigate(`/VoteList/${localStorage.getItem("id")}`);
//     };

//     return (
//         <div className='walking-Box'>
//             <div className='walking-search'>
//                 <h1>산책로 검색</h1>
                
//                 <div>
//                     <label htmlFor="region-select">지역 선택:</label>
//                     <select
//                         id="region-select"
//                         value={selectedRegion}
//                         onChange={handleRegionChange}
//                     >
//                         <option value="">-- 지역 선택 --</option>
//                         {regions.map(region => (
//                             <option key={region} value={region}>{region}</option>
//                         ))}
//                     </select>
//                 </div>
                
//                 {selectedRegion && (
//                     <div>
//                         <label htmlFor="subregion-select">소속 지역 선택:</label>
//                         <select
//                             id="subregion-select"
//                             onChange={handleSubRegionChange}
//                         >
//                             <option value="">-- 소속 지역 선택 --</option>
//                             {filteredSubRegions.map(subRegion => (
//                                 <option key={subRegion} value={subRegion}>{subRegion.slice(3)}</option>
//                             ))}
//                         </select>
//                     </div>
//                 )}
//                 <div>
//                     <h2>산책로 목록</h2>
//                     <ul>
//                         {walkingCourses.length > 0 ? (
//                             walkingCourses.map((course, index) => (
//                                 <li key={index} onClick={() => handleCourseClick(course.esntlId)}>
//                                     {course.walkCourseName}
//                                 </li>
//                             ))
//                         ) : (
//                             <li>검색된 산책로가 없습니다.</li>
//                         )}
//                     </ul>
//                 </div>
                
//             </div>
            
//             <div className='detailWalking'>
//                 <h2>상세정보</h2>
//                 {selectedCourseDetails ? (
//                     <table>
//                         <tbody>
//                             <tr>
//                                 <td className='walkCourseName' colSpan={7} style={{textAlign:'center'}}>{selectedCourseDetails.walkCourseName}</td>
//                             </tr>
//                             <tr>
//                                 <td>난이도</td><td className='courseLevelName'>{selectedCourseDetails.courseLevelName}</td>
//                                 <td className='courseLengthContent'>길이</td><td >{selectedCourseDetails.courseLengthContent}</td>
//                                 <td  className='courseTimeContent'>소요 시간</td><td>{selectedCourseDetails.courseTimeContent}</td>
//                             </tr>
//                             <tr>
//                                 <td>주소</td><td className='address' colSpan={7}>{selectedCourseDetails.address}</td>
//                             </tr>
//                             <tr>
//                                 <td>산책 경로</td><td className='courseDescription' colSpan={7}>{selectedCourseDetails.courseDescription.replace(/(\?|\-|\~)/g, match => {
//                                     if (match === '?') return '→';
//                                     if (match === '-') return '→';
//                                     if (match === '~') return '→';
//                                     return match; // 경로간 특수문자를 화살표 하나로 통일후 반환
//                                     })}</td>
//                             </tr>
//                             <tr>
//                                 <td>설명</td><td className='additionalDescription' colSpan={7}>{selectedCourseDetails.additionalDescription}</td>
//                             </tr>
//                             <tr>
//                                 <td>참고사항</td><td className='optionDescription' colSpan={7}>{selectedCourseDetails.optionDescription}</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p>상세 정보를 선택해 주세요.</p>
//                 )}
//             </div>

//             {/* 투표 버튼과 드롭다운 메뉴 */}
//             <div className="vote">
//                 <button className="vote-button" onClick={toggleDropdown}>🗳</button>
//                 <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
//                     <button onClick={handleVoteCreate}>투표 생성하기</button>
//                     <button onClick={VoteList}>투표 목록</button>
//                 </div>
//             </div>
            
//         </div>
//     );
// }

// export default WalkingCourse;

import axios from 'axios';
import React, { useState, useEffect} from 'react';
import './WalkingCourse.css';
import { useNavigate, Navigate  } from 'react-router-dom';

function WalkingCourse() {
    const [selectedRegion, setSelectedRegion] = useState('');
    const [subRegions, setSubRegions] = useState([]);
    const [filteredSubRegions, setFilteredSubRegions] = useState([]);
    const [walkingCourses, setWalkingCourses] = useState([]);
    const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
    const [regions] = useState([
        '강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '세종',
        '울산', '인천', '전남', '전북', '제주', '충남', '충북'
    ]);
    // 투표버튼 드랍
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const [map, setMap] = useState(null);

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

    const handleCourseClick = (courseId) => {
        axios.get(`/api/walking/courses/${courseId}`)
            .then(response => {
                setSelectedCourseDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching course details:', error);
            });
    };

    const geocodeAndPlaceMarker = (waypoint, mapInstance, startingLocation) => {
        axios.get(`https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode`, {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': 'xjh0qjchu1',
                'X-NCP-APIGW-API-KEY': 'gQ9Y0qAjF5jzPKikn2a7pAkUlqgb53PKK97kwXB3'
            },
            params: {
                query: waypoint
            }
        })
        .then(response => {
            const result = response.data.addresses[0];
            if (result) {
                const lat = result.y;
                const lng = result.x;

                // 각 지점에 마커 추가
                new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(lat, lng),
                    map: mapInstance,
                    title: waypoint
                });

                // 선택적으로 경로(폴리라인) 그리기
                new window.naver.maps.Polyline({
                    path: [
                        new window.naver.maps.LatLng(startingLocation.lat, startingLocation.lng),
                        new window.naver.maps.LatLng(lat, lng)
                    ],
                    strokeColor: '#5347AA',
                    strokeWeight: 5,
                    map: mapInstance
                });
            }
        })
        .catch(error => {
            console.error('지오코딩 데이터를 가져오는 중 오류 발생:', error);
        });
    };

    const handleViewVotes = () => {
        // 투표 목록 창으로 이동하는 로직
        window.location.href = '/votes'; // 또는 navigate('/votes') 같은 방법으로 이동
    };

    const handleCreateVote = () => {
        // 투표 생성 페이지로 이동하는 로직
        window.location.href = '/create-vote'; // 또는 navigate('/create-vote') 같은 방법으로 이동
    };

    useEffect(() => {
        if (selectedCourseDetails && selectedCourseDetails.startLat && selectedCourseDetails.startLng) {
            const mapOptions = {
                center: new window.naver.maps.LatLng(selectedCourseDetails.startLat, selectedCourseDetails.startLng),
                zoom: 10
            };

            const mapInstance = new window.naver.maps.Map('map', mapOptions);
            setMap(mapInstance);

            // 시작 지점에 마커 추가
            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(selectedCourseDetails.startLat, selectedCourseDetails.startLng),
                map: mapInstance,
                title: 'Start Point'
            });

            // 중간 지점 및 경유지 마커 추가
            if (selectedCourseDetails.middlePlaces) {
                selectedCourseDetails.middlePlaces.forEach(waypoint => {
                    geocodeAndPlaceMarker(waypoint, mapInstance, {
                        lat: selectedCourseDetails.startLat,
                        lng: selectedCourseDetails.startLng
                    });
                });
            }
        }
    }, [selectedCourseDetails]);

    //투표 드랍 기능
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleVoteCreate = () => {
        navigate(`/vote-create/${localStorage.getItem("id")}`); // 경로가 정확한지 확인
    };

    const VoteList = () => {
        navigate(`/VoteList/${localStorage.getItem("id")}`);
    };

    return (
        <div className='walking-Box'>
            <div className='walking-search'>
                <h1>산책로 검색</h1>
                
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
                                <li key={index} onClick={() => handleCourseClick(course.esntlId)}>
                                    {course.walkCourseName}
                                </li>
                            ))
                        ) : (
                            <li>검색된 산책로가 없습니다.</li>
                        )}
                    </ul>
                </div>
                
            </div>
            
            <div className='detailWalking'>
                <h2>상세정보</h2>
                {selectedCourseDetails ? (
                    <table>
                        <tbody>
                            <tr>
                                <td className='walkCourseName' colSpan={7} style={{textAlign:'center'}}>{selectedCourseDetails.walkCourseName}</td>
                            </tr>
                            <tr>
                                <td>난이도</td><td className='courseLevelName'>{selectedCourseDetails.courseLevelName}</td>
                                <td className='courseLengthContent'>길이</td><td >{selectedCourseDetails.courseLengthContent}</td>
                                <td  className='courseTimeContent'>소요 시간</td><td>{selectedCourseDetails.courseTimeContent}</td>
                            </tr>
                            <tr>
                                <td>주소</td><td className='address' colSpan={7}>{selectedCourseDetails.address}</td>
                            </tr>
                            <tr>
                                <td>산책 경로</td><td className='courseDescription' colSpan={7}>{selectedCourseDetails.courseDescription.replace(/(\?|\-|\~)/g, match => {
                                    if (match === '?') return '→';
                                    if (match === '-') return '→';
                                    if (match === '~') return '→';
                                    return match; // 경로간 특수문자를 화살표 하나로 통일후 반환
                                    })}</td>
                            </tr>
                            <tr>
                                <td>설명</td><td className='additionalDescription' colSpan={7}>{selectedCourseDetails.additionalDescription}</td>
                            </tr>
                            <tr>
                                <td>지도</td>
                                <td className='additionalDescription' colSpan={7}>
                                    <div id="map" style={{ width: '100%', height: '400px' }}></div>
                                </td>
                            </tr>
                            <tr>
                                <td>참고사항</td><td className='optionDescription' colSpan={7}>{selectedCourseDetails.optionDescription}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p>상세 정보를 선택해 주세요.</p>
                )}
            </div>

            {/* 투표 버튼과 드롭다운 메뉴 */}
            <div className="vote">
                <button className="vote-button" onClick={toggleDropdown}>🗳</button>
                <div className={`dropdown-menu ${dropdownVisible ? 'show' : ''}`}>
                    <button onClick={handleVoteCreate}>투표 생성하기</button>
                    <button onClick={VoteList}>투표 목록</button>
                </div>
            </div>
            
        </div>
    );
}

export default WalkingCourse;

