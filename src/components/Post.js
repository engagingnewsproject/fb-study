import React, { Component } from 'react';
import default_avatar from '../img/anon.jpg';
import { getImageURL } from '../util/util';
import '../css/post.css';
import Logger from '../logging/Logger';
import * as timeago from 'timeago.js';
import firebase from '../util/firebase';

import Reactions from './Reactions';


const reacts = [
    { id: 'like', description: 'Like', img: 'http://i.imgur.com/LwCYmcM.gif' },
    { id: 'love', description: 'Love', img: 'http://i.imgur.com/k5jMsaH.gif' },
    { id: 'haha', description: 'Haha', img: 'http://i.imgur.com/f93vCxM.gif' },
    { id: 'wow', description: 'Wow', img: 'http://i.imgur.com/9xTkN93.gif' },
    { id: 'sad', description: 'Sad', img: 'http://i.imgur.com/tFOrN5d.gif' },
    { id: 'angry', description: 'Angry', img: 'http://i.imgur.com/1MgcQg0.gif' },
    { id: 'close', img: 'https://www.materialui.co/materialIcons/navigation/close_black_256x256.png' }
];

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
            reaction: null,
            post: this.props.post,
            currentComment: "",
            comments: [],
        };
        let time = new Date();
        time.setHours(time.getHours() - (this.props.index * (Math.random() * 3) + 1));
        this.state.post.time = time;
    }

    getAvatarForUser = (user_id) => {
        let user_obj = this.props.getUserObj(user_id);
        return user_obj ? getImageURL('user', user_obj.avatar_url) : default_avatar;
    };

    toggleDropdown = () => {
        let { showDropdown } = this.state;
        this.setState({ showDropdown: !showDropdown });
    };

    submitComment = (event) => {
        if (event.key === 'Enter' && this.state.currentComment) {
            Logger.log_action('comment', 'submit', { 
                post_id: this.state.post.post_id, 
                comment: this.state.currentComment 
            });
            
            // Log to Firebase Analytics
            firebase.analytics().logEvent('comment_submit', {
                post_id: this.state.post.post_id,
                comment_length: this.state.currentComment.length
            });

            let comment_obj = {
                "user_id": "Me",
                "time": "now",
                "content": this.state.currentComment,
                "reaction": null,
            };
            this.setState({ comments: [...this.state.comments, comment_obj], currentComment: '' });
        }
    };

    onUpdate = (id) => {
        let reaction = reacts.filter(e => e.id === id)[0];
        if ((this.state.reaction && this.state.reaction.id === id) || id === 'close') {
            reaction = null;
            if (this.state.reaction) {
                Logger.log_action('reaction', `undo ${this.state.reaction.id}`, { 
                    post_id: this.props.post.post_id,
                    reaction_type: this.state.reaction.id 
                });
            }
        }
        this.setState({
            reaction: reaction,
        }, () => {
            if (this.state.reaction) {
                Logger.log_action('reaction', `set ${this.state.reaction.id}`, { 
                    post_id: this.props.post.post_id,
                    reaction_type: this.state.reaction.id 
                });
                
                // Log to Firebase Analytics
                firebase.analytics().logEvent('reaction_set', {
                    post_id: this.props.post.post_id,
                    reaction_type: this.state.reaction.id
                });
            }
        });
    };

    onCommentReact = (id, comment_index) => {
        let reaction = reacts.filter(e => e.id === id)[0];
        let comments = this.state.comments;
        let curr_com = comments[comment_index];
        if ((curr_com.reaction && curr_com.reaction.id === id) || id === 'close') {
            reaction = null;
            if (curr_com.reaction) {
                Logger.log_action('reaction', `comment: undo ${curr_com.reaction.id}`, { 
                    post_id: this.props.post.post_id, 
                    comment: curr_com.content,
                    reaction_type: curr_com.reaction.id
                });
            }
        }
        comments[comment_index].reaction = reaction;
        this.setState({ comments: comments }, () => {
            if (curr_com.reaction) {
                Logger.log_action('reaction', `comment: set ${curr_com.reaction.id}`, { 
                    post_id: this.props.post.post_id, 
                    comment: curr_com.content,
                    reaction_type: curr_com.reaction.id
                });
                
                // Log to Firebase Analytics
                firebase.analytics().logEvent('comment_reaction_set', {
                    post_id: this.props.post.post_id,
                    reaction_type: curr_com.reaction.id
                });
            }
        });
    };

    printReactions = (reacts_list) => {
        return reacts_list.map(react => `${react["id"]}:${react["user_id"]}`).join(',');
    };

    render() {
        let { post } = this.state;
        let user_obj = this.props.getUserObj(post.user_id);
        if (post && user_obj) {
            return (
                <article className="post">
                    <div className="post__inner">
                        <header className="post__header">
                            <div className="post__author-avatar-wrap">
                                <img className="post__author-avatar" src={this.getAvatarForUser(post.user_id)} alt={`${user_obj.full_name}'s avatar`} />
                            </div>
                            <div className="post__author-wrap">
                                <h2 className="post__author-name">{user_obj.full_name}</h2>
                                <p className="post__time">{timeago.format(post.time)}</p>
                            </div>
                        </header>
                        <button className="post_show-dropdown" onClick={this.toggleDropdown}><i className="i-post i-chevron-down"></i></button>
                        {this.state.showDropdown &&
                            <ul className="post__dropdown">
                                <li className="dropdown__item">
                                    <a href="#" className="post__hide-post dropdown__item-link" onClick={(e) => { e.preventDefault(); this.props.hidePost(post.post_id); }}>
                                        <i className="i-hide-post dropdown__item-icon"></i>
                                        <div className="dropdown__item-inner">
                                            <h4 className="dropdown__item-title" >Hide Post</h4>
                                            <p className="dropdown__item-help">See fewer posts like this.</p>
                                        </div>
                                    </a>
                                </li>
                                <li className="dropdown__item">
                                    <a href="#" className="post__report-post dropdown__item-link" onClick={(e) => { e.preventDefault(); this.props.toggleReport(post.post_id); }}>
                                        <i className="i-report-post dropdown__item-icon"></i>
                                        <div className="dropdown__item-inner">
                                            <h4 className="dropdown__item-title">Report Post</h4>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        }
                        <p className="post__content">{post.content.caption}</p>
                        {this.state.post.post_type === "photo" &&
                            <div className="post__photo">
                                <div className="link__image-wrap">
                                    <img src={getImageURL('post', post.content.image)} className="photo__image" alt={post.content.caption || 'Post image'} />
                                </div>
                            </div>
                        }
                        {this.state.post.post_type === "article" &&
                            <div className="post__link">
                                <a href="#" className="link" onClick={(e) => { e.preventDefault(); this.props.toggleArticle(post.content.article_id); }}>
                                    <div className="link__image-wrap">
                                        <img src={getImageURL('post', post.content.image)} className="link__image" alt={post.content.title || 'Article thumbnail'} />
                                    </div>
                                    <div className="link__content">
                                        <h4 className="link__title">{post.content.title}</h4>
                                        <p className="link__source">{post.content.source}</p>
                                    </div>
                                </a>
                            </div>
                        }
                        <ul className="post__action-bar">
                            <li>
                                <Reactions items={reacts} onUpdate={this.onUpdate}>
                                    <a className="post__like">
                                        {post.community && 
                                            <span className={`footer__text post__like-text ${this.state.reaction ? this.state.reaction.id : ""}`}>
                                                <img className="react-image" src={reacts[0].img} alt={reacts[0].description} /> 
                                                <img className="react-image" src={reacts[1].img} alt={reacts[1].description} /> 
                                                <img className="react-image" src={reacts[2].img} alt={reacts[2].description} /> 
                                            </span>
                                        }
                                        {!post.community && 
                                            <span>
                                                {this.state.reaction ?
                                                    <span>
                                                        <span> <img className="react-image" src={this.state.reaction.img} alt={this.state.reaction.description} /> </span>
                                                        <span className={`footer__text post__like-text ${this.state.reaction ? this.state.reaction.id : ""}`}>1</span>
                                                    </span>
                                                    :
                                                    <span className="footer__text post__like-text">Like</span>
                                                }
                                            </span>
                                        }
                                        
                                        {post.community && post.community.likes > 999 &&
                                            <span className="post__time num_likes" >{(post.community.likes/1000).toLocaleString() + "K"}</span>
                                        }
                                        {post.community && post.community.likes <= 999 &&
                                            <span className="post__time num_likes" >{(post.community.likes + (this.state.reaction ? 1 : 0)).toLocaleString()}</span>
                                        }
                                    </a>
                                </Reactions>
                            </li>
                            <li>
                                <a href="#" className="post__go-comment" onClick={(e) => { e.preventDefault(); }}>
                                    <i className="i-comment"></i>
                                    <span className="footer__text post__comment-text">Comment</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="post__share" onClick={(e) => { e.preventDefault(); this.state.post.is_shared ? this.props.sharePost(post.post_id, true) : this.props.toggleShare(post.post_id); }}>
                                    {this.state.post.is_shared ?
                                        <span className={`footer__text post__share-text shared`}>Undo Share</span>
                                        :
                                        <span>
                                            <i className="i-share"></i>
                                            <span className={`footer__text post__share-text`}>Share</span>
                                        </span>
                                    }
                                    {post.community && post.community.shares > 999 && 
                                        <span className="post__time num_likes" >{(post.community.shares/1000).toLocaleString() + "K shares"}</span>
                                    }
                                    {post.community && post.community.shares <= 999 && 
                                        <span className="post__time num_likes" >
                                            {(post.community.shares + (post.is_shared ? 1 : 0)).toLocaleString() + " share"}
                                        </span>
                                    }
                                    {post.community && post.community.shares === 1 && post.is_shared && 
                                        <span style={{color: "#90949c"}}>s</span>} 
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="comments">
                        {post.reacts && post.reacts.length > 0 &&
                            < div className="post__like-display">
                                {this.printReactions(post.reacts)}
                            </div>
                        }
                        {post.comments && post.comments.map(comment => (
                            <article className="comment">
                                <div className="comment__author-avatar-wrap">
                                    <img className="comment__author-avatar" src={this.getAvatarForUser(comment.user_id)} />
                                </div>
                                <div className="comment__post">
                                    <div className="comment__content-wrap">
                                        <h3 className="comment__author-name">{comment.user_id}</h3>
                                        <p className="comment__content">
                                            {comment.content}
                                        </p>
                                    </div>
                                    <button className="comment__like">{this.printReactions(comment.reacts)}</button>
                                    <span className="dot comment__dot"> &middot; </span>
                                    <span className="comment__time">{comment.time}</span>
                                    {comment.reacts.length > 0 &&
                                        <template>
                                            <span className="dot comment__dot"> &middot; </span>
                                            <span className="comment__like-count">
                                                <i className="i-small i-like"></i>
                                                {comment.reacts.length}
                                            </span>
                                        </template>
                                    }
                                </div>
                            </article >
                        ))}
                        {this.state.comments && this.state.comments.map((comment, index) => (
                            <article className="comment">
                                <div className="comment__author-avatar-wrap">
                                    <img className="comment__author-avatar" src={this.getAvatarForUser(comment.user_id)} />
                                </div>
                                <div className="comment__post">
                                    <div className="comment__content-wrap">
                                        <h3 className="comment__author-name me-comment">{comment.user_id}</h3>
                                        <p className="comment__content">
                                            {comment.content}
                                        </p>
                                    </div>
                                    <span>
                                        <a className="comment__like">
                                            <Reactions items={reacts} onUpdate={(react_id) => { this.onCommentReact(react_id, index); }}>
                                                <span>
                                                    {comment.reaction ?
                                                        <span>
                                                            <span className={`footer__text comment_like-text ${comment.reaction ? comment.reaction.id : ""}`}>{comment.reaction.description}</span>
                                                        </span>
                                                        : <span>Like</span>
                                                    }
                                                </span>
                                                <span className="dot comment__dot"> &middot; </span>
                                                <span className="comment__time">{comment.time}</span>
                                                {comment.reaction &&
                                                    <template>
                                                        <span className="dot comment__dot"> &middot; </span>
                                                        <span className="comment__like-count">
                                                            <i className="i-small i-like"></i>
                                                1
                                            </span>
                                                    </template>
                                                }
                                            </Reactions>
                                        </a>

                                    </span>

                                </div>
                            </article >
                        ))}
                        <form className="comment comment__add-comment add-comment">
                            <div className="comment__author-avatar-wrap">
                                <img className="comment__author-avatar" src={default_avatar} alt="Your avatar" />
                            </div>
                            <div className="comment__post">
                                <textarea 
                                    placeholder="Write a comment..."
                                    onChange={(event) => this.setState({ currentComment: event.target.value })}
                                    onKeyPress={this.submitComment}
                                    value={this.state.currentComment}
                                    aria-label="Write a comment"
                                />
                            </div>
                        </form>
                    </div >
                </article >
            );
        }
        return (<div>There was an error</div>);
    }
}

export default Post;