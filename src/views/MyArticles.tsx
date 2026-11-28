import React, { useEffect, useContext, useState } from 'react';
import {
  getDoc, doc, updateDoc, arrayRemove, deleteDoc,
  collection, arrayUnion, setDoc, Timestamp,
} from 'firebase/firestore';
import { useNavigate } from '@/lib/router';
import { useImmer } from 'use-immer';
import tw from '@/lib/tw';
import GreyHeaderComponent from '../components/Headers/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import DeleteAsk, {
  DeleteButtonArea, ConfirmDeleteButton, NoDeleteButton, DeleteModalTitle,
} from '../components/DeleteSchModal/DeleteSchModal';
import RemindWrapper, {
  ClickAndAdd, RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from '../components/Reminder/CreateTrip';
import Line from '../components/Line';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import SchedulesWrapper, {
  CurrentSchedulesTitle, ScheduleBoxWrapper, ScheduleBox, ScheduleTitle,
} from '../components/Modal/ScheduleChoice';
import Modal from '../components/Modal/Modal';
import CloseModalButton from '../components/Modal/CloseButton';
import ARTICLE_COVER from '../constants/article.cover';
import WriteArticleRemind, {
  WriteArticleImg, WriteRightArea, WriteText, WriteButton,
} from '../components/Reminder/CreateArticle';
import MyArticle, {
  CoverPhotoInMyArticle, MyArticleBelowArea, MyArticleTitle, MyArticleSummary,
  StyledLink, ArticleTitleAndDeleteIcon,
} from '../components/Cards/Article';
import type {
  Article, ArticleStatus, Schedule, UserProfile,
} from '../types';

const Travel = '/images/travel-2.png';
const Suitcase = '/images/suitcase-2.png';
const greyTrashCanSrc = '/images/bin.png';
const WriteRemindIcon = '/images/picture.png';

const ConfirmWritingButton = tw.button`
  w-[80px] h-[35px] bg-[#598BAF] text-white rounded-[10px] [border:none] shrink-0
  cursor-pointer font-semibold
`;

const PageWrapper = tw.div`
  w-[100vw] flex flex-row pt-[60px] max-[801px]:justify-center
`;

const MyArticlesArea = tw.div`
  w-[80vw] h-[85vh] flex flex-col pl-[50px] mt-[30px] max-[801px]:pl-[0px]
  max-[801px]:w-[93vw]
`;

export const MyPageTitle = tw.div`
  w-[90%] h-auto text-[28px] font-semibold text-left max-[801px]:text-center
  max-[801px]:text-[25px] max-[801px]:w-full
`;

const Tabs = tw.div`
  flex w-[90%] h-auto gap-[20px] mt-[10px] max-[801px]:w-full
`;

const Tab = tw.div<{ isClicked?: boolean }>`
  w-[50px] h-[30px] text-[15px] font-medium flex items-center justify-center cursor-pointer
  ${(p) => (p.isClicked ? 'bg-[#E6D1F2]' : '')}
  ${(p) => (p.isClicked ? 'text-black' : '[color:grey]')}
`;

const MyArticlesContainer = tw.div<{ isClicked?: boolean }>`
  w-[90%] flex-wrap gap-[15px] mt-[10px] pb-[10px] pl-[5px] overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3] max-[801px]:w-full max-[801px]:justify-center
  max-[801px]:pl-[0px] max-[381px]:gap-[5px]
  ${(p) => (p.isClicked ? 'flex' : 'hidden')}
`;

export const UpperLine = tw.div`
  h-[1px] shrink-0 [background-color:grey] w-[90%] max-[801px]:w-full
`;

const ArticlePreviewAndDeleteWrapper = tw.div`
  relative w-[190px] h-[250px] max-[1201px]:w-[160px] max-[1201px]:h-[200px]
`;

const DeletePublishedArticleIcon = tw.img`
  w-[20px] h-[20px] absolute top-[140px] right-[20px] cursor-pointer z-[200]
  max-[1201px]:top-[115px] max-[1201px]:right-[20px] max-[381px]:top-[115px]
  max-[381px]:right-[30px] max-[381px]:w-[18px] max-[381px]:h-[18px]
`;

const DeleteDraftArticleIcon = tw.img`
  w-[20px] h-[20px] z-[300] absolute top-[140px] right-[20px] cursor-pointer
  max-[1201px]:top-[115px] max-[1201px]:right-[20px]
`;

function MyArticles() {
  const user = useContext(UserContext);
  const [myDraftArticles, setMyDraftArticles] = useImmer<Article[]>([]);
  const [myPublishedArticles, setMyPublishedArticles] = useImmer<Article[]>([]);
  const [publishIsClicked, setPublishIsClciked] = useState(true);
  const [saveIsClicked, setSaveIsClciked] = useState(false);
  const [clickedDeleteId, setClickedDeleteId] = useState('');
  const [deletedArtStatus, setDeletedArtStatus] = useState<ArticleStatus | ''>('');
  const [myArtPageScheduleData, setMyArtPageScheduleData] = useImmer<Schedule[]>([]);
  const [modalIsActive, setModalIsActive] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState<number>();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserArrayList() {
      if (!user?.uid) { return; }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const profile = docSnap.data() as UserProfile | undefined;
      if (docSnap.exists()) {
        console.log('Document data:', profile?.owned_schedule_ids);
      } else {
        console.log('No such document!');
      }
      function getSchedulesFromList() {
        profile?.owned_schedule_ids.forEach(async (item) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            const schedule = Snap.data() as Schedule;
            if (schedule.deleted === false) {
              setMyArtPageScheduleData((draft) => {
                draft.push(schedule);
              });
            }
          } else {
            console.log('沒有這個行程！');
          }
        });
      }
      getSchedulesFromList();
    }
    getUserArrayList();
  }, [setMyArtPageScheduleData, user.uid]);

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

  useEffect(() => {
    async function getUserArticleArrayList() {
      if (!user?.uid) { return; }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const profile = docSnap.data() as UserProfile | undefined;
      if (docSnap.exists()) {
        console.log('Document data:', profile?.owned_article_ids);
      } else {
        console.log('No such document!');
      }
      function getArticlesFromList() {
        profile?.owned_article_ids.forEach(async (item) => {
          const docs = doc(db, 'articles', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            const article = Snap.data() as Article;
            if (article.status === 'draft') {
              setMyDraftArticles((draft) => {
                draft.push(article);
              });
            } else {
              setMyPublishedArticles((draft) => {
                draft.push(article);
              });
            }
          }
        });
      }
      getArticlesFromList();
    }
    getUserArticleArrayList();
  }, [setMyDraftArticles, setMyPublishedArticles, user.uid]);

  async function handleArticleDelete() {
    if (!user.uid) return;
    if (deletedArtStatus === 'draft') {
      setMyDraftArticles(myDraftArticles.filter((item) => item.article_id !== clickedDeleteId));
    } else if (deletedArtStatus === 'published') {
      setMyPublishedArticles(myPublishedArticles
        .filter((item) => item.article_id !== clickedDeleteId));
    }
    const userArticlesArray = doc(db, 'users', user.uid);
    await updateDoc(userArticlesArray, {
      owned_article_ids: arrayRemove(clickedDeleteId),
    });
    await deleteDoc(doc(db, 'articles', clickedDeleteId));
  }

  function filterArticle() {
    setMyDraftArticles(myDraftArticles.filter((item) => item.article_id !== clickedDeleteId));
  }
  return (
    <>
      <GreyHeaderComponent />
      <div className="modal-background">
        <div className="modal">
          <DeleteModalTitle>
            Delete
          </DeleteModalTitle>
          <DeleteAsk>確認要刪除嗎？</DeleteAsk>
          <DeleteButtonArea>
            <NoDeleteButton onClick={() => closeModal()} type="button">取消</NoDeleteButton>
            <ConfirmDeleteButton onClick={() => { closeModal(); handleArticleDelete(); filterArticle(); }} type="button">確認</ConfirmDeleteButton>
          </DeleteButtonArea>
        </div>
      </div>
      <PageWrapper>
        <ProfileSideBarElement />
        <Line />
        <MyArticlesArea>
          <MyPageTitle>我的文章</MyPageTitle>
          <Tabs>
            <Tab
              isClicked={publishIsClicked}
              onClick={() => { setPublishIsClciked(true); setSaveIsClciked(false); }}
            >
              發布
            </Tab>
            <Tab
              isClicked={saveIsClicked}
              onClick={() => { setPublishIsClciked(false); setSaveIsClciked(true); }}
            >
              草稿
            </Tab>
          </Tabs>
          <UpperLine />
          <Modal active={modalIsActive} flexDirection="column">
            <SchedulesWrapper>
              <CurrentSchedulesTitle>您的現有行程</CurrentSchedulesTitle>
              <ScheduleBoxWrapper>
                {myArtPageScheduleData.length === 0 ? (
                  <RemindWrapper style={{ width: '100%', justifyContent: 'center' }}>
                    <RemindIcon src={Travel} />
                    <RemindRightPart style={{ width: 'auto' }}>
                      <RemindText>
                        沒有可編輯行程～
                        <br />
                        是時候創建行程囉！
                      </RemindText>
                      <StyledBlackLink to="/choose-date">
                        <ClickAndAdd>點我創建</ClickAndAdd>
                      </StyledBlackLink>
                      <SuitcaseIcon src={Suitcase} />
                    </RemindRightPart>
                  </RemindWrapper>
                )
                  : myArtPageScheduleData.map((item, index) => (
                    <ScheduleBox
                      key={item?.schedule_id}
                      clicked={index === selectedScheduleIndex}
                      onClick={() => {
                        setSelectedSchedule(item);
                        setSelectedScheduleIndex(index);
                      }}
                      id={item.schedule_id}
                    >
                      <ScheduleTitle>
                        {item.title}
                      </ScheduleTitle>
                    </ScheduleBox>
                  ))}
              </ScheduleBoxWrapper>
              {myArtPageScheduleData.length === 0 ? '' : <ConfirmWritingButton type="button" onClick={() => setNewArticleToDb()}>確認</ConfirmWritingButton>}
            </SchedulesWrapper>
            <CloseModalButton
              type="button"
              onClick={() => setModalIsActive(false)}
            >
              X
            </CloseModalButton>
          </Modal>
          <MyArticlesContainer isClicked={publishIsClicked}>
            {myPublishedArticles.length === 0
              ? (
                <WriteArticleRemind>
                  <WriteArticleImg src={WriteRemindIcon} />
                  <WriteRightArea>
                    <WriteText>
                      還沒有文章唷～
                      <br />
                      趕快來撰寫遊記
                      <br />
                      分享旅遊心得吧!
                    </WriteText>
                    <WriteButton onClick={() => { setModalIsActive(true); }}>點我撰寫</WriteButton>
                  </WriteRightArea>
                </WriteArticleRemind>
              ) : myPublishedArticles?.map((item) => (
                <ArticlePreviewAndDeleteWrapper key={item?.article_id}>
                  <StyledLink to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
                    <MyArticle>
                      <CoverPhotoInMyArticle
                        src={item?.cover_img ? item?.cover_img
                          : ARTICLE_COVER[Math.floor(Math.random()
                        * ARTICLE_COVER.length)]}
                      />
                      <MyArticleBelowArea>
                        <ArticleTitleAndDeleteIcon>
                          <MyArticleTitle>
                            {item?.article_title}
                          </MyArticleTitle>
                        </ArticleTitleAndDeleteIcon>
                        <MyArticleSummary>
                          {item?.summary?.slice(0, 16)}
                          ...
                        </MyArticleSummary>
                      </MyArticleBelowArea>
                    </MyArticle>
                  </StyledLink>
                  <DeletePublishedArticleIcon
                    src={greyTrashCanSrc}
                    onClick={() => {
                      toggleModal(); setClickedDeleteId(item?.article_id);
                      setDeletedArtStatus(item?.status);
                    }}
                  />
                </ArticlePreviewAndDeleteWrapper>
              ))}
          </MyArticlesContainer>
          <MyArticlesContainer isClicked={saveIsClicked}>
            {myDraftArticles.length === 0
              ? (
                <WriteArticleRemind>
                  <WriteArticleImg src={WriteRemindIcon} />
                  <WriteRightArea>
                    <WriteText>
                      還沒有文章唷～
                      <br />
                      趕快來撰寫遊記
                      <br />
                      分享旅遊心得吧!
                    </WriteText>
                    <WriteButton onClick={() => { setModalIsActive(true); }}>點我撰寫</WriteButton>
                  </WriteRightArea>
                </WriteArticleRemind>
              ) : myDraftArticles?.map((item) => (
                <ArticlePreviewAndDeleteWrapper key={item?.article_id}>
                  <StyledLink to={`/edit?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
                    <MyArticle>
                      <CoverPhotoInMyArticle
                        src={item?.cover_img ? item?.cover_img
                          : ARTICLE_COVER[Math.floor(Math.random()
                        * ARTICLE_COVER.length)]}
                      />
                      <MyArticleBelowArea>
                        <ArticleTitleAndDeleteIcon>
                          <MyArticleTitle>
                            {item?.article_title}
                          </MyArticleTitle>
                        </ArticleTitleAndDeleteIcon>
                        <MyArticleSummary>
                          {item?.summary?.slice(0, 16)}
                          ...
                        </MyArticleSummary>
                      </MyArticleBelowArea>
                    </MyArticle>
                  </StyledLink>
                  <DeleteDraftArticleIcon
                    src={greyTrashCanSrc}
                    onClick={() => {
                      toggleModal(); setClickedDeleteId(item?.article_id);
                      setDeletedArtStatus(item?.status);
                    }}
                  />
                </ArticlePreviewAndDeleteWrapper>
              ))}
          </MyArticlesContainer>
        </MyArticlesArea>
      </PageWrapper>
    </>
  );
}

export default MyArticles;
