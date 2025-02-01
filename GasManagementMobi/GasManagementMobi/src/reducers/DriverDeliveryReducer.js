import { handleActions } from 'redux-actions';
import { TYPE_DELIVERY, DELIVERY_STORE_SERIAL, DELIVERY_DELETE_SERIAL, STORE_ORDER_SELECTION, DRIVER_RESET_LIST_SERIAL_ORDER } from '../types';

const INITIAL_STATE = {
    currentTypeDelivery: undefined,
    storeSerial: [],
    currentOrderSelection: undefined
};

const deliveryReducer = handleActions({

    [TYPE_DELIVERY]: (state, action) => {
        return {
            ...state,
            currentTypeDelivery: action.payload,
        }
    },
    [DELIVERY_STORE_SERIAL]: (state, action) => {

        let newStoreSerial = undefined;

        if (state.storeSerial.some(item => item.serial === action.payload.serial)) {
            newStoreSerial = [...state.storeSerial];
        } else {
            newStoreSerial = [...state.storeSerial, action.payload];
        }

        return {
            ...state,
            storeSerial: newStoreSerial
        }
    },
    [DELIVERY_DELETE_SERIAL]: (state, action) => {
        return {
            ...state,
            storeSerial: state.storeSerial.filter(item => item.serial !== action.payload)
        }
    },
    [STORE_ORDER_SELECTION]: (state, action) => {
        return {
            ...state,
            currentOrderSelection: action.payload
        }
    },
    [DRIVER_RESET_LIST_SERIAL_ORDER]: state => {
        return {
            ...state,
            storeSerial: []
        }
    }

}, INITIAL_STATE);

export { deliveryReducer as default };