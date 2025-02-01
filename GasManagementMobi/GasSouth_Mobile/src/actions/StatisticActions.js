import {
    createActions
} from 'redux-actions';
import {
    GSTT,
    GSTTS,
    GSTTF
} from '../types';

export const {
    gstt,
    gstts,
    gsttf
} = createActions({
    [GSTT]: (target_id, start_date, end_date, statisticalType) => ({
        target_id,
        start_date,
        end_date,
        statisticalType
    }),
    [GSTTS]: (result_gsst) => ({
        result_gsst
    }),
    [GSTTF]: (error) => ({
        error
    }),
});