import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import {without as _without} from 'lodash';
import { 
    LOG_OUT,
    QUERY_CHANGED,
    CLEAN_ARTICLES,
    TOGGLE_FILTER,
    RESET_QUERY, SWITCH_DOMAIN_SUCCESS} from './types';

const VISIBLE_INITIAL_STATE = Map({
    services: false,
    status:false,
    types: false,
    audiences: false,
    lastModified: false
});
const visibleFilterReducer = handleActions({
    [TOGGLE_FILTER]: (state, action) => {
        const updatedFilter = !state.get(action.payload.filter);
        return state.set(action.payload.filter,updatedFilter);
    },
    [RESET_QUERY]: () => VISIBLE_INITIAL_STATE,
    [LOG_OUT]: () => VISIBLE_INITIAL_STATE,
    [SWITCH_DOMAIN_SUCCESS]: () => FILTER_INITIAL_STATE
}, VISIBLE_INITIAL_STATE);

const FILTER_INITIAL_STATE = Map({
    status:List(),
    types: List(),
    audiences: List(),
    lastModifiedDatePreSetting: 5,
    lastModifiedDateFrom: null,
    lastModifiedDateTo: null,
    sortBy: 'id',
    order: 'DESC',
    includedArchived: true,
    useUserPreferences: null,
    search: null,
    page: 1,
    // types: List(),
    services: null
  });

const filterReducer = handleActions({
    [QUERY_CHANGED]: (state, action) => 
        // Object.keys(action.payload).forEach(key=>{
        //     // hardcode: fix for status=[null], types=[null], audiences=[null]
        //     if(Array.isArray(action.payload[key])&&action.payload[key].length>1){
        //         action.payload[key] = _without(action.payload[key],null);
        //     }
        // });
         state.merge(action.payload)
    ,
    [RESET_QUERY]: () => FILTER_INITIAL_STATE,
    [CLEAN_ARTICLES]: (state) => state.merge({page: 1}),
    [LOG_OUT]: () => FILTER_INITIAL_STATE,
    [SWITCH_DOMAIN_SUCCESS]: () => FILTER_INITIAL_STATE
}, FILTER_INITIAL_STATE);

export  { filterReducer, visibleFilterReducer};
