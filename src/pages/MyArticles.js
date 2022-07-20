import styled from 'styled-components/macro';
import React, { useEffect, useContext, useState } from 'react';
import {
  getDoc, doc, updateDoc, arrayRemove, deleteDoc,
  collection, arrayUnion, setDoc,
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import GreyHeaderComponent from '../components/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import {
  Line, DeleteModalTitle, DeleteAsk, DeleteButtonArea,
  NoDeleteButton, ConfirmDeleteButton, RemindWrapper, ClickAndAdd,
  RemindIcon, RemindText, SuitcaseIcon, RemindRightPart, StyledBlackLink,
} from './MySchedules';
import Travel from './images/travel-2.png';
import Suitcase from './images/suitcase-2.png';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import Cover1 from './images/schedule_cover_rec1.jpg';
import Cover2 from './images/schedule_cover_rec5.jpg';
import Cover3 from './images/schedule_cover_rec3.jpg';
import Cover4 from './images/camping.jpg';
import Cover5 from './images/schedule_cover_rec2.jpg';
import Cover6 from './images/schedule_cover_rec4.jpg';
import greyTrashCanSrc from './images/bin.png';
import WriteRemindIcon from './images/picture.png';
import {
  ModalBackground, ModalBox, CurrentSchedulesTitle, ScheduleChoicesBoxWrapper,
  ScheduleChoicesBox, ScheduleChoiceTitle, CloseModalButton, ModalContentWrapper,
} from './City';

export const defaultArticleCoverPhoto = [Cover1, Cover2, Cover3, Cover4, Cover5, Cover6];

export const WriteArticleRemind = styled.div`
  width:50%;
  height:150px;
  display:flex;
  margin-top:20px;
  gap:15px;
@media screen and (max-width:800px){
  width:100%;
  justify-content:center;
}`;

export const ConfirmWritingButton = styled.button`
  width:80px;
  height:35px;
  background-color:#598BAF;
  color:white;
  border-radius:10px;
  border:none;
  flex-shrink:0;
  cursor:pointer;
  font-weight:600;
`;

export const WriteArticleImg = styled.img`
width:150px;
height:150px;
`;

export const WriteRightArea = styled.div`
  width:auto;
  height:150px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:20px;
@media screen and (max-width:800px){
  width:auto;
}`;

export const WriteText = styled.div`
  font-size:15px;
  font-weight:600;
  text-align:left;
`;

export const WriteButton = styled.button`
width:100px;
height:40px;
border-radius:10px;
background-color:#598BAF;
color:white;
font-weight:600;
border:none;
font-size:15px;
cursor:pointer;
`;

const PageWrapper = styled.div`
width:100vw;
height:calc(100vh-60px);
display:flex;
flex-direction:row;
padding-top:60px;
@media screen and (max-width:800px){
justify-content:center;
}
`;

const MyArticlesArea = styled.div`
width:80vw;
height:85vh;
display:flex;
flex-direction:column;
padding-left:50px;
margin-top:30px;
@media screen and (max-width:800px){
  padding-left:0px;
}
@media screen and (max-width:800px){
  width:93vw;
}
`;

export const MyPageTitle = styled.div`
width:90%;
height:auto;
font-size:28px;
font-weight:600;
text-align:left;
@media screen and (max-width:800px){
  text-align:center;
  font-size:25px;
  width:100%;
}`;

const Tabs = styled.div`
display:flex;
width:90%;
height:auto;
gap:20px;
margin-top:10px;
@media screen and (max-width:800px){
  width:100%;
}`;

const Tab = styled.div`
width:50px;
height:30px;
font-size:15px;
font-weight:500;
display:flex;
align-items:center;
justify-content:center;
background-color:${(props) => (props.isClicked ? '#E6D1F2' : '')};
color:${(props) => (props.isClicked ? 'black' : 'grey')};
cursor:pointer;
`;

const MyArticlesContainer = styled.div`
width:90%;
flex-wrap:wrap;
gap:15px;
margin-top:10px;
padding-bottom:10px;
padding-left:5px;
display:${(props) => (props.isClicked ? 'flex' : 'none')};
overflow:auto;
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
  width:100%;
  justify-content:center;
  padding-left:0px;
}
@media screen and (max-width:380px){
  gap:5px;
}`;

export const UpperLine = styled.div`
height:1px;
flex-shrink:0;
background-color:grey;
width:90%;
@media screen and (max-width:800px){
  width:100%;
}
`;

export const MyArticle = styled.div`
cursor:pointer;
width:190px;
height:250px;
flex-shrink:0;
border-radius:10px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:1200px){
  width:160px;
  height:200px;
}
@media screen and (max-width:450px){
  width:160px;
  height:200px;
}
`;

