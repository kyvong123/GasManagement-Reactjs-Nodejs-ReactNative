import { handleActions } from 'redux-actions';
import { GET_LIST_STATION, GET_LIST_STATION_SUCCESS } from '../types';

const INITIAL_STATE = {
  data: {}
};

const getListStation = handleActions({
  [GET_LIST_STATION]: (state, action) => {
    // console.log("getListStation", action);
    return {
      ...state,
      ...action.payload
    }
  },
  [GET_LIST_STATION_SUCCESS]: (state, action) => {
    // console.log("getListStation", action);
    return {
      ...state,
      ...action.payload
    }
  }
}, INITIAL_STATE);

export { getListStation as default };