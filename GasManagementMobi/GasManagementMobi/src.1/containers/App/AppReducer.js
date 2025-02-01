import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { SHOW_ERROR_TOAST, SHOW_WARM_TOAST, SHOW_INFO_TOAST, HIDE_TOAST, LOG_OUT } from './types';

const INITIAL_STATE = Map({
    toast: Map({
        type: 'info',
        toastMessage:'',
        toastDuration: 2000,
        isShowToast: false
    })
  });

const appReducer = handleActions({
    [SHOW_ERROR_TOAST]: (state, action) => state.mergeDeep(action.payload,{toast: {type: 'error', isShowToast: true}}),
    [SHOW_WARM_TOAST]: (state, action) => state.mergeDeep(action.payload,{toast: {type: 'warm', isShowToast: true}}),
    [SHOW_INFO_TOAST]: (state, action) => state.mergeDeep(action.payload, {toast: {isShowToast: true}}),
    [HIDE_TOAST]: (state) => state.mergeDeep({toast: {toastMessage: '', toastDuration: 1000, isShowToast: false}}),
    [LOG_OUT]: () => INITIAL_STATE
}, INITIAL_STATE);

export  {appReducer as default};