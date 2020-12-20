import React from 'react';
import '../styles/Food.css';

const Food = ({ top, left }) => {
  let color = `food b${Math.floor(Math.random() * 4)}`;
  return (
    <div
      style={{ top: top + "px", left: left + "px" }}
      className={color}
    />
  );
}

export default Food;