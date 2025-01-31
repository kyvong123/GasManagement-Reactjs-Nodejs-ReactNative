import { combineEpics } from 'redux-observable';
import AuthEpics from './containers/Auth/AuthEpics';
import ArticleEpics from './containers/Articles/ArticleEpics';
import FilterEpics from './containers/Filters/FilterEpics';
import ServiceEpics from './containers/Services/ServiceEpics';

const rootEpic = combineEpics(
    ...AuthEpics, ...ArticleEpics, ...FilterEpics, ...ServiceEpics
);
export default rootEpic;
