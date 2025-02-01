import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import { FETCH_ARTICLES,
    FETCH_ARTICLES_SUCCESS, 
    FETCH_ARTICLES_FAIL,
    FETCH_ARTICLE,
    FETCH_ARTICLE_SUCCESS, 
    FETCH_ARTICLE_FAIL, 
    FETCH_ARTICLE_TYPES,
    FETCH_ARTICLE_TYPES_SUCCESS,
    FETCH_ARTICLE_TYPES_FAIL,
    POST_ARTICLE_COMMENT_SUCCESS,
    DELETE_ARTICLE_COMMENT_SUCCESS,
    LOG_OUT,
    CLEAN_ARTICLES,
    TOGGLE_EXPAND_ARTICLE,
    TOGGLE_EXPAND_ADD_COMMENT,
    TOGGLE_SEARCH_BOX,
    SHOW_SEARCH_BOX,
    CLOSE_SEARCH_BOX
    } from './types';

const INITIAL_STATE = Map({
    articles: List(),
    article: Map(),
    total: 0,
    showSearchBox: false,
    isAbleLoadMore: true,
    // types: List(),
    types: Map({
        loading: false,
        typeList: List()
    }),
    loading: false,
    error: ''
  });

const articleReducer = handleActions({
    [FETCH_ARTICLES]: (state, action) => state.merge(action.payload.option,{loading: true}),
    [FETCH_ARTICLES_SUCCESS]: (state, action) => {
        if(action.payload.option && action.payload.option.refresh ){
            return state.merge({articles: action.payload.articles,isAbleLoadMore: action.payload.isAbleLoadMore,loading: false, error: '', autoShowRefresh: false}).set('total',action.payload.total);
        }
        const articles = state.get('articles').toArray();
        const newArticles = articles.concat(action.payload.articles);
        return state.merge({articles: newArticles,isAbleLoadMore: action.payload.isAbleLoadMore,loading: false, error: ''}).set('total',action.payload.total);
    },
    [FETCH_ARTICLES_FAIL]: (state, action) => state.merge(action.payload, {loading: false, autoShowRefresh: false}),
    [FETCH_ARTICLE]: (state, action) => state.merge(action.payload.option,{loading: true}),
    [FETCH_ARTICLE_SUCCESS]: (state, action) => state.merge(action.payload,{loading: false, error: ''}),
    [FETCH_ARTICLE_FAIL]: (state, action) => state.merge(action.payload, {article: Map(),loading: false}),
    [FETCH_ARTICLE_TYPES]:(state) => state.setIn(['types','loading'],true),
    [FETCH_ARTICLE_TYPES_SUCCESS]: (state, action) => state.setIn(['types','loading'],false).setIn(['types','typeList'],fromJS(action.payload.types)),
    [FETCH_ARTICLE_TYPES_FAIL]: (state) => state.setIn(['types','loading'],false),

    [POST_ARTICLE_COMMENT_SUCCESS]: (state, action) => {
        const updateAtIndex = state.get('article').get('fields').findIndex(item =>item.get('id') === action.payload.fieldId);
        let comments = state.getIn(['article', 'fields', updateAtIndex, 'comments']);
        comments = comments.push(Map(action.payload.comment));
        return state.setIn(['article', 'fields', updateAtIndex , 'comments'], comments);
    },
    [DELETE_ARTICLE_COMMENT_SUCCESS]: (state, action) => {
        const fieldDeletedIndex = state.get('article').get('fields').findIndex(item =>item.get('id') === action.payload.fieldId);
        const comments = state.getIn(['article', 'fields', fieldDeletedIndex, 'comments']);
        const commentDeletedIndex = comments.findIndex(comment =>comment.get('id') === action.payload.commentId);
        return state.deleteIn(['article', 'fields', fieldDeletedIndex , 'comments', commentDeletedIndex]);
    },
    [TOGGLE_EXPAND_ARTICLE]:(state, action) => {
        const updateAtIndex = state.get('articles').findIndex(item =>item.get('id') === action.payload.id);
        const expand = state.getIn(['articles', updateAtIndex, 'expand']);
        return state.setIn(['articles', updateAtIndex , 'expand'], !expand);
    },
    [TOGGLE_EXPAND_ADD_COMMENT]:(state, action) => {
        const fieldExpandIndex = state.get('article').get('fields').findIndex(item =>item.get('id') === action.payload.fieldId);
        
        const expand = state.getIn(['article', 'fields', fieldExpandIndex, 'expandAddComment']);
        return state.setIn(['article', 'fields', fieldExpandIndex , 'expandAddComment'], !expand);
    },
    [CLEAN_ARTICLES]:(state)=> state.setIn(['articles'],List()),
    [TOGGLE_SEARCH_BOX]: (state) => {
        const showSearchBox = !state.get('showSearchBox');
        return state.set('showSearchBox', showSearchBox);
    },
    [SHOW_SEARCH_BOX]: (state) => state.set('showSearchBox', true),
    [CLOSE_SEARCH_BOX]: (state) => state.set('showSearchBox', false),
    [LOG_OUT]: () => INITIAL_STATE
}, INITIAL_STATE);

export  {articleReducer as default};
