const gameBaseUrl = (import.meta.env.VITE_GAME_BASE_URL ?? "/game").replace(/\/$/, "");
const gamePath = import.meta.env.VITE_GAME_SIGN_IN_URL ?? `${gameBaseUrl}/sign-in`;

export default function App() {
  return (
    <main className="landing-screen">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-copy">
          <p className="landing-kicker">ACM Missions</p>
          <h1 id="landing-title">Hack the ship back together.</h1>
          <p>
            A web game about repairing broken systems, recovering corrupted data, and solving
            sequential shipboard challenges.
          </p>
          <div className="landing-actions">
            <a className="primary-link" href={gamePath}>
              Enter Game Shell
            </a>
            <span className="route-note">Registration and final landing page can replace this app.</span>
          </div>
        </div>
        <div className="ship-panel" aria-hidden="true">
          <div className="panel-light" />
          <div className="panel-grid">
            {Array.from({ length: 48 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="status-stack">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}
