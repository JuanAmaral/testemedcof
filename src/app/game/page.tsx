"use client";

import { useEffect, useState } from "react";
import Card from "./card";

const initialCards = ["🍕", "🍔", "🍣", "🍩", "🍦", "🍇"];
const shuffledCards = [...initialCards, ...initialCards].sort(
  () => Math.random() - 0.5
);

export default function GamePage() {
  const [cards, setCards] = useState(shuffledCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matched]);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleClick = (index: number) => {
    if (
      flipped.length < 2 &&
      !flipped.includes(index) &&
      !matched.includes(index)
    ) {
      setFlipped((prev) => [...prev, index]);
      if (!startTime) setStartTime(Date.now());
    }
  };

  const resetGame = () => {
    const shuffled = [...initialCards, ...initialCards].sort(
      () => Math.random() - 0.5
    );
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setTime(0);
    setStartTime(null);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Game</h1>
      <p className="mb-2">⏱️ Tempo: {time}s</p>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            content={card}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold">🎉 Você venceu em {time}s!</p>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
