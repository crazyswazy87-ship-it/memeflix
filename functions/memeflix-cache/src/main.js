import { Redis } from "@upstash/redis";
import { Client, Databases, Query } from "node-appwrite";

const TTL = { latest: 15, top: 30, trending: 30 };

function getRedis() {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  return url && token ? new Redis({ url, token, enableTelemetry: false }) : null;
}

function getDatabases(req) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers["x-appwrite-key"]);

  return new Databases(client);
}

function respond(res, body, status = 200) {
  return res.json(body, status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=5, stale-while-revalidate=25",
  });
}

export default async ({ req, res, error }) => {
  if (req.method === "OPTIONS") return respond(res, { ok: true });
  if (req.method !== "GET") return respond(res, { ok: false, error: "Method not allowed" }, 405);

  const resource = req.query?.resource ?? "feed";
  const mode = ["latest", "top", "trending"].includes(req.query?.mode)
    ? req.query.mode
    : "latest";

  if (resource !== "feed") return respond(res, { ok: false, error: "Unknown resource" }, 400);

  const limit = Math.min(Math.max(Number(req.query?.limit ?? 20), 1), 30);
  const cursor = req.query?.cursor || "";
  const cacheKey = `memeflix:feed:v1:${mode}:${limit}:${cursor || "first"}`;
  const redis = getRedis();

  try {
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return respond(res, { ...cached, cache: "hit" });
    }

    const databases = getDatabases(req);
    const queries = [
      Query.limit(limit),
      Query.select([
        "*",
        "creator.$id",
        "creator.name",
        "creator.username",
        "creator.imageUrl",
        "creator.isVerified",
      ]),
      Query.orderDesc(
        mode === "top" ? "topScore" :
        mode === "trending" ? "trendingScore" :
        "$createdAt"
      ),
    ];

    if (cursor) queries.push(Query.cursorAfter(cursor));

    const result = await databases.listDocuments({
      databaseId: process.env.APPWRITE_DATABASE_ID,
      collectionId: process.env.APPWRITE_POST_COLLECTION_ID,
      queries,
    });

    const payload = {
      documents: result.documents,
      total: result.total,
      nextCursor: result.documents.length === limit
        ? result.documents[result.documents.length - 1].$id
        : null,
    };

    if (redis) await redis.set(cacheKey, payload, { ex: TTL[mode] });

    return respond(res, { ...payload, cache: "miss" });
  } catch (err) {
    error(String(err));
    return respond(res, { ok: false, error: "Cache API failed" }, 500);
  }
};
