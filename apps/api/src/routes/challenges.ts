import { getChallengeById } from "@acm/episode-engine";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authenticate } from "../services/auth";
import { validateChallenge } from "../services/challengeValidation";

const submissionSchema = z.object({
  answer: z.unknown(),
  clientState: z.record(z.unknown()).optional(),
  submittedAt: z.string().optional(),
});

export async function registerChallengeRoutes(app: FastifyInstance) {
  app.post<{ Params: { challengeId: string } }>(
    "/api/challenges/:challengeId/submit",
    async (request, reply) => {
      const auth = await authenticate(request);
      const challenge = getChallengeById(request.params.challengeId);

      if (!challenge) {
        return reply.code(404).send({ error: "Challenge not found." });
      }

      const parsed = submissionSchema.safeParse(request.body);

      if (!parsed.success) {
        return reply.code(400).send({ error: "Invalid challenge submission." });
      }

      const result = await validateChallenge(
        challenge,
        {
          answer: parsed.data.answer,
          clientState: parsed.data.clientState,
          submittedAt: parsed.data.submittedAt,
        },
        auth,
      );

      return reply.code(result.status === "unavailable" ? 503 : 200).send({ result });
    },
  );
}
