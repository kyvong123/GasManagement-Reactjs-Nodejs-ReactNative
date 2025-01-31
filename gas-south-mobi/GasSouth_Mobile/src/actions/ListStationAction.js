import {
    createActions
} from 'redux-actions';
import {
    GET_LIST_STATION,
    GET_LIST_STATION_SUCCESS
} from '../types';

export const {
    getListStation,
    getListStationSuccess
} = createActions({
    [GET_LIST_STATION]: (id) => ({ id }),
    [GET_LIST_STATION_SUCCESS]: (resultListStation) => ({ resultListStation })
});