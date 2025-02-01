import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import { 
    FETCH_ARTICLE_SERVICES,
    FETCH_ARTICLE_SERVICES_SUCCESS,
    FETCH_ARTICLE_SERVICES_FAIL,
    QUERY_CHANGED,
    FETCH_ARTICLE_SERVICE,
    FETCH_ARTICLE_SERVICE_SUCCESS,
    FETCH_ARTICLE_SERVICE_FAIL,
    SWITCH_DOMAIN_SUCCESS,
    LOG_OUT} from './types';

const INITIAL_STATE = Map({
    loading: false,
    services: List(),
    sumArticles: 0,
    service: Map(),
    error: ''
});

const serviceReducer = handleActions({
    [FETCH_ARTICLE_SERVICES]:(state, action) => state.merge(action.payload.option,{loading: true}),
    [FETCH_ARTICLE_SERVICES_SUCCESS]: (state, action) => state.merge(action.payload,{loading: false, error: ''}),
    [FETCH_ARTICLE_SERVICES_FAIL]: (state, action) => state.merge(action.payload, {loading: false}),
    [QUERY_CHANGED]:(state,action) =>{
        // all services {id: null, name: 'All services'}
        if(!action.payload.services && action.payload.services !== null){
            return state;
        }
        if(action.payload.services === null){
            return state.set('service',Map());
        }
        const serviceActiveId = state.get('services').findIndex(service =>service.get('id') === action.payload.services);
        const serviceActive = state.getIn(['services', serviceActiveId]);
        return state.setIn(['service'],fromJS(serviceActive));
    },
    [FETCH_ARTICLE_SERVICE]:(state, action) => state.merge(action.payload.option,{loading: true}),
    [FETCH_ARTICLE_SERVICE_SUCCESS]: (state, action) => state.merge(action.payload,{loading: false, error: ''}),
    [FETCH_ARTICLE_SERVICE_FAIL]: (state, action) => state.merge(action.payload, {loading: false}),
    [SWITCH_DOMAIN_SUCCESS]: () => FILTER_INITIAL_STATE,
    [LOG_OUT]: () => INITIAL_STATE
}, INITIAL_STATE);

export  {serviceReducer as default};
