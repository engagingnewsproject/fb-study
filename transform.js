// transform.js
const fs = require('fs');

// Read the Firebase export
const rawData = fs.readFileSync('cme-facebook-2-export.json', 'utf8');
const firebaseData = JSON.parse(rawData);

// Get only the data node which contains our log entries
const logEntries = firebaseData.data || {};

// Transform the data - flatten the nested structure
const transformed = Object.entries(logEntries).map(([key, entry]) => ({
    id: key,  // This will be the "userID|timestamp" key
    ip_address: entry.ip_address,
    message: entry.message,
    time: entry.time,
    type: entry.type,
    user: entry.user,
    post_id: entry.post_id,
    varied_post_in_feed: entry.varied_post_in_feed ? {
        community: {
            likes: entry.varied_post_in_feed.community?.likes,
            shares: entry.varied_post_in_feed.community?.shares
        },
        content: {
            caption: entry.varied_post_in_feed.content?.caption,
            image: entry.varied_post_in_feed.content?.image
        },
        meta: {
            endorsement: entry.varied_post_in_feed.meta?.endorsement,
            for: entry.varied_post_in_feed.meta?.for,
            politics: entry.varied_post_in_feed.meta?.politics,
            type: entry.varied_post_in_feed.meta?.type
        },
        post_id: entry.varied_post_in_feed?.post_id,
        post_type: entry.varied_post_in_feed?.post_type,
        reported: entry.varied_post_in_feed?.reported,
        shared: entry.varied_post_in_feed?.shared,
        time: entry.varied_post_in_feed?.time,
        user_id: entry.varied_post_in_feed?.user_id,
        warning: entry.varied_post_in_feed?.warning
    } : null
}));

// Write as JSONL
fs.writeFileSync(
    'transformed-data.jsonl',
    transformed.map(JSON.stringify).join('\n')
);