import RestaurantBox, {
  RestaurantPhoto, RestaurantBoxRightContent,
  RestaurantTitle, RestaurantDescription, RestaurantSeeMoreButton,
} from '../components/Cards/Restaurant';
import PLACE_PHOTO from '../constants/place.photo';
import GlobalStyle from './GlobalStyle';

function RestaurantCard() {
  return (
    <GlobalStyle>
      <RestaurantBox>
        <RestaurantPhoto src={PLACE_PHOTO[4]} />
        <RestaurantBoxRightContent>
          <RestaurantTitle>
            Effiel Tower
          </RestaurantTitle>
          <RestaurantDescription>
            Paris
          </RestaurantDescription>
          <RestaurantSeeMoreButton>
            了解更多
          </RestaurantSeeMoreButton>
        </RestaurantBoxRightContent>
      </RestaurantBox>
    </GlobalStyle>
  );
}

export default {
  title: 'RestaurantCard',
  component: RestaurantCard,
};
export function Template() {
  return <RestaurantCard />;
}
