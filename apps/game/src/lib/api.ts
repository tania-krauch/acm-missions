import type { ChallengeResult } from "@acm/types";
import { supabase } from "./supabase";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ??
  import.meta.env.VITE_PUBLIC_API_BASE_URL ??
  import.meta.env.VITE_API_URL ??
  "/api"
).replace(/\/$/, "");

export async function submitChallengeAnswer(
  challengeId: string,
  answer: unknown,
): Promise<ChallengeResult> {
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  } else {
    headers["x-player-id"] = "dev-player";
  }

  const response = await fetch(`${apiBaseUrl}/challenges/${challengeId}/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      answer,
      submittedAt: new Date().toISOString(),
    }),
  });

  const payload = (await response.json()) as { result?: ChallengeResult; error?: string };

  if (payload.result) {
    return payload.result;
  }

  return {
    challengeId,
    status: "rejected",
    passed: false,
    message: payload.error ?? "Challenge submission failed.",
  };
}

async function getAccessToken(): Promise<string | undefined> {
  if (!supabase) {
    return undefined;
  }

  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}
