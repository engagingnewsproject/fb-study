import firebase from 'firebase';

export const testAnalytics = () => {
    // Test reaction tracking
    firebase.analytics().logEvent('test_reaction', {
        reaction_type: 'like',
        post_id: 'test_post_1'
    });

    // Test comment tracking
    firebase.analytics().logEvent('test_comment', {
        post_id: 'test_post_1',
        comment_length: 25
    });

    // Test comment reaction tracking
    firebase.analytics().logEvent('test_comment_reaction', {
        post_id: 'test_post_1',
        reaction_type: 'love'
    });
};
