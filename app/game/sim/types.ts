export type Status = "waiting" | "imagining" | "guessing" | "finished";

export interface Player {
  id: string;
  name: string;
  // Add any other player-related properties
}

export interface GameState {
  game_id: string;
  status: Status;
  current_round: number;
  total_rounds: number;
  players: Player[];
  current_prompt: string;
  current_image: string;
  submitted_prompts: [string, string][];
  submitted_guesses: [string, string, string][];
}
