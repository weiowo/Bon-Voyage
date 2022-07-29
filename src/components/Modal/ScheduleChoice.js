import styled from 'styled-components/macro';

const SchedulesWrapper = styled.div`
  width:95%;
  height:95%;
  display:flex;
  flex-direction:column;
  align-items:center;
  overflow:auto;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: transparent;
    border-radius: 10px;
    background-color:transparent;
  }
  &::-webkit-scrollbar {
    width: 6px;
    background-color:transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: transparent;
    background-color:#D3D3D3;
  }
`;

export const ConfirmDayButton = styled.button`
  width:20%;
  height:35px;
  background: linear-gradient(
    312deg,
    rgb(178, 228, 238) 0%,
    rgb(161, 176, 246) 100%
  );
  border-radius:25px;
  border:none;
  color:black;
  font-weight:600;
  font-size:16px;
  cursor:pointer;
`;

export const CurrentSchedulesTitle = styled.div`
  width:100%;
  height:30px;
  font-size:17px;
  font-weight:600;
  margin-top:20px;
  margin-bottom:10px;
`;

export const ScheduleBoxWrapper = styled.div`
  display:flex;
  flex-flow:wrap;
  height:auto;
  width:auto;
  align-items:center;
  justify-content:center;
  gap:15px;
  padding-top:10px;
  padding-bottom:20px;
  padding-left:2px;
  &:after {
    content: "";
    width:220px;
  }
  overflow:auto;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: transparent;
    border-radius: 10px;
    background-color:transparent;
  }
  &::-webkit-scrollbar {
    width: 6px;
    background-color:transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: transparent;
    background-color:#D3D3D3;
  }
`;

export const ScheduleBox = styled.div`
  display:flex;
  align-items:center;
  width:220px;
  height:60px;
  border-radius:10px;
  background-color:#e7f5fe;
  cursor:pointer;
  background-color:${(props) => (props.clicked ? '#E6D1F2' : '#e7f5fe')};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  &:hover {
    background-color:#E6D1F2;
}`;

export const ScheduleTitle = styled.div`
  width:170px;
  text-align:left;
  height:auto;
  font-weight:500;
  font-size:15px;
  margin-left:20px;
`;

export const ChooseButton = styled.button`
  display:flex;
  align-items:center;
  justify-content:center;
  width:60px;
  height:25px;
  border-radius:10px;
  border:1px solid #296D98;
  font-size:13px;
  font-weight:550;
  margin-right:10px;
  cursor:pointer;
  background-color:${(props) => (props.clicked ? 'grey' : 'white')};
  color:${(props) => (props.clicked ? 'white' : 'black')};
`;

export default SchedulesWrapper;
