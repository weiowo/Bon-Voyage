/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import
{
  doc, getDoc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  ref, uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import db, { storage } from '../utils/firebase-init';
import HeaderComponent from '../components/Header';
// import ShareBanner1 from './images/share_banner1.png';
import ShareBanner2 from './images/share_banner2.png';
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

const ArticleCoverPhoto = styled.input`
display:none;
// width:50vw;
// height:300px;
// border-radius:3px;
// outline:none;
// border:none;
// background-color:grey;
// background-image: url(${ShareBanner2});
// background-size:cover;
// background-repeat: no-repeat;
// background-color: rgb(0, 0, 0, 0.2);
// background-blend-mode: multiply;
// background-position:center;
// flex-shrink: 0;
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

`;

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
`;

const ScheduleSummaryPlacePart = styled.div`
width:15vw;
height:auto;
display:flex;
flex-direction:column;
gap:8px;
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

// const PlaceUploadImgArea = styled.input`
// width:180px;
// height:30px;
// `;

const PlaceImg = styled.img`
width:100px;
height:100px;
position:relative;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;

// const ConfirmedUploadButton = styled.div`
// display:flex;
// align-items:center;
// justify-content:center;
// width:80px;
// height:30px;
// background-color:#729DC8;
// border-radius:3px;
// color:white;
// font-size:14px;
// font-weight:500;
// cursor:pointer;
// `;

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
`;

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
`;

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
`;

function EditPage() {
  const [article, updateArticle] = useImmer();
  const navigate = useNavigate();

  // const [image, setImage] = useState(null); // 就是影片中的imgupload
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
  async function uploadImg(dayIndex, placeIndex, placeImgaeData) {
    console.log('uploadImguploadImg');
    if (placeImgaeData === null) return;
    const imgRef = ref(storage, `images/${placeImgaeData.name}`);
    const snap = await uploadBytes(imgRef, placeImgaeData);
    const url = await getDownloadURL(ref(storage, `images/${placeImgaeData.name}`));
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_imgs.push(url);
    });
    console.log(snap);
    console.log(url);
  }

  // 按下上傳cover圖片！ //變成要下一次才能更新QWQ
  async function uploadCoverImg(imageData) {
    if (imageData === null) return;
    const imgRef = ref(storage, `images/${imageData.name}`);
    const snap = await uploadBytes(imgRef, imageData);
    const url = await getDownloadURL(ref(storage, `images/${imageData.name}`));
    updateArticle((draft) => {
      draft.cover_img = url;
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
  const currentScheduleId = new URLSearchParams(search).get('sch_id');

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
      draft.trip_days[dayIndex].places[placeIndex].place_imgs = draft.trip_days[dayIndex]
        .places[placeIndex].place_imgs.filter(
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
      await updateDoc(articleRef, { ...article, status: 'published' });
      navigate({ pathname: '/article', search: `?art_id=${currentArticleId}&sch_id=${currentScheduleId}` });
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
              <ArticleCoverPhotoWrapper
                htmlFor="photo"
              >
                <ArticleCoverPhoto
                  type="file"
                  id="photo"
                  onChange={(e) => {
                    // setImage(e.target.files[0]);
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
                {/* <button type="button" onClick={() => updateArticleCoverPhoto()}>上傳</button> */}

              </ArticleCoverPhotoWrapper>
              <Description
                placeholder="寫點關於這次行程的整體描述吧～"
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
                        <div style={{ display: 'flex' }}>
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
                            }}
                          >
                            <input
                              type="file"
                              id={`photo-${dayIndex}-${placeIndex}`}
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                console.log('onChangeonChangeonChange');
                                uploadImg(dayIndex, placeIndex, e.target.files[0]);
                              }}
                              // onChange={(e) => {
                              //   setImage(e.target.files[0]);
                              // }}
                            />
                            上傳照片
                          </label>
                          {/* <ConfirmedUploadButton
                          type="button" onChange={(e) =>
                          uploadImg(dayIndex, placeIndex,
                           e.target.files[0])}>確認上傳</ConfirmedUploadButton> */}
                        </div>
                        <ImgDisplayArea style={{
                          display: 'flex', width: '55vw', height: 'auto',
                        }}
                        >
                          {article?.trip_days?.[dayIndex]
                            ?.places?.[placeIndex]?.place_imgs?.map((item, photoIndex) => (
                              <div style={{ position: 'relative' }}>
                                <PlaceImg style={{ width: 100, height: 100, position: 'relative' }} src={item} alt="place-img" />
                                <DeletePlaceImgButton
                                  placeholder="寫點關於景點的描述吧～"
                                  type="button"
                                  onClick={() => deletePlaceImg(dayIndex, placeIndex, photoIndex)}
                                >
                                  X
                                </DeletePlaceImgButton>
                              </div>
                            ))}
                        </ImgDisplayArea>
                        <Description
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
                  <ScheduleSummaryDayPart>
                    第
                    {dayIndex + 1}
                    天
                  </ScheduleSummaryDayPart>
                  <div style={{
                    height: '20px', width: '2px', backgroundColor: 'black', marginTop: '2px',
                  }}
                  />
                  <ScheduleSummaryPlacePart>
                    {dayItem?.places ? dayItem?.places.map((placeItem) => (
                      <SummaryPlaceTitle>
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
