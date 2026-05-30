import { Play, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { submitChallengeAnswer } from "../../../lib/api";
import type { ChallengeComponentProps } from "../ChallengeRenderer";

const starterCode = `export function repairPacket(packet) {
  return packet;
}`;

export function CodeSubmissionChallenge({ challenge, onResult }: ChallengeComponentProps) {
  const config = useMemo(
    () =>
      challenge.config as {
        language?: string;
        functionName?: string;
        prompt?: string;
      },
    [challenge.config],
  );
  const [source, setSource] = useState(starterCode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    const result = await submitChallengeAnswer(challenge.id, {
      language: config.language ?? "javascript",
      functionName: config.functionName,
      source,
    });
    onResult(result);
    setIsSubmitting(false);
  }

  return (
    <div className="challenge-stack">
      <p className="challenge-copy">{config.prompt}</p>

      <div className="code-toolbar">
        <span>
          <Play size={16} />
          {config.language ?? "javascript"}
        </span>
        <code>{config.functionName}</code>
      </div>

      <textarea
        className="code-editor"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        spellCheck={false}
      />

      <div className="challenge-actions">
        <span className="sandbox-note">Sandbox route is scaffolded and disabled by default.</span>
        <button className="submit-button" disabled={isSubmitting} onClick={handleSubmit}>
          <Send size={16} />
          <span>{isSubmitting ? "Submitting" : "Submit"}</span>
        </button>
      </div>
    </div>
  );
}
