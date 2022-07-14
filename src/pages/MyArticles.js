import styled from 'styled-components/macro';
import React, { useEffect, useContext, useState } from 'react';
import {
  getDoc, doc, updateDoc, arrayRemove, deleteDoc,
//   query, where, collection, getDocs, arrayUnion, setDoc, updateDoc,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useImmer } from 'use-immer';
import GreyHeaderComponent from '../components/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import {
  PageWrapper, Line, DeleteModalTitle, DeleteAsk, DeleteButtonArea,
  NoDeleteButton, ConfirmDeleteButton,
} from './MySchedules';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import Cover1 from './images/schedule_cover_rec1.jpg';
import Cover2 from './images/schedule_cover_rec5.jpg';
import Cover3 from './images/schedule_cover_rec3.jpg';
import Cover4 from './images/camping.jpg';
import Cover5 from './images/schedule_cover_rec2.jpg';
import Cover6 from './images/schedule_cover_rec4.jpg';
import greyTrashCanSrc from './images/bin.png';

export const defaultArticleCoverPhoto = [Cover1, Cover2, Cover3, Cover4, Cover5, Cover6];

const MyArticlesArea = styled.div`
width:80vw;
height:85vh;
display:flex;
flex-direction:column;
padding-left:50px;
margin-top:30px;
`;

export const MyPageTitle = styled.div`
width:100%;
height:auto;
font-size:28px;
font-weight:600;
text-align:left;
@media screen and (max-width:800px){
  text-align:center;
  font-size:25px;
}`;

const Tabs = styled.div`
display:flex;
width:100%;
height:auto;
gap:20px;
margin-top:10px;
`;

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
width:100%;
height:100%;
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
`;

const ArticlePreviewAndDeleteWrapper = styled.div`
position:relative;
`;

export const UpperLine = styled.div`
height:1px;
background-color:grey;
width:90%;
`;

export const MyArticle = styled.div`
cursor:pointer;
width:190px;
height:250px;
flex-shrink:0;
border-radius:10px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:450px){
  width:40vw;
  height:50vw;
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

const DeletePublishedArticleIcon = styled.img`
width:20px;
height:20px;
z-index:300;
position:absolute;
top:140px;
right:20px;
cursor:pointer;
`;

const DeleteDraftArticleIcon = styled.img`
width:20px;
height:20px;
z-index:300;
position:absolute;
top:140px;
right:20px;
cursor:pointer;
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
  console.log(myDraftArticles);
  const [myPublishedArticles, setMyPublishedArticles] = useImmer([]);
  const [publishIsClicked, setPublishIsClciked] = useState(true);
  const [saveIsClicked, setSaveIsClciked] = useState(false);
  const [clickedDeleteId, setClickedDeleteId] = useState('');
  //   const navigate = useNavigate();
  console.log(myPublishedArticles);
  console.log(user);

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

  // 先拿到某個使用者的資料
  // 再根據行程array，去做foreach拿到所有schedule資料

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
          } else {
            console.log('沒有這個行程！');
          }
        });
      }
      getArticlesFromList();
    }
    getUserArticleArrayList();
  }, [setMyDraftArticles, setMyPublishedArticles, user.uid]);

  // 刪除文章：從user的owned articles array中刪除，也從articles db中刪除

  async function handleArticleDelete() {
    const userArticlesArray = doc(db, 'users', user.uid);
    await updateDoc(userArticlesArray, {
      owned_article_ids: arrayRemove(clickedDeleteId),
    });
    await deleteDoc(doc(db, 'articles', clickedDeleteId));
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
            <ConfirmDeleteButton onClick={() => { closeModal(); handleArticleDelete(); }} type="button">確認</ConfirmDeleteButton>
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
          <MyArticlesContainer isClicked={publishIsClicked}>
            {myPublishedArticles ? myPublishedArticles?.map((item) => (
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
                      <MyArticleSummary>{item?.summary?.slice(0, 30)}</MyArticleSummary>
                    </MyArticleBelowArea>
                  </MyArticle>
                </StyledLink>
                <DeletePublishedArticleIcon
                  src={greyTrashCanSrc}
                  onClick={() => { toggleModal(); setClickedDeleteId(item?.article_id); }}
                />
              </ArticlePreviewAndDeleteWrapper>
            )) : ''}
          </MyArticlesContainer>
          <MyArticlesContainer isClicked={saveIsClicked}>
            {myDraftArticles ? myDraftArticles?.map((item) => (
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
                      <MyArticleSummary>{item?.summary?.slice(0, 30)}</MyArticleSummary>
                    </MyArticleBelowArea>
                  </MyArticle>
                </StyledLink>
                <DeleteDraftArticleIcon
                  src={greyTrashCanSrc}
                  onClick={() => { toggleModal(); setClickedDeleteId(item?.article_id); }}
                />
              </ArticlePreviewAndDeleteWrapper>
            )) : ''}
          </MyArticlesContainer>
        </MyArticlesArea>
      </PageWrapper>
    </>
  );
}

export default MyArticles;
