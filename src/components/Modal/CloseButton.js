import styled from 'styled-components/macro';

const CloseModalButton = styled.button`
display:flex;
align-items:center;
justify-content:center;
height:25px;
width:25px;
position:absolute;
right:20px;
top:20px;
text-align:center;
border:none;
border-radius:50%;
background-color:black;
color:white;
cursor:pointer;
@media screen and (max-width:400px){
  right:15px;
  top:15px;
}`;

export default CloseModalButton;
