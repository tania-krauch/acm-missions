import { sampleEpisodes } from "@acm/episode-engine";
import type { ChallengeResult } from "@acm/types";
import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthScreen, type AuthMode } from "./game/auth/AuthScreen";
import { ChallengeRenderer } from "./game/challenges/ChallengeRenderer";
import { GameLayout } from "./game/shell/GameLayout";
import { gameRoutePaths } from "./lib/routes";
import { supabase } from "./lib/supabase";

type GameRoute = "sign-in" | "sign-up" | "play" | "unknown";

export default function App() {
  const activeEpisode = sampleEpisodes[0];
  const sortedChallenges = useMemo(
    () => [...activeEpisode.tasks].sort((a, b) => a.order - b.order),
    [activeEpisode.tasks],
  );
  const [activeChallengeId, setActiveChallengeId] = useState(sortedChallenges[0]?.id);
  const [lastResult, setLastResult] = useState<ChallengeResult | undefined>();
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(supabase));
  const [pathname, setPathname] = useState(window.location.pathname);

  const activeChallenge =
    sortedChallenges.find((challenge) => challenge.id === activeChallengeId) ?? sortedChallenges[0];
  const playerName = readPlayerName(session);
  const route = readGameRoute(pathname);
  const authMode: AuthMode = route === "sign-up" ? "sign-up" : "sign-in";
  const navigate = useCallback((path: string, replace = false) => {
    if (window.location.pathname === path) {
      setPathname(path);
      return;
    }

    if (replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }

    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (session && route !== "play") {
      navigate(gameRoutePaths.play, true);
      return;
    }

    if (!session && route !== "sign-in" && route !== "sign-up") {
      navigate(gameRoutePaths.signIn, true);
    }
  }, [isAuthLoading, navigate, route, session]);

  if (isAuthLoading || !session) {
    return (
      <AuthScreen
        mode={authMode}
        isLoading={isAuthLoading}
        onModeChange={(nextMode) =>
          navigate(nextMode === "sign-in" ? gameRoutePaths.signIn : gameRoutePaths.signUp)
        }
      />
    );
  }

  return (
    <GameLayout
      episode={activeEpisode}
      challenges={sortedChallenges}
      activeChallengeId={activeChallenge.id}
      lastResult={lastResult}
      playerName={playerName}
      onSelectChallenge={setActiveChallengeId}
      onSignOut={() => {
        navigate(gameRoutePaths.signIn, true);
        void supabase?.auth.signOut();
      }}
    >
      <ChallengeRenderer challenge={activeChallenge} onResult={setLastResult} />
    </GameLayout>
  );
}

function readPlayerName(session: Session | null): string {
  const callsign = session?.user.user_metadata.callsign;

  if (typeof callsign === "string" && callsign.trim()) {
    return callsign.trim();
  }

  return session?.user.email?.split("@")[0] || "Pixel";
}

function readGameRoute(pathname: string): GameRoute {
  if (pathname === gameRoutePaths.signIn) {
    return "sign-in";
  }

  if (pathname === gameRoutePaths.signUp) {
    return "sign-up";
  }

  if (pathname === gameRoutePaths.play) {
    return "play";
  }

  return "unknown";
}
