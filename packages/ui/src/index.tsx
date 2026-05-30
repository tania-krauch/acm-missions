import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface StatusPillProps {
  tone?: "cyan" | "green" | "orange" | "magenta" | "red";
  children: ReactNode;
}

export function StatusPill({ tone = "cyan", children }: StatusPillProps) {
  return <span className={`acm-status-pill acm-status-pill-${tone}`}>{children}</span>;
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, children, className = "", ...props }: IconButtonProps) {
  return (
    <button className={`acm-icon-button ${className}`.trim()} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
