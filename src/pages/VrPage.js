/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectCoverflow, Pagination, Navigation } from 'swiper/core';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import 'swiper/components/effect-coverflow/effect-coverflow.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/navigation/navigation.min.css';
import './style.css';
import angkorWat from './images/Angkor_Wat.jpeg';
import bacelona from './images/bacelona.jpeg';
import japan from './images/japan.jpeg';
import machuPichu from './images/Machu_Picchu.jpeg';
import mountRushmore from './images/Mount_Rushmore.jpeg';
import paris from './images/paris.jpeg';
import pyramid from './images/pyramid.jpeg';
import rio from './images/rio.jpeg';
import rome from './images/rome.jpeg';

const photoArray = [angkorWat, bacelona,
  japan, machuPichu, mountRushmore, paris, pyramid, rio, rome];

const placeNameArray = ['吳哥窟', '聖家堂 ',
  '伏見稻荷大社', '馬丘比丘', '山', '巴黎鐵塔', '金字塔', '里約特內盧', '羅馬競技場'];

const placeNameEnglishArray = ['Angkor Wat', 'Sangria',
  'Temple', 'Machu Pichu', 'Mount Rushmore', 'Eiffel Tower', 'Giza Pyramid', 'Mount', 'Collesium'];

const placeCountryeNameArray = ['Cambodia', 'Spain',
  'Japan', 'Peru', 'USA', 'France', 'Egypt', 'Brazil', 'Italy'];

const PlaceBox = styled.div`
width:100%;
height:100%;
border-radius:5px;

// background-image: url(${photoArray[1]});
cursor:pointer;
background-size:cover;
background-repeat: no-repeat;
background-color: rgb(0, 0, 0, 0.15);
background-blend-mode: multiply;
// background: linear-gradient(#3204fdba, #9907facc), url(${japan}) no-repeat cover;
`;

const PlaceTitle = styled.div`
position:absolute;
left:15px;
top:12px;
font-size:20px;
font-weight:600;
color:white;
text-shadow:1px 1px 2px black;
`;

const PlaceCountryTitle = styled.div`
position:absolute;
right:15px;
bottom:12px;
font-size:26px;
font-weight:600;
color:white;
text-shadow:1px 1px 2px black;
`;

const PlaceEngishTitle = styled.div`
position:absolute;
left:15px;
top:40px;
font-size:16px;
font-weight:600;
color:#F4E6D3;
text-shadow:1px 1px 2px black;
`;

SwiperCore.use([EffectCoverflow, Pagination, Navigation]);

