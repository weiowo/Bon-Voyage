import styled from 'styled-components/macro';
// import React, { useState } from 'react';

const searchedData = localStorage.getItem('places') || 0;
console.log(JSON.parse(searchedData));
const parsedSearchedData = JSON.parse(searchedData);

const SearchAreaWrapper = styled.div`
width:50vw;
height:100vh;
display:flex;
flex-direction:column;
align-items:center;
`;

const TopBar = styled.div`
display:flex;
justify-content:center;
width:50vw;
height:30px;
margin-top:30px;
`;

const SearhResults = styled.div`
width:50vw;
height:auto;
`;

const RecommendedPlaces = styled.div`
display:flex;
align-items:center;
width:40vw;
height:50px;
border: 1px black solid;
`;

const AddButton = styled.button`
width:auto;
height:30px;
`;

// function AddToPlace(){
//     console.log()
// }

function AddAndSearch() {
  // const [selectedSearchedPlace, setSelectedSearchedPlace] = useState();

  // const newSelectedSearchedPlace = {
  //   place_title: parsedSearchedData,
  //   place_address: '測試',
  //   stay_time: '一百年',
  // };
  return (
    <SearchAreaWrapper>
      <TopBar>
        <button type="button">搜尋</button>
        <button type="button">自定景點</button>
      </TopBar>
      <SearhResults>
        {parsedSearchedData ? parsedSearchedData.map((item, index) => (
          <RecommendedPlaces>
            <p>{index + item.name}</p>
            <AddButton type="button">加入行程</AddButton>
          </RecommendedPlaces>
        )) : <div>沒有資料</div>}
      </SearhResults>
    </SearchAreaWrapper>
  );
}

export default AddAndSearch;

// 輸入城市後推薦景點給他們，景點秀在下方
// 按下加入景點後，推進景點的array
