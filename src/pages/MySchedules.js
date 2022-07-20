/* eslint-disable max-len */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-shadow */
import styled from 'styled-components/macro';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState, useContext } from 'react';
import {
  getDoc, doc, query, where, collection, getDocs,
  arrayUnion, setDoc, updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import db from '../utils/firebase-init';
import GreyHeaderComponent from '../components/GreyHeader';
import UserContext from '../components/UserContextComponent';
import SquareCover1 from './images/schedule_cover_square1.jpg';
import SquareCover2 from './images/schedule_cover_square2.jpg';
import SquareCover3 from './images/schedule_cover_square3.jpg';
import SquareCover4 from './images/schedule_cover_square4.jpg';
import SquareCover5 from './images/schedule_cover_square5.jpg';
import SquareCover6 from './images/schedule_cover_square6.jpg';
import RecCover3 from './images/schedule_cover_rec3.jpg';
import Travel from './images/travel-2.png';
import Suitcase from './images/suitcase-2.png';
import ProfileSideBarElement from '../components/ProfileSideBar';
import SignIn from '../components/SignIn';
import './animation.css';
import Add from './images/invite.png';
import CloseSearchIcon from './images/close-1.png';

export const RemindWrapper = styled.div`
width:26vw;
height:180px;
display:flex;
gap:20px;
@media screen and (max-width:1180px){
  width:100%;
  height:150px;
}
@media screen and (max-width:1000px){
  width:100%;
}
@media screen and (max-width:748px){
  justify-content:center;
  width:100%;
}
@media screen and (max-width:480px){
  height:130px;
}`;

export const ClickAndAdd = styled.div`
width:80px;
height:auto;
font-size:15px;
background-color:white;
position:absolute;
bottom:35px;
font-weight:600;
left:10px;
border: 1.5px solid black;
border-radius:5px;
cursor:pointer;
@media screen and (max-width:400px){
  font-size:13px;
  left:5px;
}`;

export const RemindText = styled.div`
width:100%;
font-weight:550;
font-size:15px;
text-align:left;
@media screen and (max-width:1180px){
  font-size:13px;
}
@media screen and (max-width:400px){
  font-size:13px;
}`;

export const RemindIcon = styled.img`
width:180px;
height:180px;
@media screen and (max-width:1180px){
  width:150px;
  height:150px;
}
@media screen and (max-width:1000px){
  width:140px;
  height:140px;
}
@media screen and (max-width:480px){
  width:130px;
  height:130px;
}`;

export const SuitcaseIcon = styled.img`
width: 100px;
height:100px;
@media screen and (max-width:1000px){
  width:95px;
  height:95px;
}
@media screen and (max-width:480px){
  height:90px;
  width:90px;
}`;

export const RemindRightPart = styled.div`
width:70%;
height:180px;
display:flex;
flex-direction:column;
justify-content:space-between;
position:relative;
@media screen and (max-width:1180px){
  height:150px;
}
@media screen and (max-width:1000px){
  height:140px;
}
@media screen and (max-width:1000px){
  width:auto;
}
@media screen and (max-width:480px){
  height:130px;
}`;

export const PageWrapper = styled.div`
width:100vw;
height:calc(100vh-60px);
display:flex;
flex-direction:row;
padding-top:60px;
@media screen and (max-width:800px){
justify-content:center;
}
@media screen and (max-width:748px){
  flex-direction:column;
  flex-shrink:0;
  height:calc(100vh-60px);
}`;

export const Line = styled.div`
display:flex;
width:1.8px;
height:85vh;
background-color:#D3D3D3;
align-items:center;
margin-top:20px;
@media screen and (max-width:800px){
  display:none;
}`;

const SmallScreenLine = styled.div`
display:none;
@media screen and (max-width:800px){
  display:flex;
width:1.8px;
height:85vh;
background-color:#D3D3D3;
align-items:center;
margin-top:20px;
@media screen and (max-width:748px){
  display:none;
}`;

const ChoicesWrapper = styled.div` 
width:33vw;
height:90vh;
display:flex;
flex-direction:column;
align-items:center;
gap:20px;
overflow:auto;
height:calc(100vh-80px);
flex-shrink:0;
padding-bottom:5px;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 6px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
}
@media screen and (max-width:800px){
  width:40vw;
}
@media screen and (max-width:748px){
  flex-direction:column;
  width:100vw;
  height:35vh;
  gap:10px;
  flex-shrink:0;
  overflow:hidden;
  padding-bottom:0px;
  margin-bottom:0px;
}`;

const MySchedulesTitleAndCreateNewScheduleArea = styled.div`
display:flex;
width:26vw;
height:auto;
align-items:flex-end;
gap:20px;
margin-top:30px;
justify-content:left;
margin-bottom:15px;
@media screen and (max-width:748px){
width:100%;
display:flex;
height:80px;
margin-top:10px;
align-items:center;
margin-bottom:0px;
justify-content:center;
}`;

const ExistedSchedules = styled.div`
display:flex;
flex-direction:column;
gap:15px;
@media screen and (max-width:748px){
  width:100vw;
  height:23vh;
  margin-left:30px;
  flex-direction:row;
  overflow:scroll;
  padding-top:0px;
  padding-bottom:0px;
  flex-shrink:0;
  // &::-webkit-scrollbar-track {
  //   -webkit-box-shadow: transparent;
  //   border-radius: 10px;
  //   background-color:transparent;
  // }
  // &::-webkit-scrollbar {
  //   width: 3px;
  //   background-color:transparent;
  // }
  // &::-webkit-scrollbar-thumb {
  //   border-radius: 10px;
  //   -webkit-box-shadow: transparent;
  //   background-color:#D3D3D3;
  // }
}`;

const SchedulePreview = styled.div`
display:flex;
width:40vw;
height:auto;
align-items:flex-end;
gap:20px;
margin-top:30px;
justify-content:left;
margin-bottom:15px;
@media screen and (max-width:748px){
  align-items:center;
  justify-content:center;
  width:100%;
  margin-top:10px;
}`;

// const CalendarInviteWrapper = styled.div`
// display:flex;
// flex-direction:row;
// gap:35px;
// @media screen and (max-width:900px){
// flex-direction:column;
// }
// `;

const MyScheduleTitle = styled.div`
font-weight:700;
font-size:25px;
height:30px;
@media screen and (max-width:800px){
  font-size:22px;
}`;

const SchedulePreviewTitle = styled.div`
font-weight:700;
font-size:25px;
height:30px;
@media screen and (max-width:800px){
  font-size:22px;
}`;

const CreateNewScheduleButton = styled.button`
width:80px;
height:20px;
background-color:#1c2e4a;
color:white;
border-radius:3px;
border:none;
font-size:12px;
font-weight:500;
@media screen and (max-width:800px){
  width:80px;
  height:20px;
  flex-shrink:0;
}
`;

const ViewDetailButton = styled.button`
width:70px;
height:20px;
background-color:#1c2e4a;
color:white;
border-radius:3px;
border:none;
font-size:12px;
font-weight:500;
cursor:pointer;
@media screen and (max-width:800px){
  width:70px;
  height:20px;
  flex-shrink:0;
}
`;

const SmallScreenExistedScheduleRightPart = styled.div`
display:none;
@media screen and (max-width:900px){
  display:flex;
  flex-direction:column;
  margin-right:10px;
}
@media screen and (max-width:700px){
  width:100%;
  font-size:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-right:0px;
  gap:10px;
}
`;

const LargeScreenExistedScheduleRightPart = styled.div`
display:flex;
flex-direction:row;
width:70%;
@media screen and (max-width:900px){
  display:none;
}
`;

const PhotoInExistedSchedule = styled.img`
width:100px;
height:100px;
border-radius:20px;
@media screen and (max-width:900px){
  width:80px;
  height:80px;
}
@media screen and (max-width:700px){
display:none;
}
`;

const ExistedSchedule = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
width:26vw;
height:140px;
gap:20px;
padding-left:10px;
padding-right:10px;
padding-top:10px;
padding-bottom:10px;
border-radius:16px;
flex-shrink:0;
background-color:${(props) => (props.isSelected ? '#E6D1F2' : '#e7f5fe')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:800px){
  width:29vw;
  gap:10px;
  justify-content:left;
  flex-shrink:0;
}
@media screen and (max-width:748px){
  width:30vw;
  gap:8px;
  justify-content:left;
  flex-shrink:0;
  box-shadow:none;
  padding-top:0px;
  padding-bottom:0px;
  height:140px;
}`;

export const DeleteAsk = styled.div`
width:100%;
display:flex;
align-items:center;
justify-content:center;
font-weight:600;
font-size:20px;
margin-top:30px;
`;

const FoundAsk = styled.div`
width:100%;
font-weight:600;
font-size:18px;
`;

export const DeleteButtonArea = styled.div`
width:100%;
display:flex;
justify-content:center;
allign-items:center;
gap:20px;
`;

const CloseSearch = styled.img`
position:absolute;
right:20px;
width:18px;
height:18px;
cursor:pointer;
`;

export const ConfirmDeleteButton = styled.button`
width:30%;
height:30px;
background-color:#e7f5fe;
font-weight:550;
border:none;
border-radius:10px;
cursor:pointer;
font-size:16px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const NoDeleteButton = styled.button`
width:30%;
height:30px;
background-color:#E6D1F2;
font-weight:550;
border:none;
border-radius:10px;
font-size:16px;
cursor:pointer;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const ExistedScheuleTitle = styled.div`
width:95%;
height:20%;
text-align:left;
font-weight:550;
@media screen and (max-width:900px){
  width:100%;
  margin-bottom:10px;
}
@media screen and (max-width:700px){
  width:90%;
  font-size:13px;
  display:flex;
  align-items:center;
  justify-content:center;
}
`;

const ButtonArea = styled.div`
display:flex;
flex-direction:column;
gap:15px;
@media screen and (max-width:900px){
  flex-direction:row;
  width:85%;
  gap:10px;
}
@media screen and (max-width:700px){
  flex-direction:column;
  align-items:center;
}`;

const Button = styled.button`
height:25px;
width:50px;
border:1px solid #296D98;
color:#296D98;
border-radius:15px;
font-weight:500;
cursor:pointer;
`;

const SelectedScheduleWrapper = styled.div`
width:42vw;
height:auto;
display:flex;
flex-direction:column;
align-items:left;
margin-left:50px;
gap:15px;
@media screen and (max-width:800px){
  margin-left:20px;
  width:50vw;
}
@media screen and (max-width:748px){
  width:100vw;
  margin-left:0px;
  height:53vh;
  align-items:center;
}
`;

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
@media screen and (max-width:800px){
  width:85%;
  height:150px;
}
@media screen and (max-width:748px){
  width:85vw;
  margin-left:0px;
  align-items:center;
  height:120px;
}
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
width:35.7vw;
height:80px;
gap:15px;
// padding-top:8px;
// padding-bottom:8px;
overflow:scroll;
@media screen and (max-width:800px){
  width:85%;
  height:70px;
}
@media screen and (max-width:700px){
  width:85%;
  height:80px;
}
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
@media screen and (max-width:800px){
  height:32px;
  width:32px;
  font-size:15px;
  flex-shrink:0;
}
@media screen and (max-width:740px){
  height:50px;
  width:50px;
  font-size:25px;
  flex-shrink:0;
}
`;

const ScheduleMemberPhoto = styled.img`
width:50px;
height:50px;
border-radius:50%;
// border:1px solid grey;
text-align:center;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
display:${(props) => (props.hovered ? 'none' : 'block')};
cursor:pointer;
object-fit: cover;
@media screen and (max-width:800px){
  height:32px;
  width:32px;
  flex-shrink:0;
}
@media screen and (max-width:740px){
  height:50px;
  width:50px;
}
`;

const StyledLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:white;
border:none;
`;

export const StyledBlackLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:black;
border:none;
`;

const CalendarBox = styled.div`
width:35vw;
height:120px;
border-radius:15px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:800px){
  width:85%;
  height:120px;
}
`;

const CalendarBoxTitle = styled.div`
display:flex;
padding-left:20px;
color:white;
font-weight:600;
font-size:18px;
text-shadow:1px 1px 2px black;
align-items:center;
border-top-right-radius:inherit;
border-top-left-radius:inherit;
width:35vw;
height:30%;
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 246) 100%
);
@media screen and (max-width:800px){
  width:100%;
}
`;

const DateArea = styled.div`
display:flex;
height:70%;
color:black;
font-weight:600;
font-size:25px;
align-items:center;
justify-content:center;
@media screen and (max-width:748px){
  font-size:23px;
}
`;

// const InviteFriendBox = styled.div`
// width:15vw;
// height:267px;
// border-radius:5px;
// box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
// `;

// const InviteFriendTitle = styled.div`
// width:100%;
// height:60px;
// border-top-right-radius:5px;
// border-top-left-radius:5px;
// background-color: #618CAC;
// color:white;
// display:flex;
// align-items:center;
// justify-content:center;
// font-weight:600;
// `;

// const CalendarStyle = styled.div`
// border:none;
// box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

// `;

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
width:100%;
margin-top:20px;
`;

const ConfirmSearchButton = styled.button`
width:30%;
height:35px;
border-radius:8px;
color:white;
font-weight:550;
font-size:16px;
border:none;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
text-shadow:1px 1px 2px black;
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 246) 100%
);
@media screen and (max-width:800px){
  width:50%;
}
`;

export const DeleteModalTitle = styled.div`
display: flex;
align-items:center;
justify-content:center;
font-size:20px;
position:absolute;
color:white;
text-shadow:1px 1px 2px black;
top:0;
font-weight:500;
width:100%;
height:40px;
border-top-right-radius:inherit;
border-top-left-radius:inherit;
background: rgb(167, 176, 215);
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 246) 100%
);
`;

// const MemberAreaTitle = styled.div`
// width:35vw;
// font-size:25px;
// font-weight:600;
// `;

