import
{
  doc, getDoc, updateDoc, arrayRemove, arrayUnion,
} from 'firebase/firestore';
import { HashLink, useLocation, useNavigate } from '@/lib/router';
import React, {
  useEffect, useState, useContext, Fragment,
} from 'react';
import Swal from 'sweetalert2';
import { useImmer } from 'use-immer';
import tw from '@/lib/tw';
import HeaderComponent from '../components/Headers/Header';
import db from '../utils/firebase-init';
import UserContext from '../components/UserContextComponent';
import STAR from '../constants/stars';
import type { Article, UserProfile } from '../types';

const defaultCover = '/images/schedule_cover_rec3.webp';

const PageWrapper = tw.div`
  w-[100vw] h-[100vh]
`;

const ArticleCoverImage = tw.div`
  w-[100vw] h-[500px] items-center justify-center bg-[url(/images/share_banner2.webp)]
  bg-cover bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] relative
  bg-center object-cover max-[801px]:h-[300px]
`;

const ArticlePageBelowPart = tw.div`
  w-[100vw] h-[500px] flex-col items-center flex
`;

const ArticleAuthorDate = tw.div`
  [color:grey] font-semibold
`;

const ArticleEditPart = tw.div`
  w-[75vw] h-auto flex justify-between max-[801px]:w-[85vw]
`;

const AddFavoriteIcon = tw.img`
  w-[30px] h-[30px] cursor-pointer
`;

const ArticleCoverPhotoWrapper = tw.img`
  w-[50vw] h-[380px] ml-[5px] mt-[2px] rounded-[3px] [outline:none] [border:none] bg-cover
  bg-no-repeat [background-blend-mode:multiply] bg-center shrink-0
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)] object-cover max-[681px]:w-full
  max-[681px]:h-auto
`;

const Description = tw.div`
  text-left pl-[10px] pt-[10px] w-[calc(50vw_-_3px)] ml-[3px] mb-[10px] h-auto text-[16px]
  mt-[20px] [outline:none] shrink-0 rounded-[5px] [border:none] max-[681px]:w-full
`;

const ArticleTitleButtonArea = tw.div`
  w-[75vw] h-auto flex max-[801px]:w-[85vw]
`;

const ArticleTitle = tw.div`
  w-[50vw] h-auto text-[35px] font-semibold text-left mt-[20px] mb-[20px] [outline:none]
  [border:none] flex items-center justify-between max-[801px]:w-[55vw] max-[681px]:w-full
`;

const EditingPart = tw.div`
  w-[51vw] h-[600px] flex flex-col items-start gap-[5px] overflow-y-auto overflow-x-hidden
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3] max-[801px]:w-[56vw] max-[681px]:w-full
`;

const PlaceArea = tw.div`
  w-full flex flex-col items-start
`;

const ScheduleSummaryPart = tw.div`
  w-[20vw] h-auto flex flex-col gap-[15px] ml-[20px] pl-[10px] max-[801px]:w-[25vw]
  max-[801px]:pl-[0px] max-[801px]:ml-[0px] max-[681px]:hidden
`;

const ScheduleSummaryDayAndPlacePart = tw.div`
  flex w-[20vw] h-auto gap-[10px] items-start pl-[15px] max-[801px]:w-[25vw]
`;

const ScheduleSummaryDayPart = tw.div`
  w-[5vw] h-auto rounded-[2px] bg-[#729DC8] text-white [font-weight:550] gap-[10px]
  cursor-pointer max-[801px]:w-[7vw]
`;

const ScheduleSummaryPlacePart = tw.div`
  w-[15vw] h-auto flex flex-col gap-[8px] cursor-pointer
`;

const SummaryPlaceTitle = tw.div`
  font-medium text-[15px] text-left
`;

const DayTitle = tw.div`
  flex items-center justify-center w-[70px] h-[30px] bg-[#296D98] rounded-[3px]
  tracking-[2px] [font-weight:550] text-white
`;

const PlaceTitle = tw.div`
  flex items-center [justify-content:left] w-auto h-[30px] pl-[10px] mb-[10px] font-semibold
  text-[18px] tracking-[2px]
`;

const PlaceImg = tw.img`
  w-full h-auto relative [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)] object-cover
  max-[681px]:w-[80vw] max-[681px]:h-auto
`;

const ImgDisplayArea = tw.div`
  flex w-[50vw] h-auto gap-[10px] ml-[10px] relative flex-wrap max-[681px]:w-[80vw]
`;

