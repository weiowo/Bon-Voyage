import styled from 'styled-components/macro';

export const FoundAsk = styled.div`
  width:100%;
  font-weight:600;
  font-size:18px;
`;

export const CloseSearch = styled.img`
  position:absolute;
  right:20px;
  width:18px;
  height:18px;
  cursor:pointer;
`;

export const InviteFriendInput = styled.input`
  border:none;
  font-size:16px;
  padding-left:3px;
  width:80%;
  border-bottom:1px solid black;
  outline:none;
  margin-top:20px;
`;

export const InviteFriendBelowArea = styled.div`
  display:${(props) => (props.active ? 'flex' : 'none')};
  flex-direction:column;
  align-items:center;
  gap:30px;
  justify-content:center;
  width:100%;
  margin-top:20px;
`;

export const ConfirmSearchButton = styled.button`
  width:30%;
  height:35px;
  border-radius:8px;
  color:white;
  font-weight:550;
  font-size:16px;
  border:none;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  text-shadow:1px 1px 2px black;
  background: linear-gradient(
    312deg,
    rgb(178, 228, 238) 0%,
    rgb(161, 176, 246) 100%
  );
  @media screen and (max-width:800px){
    width:50%;
  }
`;

const AddFriendButton = styled.img`
  width:55px;
  height:55px;
  cursor:pointer;
  @media screen and (max-width:800px){
    width:35px;
    height:35px;
  }
  @media screen and (max-width:748px){
    width:55px;
    height:55px;
  }
`;

export default AddFriendButton;
