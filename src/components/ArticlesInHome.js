import styled from 'styled-components/macro';
import React, { useEffect, useState } from 'react';
import
{
  collection, where, query, onSnapshot,
} from 'firebase/firestore';
import db from '../utils/firebase-init';
import MyArticle, {
  CoverPhotoInMyArticle, MyArticleBelowArea, MyArticleTitle, MyArticleSummary, StyledLink,
} from './Cards/Article';
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
    font-size:25px;
    margin-bottom:10px;
  margin-top:20px;
  }
`;

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
  const [articles, setArticles] = useState();
  useEffect(() => {
    const pulishedArticlesRef = query(collection(db, 'articles'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(pulishedArticlesRef, (querySnapshot) => {
      const publishedArticlesArray = [];
      querySnapshot.forEach((doc) => {
        publishedArticlesArray.push(doc.data());
      });
      setArticles(publishedArticlesArray);
    });
    return unsubscribe;
  }, []);

  return (
    <ArticlesAreaWrapper>
      <ArticlesWrapperTitle>熱門遊記</ArticlesWrapperTitle>
      <ArticlesBoxesContainer>
        {articles ? articles.slice(0, 10).map((item) => (
          <StyledLink key={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`} to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}>
            <MyArticle key={item?.article_id}>
              <CoverPhotoInMyArticle
                key={item?.schedule_id}
                src={item?.cover_img ? item?.cover_img
                  : defaultArticleCoverPhoto[Math.floor(Math.random()
                        * defaultArticleCoverPhoto.length)]}
              />
              <MyArticleBelowArea>
                <MyArticleTitle key={item?.article_title}>{item?.article_title}</MyArticleTitle>
                <MyArticleSummary key={item?.summary}>
                  {item?.summary?.slice(0, 16)}
                  ...
                </MyArticleSummary>
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
