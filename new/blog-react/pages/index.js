import React, { Component, Fragment } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import fetch from 'isomorphic-fetch';

import Feed from '../components/feed/feed.component';
import Tag from '../components/tag/tag.component';

class Blog extends Component {

    errorMessage = '';

    constructor(props) {
        super(props);
    }

    readStringStream(rs) {
        return new Promise((resolve, reject) => {
            let data = '';
            rs.on('data', (chunk) => data += chunk);
            rs.on('end', () => resolve(data));
            rs.on('error', (error) => reject(error.message));
        });
    }

    getTagsParam() {
        return this.props.router.query['tags'];
    }

    getMorePosts(page, limit) {
        const tagsParam = this.getTagsParam();
        const newTagsParam = tagsParam ? `&tags=${tagsParam}` : '';
        const reqUrl = `${window.__GATEWAY_URL__}/api/v1/posts/meta?page=${page}&limit=${limit}${newTagsParam}`;
        return fetch(reqUrl)
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    return res.json().then(
                        (res) => {
                            return res.map((item) => {
                                return Object.assign(item, { link: `/posts/${item.id}` });
                            });
                        });
                } else {
                    this.readStringStream(res.body)
                        .then((msg) => {
                            this.errorMessage = msg || res.statusText;
                        }, (err) => {
                            this.errorMessage = res.statusText;
                        });
                    throw new Error(res.statusText);
                }
            });
    }

    getPathWithoutTag(tag, tags) {
        let tagsQuery = tags.reduce((acc, val, i) => {
            if (val !== tag) {
                if (!!acc) {
                    acc += '+';
                }
                acc += val;
            }
            return acc;
        }, '')
        if (tagsQuery) {
            tagsQuery = `?tags=${tagsQuery}`;
        }
        return '/' + tagsQuery;
    }

    renderTags() {
        const tagsParam = this.getTagsParam();
        const tags = tagsParam ? tagsParam.split(/ /g) : [];
        return tags.map((tag, index, arr) => {
            return (
                <Tag key={tag}>
                    <Link href={this.getPathWithoutTag(tag, arr)}>
                        <a>
                        <span className='fa fa-times'></span>
                        </a>
                    </Link>
                    &nbsp;{tag}
                </Tag>
            );
        });
    }

    render() {
        return (
            <Fragment>
                <header>{this.renderTags()}</header>
                <Feed batchSize={2} getMoreFunc={this.getMorePosts.bind(this)}/>
            </Fragment>
        );
    }
}

export default withRouter(Blog);