import { KeyRound, Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { submitChallengeAnswer } from "../../../lib/api";
import type { ChallengeComponentProps } from "../ChallengeRenderer";

export function PasswordCrackChallenge({ challenge, onResult }: ChallengeComponentProps) {
  const config = useMemo(
    () => challenge.config as { prompt?: string; hints?: string[] },
    [challenge.config],
  );
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await submitChallengeAnswer(challenge.id, { password });
    setAttempts((current) => current + 1);
    onResult(result);
    setIsSubmitting(false);
  }

  return (
    <form className="challenge-stack" onSubmit={handleSubmit}>
      <p className="challenge-copy">{config.prompt}</p>

      <div className="hint-grid">
        {(config.hints ?? []).map((hint) => (
          <span key={hint}>{hint}</span>
        ))}
      </div>

      <label className="password-field">
        <KeyRound size={20} />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="ACCESS-CODE"
          autoComplete="off"
        />
      </label>

      <div className="challenge-actions">
        <span className="attempt-counter">
          Attempts {attempts}/{challenge.maxAttempts ?? "-"}
        </span>
        <button className="submit-button" disabled={isSubmitting || password.length === 0}>
          <Send size={16} />
          <span>{isSubmitting ? "Submitting" : "Submit"}</span>
        </button>
      </div>
    </form>
  );
}
