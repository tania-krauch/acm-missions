const configuredGameBaseUrl =
  import.meta.env.VITE_GAME_BASE_URL ??
  import.meta.env.VITE_PUBLIC_GAME_BASE_URL ??
  import.meta.env.VITE_GAME_BASE_PATH ??
  import.meta.env.BASE_URL ??
  "/game/";

const gameBaseUrl = trimTrailingSlash(
  new URL(configuredGameBaseUrl, window.location.origin).toString(),
);
const gameBasePath = trimTrailingSlash(new URL(gameBaseUrl).pathname);

export const gameRoutePaths = {
  signIn: joinPath(gameBasePath, "sign-in"),
  signUp: joinPath(gameBasePath, "sign-up"),
  play: joinPath(gameBasePath, "play"),
};

export const gameRouteUrls = {
  signIn: joinUrl(gameBaseUrl, "sign-in"),
  signUp: joinUrl(gameBaseUrl, "sign-up"),
  play: joinUrl(gameBaseUrl, "play"),
};

function joinPath(basePath: string, segment: string): string {
  return `${basePath || ""}/${segment}`.replace(/\/{2,}/g, "/");
}

function joinUrl(baseUrl: string, segment: string): string {
  return `${trimTrailingSlash(baseUrl)}/${segment}`;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}
