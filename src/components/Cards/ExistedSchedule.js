import styled from 'styled-components/macro';

const ExistedSchedule = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:26vw;
  height:140px;
  gap:20px;
  padding-left:10px;
  padding-right:10px;
  padding-top:10px;
  padding-bottom:10px;
  border-radius:16px;
  cursor:pointer;
  flex-shrink:0;
  background-color:${(props) => (props.isSelected ? '#E6D1F2' : '#e7f5fe')};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  @media screen and (max-width:800px){
    width:29vw;
    gap:10px;
    justify-content:left;
    flex-shrink:0;
  }
  @media screen and (max-width:748px){
    width:30vw;
    gap:8px;
    justify-content:left;
    flex-shrink:0;
    box-shadow:none;
    padding-top:0px;
    padding-bottom:0px;
    height:140px;
}`;

export const ExistedScheuleTitle = styled.div`
  width:95%;
  height:20%;
  text-align:left;
  font-weight:550;
  @media screen and (max-width:900px){
    width:100%;
    margin-bottom:10px;
  }
  @media screen and (max-width:700px){
    width:90%;
    font-size:13px;
    display:flex;
    align-items:center;
    justify-content:center;
}
`;

export const PhotoArea = styled.img`
  width:100px;
  height:100px;
  border-radius:20px;
  @media screen and (max-width:900px){
    width:80px;
    height:80px;
  }
  @media screen and (max-width:700px){
  display:none;
}
`;

export const ScheduleRightPart = styled.div`
  display:flex;
  flex-direction:row;
  width:70%;
  @media screen and (max-width:900px){
    display:none;
}
`;

export const SmallScheduleRightPart = styled.div`
  display:none;
  @media screen and (max-width:900px){
    display:flex;
    flex-direction:column;
    margin-right:10px;
  }
  @media screen and (max-width:700px){
    width:100%;
    font-size:12px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin-right:0px;
    gap:10px;
}
`;

export const ButtonArea = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:15px;
  @media screen and (max-width:900px){
    flex-direction:row;
    width:85%;
    gap:10px;
  }
  @media screen and (max-width:700px){
    flex-direction:column;
    align-items:center;
}`;

export const Button = styled.button`
  height:25px;
  width:50px;
  border:1px solid #296D98;
  color:#296D98;
  border-radius:15px;
  font-weight:500;
  cursor:pointer;
`;

export default ExistedSchedule;
