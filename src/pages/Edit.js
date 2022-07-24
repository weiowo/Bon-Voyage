import
{
  doc, getDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { HashLink } from 'react-router-hash-link';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  ref, uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import db, { storage } from '../utils/firebase-init';
import HeaderComponent from '../components/Headers/Header';
import ShareBanner2 from './images/share_banner2.jpeg';
import CoverDefaultPhoto from './images/cover_photo_default.png';

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
object-fit:cover;
@media screen and (max-width:900px){
  height:300px;
}`;

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
@media screen and (max-width:900px){
  width:85vw;
}`;

const ArticleCoverPhoto = styled.input`
display:none;
`;

const ArticleCoverPhotoWrapper = styled.label`
width:50vw;
height:350px;
margin-left:5px;
margin-top:2px;
border-radius:3px;
outline:none;
border:1px solid black;
border:none;
background-image: url(${CoverDefaultPhoto});
background-size:cover;
background-repeat: no-repeat;
background-blend-mode: multiply;
background-position:center;
flex-shrink: 0;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
cursor:pointer;
object-fit:cover;
@media screen and (max-width:900px){
  width:55vw;
}
@media screen and (max-width:900px){
  width:55vw;
}
@media screen and (max-width:750px){
  width:80vw;
}`;

const Description = styled.textarea`
padding-left:10px;
padding-top:10px;
width:calc(50vw - 3px);
margin-left:3px;
margin-bottom:10px;
height:100px;
font-size:16px;
margin-top:20px;
outline:none;
flex-shrink: 0;
border-radius:5px;
border: none;
background-color: transparent;
resize: none;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
@media screen and (max-width:900px){
  width:calc(55vw - 3px);
  margin-top:10px;
}
@media screen and (max-width:750px){
  width:80vw;
}`;

const ArticleTitleButtonArea = styled.div`
width:75vw;
height:auto;
display:flex;
@media screen and (max-width:900px){
  width:85vw;
  justify-content:space-between;
  gap:0px;
}`;

const ArticleTitle = styled.input`
width:55vw;
height:auto;
font-size:35px;
font-weight:600;
text-align:left;
margin-top:20px;
margin-bottom:20px;
outline:none;
border:none;
@media screen and (max-width:900px){
  width:60vw;
}
@media screen and (max-width:750px){
  width:50vw;
  font-size:27px;
}`;

const EditingPart = styled.div`
width:55vw;
height:600px;
display:flex;
flex-direction:column;
align-items:flex-start;
gap:5px;
overflow:auto;
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
@media screen and (max-width:900px){
  width:60vw;
}
@media screen and (max-width:750px){
  width:85vw
}`;

const PlaceArea = styled.div`
width:calc(50vw - 3px);
display:flex;
flex-direction:column;
align-items:flex-start;
@media screen and (max-width:900px){
  width:calc(55vw - 3px);
}
@media screen and (max-width:750px){
  width:80vw;
}`;

const ScheduleSummaryPart = styled.div`
width:20vw;
height:auto;
display:flex;
flex-direction:column;
gap:15px;
margin-left:20px;
padding-left:10px;
@media screen and (max-width:900px){
  width:25vw;
}
@media screen and (max-width:750px){
display:none;
}`;

const ScheduleSummaryDayAndPlacePart = styled.div`
display:flex;
width:20vw;
height:auto;
gap:10px;
align-items:flex-start;
paddin-left:15px;
@media screen and (max-width:900px){
  width:25vw;
}`;

const ScheduleSummaryDayPart = styled.div`
width:5vw;
height:auto;
border-radius:2px;
background-color:#729DC8;
color:white;
font-weight:550;
gap:10px;
@media screen and (max-width:900px){
  width:7vw;
}`;

const ScheduleSummaryPlacePart = styled.div`
width:15vw;
height:auto;
display:flex;
flex-direction:column;
gap:8px;
@media screen and (max-width:900px){
  width:18vw;
}`;

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
margin-bottom:0px;
margin-right:20px;
font-weight:600;
font-size:18px;
letter-spacing:2px;
@media screen and (max-width:900px){
  height:40px;
}`;

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
`;

const DeletePlaceImgButton = styled.button`
position:absolute;
top:5px;
right:5px;
z-index:10;
border-radius:50%;
cursor:pointer;
background-color:red;
border:1px solid red;
color:white;
font-weight:550;
height:20px;
width:20px;
border:none;
`;

const ButtonArea = styled.div`
width:20vw;
height:auto;
display:flex;
align-items:center;
justify-content:left;
gap:20px;
margin-left:15px;
@media screen and (max-width:750px){
  width:20vw;
  gap:10px;
  margin-left:0px;
}
@media screen and (max-width:450px){
  width:30vw;
}`;

const SaveButton = styled.button`
width:70px;
height:40px;
background-color:#296D98;
color:white;
border-radius:5px;
border:none;
font-size:16px;
cursor:pointer;
font-weight:600;
flex-shrink:0;
@media screen and (max-width:750px){
  width:50px;
  font-size:13px;
}
@media screen and (max-width:450px){
  width:50px;
  font-size:13px;
}`;

const PublishedButton = styled.button`
width:70px;
height:40px;
background-color:#296D98;
color:white;
border-radius:5px;
border:none;
cursor:pointer;
font-size:16px;
font-weight:600;
flex-shrink:0;
@media screen and (max-width:750px){
  width:50px;
  font-size:13px;
}
@media screen and (max-width:450px){
  width:50px;
  font-size:13px;
}`;

function EditPage() {
  const [article, updateArticle] = useImmer();
  const navigate = useNavigate();

  // 上傳cover圖片！
  async function uploadCoverImg(imageData) {
    if (imageData === null) return;
    const imgRef = ref(storage, `images/${imageData.name}`);
    await uploadBytes(imgRef, imageData);
    const url = await getDownloadURL(ref(storage, `images/${imageData.name}`));
    updateArticle((draft) => {
      draft.cover_img = url;
    });
  }

  // 按下上傳圖片！
  async function uploadImg(dayIndex, placeIndex, placeImgaeData) {
    if (placeImgaeData === null) return;
    const imgRef = ref(storage, `images/${placeImgaeData.name}`);
    await uploadBytes(imgRef, placeImgaeData);
    const url = await getDownloadURL(ref(storage, `images/${placeImgaeData.name}`));
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_imgs.push(url);
    });
  }

  const { search } = useLocation();
  const currentArticleId = new URLSearchParams(search).get('art_id');
  const currentScheduleId = new URLSearchParams(search).get('sch_id');

  useEffect(() => {
    if (!currentArticleId) return;
    async function getCertainArticle() {
      const docRef = doc(db, 'articles', currentArticleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        updateArticle(docSnap.data());
      }
    }
    getCertainArticle();
  }, [currentArticleId, updateArticle]);

  function updateArticleTitle(articleTitle) {
    updateArticle((draft) => {
      draft.article_title = articleTitle;
    });
  }

  function updateArticleSummary(articleSummary) {
    updateArticle((draft) => {
      draft.summary = articleSummary;
    });
  }

  function updatePlaceDescription(placeDescription, dayIndex, placeIndex) {
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_description = placeDescription;
    });
  }

  function deletePlaceImg(dayIndex, placeIndex, photoIndex) {
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_imgs = draft.trip_days[dayIndex]
        .places[placeIndex].place_imgs.filter(
          (deletePhotoItem, deletePhotoIndex) => deletePhotoIndex !== photoIndex,
        );
    });
  }

  async function SaveArticle() {
    if (!currentArticleId) { return; }
    if (currentArticleId) {
      const articleRef = doc(db, 'articles', currentArticleId);
      await updateDoc(articleRef, article);
    }
  }

  async function PublishArticle() {
    if (!currentArticleId) { return; }
    if (currentArticleId) {
      const articleRef = doc(db, 'articles', currentArticleId);
      await updateDoc(articleRef, { ...article, status: 'published' });
      navigate({ pathname: '/article', search: `?art_id=${currentArticleId}&sch_id=${currentScheduleId}` });
    }
  }

  // day-${dayIndex + 1}

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage type="file" />
        <ArticlePageBelowPart>
          <ArticleTitleButtonArea>
            <ArticleTitle
              required
              value={article ? article?.article_title : ''}
              onChange={(e) => { updateArticleTitle(e.target.value); }}
            />
            <ButtonArea>
              <a href="/my-articles">
                <SaveButton onClick={() => SaveArticle()}>儲存</SaveButton>
              </a>
              <PublishedButton onClick={() => PublishArticle()}>發布</PublishedButton>
            </ButtonArea>
          </ArticleTitleButtonArea>
          <ArticleEditPart>
            <EditingPart>
              <ArticleCoverPhotoWrapper
                htmlFor="photo"
              >
                <ArticleCoverPhoto
                  type="file"
                  id="photo"
                  onChange={(e) => {
                    uploadCoverImg(e.target.files[0]);
                  }}
                />
                {article?.cover_img ? (
                  <img
                    alt="cover"
                    src={article?.cover_img}
                    style={{ width: '50vw', height: '350px' }}
                  />
                )
                  : ''}
              </ArticleCoverPhotoWrapper>
              <Description
                placeholder="寫點關於這次行程的整體描述吧～"
                cols="40"
                rows="5"
                onChange={(e) => { updateArticleSummary(e.target.value); }}
              />
              {article ? article?.trip_days?.map((dayItem, dayIndex) => (
                <>
                  <DayTitle id={`day-${dayIndex + 1}`}>
                    第
                    {dayIndex + 1}
                    天
                  </DayTitle>
                  <div>
                    {dayItem?.places.map((placeItem, placeIndex) => (
                      <PlaceArea id={`place-${dayIndex + 1}-${placeIndex + 1}`}>
                        <div style={{ display: 'flex', textAlign: 'left', alignItems: 'center' }}>
                          <PlaceTitle>
                            {placeItem.place_title}
                          </PlaceTitle>
                          <label
                            htmlFor={`photo-${dayIndex}-${placeIndex}`}
                            style={{
                              width: '80px',
                              height: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#729DC8',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              marginRight: '10px',
                              fontSize: 14,
                              color: 'white',
                              fontWeight: 600,
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          >
                            <input
                              type="file"
                              id={`photo-${dayIndex}-${placeIndex}`}
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                uploadImg(dayIndex, placeIndex, e.target.files[0]);
                              }}
                            />
                            上傳照片
                          </label>
                        </div>
                        <ImgDisplayArea>
                          {article?.trip_days?.[dayIndex]
                            ?.places?.[placeIndex]?.place_imgs?.map((item, photoIndex) => (
                              <div style={{ position: 'relative' }}>
                                <PlaceImg src={item} alt="place-img" />
                                <DeletePlaceImgButton
                                  type="button"
                                  onClick={() => deletePlaceImg(dayIndex, placeIndex, photoIndex)}
                                >
                                  X
                                </DeletePlaceImgButton>
                              </div>
                            ))}
                        </ImgDisplayArea>
                        <Description
                          placeholder="寫點關於景點的描述吧～"
                          cols="40"
                          rows="5"
                          value={placeItem.place_description}
                          onChange={(e) => {
                            updatePlaceDescription(e.target.value, dayIndex, placeIndex);
                          }}
                        />
                      </PlaceArea>
                    ))}
                  </div>
                </>
              )) : ''}
            </EditingPart>
            <ScheduleSummaryPart>
              {article ? article?.trip_days?.map((dayItem, dayIndex) => (
                <ScheduleSummaryDayAndPlacePart>
                  <HashLink style={{ textDecoration: 'none' }} smooth to={`/edit#day-${dayIndex + 1}`}>
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
                      <HashLink style={{ textDecoration: 'none', color: 'black' }} smooth to={`/edit#place-${dayIndex + 1}-${placeIndex + 1}`}>
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

export default EditPage;
