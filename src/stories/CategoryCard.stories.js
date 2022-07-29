import PlaceBoxWrapper, {
  PlaceBox, PlacePhoto, PlaceBoxBelowPart, PlaceTitle, AddPlaceToScheduleButton, Tap,
} from '../components/Cards/PlaceBox';
import TAP_IMG from '../pages/images/tap.png';
import PLACE_PHOTO from '../constants/place.photo';
import StoryGlobalStyle from './GlobalStyle';

export function PlaceCard() {
  return (
    <StoryGlobalStyle>
      <PlaceBoxWrapper>
        <Tap src={TAP_IMG} />
        <PlaceBox style={{ paddingLeft: 5 }}>
          <PlacePhoto
            src={PLACE_PHOTO[0]}
          />
          <PlaceBoxBelowPart>
            <PlaceTitle>
              巴黎鐵塔
            </PlaceTitle>
            <AddPlaceToScheduleButton>查看更多</AddPlaceToScheduleButton>
          </PlaceBoxBelowPart>
        </PlaceBox>
      </PlaceBoxWrapper>
    </StoryGlobalStyle>
  );
}
export default {
  title: 'PlaceCard',
  component: PlaceCard,
};
export function Template() {
  return <PlaceCard />;
}
