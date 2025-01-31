import {
    handleActions
} from 'redux-actions';
import {
    GSTT,
    GSTTS,
    GSTTF
} from '../types';

const INITIAL_STATE = {
    result_gsst: {
        data: []
    },
};

const statistic = handleActions({
    [GSTT]: (state, action) => {
        return {
            ...state,
            ...action.payload
        }
    },
    [GSTTS]: (state, action) => {
        return {
            ...state,
            ...action.payload
        }
    },
    [GSTTF]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            result_gstt: { data: [] }
        }
    },

}, INITIAL_STATE);

export { statistic as default }