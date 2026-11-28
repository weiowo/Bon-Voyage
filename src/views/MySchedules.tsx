import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState, useContext } from 'react';
import {
  getDoc, doc, query, where, collection, getDocs,
  arrayUnion, setDoc, updateDoc,
  onSnapshot, Timestamp, type DocumentData,
} from 'firebase/firestore';
import { Link, useNavigate } from '@/lib/router';
import { useImmer } from 'use-immer';
import tw from '@/lib/tw';
import db from '../utils/firebase-init';
import GreyHeaderComponent from '../components/Headers/GreyHeader';
import UserContext from '../components/UserContextComponent';
import REMINDER_ICONS from '../constants/reminder.icon';
import ProfileSideBarElement from '../components/ProfileSideBar';
import SignIn from '../components/SignIn';
import './animation.css';
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
import type { Article, Schedule, UserProfile } from '../types';

const Add = '/images/invite.webp';
const CloseSearchIcon = '/images/close-1.webp';

const PageWrapper = tw.div`
  w-[100vw] flex flex-row pt-[60px] max-tablet:justify-center
  max-tablet-sm:flex-col max-tablet-sm:shrink-0
`;

const SmallScreenLine = tw.div`
  hidden max-tablet:flex max-tablet:w-[1.8px] max-tablet:h-[85vh]
  max-tablet:bg-[#D3D3D3] max-tablet:items-center max-tablet:mt-[20px]
  max-tablet:max-tablet-sm:hidden
`;

const ChoicesWrapper = tw.div`
  w-[33vw] flex flex-col items-center gap-[20px] overflow-auto h-[calc(100vh_-_80px)]
  shrink-0 pb-[5px] [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3] max-tablet:w-[40vw] max-tablet-sm:flex-col
  max-tablet-sm:w-[100vw] max-tablet-sm:h-[35vh] max-tablet-sm:gap-[10px] max-tablet-sm:shrink-0
  max-tablet-sm:overflow-hidden max-tablet-sm:pb-[0px] max-tablet-sm:mb-[0px]
`;

const TitleAndCreateArea = tw.div`
  flex w-[26vw] h-auto items-end gap-[20px] mt-[30px] [justify-content:left] mb-[15px]
  max-tablet-sm:w-full max-tablet-sm:flex max-tablet-sm:h-[80px] max-tablet-sm:mt-[10px]
  max-tablet-sm:items-center max-tablet-sm:mb-[0px] max-tablet-sm:justify-center
`;

const ExistedSchedules = tw.div`
  flex flex-col gap-[15px] max-tablet-sm:w-[100vw] max-tablet-sm:h-[23vh] max-tablet-sm:ml-[30px]
  max-tablet-sm:flex-row max-tablet-sm:overflow-scroll max-tablet-sm:pt-[0px] max-tablet-sm:pb-[0px]
  max-tablet-sm:shrink-0
`;

const SchedulePreview = tw.div`
  flex w-[40vw] h-auto items-end gap-[20px] mt-[30px] [justify-content:left] mb-[15px]
  max-tablet-sm:items-center max-tablet-sm:justify-center max-tablet-sm:w-full
  max-tablet-sm:mt-[10px]
`;

const MyScheduleTitle = tw.div`
  font-bold text-[25px] h-[30px] max-tablet:text-[22px]
`;

const SchedulePreviewTitle = tw.div`
  font-bold text-[25px] h-[30px] max-tablet:text-[22px]
`;

const CreateNewScheduleButton = tw.button`
  w-[80px] h-[20px] bg-[#1c2e4a] text-white rounded-[3px] [border:none] text-[12px]
  font-medium max-tablet:w-[80px] max-tablet:h-[20px] max-tablet:shrink-0
`;

const ViewDetailButton = tw.button`
  w-[70px] h-[20px] bg-[#1c2e4a] text-white rounded-[3px] [border:none] text-[12px]
  font-medium cursor-pointer max-tablet:w-[70px] max-tablet:h-[20px] max-tablet:shrink-0
`;

const SelectedScheduleWrapper = tw.div`
  w-[42vw] h-auto flex flex-col [align-items:left] ml-[50px] gap-[15px]
  max-tablet:ml-[20px] max-tablet:w-[50vw] max-tablet-sm:w-[100vw] max-tablet-sm:ml-[0px]
  max-tablet-sm:h-[53vh] max-tablet-sm:items-center
`;

const SelectedSchedulePhoto = tw.div`
  pl-[15px] pb-[10px] opacity-[1] flex-col justify-end
  bg-[url(/images/schedule_cover_rec3.webp)] w-[35vw] h-[12vw] relative rounded-[20px]
  bg-cover bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply]
  max-tablet:w-[85%] max-tablet:h-[150px] max-tablet-sm:w-[85vw] max-tablet-sm:ml-[0px]
  max-tablet-sm:items-center max-tablet-sm:h-[120px]
`;

const SelectedScheduleTitle = tw.div`
  text-white font-extrabold text-[30px] absolute bottom-[20px]
`;

const ScheduleMemberContainer = tw.div`
  flex items-center w-[35.7vw] h-[80px] gap-[15px] overflow-scroll
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3] max-tablet:w-[85%] max-tablet:h-[70px]
  max-phablet:w-[85%] max-phablet:h-[80px]
`;

const ScheduleMemberWord = tw.div<{ hovered?: boolean }>`
  items-center justify-center w-[50px] text-[25px] font-semibold h-[50px] text-white
  rounded-[50%] [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  cursor-pointer max-tablet:h-[32px] max-tablet:w-[32px] max-tablet:text-[15px]
  max-tablet:shrink-0 max-tablet-sm:h-[50px] max-tablet-sm:w-[50px] max-tablet-sm:text-[25px]
  max-tablet-sm:shrink-0
  ${(p) => (p.hovered ? 'flex' : 'hidden')}
`;

