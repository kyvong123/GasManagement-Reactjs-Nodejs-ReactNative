import {Observable } from 'rxjs/Observable';
import {END_POINT} from '../../constants';
import {ajaxAdapter} from '../../helpers/Utils';

import { FETCH_ARTICLE_SERVICES, FETCH_ARTICLE_SERVICE } from './types';

import {
    fetchArticleServicesSuccess,
    fetchArticleServicesFail,
    fetchArticleServiceSuccess,
    fetchArticleServiceFail, 
    logOut} from './ServiceActions';

import { refreshAccessToken } from '../Auth/AuthActions';

const fetchArticleServicesEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
action$.ofType(FETCH_ARTICLE_SERVICES)
.debounceTime(150)
.mergeMap(action => ternantMiddleWare(action))
.mergeMap(action => tokenMiddleWare(action))
.distinctUntilChanged()
.switchMap(action => 
  ajaxAdapter(END_POINT.getArticleServices.url(action.payload.ternant),END_POINT.getArticleTypes.method, action.payload)
  .retry(3)
  .mergeMap(({response}) => {

    if(response.status === 600 || response.status === 605){
      return Observable.of(logOut());
    }

    if(response.status !== 200){
      return Observable.of(fetchArticleServicesFail(response.data.errors));
      
    }
    let services = [];
    let sumArticles = 0;
    if(response.data){
      const serviceList = response.data.reduce((prev, curr) => {
            if(curr){
              curr.onFilter = false;
              sumArticles +=curr.numberOfArticles;
              return prev.concat(curr);
            }
            return prev;
      },[]);
      services = services.concat(serviceList);
    }
    return Observable.of(fetchArticleServicesSuccess(services, sumArticles));
    
  })
  .catch((error) =>
      {
        console.log('error',error);
        if(error.status === 401){
          const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
        }
        return Observable.of(fetchArticleServicesFail('Load services fail'));
      }
    
  ));

  const fetchArticleServiceEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
action$.ofType(FETCH_ARTICLE_SERVICE)
.debounceTime(150)
.mergeMap(action => ternantMiddleWare(action))
.mergeMap(action => tokenMiddleWare(action))
.distinctUntilChanged()
.switchMap(action => 
  ajaxAdapter(END_POINT.getArticleService.url(action.payload.ternant, action.payload.id),END_POINT.getArticleTypes.method, action.payload)
  .retry(3)
  .mergeMap(({response}) => {

    if(response.status === 600 || response.status === 605){
      return Observable.of(logOut());
    }

    if(response.status !== 200){
      return Observable.of(fetchArticleServiceFail(response.data.errors));
      
    }
    return Observable.of(fetchArticleServiceSuccess(response.data));
    
  })
  .catch((error) =>
      {
        console.log('error',error);
        if(error.status === 401){
          const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
        }
        return Observable.of(fetchArticleServiceFail('Load service fail'));
      }
    
  ));

  export default [ fetchArticleServicesEpic, fetchArticleServiceEpic ] ;