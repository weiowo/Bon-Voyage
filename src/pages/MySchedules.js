/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-shadow */
import styled from 'styled-components/macro';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState, useContext } from 'react';
import {
  getDoc, doc, query, where, collection, getDocs, arrayUnion, setDoc, updateDoc,
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import db from '../utils/firebase-init';
import GreyHeaderComponent from '../components/GreyHeader';
import UserContext from '../components/UserContextComponent';
import Member1 from './images/member1.png';
import Member2 from './images/member2.png';
import Member3 from './images/member3.png';
import Member4 from './images/member4.png';
import Member5 from './images/member5.png';
import Member6 from './images/member6.png';
import Member7 from './images/member7.png';
import Member8 from './images/member8.png';
import Member9 from './images/member9.png';
import Member10 from './images/member10.png';
import SquareCover1 from './images/schedule_cover_square1.jpg';
import SquareCover2 from './images/schedule_cover_square2.jpg';
import SquareCover3 from './images/schedule_cover_square3.jpg';
import SquareCover4 from './images/schedule_cover_square4.jpg';
import SquareCover5 from './images/schedule_cover_square5.jpg';
import SquareCover6 from './images/schedule_cover_square6.jpg';
import RecCover3 from './images/schedule_cover_rec3.jpg';
import ProfileSideBarElement from '../components/ProfileSideBar';

export const PageWrapper = styled.div`
width:100vw;
height:calc(100vh-60px);
display:flex;
padding-top:60px;
`;

// const ProfileSideBar = styled.div`
// width:20vw;
// height:calc(100vh-40px);
// display:flex;
// flex-direction:column;
// align-items:center;
// margin-top:60px;
// `;

// const SideNavBar = styled.div`
// margin-top:60px;
// height:auto;
// width:auto;
// display:flex;
// flex-direction:column;
// gap:30px;
// `;

// const UserPhoto = styled.img`
// width:30px;
// height:30px;
// border-radius:50%;
// margin-left:23px;
// `;

// const UserName = styled.div`
// font-size:15px;
// font-weight:600;
// margin-left:15px;
// `;

// const NavBarChoice = styled.div`
// font-weight:600;
// font-size:15px;
// color:grey;
// `;

export const Line = styled.div`
display:flex;
width:1.8px;
height:85vh;
background-color:#D3D3D3;
align-items:center;
margin-top:20px;
`;

const ChoicesWrapper = styled.div` 
width:33vw;
height:90vh;
display:flex;
flex-direction:column;
align-items:center;
gap:20px;
overflow:scroll;
height:calc(100vh-80px);
`;

const MySchedulesTitleAndCreateNewScheduleArea = styled.div`
display:flex;
width:26vw;
height:auto;
align-items:flex-end;
gap:20px;
margin-top:30px;
justify-content:left;
margin-bottom:15px;
`;

const MyScheduleTitle = styled.div`
font-weight:700;
font-size:25px;
height:30px;
`;

const CreateNewScheduleButton = styled.button`
width:80px;
height:20px;
background-color:#1c2e4a;
color:white;
border-radius:3px;
border:none;
font-size:12px;
font-weight:500;
`;

const PhotoInExistedSchedule = styled.img`
width:100px;
height:100px;
border-radius:20px;
`;

const ExistedSchedule = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
width:26vw;
height:140px;
gap:20px;
// border:1px black solid;
padding-left:10px;
padding-right:10px;
padding-top:10px;
padding-bottom:10px;
border-radius:16px;
// background-color:#e7f5fe;
background-color:${(props) => (props.isSelected ? '#E6D1F2' : '#e7f5fe')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const ExistedScheuleTitle = styled.div`
width:180px;
height:auto;
text-align:left;
font-weight:550;

`;

const Button = styled.button`
height:25px;
width:50px;
// background-color:#296D98;
border:1px solid #296D98;
color:#296D98;
border-radius:15px;
font-weight:500;
cursor:pointer;
`;

const SelectedScheduleWrapper = styled.div`
width:40vw;
height:auto;
display:flex;
flex-direction:column;
align-items:left;
margin-left:50px;
gap:15px;
`;

// const CalendarStyle = styled.div`
// height:200px;
// width:200px;
// `;

const SelectedSchedulePhoto = styled.div`
padding-left:15px;
padding-bottom:10px;
opacity:1;
flex-direction:column;
justify-content:flex-end;
background-image: url(${RecCover3});
width:35vw;
height:12vw;
position:relative;
border-radius:20px;
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
position:relative;
`;

const SelectedScheduleTitle = styled.div`
color:white;
font-weight:800;
font-size:30px;
position:absolute;
bottom:20px;
`;

const ScheduleMemberContainer = styled.div`
display:flex;
align-items:center;
width:35vw;
height:auto;
gap:15px;
margin-top:8px;
margin-bottom:8px;
`;

const ScheduleMemberWord = styled.div`
align-items:center;
justify-content:center;
width:50px;
font-size:25px;
font-weight:600;
height:50px;
color:white;
border-radius:50%;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
display:${(props) => (props.hovered ? 'flex' : 'none')};
cursor:pointer;
`;

const ScheduleMemberPhoto = styled.img`
width:50px;
height:50px;
border-radius:50%;
border:1px solid grey;
text-align:center;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
display:${(props) => (props.hovered ? 'none' : 'block')};
cursor:pointer;
`;

const StyledLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:yellow;
border:none;
`;

const InviteFriendBox = styled.div`
width:15vw;
height:267px;
border-radius:5px; 
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const InviteFriendTitle = styled.div`
width:100%;
height:60px;
border-top-right-radius:5px;
border-top-left-radius:5px;
background-color: #618CAC;
color:white;
display:flex;
align-items:center;
justify-content:center;
font-weight:600;
`;

const CalendarStyle = styled.div`
border:none;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

`;

const InviteFriendInput = styled.input`
border:none;
font-size:16px;
padding-left:3px;
width:80%;
border-bottom:1px solid black;
outline:none;
margin-top:20px;
`;

const InviteFriendBelowArea = styled.div`
display:${(props) => (props.active ? 'flex' : 'none')};
flex-direction:column;
align-items:center;
gap:30px;
justify-content:center;
`;

const ConfirmSearchButton = styled.button`
width:80px;
height:25px;
border-radius:8px;
background-color:#296D98;
color:white;
font-weight:500;
font-size:13px;
border:none;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
`;

function MySchedules() {
  const user = useContext(UserContext);
  console.log('我在MySchedulesComponents唷', user);
  const [schedules, setSchedules] = useImmer([]);
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [selectedScheduleMembers, setSelectedScheduleMembers] = useState([]);
  const [searchFriendValue, setSearchFriendValue] = useState();
  const [searchedFriendId, setSearchedFriendId] = useState();
  console.log(selectedScheduleMembers);
  const [showMemberWord, setShowMemberWord] = useState(false);
  const [showMemberPhoto, setShowMemberPhoto] = useState(false);
  const [searchInputIsActive, setSearchInputIsActive] = useState(true);
  const [searchResultIsActive, setSearchResultIsActive] = useState(false);
  console.log(searchInputIsActive);
  console.log(searchResultIsActive);
  // const [searchIsActive, setSearchIsActive] = useState(false);
  const navigate = useNavigate();
  // const [isSelected, setIsSelected] = useState(false);
  // const [targetIndex, setTargetIndex] = useState(null);

  // function changeColor(index) {
  //   if (index === targetIndex) {
  //     setIsSelected(true);
  //   }
  // }

  // 先拿到某個使用者的資料
  // 再根據行程array，去做foreach拿到所有schedule資料

  useEffect(() => {
    async function getUserArrayList() {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().owned_schedule_ids);
      } else {
        console.log('No such document!');
      }
      function getSchedulesFromList() {
        docSnap.data().owned_schedule_ids.forEach(async (item, index) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            console.log('這位使用者的行程', index, Snap.data());
            setSchedules((draft) => {
              draft.push(Snap.data());
            });
          } else {
            console.log('沒有這個行程！');
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setSchedules, user.uid]);

  // 刪除行程
  function DeleteScheduleOfTheUser(targetDeleteIndex) {
    console.log('刪除這個行程囉！');
    setSchedules(schedules.filter(
      (item, index) => index !== targetDeleteIndex,
    ));
  }

  // 拿點到的這則行程的id去搜尋哪個user schedule array list有包含這個schedule id

  useEffect(() => {
    if (!selectedSchedule) { return; }
    async function getArray() {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('owned_schedule_ids', 'array-contains', selectedSchedule?.schedule_id));
      const userData = await getDocs(q);
      const members = [];
      userData.forEach((doc) => {
        console.log('這些人有參加這行程唷', doc.data());
        members.push(doc.data());
      });
      console.log(members);
      setSelectedScheduleMembers(members);
    }
    getArray();
  }, [selectedSchedule?.schedule_id, selectedSchedule]);

  // 點到換色
  // function selectAndChangeColor(targetIndex) {
  //   if (targetIndex === index) {
  //     setIsSelected(true);
  //   }
  // }

  // 拿到所有的schedule資料並詢問要編輯哪一個行程，或者要創建新的行程
  // async function getSchedule() {
  //   const querySnapshot = await getDocs(collection(db, 'schedules'));
  //   const scheduleList = querySnapshot.docs.map((item) => item.data());
  //   setSchedules(scheduleList);
  // }

  // 拿到點按下去的那筆行程
  async function getSelectedSchedule(id) {
    const docRef = doc(db, 'schedules', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data()); // docSnap.data()是需要取用的那筆資料
      setSelectedSchedule(docSnap.data()); // 放進state中
    } else {
    // doc.data() will be undefined in this case
      console.log('沒有這個行程！');
    }
  }

  console.log('從state拿到使用者點的那個行程囉!', selectedSchedule, new Date(selectedSchedule?.embark_date));

  const colorArray = ['#618CAC', '#A9B7AA', '#7A848D', '#976666', '#A0C1D2'];

  const photoArray = [Member1, Member2,
    Member3, Member4, Member5, Member6, Member7, Member8, Member9, Member10];

  // 06/30更新
  // user按下「撰寫旅程回憶」的時候就要從database拿此筆行程資訊，做成新的article
  // 並創造到articles database那邊，然後把這個id推到他的「owned_article_array」
  // 到編輯頁面的時候再從articles去抓這篇下來做編輯（加入status為draft或published的key）

  const newArticle = {
    status: 'draft',
    cover_img: '',
    summary: '',
    article_creator_user_id: user.uid,
    schedule_id: selectedSchedule?.schedule_id,
    article_id: '',
    article_title: selectedSchedule?.title,
    trip_days: selectedSchedule?.trip_days.map((item) => (
      {
        places: item?.places?.map((placeItem) => (
          {
            place_title: placeItem?.place_title,
            place_description: '',
            place_imgs: [],
          }
        )),
      }
    )),
  };

  console.log(newArticle || '');

  async function setNewArticleToDb() {
    console.log('您創了一筆新的遊記唷！');
    const createArticleData = doc(collection(db, 'articles'));
    await setDoc(
      createArticleData,
      ({ ...newArticle, article_id: createArticleData.id }),
    );
    navigate({ pathname: '/edit', search: `?art_id=${createArticleData.id}&sch_id=${selectedSchedule?.schedule_id}` });
    const userOwnedArticlesArray = doc(db, 'users', user.uid);
    await updateDoc(userOwnedArticlesArray, {
      owned_article_ids: arrayUnion(createArticleData.id),
    });
  }

  // 搜尋朋友是否有在這網站

  async function submitSearch() {
    setSearchFriendValue('');
    const userEmailQuery = query(collection(db, 'users'), where('email', '==', searchFriendValue));
    const querySnapShot = await getDocs(userEmailQuery);
    if (querySnapShot.size === 0) {
      console.log('查無此人！');
    } else {
      querySnapShot.forEach((doc) => {
        console.log('有這個人唷！', doc.id, '=>', doc.data());
        setSearchedFriendId(doc.id);
      });
    }
  }

  // 確認把朋友加到這個行程中

  async function addFriendToTheSchedule() {
    const searchedFriendScheduleArray = doc(db, 'users', searchedFriendId);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(searchedFriendScheduleArray, {
      owned_schedule_ids: arrayUnion(selectedSchedule?.schedule_id),
    });
  }

  // const selectedSchedulePhotoArray =
  // [RecCover1, RecCover2, RecCover3, RecCover4, RecCover5, RecCover6];
  const schedulePhotoArray = [SquareCover1,
    SquareCover2, SquareCover3, SquareCover4, SquareCover5, SquareCover6];

  return (
    <>
      <GreyHeaderComponent style={{ position: 'fixed', top: '0px;' }} />
      <PageWrapper>
        <ProfileSideBarElement />
        <Line />
        <ChoicesWrapper>
          <MySchedulesTitleAndCreateNewScheduleArea>
            <MyScheduleTitle>我的行程</MyScheduleTitle>
            <CreateNewScheduleButton type="button">
              <StyledLink to="/choose-date">
                + 新的行程
              </StyledLink>
            </CreateNewScheduleButton>
          </MySchedulesTitleAndCreateNewScheduleArea>
          {schedules ? schedules.map((item, index) => (
            <ExistedSchedule
              // isSelected={isSelected}
              // onClick={() => { setTargetIndex(index); changeColor(index); }}
            >
              <PhotoInExistedSchedule src={schedulePhotoArray[index]} />
              <ExistedScheuleTitle id={item.schedule_id}>
                {item.title}
              </ExistedScheuleTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <Button onClick={() => getSelectedSchedule(item.schedule_id)} id={item.schedule_id} type="button">
                  選擇
                </Button>
                <Button onClick={() => DeleteScheduleOfTheUser(index)} id={item.schedule_id} type="button">
                  刪除
                </Button>
              </div>
            </ExistedSchedule>
          )) : ''}
        </ChoicesWrapper>
        <Line />
        <SelectedScheduleWrapper>
          {selectedSchedule ? (
            <>
              <MySchedulesTitleAndCreateNewScheduleArea style={{ width: '40vw' }}>
                <MyScheduleTitle>您選的行程概覽</MyScheduleTitle>
                <CreateNewScheduleButton style={{ width: '90px' }} type="button">
                  <StyledLink to={`/schedule?id=${selectedSchedule.schedule_id}`}>
                    查看詳細資訊
                  </StyledLink>
                </CreateNewScheduleButton>
                <CreateNewScheduleButton onClick={() => setNewArticleToDb()} style={{ width: '90px' }} type="button">
                  撰寫旅程回憶
                </CreateNewScheduleButton>
              </MySchedulesTitleAndCreateNewScheduleArea>
              <SelectedSchedulePhoto>
                <SelectedScheduleTitle>
                  {selectedSchedule.title}
                </SelectedScheduleTitle>
              </SelectedSchedulePhoto>
              <ScheduleMemberContainer>
                {selectedScheduleMembers?.map((item, index) => (
                  <>
                    <ScheduleMemberWord hovered={showMemberWord} onMouseLeave={() => { setShowMemberPhoto(false); setShowMemberWord(false); }} onMouseEnter={() => { setShowMemberPhoto(true); setShowMemberWord(true); }} style={{ backgroundColor: `${colorArray[index % 7]}` }}>
                      {item.email[0].toUpperCase()}
                    </ScheduleMemberWord>
                    <ScheduleMemberPhoto hovered={showMemberPhoto} onMouseLeave={() => { setShowMemberPhoto(false); setShowMemberWord(false); }} onMouseEnter={() => { setShowMemberPhoto(true); setShowMemberWord(true); }} alt="member" src={photoArray[index % 10]} />
                  </>
                ))}
              </ScheduleMemberContainer>
              <div style={{ display: 'flex', gap: '20px' }}>
                <DatePicker
                  style={{ height: '100px' }}
                  selected=""
                  startDate={new Date(selectedSchedule?.embark_date)}
                  endDate={new Date(selectedSchedule?.end_date)}
                  calendarContainer={CalendarStyle}
                  disabled
                  Range
                  inline
                />
                <InviteFriendBox>
                  <InviteFriendTitle>加朋友進此行程？</InviteFriendTitle>
                  <InviteFriendBelowArea active={searchInputIsActive}>
                    <InviteFriendInput
                      value={searchFriendValue}
                      type="text"
                      inputMode="text"
                      onChange={(e) => setSearchFriendValue(e.target.value)}
                      placeholder="請輸入email....."
                        />
                    <ConfirmSearchButton
                      onClick={() => {
                        submitSearch();
                        setSearchInputIsActive(false);
                        setSearchResultIsActive(true);
                      }}
                      type="button">
                      確認搜尋
                    </ConfirmSearchButton>
                  </InviteFriendBelowArea>
                  {searchedFriendId ? (
                    <InviteFriendBelowArea active={searchResultIsActive} style={{ marginTop: '30px' }}>
                      <div>
                        找到此用戶囉！
                        <br />
                        要加入他嗎？
                      </div>
                      <div>
                        <ConfirmSearchButton
                          onClick={() => {
                            addFriendToTheSchedule();
                            setSearchInputIsActive(true);
                            setSearchResultIsActive(false);
                            setSearchedFriendId(null);
                          }}
                          type="button">
                          確認加入
                        </ConfirmSearchButton>
                        <ConfirmSearchButton
                          style={{ marginTop: '10px' }}
                          onClick={() => {
                            setSearchInputIsActive(true);
                            setSearchResultIsActive(false);
                            setSearchedFriendId(null);
                          }}
                          type="button">
                          回上一頁
                        </ConfirmSearchButton>
                      </div>
                    </InviteFriendBelowArea>
                  ) : (
                    <InviteFriendBelowArea active={searchResultIsActive} style={{ marginTop: '30px' }}>
                      <div>
                        沒有此用戶～
                        <br />
                        試試看別的email吧！
                      </div>
                      <ConfirmSearchButton
                        onClick={() => {
                          setSearchInputIsActive(true);
                          setSearchResultIsActive(false);
                          setSearchedFriendId(null);
                        }}
                        type="button">
                        回上一頁
                      </ConfirmSearchButton>
                    </InviteFriendBelowArea>
                  )}
                </InviteFriendBox>
              </div>
            </>
          ) : ''}
        </SelectedScheduleWrapper>
      </PageWrapper>
    </>
  );
}

export default MySchedules;
