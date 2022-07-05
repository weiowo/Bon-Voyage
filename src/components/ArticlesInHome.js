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
  width:380px;
}
`;

// const MyArticle = styled.div`
// cursor:pointer;
// width:190px;
// height:250px;
// border-radius:10px;
// box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
// `;

// const CoverPhotoInMyArticle = styled.img`
// width:100%;
// height:50%;
// border-top-right-radius:10px;
// border-top-left-radius:10px;
// `;

// const MyArticleBelowArea = styled.div`
// width:80%;
// height:auto;
// display:flex;
// flex-direction:column;
// align-items:center;
// margin-left:15px;
// margin-top:10px;
// margin-right:15px;
// `;

// const MyArticleTitle = styled.div`
// width:100%;
// height:30px;
// font-weight:550;
// font-size:16px;
// text-align:left;
// `;

// const MyArticleSummary = styled.div`
// width:100%;
// height:30px;
// font-size:13px;
// text-align:left;
// font-weight:500;
// color:grey;
// `;

// const StyledLink = styled(Link)`
// cursor:pointer;
// text-decoration:none;
// color:black;
// border:none;
// `;

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
