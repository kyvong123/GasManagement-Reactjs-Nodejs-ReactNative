import {
    handleActions
} from 'redux-actions';
import {
    GCIT,
    GCITS,
    GCITF,
} from '../types';

const INITIAL_STATE = {
    result_getCurrentInvenTory: {
        data: []
    }
};

const currentInventory = handleActions({
    [GCIT]: (state, action) => {
        //console.log("GET_CurrentInventorynew",action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GCITS]: (state, action) => {
        //console.log("GET_CurrentInventory_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GCITF]: (state, action) => {
        //console.log("GET_CurrentInventory_Fail", action);
        return {
            ...state,
            ...action.payload,
            // result_getExport: { data: [] }
            result_getCurrentInvenTory: { data: [] }
        }
    },
}, INITIAL_STATE);

export { currentInventory as default }