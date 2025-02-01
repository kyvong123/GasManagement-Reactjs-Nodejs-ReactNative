import {
    handleActions
} from 'redux-actions';
import {
    LOG_OUT,
    FETCH_CYLINDER,
    FETCH_CYLINDER_SUCCESS,
    FETCH_CYLINDER_FAIL,
    REPORT_CYCLINDER,
    REPORT_CYCLINDER_SUCCESS,
    REPORT_CYCLINDER_FAIL,
    ADD_CYLINDER,
    DELETE_CYLINDERS,
    UPDATE_CYLINDERS,
    UPDATE_CYLINDERS_SUCCESS,
    UPDATE_CYLINDERS_FAIL,
    CHANGE_CYCLINDER_ACTION,
    TYPE_FOR_PARTNER,
    RETURN_GAS,
    RETURN_GAS_SUCCESS,
    RETURN_GAS_FAIL,
    GET_DUPLICATE_CYLINDER,
    GET_DUPLICATE_CYLINDER_SUCCESS,
    GET_DUPLICATE_CYLINDER_FAIL,
    IMPORT_DUP_CYLINDER,
    IMPORT_DUP_CYLINDER_SUCCESS,
    IMPORT_DUP_CYLINDER_FAIL
} from '../types';
import { Actions } from 'react-native-router-flux';

const INITIAL_STATE = {
    cylinders: [],
    scanResults: [],
    cyclinder: {},
    dupCylinder: {},
    loading: false,
    error: ''
};

const cylinders = handleActions({
    [FETCH_CYLINDER]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: true,
        }
    },
    [FETCH_CYLINDER_SUCCESS]: (state, action) => {
        return {
            ...state,
            cyclinder: action.payload.cyclinder,
            loading: false,
        }
    },
    [FETCH_CYLINDER_FAIL]: (state, action) => {

        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [REPORT_CYCLINDER]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: true,
        }
    },
    [REPORT_CYCLINDER_SUCCESS]: (state, action) => {
        return {
            ...state,
            loading: false,
        }
    },
    [REPORT_CYCLINDER_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [TYPE_FOR_PARTNER]: (state, action) => {
        return {
            ...state,
            typeForPartner: action.payload.data,
        }
    },
    [CHANGE_CYCLINDER_ACTION]: (state, action) => {
        return {
            ...state,
            ...action.payload,
        }
    },
    [ADD_CYLINDER]: (state, action) => {
        if (state.cylinders.includes(action.payload.id)) return { ...state }
        return {
            ...state,
            cylinders: [...state.cylinders, ...[action.payload.id]],
        }
    },
    [DELETE_CYLINDERS]: (state, action) => {
        return {
            ...state,
            cylinders: [],
        }
    },
    [UPDATE_CYLINDERS]: (state, action) => {
        return {
            ...state,
            loading: true,
        }
    },
    [UPDATE_CYLINDERS_SUCCESS]: (state, action) => {
        return {
            ...state,
            cylinders: [],
            loading: false,
        }
    },
    [UPDATE_CYLINDERS_FAIL]: (state, action) => {
        return {
            ...state,
            cylinders: [],
            loading: false,
            error: action.payload
        }
    },
    [LOG_OUT]: () => INITIAL_STATE,
    [RETURN_GAS]: () => (state, action) => {
        // console.log("rtnGasss", state, action)
        return {
            ...state,
        }
    },
    [RETURN_GAS_SUCCESS]: (state, action) => {
        return {
            ...state,
            loading: false,
        }
    },
    [RETURN_GAS_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [GET_DUPLICATE_CYLINDER]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            loading: false,
        }
    },
    [GET_DUPLICATE_CYLINDER_SUCCESS]: (state, action) => {
        return {
            ...state,
            dupCylinder: action.payload.result_getDuplicateCylinder,
            loading: false,
        }
    },
    [GET_DUPLICATE_CYLINDER_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    },
    [IMPORT_DUP_CYLINDER]: (state, action) => {
        return {
            ...state,
            loading: true,
        }
    },
    [IMPORT_DUP_CYLINDER_SUCCESS]: (state, action) => {
        return {
            ...state,
            cylinders: [],
            loading: false,
        }
    },
    [IMPORT_DUP_CYLINDER_FAIL]: (state, action) => {
        return {
            ...state,
            cylinders: [],
            loading: false,
            error: action.payload
        }
    },
}, INITIAL_STATE);

export {
    cylinders as
        default
};