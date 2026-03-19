import { useCallback, useState } from "react";
import Confetti from "./Confetti";
import GameResult from "./GameResult";

interface Props {
  onBack: () => void;
}

interface Question {
  a: number;
  b: number;
  op: "+" | "-";
  answer: number;
  choices: number[];
}

function genQuestion(): Question {
  const op = Math.random() > 0.5 ? "+" : "-";
  let a = Math.floor(Math.random() * 9) + 1;
  let b = Math.floor(Math.random() * 9) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  const answer = op === "+" ? a + b : a - b;
  const choiceSet = new Set<number>([answer]);
  while (choiceSet.size < 4) {
    const offset = Math.floor(Math.random() * 5) - 2;
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) choiceSet.add(candidate);
  }
  const choices = [...choiceSet].sort(() => Math.random() - 0.5);
  return { a, b, op, answer, choices };
}

const ENCOURAGEMENTS = [
  "You're a math star! ⭐",
  "Brilliant! Keep going! 🧠",
  "Wow, amazing! 🎯",
  "You rock at math! 🎸",
  "Superb! 🦸",
];

const BTN_COLORS = [
  "bg-kid-blue text-white",
  "bg-kid-violet text-white",
  "bg-kid-teal text-white",
  "bg-kid-orange text-white",
];

const TOTAL = 10;

export default function MathWizard({ onBack }: Props) {
  const [questions] = useState(() =>
    Array.from({ length: TOTAL }, genQuestion),
  );
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [done, setDone] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [encouragement, setEncouragement] = useState("");

  const q = questions[current];

  const handleChoice = useCallback(
    (val: number) => {
      if (selected !== null) return;
      setSelected(val);
      if (val === q.answer) {
        setScore((s) => s + 1);
        setShowConfetti(true);
        setEncouragement(
          ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)],
        );
      } else {
        setEncouragement("Try again! You got this! 💪");
      }
      setTimeout(() => {
        setSelected(null);
        setShowConfetti(false);
        setEncouragement("");
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
        gameName="Math Wizard"
        gameKey="Math Wizard"
        score={score}
        maxScore={TOTAL}
        onPlayAgain={handlePlayAgain}
        onHome={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
      <Confetti active={showConfetti} />

      <header className="bg-kid-green text-white px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          data-ocid="math.secondary_button"
          onClick={onBack}
          className="btn-bounce flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 font-display font-bold text-sm"
        >
          ← Home
        </button>
        <h1 className="font-display font-black text-xl">🔢 Math Wizard</h1>
        <div
          data-ocid="math.panel"
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
            What is the answer?
          </p>
        </div>

        {/* Problem display */}
        <div className="pop-in bg-white rounded-5xl p-8 kid-shadow-lg text-center w-full">
          <div className="flex items-center justify-center gap-4">
            <span className="font-display font-black text-7xl text-kid-purple">
              {q.a}
            </span>
            <span className="font-display font-black text-5xl text-kid-orange">
              {q.op}
            </span>
            <span className="font-display font-black text-7xl text-kid-purple">
              {q.b}
            </span>
            <span className="font-display font-black text-5xl text-gray-400">
              =
            </span>
            <div className="w-20 h-20 border-4 border-dashed border-kid-teal rounded-2xl flex items-center justify-center">
              <span className="font-display font-black text-4xl text-kid-teal">
                ?
              </span>
            </div>
          </div>
        </div>

        {/* Answer choices */}
        <div data-ocid="math.list" className="grid grid-cols-2 gap-4 w-full">
          {q.choices.map((choice, idx) => {
            let colorClass = BTN_COLORS[idx % BTN_COLORS.length];
            if (selected !== null) {
              if (choice === q.answer)
                colorClass =
                  "bg-kid-green text-white ring-4 ring-kid-green ring-offset-2";
              else if (choice === selected)
                colorClass = "bg-red-400 text-white";
              else colorClass = "bg-gray-200 text-gray-400";
            }
            return (
              <button
                type="button"
                key={choice}
                data-ocid={`math.item.${idx + 1}`}
                onClick={() => handleChoice(choice)}
                disabled={selected !== null}
                className={`btn-bounce ${colorClass} rounded-3xl py-6 font-display font-black text-4xl kid-shadow transition-all disabled:cursor-not-allowed`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {encouragement && (
          <p
            className={`font-display font-bold text-xl ${selected === q.answer ? "text-kid-green" : "text-red-500"}`}
          >
            {encouragement}
          </p>
        )}
      </main>
    </div>
  );
}
