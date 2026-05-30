import type { Challenge, ChallengeResult } from "@acm/types";
import type { AuthContext } from "./auth";

const expectedFileTree = ["/ship", "/ship/boot", "/ship/boot/init.sys", "/ship/logs/error.log"];
type SubmissionPayload = {
  answer: unknown;
  clientState?: Record<string, unknown>;
  submittedAt?: string;
};

export async function validateChallenge(
  challenge: Challenge,
  submission: SubmissionPayload,
  auth: AuthContext,
): Promise<ChallengeResult> {
  switch (challenge.validationMode) {
    case "client":
      return accept(challenge.id, "Client-side challenge completion recorded.");
    case "server":
      return validateServerChallenge(challenge, submission.answer);
    case "sandbox":
      return validateSandboxChallenge(challenge, submission.answer, auth);
    default:
      return reject(challenge.id, "Unsupported validation mode.");
  }
}

function validateServerChallenge(challenge: Challenge, answer: unknown): ChallengeResult {
  if (challenge.id === "repair-circuit-a") {
    const signal = readString(answer, "signal");
    return signal === "relinked"
      ? accept(challenge.id, "Circuit relay is stable.")
      : reject(challenge.id, "Circuit relay is still unstable.");
  }

  if (challenge.id === "restore-file-tree-a") {
    const tree = readStringArray(answer, "tree");
    const isCorrect =
      tree.length === expectedFileTree.length &&
      tree.every((entry, index) => entry === expectedFileTree[index]);

    return isCorrect
      ? accept(challenge.id, "Directory tree restored.")
      : reject(challenge.id, "Directory structure does not match the boot manifest.");
  }

  if (challenge.id === "password-bridge-a") {
    const password = readString(answer, "password");
    return password.trim().toUpperCase() === "ORBIT-13"
      ? accept(challenge.id, "Access code accepted.")
      : reject(challenge.id, "Access code rejected.");
  }

  return reject(challenge.id, "No server validator has been registered for this challenge.");
}

async function validateSandboxChallenge(
  challenge: Challenge,
  answer: unknown,
  auth: AuthContext,
): Promise<ChallengeResult> {
  if (process.env.SANDBOX_ENABLED !== "true") {
    return {
      challengeId: challenge.id,
      status: "unavailable",
      passed: false,
      message: "Sandbox validation is disabled for this environment.",
    };
  }

  const codeRunnerUrl = process.env.CODE_RUNNER_URL ?? "http://localhost:4001";
  const response = await fetch(`${codeRunnerUrl}/run`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      challengeId: challenge.id,
      answer,
      userId: auth.userId,
    }),
  });

  if (!response.ok) {
    return {
      challengeId: challenge.id,
      status: "unavailable",
      passed: false,
      message: "Code runner did not accept the submission.",
    };
  }

  const payload = (await response.json()) as ChallengeResult;
  return payload;
}

function accept(challengeId: string, message: string): ChallengeResult {
  return {
    challengeId,
    status: "accepted",
    passed: true,
    message,
    score: 1,
  };
}

function reject(challengeId: string, message: string): ChallengeResult {
  return {
    challengeId,
    status: "rejected",
    passed: false,
    message,
    score: 0,
  };
}

function readString(value: unknown, key: string): string {
  if (!isRecord(value)) {
    return "";
  }

  const rawValue = value[key];
  return typeof rawValue === "string" ? rawValue : "";
}

function readStringArray(value: unknown, key: string): string[] {
  if (!isRecord(value)) {
    return [];
  }

  const rawValue = value[key];
  return Array.isArray(rawValue) && rawValue.every((entry) => typeof entry === "string")
    ? rawValue
    : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
