import React, { Component } from 'react';
import '../css/fb.css';
import Post from './Post';
import config from '../config';
import firebase from 'firebase';
import ArticleModal from './ArticleModal';
import app from "../util/firebase.js";
import SharePopup from "./SharePopup";
import ReportPopup from "./ReportPopup";
import Logger from '../logging/Logger';
import { invalidUserID } from '../util/util';
var uuid = require("uuid");

class FFacebook extends Component {

  constructor(props) {
    super(props);
    // need to change
    this.state = {
      static: {},
      settings: {},
      articleToShow: null,
      postToShare: null,
      postToReport: null,
    };
    let user_id = localStorage.getItem('user_id');
    let ip_address = localStorage.getItem('ip_address');
    if (!user_id || invalidUserID(user_id)) {
      let computed_id = uuid.v4();
      console.log(computed_id);
      localStorage.setItem("user_id", computed_id);
      firebase.analytics().setUserProperties({ user_id: computed_id });
    }
    if (!ip_address) {
      fetch('https://api.ipify.org/?format=json')
        .then(response => {
          return response.json();
        })
        .then(res => {
          console.log(res);
          localStorage.setItem("ip_address", res.ip);
        })
        .catch(err => console.log(err));
    }
  }


  getUserObject = (user_id) => {
    return this.state.static.users.find(user => user_id === user.user_id);
  };

  toggleArticle = (article_id = null) => {
    let current_article = this.state.articleToShow;
    let article = article_id;
    if (article) {
      article = this.state.static.articles.find(art => article === art.article_id);
    }
    this.setState({ articleToShow: article }, () => {
      if (this.state.articleToShow) {
        Logger.log_action('click', 'open article', { article_id: article_id });
      } else {
        Logger.log_action('click', 'close article', { article_id: current_article.article_id });
      }
    });
  };

  sharePost = (post_id, undo = false) => {
    Logger.log_action('share', undo ? 'undo post shared' : 'post shared', { post_id: post_id });
    let post = this.state.static.posts.find(p => post_id === p.post_id);
    if (post) {
      post.is_shared = !undo;
    }
    this.setState({ static: this.state.static, postToShare: null });
  };

  toggleShare = (post_id = null) => {
    let post = post_id;
    if (post != null) {
      post = this.state.static.posts.find(p => post === p.post_id);
    }
    this.setState({ postToShare: post }, () => {
      if (this.state.postToShare) {
        Logger.log_action('click', 'open share', { post_id: post_id });
      } else {
        Logger.log_action('click', 'close share', { post_id: post_id });
      }
    });
  };

  toggleReport = (post_id = null) => {
    let post = post_id;
    if (post != null) {
      post = this.state.static.posts.find(p => post === p.post_id);
    }
    this.setState({ postToReport: post }, () => {
      if (this.state.postToReport) {
        Logger.log_action('click', 'open report', { post_id: post_id });
      } else {
        Logger.log_action('click', 'close report', { post_id: post_id });
      }
    });
  };

  reportPost = (post_id, reason) => {
    if (reason) {
      Logger.log_action('report', 'post reported', { post_id: post_id, reporting_reason: reason });
      let post = this.state.static.posts.find(p => post_id === p.post_id);
      if (post) {
        post.is_reported = true;
        post.is_hidden = true;
      }
      this.setState({ static: this.state.static, postToReport: null });
    }
  };

  async componentDidMount() {
    try {
      let static_data = await (await firebase.database().ref(`static`).once('value')).val();
      let settings = await (await firebase.database().ref(`settings`).once('value')).val();

      // random_post is a bool value
      if (settings.random_posts) {
        static_data.posts = static_data.posts.sort(() => Math.random() - 0.5);
      }
      // show vary is a bool value
      if (settings.show_varied) {
         //now do the random varying and Log that in the
         let num_varied_needed = settings.num_varied;
         let num_posts_overall = settings.num_posts_overall;
         // let control_posts = static_data.posts.filter(post => post.meta.type == 'misc' || post.meta.type == 'control').slice(0, num_posts_overall - num_varied_needed);
         
         // get control posts ///////////
         let control_posts = static_data.posts.filter(post => post.post_id >= 5 && post.post_id <=7);
        //  console.log(control_posts);
 
         // get varied posts
         let varied = static_data.posts.filter(post => post.meta.type != 'misc' && post.meta.type != 'control');
         varied.push(static_data.posts.find(post => post.post_id == 15));
         varied = (varied.sort(() => Math.random() - 0.5)).slice(0, num_varied_needed);
   
         // randomized last 4 posts
         static_data.posts = (control_posts.concat(varied)).sort(() => Math.random() - 0.5);
 
         localStorage.setItem('varied_post', JSON.stringify(varied[0]));
         Logger.log_action('User begins', 'User Enters Site & Begins Experiment');
      }
      else {
        static_data.posts = static_data.posts.filter(post => post.meta.type == 'misc');
      }

      // set state
      this.setState({ static: static_data, settings: settings });
    } catch (e) {
      console.log(e);
    } finally {
      // do the error handling here
    }
  }

  hidePost = (post_id) => {
    console.log('hide post');
    let post = this.state.static.posts.find(p => post_id === p.post_id);
    if (post) {
      Logger.log_action('hide', 'post hidden', { post_id: post_id });
      post.is_hidden = true;
      console.log(post);
      this.setState({ static: this.state.static });
    }
  };

  // testLogging = () => {
  //   // First set required localStorage values if not present
  //   if (!localStorage.getItem('user_id')) {
  //       localStorage.setItem('user_id', 'test_user_' + Date.now());
  //   }
  //   if (!localStorage.getItem('ip_address')) {
  //       localStorage.setItem('ip_address', '127.0.0.1');
  //   }
  //   if (!localStorage.getItem('varied_post')) {
  //       localStorage.setItem('varied_post', 'true');
  //   }

  //   // Now try logging
  //   Logger.log_action('test', 'Testing logging system', {
  //       post_id: 'test123',
  //       article_id: 'article123'
  //   });
  // };

  render() {
    return (
      <div id="app">
        <div className="site-header">
        </div>
        <div>
          {this.state.static.posts && this.state.static.posts.map((post) => {
            if (!post.is_hidden)
              return <Post
                key={`post-${post.post_id}`}
                post={post} 
                getUserObj={this.getUserObject}
                toggleArticle={this.toggleArticle}
                toggleShare={this.toggleShare}
                sharePost={this.sharePost}
                hidePost={this.hidePost}
                toggleReport={this.toggleReport}
              />;
            return null;
          })}
        </div>

        {this.state.articleToShow &&
          <ArticleModal article={this.state.articleToShow} toggleArticle={this.toggleArticle}></ArticleModal>
        }
        {this.state.postToShare &&
          <SharePopup post={this.state.postToShare} toggleShare={this.toggleShare} sharePost={this.sharePost}></SharePopup>
        }
        {this.state.postToReport &&
          <ReportPopup post={this.state.postToReport} toggleReport={this.toggleReport} reportPost={this.reportPost}></ReportPopup>
        }
        {/* <button onClick={this.testLogging}>Test Logger</button> */}
      </div>
    );
  }
}

export default FFacebook;