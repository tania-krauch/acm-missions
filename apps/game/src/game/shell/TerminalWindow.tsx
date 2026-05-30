import anime from "animejs";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface TerminalWindowProps {
  title: string;
  children: ReactNode;
}

export function TerminalWindow({ title, children }: TerminalWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current) {
      return;
    }

    anime({
      targets: panelRef.current,
      opacity: [0.82, 1],
      translateY: [8, 0],
      duration: 420,
      easing: "easeOutQuad",
    });
  }, [title]);

  return (
    <div className="terminal-window" ref={panelRef}>
      <header className="terminal-header">
        <span>Terminal</span>
        <button aria-label="Close terminal">x</button>
      </header>
      <div className="terminal-title">{title}</div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
