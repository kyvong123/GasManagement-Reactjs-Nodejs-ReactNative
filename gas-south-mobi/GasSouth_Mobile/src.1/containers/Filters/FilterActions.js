
import { createActions } from 'redux-actions';
import { 
   QUERY_CHANGED, 
   RESET_QUERY,
   CLEAN_ARTICLES,
   TOGGLE_FILTER,
   LOG_OUT } from './types';

export const  {
  queryChanged,
  resetQuery,
  cleanArticles,
  toggleFilter,
  logOut
} = createActions({
    [QUERY_CHANGED]:(query) => (query),
    [RESET_QUERY]:() => ({}),
    [CLEAN_ARTICLES]: () => ({}),
    [TOGGLE_FILTER]: (filter) => ({filter}),
    [LOG_OUT]: () => ({})
  });
