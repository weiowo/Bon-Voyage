import styled from 'styled-components/macro';

const ButtonStarArea = styled.div`
width:100%;
height:auto;
display:flex;
align-items:center;
justify-content:center;
`;

export const AddFavoriteIcon = styled.img`
width:25px;
height:25px;
cursor:pointer;
position:absolute;
right:15%;
justify-self:right;
`;

export const AddToScheduleButton = styled.button`
width:10vw;
height:30px;
border-radius:5px;
background-color:grey;
font-weight:500;
border:none;
color:white;
cursor:pointer;
@media screen and (max-width:1200px){
  width:110px;
}`;

export default ButtonStarArea;
