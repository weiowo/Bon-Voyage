import styled from 'styled-components/macro';
import React, { useEffect, useContext } from 'react';
import {
  getDoc, doc,
//   query, where, collection, getDocs, arrayUnion, setDoc, updateDoc,
} from 'firebase/firestore';
import { useImmer } from 'use-immer';
import GreyHeaderComponent from '../components/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import { PageWrapper, Line } from './MySchedules';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';

const MyArticlesArea = styled.div`
width:80vw;
height:80vh;
border:1px solid black;
display:flex;
flex-direction:column;
margin-left:50px;
margin-top:30px;
`;

const MyArticlesTitle = styled.div`
width:100%;
height:auto;
font-size:28px;
font-weight:600;
text-align:left;
`;

const MyArticlesContainer = styled.div`
width:100%;
height:100%;
border:1px solid red;
display:flex;
overflow:scroll;
flex-wrap:wrap;
gap:10px;
margin-top:10px;
`;

const UpperLine = styled.div`
height:1px;
background-color:grey;
width:80vw;
`;

const MyArticle = styled.div`
width:200px;
height:260px;
flex-shrink:0;
border-radius:10px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const CoverPhotoInMyArticle = styled.img`
width:100%;
height:50%;
border-top-right-radius:10px;
border-top-left-radius:10px;
`;

const MyArticleTitle = styled.div`
width:100%;
height:30px;
font-weight:550;
font-size:16px;
text-align:left;
`;

const MyArticleSummary = styled.div`
width:100%;
height:30px;
font-size:13px;
text-align:left;
font-weight:500;
color:grey;
`;

function MyArticles() {
  const user = useContext(UserContext);
  const [myDraftArticles, setMyDraftArticles] = useImmer([]);
  console.log(myDraftArticles);
  const [myPublishedArticles, setMyPublishedArticles] = useImmer([]);
  console.log(myPublishedArticles);
  console.log(user);

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

  return (
    <>
      <GreyHeaderComponent />
      <PageWrapper>
        <ProfileSideBarElement />
        <Line />
        <MyArticlesArea>
          <MyArticlesTitle>我的文章</MyArticlesTitle>
          <UpperLine />
          <MyArticlesContainer>
            {myPublishedArticles ? myPublishedArticles.map((item) => (
              <MyArticle>
                <CoverPhotoInMyArticle src={item?.cover_img} />
                <MyArticleTitle>{item.article_title}</MyArticleTitle>
                <MyArticleSummary>哈哈</MyArticleSummary>
              </MyArticle>
            )) : ''}
          </MyArticlesContainer>
        </MyArticlesArea>
      </PageWrapper>
    </>
  );
}

export default MyArticles;
