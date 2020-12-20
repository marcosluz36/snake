import React from 'react';
import '../styles/Score.css';

const Score = ({ score, highScore }) => {
  return (
    <div className="score">
      <span>
        Pontuação: <strong>{score}</strong>
      </span>
      <span>
        Maior pontuação: <strong>{highScore}</strong>
      </span>
    </div>
  );
}

export default Score;