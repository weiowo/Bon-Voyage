import Loading from '../Loading';
import STAR from '../../constants/stars';
import PLACE_PHOTO from '../../constants/place.photo';
import Modal from './Modal';
import ModalLeftArea from './ModalLeftArea';
import ModalImgArea, { ModalImg } from './ModalImgArea';
import CloseModalButton from './CloseButton';
import ButtonStarArea, { AddToScheduleButton, AddFavoriteIcon } from './ButtonStar';
import ModalPlaceTitle, { ModalPlaceAddress } from './ModalText';

interface PlaceDetailModalProps {
  active: boolean;
  /** Shows a spinner while falsy. */
  place: google.maps.places.PlaceResult | undefined;
  liked: boolean;
  onAddToSchedule: () => void;
  onToggleFavorite: (placeId: string | undefined) => void;
  onClose: () => void;
}

const PHOTO_SLOTS = [0, 1, 2, 3];

/** Place details (name, address, four photos) with "add to schedule" and favourite actions. */
function PlaceDetailModal({
  active, place, liked, onAddToSchedule, onToggleFavorite, onClose,
}: PlaceDetailModalProps) {
  return (
    <Modal active={active} flexDirection="row">
      {place
        ? (
          <>
            <ModalLeftArea>
              <ModalPlaceTitle>{place.name}</ModalPlaceTitle>
              <ModalPlaceAddress>{place.formatted_address}</ModalPlaceAddress>
              <ButtonStarArea>
                <AddToScheduleButton onClick={onAddToSchedule}>
                  加入行程
                </AddToScheduleButton>
                <AddFavoriteIcon
                  onClick={() => onToggleFavorite(place.place_id)}
                  src={liked ? STAR.FULL_STAR : STAR.EMPTY_STAR}
                />
              </ButtonStarArea>
            </ModalLeftArea>
            <ModalImgArea>
              {PHOTO_SLOTS.map((i) => (
                <ModalImg
                  key={i}
                  alt="detail_photo"
                  src={place.photos?.[i]?.getUrl() || PLACE_PHOTO[i]}
                />
              ))}
            </ModalImgArea>
            <CloseModalButton type="button" onClick={onClose}>
              X
            </CloseModalButton>
          </>
        )
        : <Loading />}
    </Modal>
  );
}

export default PlaceDetailModal;
