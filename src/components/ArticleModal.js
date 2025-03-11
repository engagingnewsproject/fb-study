import React, { Component } from 'react';

import '../css/article.css';


class ArticalModal extends Component {

    render() {
        return (<div className="browser-dialog">
            <div className="browser__control">
                <button className="browser__close" onClick={() => { this.props.toggleArticle(); }}> Return to Facebook<i className="i-close--white"></i></button>
            </div>
            <div className="browser-wrap frame" width="100%" height="100%">
                <header className="header article-container container--wide" role="banner">
                    <div className="site-title">{this.props.article.publication}</div>
                </header>
                <div className="article-container">
                    <div className="article-header">
                        <h2 className="article-title">{this.props.article.title}</h2>
                        <p className="byline">Posted on <time>{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time></p>
                    </div>
                    <hr></hr>
                    <div className="article">
                        <div dangerouslySetInnerHTML={{ __html: this.props.article.raw_html }} width="100%" height="100%" />
                    </div>
                </div>
                <footer className="colophon article-container container--wide">
                    <hr></hr>

                    <div className="article-row row--wide">
                        <p className="copyright center">This material may not be published, broadcast, rewritten, or redistributed.<br></br>©All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
        </div>);
    }
}

export default ArticalModal;