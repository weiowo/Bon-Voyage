/* eslint-disable react/jsx-props-no-spreading */
import
{
  doc, getDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  ref, uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import db, { storage } from '../utils/firebase-init';
import HeaderComponent from '../components/Header';
// import ShareBanner1 from './images/share_banner1.png';
import ShareBanner2 from './images/share_banner2.png';

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

const ArticleCoverPhoto = styled.div`
width:50vw;
height:300px;
border-radius:3px;
border:solid 1px red;
background-color:yellow;
background-image: url(${ShareBanner2});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
background-position:center;
flex-shrink: 0;
`;

const Description = styled.textarea`
width:50vw;
height:100px;
font-size:14px;
margin-top:20px;
outline:none;
flex-shrink: 0;
`;

const ArticleTitleButtonArea = styled.div`
width:75vw;
height:auto;
display:flex;
`;

const ArticleTitle = styled.input`
width:55vw;
height:auto;
font-size:35px;
font-weight:600;
text-align:left;
margin-top:20px;
margin-bottom:20px;
`;

const EditingPart = styled.div`
width:55vw;
height:600px;
border:1px solid blue;
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
border:1px solid red;
display:flex;
flex-direction:column;
gap:10px;
`;

const ScheduleSummaryDayAndPlacePart = styled.div`
display:flex;
width:20vw;
height:auto;
gap:5px;
align-items:flex-start;
`;

const ScheduleSummaryDayPart = styled.div`
width:5vw;
height:auto;
border:1px solid orange;
gap:10px;
`;

const ScheduleSummaryPlacePart = styled.div`
width:15vw;
height:auto;
display:flex;
border:1px solid purple;
flex-direction:column;
gap:3px;
`;

const SummaryPlaceTitle = styled.div`
font-weight:500;
font-size:15px;
text-align:left;
margin-left:10px;
`;

const DayTitle = styled.div`
display:flex;
align-items:center;
justify-content:left;
width:80px;
height:30px;
background-color:orange;
padding-left:10px;
`;

const PlaceTitle = styled.div`
display:flex;
align-items:center;
justify-content:left;
width:150px;
height:30px;
background-color:beige;
padding-left:10px;
`;

const PlaceUploadImgArea = styled.input`
width:50vw;
height:100px;
`;

const ButtonArea = styled.div`
width:20vw;
height:auto;
display:flex;
align-items:center;
justify-content:center;
gap:20px;
`;

const SaveButton = styled.button`
width:80px;
height:40px;
background-color:#296D98;
color:white;
border-radius:5px;
border:none;
font-size:16px;
cursor:pointer;
font-weight:600;
`;

const PublishedButton = styled.button`
width:80px;
height:40px;
background-color:#296D98;
color:white;
border-radius:5px;
border:none;
cursor:pointer;
font-size:16px;
font-weight:600;
`;

function EditPage() {
  const [article, updateArticle] = useImmer();
  const [image, setImage] = useState(null); // 就是影片中的imgupload
  console.log(article);
  // const [imageList, setImageList] = useState([]);
  // console.log(article);
  // console.log(imageList);
  // const [imageUrl, setImageUrl] = useState('');
  // const [imgPath, setImgPath] = useState('');

  // 拿所有這個資料夾的image url

  // const imageListRef = ref(storage, 'images/');

  // function uploadImg() {
  //   if (image === null) return;
  //   const imgRef = ref(storage, `images/${image.name}`);
  //   uploadBytes(imgRef, image).then(() => {
  //     console.log('image uploaded!');
  //   });
  // }

  // 按下上傳圖片！
  async function uploadImg(dayIndex, placeIndex) {
    if (image === null) return;
    const imgRef = ref(storage, `images/${image.name}`);
    const snap = await uploadBytes(imgRef, image);
    const url = await getDownloadURL(ref(storage, `images/${image.name}`));
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_imgs.push(url);
    });
    console.log(snap);
    console.log(url);
  }

  // async function uploadImg() {
  //   if (image === null) return;
  //   const imgRef = ref(storage, `images/${image.name}`);
  //   const snap = await uploadBytes(imgRef, image);
  //   const url = await getDownloadURL(ref(storage.ref.fullpath));
  // }

  // 拿照片

  // useEffect(() => {
  //   listAll(imageListRef).then((response) => {
  //     response.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageList((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);

  // 拿指定一個article_id的單一筆schedule資料
  const { search } = useLocation();
  const currentArticleId = new URLSearchParams(search).get('art_id');

  useEffect(() => {
    if (!currentArticleId) return;
    async function getCertainArticle() {
      const docRef = doc(db, 'articles', currentArticleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('找到您的文章囉!', docSnap.data());
        updateArticle(docSnap.data());
      } else {
        console.log('沒找到文章捏>__<');
      }
    }
    getCertainArticle();
  }, [currentArticleId, updateArticle]);

  // 有新增要及時更新

  // useEffect(() => {
  //   if (currentArticleId) {
  //     const theArticleBeingEdited = doc(db, 'articles', currentArticleId);
  //     onSnapshot(theArticleBeingEdited, (querySnapshot) => {
  //       console.log(querySnapshot);
  //       updateArticle(querySnapshot.data());
  //     });
  //   }
  // }, [currentArticleId, updateArticle]);

  // 新增內容！

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

  // 上傳照片後放到firestore
  // 上傳首張封面照片

  // function updateArticleCoverPhoto(coverPhotoUrl) {
  //   updateArticle((draft) => {
  //     draft.cover_img = coverPhotoUrl;
  //   });
  // }

  // 上傳place的照片
  // function updatePlaceImg(dayIndex, placeIndex) {
  //   updateArticle((draft) => {
  //     draft.trip_days[dayIndex].places[placeIndex].place_imgs.push('照片src');
  //   });
  // }

  // 刪除place的照片功能

  function deletePlaceImg(dayIndex, placeIndex, photoIndex) {
    console.log('delete~');
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_imgs.filter(
        (deletePhotoItem, deletePhotoIndex) => deletePhotoIndex !== photoIndex,
      );
    });
  }

  // 儲存未發布功能

  async function SaveArticle() {
    if (!currentArticleId) { return; }
    if (currentArticleId) {
      const articleRef = doc(db, 'articles', currentArticleId);
      await updateDoc(articleRef, article);
    }
  }

  // 發佈功能

  async function PublishArticle() {
    if (!currentArticleId) { return; }
    if (currentArticleId) {
      const articleRef = doc(db, 'articles', currentArticleId);
      await updateDoc(articleRef, {
        status: 'published',
      });
    }
  }

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage type="file" />
        <ArticlePageBelowPart>
          <ArticleTitleButtonArea>
            <ArticleTitle
              value={article ? article?.article_title : ''}
              onChange={(e) => { updateArticleTitle(e.target.value); }}
            />
            <ButtonArea>
              <SaveButton onClick={() => SaveArticle()}>儲存</SaveButton>
              <PublishedButton onClick={() => PublishArticle()}>發布</PublishedButton>
            </ButtonArea>
          </ArticleTitleButtonArea>
          <ArticleEditPart>
            <EditingPart>
              <ArticleCoverPhoto />
              <Description
                cols="40"
                rows="5"
                onChange={(e) => { updateArticleSummary(e.target.value); }}
              />
              {article ? article?.trip_days?.map((dayItem, dayIndex) => (
                <>
                  <DayTitle>
                    第
                    {dayIndex + 1}
                    天
                  </DayTitle>
                  <div>
                    {dayItem?.places.map((placeItem, placeIndex) => (
                      <PlaceArea>
                        <PlaceTitle>
                          第
                          {placeIndex + 1}
                          個景點:
                          {placeItem.place_title}
                        </PlaceTitle>
                        <PlaceUploadImgArea
                          type="file"
                          onChange={(e) => {
                            setImage(e.target.files[0]);
                          }}
                        />
                        <button type="button" onClick={() => uploadImg(dayIndex, placeIndex)}>確認上傳</button>
                        {/* 照片區 */}
                        {article?.trip_days?.[dayIndex]
                          ?.places?.[placeIndex]?.place_imgs?.map((item, photoIndex) => (
                            <div style={{
                              display: 'flex', width: 100, height: 100, position: 'relative',
                            }}
                            >
                              <img style={{ width: 100, height: 100, position: 'relative' }} src={item} alt="place-img" />
                              <button
                                type="button"
                                onClick={() => deletePlaceImg(dayIndex, placeIndex, photoIndex)}
                                style={{
                                  position: 'absolute', top: '10px', right: '10px', zIndex: '10',
                                }}
                              >
                                X
                              </button>
                            </div>
                          ))}
                        {/* {article?.trip_days?.[dayIndex]?.places?.[placeIndex]?.place_imgs[0]
                          ? <img alt="test" src={article?.trip_days?.[dayIndex]?.places?
                            .[placeIndex]?.place_imgs[0]} />
                          : (
                            <PlaceUploadImgArea
                              type="file"
                              onChange={(e) => {
                                setImage(e.target.files[0]);
                              }}
                            />
                          )} */}
                        <Description
                          cols="40"
                          rows="5"
                          value={placeItem.place_description}
                          // eslint-disable-next-line max-len
                          onChange={(e) => { updatePlaceDescription(e.target.value, dayIndex, placeIndex); }}
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
                  <ScheduleSummaryDayPart>
                    第
                    {dayIndex + 1}
                    天
                  </ScheduleSummaryDayPart>
                  <div style={{
                    height: '20px', width: '1px', backgroundColor: 'black', marginTop: '2px',
                  }}
                  />
                  <ScheduleSummaryPlacePart>
                    {dayItem?.places ? dayItem?.places.map((placeItem, placeIndex) => (
                      <SummaryPlaceTitle>
                        {placeIndex + 1}
                        :
                        {placeItem.place_title ? placeItem.place_title : '沒有景點唷'}
                      </SummaryPlaceTitle>
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
