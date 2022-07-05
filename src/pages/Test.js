/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import tripDays from './data';

// const items = [
//   { number: '1', title: '🇦🇷 Argentina' },
//   { number: '2', title: '🤩 YASS' },
//   { number: '3', title: '👩🏼‍💻 Tech Girl' },
//   { number: '4', title: '💋 Lipstick & Code' },
//   { number: '5', title: '💃🏼 Latina' },
// ];

const initialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: [],
};

function Test() {
  const [list, setList] = useState(tripDays);
  const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);

  // onDragStart fires when an element
  // starts being dragged
  const onDragStart = (event) => {
    const initialPosition = Number(event.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      isDragging: true,
      originalOrder: list,
    });

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    event.dataTransfer.setData('text/html', '');
  };

  // onDragOver fires when an element being dragged
  // enters a droppable area.
  // In this case, any of the items on the list
  const onDragOver = (event) => {
    // in order for the onDrop
    // event to fire, we have
    // to cancel out this one
    event.preventDefault();

    let newList = dragAndDrop.originalOrder;

    // index of the item being dragged
    const { draggedFrom } = dragAndDrop;

    // index of the droppable area being hovered
    const draggedTo = Number(event.currentTarget.dataset.position);

    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter((item, index) => index !== draggedFrom);

    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];

    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo,
      });
    }
  };

  const onDrop = () => {
    setList(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
    });
  };

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  // Not needed, just for logging purposes:
  useEffect(() => {
    console.log('Dragged From: ', dragAndDrop && dragAndDrop.draggedFrom);
    console.log('Dropping Into: ', dragAndDrop && dragAndDrop.draggedTo);
  }, [dragAndDrop]);

  useEffect(() => {
    console.log('List updated!');
  }, [list]);

  return (
    <section>
      <ul>

        {list.map((item, index) => (
          <li
            key={index}
            data-position={index}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            className={dragAndDrop && dragAndDrop.draggedTo === Number(index) ? 'dropArea' : ''}
          >
            {/* <span>{item.number}</span> */}
            <p>{item.id}</p>
            <i className="fas fa-arrows-alt-v" />
          </li>
        ))}

      </ul>
    </section>
  );
}

export default Test;
