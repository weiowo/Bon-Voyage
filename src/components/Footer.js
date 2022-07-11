import styled from 'styled-components/macro';

const FooterComponent = styled.div`
width:100vw;
height:60px;
background-color:#a9a9a9;
color:white;
font-weight:600;
display:flex;
align-items:center;
justify-content:center;
font-size:12px;
`;

function Footer() {
  return (
    <FooterComponent>
      Copyright © 2022-forever Weiwei 版權所有
    </FooterComponent>
  );
}

export default Footer;
