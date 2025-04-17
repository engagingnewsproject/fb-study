import config from '../config';
import firebase from 'firebase';
import app from "../util/firebase.js";

class Logger {
    static log_action(type, message, details = {}) {
        let { user_id, ip_address, time, iso, varied } = get_meta_details();

        let { post_id, article_id, comment, reporting_reason, reaction_type } = details;

        let log_obj = {
            "user": user_id,
            "ip_address": ip_address,
            "time": time,
            "type": type,
            "message": message,
            "varied_post_in_feed": varied,
            "post_id": post_id || null,
            "article_id": article_id || null,
            "comment": comment || null,
            "reporting_reason": reporting_reason || null,
            "reaction_type": reaction_type || null
        };

        // Log to Firebase Analytics
        if (type === 'reaction') {
            firebase.analytics().logEvent('reaction', {
                reaction_type: reaction_type,
                post_id: post_id
            });
        } else if (type === 'comment') {
            firebase.analytics().logEvent('comment', {
                post_id: post_id,
                comment_length: comment ? comment.length : 0
            });
        }

        let id = `${user_id}|${iso}`;
        push_to_firebase(id, log_obj);
    }
}



function push_to_firebase(id, object) {
    firebase.database().ref(`data/${id}`).set(object);
}


function get_meta_details() {
    let date = new Date();
    let time = date.toString();
    let iso = date.toISOString().substring(0, date.toISOString().indexOf('.'));
    return {
        user_id: localStorage.getItem('user_id'),
        ip_address: localStorage.getItem('ip_address'),
        varied: JSON.parse(localStorage.getItem('varied_post')),
        time: time,
        iso: iso
    };

}

export default Logger;