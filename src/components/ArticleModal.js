import React, { Component } from 'react';
import '../css/article.css';

class ArticleModal extends Component {

    render() {
        const { article, toggleArticle } = this.props;
        return (
            <div className="browser-dialog" role="dialog" aria-labelledby="article-title">
                <div className="browser__control">
                    <button 
                        className="browser__close" 
                        onClick={() => { toggleArticle(null); }}
                        aria-label="Close article and return to Facebook"
                    >
                        Return to Facebook
                        <i className="i-close--white" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="browser-wrap frame" role="main">
                    <header className="header article-container container--wide" role="banner">
                        <div className="site-title">{article.publication}</div>
                    </header>
                    <div className="article-container">
                        <div className="article-header">
                            <h2 className="article-title" id="article-title">{article.title}</h2>
                            <p className="byline">
                                Posted on <time dateTime={new Date().toISOString()}>
                                    {new Date().toLocaleDateString("en-US", { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </time>
                            </p>
                        </div>
                        <hr />
                        <div className="article">
                            <div 
                                dangerouslySetInnerHTML={{ __html: article.raw_html }} 
                                role="article"
                                aria-label={article.title}
                            />
                        </div>
                    </div>
                    <footer className="colophon article-container container--wide">
                        <hr />
                        <div className="article-row row--wide">
                            <p className="copyright center">
                                This material may not be published, broadcast, rewritten, or redistributed.
                                <br />
                                ©All Rights Reserved.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default ArticleModal;