/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

const items = [
  {
    icon: 'face',
    copy: '01. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }, {
    icon: 'pets',
    copy: '02. Sed do eiusmod tempor incididunt ut labore.',
  }, {
    icon: 'stars',
    copy: '03. Consectetur adipiscing elit.',
  }, {
    icon: 'invert_colors',
    copy: '04. Ut enim ad minim veniam, quis nostrud exercitation.',
  }, {
    icon: 'psychology',
    copy: '05. Llamco nisi ut aliquip ex ea commodo consequat.',
  }, {
    icon: 'brightness_7',
    copy: '06. Misi ut aliquip ex ea commodo consequat.',
  },
];

function Card(props) {
  return (
    <li className="card">
      <span className="material-icons">{props.icon}</span>
      <p>{props.copy}</p>
    </li>
  );
}

function Carousel() {
  const [moveClass, setMoveClass] = useState('');
  const [carouselItems, setCarouselItems] = useState(items);

  useEffect(() => {
    document.documentElement.style.setProperty('--num', carouselItems.length);
  }, [carouselItems]);

  const shiftPrev = (copy) => {
    const lastcard = copy.pop();
    copy.splice(0, 0, lastcard);
    setCarouselItems(copy);
  };

  const shiftNext = (copy) => {
    const firstcard = copy.shift();
    copy.splice(copy.length, 0, firstcard);
    setCarouselItems(copy);
  };

  const handleAnimationEnd = () => {
    if (moveClass === 'prev') {
      shiftNext([...carouselItems]);
    } else if (moveClass === 'next') {
      shiftPrev([...carouselItems]);
    }
    setMoveClass('');
  };

  return (
    <div className="carouselwrapper module-wrapper">
      <div className="ui">
        <button type="button" onClick={() => setMoveClass('next')} className="prev">
          <span className="material-icons">chevron_left</span>
        </button>
        <button type="button" onClick={() => setMoveClass('prev')} className="next">
          <span className="material-icons">chevron_right</span>
        </button>
      </div>
      <ul onAnimationEnd={handleAnimationEnd} className={`${moveClass} carousel`}>
        {carouselItems.map((t, index) => <Card key={t.copy + index} icon={t.icon} copy={t.copy} />)}
      </ul>
    </div>
  );
}

export default Carousel;
