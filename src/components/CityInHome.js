// 在首頁按下種類的時候，會把種類跟使用者所在位置的經緯度紀錄
// 接著到category頁面執行相關搜尋
// 不同的種類上面的banner可以不一樣
import React from 'react';
import styled from 'styled-components/macro';
import ParisSrc from '../pages/images/paris_2.png';
import KyotoSrc from '../pages/images/kyoto.png';
import TainanSrc from '../pages/images/tainan.png';
import AmsterdamSrc from '../pages/images/amsterdam.png';
import ProvenceSrc from '../pages/images/provence.png';
import EgyptSrc from '../pages/images/egypt.png';
import BarcelonaSrc from '../pages/images/barcelona.png';
import CamBridgeSrc from '../pages/images/cambridge.png';
import NewYorkSrc from '../pages/images/newyork.png';
import MexicoSrc from '../pages/images/mexico.png';

const CityAtHomeWrapper = styled.div`
margin-top:60px;
width:100vw;
height:450px;
display:flex;
flex-direction:column;
align-items:center;
`;

const CityAtHomeWrapperTitle = styled.div`
width:100vw;
height:30px;
display:flex;
justify-content:center;
align-items:center;
font-size:24px;
font-weight:600;
color:#1F456E;
margin-bottom:60px;
`;

const CityAtHomeBelowPart = styled.div`
width:100vw;
height:400px;
display:flex;
justify-content:center;
gap:15px;
`;

const FirstVerticalBlock = styled.div`
width:33vw;
height:430px;
display:flex;
flex-direction:column;
gap:15px;
`;

const Tainan = styled.div`
position:relative;
background-position: center;
border-radius:10px;
width:33vw;
height:290px;
background-image: url(${TainanSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.25);
background-blend-mode: multiply;
// background: linear-gradient(#3204fdba, #9907facc), url(${TainanSrc}) no-repeat cover;
`;

const TainanTitle = styled.div`
font-size:30px;
font-weight:700;
color:white;
position:absolute;
bottom:20px;
left:20px;
`;

const FirstVerticalBlockBelowPart = styled.div`
width:33vw;
height:140px;
display:flex;
gap:15px;
`;

const Barcelona = styled.div`
position:relative;
border-radius:10px;
background-position: center;
width:13vw;
height:140px;
background-image: url(${BarcelonaSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
`;

const BarcelonaTitle = styled.div`
font-size:18px;
font-weight:600;
color:white;
position:absolute;
top:12px;
left:12px;
`;

const Provence = styled.div`
position:relative;
border-radius:10px;
background-position: center;
width:20vw;
height:140px;
background-image: url(${ProvenceSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.1);
background-blend-mode: multiply;
`;

const ProvenceTitle = styled.div`
font-size:18px;
font-weight:600;
color:white;
position:absolute;
bottom:12px;
right:12px;
`;

const SecondVerticalBlcok = styled.div`
position:relative;
border-radius:10px;
background-position: center;
width:14vw;
height:430px;
background-image: url(${KyotoSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.1);
background-blend-mode: multiply;
`;

const KyotoTitle = styled.div`
font-size:24px;
font-weight:600;
color:white;
position:absolute;
top:20px;
left:20px;
`;

const ThridVerticalBlock = styled.div`
width:19vw;
height:430px;
display:flex;
flex-direction:column;
gap:15px;
`;

const ThridVerticalBlockUpperPart = styled.div`
width:19vw;
height:172px;
display:flex;
gap:15px;
`;

const NewYork = styled.div`
position:relative;
border-radius:10px;
background-position: center;
width:7.7vw;
height:172px;
background-image: url(${NewYorkSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
`;

const NewYorkTitle = styled.div`
font-size:13px;
font-weight:600;
color:white;
position:absolute;
top:10px;
right:12px;
`;

