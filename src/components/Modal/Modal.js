/* eslint-disable react/prop-types */
import styled from 'styled-components/macro';

const ModalBackground = styled.div`
width:100vw;
height:100vh;
position:fixed;
top:0;
bottom:0;
left:0;
right:0;
background-color:rgba(0, 0, 0, 0.7);
display:flex;
justify-content:center;
align-items:center;
display:${(props) => (props.active ? 'flex' : 'none')};
z-index:100;
`;

const ModalBox = styled.div`
display:flex;
width:50vw;
height:30vw;
flex-direction:${(props) => (props.flexDirection)};
background-color:white;
z-index:10;
border-radius:20px;
z-index:200;
position: relative;
align-items:center;
@media screen and (max-width:1200px){
width:600px;
height:370px;
}
@media screen and (max-width:630px){
  width:80vw;
  height:90vw;
  flex-direction:column;
}
@media screen and (max-width:575px){
  width:80vw;
  height:110vw;
}
@media screen and (max-width:430px){
  height:120vw;
}`;

function Modal({ children, active, flexDirection }) {
  return (
    <ModalBackground active={active}>
      <ModalBox flexDirection={flexDirection}>
        {children}
      </ModalBox>
    </ModalBackground>
  );
}

export default Modal;
