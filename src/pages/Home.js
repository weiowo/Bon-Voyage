import { Link } from 'react-router-dom';

function CTA() {
  return (
    <button type="button">
      <Link to="/choose-date">
        建立行程
      </Link>
    </button>

  );
}

export default CTA;
