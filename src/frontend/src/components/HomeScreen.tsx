import type { GameType } from "../App";
import { useAllGameScores, useTotalStars } from "../hooks/useQueries";

interface Props {
  onSelectGame: (game: GameType) => void;
}

const GAMES: Array<{
  id: GameType;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
}> = [
  {
    id: "abc",
    title: "ABC Alphabet",
    description: "Learn letters by matching words that start with each letter!",
    emoji: "🔤",
    gradient: "from-kid-blue to-blue-400",
  },
  {
    id: "spelling",
    title: "Spelling Bee",
    description: "Unscramble letters to spell words and boost your vocabulary!",
    emoji: "🐝",
    gradient: "from-kid-yellow to-orange-400",
  },
  {
    id: "math",
    title: "Math Wizard",
    description: "Solve fun addition and subtraction puzzles with numbers!",
    emoji: "🔢",
    gradient: "from-kid-green to-emerald-400",
  },
  {
    id: "animals",
    title: "Animal Sounds",
    description: "Can you guess what sound each animal makes?",
    emoji: "🦁",
    gradient: "from-kid-violet to-purple-400",
  },
];

const GAME_NAME_MAP: Record<GameType, string> = {
  abc: "ABC Alphabet",
  spelling: "Spelling Bee",
  math: "Math Wizard",
  animals: "Animal Sounds",
};

const HERO_DECORATIONS = [
  { pos: "top-4 left-8", emoji: "✨" },
  { pos: "top-8 right-12", emoji: "⭐" },
  { pos: "bottom-6 left-16", emoji: "🌟" },
  { pos: "bottom-4 right-8", emoji: "💫" },
  { pos: "top-16 left-1/2", emoji: "✨" },
];

const BENEFITS = [
  { emoji: "📚", title: "Learn Letters", desc: "Master A to Z" },
  { emoji: "🔢", title: "Learn Math", desc: "Count & Calculate" },
  { emoji: "✍️", title: "Spelling Skills", desc: "Write & Learn" },
  { emoji: "🦊", title: "Animal World", desc: "Discover Nature" },
];

export default function HomeScreen({ onSelectGame }: Props) {
  const { data: scores } = useAllGameScores();
  const { data: totalStars } = useTotalStars();

  const getHighScore = (gameId: GameType): number | null => {
    if (!scores) return null;
    const s = scores.find((sc) => sc.gameName === GAME_NAME_MAP[gameId]);
    return s ? Number(s.highScore) : null;
  };

  const stars = totalStars ? Number(totalStars) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sky-50">
      {/* Header */}
      <header className="bg-kid-purple sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌟</span>
            <span className="font-display font-black text-white text-2xl tracking-wide">
              KIDLEARN
            </span>
          </div>
          <div
            data-ocid="header.panel"
            className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2"
          >
            <span className="text-xl">⭐</span>
            <span className="font-display font-black text-white text-lg">
              {stars}
            </span>
            <span className="text-white/80 text-sm font-body">Stars</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-kid-teal to-kid-blue overflow-hidden py-12 px-4">
        {HERO_DECORATIONS.map((d) => (
          <span key={d.pos} className={`absolute text-2xl opacity-60 ${d.pos}`}>
            {d.emoji}
          </span>
        ))}

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-7xl mb-4">🎓</div>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-tight mb-4">
            Kids Learn &amp; Play!
          </h1>
          <p className="font-body text-white/90 text-lg md:text-xl max-w-xl mx-auto">
            Choose a fun learning game and start your adventure! Every game
            makes you smarter! 🚀
          </p>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <title>Wave decoration</title>
            <path
              d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
              fill="#f0f9ff"
            />
          </svg>
        </div>
      </section>

      {/* Game Cards */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="text-center mb-8">
          <span className="inline-block bg-kid-orange/20 text-kid-orange font-display font-bold px-4 py-1 rounded-full text-sm uppercase tracking-widest mb-3">
            Choose Your Game
          </span>
          <h2 className="font-display font-black text-3xl text-kid-purple">
            Pick a Learning Adventure!
          </h2>
        </div>

        <div
          data-ocid="games.list"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {GAMES.map((game, idx) => {
            const hs = getHighScore(game.id);
            return (
              <div
                key={game.id}
                data-ocid={`games.item.${idx + 1}`}
                className="bg-white rounded-4xl kid-shadow-lg overflow-hidden border-2 border-white hover:border-kid-teal/30 transition-all hover:scale-[1.02] duration-200"
              >
                <div
                  className={`bg-gradient-to-r ${game.gradient} p-6 flex items-center gap-4`}
                >
                  <span className="text-6xl">{game.emoji}</span>
                  <div>
                    <h3 className="font-display font-black text-white text-2xl">
                      {game.title}
                    </h3>
                    {hs !== null && (
                      <span className="inline-flex items-center gap-1 bg-white/30 text-white text-sm font-display font-bold px-3 py-0.5 rounded-full mt-1">
                        ⭐ Best: {hs}/10
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 font-body text-base mb-5">
                    {game.description}
                  </p>
                  <button
                    type="button"
                    data-ocid={`games.item.${idx + 1}.primary_button`}
                    onClick={() => onSelectGame(game.id)}
                    className={`btn-bounce w-full py-4 rounded-full font-display font-black text-xl text-white bg-gradient-to-r ${game.gradient} kid-shadow hover:opacity-90 transition-opacity`}
                  >
                    ▶ Play Now!
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <section className="mt-16 bg-kid-teal rounded-4xl p-8 text-white">
          <h3 className="font-display font-black text-2xl text-center mb-6">
            Why Play KidLearn? 🌈
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-white/20 rounded-3xl p-4 text-center"
              >
                <div className="text-4xl mb-2">{b.emoji}</div>
                <p className="font-display font-black text-sm">{b.title}</p>
                <p className="text-white/80 text-xs font-body">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-kid-purple text-white/70 text-center py-4 text-sm font-body">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-kid-teal hover:underline font-display font-bold"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
