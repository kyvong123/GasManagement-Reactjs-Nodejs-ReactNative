import {
    handleActions
} from 'redux-actions';
import {
    EXPORT_PLACE,
    EXPORT_PLACE_SUCCESS,
    EXPORT_PLACE_FAIL,
    LOG_OUT
} from '../types';
import { Actions } from 'react-native-router-flux';

const INITIAL_STATE = {
    reports: [],
    scanResults: [],
    exportPlace: {},
    loading: false,
    error: ''
};

const exportPlaces = handleActions({
    [EXPORT_PLACE]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: true,
        }
    },
    [EXPORT_PLACE_SUCCESS]: (state, action) => {
        // console.log("tao la hao dang test",state)
        return {
            ...state,
            exportPlace: action.payload.data,
            loading: false,
        }
    },
    [EXPORT_PLACE_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [LOG_OUT]: () => INITIAL_STATE
}, INITIAL_STATE);

export {
    exportPlaces as
        default
};
