import styled from 'styled-components/macro';

const PlaceBoxWrapper = styled.div`
position:relative;
width:220px;
height:320px;
cursor:pointer;
@media screen and (max-width:970px){
  width:176px;
  height:256px;
}
@media screen and (max-width:745px){
  width:220px;
  height:320px;
}
@media screen and (max-width:575px){
  width:176px;
  height:256px;
}
@media screen and (max-width:465px){
  width:154px;
  height:224px;
}
`;

export const PlaceBox = styled.div`
width: 200px;
height: 290px;
margin-top:10px;
background-color:white;
box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
@media screen and (max-width:970px){
  width:160px;
  height:232px;
}
@media screen and (max-width:745px){
  width: 200px;
  height: 290px;
}
@media screen and (max-width:575px){
  width:160px;
  height:232px;
}
@media screen and (max-width:465px){
  width:140px;
  height:210px;
}
`;

export const PlacePhoto = styled.img`
margin-top:6px;
width:188px;
height:188px;
object-fit:cover;
@media screen and (max-width:970px){
  width:150px;
  height:150px;
}
@media screen and (max-width:745px){
  width:188px;
  height:188px;
}
@media screen and (max-width:575px){
  width:150px;
  height:150px;
}
@media screen and (max-width:465px){
  width:132px;
  height:132px;
}
`;

export const PlaceBoxBelowPart = styled.div`
width:188px;
padding-top:3px;
height:80px;
margin-left:15px;
display:flex;
flex-direction:column;
align-items:flex-start;
gap:5px;
@media screen and (max-width:970px){
  width:90%;
  margin-left:10px;
  height:30%
}
`;

export const PlaceTitle = styled.div`
width:175px;
font-size:14px;
font-weight:500;
color:black;
text-align:left;
@media screen and (max-width:970px){
  width:90%;
}
@media screen and (max-width:465px){
  font-size:12px;
}
`;

export const AddPlaceToScheduleButton = styled.div`
width:65px;
font-size:10px;
height:20px;
background-color:grey;
color:white;
border-radius:3px;
display:flex;
justify-content:center;
align-items:center;
`;

export const Tap = styled.img`
position:absolute;
width:85px;
height:20px;
z-index:10;
transform: rotate(25deg);
right: -2px;
top: 8px;
@media screen and (max-width:465px){
  width:65px;
  height:17px;
}
`;

export default PlaceBoxWrapper;
