import type { Challenge, ChallengeResult, Episode } from "@acm/types";
import { IconButton, StatusPill } from "@acm/ui";
import { HelpCircle, Map, RadioTower, ShieldAlert, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { TerminalWindow } from "./TerminalWindow";

interface GameLayoutProps {
  episode: Episode;
  challenges: Challenge[];
  activeChallengeId: string;
  lastResult?: ChallengeResult;
  children: ReactNode;
  onSelectChallenge: (challengeId: string) => void;
}

export function GameLayout({
  episode,
  challenges,
  activeChallengeId,
  lastResult,
  children,
  onSelectChallenge,
}: GameLayoutProps) {
  const activeChallenge = challenges.find((challenge) => challenge.id === activeChallengeId);

  return (
    <main className="game-screen">
      <div className="ship-room" aria-label="Spaceship mission console">
        <aside className="task-panel" aria-label="Episode tasks">
          <div className="panel-heading">
            <RadioTower size={18} />
            <span>Tasks</span>
          </div>
          <div className="task-list">
            {challenges.map((challenge) => (
              <button
                key={challenge.id}
                className={challenge.id === activeChallengeId ? "task-row task-row-active" : "task-row"}
                onClick={() => onSelectChallenge(challenge.id)}
              >
                <span>{challenge.title}</span>
                <small>{challenge.validationMode}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="terminal-zone">
          <TerminalWindow title={activeChallenge?.title ?? episode.title}>{children}</TerminalWindow>
        </section>

        <aside className="map-panel" aria-label="Ship map">
          <div className="map-grid">
            <span className="map-room map-room-active" />
            <span className="map-room" />
            <span className="map-room" />
            <span className="map-room map-room-alert" />
          </div>
          <StatusPill tone="cyan">{episode.environment.room}</StatusPill>
        </aside>

        <section className="player-hud" aria-label="Player status">
          <div className="avatar-chip">
            <Zap size={28} />
          </div>
          <div>
            <strong>Pixel</strong>
            <div className="health-bar">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>

        <section className="inventory-bar" aria-label="Inventory">
          {Array.from({ length: 6 }).map((_, index) => (
            <button key={index} className="inventory-slot" aria-label={`Inventory slot ${index + 1}`} />
          ))}
        </section>

        <section className="system-actions" aria-label="System actions">
          <IconButton label="Open help">
            <HelpCircle size={30} />
          </IconButton>
          <IconButton label="Open map">
            <Map size={30} />
          </IconButton>
        </section>

        {lastResult ? (
          <div className={lastResult.passed ? "result-toast result-toast-good" : "result-toast"}>
            <ShieldAlert size={18} />
            <span>{lastResult.message}</span>
          </div>
        ) : null}
      </div>
    </main>
  );
}
