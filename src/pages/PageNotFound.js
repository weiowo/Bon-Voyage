import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import PageNotFoundBanner from './images/404.svg';

const PageWrapper = styled.div`
width:100vw;
height:100vh;
background-image: url(${PageNotFoundBanner});
background-size:cover;
background-repeat: no-repeat;
background-position:center;
cursor:pointer;
`;

function PageNotFound() {
  return (
    <Link to="/">
      <PageWrapper />
    </Link>
  );
}

export default PageNotFound;
