import Card from "../card";

interface IProps {
  cards: string[];
  flipped: number[];
  matched: number[];
  time: number;
  gameOver: boolean;
  name: string;
  resetGame: () => void;
  handleClick: (index: number) => void;
}

export default function FinishGameComponent({
  cards,
  flipped,
  matched,
  time,
  gameOver,
  name,
  resetGame,
  handleClick,
}: IProps) {
  return (
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
  );
}
