/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import
{
  doc, getDoc, updateDoc, arrayRemove, arrayUnion,
} from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';
import { useImmer } from 'use-immer';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import { HashLink } from 'react-router-hash-link';
import HeaderComponent from '../components/Header';
import ShareBanner2 from './images/share_banner2.jpeg';
import db from '../utils/firebase-init';
import defaultCover from './images/schedule_cover_rec3.jpg';
import unfilledStar from './images/unfilled_star.jpg';
import filledStar from './images/filled_star.jpg';
import UserContext from '../components/UserContextComponent';

const PageWrapper = styled.div`
width:100vw;
height:100vh;
`;

const ArticleCoverImage = styled.div`
width:100vw;
height:500px;
align-items:center;
justify-content:center;
background-image: url(${ShareBanner2});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
position:relative;
background-position:center;
object-fit: cover;
@media screen and (max-width:800px){
  height:300px;
}
`;

const ArticlePageBelowPart = styled.div`
width:100vw;
height:500px;
flex-direction:column;
align-items:center;
display:flex;
`;

const ArticleAuthorDate = styled.div`
color:grey;
font-weight:600;
`;

const ArticleEditPart = styled.div`
width:75vw;
height:auto;
display:flex;
justify-content:space-between;
@media screen and (max-width:800px){
  width:85vw;
}
`;

const AddFavoriteIcon = styled.img`
width:30px;
height:30px;
cursor:pointer;
`;

// const RemoveFavoriteIcon = styled.img`
// width:30px;
// height:30px;
// cursor:pointer;
// `;

const ArticleCoverPhotoWrapper = styled.img`
width:50vw;
height:380px;
margin-left:5px;
margin-top:2px;
border-radius:3px;
outline:none;
border:1px solid black;
border:none;
background-size:cover;
background-repeat: no-repeat;
background-blend-mode: multiply;
background-position:center;
flex-shrink: 0;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
object-fit: cover;
@media screen and (max-width:680px){
  width:100%;
  height:auto;
}
`;

const Description = styled.div`
text-align:left;
padding-left:10px;
padding-top:10px;
width:calc(50vw - 3px);
margin-left:3px;
margin-bottom:10px;
height:auto;
font-size:16px;
margin-top:20px;
outline:none;
flex-shrink: 0;
border-radius:5px;
border: none;
@media screen and (max-width:680px){
  width:100%;
}
`;

const ArticleTitleButtonArea = styled.div`
width:75vw;
height:auto;
display:flex;
@media screen and (max-width:800px){
  width:85vw;
}
`;

const ArticleTitle = styled.div`
width:50vw;
height:auto;
font-size:35px;
font-weight:600;
text-align:left;
margin-top:20px;
margin-bottom:20px;
outline:none;
border:none;
display:flex;
align-items:center;
justify-content:space-between;
@media screen and (max-width:800px){
  width:55vw;
}
@media screen and (max-width:680px){
  width:100%;
}
`;

const EditingPart = styled.div`
width:51vw;
height:600px;
display:flex;
flex-direction:column;
align-items:flex-start;
gap:5px;
overflow-y:auto;
overflow-x:hidden;
&::-webkit-scrollbar-track {
  -webkit-box-shadow: transparent;
  border-radius: 10px;
  background-color:transparent;
}
&::-webkit-scrollbar {
  width: 6px;
  background-color:transparent;
}
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: transparent;
  background-color:#D3D3D3;
}
@media screen and (max-width:800px){
  width:56vw;
}
@media screen and (max-width:680px){
  width:100%;
}
`;

const PlaceArea = styled.div`
width:100%;
display:flex;
flex-direction:column;
align-items:flex-start;
`;

const ScheduleSummaryPart = styled.div`
width:20vw;
height:auto;
display:flex;
flex-direction:column;
gap:15px;
margin-left:20px;
padding-left:10px;
@media screen and (max-width:800px){
  width:25vw;
  padding-left:0px;
  margin-left:0px;
}
@media screen and (max-width:680px){
  display:none;
}
`;

const ScheduleSummaryDayAndPlacePart = styled.div`
display:flex;
width:20vw;
height:auto;
gap:10px;
align-items:flex-start;
paddin-left:15px;
@media screen and (max-width:800px){
  width:25vw;
}
`;

const ScheduleSummaryDayPart = styled.div`
width:5vw;
height:auto;
border-radius:2px;
background-color:#729DC8;
color:white;
font-weight:550;
gap:10px;
cursor:pointer;
@media screen and (max-width:800px){
  width:7vw;
}
`;

const ScheduleSummaryPlacePart = styled.div`
width:15vw;
height:auto;
display:flex;
flex-direction:column;
gap:8px;
cursor:pointer;
`;

const SummaryPlaceTitle = styled.div`
font-weight:500;
font-size:15px;
text-align:left;
`;

const DayTitle = styled.div`
display:flex;
align-items:center;
justify-content:center;
width:70px;
height:30px;
background-color:#296D98;
border-radius:3px;
letter-spacing:2px;
font-weight:550;
color:white;
`;

const PlaceTitle = styled.div`
display:flex;
align-items:center;
justify-content:left;
width:auto;
height:30px;
padding-left:10px;
margin-bottom:10px;
font-weight:600;
font-size:18px;
letter-spacing:2px;
`;

const PlaceImg = styled.img`
width:100%;
height:auto;
position:relative;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
object-fit: cover;
@media screen and (max-width:680px){
  width:80vw;
  height:auto;
}
`;

