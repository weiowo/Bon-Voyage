// 選擇舊有行程或者創建新的行程
import styled from 'styled-components/macro';
import React, { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useImmer } from 'use-immer';
import db from '../utils/firebase-init';
import GreyHeaderComponent from '../components/GreyHeader';
import UserPhotoSrc from './images/seal.png';
import ExistedPhotoSrc from './images/paris_square.png';
import BckSrc from './images/paris.png';

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
width:30vw;
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
width:50vw;
height:auto;
display:flex;
flex-direction:column;
align-items:center;
`;

const SelectedSchedulePhoto = styled.div`
padding-left:15px;
padding-bottom:10px;
opacity:1;
flex-direction:column;
justify-content:flex-end;
width:280px;
height:130px;
color:white;
font-weight:600;
position:relative;
text-align:left;
overflow:scroll;
border-radius:10px;
background-image: url(${BckSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
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
  const [schedules, setSchedules] = useImmer([]);
  const [selectedSchedule, setSelectedSchedule] = useState();
  // const [isSelected, setIsSelected] = useState(false);

  // 先拿到某個使用者的資料
  // 再根據行程array，去做foreach拿到所有schedule資料

  useEffect(() => {
    async function getUserArrayList() {
      const docRef = doc(db, 'users', '4upu03jk1cAjA0ZbAAJH');
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
  }, [setSchedules]);

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

  // useEffect(() => {
  //   getUserArrayList();
  // }, []);

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

  console.log('該行程從state拿囉', selectedSchedule);

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
              </MySchedulesTitleAndCreateNewScheduleArea>
              <SelectedSchedulePhoto />
              <p>
                行程ID:
                {selectedSchedule.schedule_id}
              </p>
              <p>
                行程名稱：
                {selectedSchedule.title}
              </p>
            </>
          ) : ''}
        </SelectedScheduleWrapper>
      </PageWrapper>
    </>
  );
}

export default MySchedules;