function ShowArticle() {
  const [shownArticle, updateShownArticle] = useImmer<Article | undefined>(undefined);
  const [liked, setLiked] = useState(false);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { search } = useLocation();
  const currentArticleId = new URLSearchParams(search).get('art_id');

  useEffect(() => {
    if (!currentArticleId) return;
    const articleId = currentArticleId;
    async function getCertainArticle() {
      const docRef = doc(db, 'articles', articleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        updateShownArticle(docSnap.data() as Article);
      }
    }
    getCertainArticle();
  }, [currentArticleId, updateShownArticle]);

  useEffect(() => {
    if (!user.uid || !currentArticleId) { return; }
    const userId = user.uid;
    const articleId = currentArticleId;
    async function checkLikeOrNot() {
      const userArticlesArray = doc(db, 'users', userId);
      const docSnap = await getDoc(userArticlesArray);
      const profile = docSnap.data() as UserProfile | undefined;
      if (profile?.loved_article_ids?.includes(articleId)) {
        setLiked(true);
      }
    }
    checkLikeOrNot();
  }, [currentArticleId, user.uid]);

  async function handleFavorite() {
    if (!user.uid) {
      Swal.fire({
        title: '請先登入唷！',
        text: '您即將被導引至登入頁面~',
        icon: 'warning',
      });
      navigate({ pathname: '/profile' });
    } else {
      const userArticlesArray = doc(db, 'users', user.uid);
      if (liked) {
        setLiked(false);
        await updateDoc(userArticlesArray, {
          loved_article_ids: arrayRemove(currentArticleId),
        });
      } else if (!liked) {
        setLiked(true);
        await updateDoc(userArticlesArray, {
          loved_article_ids: arrayUnion(currentArticleId),
        });
      }
    }
  }

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage />
        <ArticlePageBelowPart>
          <ArticleTitleButtonArea>
            <ArticleTitle>
              {shownArticle?.article_title}
              <AddFavoriteIcon
                onClick={() => handleFavorite()}
                src={liked ? STAR?.FULL_STAR : STAR?.EMPTY_STAR}
              />
            </ArticleTitle>
          </ArticleTitleButtonArea>
          <ArticleEditPart>
            <EditingPart>
              <ArticleAuthorDate>
                {shownArticle?.author}
                {' '}
                |
                {' '}
                {shownArticle?.time ? (new Date(shownArticle?.time?.toDate()))?.toISOString().split('T')[0] : ''}
              </ArticleAuthorDate>
              <ArticleCoverPhotoWrapper src={shownArticle?.cover_img
                ? shownArticle?.cover_img : defaultCover}
              />
              <Description>{shownArticle?.summary}</Description>
              {shownArticle ? shownArticle?.trip_days?.map((dayItem, dayIndex) => (
                <Fragment key={`day-${dayIndex + 1}`}>
                  <DayTitle
                    key={`day-${dayIndex + 1}`}
                    id={`day-${dayIndex + 1}`}
                  >
                    第
                    {dayIndex + 1}
                    天
                  </DayTitle>
                  <div key={`day-${dayIndex + 5}`}>
                    {dayItem?.places?.map((placeItem, placeIndex) => (
                      <PlaceArea key={`place-${dayIndex + 1}-${placeItem?.place_title}`} id={`place-${dayIndex + 1}-${placeIndex + 1}`}>
                        <div style={{ display: 'flex' }}>
                          <PlaceTitle>
                            {placeItem?.place_title}
                          </PlaceTitle>
                        </div>
                        <ImgDisplayArea>
                          {shownArticle?.trip_days?.[dayIndex]
                            ?.places?.[placeIndex]?.place_imgs?.map((item) => (
                              <div key={`day${dayIndex + 1}place${placeIndex + 1}+${item}`} style={{ position: 'relative' }}>
                                <PlaceImg src={item} alt="place-img" />
                              </div>
                            ))}
                        </ImgDisplayArea>
                        <Description>
                          {placeItem?.place_description}
                        </Description>
                      </PlaceArea>
                    ))}
                  </div>
                </Fragment>
              )) : ''}
            </EditingPart>
            <ScheduleSummaryPart>
              {shownArticle ? shownArticle?.trip_days?.map((dayItem, dayIndex) => (
                <ScheduleSummaryDayAndPlacePart key={`${dayIndex + 10}place`}>
                  <HashLink style={{ textDecoration: 'none' }} smooth to={`/article?art_id=GJ3ZQAffaMY0NaLwMDgi&sch_id=iV3Cg33AFsZ6XghDIZRc#day-${dayIndex + 1}`}>
                    <ScheduleSummaryDayPart>
                      第
                      {dayIndex + 1}
                      天
                    </ScheduleSummaryDayPart>
                  </HashLink>
                  <div
                    style={{
                      height: '20px', width: '2px', backgroundColor: 'black', marginTop: '2px',
                    }}
                  />
                  <ScheduleSummaryPlacePart>
                    {dayItem?.places ? dayItem?.places.map((placeItem, placeIndex) => (
                      <HashLink
                        key={`${placeItem?.place_title}`}
                        style={{ textDecoration: 'none', color: 'black' }}
                        smooth
                        to={`/article?art_id=GJ3ZQAffaMY0NaLwMDgi&sch_id=iV3Cg33AFsZ6XghDIZRc#place-${dayIndex + 1}-${placeIndex + 1}`}
                      >
                        <SummaryPlaceTitle>
                          {placeItem.place_title ? placeItem.place_title : '沒有景點唷'}
                        </SummaryPlaceTitle>
                      </HashLink>
                    )) : ''}
                  </ScheduleSummaryPlacePart>
                </ScheduleSummaryDayAndPlacePart>
              )) : ''}
            </ScheduleSummaryPart>
          </ArticleEditPart>
        </ArticlePageBelowPart>
      </PageWrapper>
    </>
  );
}

export default ShowArticle;
