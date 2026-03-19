import { useEffect, useRef } from "react";
import { useSaveGameScore, useUpdateTotalStars } from "../hooks/useQueries";
import Confetti from "./Confetti";

interface Props {
  gameName: string;
  gameKey: string;
  score: number;
  maxScore: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

function getStars(score: number, max: number): number {
  const pct = score / max;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  if (pct >= 0.3) return 1;
  return 0;
}

function getMessage(stars: number): string {
  if (stars === 3) return "Amazing! You're a superstar! 🎉";
  if (stars === 2) return "Great job! Keep it up! 💪";
  if (stars === 1) return "Good try! Practice makes perfect! 🌱";
  return "Don't give up! You can do it! 💫";
}

export default function GameResult({
  gameName,
  gameKey,
  score,
  maxScore,
  onPlayAgain,
  onHome,
}: Props) {
  const stars = getStars(score, maxScore);
  const saveScore = useSaveGameScore();
  const updateStars = useUpdateTotalStars();
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    saveScore.mutate({ gameName: gameKey, score });
    if (stars > 0) {
      updateStars.mutate(stars);
    }
  }, [gameKey, score, stars, saveScore, updateStars]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-kid-purple to-kid-violet p-6">
      <Confetti active={stars >= 2} />

      <div className="bg-white rounded-5xl p-8 md:p-12 text-center max-w-md w-full kid-shadow-lg pop-in">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="font-display font-black text-3xl text-kid-purple mb-2">
          {gameName}
        </h2>
        <p className="text-gray-500 font-body mb-6">Round Complete!</p>

        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`text-5xl transition-transform duration-300 ${
                s <= stars ? "scale-110" : "grayscale opacity-40"
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="bg-kid-teal/10 rounded-3xl p-4 mb-6">
          <p className="font-display font-black text-5xl text-kid-teal">
            {score}
            <span className="text-2xl text-gray-400">/{maxScore}</span>
          </p>
          <p className="text-gray-500 font-body text-sm">Questions Correct</p>
        </div>

        <p className="font-display font-bold text-lg text-kid-purple mb-8">
          {getMessage(stars)}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            data-ocid="result.primary_button"
            onClick={onPlayAgain}
            className="btn-bounce w-full bg-kid-blue text-white font-display font-black text-xl py-4 rounded-full kid-shadow hover:bg-blue-600"
          >
            🔄 Play Again
          </button>
          <button
            type="button"
            data-ocid="result.secondary_button"
            onClick={onHome}
            className="btn-bounce w-full bg-white border-2 border-kid-purple text-kid-purple font-display font-bold text-lg py-4 rounded-full hover:bg-kid-purple hover:text-white transition-colors"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
