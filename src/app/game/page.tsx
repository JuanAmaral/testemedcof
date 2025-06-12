"use client";

import { useEffect, useState } from "react";
import Card from "./card";

const initialCards = ["🍕", "🍔", "🍣", "🍩", "🍦", "🍇"];

export default function GamePage() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");

  const startGame = () => {
    const shuffled = [...initialCards, ...initialCards].sort(
      () => Math.random() - 0.5
    );
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setTime(0);
    setStartTime(Date.now());
    setGameOver(false);
    setStarted(true);
  };

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
      setStartTime(null);

      sendScore();
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
    }
  };

  const resetGame = () => {
    setStarted(false);
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setTime(0);
    setStartTime(null);
    setGameOver(false);
  };

  const sendScore = async () => {
    if (!cards.length || matched.length < 2) return;

    const payload = {
      name,
      score: time,
      firstFound: cards[matched[0]],
      lastFound: cards[matched[matched.length - 1]],
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        `https://memory-game-5x7j.onrender.com/api-docs/api/scores`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        throw new Error("Erro ao enviar score");
      }

      console.log("Score enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar score:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Memory Game</h1>

      {!started ? (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded bg-white text-black focus:outline-none"
          />
          <button
            onClick={startGame}
            disabled={!name.trim()}
            className={`px-6 py-3 rounded text-white ${
              name.trim()
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Começar Jogo
          </button>
        </div>
      ) : (
        <>
          <p className="mb-2 text-white">⏱️ Tempo: {time}s</p>
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
              <p className="text-xl font-semibold text-white">
                🎉 {name}, você venceu em {time}s!
              </p>
              <button
                onClick={resetGame}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Jogar Novamente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
