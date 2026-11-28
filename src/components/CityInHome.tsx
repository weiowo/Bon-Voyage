import React from 'react';
import { Link } from '@/lib/router';
import tw from '@/lib/tw';

const CityAtHomeWrapper = tw.div`
  mt-[45px] w-full h-[520px] flex flex-col items-center overflow-x-clip max-tablet:h-[850px]
  max-mobile-lg:h-[740px]
`;

const CityAtHomeWrapperTitle = tw.div`
  w-full h-[30px] flex justify-center items-center text-[24px] font-semibold
  text-[#1F456E] mb-[60px] max-tablet:text-[25px] max-tablet:mb-[30px]
`;

const CityAtHomeBelowPart = tw.div`
  w-full h-auto flex flex-row justify-center gap-[10px] max-tablet:flex-col
  max-tablet:gap-[15px]
`;

const SmallScreenCity = tw.div`
  w-[50%] flex gap-[15px] max-tablet:w-full max-tablet:flex max-tablet:justify-center
  max-tablet:gap-[15px]
`;

const FirstVerticalBlock = tw.div`
  w-[33.5vw] h-[430px] flex flex-col gap-[15px] max-tablet:w-[60vw] max-tablet:h-[380px]
  max-mobile-lg:h-[330px]
`;

const TainanWrapper = tw.div`
  relative w-[33.5vw] h-[290px] overflow-hidden rounded-[10px] max-tablet:w-[60vw]
`;

const Tainan = tw.div`
  absolute bg-center rounded-[10px] w-full h-full bg-[url(/images/tainan.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.25)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.2)]
`;

const TainanTitle = tw.div`
  text-[30px] font-bold text-white absolute bottom-[20px] left-[20px]
`;

const FirstVerticalBlockBelowPart = tw.div`
  w-[33.5vw] h-[140px] flex gap-[15px] max-tablet:w-[60vw]
`;

const BarcelonaWrapper = tw.div`
  relative w-[13vw] h-[140px] overflow-hidden rounded-[10px] max-tablet:w-[20vw]
`;

const Barcelona = tw.div`
  relative rounded-[10px] bg-center w-full h-full bg-[url(/images/barcelona.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.2)] max-tablet:w-[20vw]
`;

const BarcelonaTitle = tw.div`
  text-[18px] font-semibold text-white absolute top-[12px] left-[12px]
`;

const ProvenceWrapper = tw.div`
  relative w-[20vw] h-[140px] overflow-hidden rounded-[10px] max-tablet:w-[40vw]
`;

const Provence = tw.div`
  relative rounded-[10px] bg-center w-[20vw] h-[140px] bg-[url(/images/provence.png)]
  bg-cover bg-no-repeat bg-[rgb(0,0,0,0.1)] [background-blend-mode:multiply]
  [transition:0.8s] hover:[transform:scale(1.2)] max-tablet:w-[40vw]
`;

const ProvenceTitle = tw.div`
  text-[18px] font-semibold text-white absolute bottom-[12px] right-[12px]
`;

const SecondVerticalBlcokWrapper = tw.div`
  relative w-[14.5vw] h-[430px] overflow-hidden rounded-[10px] max-tablet:w-[40vw]
  max-tablet:h-[380px] max-mobile-lg:h-[330px]
`;

const SecondVerticalBlcok = tw.div`
  absolute rounded-[10px] bg-center w-full h-full bg-[url(/images/kyoto.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.1)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.2)]
`;

const KyotoTitle = tw.div`
  text-[24px] font-semibold text-white absolute top-[20px] left-[20px]
`;

const ThridVerticalBlock = tw.div`
  w-[19vw] h-[430px] flex flex-col gap-[15px] max-tablet:w-[40vw] max-tablet:h-[380px]
  max-mobile-lg:h-[330px]
`;

const ThridVerticalBlockUpperPart = tw.div`
  w-[19vw] h-[172px] flex gap-[15px] max-tablet:w-[40vw] max-mobile-lg:w-[52vw]
`;

