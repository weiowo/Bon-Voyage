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
import GreyHeaderComponent from '../components/Headers/GreyHeader';
import UserContext from '../components/UserContextComponent';
import RecCover3 from './images/schedule_cover_rec3.jpg';
import REMINDER_ICONS from '../constants/reminder.icon';
import ProfileSideBarElement from '../components/ProfileSideBar';
import SignIn from '../components/SignIn';
import './animation.css';
import Add from './images/invite.png';
import CloseSearchIcon from './images/close-1.png';
import SQUARE_COVER from '../constants/schedule.square.cover';
import ExistedSchedule, {
  ExistedScheuleTitle, PhotoArea, ScheduleRightPart, SmallScheduleRightPart, ButtonArea, Button,
} from '../components/Cards/ExistedSchedule';
import RemindWrapper, {
  ClickAndAdd, RemindText, RemindIcon, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from '../components/Reminder/CreateTrip';
import DeleteAsk, {
  DeleteButtonArea, ConfirmDeleteButton, NoDeleteButton, DeleteModalTitle,
} from '../components/DeleteSchModal/DeleteSchModal';
import AddFriendButton, {
  FoundAsk, CloseSearch, InviteFriendInput, InviteFriendBelowArea, ConfirmSearchButton,
} from '../components/InviteFriendModal/InviteFriendModal';
import Line from '../components/Line';

const PageWrapper = styled.div`
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
  }
}`;

const ChoicesWrapper = styled.div` 
  width:33vw;
  height:90vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:20px;
  overflow:auto;
  height:calc(100vh - 80px);
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

const TitleAndCreateArea = styled.div`
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
  }
`;

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
  }
`;

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
  }
`;

const MyScheduleTitle = styled.div`
  font-weight:700;
  font-size:25px;
  height:30px;
  @media screen and (max-width:800px){
    font-size:22px;
  }
