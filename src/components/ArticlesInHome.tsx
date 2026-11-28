import React, { useEffect, useState } from 'react';
import
{
  collection, where, query, onSnapshot,
} from 'firebase/firestore';
import tw from '@/lib/tw';
import db from '../utils/firebase-init';
import MyArticle, {
  CoverPhotoInMyArticle, MyArticleBelowArea, MyArticleTitle, MyArticleSummary, StyledLink,
} from './Cards/Article';
import type { Article } from '../types';

const Cover1 = '/images/schedule_cover_rec1.webp';
const Cover2 = '/images/schedule_cover_rec5.webp';
const Cover3 = '/images/schedule_cover_rec3.webp';
const Cover4 = '/images/camping.webp';
const Cover5 = '/images/schedule_cover_rec2.webp';
const Cover6 = '/images/schedule_cover_rec4.webp';

export const defaultArticleCoverPhoto = [Cover1, Cover2, Cover3, Cover4, Cover5, Cover6];

const ArticlesAreaWrapper = tw.div`
  mt-[20px] w-[100vw] h-auto flex flex-col items-center mb-[60px]
`;

const ArticlesWrapperTitle = tw.div`
  w-[100vw] h-[30px] flex justify-center items-center text-[24px] font-semibold
  text-[#1F456E] mb-[30px] mt-[30px] max-tablet:text-[25px] max-tablet:mb-[10px]
  max-tablet:mt-[20px]
`;

export const ArticlesBoxesContainer = tw.div`
  mt-[30px] justify-center items-center w-[85vw] h-auto flex mb-[20px] gap-[30px] flex-wrap
  max-tablet:w-[92vw] max-tablet:gap-[20px]
`;

const CheckMoreButton = tw.button`
  w-[100px] h-[40px] bg-[#0492c2] text-white [border:none] rounded-[8px] mt-[20px]
  [font-weight:550] cursor-pointer
`;

function ArticlesInHome() {
  const [articles, setArticles] = useState<Article[]>();
  useEffect(() => {
    const pulishedArticlesRef = query(collection(db, 'articles'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(pulishedArticlesRef, (querySnapshot) => {
      const publishedArticlesArray: Article[] = [];
      querySnapshot.forEach((doc) => {
        publishedArticlesArray.push(doc.data() as Article);
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