export const CoverPhotoInMyArticle = styled.img`
width:100%;
height:50%;
border-top-right-radius:10px;
border-top-left-radius:10px;
object-fit: cover;
`;

export const MyArticleBelowArea = styled.div`
width:80%;
height:auto;
display:flex;
flex-direction:column;
align-items:center;
margin-left:15px;
margin-top:10px;
margin-right:15px;
`;

export const MyArticleTitle = styled.div`
width:100%;
height:30px;
font-weight:550;
font-size:16px;
text-align:left;
`;

export const MyArticleSummary = styled.div`
width:100%;
height:30px;
font-size:13px;
text-align:left;
font-weight:500;
color:grey;
`;

export const StyledLink = styled(Link)`
cursor:pointer;
text-decoration:none;
color:black;
border:none;
`;

const ArticlePreviewAndDeleteWrapper = styled.div`
position:relative;
width:190px;
height:250px;
@media screen and (max-width:1200px){
  width:160px;
  height:200px;
}
`;

const DeletePublishedArticleIcon = styled.img`
width:20px;
height:20px;
position:absolute;
top:140px;
right:20px;
cursor:pointer;
z-index:200;
@media screen and (max-width:1200px){
  top:115px;
  right:20px;
}
@media screen and (max-width:380px){
  top:115px;
  right:30px;
  width:18px;
  height:18px;
}`;

const DeleteDraftArticleIcon = styled.img`
width:20px;
height:20px;
z-index:300;
position:absolute;
top:140px;
right:20px;
cursor:pointer;
@media screen and (max-width:1200px){
  top:115px;
  right:20px;
}
`;

const ArticleTitleAndDeleteIcon = styled.div`
width:100%;
height:auto;
display:flex;
justify-content:space-between;
`;

function MyArticles() {
  const user = useContext(UserContext);
  const [myDraftArticles, setMyDraftArticles] = useImmer([]);
  const [myPublishedArticles, setMyPublishedArticles] = useImmer([]);
  const [publishIsClicked, setPublishIsClciked] = useState(true);
  const [saveIsClicked, setSaveIsClciked] = useState(false);
  const [clickedDeleteId, setClickedDeleteId] = useState('');
  const [deletedArtStatus, setDeletedArtStatus] = useState('');
  const [myArtPageScheduleData, setMyArtPageScheduleData] = useImmer([]);
  const [modalIsActive, setModalIsActive] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState();
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState();
  const navigate = useNavigate();

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
        docSnap.data().owned_schedule_ids.forEach(async (item) => {
          const docs = doc(db, 'schedules', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().deleted === false) {
              setMyArtPageScheduleData((draft) => {
                draft.push(Snap.data());
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

  // 彈出刪除視窗動畫
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
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().owned_article_ids);
      } else {
        console.log('No such document!');
      }
      function getArticlesFromList() {
        docSnap.data().owned_article_ids.forEach(async (item) => {
          const docs = doc(db, 'articles', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            if (Snap.data().status === 'draft') {
              setMyDraftArticles((draft) => {
                draft.push(Snap.data());
              });
            } else {
              setMyPublishedArticles((draft) => {
                draft.push(Snap.data());
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
          <ModalBackground active={modalIsActive}>
            <ModalBox style={{ display: 'flex', flexDirection: 'column' }}>
              <ModalContentWrapper>
                <CurrentSchedulesTitle>您的現有行程</CurrentSchedulesTitle>
                <ScheduleChoicesBoxWrapper>
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
                      <ScheduleChoicesBox
                        clicked={index === selectedScheduleIndex}
                        onClick={() => {
                          setSelectedSchedule(item);
                          setSelectedScheduleIndex(index);
                        }}
                        id={item.schedule_id}
                      >
                        <ScheduleChoiceTitle>
                          {item.title}
                        </ScheduleChoiceTitle>
                      </ScheduleChoicesBox>
                    ))}
                </ScheduleChoicesBoxWrapper>
                {myArtPageScheduleData.length === 0 ? '' : <ConfirmWritingButton type="button" onClick={() => setNewArticleToDb()}>確認</ConfirmWritingButton>}
              </ModalContentWrapper>
              <CloseModalButton
                type="button"
                onClick={() => setModalIsActive(false)}
              >
                X
              </CloseModalButton>
            </ModalBox>
          </ModalBackground>
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
                <ArticlePreviewAndDeleteWrapper>
                  <StyledLink to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
                    <MyArticle>
                      <CoverPhotoInMyArticle
                        src={item?.cover_img ? item?.cover_img
                          : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
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
                <ArticlePreviewAndDeleteWrapper>
                  <StyledLink to={`/edit?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
                    <MyArticle>
                      <CoverPhotoInMyArticle
                        src={item?.cover_img ? item?.cover_img
                          : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
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
