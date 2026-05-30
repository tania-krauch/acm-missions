import type { Challenge, ChallengeResult } from "@acm/types";
import { CircuitRepairChallenge } from "./circuit-repair/CircuitRepairChallenge";
import { CodeSubmissionChallenge } from "./code-submission/CodeSubmissionChallenge";
import { FileTreeChallenge } from "./file-tree/FileTreeChallenge";
import { PasswordCrackChallenge } from "./password-crack/PasswordCrackChallenge";

export interface ChallengeComponentProps {
  challenge: Challenge;
  onResult: (result: ChallengeResult) => void;
}

interface ChallengeRendererProps extends ChallengeComponentProps {}

export function ChallengeRenderer({ challenge, onResult }: ChallengeRendererProps) {
  switch (challenge.type) {
    case "circuit-repair":
      return <CircuitRepairChallenge challenge={challenge} onResult={onResult} />;
    case "file-tree-reconstruction":
      return <FileTreeChallenge challenge={challenge} onResult={onResult} />;
    case "password-crack":
      return <PasswordCrackChallenge challenge={challenge} onResult={onResult} />;
    case "code-submission":
      return <CodeSubmissionChallenge challenge={challenge} onResult={onResult} />;
    default:
      return <p>Unknown challenge type.</p>;
  }
}
