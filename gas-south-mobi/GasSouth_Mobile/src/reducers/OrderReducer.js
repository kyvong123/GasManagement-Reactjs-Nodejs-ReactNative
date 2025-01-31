import { handleActions } from 'redux-actions';
import {
    CREATE_ORDER,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    GET_ORDER,
    GET_ORDER_SUCCESS,
    GET_ORDER_FAIL,
    UPDATE_ORDER_STATUS,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAIL,
    GET_ORDER_FACTORY,
    GET_ORDER_FACTORY_SUCCESS,
    GET_ORDER_FACTORY_FAIL,
    // G.hoa them
    GET_LST_REGION,
    GET_LST_REGION_SUCCESS,
    GET_LST_REGION_FAIL,
    SET_LIST_ORDER,
    GET_LST_WARE_HOUSES,
    GET_LST_WARE_HOUSES_SUCCESS,
    GET_LST_WARE_HOUSES_FAIL,
    //linh
    SET_ORDER_REQUEST,
    SET_ORDER_REQUEST_SUCCESS,
    SET_ORDER_REQUEST_FAIL,
    GET_ORDER_REQUEST,
    GET_ORDER_REQUEST_SUCCESS,
    GET_ORDER_REQUEST_FAIL,
    //Hang
    APPROVAL_ORDER,
    APPROVAL_ORDER_SUCCESS,
    APPROVAL_ORDER_FAIL,
    CANCEL_ORDER,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAIL,
    GET_ALL_SHIPPING_ORDER_INIT,
    GET_ALL_SHIPPING_ORDER_INIT_SUCCESS,
    GET_ALL_SHIPPING_ORDER_INIT_FAIL,

    GET_ALL_SHIPPING_ORDER_TANK_INIT,
    GET_ALL_SHIPPING_ORDER_TANK_INIT_SUCCESS,
    GET_ALL_SHIPPING_ORDER_TANK_INIT_FAIL,

    GET_ALL_SHIPPING_ORDER_DETAIL_INIT,
    GET_ALL_SHIPPING_ORDER_DETAIL_INIT_SUCCESS,
    GET_ALL_SHIPPING_ORDER_DETAIL_INIT_FAIL,

    GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT,
    GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS,
    GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL,

    GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT,
    GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_SUCCESS,
    GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_FAIL,
    //thay doi trang thai don tai xe xe bon
    GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT,
    GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS,
    GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL,

    SET_CREATE_SHIPPING_ORDER_LOCATION,
    SET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS,
    SET_CREATE_SHIPPING_ORDER_LOCATION_FAIL,

    SET_CREATE_SHIPPING_ORDER_TANK_LOCATION,
    SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_SUCCESS,
    SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_FAIL,

    GET_CREATE_SHIPPING_ORDER_LOCATION,
    GET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS,
    GET_CREATE_SHIPPING_ORDER_LOCATION_FAIL,
    GET_LST_CHILDS,
    GET_LST_CHILDS_SUCCESS,
    GET_LST_CHILDS_FAIL,
} from '../types';

const INITIAL_STATE = {
    resultGetOrder: {
        order: []
    },
    resultGetOrderHistory: {
        orderHistories: []
    },
    result_getOrderFactory: {
        orderFactory: []
    },
    result_getLstRegion: {
        data: []
    },
    result_GetCompletedOrderAndCylinders: {
        data: []
    },
    //linh
    result_setOrderRequest: {
        data: []
    },
    result_getOrderRequest: {
        data: []
    },
    result_getListWareHouse: {
        data: []
    },
    result_cancelOrder: {
        data: []
    },
    result_approvalOrder: {
        data: []
    },
    result_GetAllShippingOrderInit: {
        data: []
    },
    result_GetAllShippingOrderTankInit: {
        data: []
    },
    result_GetAllShippingOrderDetailInit: {
        data: []
    },
    result_GetAllShippingOrderTankDetailInit: {
        data: []
    },
    result_UpdateShippingOrderDetailInit: {
        data: []
    },
    result_UpdateShippingOrderTankDetailInit: {//thay doi trang thai tai xe xe bon
        data: []
    },
    result_setCreateShippingOrderLocation: {//lay vi tri
        data: []
    },
    result_setCreateShippingOrderTankLocation: {//lay vi tri
        data: []
    },
    result_getCreateShippingOrderLocation: {//lay vi tri
        data: []
    },
    //
    result_getAllChilds: {
        data: []
    },
};

