import {
    handleActions
} from 'redux-actions';
import {
    GET_Export,
    GET_Export_SUCCESS,
    GET_Export_FAIL,
    GET_Export_CYLINDER_SUCCESS,
    GET_Import_CYLINDER_SUCCESS,
    GET_STATISTICS_RESULT,
    GET_STATISTICS,
    GET_STATISTICS_ERR
} from '../types';

const INITIAL_STATE = {
    result_getExport: {
        data: []
    },
};

const statistic = handleActions({
    [GET_Export]: (state, action) => {
        //console.log("GET_Export", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_STATISTICS_ERR]: (state, action) => {
        //console.log("GET_Export", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_STATISTICS_RESULT]: (state, action) => {
        //console.log("GET_Export", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_STATISTICS]: (state, action) => {
        //console.log("GET_STATISTICS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_Export_SUCCESS]: (state, action) => {
        //console.log("GET_Export_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_Export_CYLINDER_SUCCESS]: (state, action) => {
        //console.log("GET_Export_CYLINDER_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_Import_CYLINDER_SUCCESS]: (state, action) => {
        //console.log("GET_Import_CYLINDER_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_Export_FAIL]: (state, action) => {
        //console.log("GET_Export_Fail", action);
        return {
            ...state,
            ...action.payload,
            result_getExport: { data: [] }
        }
    },

}, INITIAL_STATE);

export { statistic as default }