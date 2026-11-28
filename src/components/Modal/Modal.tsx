import type React from 'react';
import tw from '@/lib/tw';

const ModalBackground = tw.div<{ active?: boolean }>`
  w-[100vw] h-[100vh] fixed top-[0] bottom-[0] left-[0] right-[0] bg-[rgba(0,0,0,0.7)]
  justify-center items-center z-[100]
  ${(p) => (p.active ? 'flex' : 'hidden')}
`;

const ModalBox = tw.div<{ flexDirection?: React.CSSProperties['flexDirection'] }>`
  flex w-[50vw] h-[30vw] bg-white rounded-[20px] z-[200] relative items-center
  max-[1201px]:w-[600px] max-[1201px]:h-[370px] max-[631px]:w-[80vw] max-[631px]:h-[90vw]
  max-[631px]:flex-col max-[576px]:w-[80vw] max-[576px]:h-[110vw] max-[431px]:h-[120vw]
  ${(p) => (p.flexDirection === 'column' ? 'flex-col' : 'flex-row')}
`;

interface ModalProps {
  children?: React.ReactNode;
  active?: boolean;
  flexDirection?: React.CSSProperties['flexDirection'];
}

function Modal({ children = <div />, active = false, flexDirection = 'row' }: ModalProps) {
  return (
    <ModalBackground active={active}>
      <ModalBox flexDirection={flexDirection}>
        {children}
      </ModalBox>
    </ModalBackground>
  );
}

export default Modal;
