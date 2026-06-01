import { KeyRound, Mail, RadioTower, UserPlus } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { gameRouteUrls } from "../../lib/routes";
import { supabase, supabaseMissingKeys } from "../../lib/supabase";

export type AuthMode = "sign-in" | "sign-up";

interface AuthScreenProps {
  mode: AuthMode;
  isLoading?: boolean;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthScreen({ mode, isLoading = false, onModeChange }: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callsign, setCallsign] = useState("");
  const [message, setMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = supabaseMissingKeys.length === 0 && Boolean(supabase);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!supabase) {
      setMessage(`Missing Supabase config: ${supabaseMissingKeys.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage(undefined);

    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                callsign: callsign.trim() || undefined,
              },
              emailRedirectTo: gameRouteUrls.play,
            },
          });

    if (result.error) {
      setMessage(result.error.message);
    } else if (mode === "sign-up" && !result.data.session) {
      setMessage("Account created. Check your email to confirm before signing in.");
    } else {
      setMessage("Identity link established.");
    }

    setIsSubmitting(false);
  }

  return (
    <main className="auth-screen">
      <section className="auth-shell" aria-label="ACM Missions authentication">
        <div className="auth-copy">
          <p className="auth-kicker">ACM Missions</p>
          <h1>Access the mission console.</h1>
          <p>
            Sign in with your crew account or create one to begin saving mission progress through
            Supabase.
          </p>
        </div>

        <form className="auth-console" onSubmit={handleSubmit}>
          <div className="auth-console-header">
            <RadioTower size={18} />
            <span>{mode === "sign-in" ? "Sign In" : "Create Account"}</span>
          </div>

          <div className="auth-mode-switch" aria-label="Authentication mode">
            <button
              type="button"
              className={mode === "sign-in" ? "auth-mode-active" : ""}
              onClick={() => onModeChange("sign-in")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === "sign-up" ? "auth-mode-active" : ""}
              onClick={() => onModeChange("sign-up")}
            >
              Sign Up
            </button>
          </div>

          {mode === "sign-up" ? (
            <label className="auth-field">
              <UserPlus size={18} />
              <input
                value={callsign}
                onChange={(event) => setCallsign(event.target.value)}
                placeholder="Callsign"
                autoComplete="nickname"
              />
            </label>
          ) : null}

          <label className="auth-field">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            <KeyRound size={18} />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>

          {!isConfigured ? (
            <div className="auth-alert">
              Add {supabaseMissingKeys.join(" and ")} to the game environment before connecting.
            </div>
          ) : null}

          {message ? <div className="auth-message">{message}</div> : null}

          <button
            className="auth-submit"
            disabled={!isConfigured || isSubmitting || isLoading}
            type="submit"
          >
            {isLoading || isSubmitting
              ? "Syncing"
              : mode === "sign-in"
                ? "Enter Console"
                : "Create Crew Account"}
          </button>
        </form>

        <div className="auth-panel" aria-hidden="true">
          <div className="auth-panel-light" />
          <div className="auth-panel-grid">
            {Array.from({ length: 40 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="auth-panel-status">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}
