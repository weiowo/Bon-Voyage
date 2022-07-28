import styled from 'styled-components/macro';

const ResultsArea = styled.div`
display:flex;
flex-direction:column;
align-items:center;
height:85%;
position:fixed;
bottom:0;
@media screen and (max-width:800px){
  width:100%;
}
`;

export const SearchedPlace = styled.div`
width:45vw;
height:80px;
display:flex;
align-items:center;
justify-content:center;
gap:30px;
margin-bottom:5px;
margin-top:20px;
@media screen and (max-width:800px){
  width:100%;
}
`;

export const RecommendPlaces = styled.div`
display:flex;
flex-direction:column;
align-items:center;
height:90vh;
width:45vw;
overflow:scroll;
background-color:#e7f5fe;
border-top:1px solid black;
padding-top:20px;
gap:10px;
font-size:16px;
font-weight:450;
@media screen and (max-width:800px){
  width:100%;
}
`;

export const RecommendPlace = styled.div`
gap:30px;
display:flex;
justify-content:space-between;
width:90%;
/* height:120px; */
border:1.5px #226788 solid;
border-radius:15px;
padding-top:20px;
padding-bottom:20px;
background-color:white;
@media screen and (max-width:800px){
  width:90%;
}
`;

export const RecommendPlaceLeftArea = styled.div`
display:flex;
width:50%;
flex-direction:column;
justify-content:center;
margin-left:30px;
gap:10px;
@media screen and (max-width:800px){
  width:100%;
}
`;

export const RecommendPlaceTitle = styled.div`
font-weight:600;
font-size:15px;
text-align:left;
width:270px;
color:#226788;
@media screen and (max-width:800px){
  width:100%;
}
`;

export const SearchedPlaceTitle = styled.div`
font-weight:600;
font-size:25px;
text-align:left;
width:auto;
color:#226788;
`;

export const RecommendPlcePhoto = styled.img`
width:90px;
height:90px;
border-radius:15px;
margin-right:30px;
`;

export default ResultsArea;
