import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

const RemindWrapper = styled.div`
  width:26vw;
  height:180px;
  display:flex;
  gap:20px;
  @media screen and (max-width:1180px){
    width:100%;
    height:150px;
  }
  @media screen and (max-width:1000px){
    width:100%;
  }
  @media screen and (max-width:748px){
    justify-content:center;
    width:100%;
  }
  @media screen and (max-width:480px){
    height:130px;
}`;

export const StyledBlackLink = styled(Link)`
  cursor:pointer;
  text-decoration:none;
  color:black;
  border:none;
`;

export const ClickAndAdd = styled.div`
  width:80px;
  height:auto;
  font-size:15px;
  background-color:white;
  position:absolute;
  bottom:35px;
  font-weight:600;
  left:10px;
  border: 1.5px solid black;
  border-radius:5px;
  cursor:pointer;
  @media screen and (max-width:400px){
    font-size:13px;
    left:5px;
}`;

export const RemindText = styled.div`
  width:100%;
  font-weight:550;
  font-size:15px;
  text-align:left;
  @media screen and (max-width:1180px){
    font-size:13px;
  }
  @media screen and (max-width:400px){
    font-size:13px;
  }`;

export const RemindIcon = styled.img`
  width:180px;
  height:180px;
  @media screen and (max-width:1180px){
    width:150px;
    height:150px;
  }
  @media screen and (max-width:1000px){
    width:140px;
    height:140px;
  }
  @media screen and (max-width:480px){
    width:130px;
    height:130px;
}`;

export const SuitcaseIcon = styled.img`
  width: 100px;
  height:100px;
  @media screen and (max-width:1000px){
    width:95px;
    height:95px;
  }
  @media screen and (max-width:480px){
    height:90px;
    width:90px;
}`;

export const RemindRightPart = styled.div`
  width:70%;
  height:180px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  position:relative;
  @media screen and (max-width:1180px){
    height:150px;
  }
  @media screen and (max-width:1000px){
    height:140px;
  }
  @media screen and (max-width:1000px){
    width:auto;
  }
  @media screen and (max-width:480px){
    height:130px;
}`;

export default RemindWrapper;
