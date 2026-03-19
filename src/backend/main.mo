import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type GameScore = {
    gameName : Text;
    highScore : Nat;
  };

  type UserStats = {
    totalStars : Nat;
    gameScores : Map.Map<Text, GameScore>;
  };

  let users = Map.empty<Principal, UserStats>();

  public shared ({ caller }) func saveGameScore(gameName : Text, score : Nat) : async () {
    switch (users.get(caller)) {
      case (null) {
        let newGameScore : GameScore = {
          gameName;
          highScore = score;
        };
        let newGameScores = Map.empty<Text, GameScore>();
        newGameScores.add(gameName, newGameScore);
        let newUserStats : UserStats = {
          totalStars = 0;
          gameScores = newGameScores;
        };
        users.add(caller, newUserStats);
      };
      case (?userStats) {
        let existingScore = userStats.gameScores.get(gameName);
        switch (existingScore) {
          case (null) {
            let newGameScore : GameScore = {
              gameName;
              highScore = score;
            };
            userStats.gameScores.add(gameName, newGameScore);
          };
          case (?gameScore) {
            if (score > gameScore.highScore) {
              let updatedGameScore : GameScore = {
                gameName;
                highScore = score;
              };
              userStats.gameScores.add(gameName, updatedGameScore);
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateTotalStars(stars : Nat) : async () {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found. Please save a game score first.") };
      case (?userStats) {
        let updatedStats : UserStats = {
          totalStars = userStats.totalStars + stars;
          gameScores = userStats.gameScores;
        };
        users.add(caller, updatedStats);
      };
    };
  };

  public query ({ caller }) func getGameScore(gameName : Text) : async ?GameScore {
    switch (users.get(caller)) {
      case (null) { null };
      case (?userStats) { userStats.gameScores.get(gameName) };
    };
  };

  public query ({ caller }) func getTotalStars() : async Nat {
    switch (users.get(caller)) {
      case (null) { 0 };
      case (?userStats) { userStats.totalStars };
    };
  };

  public query ({ caller }) func getAllGameScores() : async [GameScore] {
    switch (users.get(caller)) {
      case (null) { [] };
      case (?userStats) {
        userStats.gameScores.values().toArray();
      };
    };
  };
};
