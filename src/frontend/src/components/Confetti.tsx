import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: string;
}

const COLORS = [
  "#F6C33B",
  "#16B7B2",
  "#F58A2A",
  "#62C15B",
  "#8C63D9",
  "#2F7BEA",
  "#FF6B9D",
];

interface Props {
  active: boolean;
  onDone?: () => void;
}

export default function Confetti({ active, onDone }: Props) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 10 + 6,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 1.5,
      shape: Math.random() > 0.5 ? "circle" : "square",
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => {
      setPieces([]);
      onDone?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [active, onDone]);

  if (!pieces.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
