import styled from 'styled-components/macro';

const DeleteAsk = styled.div`
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:600;
  font-size:20px;
  margin-top:30px;
`;

export const DeleteButtonArea = styled.div`
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  gap:20px;
`;

export const ConfirmDeleteButton = styled.button`
  width:30%;
  height:30px;
  background-color:#e7f5fe;
  font-weight:550;
  border:none;
  border-radius:10px;
  cursor:pointer;
  font-size:16px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const NoDeleteButton = styled.button`
  width:30%;
  height:30px;
  background-color:#E6D1F2;
  font-weight:550;
  border:none;
  border-radius:10px;
  font-size:16px;
  cursor:pointer;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

export const DeleteModalTitle = styled.div`
  display: flex;
  align-items:center;
  justify-content:center;
  font-size:20px;
  position:absolute;
  color:white;
  text-shadow:1px 1px 2px black;
  top:0;
  font-weight:500;
  width:100%;
  height:40px;
  border-top-right-radius:inherit;
  border-top-left-radius:inherit;
  background: rgb(167, 176, 215);
  background: linear-gradient(
    312deg,
    rgb(178, 228, 238) 0%,
    rgb(161, 176, 246) 100%
  );
`;

export default DeleteAsk;