const AddFriendButton = styled.img`
width:55px;
height:55px;
cursor:pointer;
@media screen and (max-width:800px){
  width:35px;
  height:35px;
}
@media screen and (max-width:748px){
  width:55px;
  height:55px;
}
`;

function MySchedules() {
  const user = useContext(UserContext);
  const [schedules, setSchedules] = useImmer([]);
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [selectedMembers, setSelectedMembers] = useImmer([]);
  const [searchFriendValue, setSearchFriendValue] = useState();
  const [searchedFriendId, setSearchedFriendId] = useState();
  const [showMemberWord, setShowMemberWord] = useState(false);
  const [showMemberPhoto, setShowMemberPhoto] = useState(false);
  const [searchInputIsActive, setSearchInputIsActive] = useState(true);
  const [searchResultIsActive, setSearchResultIsActive] = useState(false);
  const navigate = useNavigate();
  const [targetIndex, setTargetIndex] = useState(null);

  useEffect(() => {
    if (user.uid) {
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (querySnapShot) => {
        querySnapShot.data().owned_schedule_ids.forEach(async (item) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              setSchedules((draft) => {
                draft.push(Snap.data());
              });
            }
          }
        });
      });
      return unsubscribe;
    }
    return undefined;
  }, [user.uid, setSchedules]);

  function deleteScheduleOfTheUser(targetDeleteIndex) {
    setSchedules(schedules?.filter(
      (item, index) => index !== targetDeleteIndex,
    ));
  }

  useEffect(() => {
    if (!selectedSchedule) { return; }
    async function getArray() {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('owned_schedule_ids', 'array-contains', selectedSchedule?.schedule_id));
      const userData = await getDocs(q);
      const members = [];
      userData.forEach((doc) => {
        members.push(doc.data());
      });
    }
    getArray();
  }, [selectedSchedule?.schedule_id, selectedSchedule]);

  async function getSelectedSchedule(id) {
    const docRef = doc(db, 'schedules', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSelectedSchedule(docSnap.data());
    }
  }

  async function deleteCertainSchedule(id) {
    const docRef = doc(db, 'schedules', id);
    // const docSnap = await getDoc(docRef);
    // console.log(docSnap.data());
    await updateDoc(docRef, ({ deleted: true }));
  }

  const colorArray = ['#618CAC', '#A9B7AA', '#7A848D', '#976666', '#A0C1D2'];

  const newArticle = {
    status: 'draft',
    cover_img: '',
    summary: '',
    author: user.displayName,
    time: new Date(),
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

  async function setNewArticleToDb() {
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

  async function submitSearch() {
    setSearchFriendValue('');
    const userEmailQuery = query(collection(db, 'users'), where('email', '==', searchFriendValue));
    const querySnapShot = await getDocs(userEmailQuery);
    if (querySnapShot.size === 0) {
      console.log('查無此人！');
    } else {
      querySnapShot.forEach((doc) => {
        setSearchedFriendId(doc.id);
      });
    }
  }

  async function addFriendToTheSchedule() {
    const searchedFriendScheduleArray = doc(db, 'users', searchedFriendId);
    await updateDoc(searchedFriendScheduleArray, {
      owned_schedule_ids: arrayUnion(selectedSchedule?.schedule_id),
    });
    const selectedScheduleMemberList = doc(db, 'schedules', selectedSchedule?.schedule_id);
    await updateDoc(selectedScheduleMemberList, {
      members: arrayUnion(
        searchedFriendId,
      ),
    });
  }

  useEffect(() => {
    if (selectedSchedule?.schedule_id) {
      const memberAdded = doc(db, 'schedules', selectedSchedule?.schedule_id);
      const unsubscribe = onSnapshot(memberAdded, async (querySnapshot) => {
        const memberData = await Promise.all(querySnapshot.data().members.map(async (item) => {
          const docs = doc(db, 'users', item);
          const snap = await getDoc(docs);
          if (snap.exists()) {
            return snap.data();
          }
          return null;
        }));
        setSelectedMembers(memberData);
      });
      return () => {
        unsubscribe();
        setSelectedMembers([]);
      };
    }
    return () => {};
  }, [selectedSchedule?.schedule_id, setSelectedMembers]);

  const schedulePhotoArray = [SquareCover1,
    SquareCover2, SquareCover3, SquareCover4, SquareCover5, SquareCover6];

  const modal = document.querySelector('.modal');
  const modalBackground = document.querySelector('.modal-background');

  function toggleModal() {
    modal?.classList.remove('hide');
    modal?.classList.add('show');
    modalBackground?.classList.add('show');
  }

  function closeModal() {
    modal?.classList.remove('show');
    modal?.classList.add('hide');
    modalBackground?.classList.remove('show');
  }

  const searchFriendModal = document.querySelector('.search-friend-modal');
  const searchFriendModalBackground = document.querySelector('.search-friend-modal-background');

  function toggleFriendModal() {
    searchFriendModal?.classList.remove('hide');
    searchFriendModal?.classList.add('show');
    searchFriendModalBackground?.classList.add('show');
  }

  function closeFriendModal() {
    searchFriendModal?.classList.remove('show');
    searchFriendModal?.classList.add('hide');
    searchFriendModalBackground?.classList.remove('show');
  }

  return (
    <div>
      {user.uid ? (
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
              {schedules.length === 0
                ? (
                  <RemindWrapper>
                    <RemindIcon src={Travel} />
                    <RemindRightPart>
                      <RemindText>
                        還沒有行程捏～
                        <br />
                        該創建行程囉！
                      </RemindText>
                      <StyledBlackLink to="/choose-date">
                        <ClickAndAdd>點我創建</ClickAndAdd>
                      </StyledBlackLink>
                      <SuitcaseIcon src={Suitcase} />
                    </RemindRightPart>
                  </RemindWrapper>
                )
                : (
                  <ExistedSchedules>
                    {schedules?.map((item, index) => (
                      <ExistedSchedule
                        key={`${item?.schedule_id}and${item?.embark_date}+${item?.end_date}`}
                        data-position={index}
                        isSelected={index === targetIndex}
                  >
                        <div
                          key={`${item?.schedule_id}`}
                          className="modal-background">
                          <div
                            key={`${item?.title}and${item?.schedule_id}+${item?.embark_date}`}
                            className="modal">
                            <DeleteModalTitle
                              key={`${item?.schedule_id}and${item?.title}`}

                            >
                              Delete
                            </DeleteModalTitle>
                            <DeleteAsk
                              key={`${item?.schedule_id}+${item?.title}+${item?.end_date}`}
                              >
                              確認要刪除嗎？

                            </DeleteAsk>
                            <DeleteButtonArea
                              key={`${item?.schedule_id}+${item?.title}+${item?.embark_date}+${item?.end_date}`}
                            >
                              <NoDeleteButton
                                key={`${item?.schedule_id}+${item?.title}+${item?.embark_date}+${item?.deleted}`}
                                onClick={() => closeModal()}
                                type="button">
                                取消
                              </NoDeleteButton>
                              <ConfirmDeleteButton
                                key={`${item?.deleted}`}
                                onClick={() => { deleteScheduleOfTheUser(index); closeModal(); deleteCertainSchedule(item.schedule_id); }}
                                type="button">
                                確認

                              </ConfirmDeleteButton>
                            </DeleteButtonArea>
                          </div>
                        </div>
                        <PhotoInExistedSchedule
                          key={`${item?.title}`}
                          src={schedulePhotoArray[index % 5]} />
                        <LargeScreenExistedScheduleRightPart
                          key={`${item?.embark_date}+${item?.end_date}`}

                        >
                          <ExistedScheuleTitle
                            key={`${item?.title}+${item?.deleted}`}
                            id={item?.schedule_id}>
                            {item?.title}
                          </ExistedScheuleTitle>
                          <ButtonArea
                            key={`${item?.embark_date}and`}
                                                    >
                            <Button key={`${item?.schedule_id}+${item?.end_date}`} onClick={() => { setTargetIndex(index); getSelectedSchedule(item?.schedule_id); }} id={item?.schedule_id} type="button">
                              選擇
                            </Button>
                            <Button key={`${item?.title}+${item?.end_date}`} className="button" onClick={() => { toggleModal(); }} id={item?.schedule_id} type="button">
                              刪除
                            </Button>
                          </ButtonArea>
                        </LargeScreenExistedScheduleRightPart>

                        <SmallScreenExistedScheduleRightPart>
                          <ExistedScheuleTitle
                            key={`${item?.title}+${item?.deleted}+${item?.end_date}`}
                            id={item?.schedule_id}>
                            {item.title}
                          </ExistedScheuleTitle>
                          <ButtonArea
                            key={`${item?.schedule_id}+${item?.title}+${item?.deleted}+${item?.end_date}`}
                          >
                            <Button
                              key={`${item?.schedule_id}+${item?.title}+${item?.embark_date}+${item?.deleted}`}
                              onClick={() => { setTargetIndex(index); getSelectedSchedule(item?.schedule_id); }}
                              id={item?.schedule_id}
                              type="button">
                              選擇
                            </Button>
                            <Button
                              key={`${item?.schedule_id}+${item?.title}+${item?.end_date}+${item?.deleted}+${item?.embark_date}`}
                              onClick={() => toggleModal()}
                              id={item?.schedule_id}
                              type="button">
                              刪除
                            </Button>
                          </ButtonArea>
                        </SmallScreenExistedScheduleRightPart>
                      </ExistedSchedule>
                    ))}
                  </ExistedSchedules>
                )}
            </ChoicesWrapper>
            <Line />
            <SmallScreenLine />
            <SelectedScheduleWrapper>
              {selectedSchedule ? (
                <>
                  <SchedulePreview>
                    <SchedulePreviewTitle>行程概覽</SchedulePreviewTitle>
                    <ViewDetailButton type="button">
                      <StyledLink to={`/schedule?id=${selectedSchedule.schedule_id}`}>
                        詳細資訊
                      </StyledLink>
                    </ViewDetailButton>
                    <ViewDetailButton onClick={() => setNewArticleToDb()} type="button">
                      撰寫遊記
                    </ViewDetailButton>
                  </SchedulePreview>
                  <StyledLink to={`/schedule?id=${selectedSchedule.schedule_id}`}>
                    <SelectedSchedulePhoto>
                      <SelectedScheduleTitle>
                        {selectedSchedule.title}
                      </SelectedScheduleTitle>
                    </SelectedSchedulePhoto>
                  </StyledLink>
                  {/* <MemberAreaTitle>Members</MemberAreaTitle> */}
                  <ScheduleMemberContainer>
                    <AddFriendButton onClick={() => toggleFriendModal()} src={Add} />
                    {selectedMembers?.map((item, index) => (
                      <>
                        <ScheduleMemberWord
                          key={item?.email}
                          hovered={showMemberWord}
                          onMouseLeave={() => { setShowMemberPhoto(false); setShowMemberWord(false); }}
                          onMouseEnter={() => { setShowMemberPhoto(true); setShowMemberWord(true); }}
                          style={{ backgroundColor: `${colorArray[index % 5]}` }}>
                          {item.email[0].toUpperCase()}
                        </ScheduleMemberWord>
                        <ScheduleMemberPhoto
                          hovered={showMemberPhoto}
                          onMouseLeave={() => { setShowMemberPhoto(false); setShowMemberWord(false); }}
                          onMouseEnter={() => { setShowMemberPhoto(true); setShowMemberWord(true); }}
                          alt="member"
                          key={item?.photo_url}
                          src={item.photo_url} />
                      </>
                    ))}
                  </ScheduleMemberContainer>
                  <CalendarBox>
                    <CalendarBoxTitle>旅程時間</CalendarBoxTitle>
                    <DateArea>
                      {selectedSchedule?.embark_date.split('-').join('/')}
                      ～
                      {selectedSchedule?.end_date.split('-').join('/')}
                    </DateArea>
                    {/* <DateArea>{selectedSchedule?.end_date}</div> */}
                  </CalendarBox>
                  {/* <CalendarInviteWrapper> */}
                  {/* <DatePicker
                      style={{ height: '100px' }}
                      selected=""
                      startDate={new Date(selectedSchedule?.embark_date)}
                      endDate={new Date(selectedSchedule?.end_date)}
                      calendarContainer={CalendarStyle}
                      disabled
                      Range
                      inline /> */}
                  <div className="search-friend-modal-background">
                    <div className="search-friend-modal">
                      <DeleteModalTitle>
                        揪親朋好友一起玩？
                        <CloseSearch src={CloseSearchIcon} onClick={() => closeFriendModal()} />
                      </DeleteModalTitle>
                      <InviteFriendBelowArea active={searchInputIsActive}>
                        <InviteFriendInput
                          value={searchFriendValue}
                          type="text"
                          inputMode="text"
                          onChange={(e) => setSearchFriendValue(e.target.value)}
                          placeholder="請輸入email....." />
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
                          <FoundAsk>
                            找到此用戶囉！
                            <br />
                            要加入他嗎？
                          </FoundAsk>
                          <DeleteButtonArea>
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
                              onClick={() => {
                                setSearchInputIsActive(true);
                                setSearchResultIsActive(false);
                                setSearchedFriendId(null);
                              }}
                              type="button">
                              回上一頁
                            </ConfirmSearchButton>
                          </DeleteButtonArea>
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
                    </div>
                  </div>
                </>
              ) : ''}
            </SelectedScheduleWrapper>
          </PageWrapper>

        </>
      ) : <SignIn />}
    </div>
  );
}

export default MySchedules;
