import styled from 'styled-components/macro';
import React from 'react';

const SearchAreaWrapper = styled.div`
width:50vw;
height:100vh;
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

function AddAndSearch() {
  return (
    <SearchAreaWrapper>
      <TopBar>
        <button type="button">搜尋</button>
        <button type="button">自定景點</button>
      </TopBar>
      <SearhResults>
        <div>某某餐廳</div>
        <div>某某飯店</div>
        <div>某某飯店</div>
      </SearhResults>
    </SearchAreaWrapper>

  );
}

export default AddAndSearch;

// 輸入城市後推薦景點給他們，景點秀在下方，
