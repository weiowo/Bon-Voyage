// 在首頁按下種類的時候，會把種類跟使用者所在位置的經緯度紀錄
// 接著到category頁面執行相關搜尋
// 不同的種類上面的banner可以不一樣
import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
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
margin-top:45px;
width:100vw;
height:520px;
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
@media screen and (max-width:800px){
  font-size:30px;
}`;

const CityAtHomeBelowPart = styled.div`
width:100vw;
height:auto;
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

const TainanWrapper = styled.div`
position:relative;
width:33vw;
height:290px;
overflow:hidden;
border-radius:10px;
`;

const Tainan = styled.div`
position:absolute;
background-position: center;
border-radius:10px;
width:100%;
height:100%;
background-image: url(${TainanSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.25);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.2);
}
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

const BarcelonaWrapper = styled.div`
position:relative;
width:13vw;
height:140px;
overflow:hidden;
border-radius:10px;
`;

const Barcelona = styled.div`
position:relative;
border-radius:10px;
background-position: center;
width:100%;
height:100%;
background-image: url(${BarcelonaSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.2);
}
`;

const BarcelonaTitle = styled.div`
font-size:18px;
font-weight:600;
color:white;
position:absolute;
top:12px;
left:12px;
`;

const ProvenceWrapper = styled.div`
position:relative;
width:20vw;
height:140px;
overflow:hidden;
border-radius:10px;
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
transition:0.8s;
&:hover {
    transform: scale(1.2);
}
`;

const ProvenceTitle = styled.div`
font-size:18px;
font-weight:600;
color:white;
position:absolute;
bottom:12px;
right:12px;
`;

const SecondVerticalBlcokWrapper = styled.div`
position:relative;
width:14vw;
height:430px;
overflow:hidden;
border-radius:10px;
`;

const SecondVerticalBlcok = styled.div`
position:absolute;
border-radius:10px;
background-position: center;
width:100%;
height:100%;
background-image: url(${KyotoSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.1);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.2);
}
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

const NewYorkWrapper = styled.div`
position:relative;
width:7.7vw;
height:172px;
overflow:hidden;
border-radius:10px;
`;

const NewYork = styled.div`
position:absolute;
border-radius:10px;
background-position: center;
width:100%;
height:100%;
background-image: url(${NewYorkSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.2);
}
`;

const NewYorkTitle = styled.div`
font-size:13px;
font-weight:600;
color:white;
position:absolute;
top:10px;
right:12px;
`;

const CamBridgeWrapper = styled.div`
position:relative;
width:11.3vw;
height:172px;
overflow:hidden;
border-radius:10px;
`;

const CamBridge = styled.div`
position:absolute;
border-radius:10px;
background-position: center;
width:100%;
height:100%;
background-image: url(${CamBridgeSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.2);
}
`;

const CamBridgeTitle = styled.div`
font-size:16px;
font-weight:600;
color:white;
position:absolute;
bottom:10px;
left:10px;
`;

const AmsterdamWrapper = styled.div`
position:relative;
width:19vw;
height:258px;
overflow:hidden;
border-radius:10px;
`;

const Amsterdam = styled.div`
position:absolute;
border-radius:10px;
background-position: center;
width:100%;
height:100%;
background-image: url(${AmsterdamSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.25);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.2);
}
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

const FourthVerticalBlockWrapper = styled.div`
position:relative;
width:18vw;
height:430px;
overflow:hidden;
border-radius:10px;
`;

const FourthVerticalBlock = styled.div`
position:absolute;
border-radius:10px;
width:100%;
height:100%;
background-position: center;
background-image: url(${ParisSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.1);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.1);
}
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

const MexicoWrapper = styled.div`
position:relative;
width:15vw;
height:245px;
overflow:hidden;
border-radius:10px;
`;

const Mexico = styled.div`
position:absolute;
border-radius:10px;
width:100%;
height:100%;
background-position: center;
background-image: url(${MexicoSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.2);
background-blend-mode: multiply;
transition:0.8s;
&:hover {
    transform: scale(1.1);
}
`;