const NewYorkWrapper = tw.div`
  relative w-[7.7vw] h-[172px] overflow-hidden rounded-[10px] max-tablet:w-[21vw]
`;

const NewYork = tw.div`
  absolute rounded-[10px] bg-center w-full h-full bg-[url(/images/newyork.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.2)]
`;

const NewYorkTitle = tw.div`
  text-[13px] font-semibold text-white absolute top-[10px] right-[12px]
`;

const CamBridgeWrapper = tw.div`
  relative w-[11.3vw] h-[172px] overflow-hidden rounded-[10px] max-tablet:w-[25vw]
  max-mobile-lg:w-[31vw]
`;

const CamBridge = tw.div`
  absolute rounded-[10px] bg-center w-full h-full bg-[url(/images/cambridge.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.2)]
`;

const CamBridgeTitle = tw.div`
  text-[16px] font-semibold text-white absolute bottom-[10px] left-[10px]
`;

const AmsterdamWrapper = tw.div`
  relative w-[19vw] h-[258px] overflow-hidden rounded-[10px] max-tablet:w-[40vw]
  max-mobile-lg:w-[52vw]
`;

const Amsterdam = tw.div`
  absolute rounded-[10px] bg-center w-full h-full bg-[url(/images/amsterdam.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.25)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.2)]
`;

const AmsterdamTitle = tw.div`
  text-[22px] font-semibold text-white absolute bottom-[15px] left-[15px]
`;

const FourthVerticalBlockWrapper = tw.div`
  relative w-[18vw] h-[430px] overflow-hidden rounded-[10px] max-tablet:w-[25vw]
  max-tablet:h-[380px]
`;

const FourthVerticalBlock = tw.div`
  absolute rounded-[10px] w-full h-full bg-center bg-[url(/images/paris_2.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.1)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.1)] max-mobile-lg:hidden
`;

const ParisTitle = tw.div`
  text-[26px] font-semibold text-white absolute bottom-[15px] right-[15px]
  max-mobile-lg:hidden
`;

const FifthVerticalBlock = tw.div`
  w-[15vw] h-[430px] flex flex-col gap-[15px] max-tablet:w-[35vw] max-tablet:h-[380px]
  max-mobile-lg:w-[45vw] max-mobile-lg:h-[330px]
`;

const MexicoWrapper = tw.div`
  relative w-[15vw] h-[245px] overflow-hidden rounded-[10px] max-tablet:w-[35vw]
  max-mobile-lg:w-[45vw]
`;

const Mexico = tw.div`
  absolute rounded-[10px] w-full h-full bg-center bg-[url(/images/mexico.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.2)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.1)]
`;

const MexicoTitle = tw.div`
  text-[18px] [font-weight:550] text-white absolute top-[12px] left-[12px]
`;

const EgyptWrapper = tw.div`
  relative w-[15vw] h-[185px] overflow-hidden rounded-[10px] max-tablet:w-[35vw]
  max-mobile-lg:w-[45vw] max-mobile-lg:h-[185px]
`;

const Egypt = tw.div`
  absolute rounded-[10px] w-full h-full bg-center bg-[url(/images/egypt.webp)] bg-cover
  bg-no-repeat bg-[rgb(0,0,0,0.15)] [background-blend-mode:multiply] [transition:0.8s]
  hover:[transform:scale(1.2)]
`;

const EgyptTitle = tw.div`
  text-[16px] [font-weight:550] text-white absolute bottom-[12px] left-[18px]
`;

function CityAreaInHomePage() {
  return (
    <CityAtHomeWrapper>
      <CityAtHomeWrapperTitle>城市探索</CityAtHomeWrapperTitle>
      <CityAtHomeBelowPart>
        <SmallScreenCity>
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
        </SmallScreenCity>
        <SmallScreenCity>

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
        </SmallScreenCity>
      </CityAtHomeBelowPart>
    </CityAtHomeWrapper>
  );
}
export default CityAreaInHomePage;
