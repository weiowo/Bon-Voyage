/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import styled from 'styled-components/macro';
// import { Link } from 'react-router-dom';

// const Modal = styled.div`
// display: none;
// position: fixed;
// left: 0;
// top: 0;
// width: 100%;
// height: 100%;
// overflow: auto;
// background-color: rgba(0, 0, 0, 0.4);
// &:target {
//     display: flex;
//     justify-content:center;
//     align-items:center;
//   }`;

// const ModalBox = styled.div`
//     display: table-cell;
//     vertical-align: middle;
// `;

// const ModalContent = styled.div`
// margin: auto;
//   background-color: #f3f3f3;
//   height:300px;
//   width:80vw;
//   border-radius:6px;
//   padding: 0;
// //   outline: 0;
//   border: 1px #777 solid;
//   text-align: justify;
//   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
// `;

const TestModalBackground = styled.div`
width:100vw;
height:100vh;
background-color:beige;
background-color:rgba(45, 55, 555, 0.4);
display:flex;
justify-content:center;
align-items:center;
display:${(props) => (props.active ? 'flex' : 'none')};
`;

const TestDiv = styled.div`
width:50vw;
height:50vh;
background-color:white;
z-index:10;
border-radius:20px;
`;

// const CloseBtn = styled.button`
// text-decoration: none;
// float: right;
// font-size: 35px;
// font-weight: bold;
// color: #fff;
// `;

function PlaceModal() {
//   const [placeDetail, setPlaceDetail] = useState('');

  //   useEffect(() => {
  //     console.log('c8c8 ');
  //     fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPxnPnrCrQjQRmEwUNrIViu0&language=zh-TW&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o', {
  //       method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //     //   mode: 'no-cors', // no-cors, cors, *same-origin
  //     })
  //       .then((response) => response.json()); // 輸出成 json
  //   }, []);
  //   useEffect(() => {
  //     console.log('哈哈哈哈哈哈');
  //     fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPxnPnrCrQjQRmEwUNrIViu0&language=zh-TW&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o')
  //       .then((response) => {
  //         console.log(response);
  //         return response.json();
  //       }).then((jsonData) => {
  //         console.log(jsonData);
  //         window.localStorage.setItem('PlcesSearched', jsonData);
  //       }).catch((err) => {
  //         console.log('錯誤:', err);
  //       });
  //   }, []);

  return (
    // <>
    //   <a href="#modal" type="button">點我開啟</a>
    //   <Modal id="modal">
    //     <ModalContent>
    //       <a href="#" className="closebtn">關掉</a>
    //     </ModalContent>
    //   </Modal>
    // </>
    <TestModalBackground>
      <TestDiv>哈哈哈哈哈哈</TestDiv>
      <button type="button">close</button>
    </TestModalBackground>

  );
}

export default PlaceModal;
