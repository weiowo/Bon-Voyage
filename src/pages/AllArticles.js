import
{
  collection, where, query, onSnapshot,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import HeaderComponent from '../components/Headers/Header';
import AllArticleBaner from './images/all_article_banner.png';
import db from '../utils/firebase-init';
import MyArticle, {
  CoverPhotoInMyArticle, MyArticleBelowArea, MyArticleTitle, MyArticleSummary, StyledLink,
} from '../components/Cards/Article';
import { ArticlesBoxesContainer } from '../components/ArticlesInHome';
import Footer from '../components/Footer';
import ARTICLE_COVER from '../constants/article.cover';

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
@media screen and (max-width:800px){
  height:280px
}
`;

function AllArticlePage() {
  const [allArticles, setAllArticles] = useState([]);
  console.log(allArticles);

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
              <StyledLink
                key={item?.article_id}
                to={`/article?art_id=${item?.article_id}&sch_id=${item?.schedule_id}`}
              >
                <MyArticle
                  key={`${item?.article_id}+${item?.schedule_id}`}

                >
                  <CoverPhotoInMyArticle
                    src={item?.cover_img
                      ? item?.cover_img
                      : ARTICLE_COVER[Math.floor(Math.random()
                      * ARTICLE_COVER.length)]}
                    key={`${item?.cover_img}`}

                  />
                  <MyArticleBelowArea
                    key={`${item?.summary}+${item?.schedule_id}`}
                  >
                    <MyArticleTitle
                      key={`${item?.summary}+${item?.article_title}`}

                    >
                      {item?.article_title}

                    </MyArticleTitle>
                    <MyArticleSummary
                      key={`${item?.summary}+${item?.article_creator_user_id}`}
                    >
                      {item?.summary?.slice(0, 15)}
                      .....
                    </MyArticleSummary>
                  </MyArticleBelowArea>
                </MyArticle>
              </StyledLink>
            )) : ''}
          </ArticlesBoxesContainer>
        </div>
        <Footer />
      </PageWrapper>
    </>
  );
}

export default AllArticlePage;
