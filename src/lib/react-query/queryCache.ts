import {
  QueryClient,
  dehydrate,
  hydrate,
  type Query,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "./queryKeys";

const CACHE_KEY = "memeflix:query-cache:v2";
const CACHE_MAX_AGE = 1000 * 60 * 60 * 12;
const PERSIST_DELAY = 750;

const PERSISTED_KEYS = new Set<string>([
  QUERY_KEYS.GET_RECENT_POSTS,
  QUERY_KEYS.GET_INFINITE_POSTS,
  QUERY_KEYS.GET_EXPLORE_POSTS,
  QUERY_KEYS.GET_POST_BY_ID,
  QUERY_KEYS.GET_USERS,
  QUERY_KEYS.GET_USER_BY_ID,
  QUERY_KEYS.SEARCH_POSTS,
  QUERY_KEYS.SEARCH_USERS,
]);

function shouldPersistQuery(query: Query) {
  const key = query.queryKey[0];
  return (
    typeof key === "string" &&
    PERSISTED_KEYS.has(key) &&
    query.state.status === "success"
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      gcTime: CACHE_MAX_AGE,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Reuse fresh persisted data, but refresh stale data when a screen mounts.      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

function restoreCache() {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw) as {
      timestamp: number;
      state: ReturnType<typeof dehydrate>;
    };

    if (!saved?.timestamp || Date.now() - saved.timestamp > CACHE_MAX_AGE) {
      window.localStorage.removeItem(CACHE_KEY);
      return;
    }

    hydrate(queryClient, saved.state);
  } catch {
    window.localStorage.removeItem(CACHE_KEY);
  }
}

let persistTimer: number | undefined;

function persistCache() {
  if (typeof window === "undefined") return;

  window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    try {
      const state = dehydrate(queryClient, {
        shouldDehydrateQuery: shouldPersistQuery,
      });

      const payload = JSON.stringify({
        timestamp: Date.now(),
        state,
      });

      // Keep the browser cache bounded. React Query remains the source of truth.
      if (payload.length > 3_500_000) return;

      window.localStorage.setItem(CACHE_KEY, payload);
    } catch {
      // Storage can be unavailable or full. The in-memory cache still works.
    }
  }, PERSIST_DELAY);
}

restoreCache();

if (typeof window !== "undefined") {
  queryClient.getQueryCache().subscribe(persistCache);
  window.addEventListener("pagehide", persistCache);
}

export function clearPersistedQueryCache() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(CACHE_KEY);
  }
  queryClient.clear();
}
