import styled from 'styled-components/macro';

const AttractionBox = styled.div`
display:flex;
flex-direction:column;
align-items:center;
width:250px;
height:auto;
margin-top:30px;
cursor:pointer;
@media screen and (max-width:1000px){
  width:200px;
}
@media screen and (max-width:890px){
  width:180px;
}
@media screen and (max-width:777px){
  width:250px;
}
@media screen and (max-width:513px){
  width:170px;
}
`;

export const AttractionPhotoContainer = styled.div`
border-radius:20px;
display: inline-block;
width:200px;
height:240px;
overflow: hidden;
@media screen and (max-width:1000px){
  width:200px;
}
@media screen and (max-width:890px){
  width:180px;
}
@media screen and (max-width:777px){
  width:200px;
  height:240px;
}
@media screen and (max-width:513px){
  width:170px;
}
`;

export const AttractionPhoto = styled.img`
border-radius:20px;
display: block;
width:200px;
height:240px;
object-fit: cover;
transition: 0.5s all ease-in-out;
&:hover {
    transform: scale(1.2);
}
@media screen and (max-width:1000px){
  width:200px;
}
@media screen and (max-width:890px){
  width:180px;
}
@media screen and (max-width:777px){
  width:200px;
  height:240px;
}
@media screen and (max-width:513px){
  width:170px;
}
`;

export const AttractionTitle = styled.div`
font-size:14px;
margin-top:10px;
font-weight:500;
font-color:#AAAAA;
`;

export const AttractionDescription = styled.div`
font-size:10px;
margin-top:5px;
`;

export const AttractionSeeMoreButton = styled.button`
font-size:14px;
background-color:#63666A;
color:white;
border-radius:3px;
font-size:10px;
box-style:none;
border:none;
outline:none;
margin-top:10px;
cursor:pointer;
`;

export default AttractionBox;
