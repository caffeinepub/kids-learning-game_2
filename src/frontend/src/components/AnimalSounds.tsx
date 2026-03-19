import { useCallback, useState } from "react";
import Confetti from "./Confetti";
import GameResult from "./GameResult";

interface Props {
  onBack: () => void;
}

const ANIMALS = [
  { name: "Dog", emoji: "🐶", sound: "Woof!", wrong: ["Meow!", "Moo!"] },
  { name: "Cat", emoji: "🐱", sound: "Meow!", wrong: ["Woof!", "Oink!"] },
  { name: "Cow", emoji: "🐮", sound: "Moo!", wrong: ["Meow!", "Quack!"] },
  { name: "Duck", emoji: "🦆", sound: "Quack!", wrong: ["Moo!", "Roar!"] },
  { name: "Pig", emoji: "🐷", sound: "Oink!", wrong: ["Quack!", "Neigh!"] },
  { name: "Lion", emoji: "🦁", sound: "Roar!", wrong: ["Oink!", "Tweet!"] },
  { name: "Bird", emoji: "🐦", sound: "Tweet!", wrong: ["Roar!", "Hiss!"] },
  { name: "Snake", emoji: "🐍", sound: "Hiss!", wrong: ["Tweet!", "Ribbit!"] },
  { name: "Frog", emoji: "🐸", sound: "Ribbit!", wrong: ["Hiss!", "Woof!"] },
  { name: "Horse", emoji: "🐴", sound: "Neigh!", wrong: ["Ribbit!", "Baa!"] },
  { name: "Sheep", emoji: "🐑", sound: "Baa!", wrong: ["Neigh!", "Moo!"] },
  {
    name: "Elephant",
    emoji: "🐘",
    sound: "Trumpet!",
    wrong: ["Baa!", "Roar!"],
  },
  {
    name: "Monkey",
    emoji: "🐒",
    sound: "Ooh-Ooh!",
    wrong: ["Trumpet!", "Quack!"],
  },
  { name: "Owl", emoji: "🦉", sound: "Hoot!", wrong: ["Ooh-Ooh!", "Meow!"] },
  { name: "Chicken", emoji: "🐔", sound: "Cluck!", wrong: ["Hoot!", "Oink!"] },
];

const SOUND_COLORS = [
  "bg-kid-teal text-white hover:bg-teal-600",
  "bg-kid-orange text-white hover:bg-orange-600",
  "bg-kid-violet text-white hover:bg-purple-600",
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const TOTAL = 10;

export default function AnimalSounds({ onBack }: Props) {
  const [questions] = useState(() =>
    shuffle(ANIMALS)
      .slice(0, TOTAL)
      .map((a) => ({
        ...a,
        choices: shuffle([a.sound, ...a.wrong]),
      })),
  );
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const q = questions[current];

  const handleChoice = useCallback(
    (sound: string) => {
      if (selected) return;
      setSelected(sound);
      if (sound === q.sound) {
        setScore((s) => s + 1);
        setShowConfetti(true);
      }
      setTimeout(() => {
        setSelected(null);
        setShowConfetti(false);
        if (current + 1 >= TOTAL) setDone(true);
        else setCurrent((c) => c + 1);
      }, 1300);
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
        gameName="Animal Sounds"
        gameKey="Animal Sounds"
        score={score}
        maxScore={TOTAL}
        onPlayAgain={handlePlayAgain}
        onHome={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex flex-col">
      <Confetti active={showConfetti} />

      <header className="bg-kid-violet text-white px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          data-ocid="animals.secondary_button"
          onClick={onBack}
          className="btn-bounce flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 font-display font-bold text-sm"
        >
          ← Home
        </button>
        <h1 className="font-display font-black text-xl">🦁 Animal Sounds</h1>
        <div
          data-ocid="animals.panel"
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

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8 max-w-lg mx-auto w-full">
        <div className="text-center">
          <p className="text-gray-500 font-body">
            Question {current + 1} of {TOTAL}
          </p>
          <p className="font-display font-black text-2xl text-kid-purple mt-1">
            What sound does this animal make?
          </p>
        </div>

        {/* Animal display */}
        <div className="pop-in bg-kid-violet rounded-5xl w-48 h-48 flex flex-col items-center justify-center kid-shadow-lg gap-2">
          <span className="text-8xl">{q.emoji}</span>
          <span className="font-display font-black text-white text-2xl">
            {q.name}
          </span>
        </div>

        {/* Sound choices */}
        <div data-ocid="animals.list" className="flex flex-col gap-4 w-full">
          {q.choices.map((sound, idx) => {
            let colorClass = `${SOUND_COLORS[idx % SOUND_COLORS.length]} border-2 border-transparent`;
            if (selected) {
              if (sound === q.sound)
                colorClass =
                  "bg-kid-green text-white border-2 border-kid-green ring-4 ring-kid-green ring-offset-2";
              else if (sound === selected)
                colorClass =
                  "bg-red-400 text-white border-2 border-red-400 shake-anim";
              else
                colorClass =
                  "bg-gray-200 text-gray-400 border-2 border-gray-200";
            }
            return (
              <button
                type="button"
                key={sound}
                data-ocid={`animals.item.${idx + 1}`}
                onClick={() => handleChoice(sound)}
                disabled={!!selected}
                className={`btn-bounce ${colorClass} rounded-3xl py-5 font-display font-black text-3xl kid-shadow transition-all`}
              >
                {sound}
              </button>
            );
          })}
        </div>

        {selected && (
          <p
            className={`font-display font-bold text-xl ${selected === q.sound ? "text-kid-green" : "text-red-500"}`}
          >
            {selected === q.sound
              ? `🎉 Yes! ${q.name} says ${q.sound}`
              : `💡 ${q.name} says ${q.sound}`}
          </p>
        )}
      </main>
    </div>
  );
}
