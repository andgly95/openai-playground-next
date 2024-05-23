// mockServer.ts
import { GameState, Player } from "./types";

export class MockServer {
  private gameState: GameState;

  constructor() {
    this.gameState = {
      game_id: `game${Math.random().toString(36).substring(7)}`,
      status: "waiting",
      current_round: 0,
      total_rounds: 5,
      players: [],
      current_prompt: "",
      current_image: "",
      submitted_prompts: [],
      submitted_guesses: [],
    };
  }

  getGameState(): GameState {
    return this.gameState;
  }

  createGame(totalRounds: number): void {
    this.gameState.game_id = `game${Math.random().toString(36).substring(7)}`;
    this.gameState.total_rounds = totalRounds;
    this.gameState.status = "waiting";
  }

  joinGame(playerId: string, playerName: string): void {
    const player: Player = { id: playerId, name: playerName };
    this.gameState.players.push(player);
  }

  startGame(): void {
    this.gameState.status = "imagining";
  }

  submitPrompt(playerId: string, prompt: string): void {
    this.gameState.submitted_prompts.push([playerId, prompt]);
    if (
      this.gameState.submitted_prompts.length === this.gameState.players.length
    ) {
      this.gameState.status = "guessing";
      this.generateImages();
    }
  }

  submitGuess(playerId: string, targetPlayerId: string, guess: string): void {
    this.gameState.submitted_guesses.push([playerId, targetPlayerId, guess]);
    if (
      this.gameState.submitted_guesses.length ===
      this.gameState.players.length * (this.gameState.players.length - 1)
    ) {
      this.calculateScores();
      this.gameState.current_round++;
      if (this.gameState.current_round === this.gameState.total_rounds) {
        this.gameState.status = "finished";
      } else {
        this.gameState.status = "imagining";
        this.resetRound();
      }
    }
  }

  private generateImages(): void {
    // Simulated image generation
    this.gameState.submitted_prompts.forEach(([playerId, prompt]) => {
      const image = `https://example.com/generated-image-${playerId}.jpg`;
      this.gameState.current_image = image;
    });
  }

  private calculateScores(): void {
    // Simulated score calculation
    this.gameState.submitted_guesses.forEach(
      ([playerId, targetPlayerId, guess]) => {
        const score = Math.floor(Math.random() * 101);
        console.log(
          `Player ${playerId} guessed "${guess}" for player ${targetPlayerId}'s prompt and scored ${score} points.`
        );
      }
    );
  }

  private resetRound(): void {
    this.gameState.submitted_prompts = [];
    this.gameState.submitted_guesses = [];
    this.gameState.current_prompt = "";
    this.gameState.current_image = "";
  }
}
