import {createActions} from 'redux-actions';
import {
    EXPORT_PLACE,
    EXPORT_PLACE_SUCCESS,
    EXPORT_PLACE_FAIL,
} from '../types';

export const {
    exportPlace,
    exportPlaceSuccess,
    exportPlaceFail,
} = createActions({
    [EXPORT_PLACE]: () => ({}),
    [EXPORT_PLACE_SUCCESS]: (data) => ({data}),
    [EXPORT_PLACE_FAIL]: (error) => ({error}),
});
