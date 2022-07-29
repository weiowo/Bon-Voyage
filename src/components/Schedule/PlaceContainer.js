import styled from 'styled-components/macro';

const PlaceContainer = styled.div`
  cursor:move;
  display:flex;
  justify-content:space-around;
  align-items:center;
  width:100%;
  height:260px;
  padding-right:20px;
  padding-top:10px;
  padding-bottom:10px;
  background-color:#e7f5fe;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const AddNewScheduleButton = styled.button`
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  font-size:15px;
  font-weight:600;
  color:white;
  width:100%;
  height:50px;
  border:none;
  background-color: #63B5DC;
  padding-bottom:10px;
  padding-top:10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  cursor:pointer;
  @media screen and (max-width:800px){
  margin-bottom:50px;
}`;

export const PlaceContainerInputArea = styled.div`
  width:auto;
  height:auto;
  @media screen and (max-width:800px){
    width:68%;
}`;

export const InputBox = styled.div`
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:28vw;
  height:30px;
  @media screen and (max-width:800px){
    width:100%;
    flex-shrink:0;
}`;

export const DeleteIcon = styled.img`
  width:24px;
  height:24px;
  cursor:pointer;
`;

export const StyledInput = styled.input`
  font-size:15px;
  height:20px;
  width:350px;
  border:none;
  outline:none;
  background-color:transparent;
  text-align:left;
  border-bottom: 1px solid grey;
  @media screen and (max-width:800px){
    width:100%;
    flex-shrink:0;
    font-size:14px;
}`;

export const AddNewScheduleIcon = styled.img`
  width:22px;
  height:22px;
`;

export default PlaceContainer;
