# Memeflix performance index plan

Create these indexes in Appwrite before production-scale traffic.

## posts

- created_at_desc: key `$createdAt`, DESC
- top_score_desc: key `topScore`, DESC
- trending_score_desc: key `trendingScore`, DESC
- creator_created_at: `creator`, `$createdAt` — ASC/DESC as supported by the query pattern

## likes

- post_user_unique: `post`, `user` — UNIQUE
- post_created_at: `post`, `$createdAt`

## saves

- post_user_unique: `post`, `user` — UNIQUE
- user_created_at: `user`, `$createdAt`

## follows

- follower_following_unique: `followerId`, `followingId` — UNIQUE
- following_created_at: `followingId`, `$createdAt`
- follower_created_at: `followerId`, `$createdAt`

## notifications

- receiver_created_at: `receiver`, `$createdAt`
- receiver_unread: `receiver`, `isRead`
- notification_dedupe: `type`, `sender`, `receiver`, `post` where the schema/query permits the exact uniqueness rule

## users

- account_id: `accountId` — UNIQUE
- username: `username` — UNIQUE
- created_at: `$createdAt`

## Notes

The exact index type/order should match the attributes and Appwrite query used by the deployed collection. Do not create duplicate indexes blindly; inspect existing indexes first.

The feed cache does not replace these indexes. Redis reduces repeated reads; Appwrite indexes keep cache misses fast.
