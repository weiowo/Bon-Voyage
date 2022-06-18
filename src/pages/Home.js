import { Link } from 'react-router-dom';

function CTA() {
  return (
    <button type="button">
      <Link to="/my-schedules">
        我的行程
      </Link>
    </button>
  );
}

export default CTA;
