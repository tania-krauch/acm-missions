import cors from "@fastify/cors";
import Fastify from "fastify";
import { registerChallengeRoutes } from "./routes/challenges";
import { registerEpisodeRoutes } from "./routes/episodes";

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  credentials: true,
  origin: true,
});

app.setErrorHandler((error, _request, reply) => {
  const message = error instanceof Error ? error.message : String(error);

  if (message.toLowerCase().includes("supabase") || message.includes("token")) {
    return reply.code(401).send({ error: message });
  }

  app.log.error(error);
  return reply.code(500).send({ error: "Internal server error." });
});

app.get("/health", async () => ({
  status: "ok",
  service: "api",
}));

await registerEpisodeRoutes(app);
await registerChallengeRoutes(app);

const port = Number(process.env.PORT ?? 3000);

try {
  await app.listen({ host: "0.0.0.0", port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
