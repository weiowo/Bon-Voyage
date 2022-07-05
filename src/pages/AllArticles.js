import
{
  collection, where, query, onSnapshot,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import HeaderComponent from '../components/Header';
import AllArticleBaner from './images/all_article_banner.png';
import db from '../utils/firebase-init';
import {
  MyArticle, CoverPhotoInMyArticle,
  MyArticleBelowArea, MyArticleTitle, MyArticleSummary, StyledLink,
} from './MyArticles';
import { ArticlesBoxesContainer } from '../components/ArticlesInHome';

const PageWrapper = styled.div`
width:100vw;
height:100vh;
`;

const ArticleCoverImage = styled.div`
width:100vw;
height:500px;
align-items:center;
justify-content:center;
background-image: url(${AllArticleBaner});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
position:relative;
background-position:center;
`;

function AllArticlePage() {
  const [allArticles, setAllArticles] = useState([]);
  console.log(allArticles);

  // 有文章更新時就要及時拿出來！
  // unsubscribe讓它結束監聽

  useEffect(() => {
    const pulishedArticlesRef = query(collection(db, 'articles'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(pulishedArticlesRef, (querySnapshot) => {
      const publishedArticlesArray = [];
      querySnapshot.forEach((doc) => {
        publishedArticlesArray.push(doc.data());
      });
      setAllArticles(publishedArticlesArray);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage type="file" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ArticlesBoxesContainer>
            {allArticles ? allArticles.map((item) => (
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
        </div>
      </PageWrapper>
    </>
  );
}

export default AllArticlePage;
