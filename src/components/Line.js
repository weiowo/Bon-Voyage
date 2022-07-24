import styled from 'styled-components/macro';

const Line = styled.div`
display:flex;
width:1.8px;
height:85vh;
background-color:#D3D3D3;
align-items:center;
margin-top:20px;
@media screen and (max-width:800px){
  display:none;
}`;

export default Line;
