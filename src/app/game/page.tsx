"use client";

import { useEffect, useState } from "react";
import Card from "./card";
import { shuffleArray } from "@/utils/shuffle";

const items = ["🍕", "🍔", "🍣", "🍩", "🍦", "🍇"];

export default function GamePage() {
  const [cards, setCards] = useState<string[]>([]);
  const [flip, setFlip] = useState<any>([]);
  const [correct, setCorrect] = useState<any>([]);
  const [tempo, setTempo] = useState(0);
  const [clock, setClock] = useState<any>();
  const [start, setStart] = useState(false);
  const [status, setStatus] = useState("running");
  const newCards = shuffleArray([...items, ...items]);

  useEffect(() => {
    if (cards.length === 0) {
      setCards(newCards);
    }
  }, [cards]);

  useEffect(() => {
    if (flip.length === 2) {
      const [a, b] = flip;
      if (cards[a] === cards[b]) {
        setCorrect((prev: any) => [...prev, a, b]);
      }
      setTimeout(() => {
        setFlip([]);
      }, 1000);
    }
  }, [flip]);

  useEffect(() => {
    if (start) {
      const id = setInterval(() => {
        setTempo((t: number) => t + 1);
      }, 1000);
      setClock(id);
    }

    return () => clearInterval(clock);
  }, [start]);

  useEffect(() => {
    if (correct.length === cards.length && cards.length > 0) {
      setStatus("done");
    }
  }, [correct]);

  const handleClick = (idx: number) => {
    if (!start) setStart(true);
    if (flip.length < 2 && !flip.includes(idx) && !correct.includes(idx)) {
      setFlip([...flip, idx]);
    }
  };

  const restart = () => {
    setCards(shuffleArray([...items, ...items]));
    setFlip([]);
    setCorrect([]);
    setTempo(0);
    setStatus("running");
    setStart(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Jogo da Memória</h1>
      <p className="mb-2">⏱️ Tempo: {tempo}s</p>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((item, i) => (
          <Card
            key={Math.random()}
            content={item}
            isFlipped={flip.includes(i) || correct.includes(i)}
            onClick={() => handleClick(i)}
          />
        ))}
      </div>

      {status === "done" && (
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold">🎉 Você terminou em {tempo}s!</p>
          <button
            onClick={restart}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
}
