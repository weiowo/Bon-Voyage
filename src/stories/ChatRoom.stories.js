/* eslint-disable react/jsx-props-no-spreading */
import ChatRoom, {
  CloseIcon, ChatRoomTitle, MessagesDisplayArea,
  MessageBox, NameMessage, Name, Message, UserPhoto, EnterArea, MessageInput, EnterMessageButton,
} from '../components/ChatRoom/Chatroom';
import PLACE_PHOTO from '../constants/place.photo';
import ICONS from '../constants/schedule.page.icon';
import StoryGlobalStyle from './GlobalStyle';

function ChatBox() {
  return (
    <StoryGlobalStyle>
      <ChatRoom style={{ position: 'absolute', left: 50 }} openChat>
        <ChatRoomTitle>
          聊天室
          <CloseIcon src={ICONS?.CLOSE_CHAT_ICON} />
        </ChatRoomTitle>
        <MessagesDisplayArea>
          <MessageBox>
            <UserPhoto src={PLACE_PHOTO[0]} />
            <NameMessage>
              <Name>
                葳
              </Name>
              <Message>哈哈</Message>
            </NameMessage>
          </MessageBox>
        </MessagesDisplayArea>
        <EnterArea>
          <MessageInput />
          <EnterMessageButton>
            send
          </EnterMessageButton>
        </EnterArea>
      </ChatRoom>
    </StoryGlobalStyle>

  );
}
export default {
  title: 'ChatRoom',
  component: ChatBox,
};

export function Template() {
  return <ChatBox />;
}
