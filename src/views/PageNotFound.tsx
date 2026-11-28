import { Link } from '@/lib/router';
import tw from '@/lib/tw';

const PageWrapper = tw.div`
  w-full h-[100vh] bg-[url(/images/404.svg)] bg-cover bg-no-repeat bg-center
  cursor-pointer
`;

function PageNotFound() {
  return (
    <Link to="/">
      <PageWrapper />
    </Link>
  );
}

export default PageNotFound;
