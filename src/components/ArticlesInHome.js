import styled from 'styled-components/macro';
import React, { useEffect, useContext, useState } from 'react';
import {
//   getDoc, doc,
  collection, getDocs,
} from 'firebase/firestore';
// import { Link } from 'react-router-dom';
// import { useImmer } from 'use-immer';
import db from '../utils/firebase-init';
import UserContext from './UserContextComponent';
import {
  MyArticle, CoverPhotoInMyArticle,
  MyArticleBelowArea, MyArticleTitle, MyArticleSummary, StyledLink,
} from '../pages/MyArticles';
import Cover1 from '../pages/images/schedule_cover_rec1.jpg';
import Cover2 from '../pages/images/schedule_cover_rec5.jpg';
import Cover3 from '../pages/images/schedule_cover_rec3.jpg';
import Cover4 from '../pages/images/camping.jpg';
import Cover5 from '../pages/images/schedule_cover_rec2.jpg';
import Cover6 from '../pages/images/schedule_cover_rec4.jpg';

export const defaultArticleCoverPhoto = [Cover1, Cover2, Cover3, Cover4, Cover5, Cover6];

const ArticlesAreaWrapper = styled.div`
margin-top:20px;
width:100vw;
height:auto;
display:flex;
flex-direction:column;
align-items:center;
margin-bottom:60px;
`;

const ArticlesWrapperTitle = styled.div`
margin-top:20px;
width:100vw;
height:30px;
display:flex;
justify-content:center;
align-items:center;
font-size:24px;
font-weight:600;
color:#1F456E;
margin-bottom:30px;
margin-top:30px;
@media screen and (max-width:800px){
  font-size:30px;
}`;

export const ArticlesBoxesContainer = styled.div`
margin-top:30px;
display:flex;
justify-content:center;
align-items:center;
width:85vw;
height:auto;
display:flex;
margin-bottom:20px;
gap:30px;
flex-wrap:wrap;
&:after {
  content: "";
  width:410px;
}
@media screen and (max-width:800px){
  width:92vw;
  gap:20px;
}
`;

const CheckMoreButton = styled.button`
width:100px;
height:40px;
background-color:#0492c2;
color:white;
border:none;
border-radius:8px;
margin-top:20px;
font-weight:550;
cursor:pointer;
`;

function ArticlesInHome() {
  const user = useContext(UserContext);
  const [articles, setArticles] = useState();
  console.log(articles);
  //   const navigate = useNavigate();
  console.log(user);

  // 拿到所有articles資料並放到首頁

  useEffect(() => {
    async function getAllArticles() {
      const querySnapshot = await getDocs(collection(db, 'articles'));
      const articleList = querySnapshot.docs.map((item) => item.data());
      console.log(articleList);
      setArticles(articleList);
    }
    getAllArticles();
  }, []);

  return (
    <ArticlesAreaWrapper>
      <ArticlesWrapperTitle>熱門遊記</ArticlesWrapperTitle>
      <ArticlesBoxesContainer>
        {articles ? articles.slice(0, 10).map((item) => (
          <StyledLink to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
            <MyArticle>
              <CoverPhotoInMyArticle src={item?.cover_img ? item?.cover_img
                : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
              />
              <MyArticleBelowArea>
                <MyArticleTitle>{item?.article_title}</MyArticleTitle>
                <MyArticleSummary>{item?.summary?.slice(0, 10)}</MyArticleSummary>
              </MyArticleBelowArea>
            </MyArticle>
          </StyledLink>
        )) : ''}
      </ArticlesBoxesContainer>
      <StyledLink to="/all-articles">
        <CheckMoreButton>查看更多</CheckMoreButton>
      </StyledLink>
    </ArticlesAreaWrapper>

  );
}

export default ArticlesInHome;
