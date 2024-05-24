// gameReducer.ts
import { GameState, Player } from "./types";

export type GameAction =
  | { type: "JOIN_GAME"; payload: { playerId: string; playerName: string } }
  | { type: "START_GAME" }
  | { type: "SUBMIT_PROMPT"; payload: { playerId: string; prompt: string } }
  | {
      type: "SUBMIT_GUESS";
      payload: { playerId: string; targetPlayerId: string; guess: string };
    }
  | { type: "RESET_GAME" };

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "JOIN_GAME":
      return {
        ...state,
        players: [
          ...state.players,
          { id: action.payload.playerId, name: action.payload.playerName },
        ],
      };
    case "START_GAME":
      return {
        ...state,
        status: "imagining",
      };
    case "SUBMIT_PROMPT":
      return {
        ...state,
        submitted_prompts: [
          ...state.submitted_prompts,
          [action.payload.playerId, action.payload.prompt],
        ],
        status:
          state.submitted_prompts.length + 1 === state.players.length
            ? "guessing"
            : state.status,
      };
    case "SUBMIT_GUESS":
      const newSubmittedGuesses = [
        ...state.submitted_guesses,
        [
          action.payload.playerId,
          action.payload.targetPlayerId,
          action.payload.guess,
        ] as [string, string, string],
      ];
      const isRoundFinished =
        newSubmittedGuesses.length ===
        state.players.length * (state.players.length - 1);
      return {
        ...state,
        submitted_guesses: newSubmittedGuesses,
        current_round: isRoundFinished
          ? state.current_round + 1
          : state.current_round,
        status: isRoundFinished
          ? state.current_round + 1 === state.total_rounds
            ? "finished"
            : "imagining"
          : state.status,
        submitted_prompts: isRoundFinished ? [] : state.submitted_prompts,
        current_prompt: isRoundFinished ? "" : state.current_prompt,
        current_image: isRoundFinished ? "" : state.current_image,
      };
    case "RESET_GAME":
      return {
        ...state,
        game_id: `game${Math.random().toString(36).substring(7)}`,
        status: "waiting",
        current_round: 0,
        players: [],
        submitted_prompts: [],
        submitted_guesses: [],
        current_prompt: "",
        current_image: "",
      };
    default:
      return state;
  }
};
