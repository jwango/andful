import BaseConsumer from '../consumer';
var express = require('express');
var createError = require('http-errors');
var PostsController = Object.create(BaseConsumer);

PostsController.name = "PostsController";
PostsController.dependencyKeys = PostsController.dependencyKeys.concat(['postsService']);
PostsController.getRouter = function() {
  var router = express.Router();
  /* GET post. */
  var postIdHandler = function(req, res, next) {
    let postId = req.params.postId;
    if (this.postsService) {
      this.postsService.getPost(postId)
        .then((result) => {
          if (result) {
            if (!result.error) {
              res.send(result);
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not find the post.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not retrieve the post.'));
    }
  };

  var postMetaHandler = function(req, res, next) {
    if (this.postsService) {
      var _pageSize = parseInt(req.query.limit, 10) || 15;
      var _page = parseInt(req.query.page, 10) || 0;
      var _tags = req.query.tags ? req.query.tags.split(' ') : [];
      this.postsService.getPostsMeta(_page, _pageSize, _tags)
        .then((result) => {
          if (result) {
            if (!result.error) {
              res.send(result);
            } else {
              next(createError(result.error));
            }
          } else {
            next(createError(400, new Error('Could not find the metadata for posts.')))
          }
        })
        .catch((err) => next(createError(err.status || 500, err)));
    } else {
      console.log('No service');
      next(createError(500, 'Could not retrieve the metadata for posts.'));
    }
  };

  router.get('/meta', postMetaHandler.bind(this));
  router.get('/:postId', postIdHandler.bind(this));
  return router;
}
export default PostsController;