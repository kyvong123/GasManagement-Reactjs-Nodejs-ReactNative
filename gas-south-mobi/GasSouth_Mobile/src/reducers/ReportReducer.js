import {
    handleActions
} from 'redux-actions';
import {
    REPORT,
    REPORT_SUCCESS,
    REPORT_FAIL,
    REPORT_CHART_FAIL,
    REPORT_CHART,
    REPORT_CHART_SUCCESS,
    LOG_OUT, REPORT_CHART_BAR, REPORT_CHART_BAR_SUCCESS,REPORT_CHART_BAR_FAIL
} from '../types';
import {Actions} from 'react-native-router-flux';

const INITIAL_STATE = {
    reports: [],
    scanResults: [],
    report: {},
    reportChart:{},
    reportChartBar:{},
    loading: false,
    error: ''
};

const reports = handleActions({
    [REPORT]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: true,
        }
    },
    [REPORT_SUCCESS]: (state, action) => {
        return {
            ...state,
            report: action.payload.data,
            loading: false,
        }
    },
    [REPORT_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [REPORT_CHART]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: true,
        }
    },
    [REPORT_CHART_SUCCESS]: (state, action) => {
        return {
            ...state,
            reportChart: action.payload.data,
            loading: false,
        }
    },
    [REPORT_CHART_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [REPORT_CHART_BAR]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: true,
        }
    },
    [REPORT_CHART_BAR_SUCCESS]: (state, action) => {
        return {
            ...state,
            reportChartBar: action.payload.data,
            loading: false,
        }
    },
    [REPORT_CHART_BAR_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [LOG_OUT]: () => INITIAL_STATE
}, INITIAL_STATE);

export {
    reports as
        default
};