`;

const SchedulePreviewTitle = styled.div`
  font-weight:700;
  font-size:25px;
  height:30px;
  @media screen and (max-width:800px){
    font-size:22px;
  }
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
  overflow:scroll;
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
  const [deleteId, setDeleteId] = useState('');
  // const [deleteIndex, setDeleteIndex] = useState('');
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

  function deleteScheduleOfTheUser() {
    setSchedules(schedules?.filter(
      (item) => item.schedule_id !== deleteId,
    ));
  }

  useEffect(() => {
    if (!selectedSchedule) { return; }
    async function getArray() {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('owned_schedule_ids', 'array-contains', selectedSchedule?.schedule_id));
      const userData = await getDocs(q);
      const members = [];
      userData.forEach((document) => {
        members.push(document.data());
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
      querySnapShot.forEach((document) => {
        setSearchedFriendId(document.id);
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
              <TitleAndCreateArea>
                <MyScheduleTitle>我的行程</MyScheduleTitle>
                <CreateNewScheduleButton type="button">
                  <StyledLink to="/choose-date">
                    + 新的行程
                  </StyledLink>
                </CreateNewScheduleButton>
              </TitleAndCreateArea>
              {schedules.length === 0
                ? (
                  <RemindWrapper>
                    <RemindIcon src={REMINDER_ICONS?.CAR_ICON} />
                    <RemindRightPart>
                      <RemindText>
                        還沒有行程捏～
                        <br />
                        該創建行程囉！
                      </RemindText>
                      <StyledBlackLink to="/choose-date">
                        <ClickAndAdd>點我創建</ClickAndAdd>
                      </StyledBlackLink>
                      <SuitcaseIcon src={REMINDER_ICONS?.SUITCASE_ICON} />
                    </RemindRightPart>
                  </RemindWrapper>
                )
                : (
                  <ExistedSchedules>
                    {schedules?.map((item, index) => (
                      <ExistedSchedule
                        key={item?.schedule_id}
                        isSelected={index === targetIndex}
                      >
                        <PhotoArea
                          src={SQUARE_COVER[index % 5]}
                        />
                        <ScheduleRightPart>
                          <ExistedScheuleTitle
                            id={item?.schedule_id}
                          >
                            {item?.title}
                          </ExistedScheuleTitle>
                          <ButtonArea>
                            <Button onClick={() => { setTargetIndex(index); getSelectedSchedule(item?.schedule_id); }} id={item?.schedule_id} type="button">
                              選擇
                            </Button>
                            <Button className="button" onClick={() => { toggleModal(); setDeleteId(item?.schedule_id); }} id={item?.schedule_id} type="button">
                              刪除
                            </Button>
                          </ButtonArea>
                        </ScheduleRightPart>

                        <SmallScheduleRightPart>
                          <ExistedScheuleTitle
                            id={item?.schedule_id}
                          >
                            {item.title}
                          </ExistedScheuleTitle>
                          <ButtonArea>
                            <Button
                              onClick={() => {
                                setTargetIndex(index);
                                getSelectedSchedule(item?.schedule_id);
                              }}
                              id={item?.schedule_id}
                              type="button"
                            >
                              選擇
                            </Button>
                            <Button
                              onClick={() => toggleModal()}
                              id={item?.schedule_id}
                              type="button"
                            >
                              刪除
                            </Button>
                          </ButtonArea>
                        </SmallScheduleRightPart>
                      </ExistedSchedule>
                    ))}
                    <div
                      className="modal-background"
                    >
                      <div
                        className="modal"
                      >
                        <DeleteModalTitle>
                          Delete
                        </DeleteModalTitle>
                        <DeleteAsk>
                          確認要刪除嗎？

                        </DeleteAsk>
                        <DeleteButtonArea>
                          <NoDeleteButton
                            onClick={() => closeModal()}
                            type="button"
                          >
                            取消
                          </NoDeleteButton>
                          <ConfirmDeleteButton
                            onClick={() => {
                              console.log('indexxxx', deleteId);
                              deleteScheduleOfTheUser(deleteId);
                              closeModal();
                              deleteCertainSchedule(deleteId);
                            }}
                            type="button"
                          >
                            確認

                          </ConfirmDeleteButton>
                        </DeleteButtonArea>
                      </div>
                    </div>
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
                      <div key={item?.email}>
                        <ScheduleMemberWord
                          hovered={showMemberWord}
                          onMouseLeave={() => {
                            setShowMemberPhoto(false);
                            setShowMemberWord(false);
                          }}
                          onMouseEnter={() => {
                            setShowMemberPhoto(true);
                            setShowMemberWord(true);
                          }}
                          style={{ backgroundColor: `${colorArray[index % 5]}` }}
                        >
                          {item.email[0].toUpperCase()}
                        </ScheduleMemberWord>
                        <ScheduleMemberPhoto
                          hovered={showMemberPhoto}
                          onMouseLeave={() => {
                            setShowMemberPhoto(false);
                            setShowMemberWord(false);
                          }}
                          onMouseEnter={() => {
                            setShowMemberPhoto(true);
                            setShowMemberWord(true);
                          }}
                          alt="member"
                          key={item?.photo_url}
                          src={item.photo_url}
                        />
                      </div>
                    ))}
                  </ScheduleMemberContainer>
                  <CalendarBox>
                    <CalendarBoxTitle>旅程時間</CalendarBoxTitle>
                    <DateArea>
                      {selectedSchedule?.embark_date.split('-').join('/')}
                      ～
                      {selectedSchedule?.end_date.split('-').join('/')}
                    </DateArea>
                  </CalendarBox>
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
                          placeholder="請輸入email....."
                        />
                        <ConfirmSearchButton
                          onClick={() => {
                            submitSearch();
                            setSearchInputIsActive(false);
                            setSearchResultIsActive(true);
                          }}
                          type="button"
                        >
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
                              type="button"
                            >
                              確認加入
                            </ConfirmSearchButton>
                            <ConfirmSearchButton
                              onClick={() => {
                                setSearchInputIsActive(true);
                                setSearchResultIsActive(false);
                                setSearchedFriendId(null);
                              }}
                              type="button"
                            >
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
                            type="button"
                          >
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
