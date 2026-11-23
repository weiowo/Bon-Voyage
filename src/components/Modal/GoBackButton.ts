import styled from 'styled-components/macro';
import leftArrow from '../../pages/images/left-arrow.jpg';

const LeftButton = styled.button`
  height:25px;
  width:25px;
  position:absolute;
  background-image: url(${leftArrow});
  background-size:cover;
  background-repeat: no-repeat;
  background-color: rgb(0, 0, 0, 0.2);
  background-blend-mode: multiply;
  left:20px;
  top:20px;
  text-align:center;
  border:none;
  border-radius:50%;
  color:white;
  cursor:pointer;
  @media screen and (max-width:400px){
    left:15px;
    top:15px;
}`;

export default LeftButton;
