/* eslint-disable react/prop-types */
import styled from 'styled-components/macro';

const ModalLeftArea = styled.div`
width:25vw;
height:28vw;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:10px;
position:relative;
@media screen and (max-width:1200px){
  width:50%;
  height:80%;
}
@media screen and (max-width:630px){
  width:90%;
  height:50%;
  gap:20px;
}
@media screen and (max-width:570px){
  width:90%;
  height:45%;
  gap:20px;
}
@media screen and (max-width:430px){
  height:50%;
}

`;

export default ModalLeftArea;
