import { handleActions } from 'redux-actions';
import { STORE_SERIAL, TYPE_REFLUX, RELUX_DELETE_SERIAL, IS_CHILD_OF, DRIVER_RESET_LIST_SERIAL_RELUX } from '../types';

const INITIAL_STATE = {
    currentTypeReflux: undefined,
    storeSerial: [],
    isChildOf: undefined,
};

const currentTypeReflux = handleActions({

    [TYPE_REFLUX]: (state, action) => {
        return {
            ...state,
            currentTypeReflux: action.payload,
        }
    },
    [STORE_SERIAL]: (state, action) => {

        let newStoreSerial = undefined;

        if (state.storeSerial.some(item => item.serial === action.payload.serial)) {
            newStoreSerial = [...state.storeSerial];
        } else {
            newStoreSerial = [...state.storeSerial, action.payload];
        }
        //console.log("GGGGGGGG", newStoreSerial)
        return {
            ...state,
            storeSerial: newStoreSerial
        }
    },
    [RELUX_DELETE_SERIAL]: (state, action) => {
        return {
            ...state,
            storeSerial: state.storeSerial.filter(item => item.serial !== action.payload)
        }
    },
    [IS_CHILD_OF]: (state, action) => {
        return {
            ...state,
            isChildOf: action.payload
        }
    },
    [DRIVER_RESET_LIST_SERIAL_RELUX]: state => ({
        ...state,
        storeSerial: []
    })
}, INITIAL_STATE);

export { currentTypeReflux as default };