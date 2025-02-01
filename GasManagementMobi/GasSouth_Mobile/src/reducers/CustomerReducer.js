import { handleActions } from 'redux-actions'
import {
    GET_LIST_BY_CUSTOMER_TYPE,
    GET_LIST_BY_CUSTOMER_TYPE_SUCCESS,
    GET_LIST_BY_CUSTOMER_TYPE_FAIL,
    GET_LIST_BRANCH,
    GET_LIST_BRANCH_SUCCESS,
    GET_LIST_BRANCH_FAIL,
    GET_LIST_TRUCK,
    GET_LIST_TRUCK_SUCCESS,
    GET_LIST_TRUCK_FAIL,
    GET_LIST_CUSTOMER_TYPE,
    GET_LIST_CUSTOMER_TYPE_SUCCESS,
    GET_LIST_CUSTOMER_TYPE_FAIL,
} from '../types'

const INITIAL_STATE = {
    resulListCustomer: {
        data: []
    },
    resulListBranch: {
        data: []
    },
    resulListTruck: {
        data: []
    },
    resultCustomer: {
        data: []
    },
};

const customer = handleActions({
    [GET_LIST_BY_CUSTOMER_TYPE]: (state, action) => {
        //console.log("khanhkhanh", action);
        return {
            ...state,
            ...action.payload,
            loading: false,
            // error: '',

        }
    },
    [GET_LIST_BY_CUSTOMER_TYPE_SUCCESS]: (state, action) => {
        //console.log("GET_LIST_BY_CUSTOMER_TYPE_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LIST_BY_CUSTOMER_TYPE_FAIL]: (state, action) => {
        //console.log("GET_LIST_BY_CUSTOMER_TYPE_FAIL", action);
        return {
            ...state,
            ...action.payload,
            resulListCustomer: { data: [] }
        }
    },
    [GET_LIST_BRANCH]: (state, action) => {
        //console.log("khanhkhanh2", action);
        return {
            ...state,
            ...action.payload,
            loading: false,
            // error: '',

        }
    },
    [GET_LIST_BRANCH_SUCCESS]: (state, action) => {
        //console.log("GET_LIST_BRANCH_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LIST_BRANCH_FAIL]: (state, action) => {
        //console.log("GET_LIST_BRANCH_FAIL", action);
        return {
            ...state,
            ...action.payload,
            resulListBranch: { data: [] }

        }
    },
    [GET_LIST_TRUCK]: (state, action) => {
        //console.log("khanhkhanh2", action);
        return {
            ...state,
            ...action.payload,
            loading: false,
            // error: '',
        }
    },
    [GET_LIST_TRUCK_SUCCESS]: (state, action) => {
        //console.log("GET_LIST_TRUCK_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LIST_TRUCK_FAIL]: (state, action) => {
        //console.log("GET_LIST_TRUCK_FAIL", action);
        return {
            ...state,
            ...action.payload,
            resulListTruck: { data: [] }

        }
    },
    [GET_LIST_CUSTOMER_TYPE]: (state, action) => {
        //console.log("GET_LIST_CUSTOMER_TYPE", action);
        return {
            ...state,
            ...action.payload,
            loading: true,
        }
    },
    [GET_LIST_CUSTOMER_TYPE_SUCCESS]: (state, action) => {
        //console.log("GET_LIST_CUSTOMER_TYPE_SUCCESS", action);
        return {
            ...state,
            ...action.payload,
            loading: false,
        }
    },
    [GET_LIST_CUSTOMER_TYPE_FAIL]: (state, action) => {
        //console.log("GET_LIST_CUSTOMER_TYPE_FAIL", action);
        return {
            ...state,
            ...action.payload,
            loading: false,
            resulListCustomer: { data: [] }
        }
    },
}, INITIAL_STATE);

export { customer as default };
