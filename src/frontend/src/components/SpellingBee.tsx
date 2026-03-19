import { useCallback, useState } from "react";
import Confetti from "./Confetti";
import GameResult from "./GameResult";

interface Props {
  onBack: () => void;
}

const WORDS = [
  { word: "CAT", emoji: "🐱" },
  { word: "DOG", emoji: "🐶" },
  { word: "SUN", emoji: "☀️" },
  { word: "HAT", emoji: "🎩" },
  { word: "BUS", emoji: "🚌" },
  { word: "CUP", emoji: "☕" },
  { word: "ANT", emoji: "🐜" },
  { word: "EGG", emoji: "🥚" },
  { word: "BEE", emoji: "🐝" },
  { word: "FISH", emoji: "🐟" },
  { word: "FROG", emoji: "🐸" },
  { word: "BIRD", emoji: "🐦" },
  { word: "CAKE", emoji: "🎂" },
  { word: "TREE", emoji: "🌳" },
  { word: "STAR", emoji: "⭐" },
];

interface LetterTile {
  id: string;
  letter: string;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function scramble(word: string): LetterTile[] {
  let tiles: LetterTile[] = word
    .split("")
    .map((l, i) => ({ id: `${l}-${i}-${Math.random()}`, letter: l }));
  let attempts = 0;
  while (tiles.map((t) => t.letter).join("") === word && attempts < 10) {
    tiles = shuffle(tiles);
    attempts++;
  }
  return tiles;
}

const TOTAL = 8;

export default function SpellingBee({ onBack }: Props) {
  const [questions] = useState(() => shuffle(WORDS).slice(0, TOTAL));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [letters, setLetters] = useState<LetterTile[]>(() =>
    scramble(shuffle(WORDS).slice(0, TOTAL)[0]?.word ?? ""),
  );
  const [placed, setPlaced] = useState<LetterTile[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const q = questions[current];

  const initQuestion = useCallback(
    (idx: number) => {
      setLetters(scramble(questions[idx].word));
      setPlaced([]);
      setStatus("idle");
    },
    [questions],
  );

  const handleLetterClick = (tileId: string) => {
    if (status !== "idle") return;
    const tile = letters.find((t) => t.id === tileId);
    if (!tile) return;
    const newLetters = letters.filter((t) => t.id !== tileId);
    const newPlaced = [...placed, tile];
    setLetters(newLetters);
    setPlaced(newPlaced);

    if (newPlaced.length === q.word.length) {
      const attempt = newPlaced.map((t) => t.letter).join("");
      if (attempt === q.word) {
        setStatus("correct");
        setScore((s) => s + 1);
        setShowConfetti(true);
      } else {
        setStatus("wrong");
      }
      setTimeout(() => {
        setShowConfetti(false);
        if (current + 1 >= TOTAL) {
          setDone(true);
        } else {
          setCurrent((c) => c + 1);
          initQuestion(current + 1);
        }
      }, 1400);
    }
  };

  const handleRemovePlaced = (tileId: string) => {
    if (status !== "idle") return;
    const tile = placed.find((t) => t.id === tileId);
    if (!tile) return;
    const newPlaced = placed.filter((t) => t.id !== tileId);
    setPlaced(newPlaced);
    setLetters((prev) => [...prev, tile]);
  };

  const handleClear = () => {
    if (status !== "idle") return;
    setLetters(scramble(q.word));
    setPlaced([]);
  };

  const handlePlayAgain = () => {
    setPlayKey((k) => k + 1);
    setCurrent(0);
    setScore(0);
    setDone(false);
    setShowConfetti(false);
    initQuestion(0);
  };

  if (done) {
    return (
      <GameResult
        key={playKey}
        gameName="Spelling Bee"
        gameKey="Spelling Bee"
        score={score}
        maxScore={TOTAL}
        onPlayAgain={handlePlayAgain}
        onHome={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-yellow/20 to-orange-50 flex flex-col">
      <Confetti active={showConfetti} />

      <header className="bg-amber-500 text-white px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          data-ocid="spelling.secondary_button"
          onClick={onBack}
          className="btn-bounce flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 font-display font-bold text-sm"
        >
          ← Home
        </button>
        <h1 className="font-display font-black text-xl">🐝 Spelling Bee</h1>
        <div
          data-ocid="spelling.panel"
          className="bg-white/20 rounded-full px-4 py-2 font-display font-black"
        >
          {score}/{TOTAL}
        </div>
      </header>

      <div className="h-3 bg-white/50">
        <div
          className="h-full bg-kid-yellow transition-all duration-500"
          style={{ width: `${(current / TOTAL) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center p-6 gap-6 max-w-lg mx-auto w-full">
        <div className="text-center">
          <p className="text-gray-500 font-body">
            Word {current + 1} of {TOTAL}
          </p>
          <p className="font-display font-black text-2xl text-kid-purple mt-1">
            Spell this word:
          </p>
        </div>

        {/* Emoji */}
        <div className="pop-in bg-amber-500 rounded-5xl w-36 h-36 flex items-center justify-center kid-shadow-lg">
          <span className="text-7xl">{q.emoji}</span>
        </div>

        {/* Placed letters */}
        <div className="flex gap-2 flex-wrap justify-center min-h-[64px] items-center">
          {placed.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl px-8 py-4 text-gray-400 font-display font-bold">
              Tap letters to spell!
            </div>
          ) : (
            placed.map((tile, posIdx) => {
              let bg = "bg-kid-blue text-white";
              if (status === "correct") bg = "bg-kid-green text-white";
              if (status === "wrong") bg = "bg-red-400 text-white";
              return (
                <button
                  type="button"
                  key={tile.id}
                  data-ocid={`spelling.item.${posIdx + 1}`}
                  onClick={() => handleRemovePlaced(tile.id)}
                  className={`btn-bounce ${bg} rounded-2xl w-14 h-14 font-display font-black text-2xl kid-shadow ${status === "wrong" ? "shake-anim" : ""}`}
                >
                  {tile.letter}
                </button>
              );
            })
          )}
        </div>

        {/* Available letters */}
        <div
          data-ocid="spelling.list"
          className="flex gap-3 flex-wrap justify-center"
        >
          {letters.map((tile, posIdx) => (
            <button
              type="button"
              key={tile.id}
              data-ocid={`spelling.letter.${posIdx + 1}`}
              onClick={() => handleLetterClick(tile.id)}
              disabled={status !== "idle"}
              className="btn-bounce bg-white border-2 border-kid-blue text-kid-purple rounded-2xl w-14 h-14 font-display font-black text-2xl kid-shadow hover:bg-kid-blue hover:text-white transition-colors disabled:opacity-50"
            >
              {tile.letter}
            </button>
          ))}
        </div>

        {status !== "wrong" && (
          <button
            type="button"
            data-ocid="spelling.reset_button"
            onClick={handleClear}
            className="text-gray-500 font-display font-bold underline text-sm"
          >
            🔄 Reset Letters
          </button>
        )}

        {status !== "idle" && (
          <p
            className={`font-display font-bold text-xl ${
              status === "correct" ? "text-kid-green" : "text-red-500"
            }`}
          >
            {status === "correct"
              ? "🎉 Perfect! You spelled it!"
              : `💡 Try again! It's ${q.word}`}
          </p>
        )}
      </main>
    </div>
  );
}
