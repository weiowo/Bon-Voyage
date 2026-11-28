import
{
  doc, getDoc,
  updateDoc,
} from 'firebase/firestore';
import { HashLink, useLocation, useNavigate } from '@/lib/router';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import type { Draft } from 'immer';
import {
  ref, uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import tw from '@/lib/tw';
import db, { storage } from '../utils/firebase-init';
import HeaderComponent from '../components/Headers/Header';
import type { Article } from '../types';

const PageWrapper = tw.div`
  w-[100vw] h-[100vh]
`;

const ArticleCoverImage = tw.div`
  w-[100vw] h-[500px] items-center justify-center bg-[url(/images/share_banner2.jpeg)]
  bg-cover bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] relative
  bg-center object-cover max-[901px]:h-[300px]
`;

const ArticlePageBelowPart = tw.div`
  w-[100vw] h-[500px] flex-col items-center flex
`;

const ArticleEditPart = tw.div`
  w-[75vw] h-auto flex justify-center max-[901px]:w-[85vw]
`;

const ArticleCoverPhoto = tw.input`
  hidden
`;

const ArticleCoverPhotoWrapper = tw.label`
  w-[50vw] h-[350px] ml-[5px] mt-[2px] rounded-[3px] [outline:none] [border:none]
  bg-[url(/images/cover_photo_default.png)] bg-cover bg-no-repeat
  [background-blend-mode:multiply] bg-center shrink-0
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)] cursor-pointer object-cover max-[901px]:w-[55vw]
  max-[751px]:w-[80vw]
`;

const Description = tw.textarea`
  pl-[10px] pt-[10px] w-[calc(50vw_-_3px)] ml-[3px] mb-[10px] h-[100px] text-[16px]
  mt-[20px] [outline:none] shrink-0 rounded-[5px] [border:none] bg-transparent [resize:none]
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)] max-[901px]:w-[calc(55vw_-_3px)]
  max-[901px]:mt-[10px] max-[751px]:w-[80vw]
`;

const ArticleTitleButtonArea = tw.div`
  w-[75vw] h-auto flex max-[901px]:w-[85vw] max-[901px]:justify-between
  max-[901px]:gap-[0px]
`;

const ArticleTitle = tw.input`
  w-[55vw] h-auto text-[35px] font-semibold text-left mt-[20px] mb-[20px] [outline:none]
  [border:none] max-[901px]:w-[60vw] max-[751px]:w-[50vw] max-[751px]:text-[27px]
`;

const EditingPart = tw.div`
  w-[55vw] h-[600px] flex flex-col items-start gap-[5px] overflow-auto
  [&::-webkit-scrollbar-track]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-[10px]
  [&::-webkit-scrollbar-thumb]:[-webkit-box-shadow:transparent]
  [&::-webkit-scrollbar-thumb]:bg-[#D3D3D3] max-[901px]:w-[60vw] max-[751px]:w-[85vw]
`;

const PlaceArea = tw.div`
  w-[calc(50vw_-_3px)] flex flex-col items-start max-[901px]:w-[calc(55vw_-_3px)]
  max-[751px]:w-[80vw]
`;

const ScheduleSummaryPart = tw.div`
  w-[20vw] h-auto flex flex-col gap-[15px] ml-[20px] pl-[10px] max-[901px]:w-[25vw]
  max-[751px]:hidden
`;

const ScheduleSummaryDayAndPlacePart = tw.div`
  flex w-[20vw] h-auto gap-[10px] items-start pl-[15px] max-[901px]:w-[25vw]
`;

const ScheduleSummaryDayPart = tw.div`
  w-[5vw] h-auto rounded-[2px] bg-[#729DC8] text-white [font-weight:550] gap-[10px]
  max-[901px]:w-[7vw]
`;

const ScheduleSummaryPlacePart = tw.div`
  w-[15vw] h-auto flex flex-col gap-[8px] max-[901px]:w-[18vw]
`;

const SummaryPlaceTitle = tw.div`
  font-medium text-[15px] text-left
`;

const DayTitle = tw.div`
  flex items-center justify-center w-[70px] h-[30px] bg-[#296D98] rounded-[3px]
  tracking-[2px] [font-weight:550] text-white
`;

const PlaceTitle = tw.div`
  flex items-center [justify-content:left] w-auto h-[30px] pl-[10px] mb-[0px] mr-[20px]
  font-semibold text-[18px] tracking-[2px] max-[901px]:h-[40px]
`;

const PlaceImg = tw.img`
  w-[100px] h-[100px] relative [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2)]
`;

const ImgDisplayArea = tw.div`
  flex w-[55vw] h-auto gap-[10px] ml-[10px] relative
`;

const DeletePlaceImgButton = tw.button`
  absolute top-[5px] right-[5px] z-[10] rounded-[50%] cursor-pointer [background-color:red]
  text-white [font-weight:550] h-[20px] w-[20px] [border:none]
`;

const ButtonArea = tw.div`
  w-[20vw] h-auto flex items-center [justify-content:left] gap-[20px] ml-[15px]
  max-[751px]:w-[20vw] max-[751px]:gap-[10px] max-[751px]:ml-[0px] max-[451px]:w-[30vw]
`;

const SaveButton = tw.button`
  w-[70px] h-[40px] bg-[#296D98] text-white rounded-[5px] [border:none] text-[16px]
  cursor-pointer font-semibold shrink-0 max-[751px]:w-[50px] max-[751px]:text-[13px]
  max-[451px]:w-[50px] max-[451px]:text-[13px]
`;

const PublishedButton = tw.button`
  w-[70px] h-[40px] bg-[#296D98] text-white rounded-[5px] [border:none] cursor-pointer
  text-[16px] font-semibold shrink-0 max-[751px]:w-[50px] max-[751px]:text-[13px]
  max-[451px]:w-[50px] max-[451px]:text-[13px]
`;

function EditPage() {
  const [article, setArticle] = useImmer<Article | undefined>(undefined);
  const navigate = useNavigate();
  /** Applies `recipe` only once the article has loaded. */
  const updateArticle = (recipe: (draft: Draft<Article>) => void) => {
    setArticle((draft) => {
      if (draft) recipe(draft);
    });
  };

  async function uploadCoverImg(imageData: File | null | undefined) {
    if (!imageData) return;
    const imgRef = ref(storage, `images/${imageData.name}`);
    await uploadBytes(imgRef, imageData);
    const url = await getDownloadURL(ref(storage, `images/${imageData.name}`));
    updateArticle((draft) => {
      draft.cover_img = url;
    });
  }

  async function uploadImg(
    dayIndex: number,
    placeIndex: number,
    placeImgaeData: File | null | undefined,
  ) {
    if (!placeImgaeData) return;
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
    const articleId = currentArticleId;
    async function getCertainArticle() {
      const docRef = doc(db, 'articles', articleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle(docSnap.data() as Article);
      }
    }
    getCertainArticle();
  }, [currentArticleId, setArticle]);

  function updateArticleTitle(articleTitle: string) {
    updateArticle((draft) => {
      draft.article_title = articleTitle;
    });
  }

  function updateArticleSummary(articleSummary: string) {
    updateArticle((draft) => {
      draft.summary = articleSummary;
    });
  }

  function updatePlaceDescription(placeDescription: string, dayIndex: number, placeIndex: number) {
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_description = placeDescription;
    });
  }

  function deletePlaceImg(dayIndex: number, placeIndex: number, photoIndex: number) {
    updateArticle((draft) => {
      draft.trip_days[dayIndex].places[placeIndex].place_imgs = draft.trip_days[dayIndex]
        .places[placeIndex].place_imgs.filter(
          (deletePhotoItem, deletePhotoIndex) => deletePhotoIndex !== photoIndex,
        );
    });
  }

  async function SaveArticle() {
    if (!currentArticleId) { return; }
    if (currentArticleId && article) {
      const articleRef = doc(db, 'articles', currentArticleId);
      await updateDoc(articleRef, { ...article });
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

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <ArticleCoverImage />
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
                    uploadCoverImg(e.target.files?.[0]);
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
                cols={40}
                rows={5}
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
                                uploadImg(dayIndex, placeIndex, e.target.files?.[0]);
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
                          cols={40}
                          rows={5}
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
