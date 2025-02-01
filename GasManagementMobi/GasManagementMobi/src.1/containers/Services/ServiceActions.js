
import { createActions } from 'redux-actions';
import { 
  FETCH_ARTICLE_SERVICES,
  FETCH_ARTICLE_SERVICES_SUCCESS,
  FETCH_ARTICLE_SERVICES_FAIL,
  QUERY_CHANGED,
  FETCH_ARTICLE_SERVICE,
  FETCH_ARTICLE_SERVICE_SUCCESS,
  FETCH_ARTICLE_SERVICE_FAIL,
  LOG_OUT } from './types';

export const  {
  fetchArticleServices,
  fetchArticleServicesSuccess,
  fetchArticleServicesFail,
  fetchArticleService,
  fetchArticleServiceSuccess,
  fetchArticleServiceFail,
  queryChanged,
  logOut
} = createActions({

    [FETCH_ARTICLE_SERVICES]:() => ({}),
    [FETCH_ARTICLE_SERVICES_SUCCESS]: (services, sumArticles) => ({services, sumArticles}),
    [FETCH_ARTICLE_SERVICES_FAIL]:(error) => ({error}),
    [FETCH_ARTICLE_SERVICE]:(id) => ({id}),
    [FETCH_ARTICLE_SERVICE_SUCCESS]: (service) => ({service}),
    [FETCH_ARTICLE_SERVICE_FAIL]:(error) => ({error}),
    [QUERY_CHANGED]:(services) => ({services}),
    [LOG_OUT]: () => ({})
  });
