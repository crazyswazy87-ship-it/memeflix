# Memeflix Redis cache function

Appwrite Function for the public hot-feed cache.

## Settings

- Runtime: Node.js 22
- Entrypoint: `src/main.js`
- Build command: `npm install`

## Function environment variables

Set these in Appwrite. Mark the Redis values as **Secret**:

- `APPWRITE_DATABASE_ID`
- `APPWRITE_POST_COLLECTION_ID`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

The function uses Appwrite's injected runtime endpoint/project ID and ephemeral function key. Do not put an Appwrite API key in Git.

## Endpoint

`GET ?resource=feed&mode=latest|top|trending&limit=20&cursor=<documentId>`

TTL:
- latest: 15 seconds
- top: 30 seconds
- trending: 30 seconds

## Frontend

After deploying the function, set:

`VITE_MEMEFLIX_CACHE_FUNCTION_URL=<function-url>`

The browser never receives Redis credentials.
