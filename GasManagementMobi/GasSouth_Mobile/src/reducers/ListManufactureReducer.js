import { handleActions } from 'redux-actions';
import { GET_LIST_MANUFACTURE, GET_LIST_MANUFACTURE_RESULT } from '../types';

const INITIAL_STATE = {
  data: ""
};

const getListManuFaceture = handleActions({
  [GET_LIST_MANUFACTURE]: (state, action) => {
    //console.log("GET_LIST_MANUFACTURE", action);
    return {
      ...state,
      ...action.payload
    }
  },
  [GET_LIST_MANUFACTURE_RESULT]: (state, action) => {
    //console.log("GET_LIST_MANUFACTURE_RESULT", action);
    return {
      ...state,
      ...action.payload
    }
  }
}, INITIAL_STATE);

export { getListManuFaceture as default };