const MexicoTitle = styled.div`
font-size:18px;
font-weight:550;
color:white;
position:absolute;
top:12px;
left:12px;
`;

const EgyptWrapper = styled.div`
position:relative;
width:15vw;
height:185px;
overflow:hidden;
border-radius:10px;
`;

const Egypt = styled.div`
position:absolute;
border-radius:10px;
width:100%;
height:100%;
background-position: center;
background-image: url(${EgyptSrc});
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.15);
background-blend-mode: multiply;
transition:0.8s;
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
          <TainanWrapper>
            <Link to="/city?lat=22.9948212&lng=120.1964522&city=中西區&option=all">

              <Tainan />
              <TainanTitle>台南</TainanTitle>
            </Link>

          </TainanWrapper>

          <FirstVerticalBlockBelowPart>
            <BarcelonaWrapper>
              <Link to="/city?lat=41.3873974&lng=2.168568&city=巴塞隆拿&option=all">
                <Barcelona />
                <BarcelonaTitle>巴賽隆納</BarcelonaTitle>
              </Link>
            </BarcelonaWrapper>

            <ProvenceWrapper>
              <Link to="/city?lat=43.529742&lng=5.447426999999999&city=普羅旺斯艾克斯&option=all">
                <Provence />
                <ProvenceTitle>普羅旺斯</ProvenceTitle>
              </Link>
            </ProvenceWrapper>

          </FirstVerticalBlockBelowPart>

        </FirstVerticalBlock>

        <SecondVerticalBlcokWrapper>
          <Link to="/city?lat=35.011564&lng=135.7681489&city=京都市&option=all">

            <SecondVerticalBlcok />
            <KyotoTitle>
              京
              <br />
              都
            </KyotoTitle>
          </Link>

        </SecondVerticalBlcokWrapper>

        <ThridVerticalBlock>
          <ThridVerticalBlockUpperPart>
            <NewYorkWrapper>
              <Link to="/city?lat=40.7127753&lng=-74.0059728&city=紐約&option=all">

                <NewYork />
                <NewYorkTitle>
                  紐
                  <br />
                  約
                </NewYorkTitle>
              </Link>

            </NewYorkWrapper>

            <CamBridgeWrapper>
              <Link to="/city?lat=52.1950788&lng=0.1312729&city=劍橋&option=all">

                <CamBridge />
                <CamBridgeTitle>劍橋</CamBridgeTitle>
              </Link>

            </CamBridgeWrapper>

          </ThridVerticalBlockUpperPart>

          <AmsterdamWrapper>
            <Link to="/city?lat=52.3675734&lng=4.9041389&city=阿姆斯特丹&option=all">

              <Amsterdam />
              <AmsterdamTitle>阿姆斯特丹</AmsterdamTitle>
            </Link>

          </AmsterdamWrapper>

        </ThridVerticalBlock>

        <FourthVerticalBlockWrapper>
          <Link to="/city?lat=48.856614&lng=2.3522219&city=巴黎&option=all">

            <FourthVerticalBlock />
            <ParisTitle>巴黎</ParisTitle>
          </Link>

        </FourthVerticalBlockWrapper>

        <FifthVerticalBlock>
          <MexicoWrapper>
            <Link to="/city?lat=19.4326077&lng=-99.133208&city=墨西哥城&option=all">

              <Mexico />
              <MexicoTitle>墨西哥城</MexicoTitle>
            </Link>

          </MexicoWrapper>

          <EgyptWrapper>
            <Link to="/city?lat=30.0444196&lng=31.2357116&city=開羅&option=all">

              <Egypt />
              <EgyptTitle>開羅</EgyptTitle>
            </Link>

          </EgyptWrapper>

        </FifthVerticalBlock>
      </CityAtHomeBelowPart>
    </CityAtHomeWrapper>
  );
}
export default CityAreaInHomePage;
