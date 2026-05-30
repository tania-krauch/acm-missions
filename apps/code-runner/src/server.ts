import cors from "@fastify/cors";
import type { ChallengeResult } from "@acm/types";
import Fastify from "fastify";
import { z } from "zod";

const runRequestSchema = z.object({
  challengeId: z.string(),
  userId: z.string().optional(),
  answer: z.unknown(),
});

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: false,
});

app.get("/health", async () => ({
  status: "ok",
  service: "code-runner",
  execution: "placeholder",
}));

app.post("/run", async (request, reply) => {
  const parsed = runRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return reply.code(400).send({ error: "Invalid runner request." });
  }

  const result: ChallengeResult = {
    challengeId: parsed.data.challengeId,
    status: "unavailable",
    passed: false,
    message:
      "Code execution is intentionally not implemented yet. Add isolation before running user code.",
    details: {
      execution: "placeholder",
    },
  };

  return reply.code(501).send(result);
});

const port = Number(process.env.PORT ?? 4001);

try {
  await app.listen({ host: "0.0.0.0", port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
