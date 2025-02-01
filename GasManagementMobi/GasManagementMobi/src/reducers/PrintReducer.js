import { handleActions } from 'redux-actions';
import {
    GET_LST_CYLINDER,
    GET_LST_CYLINDER_SUCCESS,
    GET_LST_CYLINDER_FAIL
} from '../types';

const INITIAL_STATE = {
    list_inforCylinder: []
};

const print = handleActions({
    [GET_LST_CYLINDER]: () => (state, action) => {
        return {
            ...state,
            findCylinders: action.payload.findCylinders,
            //loading: false         
        }
    },
    [GET_LST_CYLINDER_SUCCESS]: (state, action) => {
        return {
            ...state,
            list_inforCylinder: action.payload.list_inforCylinder,
            //loading: false,
        }
    },
    [GET_LST_CYLINDER_FAIL]: (state, action) => {
        return {
            ...state,
            //loading: false,
            error: action.payload
        }
    },
}, INITIAL_STATE);

export { print as default };