import ButtonStarArea, { AddToScheduleButton, AddFavoriteIcon } from '../components/Modal/ButtonStar';
import ModalImgArea, { ModalImg } from '../components/Modal/ModalImgArea';
import Modal from '../components/Modal/Modal';
import ModalLeftArea from '../components/Modal/ModalLeftArea';
import CloseModalButton from '../components/Modal/CloseButton';
import ModalPlaceTitle, { ModalPlaceAddress } from '../components/Modal/ModalText';
import PLACE_PHOTO from '../constants/place.photo';
import StoryGlobalStyle from './GlobalStyle';
import STAR from '../constants/stars';

function PlaceModal() {
  return (
    <StoryGlobalStyle>
      <Modal active flexDirection="row">
        <ModalLeftArea>
          <ModalPlaceTitle>台北喜來登大飯店</ModalPlaceTitle>
          <ModalPlaceAddress>100台灣台北市中正區忠孝東路一段12號</ModalPlaceAddress>
          <ButtonStarArea>
            <AddToScheduleButton>
              加入行程
            </AddToScheduleButton>
            <AddFavoriteIcon src={STAR?.FULL_STAR} />
          </ButtonStarArea>
        </ModalLeftArea>
        <ModalImgArea>
          <ModalImg alt="detail_photo" src={PLACE_PHOTO[0]} />
          <ModalImg alt="detail_photo" src={PLACE_PHOTO[1]} />
          <ModalImg alt="detail_photo" src={PLACE_PHOTO[2]} />
          <ModalImg alt="detail_photo" src={PLACE_PHOTO[3]} />
        </ModalImgArea>
        <CloseModalButton
          type="button"
        >
          X
        </CloseModalButton>
      </Modal>
    </StoryGlobalStyle>
  );
}
export default {
  title: 'PlaceModal',
  component: PlaceModal,
};
export function Template() {
  return <PlaceModal />;
}
