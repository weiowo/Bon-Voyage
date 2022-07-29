import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

const SmallScreenNavBar = styled.div`
display:none;
@media screen and (max-width:800px){
  position:fixed;
  top:0px;
  display:flex;
  flex-direction:column;
  align-items:center;
  width:45vw;
  height:100vh;
  gap:6px;
  right:0;
  z-index:500;
  background-color:white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display:${(props) => (props.active ? 'flex' : 'none')};
}
@media screen and (max-width:500px){
  width:60vw;
}
`;

export const HamburgerMenuLink = styled(Link)`
  text-decoration:none;
  display:flex;
  padding-left:30px;
  padding-right:20px;
  align-items:center;
  justify-content:left;
  width:100%;
  height:60px;
  gap:15px;
  color:black;
  &:hover {
    background-color:#EBECF0;
}`;

export const CreateScheduleWrapper = styled.div`
  text-decoration:none;
  cursor:pointer;
  display:flex;
  padding-left:30px;
  padding-right:20px;
  align-items:center;
  justify-content:left;
  width:100%;
  height:60px;
  gap:15px;
  color:black;
  &:hover {
    background-color:#EBECF0;
}`;

export const SmallLogOutButton = styled.div`
  width:90%;
  height:40px;
  margin-bottom:10px;
  border:1.5px solid grey;
  color:black;
  border-radius:10px;
  font-weight:600;
  display:flex;
  font-size:14px;
  justify-content:center;
  align-items:center;
  position:absolute;
  cursor:pointer;
  bottom:0;
  &:hover {
    background-color:#EBECF0;
}`;

export const HamburgerProfileLink = styled(Link)`
  text-decoration:none;
  display:flex;
  padding-left:30px;
  padding-right:20px;
  align-items:center;
  justify-content:left;
  width:100%;
  height:60px;
  gap:15px;
  color:black;
`;

export const ProfileBackground = styled.div`
  height:90px;
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  background: linear-gradient(
    312deg,
    rgb(178, 228, 238) 0%,
    rgb(161, 176, 246) 100%
  );
`;

export const SmallProfilePhoto = styled.img`
  width:42px;
  height:42px;
  border-radius:50%;
  object-fit:cover;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const SmallNavIcon = styled.img`
  width:30px;
  height:30px;
  object-fit:cover;
`;

export const SmallProfileName = styled.div`
  width:100%;
  height:30px;
  display:flex;
  font-weight:600;
  justify-content:left;
  align-items:center;
`;

export const SmallNavText = styled.div`
  width:100%;
  height:30px;
  display:flex;
  font-weight:500;
  justify-content:left;
  align-items:center;
  font-size:14px;
`;

export const Menu = styled.img`
  display:none;
  @media screen and (max-width:800px){
    display:block;
    width:23px;
    height:23px;
    position:fixed;
    top:15px;
    right:15px;
    cursor:pointer;
    display:${(props) => (props.active ? 'none' : 'block')};
}`;

export const CloseIcon = styled.img`
  display:none;
  @media screen and (max-width:800px){
    width:15px;
    height:15px;
    position:absolute;
    top:18px;
    right:18px;
    cursor:pointer;
    z-index:1000;
    display:${(props) => (props.active ? 'block' : 'none')};
}`;

export const SmallHeader = styled.div`
  display:none;
  @media screen and (max-width:800px){
    display:flex;
    justify-content:space-between;
    width:100vw;
    position:fixed;
    top:0;
    z-index:1000;
    height:${(props) => (props.active ? '60px' : '65px')};
    background-color:${(props) => (props.active ? 'rgba(255, 255, 255, 0.8)' : 'transparent')};
    box-shadow: ${(props) => (props.active ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' : 'none')};
}`;

export const Background = styled.div`
  display:none;
  @media screen and (max-width:800px){
    position:fixed;
    top:0px;
    display:flex;
    justify-content:right;
    width:100vw;
    height:100vh;
    background-color: rgb(0, 0, 0, 0.5);
    z-index:1000;
    display:${(props) => (props.active ? 'flex' : 'none')};
}`;

export default SmallScreenNavBar;