const order = handleActions({
    [CREATE_ORDER]: (state, action) => {
        //console.log("reducer_createOrder", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [CREATE_ORDER_SUCCESS]: (state, action) => {
        //console.log("reducer_createOrder_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [CREATE_ORDER_FAIL]: (state, action) => {
        //console.log("reducer_createOrder_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER]: (state, action) => {
        //console.log("reducer_getOrder", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER_SUCCESS]: (state, action) => {
        //console.log("reducer_getOrder_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER_FAIL]: (state, action) => {
        //console.log("reducer_getOrder_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [UPDATE_ORDER_STATUS]: (state, action) => {
        //console.log("reducer_updateOrderStatus", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [UPDATE_ORDER_STATUS_SUCCESS]: (state, action) => {
        //console.log("reducer_updateOrderStatus_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [UPDATE_ORDER_STATUS_FAIL]: (state, action) => {
        //console.log("reducer_updateOrderStatus_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER_FACTORY]: (state, action) => {
        //console.log("reducer_getOrderFactory", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER_FACTORY_SUCCESS]: (state, action) => {
        //console.log("reducer_getOrderFactory_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER_FACTORY_FAIL]: (state, action) => {
        //console.log("reducer_getOrderFactory_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LST_REGION]: (state, action) => {
        //console.log("reducer_GET_LST_REGION", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LST_REGION_SUCCESS]: (state, action) => {
        //console.log("reducer_GET_LST_REGION_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LST_REGION_FAIL]: (state, action) => {
        //console.log("reducer_GET_LST_REGION_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_getLstRegion: { data: [] }
        }
    },
    [SET_LIST_ORDER]: (state, action) => {
        //console.log("SET_LIST_ORDER", action);
        return {
            ...state,
            ...action.payload
        }
    },
    // ============================================================
    //linh
    [SET_ORDER_REQUEST]: (state, action) => {
        //console.log("reducer_setOrderRequest", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_ORDER_REQUEST_SUCCESS]: (state, action) => {
        //console.log("reducer_setOrderRequest_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_ORDER_REQUEST_FAIL]: (state, action) => {
        //console.log("reducer_setOrderRequest_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_setOrderRequest: { data: [] }
        }
    },
    //linh
    [GET_ORDER_REQUEST]: (state, action) => {
        //console.log("reducer_getOrderRequest", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER_REQUEST_SUCCESS]: (state, action) => {
        //console.log("reducer_getOrderRequest_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ORDER_REQUEST_FAIL]: (state, action) => {
        //console.log("reducer_getOrderRequest_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_getOrderRequest: { data: [] }
        }
    },
    //linh
    [GET_LST_WARE_HOUSES]: (state, action) => {
        //console.log("reducer_ListWareHouse", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LST_WARE_HOUSES_SUCCESS]: (state, action) => {
        //console.log("reducer_getListWareHouse_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LST_WARE_HOUSES_FAIL]: (state, action) => {
        //console.log("reducer_getListWareHouse_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_getListWareHouse: { data: [] }
        }
    },
    //Hang
    [APPROVAL_ORDER]: (state, action) => {
        //console.log("reducer_approvalOrderRequest", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [APPROVAL_ORDER_SUCCESS]: (state, action) => {
        //console.log("reducer_approvalOrderRequest_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [APPROVAL_ORDER_FAIL]: (state, action) => {
        //console.log("reducer_approvalOrderRequest_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_approvalOrder: { data: [] }
        }
    },
    [CANCEL_ORDER]: (state, action) => {
        //console.log("reducer_cancelOrderRequest", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [CANCEL_ORDER_SUCCESS]: (state, action) => {
        //console.log("reducer_cancelOrderRequest_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [CANCEL_ORDER_FAIL]: (state, action) => {
        //console.log("reducer_cancelOrderRequest_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_cancelOrder: { data: [] }
        }
    },
    // linh
    [GET_ALL_SHIPPING_ORDER_INIT]: (state, action) => {
        //console.log("reducer_getallshippingorderinit", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_INIT_SUCCESS]: (state, action) => {
        //console.log("reducer_getallshippingorderinit_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_INIT_FAIL]: (state, action) => {
        //console.log("reducer_getallshippingorderinit_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_GetAllShippingOrderInit: { data: [] }
        }
    },
    // linh ordertank
    [GET_ALL_SHIPPING_ORDER_TANK_INIT]: (state, action) => {
        //console.log("reducer_getallshippingordertankinit", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_TANK_INIT_SUCCESS]: (state, action) => {
        //console.log("reducer_getallshippingorderinit_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_TANK_INIT_FAIL]: (state, action) => {
        //console.log("reducer_getallshippingorderinit_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_GetAllShippingOrderTankInit: { data: [] }
        }
    },
    //tai xe xe bon detail
    [GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT]: (state, action) => {
        //console.log("reducer_getallshippingorderDetailinit", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS]: (state, action) => {
        //console.log("reducer_getallshippingorderDetailinit_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL]: (state, action) => {
        //console.log("reducer_getallshippingorderDetailinit_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_GetAllShippingOrderTankDetailInit: { data: [] }
        }
    },
    [GET_ALL_SHIPPING_ORDER_DETAIL_INIT]: (state, action) => {
        //console.log("reducer_getallshippingorderDetailinit", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_DETAIL_INIT_SUCCESS]: (state, action) => {
        //console.log("reducer_getallshippingorderDetailinit_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_ALL_SHIPPING_ORDER_DETAIL_INIT_FAIL]: (state, action) => {
        //console.log("reducer_getallshippingorderDetailinit_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_GetAllShippingOrderInit: { data: [] }
        }
    },
    [GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT]: (state, action) => {
        //console.log("reducer_updateshippingorderDetailinit", action);
        return {
            ...state,
            ...action.payload
        }
    },

    [GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_SUCCESS]: (state, action) => {
        //console.log("reducer_updateshippingorderDetailinit_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_FAIL]: (state, action) => {
        //console.log("reducer_updateshippingorderDetailinit_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_UpdateShippingOrderDetailInit: { data: [] }
        }
    },
    //thay doi trang thai don van chuyen xe bon
    [GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT]: (state, action) => {
        //console.log("reducer_updateshippingorderTankDetailinit", action);
        return {
            ...state,
            ...action.payload
        }
    },

    [GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS]: (state, action) => {
        //console.log("reducer_updateshippingorderTankDetailinit_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL]: (state, action) => {
        //console.log("reducer_updateshippingorderTankDetailinit_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_UpdateShippingOrderTankDetailInit: { data: [] }
        }
    },

    [SET_CREATE_SHIPPING_ORDER_LOCATION]: (state, action) => {//lay vi tri
        //console.log("setCreateShippingOrderLocation", action);
        return {
            ...state,
            ...action.payload
        }
    },

    [SET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS]: (state, action) => {
        //console.log("reducer_setCreateShippingOrderLocation_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_CREATE_SHIPPING_ORDER_LOCATION_FAIL]: (state, action) => {
        //console.log("reducer_setCreateShippingOrderLocation_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_setCreateShippingOrderLocation: { data: [] }
        }
    },


    [SET_CREATE_SHIPPING_ORDER_TANK_LOCATION]: (state, action) => {//tao vi tri tai xe xe bon
        //console.log("setCreateShippingTankOrderLocation", action);
        return {
            ...state,
            ...action.payload
        }
    },

    [SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_SUCCESS]: (state, action) => {
        //console.log("reducer_setCreateShippingOrderTankLocation_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_FAIL]: (state, action) => {
        //console.log("reducer_setCreateShippingOrderTankLocation_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_setCreateShippingOrderTankLocation: { data: [] }
        }
    },

    [GET_CREATE_SHIPPING_ORDER_LOCATION]: (state, action) => {//lay vi tri
        //console.log("getCreateShippingOrderLocation", action);
        return {
            ...state,
            ...action.payload
        }
    },

    [GET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS]: (state, action) => {
        //console.log("reducer_getCreateShippingOrderLocation_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_CREATE_SHIPPING_ORDER_LOCATION_FAIL]: (state, action) => {
        //console.log("reducer_getCreateShippingOrderLocation_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_getCreateShippingOrderLocation: { data: [] }
        }
    },
    [GET_LST_CHILDS]: (state, action) => {
        //console.log("reducer_getAllChilds", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LST_CHILDS_SUCCESS]: (state, action) => {
        //console.log("reducer_getAllChilds_SUCCESS", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GET_LST_CHILDS_FAIL]: (state, action) => {
        //console.log("reducer_getAllChilds_FAIL", action);
        return {
            ...state,
            ...action.payload,
            result_getAllChilds: { data: [] }

        }
    },
}, INITIAL_STATE);

export { order as default };