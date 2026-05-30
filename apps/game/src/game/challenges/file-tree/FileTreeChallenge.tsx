import { FolderTree, Send } from "lucide-react";
import { useState } from "react";
import { submitChallengeAnswer } from "../../../lib/api";
import type { ChallengeComponentProps } from "../ChallengeRenderer";

const fragments = ["/ship", "/ship/boot", "/ship/boot/init.sys", "/ship/logs/error.log"];

export function FileTreeChallenge({ challenge, onResult }: ChallengeComponentProps) {
  const [tree, setTree] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    const result = await submitChallengeAnswer(challenge.id, { tree });
    onResult(result);
    setIsSubmitting(false);
  }

  function appendFragment(fragment: string) {
    setTree((current) => (current.includes(fragment) ? current : [...current, fragment]));
  }

  return (
    <div className="challenge-stack">
      <p className="challenge-copy">
        Rebuild the boot directory so the ship can find the emergency startup script.
      </p>

      <div className="file-tree-layout">
        <section className="fragment-bank" aria-label="Available file fragments">
          {fragments.map((fragment) => (
            <button key={fragment} onClick={() => appendFragment(fragment)}>
              <FolderTree size={16} />
              <span>{fragment}</span>
            </button>
          ))}
        </section>

        <section className="tree-preview" aria-label="Reconstructed file tree">
          {tree.length === 0 ? <span className="empty-tree">/</span> : null}
          {tree.map((entry) => (
            <code key={entry}>{entry}</code>
          ))}
        </section>
      </div>

      <div className="challenge-actions">
        <button className="secondary-button" onClick={() => setTree([])}>
          Reset
        </button>
        <button className="submit-button" disabled={isSubmitting} onClick={handleSubmit}>
          <Send size={16} />
          <span>{isSubmitting ? "Submitting" : "Submit"}</span>
        </button>
      </div>
    </div>
  );
}
