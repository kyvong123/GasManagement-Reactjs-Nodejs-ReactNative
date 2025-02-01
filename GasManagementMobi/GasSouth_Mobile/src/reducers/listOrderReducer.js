import { handleActions } from 'redux-actions';
import { LIST_ORDER, LIST_DELIVERY_STATISTICS } from '../types';

const INITIAL_STATE = {
    ArrayListOrder: [],
    ArrayDeliveryStatistics: []
};

const listOrder = handleActions({

    [LIST_ORDER]: (state, action) => {
        //console.log('TEST_REDUER: ', action.payload)
        return {
            ...state,
            ArrayListOrder: action.payload
        }
    },
    [LIST_DELIVERY_STATISTICS]: (state, action) => {
        //console.log('TEST_REDUER: ', action.payload)
        return {
            ...state,
            ArrayDeliveryStatistics: action.payload
        }
    },
}, INITIAL_STATE);


export default listOrder;