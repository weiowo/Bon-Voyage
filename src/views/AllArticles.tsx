import
{
  collection, where, query, onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import tw from '@/lib/tw';
import HeaderComponent from '../components/Headers/Header';
import db from '../utils/firebase-init';
import MyArticle, {
  CoverPhotoInMyArticle, MyArticleBelowArea, MyArticleTitle, MyArticleSummary, StyledLink,
} from '../components/Cards/Article';
import { ArticlesBoxesContainer } from '../components/ArticlesInHome';
import Footer from '../components/Footer';
import ARTICLE_COVER from '../constants/article.cover';
import type { Article } from '../types';

const PageWrapper = tw.div`
  w-[100vw] h-[100vh]
`;

const ArticleCoverImage = tw.div`
  w-[100vw] h-[500px] items-center justify-center bg-[url(/images/all_article_banner.webp)]
  bg-cover bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] relative
  bg-center max-[801px]:h-[280px]
`;

function AllArticlePage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  useEffect(() => {
    const pulishedArticlesRef = query(collection(db, 'articles'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(pulishedArticlesRef, (querySnapshot) => {
      const publishedArticlesArray: Article[] = [];
      querySnapshot.forEach((doc) => {
        publishedArticlesArray.push(doc.data() as Article);
      });
      setAllArticles(publishedArticlesArray);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage />
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
