import type { Challenge, Episode, PlayerProgress } from "@acm/types";

export const sampleEpisodes: Episode[] = [
  {
    id: "episode-engineering-intro",
    title: "Engineering Bay: Cold Start",
    slug: "engineering-cold-start",
    description:
      "The ship wakes up in emergency lighting. Restore enough control to reach the navigation core.",
    order: 1,
    requiredEpisodes: [],
    environment: {
      room: "engineering",
      ambientEffects: ["coolant-leak", "short-circuit"],
    },
    rewards: {
      unlockEpisodes: ["episode-corrupted-archive"],
      inventoryItems: ["diagnostic-probe"],
      storyFlags: ["engineering-online"],
    },
    tasks: [
      {
        id: "repair-circuit-a",
        episodeId: "episode-engineering-intro",
        title: "Repair Circuit",
        type: "circuit-repair",
        validationMode: "server",
        order: 1,
        config: {
          gridSize: [8, 5],
          nodes: [
            { id: "A", label: "1101", color: "cyan" },
            { id: "B", label: "0110", color: "orange" },
            { id: "C", label: "1011", color: "green" },
            { id: "D", label: "0011", color: "violet" },
          ],
        },
      },
      {
        id: "restore-file-tree-a",
        episodeId: "episode-engineering-intro",
        title: "Reconstruct Directory",
        type: "file-tree-reconstruction",
        validationMode: "server",
        order: 2,
        config: {
          root: "/ship",
          entries: ["boot", "logs", "init.sys", "error.log"],
          targetSlots: 4,
        },
      },
      {
        id: "password-bridge-a",
        episodeId: "episode-engineering-intro",
        title: "Recover Access Code",
        type: "password-crack",
        validationMode: "server",
        order: 3,
        maxAttempts: 5,
        config: {
          prompt: "Bridge relay uses a legacy call sign plus checksum.",
          hints: ["Call sign prefix: ORBIT", "Checksum: 13"],
        },
      },
      {
        id: "telemetry-patch-a",
        episodeId: "episode-engineering-intro",
        title: "Patch Telemetry Parser",
        type: "code-submission",
        validationMode: "sandbox",
        order: 4,
        config: {
          language: "javascript",
          functionName: "repairPacket",
          prompt:
            "Write a function that accepts a corrupted telemetry packet string and returns the repaired value.",
        },
      },
    ],
  },
  {
    id: "episode-corrupted-archive",
    title: "Server Core: Corrupted Archive",
    slug: "corrupted-archive",
    description:
      "Recovered logs point to tampered mission records. Trace the archive before the next burn window.",
    order: 2,
    requiredEpisodes: ["episode-engineering-intro"],
    environment: {
      room: "server-core",
      ambientEffects: ["drive-spin", "data-glitch"],
    },
    rewards: {
      storyFlags: ["archive-indexed"],
    },
    tasks: [],
  },
];

export function listEpisodes(): Episode[] {
  return [...sampleEpisodes].sort((a, b) => a.order - b.order);
}

export function getEpisodeById(episodeId: string): Episode | undefined {
  return sampleEpisodes.find((episode) => episode.id === episodeId);
}

export function getChallengeById(challengeId: string): Challenge | undefined {
  return sampleEpisodes.flatMap((episode) => episode.tasks).find((task) => task.id === challengeId);
}

export function isEpisodeUnlocked(episode: Episode, progress?: PlayerProgress): boolean {
  if (episode.requiredEpisodes.length === 0) {
    return true;
  }

  if (!progress) {
    return false;
  }

  return episode.requiredEpisodes.every(
    (requiredEpisodeId) => progress.episodes[requiredEpisodeId] === "completed",
  );
}
