interface IProps {
  name: string;
  setName: (name: string) => void;
  startGame: () => void;
}

export default function PlayGameComponent({
  name,
  setName,
  startGame,
}: IProps) {
  return (
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
  );
}
