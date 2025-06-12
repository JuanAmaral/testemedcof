"use client";

import { useEffect, useState } from "react";
import { IRankingResponse, Ranking } from "@/gateway/ranking";
import { Score } from "@/gateway/score";
import PlayGameComponent from "./_components/play-game";
import FinishGameComponent from "./_components/finish-game";

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
  const [ranking, setRanking] = useState<IRankingResponse | null>(null);

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
    getRanking();
  }, []);

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

  async function getRanking(page: number = 1) {
    const _ranking = await Ranking.getInstance().getRanking(page);

    _ranking.rankings.sort((a, b) => b.score - a.score);

    setRanking(_ranking);
  }

  function paginationLeft() {
    if (ranking?.pagination.page === 1) return;
    getRanking(ranking!.pagination.page - 1);
  }

  function paginationRight() {
    if (!ranking?.pagination.hasMore) return;
    getRanking(ranking?.pagination.page + 1);
  }
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
      await Score.getInstance().sendScore(payload);
      console.log("Score enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar score:", error);
    }
  };

  function RankingComponent() {
    return (
      <div className="flex flex-row items-center justify-center gap-20">
        <button
          onClick={paginationLeft}
          className="text-white px-4 py-2 border border-white rounded-md disabled:opacity-50"
          disabled={ranking?.pagination.page === 1}
        >
          Left
        </button>
        <div className="flex flex-col  items-start justify-start gap-2 mt-4">
          <h2 className="text-xl font-semibold text-white">Ranking</h2>

          {ranking?.rankings.map((ranking) => (
            <span key={ranking.createdAt}>
              {ranking.name} - {ranking.score}
            </span>
          ))}
        </div>
        <button
          onClick={paginationRight}
          className="text-white px-4 py-2 border border-white rounded-md disabled:opacity-50"
          disabled={!ranking?.pagination.hasMore}
        >
          Right
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Memory Game</h1>

      {!started ? (
        <PlayGameComponent
          name={name}
          setName={setName}
          startGame={startGame}
        />
      ) : (
        <FinishGameComponent
          cards={cards}
          flipped={flipped}
          matched={matched}
          time={time}
          gameOver={gameOver}
          name={name}
          resetGame={resetGame}
          handleClick={handleClick}
        />
      )}

      {gameOver && <RankingComponent />}
    </div>
  );
}
