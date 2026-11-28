import tw from '@/lib/tw';

const FooterComponent = tw.div`
  w-[100vw] h-[60px] bg-[#a9a9a9] text-white font-semibold flex items-center justify-center
  text-[12px] shrink-0 mt-[50px]
`;

function Footer() {
  return (
    <FooterComponent>
      Copyright © 2022-Forever Weiwei
    </FooterComponent>
  );
}

export default Footer;
