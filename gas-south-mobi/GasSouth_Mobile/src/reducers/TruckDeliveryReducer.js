import { handleActions } from 'redux-actions';
import { TRUCK_TYPE_DELIVERY, TRUCK_DELIVERY_STORE_SERIAL, TRUCK_DELIVERY_DELETE_SERIAL, TRUCK_STORE_ORDER_SELECTION, TRUCK_RESET_LIST_SERIAL_ORDER } from '../types';

const INITIAL_STATE = {
    currentTypeDelivery: undefined,
    storeSerial: [],
    currentOrderSelection: undefined
};

const truckDeliveryReducer = handleActions({

    [TRUCK_TYPE_DELIVERY]: (state, action) => {
        return {
            ...state,
            currentTypeDelivery: action.payload,
        }
    },
    [TRUCK_DELIVERY_STORE_SERIAL]: (state, action) => {

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
    [TRUCK_DELIVERY_DELETE_SERIAL]: (state, action) => {
        return {
            ...state,
            storeSerial: state.storeSerial.filter(item => item.serial !== action.payload)
        }
    },
    [TRUCK_STORE_ORDER_SELECTION]: (state, action) => {
        return {
            ...state,
            currentOrderSelection: action.payload
        }
    },
    [TRUCK_RESET_LIST_SERIAL_ORDER]: state => {
        return {
            ...state,
            storeSerial: []
        }
    }

}, INITIAL_STATE);

export { truckDeliveryReducer as default };