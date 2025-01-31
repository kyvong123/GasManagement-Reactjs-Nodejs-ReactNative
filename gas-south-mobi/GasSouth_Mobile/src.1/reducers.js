import { combineReducers } from 'redux-immutable';
import AppReducer from './containers/App/AppReducer';
import AuthReducer from './containers/Auth/AuthReducer';
import ArticleReducer from './containers/Articles/ArticleReducer';
import {filterReducer as FilterReducer, visibleFilterReducer as VisibleFilterReducer} from './containers/Filters/FilterReducer';
import ServiceReducer from './containers/Services/ServiceReducer';

export default combineReducers({
    AppReducer,
    AuthReducer,
    ArticleReducer,
    FilterReducer,
    VisibleFilterReducer,
    ServiceReducer
});