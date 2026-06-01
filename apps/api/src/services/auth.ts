import { createClient } from "@supabase/supabase-js";
import type { FastifyRequest } from "fastify";

export interface AuthContext {
  userId: string;
  mode: "mock" | "supabase";
}

export async function authenticate(request: FastifyRequest): Promise<AuthContext> {
  const authMode = process.env.AUTH_MODE ?? "mock";

  if (authMode === "mock") {
    const header = request.headers["x-player-id"];
    const userId = Array.isArray(header) ? header[0] : header;

    return {
      userId: userId ?? "dev-player",
      mode: "mock",
    };
  }

  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Missing Supabase bearer token.");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const token = authorization.slice("Bearer ".length);
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Error("Invalid Supabase user token.");
  }

  return {
    userId: data.user.id,
    mode: "supabase",
  };
}
