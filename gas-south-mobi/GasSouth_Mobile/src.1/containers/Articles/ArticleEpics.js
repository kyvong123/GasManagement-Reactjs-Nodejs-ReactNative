import {Observable } from 'rxjs/Observable';

import {reverse as _reverse} from 'lodash';
import {END_POINT} from '../../constants';
import {ajaxAdapter} from '../../helpers/Utils';

import { FETCH_ARTICLES, 
  FETCH_ARTICLE, 
  FETCH_ARTICLE_TYPES, 
  POST_ARTICLE_COMMENT,
  DELETE_ARTICLE_COMMENT } from './types';

import {
    fetchArticlesSuccess,
    fetchArticlesFail,
    fetchArticleSuccess,
    fetchArticleFail,
    fetchArticleTypesSuccess,
    fetchArticleTypesFail,
    postArticleCommentFail,
    postArticleCommentSuccess,
    deleteArticleCommentFail,
    deleteArticleCommentSuccess } from './ArticleActions';
import {refreshAccessToken, logOut} from '../Auth/AuthActions';

import { showErrorToast } from '../../containers/App/AppActions';
import { queryChanged } from '../Filters/FilterActions';

const fetchArticlesEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
action$.ofType(FETCH_ARTICLES)
.debounceTime(150)
.distinctUntilChanged()
.mergeMap(action => ternantMiddleWare(action))
.mergeMap(action => tokenMiddleWare(action))
// .do(action => console.log(action))
.switchMap(action => 
  ajaxAdapter(END_POINT.getArticles.url(action.payload.ternant,action.payload.query),END_POINT.getArticles.method, action.payload)
  .retry(3)
  .mergeMap(({response}) => {
    // console.log('response',response);

    if(response.status === 600 || response.status === 605){
      return Observable.of(logOut());
    }

    if(response.status !== 200){
      return Observable.of(fetchArticlesFail(response.message));
      
    }
    const numberArticlesLoaded =  store.getState().get('ArticleReducer').get('articles').size;

    let articles = [];
    let total = 0;
    let isAbleLoadMore = false;

    if(response.data && response.data.articles){
      articles = articles.concat(response.data.articles);
      // articleList = articles.reduce((prev, curr) => {
      //       if(curr){
      //         curr.expand = true;
      //         return prev.concat(curr);
      //       }
      //       return prev;
      // },[]);
      if(action.payload.option && action.payload.option.refresh){
        isAbleLoadMore = true;
      } else {
        isAbleLoadMore = (numberArticlesLoaded + articles.length) < response.data.total;
      }
      // eslint-disable-next-line
      total = response.data.total;
    }
    return Observable.concat(
      Observable.of(fetchArticlesSuccess(articles, isAbleLoadMore, total, action.payload.option)),
      Observable.of(queryChanged(action.payload.query)),
    );
    
  })
  .catch((error) =>
    
      {
        // if(error.status === 401){
        //   const callback = Object.assign({},action);
        //   return Observable.of(refreshAccessToken(callback));
        // }
        console.log('error',error);
        if(error.status === 401){
          // return Observable.of(fetchUserInfoFail(null));
          const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
        }
       return Observable.of(fetchArticlesFail('Sorry, something went wrong. Please try again later.'));
      }
    
  ));

  const fetchArticleEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
  action$.ofType(FETCH_ARTICLE)
  .debounceTime(150)
  .distinctUntilChanged()
  .mergeMap(action => ternantMiddleWare(action))
  .mergeMap(action => tokenMiddleWare(action))
  .do(action => console.log(action))
  .switchMap(action => 
    ajaxAdapter(END_POINT.getArticle.url(action.payload.ternant,action.payload.id),END_POINT.getArticle.method, action.payload)
    .retry(3)
    .mergeMap(({response}) => {

      if(response.status === 600 || response.status === 605){
        return Observable.of(logOut());
      }

      if(response.status !== 200){
        return Observable.of(fetchArticleFail(response.message));
        
      }

      let article = {};
      if(response.data){
        const {fields} = response.data;
        fields.forEach(fieldItem => {
          fieldItem.comments = _reverse(fieldItem.comments);
          fieldItem.expandAddComment = false;
        });
        article = Object.assign({},response.data);
      }
      return Observable.of(fetchArticleSuccess(article));
      
    })
    .catch((error) =>
      
        {
          // if(error.status === 401){
          //   const callback = Object.assign({},action);
          //   return Observable.of(refreshAccessToken(callback));
          // }
          console.log('error',error);
          if(error.status === 401){
            // return Observable.of(fetchUserInfoFail(null));
            const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
          }
         return Observable.of(fetchArticleFail('Sorry, something went wrong. Please try again later.'));
        }
      
    ));

const fetchArticleTypesEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
action$.ofType(FETCH_ARTICLE_TYPES)
.debounceTime(150)
.distinctUntilChanged()
.mergeMap(action => ternantMiddleWare(action))
.mergeMap(action => tokenMiddleWare(action))
// .do(action => console.log(action))
.switchMap(action => 
  ajaxAdapter(END_POINT.getArticleTypes.url(action.payload.ternant),END_POINT.getArticleTypes.method, action.payload)
  .retry(3)
  .mergeMap(({response}) => {
    // console.log('response',response);

    if(response.status === 600 || response.status === 605){
      return Observable.of(logOut());
    }

    if(response.status !== 200){
      return Observable.of(fetchArticleTypesFail(response.message));
      
    }

    let types = [];
    if(response.data){
      types = types.concat(response.data);
    }
    return Observable.of(fetchArticleTypesSuccess(types));
    
  })
  .catch((error) =>
    
      {
        // if(error.status === 401){
        //   const callback = Object.assign({},action);
        //   return Observable.of(refreshAccessToken(callback));
        // }
        console.log('error',error);
        if(error.status === 401){
          // return Observable.of(fetchUserInfoFail(null));
          const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
        }
        return Observable.of(fetchArticleTypesFail('Load article types fail'));
      }
    
  ));

const postArticleCommentEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
action$.ofType(POST_ARTICLE_COMMENT)
.debounceTime(150)
.distinctUntilChanged()
.mergeMap(action => ternantMiddleWare(action))
.mergeMap(action => tokenMiddleWare(action))
// .do(action => console.log(action))
.switchMap(action => 
  ajaxAdapter(END_POINT.postArticleComent.url(action.payload.ternant, action.payload.articleId, action.payload.fieldId),END_POINT.postArticleComent.method, action.payload)
  .retry(3)
  .mergeMap(({response}) => {
    // console.log('response',response);

    if(response.status === 600 || response.status === 605){
      return Observable.of(logOut());
    }

    if(response.status !== 200){
      // return Observable.of(postArticleCommentFail(response.message));
      return Observable.concat(
        Observable.of(showErrorToast(response.message,2000)),
        Observable.of(postArticleCommentFail(response.message))
      );
      
    }
    return Observable.of(postArticleCommentSuccess(action.payload.fieldId, response.data));
    
  })
  .catch((error) =>
    
      {
        // if(error.status === 401){
        //   const callback = Object.assign({},action);
        //   return Observable.of(refreshAccessToken(callback));
        // }
        console.log('error',error);
        if(error.status === 401){
          // return Observable.of(fetchUserInfoFail(null));
          const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
        }
        return Observable.concat(
          Observable.of(showErrorToast('Sorry, something went wrong. Please try again later.',2000)),
          Observable.of(postArticleCommentFail('Sorry, something went wrong. Please try again later.'))
        );
      }
    
  ));

  const deleteArticleCommentEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
  action$.ofType(DELETE_ARTICLE_COMMENT)
  .debounceTime(150)
  .distinctUntilChanged()
  .mergeMap(action => ternantMiddleWare(action))
  .mergeMap(action => tokenMiddleWare(action))
  // .do(action => console.log(action))
  .switchMap(action => 
    ajaxAdapter(END_POINT.deleteArticleComent.url(action.payload.ternant, action.payload.commentId),END_POINT.deleteArticleComent.method, action.payload)
    .retry(3)
    .mergeMap(({response}) => {
      // console.log('response',response);

      if(response.status === 600 || response.status === 605){
        return Observable.of(logOut());
      }

      if(response.status !== 200){
        // return Observable.of(postArticleCommentFail(response.message));
        return Observable.concat(
          Observable.of(showErrorToast(response.message,2000)),
          Observable.of(deleteArticleCommentFail(response.message))
        );
        
      }
      return Observable.of(deleteArticleCommentSuccess(action.payload.fieldId, action.payload.commentId));
      
    })
    .catch((error) =>
      
        {
          // if(error.status === 401){
          //   const callback = Object.assign({},action);
          //   return Observable.of(refreshAccessToken(callback));
          // }
          console.log('error',error);
          if(error.status === 401){
            // return Observable.of(fetchUserInfoFail(null));
            const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
          }
          return Observable.concat(
            Observable.of(showErrorToast('Sorry, something went wrong. Please try again later.',2000)),
            Observable.of(deleteArticleCommentFail('Sorry, something went wrong. Please try again later.'))
          );
        }
      
    ));
export default [fetchArticlesEpic, fetchArticleEpic, fetchArticleTypesEpic, postArticleCommentEpic, deleteArticleCommentEpic] ;