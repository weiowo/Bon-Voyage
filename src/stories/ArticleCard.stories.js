/* eslint-disable react/jsx-props-no-spreading */
import MyArticle, {
  CoverPhotoInMyArticle, MyArticleBelowArea, ArticleTitleAndDeleteIcon, MyArticleTitle,
  MyArticleSummary,
} from '../components/Cards/Article';
import PLACE_PHOTO from '../constants/place.photo';
import StoryGlobalStyle from './GlobalStyle';

function ArticleCard() {
  return (
    <StoryGlobalStyle>
      <MyArticle>
        <CoverPhotoInMyArticle src={PLACE_PHOTO[3]} />
        <MyArticleBelowArea>
          <ArticleTitleAndDeleteIcon>
            <MyArticleTitle>宜蘭Gogogo!</MyArticleTitle>
          </ArticleTitleAndDeleteIcon>
          <MyArticleSummary>這次宜蘭行真的很好玩～天氣也讚！</MyArticleSummary>
        </MyArticleBelowArea>
      </MyArticle>
    </StoryGlobalStyle>
  );
}
export default {
  title: 'ArticleCard',
  component: ArticleCard,
};
export function Template() {
  return <ArticleCard />;
}
