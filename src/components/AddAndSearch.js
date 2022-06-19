// import styled from 'styled-components/macro';
// import React from 'react';
// // import PropTypes from 'prop-types';

// const searchedData = localStorage.getItem('places') || 0;
// console.log(JSON.parse(searchedData));
// const parsedSearchedData = JSON.parse(searchedData);

// const SearchAreaWrapper = styled.div`
// width:50vw;
// height:100vh;
// display:flex;
// flex-direction:column;
// align-items:center;
// `;

// const TopBar = styled.div`
// display:flex;
// justify-content:center;
// width:50vw;
// height:30px;
// margin-top:30px;
// `;

// const SearhResults = styled.div`
// width:50vw;
// height:auto;
// `;

// const RecommendedPlaces = styled.div`
// display:flex;
// align-items:center;
// width:40vw;
// height:50px;
// border: 1px black solid;
// `;

// const AddButton = styled.button`
// width:auto;
// height:30px;
// `;

// // function AddToPlace(){
// //     console.log()
// // }

// // eslint-disable-next-line react/prop-types
// function AddAndSearch() {
//   // if (recommendList) {
//   //   console.log(recommendList);
//   // } else { console.log('沒拿到'); }

//   return (
//     <SearchAreaWrapper>
//       <TopBar>
//         <button type="button">搜尋</button>
//         <button type="button">自定景點</button>
//       </TopBar>
//       <SearhResults>
//         {parsedSearchedData ? parsedSearchedData.map((item, index) => (
//           <RecommendedPlaces>
//             <p>
//               {index + 1}
//               :
//               {item.name}
//             </p>
//             <AddButton type="button">加入行程</AddButton>
//           </RecommendedPlaces>
//         )) : <div>沒有資料</div>}
//       </SearhResults>
//     </SearchAreaWrapper>
//   );
// }

// // AddAndSearch.propTypes = {
// //   recommendList: PropTypes.func.isRequired,
// // };

// export default AddAndSearch;

// // 輸入城市後推薦景點給他們，景點秀在下方
// // 按下加入景點後，推進景點的array
