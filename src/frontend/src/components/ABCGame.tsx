import { useCallback, useState } from "react";
import Confetti from "./Confetti";
import GameResult from "./GameResult";

interface Props {
  onBack: () => void;
}

const WORD_POOL = [
  { letter: "A", word: "Apple", emoji: "🍎" },
  { letter: "B", word: "Ball", emoji: "⚽" },
  { letter: "C", word: "Cat", emoji: "🐱" },
  { letter: "D", word: "Dog", emoji: "🐶" },
  { letter: "E", word: "Egg", emoji: "🥚" },
  { letter: "F", word: "Fish", emoji: "🐟" },
  { letter: "G", word: "Goat", emoji: "🐐" },
  { letter: "H", word: "Hat", emoji: "🎩" },
  { letter: "I", word: "Ice", emoji: "🧊" },
  { letter: "J", word: "Jar", emoji: "🫙" },
  { letter: "K", word: "Kite", emoji: "🪁" },
  { letter: "L", word: "Lion", emoji: "🦁" },
  { letter: "M", word: "Moon", emoji: "🌙" },
  { letter: "N", word: "Nest", emoji: "🪹" },
  { letter: "O", word: "Owl", emoji: "🦉" },
  { letter: "P", word: "Pig", emoji: "🐷" },
  { letter: "Q", word: "Queen", emoji: "👑" },
  { letter: "R", word: "Rain", emoji: "🌧️" },
  { letter: "S", word: "Sun", emoji: "☀️" },
  { letter: "T", word: "Tree", emoji: "🌳" },
  { letter: "U", word: "Umbrella", emoji: "☂️" },
  { letter: "V", word: "Van", emoji: "🚐" },
  { letter: "W", word: "Whale", emoji: "🐋" },
  { letter: "X", word: "X-ray", emoji: "🩻" },
  { letter: "Y", word: "Yak", emoji: "🐃" },
  { letter: "Z", word: "Zebra", emoji: "🦓" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestions(count: number) {
  const pool = shuffle(WORD_POOL).slice(0, count);
  return pool.map((correct) => {
    const wrongPool = WORD_POOL.filter((w) => w.letter !== correct.letter);
    const wrong = shuffle(wrongPool).slice(0, 2);
    const choices = shuffle([correct, ...wrong]);
    return { correct, choices };
  });
}

const TOTAL = 10;

export default function ABCGame({ onBack }: Props) {
  const [questions] = useState(() => generateQuestions(TOTAL));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeBtn, setShakeBtn] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const q = questions[current];
  const isCorrect = selected === q?.correct.word;

  const handleChoice = useCallback(
    (word: string) => {
      if (selected) return;
      setSelected(word);
      const correct = word === q.correct.word;
      if (correct) {
        setScore((s) => s + 1);
        setShowConfetti(true);
      } else {
        setShakeBtn(word);
        setTimeout(() => setShakeBtn(null), 500);
      }
      setTimeout(() => {
        setSelected(null);
        setShowConfetti(false);
        if (current + 1 >= TOTAL) {
          setDone(true);
        } else {
          setCurrent((c) => c + 1);
        }
      }, 1200);
    },
    [selected, q, current],
  );

  const handlePlayAgain = () => {
    setPlayKey((k) => k + 1);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setDone(false);
    setShowConfetti(false);
  };

  if (done) {
    return (
      <GameResult
        key={playKey}
        gameName="ABC Alphabet"
        gameKey="ABC Alphabet"
        score={score}
        maxScore={TOTAL}
        onPlayAgain={handlePlayAgain}
        onHome={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-blue/10 to-sky-100 flex flex-col">
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <header className="bg-kid-blue text-white px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          data-ocid="abc.secondary_button"
          onClick={onBack}
          className="btn-bounce flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 font-display font-bold text-sm"
        >
          ← Home
        </button>
        <h1 className="font-display font-black text-xl">🔤 ABC Alphabet</h1>
        <div
          data-ocid="abc.panel"
          className="bg-white/20 rounded-full px-4 py-2 font-display font-black"
        >
          {score}/{TOTAL}
        </div>
      </header>

      {/* Progress */}
      <div className="h-3 bg-white/50">
        <div
          className="h-full bg-kid-yellow transition-all duration-500"
          style={{ width: `${(current / TOTAL) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center">
          <p className="text-gray-500 font-body mb-2 text-lg">
            Question {current + 1} of {TOTAL}
          </p>
          <p className="font-display font-black text-2xl text-kid-purple mb-4">
            Which word starts with:
          </p>
          <div className="pop-in bg-kid-blue rounded-5xl w-40 h-40 flex items-center justify-center mx-auto kid-shadow-lg">
            <span className="font-display font-black text-8xl text-white">
              {q.correct.letter}
            </span>
          </div>
        </div>

        <div
          data-ocid="abc.list"
          className="grid grid-cols-1 gap-4 w-full max-w-sm"
        >
          {q.choices.map((choice, idx) => {
            let bg = "bg-white border-2 border-gray-200 text-kid-purple";
            if (selected) {
              if (choice.word === q.correct.word)
                bg = "bg-kid-green border-2 border-kid-green text-white";
              else if (choice.word === selected)
                bg = "bg-red-400 border-2 border-red-400 text-white";
              else bg = "bg-white/60 border-2 border-gray-200 text-gray-400";
            }
            return (
              <button
                type="button"
                key={choice.word}
                data-ocid={`abc.item.${idx + 1}`}
                onClick={() => handleChoice(choice.word)}
                disabled={!!selected}
                className={`btn-bounce ${bg} ${shakeBtn === choice.word ? "shake-anim" : ""} rounded-3xl p-4 flex items-center gap-4 kid-shadow font-display font-black text-2xl transition-all`}
              >
                <span className="text-4xl">{choice.emoji}</span>
                <span>{choice.word}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <p
            className={`font-display font-bold text-xl ${isCorrect ? "text-kid-green" : "text-red-500"}`}
          >
            {isCorrect
              ? "🎉 Correct! Great job!"
              : `💡 The answer is ${q.correct.word}`}
          </p>
        )}
      </main>
    </div>
  );
}