const ImgDisplayArea = styled.div`
display:flex;
width:50vw;
height:auto;
gap:10px;
margin-left:10px;
position:relative;
flex-wrap:wrap;
@media screen and (max-width:680px){
  width:80vw;
}
`;

function ShowArticle() {
  const [shownArticle, updateShownArticle] = useImmer();
  const [liked, setLiked] = useState(false);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  // 拿指定一個article_id的article資料
  const { search } = useLocation();
  const currentArticleId = new URLSearchParams(search).get('art_id');

  useEffect(() => {
    if (!currentArticleId) return;
    async function getCertainArticle() {
      const docRef = doc(db, 'articles', currentArticleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('找到您的文章囉!', docSnap.data());
        updateShownArticle(docSnap.data());
      } else {
        console.log('沒找到文章捏>__<');
      }
    }
    getCertainArticle();
  }, [currentArticleId, updateShownArticle]);

  // 確認一下是否這個使用者有按過收藏，有的話星星是亮的

  useEffect(() => {
    async function checkLikeOrNot() {
      const userArticlesArray = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userArticlesArray);
      console.log(docSnap.data());
      if (docSnap.data().loved_article_ids.indexOf(currentArticleId) > -1) {
        setLiked(true);
      }
    }
    checkLikeOrNot();
  }, [currentArticleId, user.uid]);

  async function handleFavorite() {
    if (!user.uid) {
      alert('請先登入唷～');
      navigate({ pathname: '/profile' });
    } else {
      const userArticlesArray = doc(db, 'users', user.uid);
      if (liked) {
        setLiked(false);
        await updateDoc(userArticlesArray, {
          loved_article_ids: arrayRemove(currentArticleId),
        });
        console.log('已退追!');
      } else if (!liked) {
        setLiked(true);
        await updateDoc(userArticlesArray, {
          loved_article_ids: arrayUnion(currentArticleId),
        });
        console.log('已追!');
      }
    }
  }

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage type="file" />
        <ArticlePageBelowPart>
          <ArticleTitleButtonArea>
            <ArticleTitle>
              {shownArticle?.article_title}
              <AddFavoriteIcon
                onClick={() => handleFavorite()}
                src={liked ? filledStar : unfilledStar}
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
                <>
                  <DayTitle id={`day-${dayIndex + 1}`}>
                    第
                    {dayIndex + 1}
                    天
                  </DayTitle>
                  <div>
                    {dayItem?.places.map((placeItem, placeIndex) => (
                      <PlaceArea id={`place-${dayIndex + 1}-${placeIndex + 1}`}>
                        <div style={{ display: 'flex' }}>
                          <PlaceTitle>
                            {placeItem.place_title}
                          </PlaceTitle>
                        </div>
                        <ImgDisplayArea>
                          {shownArticle?.trip_days?.[dayIndex]
                            ?.places?.[placeIndex]?.place_imgs?.map((item) => (
                              <div style={{ position: 'relative' }}>
                                <PlaceImg src={item} alt="place-img" />
                              </div>
                            ))}
                        </ImgDisplayArea>
                        <Description>{placeItem?.place_description}</Description>
                      </PlaceArea>
                    ))}
                  </div>
                </>
              )) : ''}
            </EditingPart>
            <ScheduleSummaryPart>
              {shownArticle ? shownArticle?.trip_days?.map((dayItem, dayIndex) => (
                <ScheduleSummaryDayAndPlacePart>
                  <HashLink style={{ textDecoration: 'none' }} smooth to={`/article?art_id=GJ3ZQAffaMY0NaLwMDgi&sch_id=iV3Cg33AFsZ6XghDIZRc#day-${dayIndex + 1}`}>
                    <ScheduleSummaryDayPart>
                      第
                      {dayIndex + 1}
                      天
                    </ScheduleSummaryDayPart>
                  </HashLink>
                  <div style={{
                    height: '20px', width: '2px', backgroundColor: 'black', marginTop: '2px',
                  }}
                  />
                  <ScheduleSummaryPlacePart>
                    {dayItem?.places ? dayItem?.places.map((placeItem, placeIndex) => (
                      <HashLink style={{ textDecoration: 'none', color: 'black' }} smooth to={`/article?art_id=GJ3ZQAffaMY0NaLwMDgi&sch_id=iV3Cg33AFsZ6XghDIZRc#place-${dayIndex + 1}-${placeIndex + 1}`}>
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

// <div>
// <Search panTo={panTo} active={active} setSelected={setSelected} selected={selected} />
// <GoogleMap
//   id="map"
//   // style={{ opacity: mapDisplay ? '1' : '0' }}
//   mapContainerStyle={window.innerWidth > 800 ? mapContainerStyle : smallScreenMapContainerStyle}
//   zoom={10}
//   center={center}
//   options={options}
//   onLoad={onMapLoad}
// />
// </div>

// const smallScreenMapContainerStyle = {
//   height: '100vh',
//   position: 'fixed',
//   top: 0,
//   bottom: 0,
//   width: '100vw',
//   display: mapDisplay ? 'block' : 'none',
// };

// let service;

// const mapContainerStyle = {
//   height: 'calc( 100vh - 60px)',
//   width: '55vw',
//   position: 'absolute',
// };

// const smallScreenMapContainerStyle = {
//   height: '100vh',
//   position: 'fixed',
//   top: 0,
//   bottom: 0,
//   width: '100vw',
//   display: mapDisplay ? 'block' : 'none',
// };

// const options = {
//   disableDefaultUI: true,
//   zoomControl: true,
// };
// const center = {
//   lat: 25.105497,
//   lng: 121.597366,
// };
