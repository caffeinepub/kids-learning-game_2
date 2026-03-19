import { useState } from "react";
import ABCGame from "./components/ABCGame";
import AnimalSounds from "./components/AnimalSounds";
import HomeScreen from "./components/HomeScreen";
import MathWizard from "./components/MathWizard";
import SpellingBee from "./components/SpellingBee";

export type GameType = "abc" | "spelling" | "math" | "animals";

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  const handleBack = () => setCurrentGame(null);

  if (!currentGame) {
    return <HomeScreen onSelectGame={setCurrentGame} />;
  }

  switch (currentGame) {
    case "abc":
      return <ABCGame onBack={handleBack} />;
    case "spelling":
      return <SpellingBee onBack={handleBack} />;
    case "math":
      return <MathWizard onBack={handleBack} />;
    case "animals":
      return <AnimalSounds onBack={handleBack} />;
    default:
      return <HomeScreen onSelectGame={setCurrentGame} />;
  }
}
