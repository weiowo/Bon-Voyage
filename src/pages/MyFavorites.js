import styled from 'styled-components/macro';
import React, { useEffect, useContext, useState } from 'react';
import {
  getDoc, doc,
//   query, where, collection, getDocs, arrayUnion, setDoc, updateDoc,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useImmer } from 'use-immer';
import GreyHeaderComponent from '../components/GreyHeader';
import ProfileSideBarElement from '../components/ProfileSideBar';
import { PageWrapper, Line } from './MySchedules';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import Cover1 from './images/schedule_cover_rec1.jpg';
import Cover2 from './images/schedule_cover_rec5.jpg';
import Cover3 from './images/schedule_cover_rec3.jpg';
import Cover4 from './images/camping.jpg';
import Cover5 from './images/schedule_cover_rec2.jpg';
import Cover6 from './images/schedule_cover_rec4.jpg';

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
`;

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
overflow:scroll;
flex-wrap:wrap;
gap:15px;
margin-top:10px;
padding-bottom:10px;
padding-left:5px;
display:${(props) => (props.isClicked ? 'flex' : 'none')};

`;

export const UpperLine = styled.div`
height:1px;
background-color:grey;
width:75vw;
`;

export const MyArticle = styled.div`
cursor:pointer;
width:190px;
height:250px;
flex-shrink:0;
border-radius:10px;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

function MyLovedArticles() {
  const user = useContext(UserContext);
  const [myLovedArticles, setMyLovedArticles] = useImmer([]);
  const [myLovedAttractions, setMyLovedAttractions] = useImmer([]);
  console.log(myLovedArticles);
  console.log(myLovedAttractions);
  const [publishIsClicked, setPublishIsClciked] = useState(true);
  const [saveIsClicked, setSaveIsClciked] = useState(false);
  //   const navigate = useNavigate();
  console.log(user);

  // 先拿到某個使用者的資料，拿到收藏的article array跟attraction array後
  // 去articles跟places資料庫搜出來

  useEffect(() => {
    async function getUser() {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data().loved_article_ids);
      } else {
        console.log('No such document!');
      }
      function getLovedArticles() {
        docSnap.data().loved_article_ids.forEach(async (item) => {
          const docs = doc(db, 'articles', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            setMyLovedArticles((draft) => {
              draft.push(Snap.data());
            });
          }
        });
      }
      function getLovedAttractions() {
        docSnap.data().loved_attraction_ids.forEach(async (item) => {
          const docs = doc(db, 'attractions', item);
          const Snap = await getDoc(docs);
          if (Snap.exists()) {
            setMyLovedAttractions((draft) => {
              draft.push(Snap.data());
            });
          }
        });
      }
      getLovedArticles();
      getLovedAttractions();
    }
    getUser();
  }, [setMyLovedArticles, setMyLovedAttractions, user.uid]);

  return (
    <>
      <GreyHeaderComponent />
      <PageWrapper>
        <ProfileSideBarElement />
        <Line />
        <MyArticlesArea>
          <MyPageTitle>我的收藏</MyPageTitle>
          <Tabs>
            <Tab
              isClicked={publishIsClicked}
              onClick={() => { setPublishIsClciked(true); setSaveIsClciked(false); }}
            >
              文章
            </Tab>
            <Tab
              isClicked={saveIsClicked}
              onClick={() => { setPublishIsClciked(false); setSaveIsClciked(true); }}
            >
              景點
            </Tab>
          </Tabs>
          <UpperLine />
          <MyArticlesContainer isClicked={publishIsClicked}>
            {myLovedArticles ? myLovedArticles?.map((item) => (
              <StyledLink to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
                <MyArticle>
                  <CoverPhotoInMyArticle
                    src={item?.cover_img ? item?.cover_img
                      : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
                  />
                  <MyArticleBelowArea>
                    <MyArticleTitle>{item?.article_title}</MyArticleTitle>
                    <MyArticleSummary>{item?.summary}</MyArticleSummary>
                  </MyArticleBelowArea>
                </MyArticle>
              </StyledLink>
            )) : ''}
          </MyArticlesContainer>
          <MyArticlesContainer isClicked={saveIsClicked}>
            {myLovedAttractions ? myLovedAttractions?.map((item) => (
              <MyArticle>
                <CoverPhotoInMyArticle
                  src={item?.place_url ? item?.place_url
                    : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
                />
                <MyArticleBelowArea>
                  <MyArticleTitle>{item?.place_title}</MyArticleTitle>
                  <MyArticleSummary>{item?.place_address}</MyArticleSummary>
                </MyArticleBelowArea>
              </MyArticle>
            )) : ''}
          </MyArticlesContainer>
        </MyArticlesArea>
      </PageWrapper>
    </>
  );
}

export default MyLovedArticles;
