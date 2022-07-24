import styled from 'styled-components/macro';

const ChatRoom = styled.div`
z-index:100;
display:flex;
flex-direction:column;
align-items:center;
width:300px;
height:300px;
border-top-right-radius:10px;
border-top-left-radius:10px;
border-bottom:none;
position: fixed;
bottom: 0px;
right:50px;
background-color:white;
display:${(props) => (props.openChat ? 'flex' : 'none')};
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:800px){
  right:30px;
}`;

export const UnreadMessage = styled.div`
display:flex;
align-items:center;
justify-content:center;
width:20px;
height:20px;
border-radius:50%;
background-color:red;
color:white;
font-size:12px;
font-weight:500;
position:fixed;
bottom:85px;
right:120px;
z-index:300;
animation:${(props) => (props.active ? 'hithere 1.1s ease infinite' : 'none')};
@media screen and (max-width:800px){
  bottom:75px;
  right:80px;
}`;

export const ChatIcon = styled.img`
position: fixed;
bottom: 50px;
right:80px;
z-index:100;
width:50px;
height:50px;
cursor:pointer;
display:${(props) => (props.openChat ? 'none' : 'block')};
animation:${(props) => (props.active ? 'hithere 1.1s ease infinite' : 'none')};
@media screen and (max-width:800px){
  bottom:40px;
  right:40px;
}`;

export const CloseIcon = styled.img`
width:15px;
height:15px;
position:absolute;
right:20px;
cursor:pointer;
`;

export const ChatRoomTitle = styled.div`
display:flex;
align-items:center;
justify-content:center;
height:40px;
background: linear-gradient(
  312deg,
  rgb(178, 228, 238) 0%,
  rgb(161, 176, 255) 100%
);
color:black;
width:100%;
font-size:15px;
position:relative;
border-top-right-radius:10px;
border-top-left-radius:10px;
font-weight:500;
letter-spacing:5px;
`;

export const MessagesDisplayArea = styled.div`
display:flex;
flex-direction:column;
overflow-y:scroll;
overflow-wrap: break-word;
height:250px;
width:100%;
gap:15px;
padding-left:1px;
padding-right:3px;
padding-top:10px;
padding-bottom:15px;
`;

export const MessageBox = styled.div`
padding-left:10px;
display:flex;
width:auto;
height:35px;
border-radius:3px;
align-items:center;
align-self:flex-start;
flex-shrink:0;
`;

export const NameMessage = styled.div`
width:100%;
display:flex;
flex-direction:column;
`;

export const Name = styled.div`
width:100%;
font-size:12px;
font-weight:500;
color:#616161;
margin-left:5px;
text-align:left;
`;

export const Message = styled.div`
margin-left:5px;
padding-left:10px;
padding-right:10px;
border-radius:3px;
height:25px;
display:flex;
align-items:center;
overflow-wrap: break-word;
word-wrap: break-word;
background-color:#D6ECF3;
font-size:14px;
`;

export const UserPhoto = styled.img`
width:30px;
height:30px;
// background-color:orange;
border-radius:50%;
object-fit: cover;
`;

export const EnterArea = styled.div`
width:100%;
height:50px;
display:flex;
align-items:center;
gap:10px;
justify-content:space-between;
// border-top:1px black solid;
padding-left:10px;
padding-right:10px;
background-color:#D3D3D3;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const MessageInput = styled.input`
width:80%;
height:22px;
border-radius:3px;
border: black 1px solid;
border:none;
padding-left:5px;
font-size:15px;
outline:none;
overflow-wrap: break-word;
`;

export const EnterMessageButton = styled.button`
width:auto;
height:20px;
// border: green 2px solid;
border-radius:2px;
cursor:pointer;
border:none;
`;

export default ChatRoom;
