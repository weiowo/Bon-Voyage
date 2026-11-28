import styled from 'styled-components/macro';

const WriteArticleRemind = styled.div`
  width:50%;
  height:150px;
  display:flex;
  margin-top:20px;
  gap:15px;
@media screen and (max-width:800px){
  width:100%;
  justify-content:center;
}`;

export const WriteArticleImg = styled.img`
  width:150px;
  height:150px;
`;

export const WriteRightArea = styled.div`
  width:auto;
  height:150px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:20px;
  @media screen and (max-width:800px){
    width:auto;
}`;

export const WriteText = styled.div`
  font-size:15px;
  font-weight:600;
  text-align:left;
`;

export const WriteButton = styled.button`
  width:100px;
  height:40px;
  border-radius:10px;
  background-color:#598BAF;
  color:white;
  font-weight:600;
  border:none;
  font-size:15px;
  cursor:pointer;
`;

export default WriteArticleRemind;
