import styled from 'styled-components/macro';

const ModalPlaceTitle = styled.div`
font-size:26px;
font-weight:600;
width:80%;
@media screen and (max-width:480px){
  font-size:20px;
  width:90%;
}`;

export const ModalPlaceAddress = styled.div`
width:80%;
color:#696969;
`;

export default ModalPlaceTitle;
