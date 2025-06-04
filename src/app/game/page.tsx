"use client";

import { useEffect, useState, useRef } from "react";
import Card from "./card";

const INITIAL_CARDS = ["🍕", "🍔", "🍣", "🍩", "🍦", "🍇"];
const MATCH_PAIR_COUNT = 2;

function generateShuffledCards() {
  return [...INITIAL_CARDS, ...INITIAL_CARDS].sort(() => Math.random() - 0.5);
}

export default function GamePage() {
  const [cards, setCards] = useState(generateShuffledCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (flipped.length === MATCH_PAIR_COUNT) {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setMatched((prev) => [...prev, first, second]);
      }

      const flipBackTimeout = setTimeout(() => {
        setFlipped([]);
      }, 1000);

      return () => clearTimeout(flipBackTimeout);
    }
  }, [flipped, cards]);

  useEffect(() => {
    const allMatched = matched.length === cards.length;
    if (allMatched && cards.length > 0) {
      setGameOver(true);
      stopTimer();
    }
  }, [matched, cards]);

  useEffect(() => {
    if (!startTime || gameOver) return;

    timerRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => stopTimer();
  }, [startTime, gameOver]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCardClick = (index: number) => {
    const alreadyFlipped = flipped.includes(index);
    const alreadyMatched = matched.includes(index);

    if (
      flipped.length < MATCH_PAIR_COUNT &&
      !alreadyFlipped &&
      !alreadyMatched
    ) {
      setFlipped((prev) => [...prev, index]);
      if (!startTime) setStartTime(Date.now());
    }
  };

  const resetGame = () => {
    stopTimer();
    setCards(generateShuffledCards());
    setFlipped([]);
    setMatched([]);
    setTime(0);
    setStartTime(null);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Memory Game</h1>
      <p className="mb-2">⏱️ Tempo: {time}s</p>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card
            key={index}
            content={card}
            isFlipped={flipped.includes(index) || matched.includes(index)}
            onClick={() => handleCardClick(index)}
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
