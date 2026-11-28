import { Link } from '@/lib/router';
import tw from '@/lib/tw';

const MyArticle = tw.div`
  cursor-pointer w-[190px] h-[250px] shrink-0 rounded-[10px]
  [box-shadow:0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)]
  max-[1201px]:w-[160px] max-[1201px]:h-[200px] max-[451px]:w-[160px] max-[451px]:h-[200px]
`;

export const CoverPhotoInMyArticle = tw.img`
  w-full h-[50%] [border-top-right-radius:10px] [border-top-left-radius:10px] object-cover
`;

export const MyArticleBelowArea = tw.div`
  w-[80%] h-auto flex flex-col items-center ml-[15px] mt-[10px] mr-[15px]
`;

export const MyArticleTitle = tw.div`
  w-full h-[30px] [font-weight:550] text-[16px] text-left
`;

export const MyArticleSummary = tw.div`
  w-full h-[30px] text-[13px] text-left font-medium [color:grey]
`;

export const StyledLink = tw(Link)`
  cursor-pointer [text-decoration:none] text-black [border:none]
`;

export const ArticleTitleAndDeleteIcon = tw.div`
  w-full h-auto flex justify-between
`;

export default MyArticle;
