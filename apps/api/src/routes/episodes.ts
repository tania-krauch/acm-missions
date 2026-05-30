import { getEpisodeById, listEpisodes } from "@acm/episode-engine";
import type { FastifyInstance } from "fastify";
import { authenticate } from "../services/auth";

export async function registerEpisodeRoutes(app: FastifyInstance) {
  app.get("/api/episodes", async () => ({
    episodes: listEpisodes(),
  }));

  app.get<{ Params: { episodeId: string } }>("/api/episodes/:episodeId", async (request, reply) => {
    const episode = getEpisodeById(request.params.episodeId);

    if (!episode) {
      return reply.code(404).send({ error: "Episode not found." });
    }

    return { episode };
  });

  app.post<{ Params: { episodeId: string } }>(
    "/api/episodes/:episodeId/start",
    async (request, reply) => {
      const auth = await authenticate(request);
      const episode = getEpisodeById(request.params.episodeId);

      if (!episode) {
        return reply.code(404).send({ error: "Episode not found." });
      }

      return {
        episodeId: episode.id,
        userId: auth.userId,
        state: "started",
        message: "Progress persistence will be connected to Supabase next.",
      };
    },
  );

  app.get("/api/progress/me", async (request) => {
    const auth = await authenticate(request);

    return {
      progress: {
        userId: auth.userId,
        activeEpisodeId: "episode-engineering-intro",
        episodes: {
          "episode-engineering-intro": "in_progress",
        },
        challenges: {},
        updatedAt: new Date().toISOString(),
      },
    };
  });
}
