
import { createActions } from 'redux-actions';
import { FETCH_ARTICLES, 
  FETCH_ARTICLES_SUCCESS,
  FETCH_ARTICLES_FAIL,
  FETCH_ARTICLE, 
  FETCH_ARTICLE_SUCCESS,
  FETCH_ARTICLE_FAIL, 
  TOGGLE_EXPAND_ARTICLE,
  FETCH_ARTICLE_TYPES,
  FETCH_ARTICLE_TYPES_SUCCESS,
  FETCH_ARTICLE_TYPES_FAIL,
  POST_ARTICLE_COMMENT,
  POST_ARTICLE_COMMENT_SUCCESS,
  POST_ARTICLE_COMMENT_FAIL,
  DELETE_ARTICLE_COMMENT,
  DELETE_ARTICLE_COMMENT_FAIL,
  DELETE_ARTICLE_COMMENT_SUCCESS,
  CLEAN_ARTICLES,
  LOG_OUT,
  TOGGLE_EXPAND_ADD_COMMENT,
  TOGGLE_SEARCH_BOX,
  SHOW_SEARCH_BOX,
  CLOSE_SEARCH_BOX } from './types';

export const  {
  fetchArticles,
  fetchArticlesSuccess,
  fetchArticlesFail,

  fetchArticle,
  fetchArticleSuccess,
  fetchArticleFail,

  toggleExpandArticle,

  fetchArticleTypes,
  fetchArticleTypesSuccess,
  fetchArticleTypesFail,

  postArticleComment,
  postArticleCommentSuccess,
  postArticleCommentFail,

  deleteArticleComment,
  deleteArticleCommentSuccess,
  deleteArticleCommentFail,

  toggleExpandAddComment,

  toggleSearchBox,
  showSearchBox,
  closeSearchBox,

  cleanArticles,
  logOut
} = createActions({
    [FETCH_ARTICLES]: (query,option) => ({query,option}),
    [FETCH_ARTICLES_SUCCESS]: (articles,isAbleLoadMore, total, option) => ({articles,isAbleLoadMore, total, option}),
    [FETCH_ARTICLES_FAIL]:(error) => ({error}),

    [FETCH_ARTICLE]: (id) => ({id}),
    [FETCH_ARTICLE_SUCCESS]: (article) => ({article}),
    [FETCH_ARTICLE_FAIL]:(error) => ({error}),
    
    [TOGGLE_EXPAND_ARTICLE]:(id) => ({id}),

    [FETCH_ARTICLE_TYPES]:() => ({}),
    [FETCH_ARTICLE_TYPES_SUCCESS]: (types) => ({types}),
    [FETCH_ARTICLE_TYPES_FAIL]:(error) => ({error}),

    [POST_ARTICLE_COMMENT]:(articleId, fieldId, content) => ({articleId, fieldId, content}),
    [POST_ARTICLE_COMMENT_SUCCESS]: (fieldId, comment) => ({fieldId, comment}),
    [POST_ARTICLE_COMMENT_FAIL]:(error) => ({error}),

    [DELETE_ARTICLE_COMMENT]:(articleId, fieldId, commentId) => ({articleId, fieldId, commentId}),
    [DELETE_ARTICLE_COMMENT_SUCCESS]: (fieldId, commentId) => ({fieldId, commentId}),
    [DELETE_ARTICLE_COMMENT_FAIL]:(error) => ({error}),

    [TOGGLE_EXPAND_ADD_COMMENT]:(fieldId) => ({fieldId}),

    [TOGGLE_SEARCH_BOX]:()=>({}),
    [SHOW_SEARCH_BOX]:()=>({}),
    [CLOSE_SEARCH_BOX]:()=>({}),

    [CLEAN_ARTICLES]:()=>({}),
    [LOG_OUT]: () => ({})
  });
