"use client";

interface CardProps {
  content: string;
  isFlipped: boolean;
  onClick: () => void;
}

export default function Card({ content, isFlipped, onClick }: CardProps) {
  return (
    <div
      onClick={isFlipped ? undefined : onClick}
      className={`w-20 h-20 flex items-center justify-center text-2xl rounded shadow cursor-pointer select-none ${
        isFlipped ? "bg-white" : "bg-gray-300"
      }`}
    >
      {isFlipped ? content : "❓"}
    </div>
  );
}
