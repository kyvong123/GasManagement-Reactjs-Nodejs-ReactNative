import { createActions } from 'redux-actions';
import {
    GET_LIST_MANUFACTURE,
    GET_LIST_MANUFACTURE_RESULT
} from '../types';

export const {
    getListManufacture,
    getListManufactureResult
} = createActions({
    [GET_LIST_MANUFACTURE]: (isChildOf) => ({ isChildOf }),
    [GET_LIST_MANUFACTURE_RESULT]: (get_listManufactureResult) => ({ get_listManufactureResult })
})