const ScheduleMemberPhoto = tw.img<{ hovered?: boolean }>`
  w-[50px] h-[50px] rounded-[50%] text-center
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] cursor-pointer
  object-cover max-tablet:h-[32px] max-tablet:w-[32px] max-tablet:shrink-0
  max-tablet-sm:h-[50px] max-tablet-sm:w-[50px]
  ${(p) => (p.hovered ? 'hidden' : 'block')}
`;

const StyledLink = tw(Link)`
  cursor-pointer [text-decoration:none] text-white [border:none]
`;

const CalendarBox = tw.div`
  w-[35vw] h-[120px] rounded-[15px]
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] max-tablet:w-[85%]
  max-tablet:h-[120px]
`;

const CalendarBoxTitle = tw.div`
  flex pl-[20px] text-white font-semibold text-[18px] [text-shadow:1px_1px_2px_black]
  items-center [border-top-right-radius:inherit] [border-top-left-radius:inherit] w-[35vw]
  h-[30%] [background:linear-gradient(312deg,rgb(178,228,238)_0%,rgb(161,176,246)_100%)]
  max-tablet:w-full
`;

const DateArea = tw.div`
  flex h-[70%] text-black font-semibold text-[25px] items-center justify-center
  max-tablet-sm:text-[23px]
`;

function MySchedules() {
  const user = useContext(UserContext);
  const [schedules, setSchedules] = useImmer<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
  const [selectedMembers, setSelectedMembers] = useImmer<(UserProfile | null)[]>([]);
  const [searchFriendValue, setSearchFriendValue] = useState('');
  const [searchedFriendId, setSearchedFriendId] = useState<string | null>(null);
  const [showMemberWord, setShowMemberWord] = useState(false);
  const [showMemberPhoto, setShowMemberPhoto] = useState(false);
  const [searchInputIsActive, setSearchInputIsActive] = useState(true);
  const [searchResultIsActive, setSearchResultIsActive] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  // const [deleteIndex, setDeleteIndex] = useState('');
  const navigate = useNavigate();
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    if (user.uid) {
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (querySnapShot) => {
        const profile = querySnapShot.data() as UserProfile | undefined;
        profile?.owned_schedule_ids.forEach(async (item) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            const schedule = Snap.data() as Schedule;
            if (schedule.deleted === false) {
              setSchedules((draft) => {
                draft.push(schedule);
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
    const scheduleId = selectedSchedule.schedule_id;
    async function getArray() {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('owned_schedule_ids', 'array-contains', scheduleId));
      const userData = await getDocs(q);
      const members: DocumentData[] = [];
      userData.forEach((document) => {
        members.push(document.data());
      });
    }
    getArray();
  }, [selectedSchedule?.schedule_id, selectedSchedule]);

  async function getSelectedSchedule(id: string) {
    const docRef = doc(db, 'schedules', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSelectedSchedule(docSnap.data() as Schedule);
    }
  }

  async function deleteCertainSchedule(id: string) {
    const docRef = doc(db, 'schedules', id);
    await updateDoc(docRef, ({ deleted: true }));
  }

  const colorArray = ['#618CAC', '#A9B7AA', '#7A848D', '#976666', '#A0C1D2'];

  async function setNewArticleToDb() {
    if (!selectedSchedule || !user.uid) return;
    const newArticle: Article = {
      status: 'draft',
      cover_img: '',
      summary: '',
      author: user.displayName ?? null,
      time: Timestamp.fromDate(new Date()),
      article_creator_user_id: user.uid,
      schedule_id: selectedSchedule.schedule_id,
      article_id: '',
      article_title: selectedSchedule.title,
      trip_days: selectedSchedule.trip_days.map((item) => (
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

    const createArticleData = doc(collection(db, 'articles'));
    await setDoc(
      createArticleData,
      ({ ...newArticle, article_id: createArticleData.id }),
    );
    navigate({ pathname: '/edit', search: `?art_id=${createArticleData.id}&sch_id=${selectedSchedule.schedule_id}` });
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
    if (!searchedFriendId || !selectedSchedule) return;
    const searchedFriendScheduleArray = doc(db, 'users', searchedFriendId);
    await updateDoc(searchedFriendScheduleArray, {
      owned_schedule_ids: arrayUnion(selectedSchedule.schedule_id),
    });
    const selectedScheduleMemberList = doc(db, 'schedules', selectedSchedule.schedule_id);
    await updateDoc(selectedScheduleMemberList, {
      members: arrayUnion(
        searchedFriendId,
      ),
    });
  }

  useEffect(() => {
    if (selectedSchedule?.schedule_id) {
      const memberAdded = doc(db, 'schedules', selectedSchedule.schedule_id);
      const unsubscribe = onSnapshot(memberAdded, async (querySnapshot) => {
        const scheduleSnap = querySnapshot.data() as Schedule | undefined;
        const memberIds = scheduleSnap?.members ?? [];
        const memberData = await Promise.all(memberIds.map(async (item) => {
          const docs = doc(db, 'users', item);
          const snap = await getDoc(docs);
          if (snap.exists()) {
            return snap.data() as UserProfile;
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
          <GreyHeaderComponent />
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
                        onClick={() => {
                          setTargetIndex(index);
                          getSelectedSchedule(item?.schedule_id);
                        }}
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
                            <Button
                              className="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleModal();
                                setDeleteId(item?.schedule_id);
                              }}
                              id={item?.schedule_id}
                              type="button"
                            >
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
                              deleteScheduleOfTheUser();
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
                          {item?.email[0].toUpperCase()}
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
                          src={item?.photo_url}
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
