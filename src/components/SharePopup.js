import React, { Component } from 'react';
import { getImageURL } from '../util/util';



class SharePopup extends Component {

    render() {
        let { post } = this.props;
        return (<dialog>
            <div className="modal-mask">
                <div className="modal-wrap">
                    <div className="modal" id="modal">
                        <header className="modal__header">
                            <h3>Share this post?</h3>
                        </header>
                        <button className="modal__close" onClick={() => { this.props.toggleShare(); }}> <i className="i-close"></i></button>
                        <div className="modal__content">
                            <p className="post__content">{post.content.caption}</p>
                            {post.post_type === "photo" &&
                                <div className="post__photo">
                                    <div className="link__image-wrap">
                                        <img src={getImageURL('post', post.content.image)} className="photo__image" />
                                    </div>
                                </div>
                            }
                            {post.post_type === "article" &&
                                <div className="post__link">
                                    <a className="link">
                                        <div className="link__image-wrap">
                                            <img src={getImageURL('post', post.content.image)} className="link__image" />
                                        </div>
                                        <div className="link__content">
                                            <h4 className="link__title">{post.content.title}</h4>
                                            <p className="link__source">{post.content.source}</p>
                                        </div>
                                    </a>
                                </div>
                            }
                            <footer className="modal__footer">
                                <div>
                                    <button className="modal__button modal__button--undo" onClick={() => { this.props.toggleShare(); }}>Undo</button>
                                    <button className="modal__button modal__button--done" onClick={() => { this.props.sharePost(post.post_id); }}>Share</button>
                                </div >
                            </footer >
                        </div >
                    </div >
                </div >
            </div >
        </dialog >);
    }
}

export default SharePopup;