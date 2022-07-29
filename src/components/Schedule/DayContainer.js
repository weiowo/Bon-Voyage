import styled from 'styled-components/macro';

const DayContainer = styled.div`
  height:60px;
  display:flex;
  width:100%;
  justify-content:left;
  box-shadow: 3px 4px 8px 0px rgba(0, 0, 0, 0.2);
  gap:5px;
  z-index:15;
  overflow:scroll;
  flex-shrink:0;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: transparent;
    border-radius: 10px;
    display:none;
  }
  &::-webkit-scrollbar {
    width: 3px;
    display:none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: transparent;
    display:none;
  }
`;

export const DayContainerTitle = styled.div`
  display:flex;
  align-items:center;
  font-size:12px;
  justify-content:center;
  width:100px;
  height:60px;
  color:#616161;
  flex-shrink:0;
  cursor:move;
  border: 0.5px solid #616161;
  font-weight:600;
  letter-spacing:1.5px;
  background-color:${(props) => (props.active ? '#63B5DC' : 'white')};
  color:${(props) => (props.active ? 'white' : '#616161')};
`;

export const DayContainerBoxes = styled.div`
  display:flex;
  flex-direction:column;
  gap:20px;
  height: 75vh;
  overflow:auto;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: transparent;
    border-radius: 10px;
    background-color:transparent;
  }
  &::-webkit-scrollbar {
    width: 3px;
    background-color:transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: transparent;
    background-color:#D3D3D3;
  }
`;

export const DragIcon = styled.img`
  width:20px;
  height:20px;
`;

export default DayContainer;
