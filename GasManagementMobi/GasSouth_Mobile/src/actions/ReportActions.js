import { createActions } from 'redux-actions';
import {
    REPORT,
    REPORT_SUCCESS,
    REPORT_FAIL,
    REPORT_CHART,
    REPORT_CHART_SUCCESS,
    REPORT_CHART_FAIL,
    REPORT_CHART_BAR,
    REPORT_CHART_BAR_SUCCESS,
    REPORT_CHART_BAR_FAIL,
} from '../types';

export const  {
    report,
    reportSuccess,
    reportFail,
    reportChart,
    reportChartSuccess,
    reportChartFail,
    reportChartBar,
    reportChartBarSuccess,
    reportChartBarFail,
} = createActions({
    [REPORT]: (begin,end) => ({begin,end}),
    [REPORT_SUCCESS]: (data) => ({data}),
    [REPORT_FAIL]: (error) => ({ error }),
    [REPORT_CHART]: () => ({}),
    [REPORT_CHART_SUCCESS]: (data) => ({data}),
    [REPORT_CHART_FAIL]: (error) => ({ error }),
    [REPORT_CHART_BAR]: (target_id,start_date,end_date) => ({target_id,start_date,end_date}),
    [REPORT_CHART_BAR_SUCCESS]: (data) => ({data}),
    [REPORT_CHART_BAR_FAIL]: (error) => ({ error }),
});

