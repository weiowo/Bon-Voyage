/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import
{
  doc, getDoc,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { HashLink } from 'react-router-hash-link';
import HeaderComponent from '../components/Header';
import ShareBanner2 from './images/share_banner2.png';
import db from '../utils/firebase-init';

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
`;

const ArticlePageBelowPart = styled.div`
width:100vw;
height:500px;
flex-direction:column;
align-items:center;
display:flex;
`;

const ArticleEditPart = styled.div`
width:75vw;
height:auto;
display:flex;
justify-content:center;
`;

const ArticleCoverPhotoWrapper = styled.img`
width:50vw;
height:350px;
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
cursor:pointer;
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
`;

const ArticleTitleButtonArea = styled.div`
width:75vw;
height:auto;
display:flex;
`;

const ArticleTitle = styled.div`
width:55vw;
height:auto;
font-size:35px;
font-weight:600;
text-align:left;
margin-top:20px;
margin-bottom:20px;
outline:none;
border:none;
`;

const EditingPart = styled.div`
width:55vw;
height:600px;
display:flex;
flex-direction:column;
align-items:flex-start;
overflow:scroll;
gap:5px;
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
`;

const ScheduleSummaryDayAndPlacePart = styled.div`
display:flex;
width:20vw;
height:auto;
gap:10px;
align-items:flex-start;
paddin-left:15px;
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
width:150px;
height:30px;
padding-left:10px;
margin-bottom:10px;
font-weight:600;
font-size:18px;
letter-spacing:2px;
`;

const PlaceImg = styled.img`
width:100px;
height:100px;
position:relative;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;

const ImgDisplayArea = styled.div`
display:flex;
width:55vw;
height:auto;
gap:10px;
margin-left:10px;
position:relative;
flex-wrap:wrap;
`;

function ShowArticle() {
  const [shownArticle, updateShownArticle] = useImmer();

  // const scrollToRef = (ref) => ref.current.scrollIntoView({ behavior: 'smooth' });

  // const [image, setImage] = useState(null); // 就是影片中的imgupload
  console.log(shownArticle);

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

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage type="file" />
        <ArticlePageBelowPart>
          <ArticleTitleButtonArea>
            <ArticleTitle>{shownArticle?.article_title}</ArticleTitle>
          </ArticleTitleButtonArea>
          <ArticleEditPart>
            <EditingPart>
              <ArticleCoverPhotoWrapper src={shownArticle?.cover_img} />
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
                        <ImgDisplayArea style={{
                          display: 'flex', width: '55vw', height: 'auto',
                        }}
                        >
                          {shownArticle?.trip_days?.[dayIndex]
                            ?.places?.[placeIndex]?.place_imgs?.map((item) => (
                              <div style={{ position: 'relative' }}>
                                <PlaceImg style={{ width: '50vw', height: 'auto', position: 'relative' }} src={item} alt="place-img" />
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
                  <HashLink style={{ textDecoration: 'none' }} smooth to={`/article#day-${dayIndex + 1}`}>
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
                      <HashLink style={{ textDecoration: 'none', color: 'black' }} smooth to={`/article#place-${dayIndex + 1}-${placeIndex + 1}`}>
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

  <HashLink smooth to="/article#section-three">
    Section Three
  </HashLink>;

export default ShowArticle;