import type { ChallengeResult } from "@acm/types";

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export async function submitChallengeAnswer(
  challengeId: string,
  answer: unknown,
): Promise<ChallengeResult> {
  const response = await fetch(`${apiBaseUrl}/challenges/${challengeId}/submit`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-player-id": "dev-player",
    },
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