function VR() {
  return (
    <div className="container">
      <div className="title_wrapper">
        <div className="title_">
          With VR, The world is just in front of you!
        </div>
      </div>
      <Swiper
        navigation
        effect="coverflow"
        centeredSlides
        slidesPerView={window.innerWidth < 768 ? 1 : 'auto'}
        loop
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        {Array(9).fill('').map((item, index) => (
          <SwiperSlide style={{ cursor: 'pointer' }}>
            <PlaceBox style={{ backgroundImage: `url(${photoArray[index]})` }}>
              <PlaceTitle>{placeNameArray[index]}</PlaceTitle>
              <PlaceEngishTitle>{placeNameEnglishArray[index]}</PlaceEngishTitle>
              <PlaceCountryTitle>{placeCountryeNameArray[index]}</PlaceCountryTitle>
            </PlaceBox>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default VR;

// https://www.google.com.tw/maps/place/%E5%90%89%E8%96%A9%E9%87%91%E5%AD%97%E5%A1%94/@29.9781206,31.1356161,3a,75y,278.58h,96.1t/data=!3m8!1e1!3m6!1sAF1QipNCyOBNckTjHzRNqyZkTRMPeBzjWAqeRnP42CGw!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipNCyOBNckTjHzRNqyZkTRMPeBzjWAqeRnP42CGw%3Dw203-h100-k-no-pi-14.067524-ya292.68488-ro-0-fo100!7i6912!8i3456!4m11!1m2!2m1!1spyramid+egypt!3m7!1s0x14584f7de239bbcd:0xca7474355a6e368b!8m2!3d29.9772962!4d31.1324955!14m1!1BCgIgARICCAI!15sCg1weXJhbWlkIGVneXB0Wg8iDXB5cmFtaWQgZWd5cHSSARNhcmNoYWVvbG9naWNhbF9zaXRlmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJWTUZscVN6bDNSUkFC?hl=zh-TW
// 埃及
// https://www.google.com.tw/maps/@29.9750375,31.1379389,3a,75y,300.97h,111.27t/data=!3m8!1e1!3m6!1sAF1QipM2i-bm9uaGP0nLNERM3IohR7o70spzUdseiE0c!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipM2i-bm9uaGP0nLNERM3IohR7o70spzUdseiE0c%3Dw203-h100-k-no-pi-16.993568-ya359.88745-ro-0-fo100!7i11264!8i5632?hl=zh-TW

// 羅馬競技場

// "https://www.google.com/maps/embed?pb=!4v1657295616580!6m8!1m7!1sCAoSLEFGMVFpcE1tUW9pLXRLWUk1cmlpQThDdVJTRHZRMm9tSXZUclNqQU9zN3BV!2m2!1d-13.1631412!2d-72.5449629!3f1.1303636265603814!4f-1.0055196214812838!5f1.198741190102146"

// https://www.google.com.tw/maps/place/%E7%BE%85%E9%A6%AC%E7%AB%B6%E6%8A%80%E5%A0%B4/@41.8902102,12.4922309,3a,75y,354h,92.63t/data=!3m8!1e1!3m6!1sAF1QipN9iVwZG351pQPQjfmQRvO3ADKTiOl3aVe2q6lK!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipN9iVwZG351pQPQjfmQRvO3ADKTiOl3aVe2q6lK%3Dw203-h100-k-no-pi-8.102894-ya359.88745-ro0-fo100!7i5760!8i2880!4m11!1m2!2m1!1srome+Colosseo!3m7!1s0x132f61b6532013ad:0x28f1c82e908503c4!8m2!3d41.8902102!4d12.4922309!14m1!1BCgIgARICCAI!15sCg1yb21lIENvbG9zc2VvWg8iDXJvbWUgY29sb3NzZW-SARNoaXN0b3JpY2FsX2xhbmRtYXJrmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU5WZUMxVFUwSjNFQUU?hl=zh-TW
// https://www.google.com.tw/maps/place/%E7%BE%85%E9%A6%AC%E7%AB%B6%E6%8A%80%E5%A0%B4/@41.8900233,12.4920153,3a,75y,352.06h,111.43t/data=!3m8!1e1!3m6!1sAF1QipMljrRx3q164SuTNMQxIb1eUg7no7wpA0gkdo7X!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMljrRx3q164SuTNMQxIb1eUg7no7wpA0gkdo7X%3Dw203-h100-k-no-pi-22.50804-ya349.98392-ro-0-fo100!7i8704!8i4352!4m11!1m2!2m1!1srome+Colosseo!3m7!1s0x132f61b6532013ad:0x28f1c82e908503c4!8m2!3d41.8902102!4d12.4922309!14m1!1BCgIgARICCAI!15sCg1yb21lIENvbG9zc2VvWg8iDXJvbWUgY29sb3NzZW-SARNoaXN0b3JpY2FsX2xhbmRtYXJrmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU5WZUMxVFUwSjNFQUU?hl=zh-TW

// 吳哥窟
// https://www.google.com.tw/maps/place/%E5%90%B3%E5%93%A5%E7%AA%9F/@13.4124693,103.8669857,3a,75y,231.65h,132.9t/data=!3m8!1e1!3m6!1sAF1QipPQQoaugOQNo6f-cqEV6mQrFKSLR6VBSfKSnTg!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPQQoaugOQNo6f-cqEV6mQrFKSLR6VBSfKSnTg%3Dw224-h298-k-no-pi-16.435272-ya345.2533-ro0-fo100!7i6000!8i3000!4m7!3m6!1s0x3110168aea9a272d:0x3eaba81157b0418d!8m2!3d13.4124693!4d103.8669857!14m1!1BCgIgARICCAI?hl=zh-TW

// 阿根廷冰河國家公園
// https://www.google.com.tw/maps/place/%E5%86%B0%E5%B7%9D%E5%9C%8B%E5%AE%B6%E5%85%AC%E5%9C%92/@-49.2782402,-72.987236,3a,75y,207.4h,81.32t/data=!3m8!1e1!3m6!1sAF1QipOm4sIVWDIACW-AMUQiSJPPpNQphcXHyq6Yw7UG!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOm4sIVWDIACW-AMUQiSJPPpNQphcXHyq6Yw7UG%3Dw203-h100-k-no-pi-9.643528-ya356.6604-ro-0-fo100!7i8704!8i4352!4m7!3m6!1s0xbda4b22859519255:0xe65dad69a4f0d1dd!8m2!3d-50.3305556!4d-73.2341667!14m1!1BCgIgARICCAI?hl=zh-TW

// 里約熱內盧基督像
// https://www.google.com.tw/maps/place/%E9%87%8C%E7%B4%84%E7%86%B1%E5%85%A7%E7%9B%A7%E5%9F%BA%E7%9D%A3%E5%83%8F/@-22.9511126,-43.209472,3a,75y,272.16h,115.96t/data=!3m8!1e1!3m6!1sAF1QipMqlAh8IQxVXn9wGPQvHZ-Vnt8xvMaJEyDSPUKI!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMqlAh8IQxVXn9wGPQvHZ-Vnt8xvMaJEyDSPUKI%3Dw224-h298-k-no-pi-0-ya47.563538-ro-0-fo100!7i13312!8i6656!4m7!3m6!1s0x997fd5984aa13f:0x9dc984d7019502de!8m2!3d-22.951916!4d-43.2104872!14m1!1BCgIgARICCAI?hl=zh-TW

// 艾非爾鐵塔
// https://www.google.com.tw/maps/place/%E8%89%BE%E8%8F%B2%E7%88%BE%E9%90%B5%E5%A1%94/@48.8583701,2.2944813,3a,75y,23.43h,128.29t/data=!3m8!1e1!3m6!1sAF1QipPMkr2R5rWFEtyFSP19ofBgJpq2Tfd501Stp9z5!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPMkr2R5rWFEtyFSP19ofBgJpq2Tfd501Stp9z5%3Dw203-h100-k-no-pi0-ya0-ro0-fo100!7i6080!8i3040!4m7!3m6!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813!14m1!1BCgIgARICCAI?hl=zh-TW
// https://www.google.com.tw/maps/place/%E8%89%BE%E8%8F%B2%E7%88%BE%E9%90%B5%E5%A1%94/@48.8596148,2.2950967,3a,75y,205.41h,128.24t/data=!3m8!1e1!3m6!1sAF1QipPUry_uA6SZQjIugwGkIatJW88TZCh9v7swT5Da!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPUry_uA6SZQjIugwGkIatJW88TZCh9v7swT5Da%3Dw203-h100-k-no-pi-20-ya14.000004-ro-0-fo100!7i6144!8i3072!4m7!3m6!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813!14m1!1BCgIgARICCAI?hl=zh-TW
// https://www.google.com.tw/maps/place/%E8%89%BE%E8%8F%B2%E7%88%BE%E9%90%B5%E5%A1%94/@48.8553422,2.2989991,3a,69.9y,184.53h,102.93t/data=!3m8!1e1!3m6!1sAF1QipPWASA98CqqlS4uOHFmfvSQ4te7RamazQsqvDRV!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPWASA98CqqlS4uOHFmfvSQ4te7RamazQsqvDRV%3Dw203-h100-k-no-pi-11.369606-ya353.80862-ro0-fo100!7i7000!8i3500!4m7!3m6!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813!14m1!1BCgIgARICCAI?hl=zh-TW

// 聖家堂
// https://www.google.com.tw/maps/place/%E8%81%96%E5%AE%B6%E5%A0%82/@41.4031964,2.1737517,3a,75y,346.84h,117.97t/data=!3m8!1e1!3m6!1sAF1QipMa3RNMdLRnbRJ1P17sHcvPcDMEqVHHEc2zmJSm!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMa3RNMdLRnbRJ1P17sHcvPcDMEqVHHEc2zmJSm%3Dw203-h100-k-no-pi-30.000002-ya4.2401505-ro-0-fo100!7i5376!8i2688!4m11!1m2!2m1!1z5be06LO96ZqG57SN5pWZ5aCC!3m7!1s0x12a4a2dcd83dfb93:0x9bd8aac21bc3c950!8m2!3d41.4036299!4d2.1743558!14m1!1BCgIgARICCAI!15sChLlt7Tos73pmobntI3mlZnloIJaGCIW5be0IOizvSDpmoYg57SNIOaVmeWggpIBCGJhc2lsaWNhmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU5WYVY5aGFVeG5FQUU?hl=zh-TW

// 尼加拉瓜
// https://www.google.com.tw/maps/place/%E5%B0%BC%E4%BA%9E%E5%8A%A0%E6%8B%89%E7%80%91%E5%B8%83%E5%B7%9E%E7%AB%8B%E5%85%AC%E5%9C%92/@43.0837674,-79.0639941,3a,75y,177.77h,108.76t/data=!3m8!1e1!3m6!1sAF1QipO_Yf_imjqPEQyK5iAB6yK3VtDw71rppZVUA6bt!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipO_Yf_imjqPEQyK5iAB6yK3VtDw71rppZVUA6bt%3Dw203-h100-k-no-pi-30.000002-ya183.93996-ro0-fo100!7i5660!8i2830!4m7!3m6!1s0x89d342e2ed27a75d:0xd556b548abcc0817!8m2!3d43.0834256!4d-79.06434!14m1!1BCgIgARICCAI?hl=zh-TW

// 泰姬瑪哈
// https://www.google.com.tw/maps/place/%E6%B3%B0%E5%A7%AC%E7%91%AA%E5%93%88%E9%99%B5/@27.1742143,78.0420098,3a,75y,0.79h,123.07t/data=!3m8!1e1!3m6!1sAF1QipOYuOIxBwdgTstcxSTOHH1wf-GRutnVxwOFw3FO!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOYuOIxBwdgTstcxSTOHH1wf-GRutnVxwOFw3FO%3Dw224-h298-k-no-pi-19.13696-ya334.5366-ro-0-fo100!7i4608!8i2304!4m7!3m6!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422!14m1!1BCgIgARICCAI?hl=zh-TW
// https://www.google.com.tw/maps/place/%E6%B3%B0%E5%A7%AC%E7%91%AA%E5%93%88%E9%99%B5/@27.1751269,78.0420541,3a,75y,353.66h,95.96t/data=!3m8!1e1!3m6!1sAF1QipM5eGWheh1J7TKknxuvw0j4ydsQN0eL1yY9byhV!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipM5eGWheh1J7TKknxuvw0j4ydsQN0eL1yY9byhV%3Dw203-h100-k-no-pi-6.6376433-ya341.38223-ro0.32461366-fo100!7i8960!8i4480!4m7!3m6!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422!14m1!1BCgIgARICCAI?hl=zh-TW

// 瑪雅金字塔
// https://www.google.com.tw/maps/place/%E5%8D%A1%E6%96%AF%E8%92%82%E7%95%A5%E9%87%91%E5%AD%97%E5%A1%94/@20.6835125,-88.56918,3a,75y,357.41h,97.99t/data=!3m8!1e1!3m6!1sAF1QipOL2O2RpuOQgArQOmyI5v17AEz-9_vPPMSvm1OT!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOL2O2RpuOQgArQOmyI5v17AEz-9_vPPMSvm1OT%3Dw203-h100-k-no-pi-11.25402-ya346.72025-ro-0-fo100!7i9728!8i4864!4m7!3m6!1s0x8f5138b88e232523:0x1ef4200c7824ddf!8m2!3d20.6829859!4d-88.5686491!14m1!1BCgIgARICCAI?hl=zh-TW

// 伏見稻荷
// https://www.google.com.tw/maps/place/%E4%BC%8F%E8%A6%8B%E7%A8%BB%E8%8D%B7%E5%A4%A7%E7%A4%BE/@34.9671402,135.7726717,3a,75y,354.83h,79.17t/data=!3m8!1e1!3m6!1sAF1QipOhZDyGyI-UFdcmVonSThXhStZN2C6cCh7tKE7L!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOhZDyGyI-UFdcmVonSThXhStZN2C6cCh7tKE7L%3Dw203-h100-k-no-pi-14.738657-ya349.71097-ro-2.3594007-fo100!7i5376!8i2688!4m5!3m4!1s0x60010f153d2e6d21:0x7b1aca1c753ae2e9!8m2!3d34.9671402!4d135.7726717?hl=zh-TW

// 羚羊峽谷
// https://www.google.com.tw/maps/place/%E7%BE%9A%E7%BE%8A%E5%B3%BD%E8%B0%B7/@36.9352201,-111.4245015,3a,75y,4.34h,91.01t/data=!3m8!1e1!3m6!1sAF1QipOp5zYnHvuVzKNFoX0zusp5iqVy96pbEBeH9mae!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOp5zYnHvuVzKNFoX0zusp5iqVy96pbEBeH9mae%3Dw203-h100-k-no-pi-10-ya166-ro0-fo100!7i11264!8i5632!4m7!3m6!1s0x873411f49ba00e0b:0x98361608ad6aa79b!8m2!3d36.8619103!4d-111.3743302!14m1!1BCgIgARICCAI?hl=zh-TW

// 總統山
// https://www.google.com.tw/maps/place/%E6%8B%89%E4%BB%80%E8%8E%AB%E7%88%BE%E5%B1%B1/@43.8791025,-103.4590667,3a,66.8y,344.04h,120.96t/data=!3m8!1e1!3m6!1sAF1QipOwS3Hfu21inJ8ZNOxeMiBpCZxgD0rYX0vRIYw8!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOwS3Hfu21inJ8ZNOxeMiBpCZxgD0rYX0vRIYw8%3Dw203-h100-k-no-pi-17.10611-ya13.054676-ro-0-fo100!7i8704!8i4352!4m7!3m6!1s0x877d35d8b53ed6df:0xdaf53dbe055cc641!8m2!3d43.8791025!4d-103.4590667!14m1!1BCgIgARICCAI?hl=zh-TW
