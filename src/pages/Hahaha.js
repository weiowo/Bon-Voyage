/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import tripDays from './data';

function Drag() {
  const [dragId, setDragId] = useState();
  const [boxes, setBoxes] = useState(tripDays);
  console.log(boxes);

  const handleDrag = (e) => {
    setDragId(e.currentTarget.id);
  };

  const handleDrop = (e) => {
    const dragBox = boxes.find((box, index) => index === dragId);
    const dropBox = boxes.find((box, index) => index === e.currentTarget.id);
    console.log(dragId);
    console.log(e.currentTarget.id);

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const newBoxState = boxes.map((box, index) => {
      if (index === dragId) {
        box.order = dropBoxOrder;
      }
      if (index === e.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });
    setBoxes(newBoxState);
  };
  return (
    <div className="App">
      {boxes
        .sort((a, b) => a.order - b.order)
        .map((box, index) => (
          <div
            draggable
            id={index}
            onDragOver={(e) => e.preventDefault()}
            onDragStart={handleDrag}
            onDrop={handleDrop}
            style={{
              backgroundColor: box.color,
              border: '1px solid',
              borderColor: box.color,
              borderRadius: '5px',
              color: '#FFF',
              width: '30%',
              height: '100px',
            }}
          >
            {index}
          </div>
        ))}
    </div>
  );
}

export default Drag;
