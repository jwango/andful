import React, { Component, Fragment } from 'react';
import PropTypes  from 'prop-types';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

import ContainerContext from '../../lib/services/container-context';
import ContainerKeys from '../../lib/services/container-keys';
import { getDefault } from '../../lib/utils/ops.util';
import MdFragment from '../../components/md-fragment/md-fragment.component';
import Tag from '../../components/tag/tag.component';
import Time from '../../components/time/time.component';
import ErrorView from '../../components/error-view/error-view.component';

export default class Post extends Component {

    static propTypes = {
        match: PropTypes.any
    }

    static defaultState = {
        title: 'Untitled',
        chunks: [],
        lastUpdateDate: '?',
        pubDate: '?',
        tags: [],
        error: undefined,
        postData: undefined
    }

    constructor(props) {
        super(props);
        let postData = props.postData;
        let error = props.error;
        this.state = {
            title: getDefault(postData.title, Post.defaultState.title),
            chunks: getDefault(postData.body, Post.defaultState.chunks),
            lastUpdateDate: getDefault(this.getFormattedDate(postData.lastUpdateDate), Post.defaultState.lastUpdateDate),
            pubDate: getDefault(this.getFormattedDate(postData.publishDate), Post.defaultState.pubDate),
            tags: getDefault(postData.tags, Post.defaultState.tags),
            guid: postData.id,
            error: error
        };
    }

    componentDidMount() {
      setTimeout(() => {
        if (window.__DISQUS_URL__) {
            const title = this.state.title;
            const id = this.state.guid;
            window.disqus_config = function () {
                this.page.title = `${title}-${id}`;
                this.page.identifier = id;
                this.page.url = `${window.__GATEWAY_URL__}/posts/${id}`;
            };

            const s = document.createElement('script');
            s.src = window.__DISQUS_URL__;
            s.setAttribute('data-timestamp', +new Date());
            (document.head || document.body).appendChild(s);
        }
      }, 0);
    }

    getFormattedDate(dateStr) {
        if (dateStr) {
            return format(parse(dateStr), 'MMM D, YYYY');
        }
        return dateStr;
    }

    renderLastUpdateDate(publishDate, lastUpdateDate) {
        if (publishDate === lastUpdateDate || !lastUpdateDate) {
            return <Fragment></Fragment>;
        }
        return <Fragment><span className='color-background-faded'> • </span><Time dateTime={lastUpdateDate}></Time></Fragment>;
    }

    renderTags(categories) {
        if (categories) {
            return categories.map((category) => {
                return (
                    <Tag key={category} link={`/?tags=${category}`}>{category}</Tag>
                );
            });
        }
        return <span></span>;
    }

    render() {
        if (this.state.error) {
            return <ErrorView error={this.state.error}></ErrorView>
        }
        return (
            <article className='post'>
                <header>
                    <h1>{this.state.title}</h1>
                    <Time dateTime={this.state.pubDate}></Time>
                    {this.renderLastUpdateDate(this.state.pubDate, this.state.lastUpdateDate)}
                </header>
                <section className='post__content'>
                    <MdFragment chunks={this.state.chunks} showOutline={true}/>
                </section>
                <footer className='blog__footer'>
                    {this.renderTags(this.state.tags)}
                    <div id='disqus_thread'></div>
                    <noscript>Please enable JavaScript to view the <a href='https://disqus.com/?ref_noscript'>comments powered by Disqus.</a></noscript>
                </footer>
            </article>
        );
    }
}

export async function getServerSideProps(context) {
  const postId = context.params['id'];
  let postData = {};
  let error = { message: 'I\'m sorry Dave, I\'m afraid I can\'t do that.' };
  const postsService = await ContainerContext.lookup(ContainerKeys.POSTS_SERVICE);
  try {
    postData = await postsService.getPost(postId);
    if (!postData || postData.error) {
      postData = {};
      if (postData.error) {
        console.log(postData.error)
      }
    } else {
      error = null;
    }
  } catch (ex) {
    console.log(ex);
  }
  
  return { props: { postData, error } };
}