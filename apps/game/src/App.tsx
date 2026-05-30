import { sampleEpisodes } from "@acm/episode-engine";
import type { ChallengeResult } from "@acm/types";
import { useMemo, useState } from "react";
import { ChallengeRenderer } from "./game/challenges/ChallengeRenderer";
import { GameLayout } from "./game/shell/GameLayout";

export default function App() {
  const activeEpisode = sampleEpisodes[0];
  const sortedChallenges = useMemo(
    () => [...activeEpisode.tasks].sort((a, b) => a.order - b.order),
    [activeEpisode.tasks],
  );
  const [activeChallengeId, setActiveChallengeId] = useState(sortedChallenges[0]?.id);
  const [lastResult, setLastResult] = useState<ChallengeResult | undefined>();

  const activeChallenge =
    sortedChallenges.find((challenge) => challenge.id === activeChallengeId) ?? sortedChallenges[0];

  return (
    <GameLayout
      episode={activeEpisode}
      challenges={sortedChallenges}
      activeChallengeId={activeChallenge.id}
      lastResult={lastResult}
      onSelectChallenge={setActiveChallengeId}
    >
      <ChallengeRenderer challenge={activeChallenge} onResult={setLastResult} />
    </GameLayout>
  );
}