const CamBridge = styled.div`
position:relative;
border-radius:10px;
background-position: center;
width:11.3vw;
height:172px;
background-image: url(${CamBridgeSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0);
background-blend-mode: multiply;
`;

const CamBridgeTitle = styled.div`
font-size:16px;
font-weight:600;
color:white;
position:absolute;
bottom:10px;
left:10px;
`;

const Amsterdam = styled.div`
position:relative;
border-radius:10px;
background-position: center;
width:19vw;
height:258px;
background-image: url(${AmsterdamSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.25);
background-blend-mode: multiply;
`;

const AmsterdamTitle = styled.div`
position:absolute;
font-size:22px;
font-weight:600;
color:white;
position:absolute;
bottom:15px;
left:15px;
`;

const FourthVerticalBlock = styled.div`
position:relative;
border-radius:10px;
width:18vw;
height:430px;
background-position: center;
background-image: url(${ParisSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.1);
background-blend-mode: multiply;
`;

const ParisTitle = styled.div`
font-size:26px;
font-weight:600;
color:white;
position:absolute;
bottom:15px;
right:15px;
`;

const FifthVerticalBlock = styled.div`
width:15vw;
height:430px;
display:flex;
flex-direction:column;
gap:15px;
`;

const Mexico = styled.div`
position:relative;
border-radius:10px;
width:15vw;
height:245px;
background-position: center;
background-image: url(${MexicoSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
`;

const MexicoTitle = styled.div`
font-size:18px;
font-weight:550;
color:white;
position:absolute;
top:12px;
left:12px;
`;

const Egypt = styled.div`
position:relative;
border-radius:10px;
width:15vw;
height:185px;
background-position: center;
background-image: url(${EgyptSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.15);
background-blend-mode: multiply;
&:hover {
    transform: scale(1.2);
}`;

const EgyptTitle = styled.div`
font-size:16px;
font-weight:550;
color:white;
position:absolute;
bottom:12px;
left:18px;
`;

function CityAreaInHomePage() {
  console.log('我在CategoryPage');
  return (
    <CityAtHomeWrapper>
      <CityAtHomeWrapperTitle>城市探索</CityAtHomeWrapperTitle>
      <CityAtHomeBelowPart>
        <FirstVerticalBlock>
          <Tainan>
            <TainanTitle>台南</TainanTitle>
          </Tainan>
          <FirstVerticalBlockBelowPart>
            <Barcelona>
              <BarcelonaTitle>巴賽隆納</BarcelonaTitle>
            </Barcelona>
            <Provence>
              <ProvenceTitle>普羅旺斯</ProvenceTitle>
            </Provence>
          </FirstVerticalBlockBelowPart>
        </FirstVerticalBlock>
        <SecondVerticalBlcok>
          <KyotoTitle>
            京
            <br />
            都
          </KyotoTitle>
        </SecondVerticalBlcok>
        <ThridVerticalBlock>
          <ThridVerticalBlockUpperPart>
            <NewYork>
              <NewYorkTitle>
                紐
                <br />
                約
              </NewYorkTitle>
            </NewYork>
            <CamBridge>
              <CamBridgeTitle>劍橋</CamBridgeTitle>
            </CamBridge>
          </ThridVerticalBlockUpperPart>
          <Amsterdam>
            <AmsterdamTitle>阿姆斯特丹</AmsterdamTitle>
          </Amsterdam>
        </ThridVerticalBlock>
        <FourthVerticalBlock>
          <ParisTitle>巴黎</ParisTitle>
        </FourthVerticalBlock>
        <FifthVerticalBlock>
          <Mexico>
            <MexicoTitle>墨西哥城</MexicoTitle>
          </Mexico>
          <Egypt>
            <EgyptTitle>開羅</EgyptTitle>
          </Egypt>
        </FifthVerticalBlock>
      </CityAtHomeBelowPart>
    </CityAtHomeWrapper>
  );
}

export default CityAreaInHomePage;
