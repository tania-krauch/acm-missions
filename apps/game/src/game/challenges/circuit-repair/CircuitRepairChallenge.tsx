import { Send } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { submitChallengeAnswer } from "../../../lib/api";
import type { ChallengeComponentProps } from "../ChallengeRenderer";

interface CircuitNode {
  id: string;
  label: string;
  color: string;
}

export function CircuitRepairChallenge({ challenge, onResult }: ChallengeComponentProps) {
  const nodes = useMemo(() => {
    const config = challenge.config as { nodes?: CircuitNode[] };
    return config.nodes ?? [];
  }, [challenge.config]);
  const [calibratedNodes, setCalibratedNodes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allNodesOnline = calibratedNodes.length === nodes.length;

  async function handleSubmit() {
    setIsSubmitting(true);
    const result = await submitChallengeAnswer(challenge.id, {
      signal: allNodesOnline ? "relinked" : "unstable",
      calibratedNodes,
    });
    onResult(result);
    setIsSubmitting(false);
  }

  function toggleNode(nodeId: string) {
    setCalibratedNodes((current) =>
      current.includes(nodeId) ? current.filter((id) => id !== nodeId) : [...current, nodeId],
    );
  }

  return (
    <div className="challenge-grid challenge-grid-circuit">
      <section>
        <p className="challenge-copy">
          Reestablish connection between nodes. Avoid overload while the relay is unstable.
        </p>
        <div className="node-list">
          {nodes.map((node) => (
            <button
              key={node.id}
              className={
                calibratedNodes.includes(node.id)
                  ? `node-row node-row-${node.color} node-row-active`
                  : `node-row node-row-${node.color}`
              }
              onClick={() => toggleNode(node.id)}
            >
              <span>{node.id}</span>
              <code>{node.label}</code>
            </button>
          ))}
        </div>
      </section>

      <section className="circuit-board" aria-label="Circuit board">
        <div className="circuit-grid-lines" />
        {nodes.map((node, index) => (
          <span
            key={node.id}
            className={
              calibratedNodes.includes(node.id)
                ? `circuit-node circuit-node-${node.color} circuit-node-active`
                : `circuit-node circuit-node-${node.color}`
            }
            style={{ "--node-index": index } as CSSProperties}
          />
        ))}
        <span className={allNodesOnline ? "power-core power-core-online" : "power-core"} />
      </section>

      <button className="submit-button" disabled={isSubmitting} onClick={handleSubmit}>
        <Send size={16} />
        <span>{isSubmitting ? "Submitting" : "Submit"}</span>
      </button>
    </div>
  );
}
