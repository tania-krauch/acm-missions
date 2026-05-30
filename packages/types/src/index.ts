export type ValidationMode = "client" | "server" | "sandbox";

export type ChallengeType =
  | "circuit-repair"
  | "file-tree-reconstruction"
  | "password-crack"
  | "code-submission";

export type EpisodeState = "locked" | "available" | "started" | "in_progress" | "completed";

export type ChallengeState =
  | "locked"
  | "available"
  | "started"
  | "submitted"
  | "completed"
  | "failed";

export interface EpisodeEnvironment {
  room: "engineering" | "bridge" | "server-core" | "navigation" | "cargo";
  backgroundAsset?: string;
  musicAsset?: string;
  ambientEffects?: string[];
}

export interface EpisodeReward {
  unlockEpisodes?: string[];
  inventoryItems?: string[];
  storyFlags?: string[];
}

export interface Challenge<TConfig = Record<string, unknown>> {
  id: string;
  episodeId: string;
  title: string;
  type: ChallengeType;
  validationMode: ValidationMode;
  order: number;
  maxAttempts?: number;
  timeLimitSeconds?: number;
  config: TConfig;
}

export interface Episode<TChallenge extends Challenge = Challenge> {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  requiredEpisodes: string[];
  environment: EpisodeEnvironment;
  rewards: EpisodeReward;
  tasks: TChallenge[];
}

export interface ChallengeSubmission<TAnswer = unknown> {
  challengeId: string;
  answer: TAnswer;
  clientState?: Record<string, unknown>;
  submittedAt?: string;
}

export interface ChallengeResult {
  challengeId: string;
  status: "accepted" | "rejected" | "unavailable";
  passed: boolean;
  message: string;
  score?: number;
  details?: Record<string, unknown>;
}

export interface PlayerProgress {
  userId: string;
  activeEpisodeId?: string;
  episodes: Record<string, EpisodeState>;
  challenges: Record<string, ChallengeState>;
  updatedAt: string;
}
