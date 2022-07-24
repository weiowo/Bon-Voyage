import styled from 'styled-components/macro';

const ModalImgArea = styled.div`
width:25vw;
height:22vw;
display:flex;
flex-wrap:wrap;
align-items:center;
gap:10px;
@media screen and (max-width:1200px){
  width:50%;
  height:70%;
}
@media screen and (max-width:630px){
  width:100%;
  height:60%;
  flex-wrap:wrap;
  justify-content:center;
  gap:20px;
  padding-bottom:40px;
}
@media screen and (max-width:575px){
  width:90%;
  height:60%;
  padding-bottom:30px;
}
@media screen and (max-width:430px){
  height:50%;
  gap:8px;
}
`;

export const ModalImg = styled.img`
width:10vw;
height:10vw;
border-radius:10px;
object-fit: cover;
@media screen and (max-width:1200px){
  width:120px;
  height:120px;
}
@media screen and (max-width:630px){
  width:170px;
  height:130px;
  flex-shrink:0;
}
@media screen and (max-width:575px){
  width:140px;
  height:115px;
}
@media screen and (max-width:480px){
  width:120px;
  height:100px;
}
@media screen and (max-width:430px){
  width:110px;
  height:100px;
}
@media screen and (max-width:390px){
  width:120px;
  height:100px;
}
`;

export default ModalImgArea;
