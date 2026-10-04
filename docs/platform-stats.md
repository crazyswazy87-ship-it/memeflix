# Platform stats

Create an Appwrite collection named `platform_stats` with document ID `global`.

Required numeric attributes:

- `users`
- `posts`
- `follows`
- `totalLikes`
- `totalSaves`
- `totalReposts`
- `totalEngagement`

The admin analytics client reads this one document first.

## Keeping it accurate

Do not calculate these totals in the browser.

Update counters from trusted server-side mutation paths:

- user creation: users +1
- user deletion: users -1
- post creation/deletion: posts +/-1
- follow/unfollow: follows +/-1
- like/unlike: totalLikes +/-1
- save/unsave: totalSaves +/-1
- repost/delete repost: totalReposts +/-1

`totalEngagement` should change by the same delta as likes + saves + reposts.

For an existing production database, run a one-time reconciliation job to initialize the counters before switching the admin dashboard fully to this path.

## Important

The client has a backward-compatible fallback while this collection is not available. Once `global` exists and is populated, analytics stops downloading the 1000-post sample for aggregate totals.
