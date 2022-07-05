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

const ArticlesAreaWrapper = styled.div`
margin-top:20px;
width:100vw;
height:auto;
display:flex;
flex-direction:column;
align-items:center;
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
gap:30px;
flex-wrap:wrap;
&:after {
  content: "";
  width:410px;
}
`;

const CheckMoreButton = styled.button`
width:100px;
height:30px;
background-color:#0492c2;
color:white;
border:none;
border-radius:10px;
margin-top:20px;
font-weight:550;
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
              <CoverPhotoInMyArticle src={item?.cover_img} />
              <MyArticleBelowArea>
                <MyArticleTitle>{item?.article_title}</MyArticleTitle>
                <MyArticleSummary>{item?.summary}</MyArticleSummary>
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
