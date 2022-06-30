/* eslint-disable no-shadow */
// 選擇舊有行程或者創建新的行程
import styled from 'styled-components/macro';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState, useContext } from 'react';
import {
  getDoc, doc, query, where, collection, getDocs,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useImmer } from 'use-immer';
import db from '../utils/firebase-init';
import GreyHeaderComponent from '../components/GreyHeader';
import UserPhotoSrc from './images/seal.png';
import ExistedPhotoSrc from './images/paris_square.png';
import BckSrc2 from './images/camping.jpg';
import UserContext from '../components/UserContextComponent';
import ASrc from './images/a.png';
import BSrc from './images/b.png';
import CSrc from './images/c.png';
import DSrc from './images/d.png';
import ESrc from './images/e.png';
import FSrc from './images/f.png';

const PageWrapper = styled.div`
width:100vw;
height:calc(100vh-60px);
display:flex;
padding-top:60px;
`;

const ProfileSideBar = styled.div`
width:20vw;
height:calc(100vh-40px);
display:flex;
flex-direction:column;
align-items:center;
margin-top:60px;
`;

const SideNavBar = styled.div`
margin-top:60px;
height:auto;
width:auto;
display:flex;
flex-direction:column;
gap:30px;
`;

const UserPhoto = styled.img`
width:30px;
height:30px;
border-radius:50%;
margin-left:23px;
`;

const UserName = styled.div`
font-size:15px;
font-weight:600;
margin-left:15px;
`;

const NavBarChoice = styled.div`
font-weight:600;
font-size:15px;
color:grey;
`;

const Line = styled.div`
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
background-color:#e7f5fe;
// background-color:${(props) => (props.selected ? '#E6D1F2' : '#e7f5fe')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const Button = styled.button`
height:30px;
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

const SelectedSchedulePhoto = styled.div`
padding-left:15px;
padding-bottom:10px;
opacity:1;
flex-direction:column;
justify-content:flex-end;
width:35vw;
height:13vw;
position:relative;
border-radius:20px;
background-image: url(${BckSrc2});
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
width:35vw;
height:auto;
gap:15px;
`;

const ScheduleMemberPhoto = styled.img`
margin-top:10px;
width:50px;
height:50px;
border-radius:50%;
border:1px solid grey;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const UserNameLogoBox = styled.div`
width:160px;
height:50px;
border-radius:30px;
border:1px solid grey;
display:flex;
align-items:center
`;

const StyledLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:yellow;
border:none;
`;

function MySchedules() {
  const user = useContext(UserContext);
  console.log('我在MySchedulesComponents唷', user);
  const [schedules, setSchedules] = useImmer([]);
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [selectedScheduleMembers, setSelectedScheduleMembers] = useState([]);
  console.log(selectedScheduleMembers);
  // const [isSelected, setIsSelected] = useState(false);

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

  console.log('從state拿到使用者點的那個行程囉！', selectedSchedule, new Date(selectedSchedule?.embark_date));
  const photoArray = [ASrc, BSrc, CSrc, DSrc, ESrc, FSrc];
  // 用按下去那個行程的id去拿整筆資料
  return (
    <>
      <GreyHeaderComponent style={{ position: 'fixed', top: '0px;' }} />
      <PageWrapper>
        <ProfileSideBar>
          <UserNameLogoBox>
            <UserPhoto src={UserPhotoSrc} />
            <UserName>Weiwei</UserName>
          </UserNameLogoBox>
          <SideNavBar>
            <NavBarChoice>我的行程</NavBarChoice>
            <NavBarChoice>我的文章</NavBarChoice>
            <NavBarChoice>我的收藏</NavBarChoice>
            <NavBarChoice>個人資料</NavBarChoice>
            <NavBarChoice>地圖成就</NavBarChoice>
          </SideNavBar>
        </ProfileSideBar>
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
          {schedules ? schedules.map((item) => (
            <ExistedSchedule>
              <PhotoInExistedSchedule src={ExistedPhotoSrc} />
              <p style={{ fontWeight: '600' }} id={item.schedule_id}>
                {item.title}
              </p>
              <Button onClick={() => getSelectedSchedule(item.schedule_id)} id={item.schedule_id} type="button">
                選擇
              </Button>
            </ExistedSchedule>
          )) : ''}
        </ChoicesWrapper>
        <Line />
        <SelectedScheduleWrapper>
          {selectedSchedule ? (
            <>
              <MySchedulesTitleAndCreateNewScheduleArea style={{ width: '45vw' }}>
                <MyScheduleTitle>您選的行程概覽</MyScheduleTitle>
                <CreateNewScheduleButton style={{ width: '90px' }} type="button">
                  <StyledLink to={`/schedule?id=${selectedSchedule.schedule_id}`}>
                    查看詳細資訊
                  </StyledLink>
                </CreateNewScheduleButton>
                <CreateNewScheduleButton style={{ width: '90px' }} type="button">撰寫旅程回憶</CreateNewScheduleButton>
              </MySchedulesTitleAndCreateNewScheduleArea>
              <SelectedSchedulePhoto>
                <SelectedScheduleTitle>
                  {selectedSchedule.title}
                </SelectedScheduleTitle>
              </SelectedSchedulePhoto>
              <ScheduleMemberContainer>
                {selectedScheduleMembers?.map((item, index) => (
                  <>
                    {/* <div>
                      {item.email[0].toUpperCase()}
                    </div> */}
                    <ScheduleMemberPhoto alt="member" src={photoArray[index % 6]} />
                  </>
                ))}
              </ScheduleMemberContainer>
              <DatePicker
                style={{ height: '100px' }}
                selected=""
                startDate={new Date(selectedSchedule?.embark_date)}
                endDate={new Date(selectedSchedule?.end_date)}
                disabled
                Range
                inline
              />
            </>
          ) : ''}
        </SelectedScheduleWrapper>
      </PageWrapper>
    </>
  );
}

export default MySchedules;
