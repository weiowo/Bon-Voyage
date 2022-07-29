import ExistedSchedule, {
  ButtonArea, ExistedScheuleTitle, PhotoArea, ScheduleRightPart, Button,
} from '../components/Cards/ExistedSchedule';
import PLACE_PHOTO from '../constants/place.photo';
import StoryGlobalStyle from './GlobalStyle';

function ScheduleCard() {
  return (
    <StoryGlobalStyle>
      <ExistedSchedule>
        <PhotoArea src={PLACE_PHOTO[0]} />
        <ScheduleRightPart>
          <ExistedScheuleTitle>花蓮三日遊</ExistedScheuleTitle>
          <ButtonArea>
            <Button>選擇</Button>
            <Button>刪除</Button>
          </ButtonArea>
        </ScheduleRightPart>
      </ExistedSchedule>
    </StoryGlobalStyle>

  );
}
export default {
  title: 'ScheduleCard',
  component: ScheduleCard,
};

export function Template() {
  return <ScheduleCard />;
}
