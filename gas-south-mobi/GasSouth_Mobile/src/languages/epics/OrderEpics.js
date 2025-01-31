import { ajax } from "rxjs/ajax";
import { throwError, of, EMPTY } from "rxjs";
import { ofType } from "redux-observable";
import { groupBy } from "lodash";
import {
  mergeMap,
  retry,
  concat,
  catchError,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
} from "rxjs/operators";
import { ajaxAdapter, handleError } from "../../helper/utils";
import { Actions } from "react-native-router-flux";
import { setToken, onSignOut } from "../../helper/auth";
import userApi from "../../api/user";
import saver from "../../utils/saver";
import { connect } from "react-redux";
import { changeLanguage } from "../../actions/LanguageActions";
import { destinationList } from "../../helper/selector";
import i18n from "i18n-js";
import { setLanguage } from "../../helper/auth";
import { Alert } from "react-native";

import {
  CREATE_ORDER,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  GET_ORDER,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAIL,
  GET_ORDER_HISTORY,
  GET_ORDER_HISTORY_SUCCESS,
  GET_ORDER_HISTORY_FAIL,
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAIL,
  GET_ORDER_FACTORY,
  GET_ORDER_FACTORY_SUCCESS,
  GET_ORDER_FACTORY_FAIL,
  GET_LST_WARE_HOUSES,
  GET_LST_WARE_HOUSES_SUCCESS,
  GET_LST_WARE_HOUSES_FAIL,
  SET_ORDER,
  SET_ORDER_SUCCESS,
  SET_ORDER_FAIL,
  GET_LIST_STORE_CODE,
  SET_NEW_ORDER,
  GET_COMPLETED_ORDER_AND_CYLINDERS,
  GET_COMPLETED_ORDER_AND_CYLINDERS_SUCCESS,
  GET_COMPLETED_ORDER_AND_CYLINDERS_FAIL,
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
  //shipping
  GET_ALL_SHIPPING_ORDER_INIT,
  GET_ALL_SHIPPING_ORDER_INIT_SUCCESS,
  GET_ALL_SHIPPING_ORDER_INIT_FAIL,
  GET_ALL_SHIPPING_ORDER_TANK_INIT,
  GET_ALL_SHIPPING_ORDER_TANK_INIT_SUCCESS,
  GET_ALL_SHIPPING_ORDER_TANK_INIT_FAIL,
  //shipping detail
  GET_ALL_SHIPPING_ORDER_DETAIL_INIT,
  GET_ALL_SHIPPING_ORDER_DETAIL_INIT_SUCCESS,
  GET_ALL_SHIPPING_ORDER_DETAIL_INIT_FAIL,
  GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT,
  GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS,
  GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL,
  GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT,
  GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_SUCCESS,
  GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_FAIL,
  GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT,
  GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS,
  GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL,
  SET_CREATE_SHIPPING_ORDER_LOCATION,
  SET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS,
  SET_CREATE_SHIPPING_ORDER_LOCATION_FAIL,
  SET_CREATE_SHIPPING_ORDER_TANK_LOCATION, //tao vi tri tai xe xe bon
  SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_SUCCESS,
  SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_FAIL,
  GET_CREATE_SHIPPING_ORDER_LOCATION,
  GET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS,
  GET_CREATE_SHIPPING_ORDER_LOCATION_FAIL,
  GET_LST_CHILDS,
  GET_LST_CHILDS_SUCCESS,
  GET_LST_CHILDS_FAIL,
} from "../../types";
import cyclinderApi from "../../api/cyclinder";
import allshippingapi from "../../api/allshippingapi";
import {
  createOrder,
  setNewOrderSuccess,
  createOrderSuccess,
  createOrderFail,
  getOrder,
  getOrderSuccess,
  getOrderFail,
  getOrderHistory,
  getOrderHistoryFail,
  getOrderHistorySuccess,
  updateOrderStatusSuccess,
  updateOrderStatusFail,
  getOrderFactorySuccess,
  getOrderFactoryFail,
  getLstWareHouses,
  getLstWareHousesSuccess,
  getLstWareHousesFail,
  setOrder,
  setOrderSuccess,
  setOrderFail,
  getListStoreResult,
  getListStoreErr,
  getListStoreCodeResult,
  getCompletedOrderAndCylindersSuccess,
  getCompletedOrderAndCylindersFail,
  //linh
  setOrderRequest,
  setOrderRequestSuccess,
  setOrderRequestFail,
  getOrderRequest,
  getOrderRequestSuccess,
  getOrderRequestFail,
  //hang
  approvalOrder,
  approvalOrderSuccess,
  approvalOrderFail,
  cancelOrder,
  cancelOrderSuccess,
  cancelOrderFail,
  getAllShippingOrderInit, //linh
  getAllShippingOrderInitSuccess,
  getAllShippingOrderInitFail,
  getAllShippingOrderTankInit, //linh
  getAllShippingOrderTankInitSuccess,
  getAllShippingOrderTankInitFail,
  getAllShippingOrderDetailInit, //linh
  getAllShippingOrderDetailInitSuccess,
  getAllShippingOrderDetailInitFail,
  getAllShippingOrderTankDetailInit, //linh driver  tank detail
  getAllShippingOrderTankDetailInitSuccess,
  getAllShippingOrderTankDetailInitFail,
  getUpdateShippingOrderDetailInit,
  getUpdateShippingOrderDetailInitSuccess,
  getUpdateShippingOrderDetailInitFail,
  //thay doi trang thai don tai xe xe bon
  getUpdateShippingOrderTankDetailInit,
  getUpdateShippingOrderTankDetailInitSuccess,
  getUpdateShippingOrderTankDetailInitFail,
  setCreateShippingOrderLocation,
  setCreateShippingOrderLocationSuccess,
  setCreateShippingOrderLocationFail,
  setCreateShippingOrderTankLocation,
  setCreateShippingOrderTankLocationSuccess,
  setCreateShippingOrderTankLocationFail,
  getCreateShippingOrderLocation,
  getCreateShippingOrderLocationSuccess,
  getCreateShippingOrderLocationFail,
  //
  // getListAllChildsSuccess,
  // getLstChildsFail,
  getLstChildsSuccess,
  getLstChildsFail,
} from "../../actions/OrderActions";
import memoize from "lodash.memoize";
const translationGetters = {
  en: () => require("../../languages/en.json"),
  vi: () => require("../../languages/vi.json"),
};

componentWillUnmount = () => {
  console.log("OrderStatus Unmount");
};

componentDidMount = async () => {
  console.log("OrderStatus Didmount");
  try {
    console.log("Can get Language");
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener(
        "change",
        this.handleChangeLanguage(languageCode)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const chooseLanguageConfig = (lgnCode) => {
  let fallback = { languageTag: "vi" };
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = { languageTag: lgnCode };
  }

  const { languageTag } = fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

// --- Create Order ---

const createOrderEpic = (action$, state$) =>
  action$.pipe(
    ofType(CREATE_ORDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter("/order/setOrder", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("response_createOrderEpic", response.response);
            if (response.response.success === true) {
              Actions.app();
              //console.log("createOrderEpic_Success", response.response);
              return createOrderSuccess(response.response);
            }
            //console.log("createOrderEpic_Fail");
            return createOrderFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_createOrderEpic", error)
            return handleError(error, createOrderFail);
          })
        )
      //return EMPTY;
    )
  );

const getListStoreCode = (action$, state$) =>
  action$.pipe(
    ofType(GET_LIST_STORE_CODE),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter("/user/getListByCustomerType", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("response_liststore", response.response);
            if (response.response.success === true) {
              //console.log("createOrderEpic_Success", response.response);
              return getListStoreCodeResult(response.response);
            }
            //console.log("createOrderEpic_Fail");
            return createOrderFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_liststore", error)
            return handleError(error, createOrderFail);
          })
        )
      //return EMPTY;
    )
  );

const setNewOrder = (action$, state$) =>
  action$.pipe(
    ofType(SET_NEW_ORDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter("/order/setOrder", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("response_createOrderEpic", response.response);//
            if (response.response.success === true) {
              // Actions.app();
              //console.log("createOrderEpic_Success", response.response);
              return setNewOrderSuccess(response.response);
            }
            //console.log("createOrderEpic_Fail");
            return createOrderFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_createOrderEpic", error)
            return handleError(error, createOrderFail);
          })
        )
      //return EMPTY;
    )
  );

const createOrderSuccessEpic = (action$) =>
  action$.pipe(
    ofType(CREATE_ORDER_SUCCESS),
    mergeMap((action) => {
      //console.log("createOrder_SUCCESS", action.payload);
      // Alert.alert('Thông báo', action.payload.resultOrder.message);
      // alert(action.payload.message);
      return EMPTY;
    })
  );

const createOrderFailEpic = (action$) =>
  action$.pipe(
    ofType(CREATE_ORDER_FAIL),
    mergeMap((action) => {
      //console.log("createOrder_FAIL", action.payload);
      //setToken(action.payload);
      // Alert.alert('Thông báo', action.payload.error);
      return EMPTY;
    })
  );

// --- Get Orders CreatedBy ---

const getOrderEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ORDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("getOrderEpic", action.payload);
        ajaxAdapter(
          "/order/getOrdersRelateToUser",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("getOrderEpic", response.response);
            if (response.response.success === true) {
              //Actions.app();
              //console.log("getOrderEpic_Successjj", response.response);
              return getOrderSuccess(response.response);
            }
            //console.log("getOrderEpic_Fail");
            return getOrderFail(response.response.message);
          }),
          catchError((error) => {
            //console.log("catchError_getOrderEpic", error)
            return handleError(error, getOrderFail);
          })
        )
      //return EMPTY;
    )
  );

const getOrderSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_SUCCESS),
    mergeMap((action) => {
      //console.log("getOrder_SUCCESS", action.payload);
      // Alert.alert(translate('notification'), translate('GET_ORDER_STATUS_SUCCESS'));
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const getOrderFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_FAIL),
    mergeMap((action) => {
      //console.log("getOrder_FAIL", action.payload);
      //setToken(action.payload);
      // Alert.alert('Thông báo', action.payload.error);
      return EMPTY;
    })
  );

// --- Get Orders History ---
const getOrderHistoryEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ORDER_HISTORY),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("getOrderEpic", action.payload);
        ajaxAdapter("/order/getOrderHistories", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("getOrderHistoryEpicjj", response.response);
            if (response.response.status === true) {
              //Actions.app();
              //console.log("getOrderHistoryEpic_Success", response.response);
              return getOrderHistorySuccess(response.response);
            }
            //console.log("getOrderHistoryEpic_Fail");
            return getOrderHistoryFail(response.response.message);
          }),
          catchError((error) => {
            //console.log("catchError_getOrderHistortEpic", error)
            return handleError(error, getOrderHistoryFail);
          })
        )
      //return EMPTY;
    )
  );

const getOrderHistorySuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_HISTORY_SUCCESS),
    mergeMap((action) => {
      //console.log("getOrderHistory_SUCCESS", action.payload);
      // Alert.alert(translate('notification'), translate('GET_ORDER_STATUS_SUCCESS'));
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const getOrderHistoryFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_HISTORY_FAIL),
    mergeMap((action) => {
      //console.log("getOrderHistory_FAIL", action.payload);
      //setToken(action.payload);
      // Alert.alert('Thông báo', action.payload.error);
      return EMPTY;
    })
  );

// --- Get Orders Factory ---

const getOrderFactoryEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ORDER_FACTORY),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();

        ajaxAdapter(
          "/order/getOrdersRelateToUser",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("begin_getOrderFactoryEpic", response.response);
            if (response.response.success === true) {
              //Actions.app();
              //console.log("result_getOrderFactoryEpic_Success", response.response);
              //console.log("getOrderEpic", action.payload);
              return getOrderFactorySuccess(response.response);
            }
            //console.log("result_getOrderFactoryEpic_Fail");
            return getOrderFactoryFail(response.response.message);
          }),
          catchError((error) => {
            //console.log("catchError_getOrderFactoryEpic", error)
            return handleError(error, getOrderFactoryFail);
          })
        )
      //return EMPTY;
    )
  );

const getOrderFactorySuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_FACTORY_SUCCESS),
    mergeMap((action) => {
      //console.log("hoaxemkho", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const getOrderFactoryFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_FACTORY_FAIL),
    mergeMap((action) => {
      //console.log("getOrderFactory_FAIL", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );

// --- Update Order Status ---

const updateOrderStatusEpic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_ORDER_STATUS),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("getOrderEpic", action.payload);
        ajaxAdapter("/order/changeOrderStatus", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("begin_updateOrderStatusEpic", response.response);
            if (response.response.success === true) {
              //Actions.app();
              //console.log("reponse_updateOrderStatusEpic_Success", response.response);
              return updateOrderStatusSuccess(response.response);
            }
            //console.log("updateOrderStatusEpic_Fail");
            return updateOrderStatusFail(response.response.message);
          }),
          catchError((error) => {
            //console.log("catchError_updateOrderStatusEpic", error)
            return handleError(error, updateOrderStatusFail);
          })
        )
      //return EMPTY;
    )
  );

const updateOrderStatusSuccessEpic = (action$) =>
  action$.pipe(
    ofType(UPDATE_ORDER_STATUS_SUCCESS),
    mergeMap((action) => {
      //console.log("updateOrderStatus_SUCCESS", action.payload);
      // Alert.alert("Thông báo", action.payload.result_updateOrderStatus.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const updateOrderStatusFailEpic = (action$) =>
  action$.pipe(
    ofType(UPDATE_ORDER_STATUS_FAIL),
    mergeMap((action) => {
      //console.log("updateOrderStatus_FAIL", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );

const getWareHouseEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LST_WARE_HOUSES),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter("/user/getAllUserOfParent", "GET", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("response_getWareHouseEpic", response.response);
            if (response.response.success === true) {
              //console.log("getWareHouseEpic_Success", response.response);
              return getLstWareHousesSuccess(response.response);
            }
            //console.log("getWareHouseEpic_Fail");
            return getLstWareHousesFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_getWareHouseEpic", error)
            return handleError(error, getLstWareHousesFail);
          })
        )
      //return EMPTY;
    )
  );

const getWareHouseSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_LST_WARE_HOUSES_SUCCESS),
    mergeMap((action) => {
      //console.log("createOrder_SUCCESS", action.payload);
      return EMPTY;
    })
  );

const getWareHouseFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_LST_WARE_HOUSES_FAIL),
    mergeMap((action) => {
      //console.log("createOrder_FAIL", action.payload);
      //setToken(action.payload);
      return EMPTY;
    })
  );

//
const getAllChildsEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LST_CHILDS),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter("/user/getSubChilds", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("response_getAllChildsEpic", response.response);
            if (response.response.success === true) {
              //console.log("getAllChildsEpic_Success", response.response);
              return getLstChildsSuccess(response.response);
            }
            //console.log("getAllChildsEpic_Fail");
            return getLstChildsFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_getAllChildsEpic", error)
            return handleError(error, getLstChildsFail);
          })
        )
      //return EMPTY;
    )
  );

const getAllChildsSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_LST_CHILDS_SUCCESS),
    mergeMap((action) => {
      //console.log("getAllChilds_SUCCESS", action.payload);
      return EMPTY;
    })
  );

const getAllChildsFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_LST_CHILDS_FAIL),
    mergeMap((action) => {
      //console.log("getAllChilds_FAIL", action.payload);
      //setToken(action.payload);
      return EMPTY;
    })
  );

//
const setOrderEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_ORDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter("/order/setOrder", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("response_setOrderEpic", response.response);
            if (response.response.success === true) {
              //console.log("setOrderEpic_Success", response.response);
              return setOrderSuccess(response.response);
            }
            //console.log("setOrderEpic_Fail");
            return setOrderFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setOrderEpic", error)
            return handleError(error, setOrderFail);
          })
        )
      //return EMPTY;
    )
  );

const setOrderSuccessEpic = (action$) =>
  action$.pipe(
    ofType(SET_ORDER_SUCCESS),
    mergeMap((action) => {
      //console.log("setOrder_SUCCESS", action.payload);
      return EMPTY;
    })
  );

const setOrderFailEpic = (action$) =>
  action$.pipe(
    ofType(SET_ORDER_FAIL),
    mergeMap((action) => {
      //console.log("setOrder_FAIL", action.payload);
      //setToken(action.payload);
      return EMPTY;
    })
  );

//----approvalOrder------
const approvalOrderEpic = (action$, state$) =>
  action$.pipe(
    ofType(APPROVAL_ORDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter(
          "/orderShipping/approvalOrder",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("response_approvalOrderEpic", response.response);
            if (response.response.success === true) {
              //console.log("setOrderEpic_Success", response.response);
              return approvalOrderSuccess(response.response);
            }
            //console.log("setOrderEpic_Fail");
            return approvalOrderFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setOrderEpic", error)
            return handleError(error, setOrderFail);
          })
        )
      //return EMPTY;
    )
  );

const approvalOrderSuccessEpic = (action$) =>
  action$.pipe(
    ofType(APPROVAL_ORDER_SUCCESS),
    mergeMap((action) => {
      //console.log("approvalOrder_SUCCESS", action.payload);
      return EMPTY;
    })
  );

const approvalOrderFailEpic = (action$) =>
  action$.pipe(
    ofType(APPROVAL_ORDER_FAIL),
    mergeMap((action) => {
      //console.log("approvalOrder_FAIL", action.payload);
      //setToken(action.payload);
      return EMPTY;
    })
  );
//----cancelOrder------
const cancelOrderEpic = (action$, state$) =>
  action$.pipe(
    ofType(CANCEL_ORDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        ////console.log("begin_createOrderEpic", action.payload);
        ajaxAdapter("/orderShipping/CancelOrder", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("response_cancelOrderEpic", response.response);
            if (response.response.success === true) {
              //console.log("setCancelEpic_Success", response.response);
              return cancelOrderSuccess(response.response);
            }
            //console.log("setCancelEpic_Fail");
            return cancelOrderFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setCancelEpic", error)
            return handleError(error, cancelOrderFail);
          })
        )
      //return EMPTY;
    )
  );

const cancelOrderSuccessEpic = (action$) =>
  action$.pipe(
    ofType(CANCEL_ORDER_SUCCESS),
    mergeMap((action) => {
      //console.log("cancelOrder_SUCCESS", action.payload);
      return EMPTY;
    })
  );

const cancelOrderFailEpic = (action$) =>
  action$.pipe(
    ofType(CANCEL_ORDER_FAIL),
    mergeMap((action) => {
      //console.log("cancelOrder_FAIL", action.payload);
      //setToken(action.payload);
      return EMPTY;
    })
  );
//--- Get Completed Order and Cylinders
const getCompletedOrderAndCylindersEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_COMPLETED_ORDER_AND_CYLINDERS),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        cyclinderApi.getCompletedOrderAndCylinders.url({
          orderId: action.payload.orderId,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          console.log("getConpletedOrderAndCylinder_EPIC", response);
          if (response.response.status) {
            console.log(
              "getConpletedOrderAndCylinder_EPIC_Success",
              response.response
            );
            return of(getCompletedOrderAndCylindersSuccess(response.response));
          }

          console.log(
            "getConpletedOrderAndCylinder_EPIC_Fail",
            response.response.message
          );
          return of(
            getCompletedOrderAndCylindersFail(response.response.message)
          );
        }),
        catchError((error) =>
          handleError(error, getCompletedOrderAndCylindersFail)
        )
      )
    )
  );

const getCompletedOrderAndCylindersSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_COMPLETED_ORDER_AND_CYLINDERS_SUCCESS),
    mergeMap((action) => {
      //console.log("getCompletedOrderAndCylinders_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const getCompletedOrderAndCylinderFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_COMPLETED_ORDER_AND_CYLINDERS_FAIL),
    mergeMap((action) => {
      //console.log("getCompletedOrderAndCylinders_FAIL", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );
//linh
const setOrderRequestEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_ORDER_REQUEST),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        ajaxAdapter(
          "/orderShipping/OrderApprovalRequest",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("setOrderRequestEpic", response.response);
            if (response.response.success === true) {
              //console.log("setOrderRequestEpic_Success", response.response);
              return setOrderRequestSuccess(response.response);
            }
            //console.log("setOrderRequestEpic_Fail");
            return setOrderRequestFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setOrderEpic", error)
            return handleError(error, setOrderRequestFail);
          })
        )
      //return EMPTY;
    )
  );

const setOrderRequestSuccessEpic = (action$) =>
  action$.pipe(
    ofType(SET_ORDER_REQUEST_SUCCESS),
    mergeMap((action) => {
      //console.log("setOrderRequest_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const setOrderRequestFailEpic = (action$) =>
  action$.pipe(
    ofType(SET_ORDER_REQUEST_FAIL),
    mergeMap((action) => {
      //console.log("setOrderRequest_FAIL", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );
//linh
const getOrderRequestEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ORDER_REQUEST),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        ajaxAdapter(
          "/SendNotificationForEachDevice",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("getOrderRequestEpic", response.response);
            if (response.response.success === true) {
              //console.log("getOrderRequestEpic_Success", response.response);
              return getOrderRequestSuccess(response.response);
            }
            //console.log("getOrderRequestEpic_Fail");
            return getOrderRequestFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setOrderEpic", error)
            return handleError(error, getOrderRequestFail);
          })
        )
      //return EMPTY;
    )
  );

const getOrderRequestSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_REQUEST_SUCCESS),
    mergeMap((action) => {
      //console.log("getOrderRequest_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getOrderRequestFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ORDER_REQUEST_FAIL),
    mergeMap((action) => {
      //console.log("getOrderRequest_FAIL", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );
//linh
const getShippingAllOrderInitEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_INIT),
    tap((action) => {
      ////console.log("action$",action$);
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        allshippingapi.getAllSippingFromList.url({
          userid: action.payload.userid,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          console.log("getallshippingorderinitSuccess_EPIC", response);
          if (response.response.success) {
            console.log(
              "getallshippingorderinitSuccess_EPIC_Success",
              response.response
            );
            return of(getAllShippingOrderInitSuccess(response.response));
          }

          console.log("getallshippingorderinitFail123_EPIC_Fail123", false);
          return of(getAllShippingOrderInitFail(false));
        }),
        catchError((error) => handleError(error, getAllShippingOrderInitFail))
      )
    )
  );

const getShippingAllOrderInitSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_INIT_SUCCESS),
    mergeMap((action) => {
      //console.log("getShippingAllOrderSuccess", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getShippingAllOrderInitFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_INIT_FAIL),
    mergeMap((action) => {
      //console.log("getShippingAllOrder_FAIL", action.payload);

      return EMPTY;
    })
  );
//linh ordertank
const getShippingAllOrderTankInitEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_TANK_INIT),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        allshippingapi.getAllSippingTankFromList.url({
          userid: action.payload.userid,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          console.log("getallshippingordertankinitSuccess_EPIC", response);
          if (response.response.success) {
            console.log(
              "getallshippingorderinittankSuccess_EPIC_Success",
              response.response
            );
            return of(getAllShippingOrderTankInitSuccess(response.response));
          }

          console.log("getallshippingordertankinitFail123_EPIC_Fail123", false);
          return of(getAllShippingOrderTankInitFail(false));
        }),
        catchError((error) =>
          handleError(error, getAllShippingOrderTankInitFail)
        )
      )
    )
  );

const getShippingAllOrderTankInitSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_TANK_INIT_SUCCESS),
    mergeMap((action) => {
      //console.log("getShippingAllOrdertankSuccess", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getShippingAllOrderTankInitFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_TANK_INIT_FAIL),
    mergeMap((action) => {
      //console.log("getShippingAllOrdertank_FAIL", action.payload);

      return EMPTY;
    })
  );
//detail
const getShippingAllOrderDetailInitEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_DETAIL_INIT),
    tap((action) => {
      ////console.log("action$",action$);
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        allshippingapi.getAllSippingDetailFromList.url({
          shippingorderId: action.payload.shippingorderId,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          console.log("getallshippingorderDetailinitSuccess_EPIC", response);
          if (response.response.success) {
            console.log(
              "getallshippingorderDetailinitSuccess_EPIC_Success",
              response.response
            );
            return of(getAllShippingOrderDetailInitSuccess(response.response));
          }

          console.log(
            "getallshippingorderDetailinitFail123_EPIC_Fail123",
            response.response.message
          );
          return of(
            getAllShippingOrderDetailInitFail(response.response.message)
          );
        }),
        catchError((error) =>
          handleError(error, getAllShippingOrderDetailInitFail)
        )
      )
    )
  );

const getShippingAllOrderDetailInitSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_DETAIL_INIT_SUCCESS),
    mergeMap((action) => {
      //console.log("getShippingAllOrderDetailSuccess", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getShippingAllOrderDetailInitFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_DETAIL_INIT_FAIL),
    mergeMap((action) => {
      //console.log("getShippingAllOrderDetail_FAIL", action.payload);

      return EMPTY;
    })
  );

//driver tank detail
const getShippingAllOrderTankDetailInitEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT),
    tap((action) => {
      ////console.log("action$",action$);
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        allshippingapi.getAllSippingTankDetailFromList.url({
          exportOrderID: action.payload.exportOrderID,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          console.log(
            "getallshippingorderTankDetailinitSuccess_EPIC",
            response
          );
          if (response.response.success) {
            console.log(
              "getallshippingorderTankDetailinitSuccess_EPIC_Success",
              response.response
            );
            return of(
              getAllShippingOrderTankDetailInitSuccess(response.response)
            );
          }

          console.log(
            "getallshippingorderTankDetailinitFail123_EPIC_Fail123",
            response.response.message
          );
          return of(
            getAllShippingOrderTankDetailInitFail(response.response.message)
          );
        }),
        catchError((error) =>
          handleError(error, getAllShippingOrderTankDetailInitFail)
        )
      )
    )
  );

const getShippingAllOrderTankDetailInitSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS),
    mergeMap((action) => {
      //console.log("getShippingAllOrderTankDetailSuccess", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getShippingAllOrderTankDetailInitFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_ALL_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL),
    mergeMap((action) => {
      //console.log("getShippingAllOrderTankDetail_FAIL", action.payload);

      return EMPTY;
    })
  );
//linh api thay doi trang thai tai xe don van chuyen
const getUpdateShippingAllOrderDetailInitEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        ajaxAdapter("/order/changeOrderStatus", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            //console.log("UpdateShippingAllOrderDetail", response.response);
            if (response.response.status === true) {
              //console.log("UpdateShippingAllOrderDetail_Success", response.response);
              return getUpdateShippingOrderDetailInitSuccess(response.response);
            }
            //console.log("UpdateShippingAllOrderDetail_Fail");
            return getUpdateShippingOrderDetailInitFail(
              response.response.message
            );
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setOrderEpic", error)
            return handleError(error, getUpdateShippingOrderDetailInitFail);
          })
        )
      //return EMPTY;
    )
  );

const getUpdateShippingAllOrderDetailInitSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_SUCCESS),
    mergeMap((action) => {
      //console.log("UpdateShippingAllOrderDetail_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getUpdateShippingAllOrderDetailInitFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_UPDATE_SHIPPING_ORDER_DETAIL_INIT_FAIL),
    mergeMap((action) => {
      //console.log("UpdateShippingAllOrderDetail_Fail", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );

//linh api thay doi trang thai tai xe xe bon
const getUpdateShippingAllOrderTankDetailInitEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        ajaxAdapter(
          "/ordertank/changeOrderTankStatus",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("UpdateShippingAllOrderTankDetail", response.response);
            if (response.response.status === true) {
              //console.log("UpdateShippingAllOrderTankDetail_Success", response.response);
              return getUpdateShippingOrderTankDetailInitSuccess(
                response.response
              );
            }
            //console.log("UpdateShippingAllOrderTankDetail_Fail");
            return getUpdateShippingOrderTankDetailInitFail(
              response.response.message
            );
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setOrderupdateTNakEpic", error)
            return handleError(error, getUpdateShippingOrderTankDetailInitFail);
          })
        )
      //return EMPTY;
    )
  );

const getUpdateShippingAllOrderTankDetailInitSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_SUCCESS),
    mergeMap((action) => {
      //console.log("UpdateShippingAllOrderTankDetail_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getUpdateShippingAllOrderTankDetailInitFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_UPDATE_SHIPPING_ORDER_TANK_DETAIL_INIT_FAIL),
    mergeMap((action) => {
      //console.log("UpdateShippingAllOrderTankDetail_Fail", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );
//linh api luu vi ti hien tai cua tai xe len api
const setCreateShippingOrderLocationEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_CREATE_SHIPPING_ORDER_LOCATION),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        ajaxAdapter(
          "/shippingorderlocation/createShippingOrderLocation",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("setCreateShippingOrderLocation", response.response);
            if (response.response.success === true) {
              //console.log("setCreateShippingOrderLocation_Success", response.response);
              return setCreateShippingOrderLocationSuccess(response.response);
            }
            //console.log("setCreateShippingOrderLocation_Fail");
            return setCreateShippingOrderLocationFail(
              response.response.message
            );
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setCreateShippingOrderLocation", error)
            return handleError(error, setCreateShippingOrderLocationFail);
          })
        )
      //return EMPTY;
    )
  );

const setCreateShippingOrderLocationSuccessEpic = (action$) =>
  action$.pipe(
    ofType(SET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS),
    mergeMap((action) => {
      //console.log("setCreateShippingOrderLocation_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const setCreateShippingOrderLocationFailEpic = (action$) =>
  action$.pipe(
    ofType(SET_CREATE_SHIPPING_ORDER_LOCATION_FAIL),
    mergeMap((action) => {
      //console.log("setCreateShippingOrderLocation_Fail", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );

//linh api luu vi ti hien tai cua tai xe xe bon len api
const setCreateShippingOrderTankLocationEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_CREATE_SHIPPING_ORDER_TANK_LOCATION),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        ajaxAdapter(
          "/exportorderlocation/createExportOrderLocation",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            //console.log("setCreateShippingOrderTankLocation", response.response);
            if (response.response.success === true) {
              //console.log("setCreateShippingOrderTankLocation_Success", response.response);
              return setCreateShippingOrderTankLocationSuccess(
                response.response
              );
            }
            //console.log("setCreateShippingOrderTankLocation_Fail");
            return setCreateShippingOrderTankLocationFail(
              response.response.message
            );
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            //console.log("catchError_setCreateShippingOrderTankLocation", error)
            return handleError(error, setCreateShippingOrderTankLocationFail);
          })
        )
      //return EMPTY;
    )
  );

const setCreateShippingOrderTankLocationSuccessEpic = (action$) =>
  action$.pipe(
    ofType(SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_SUCCESS),
    mergeMap((action) => {
      //console.log("setCreateShippingOrderTankLocation_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const setCreateShippingOrderTankLocationFailEpic = (action$) =>
  action$.pipe(
    ofType(SET_CREATE_SHIPPING_ORDER_TANK_LOCATION_FAIL),
    mergeMap((action) => {
      //console.log("setCreateShippingOrderTankLocation_Fail", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );

//linh api lay vi tri tai xe hien tai
const getCreateShippingOrderLocationEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_CREATE_SHIPPING_ORDER_LOCATION),
    tap((action) => {
      ////console.log("action$",action$);
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        allshippingapi.getDriverLocationFromList.url({
          orderShippingID: action.payload.orderShippingID,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          console.log("getCreateShippingOrderLocation_Success_EPIC", response);
          if (response.response.success) {
            const driverLocation = {
              latitude: parseFloat(
                response.response.ShippingOrderLocation[0].lat
              ),
              longitude: parseFloat(
                response.response.ShippingOrderLocation[0].long
              ),
            };
            const Carrier = {
              Carrier: response.response.Carrier,
            };
            //const drivercarrier=response.response.Carrier
            console.log(
              "getCreateShippingOrderLocation_Success_EPIC_Success",
              driverLocation
            );
            return of(
              getCreateShippingOrderLocationSuccess({
                driverLocation,
                ...Carrier,
              })
            );
          }

          console.log(
            "getCreateShippingOrderLocation_EPIC_Fail123",
            response.response.message
          );
          return of(
            getCreateShippingOrderLocationFail(response.response.message)
          );
        }),
        catchError((error) =>
          handleError(error, getCreateShippingOrderLocationFail)
        )
      )
    )
  );

const getCreateShippingOrderLocationSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_CREATE_SHIPPING_ORDER_LOCATION_SUCCESS),
    mergeMap((action) => {
      //console.log("getCreateShippingOrderLocation_Success", action.payload);
      //alert(action.payload.result_getOrderFactory.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );
const getCreateShippingOrderLocationFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_CREATE_SHIPPING_ORDER_LOCATION_FAIL),
    mergeMap((action) => {
      //console.log("getCreateShippingOrderLocation_Fail", action.payload);
      //setToken(action.payload);
      //alert(action.payload.error);
      return EMPTY;
    })
  );

export default [
  createOrderEpic,
  createOrderSuccessEpic,
  createOrderFailEpic,
  getOrderEpic,
  getOrderSuccessEpic,
  getOrderFailEpic,
  updateOrderStatusEpic,
  updateOrderStatusSuccessEpic,
  updateOrderStatusFailEpic,
  getOrderFactoryEpic,
  getOrderFactorySuccessEpic,
  getOrderFactoryFailEpic,
  getWareHouseEpic,
  getWareHouseSuccessEpic,
  getWareHouseFailEpic,
  setOrderEpic,
  setOrderSuccessEpic,
  setOrderFailEpic,
  getOrderHistoryEpic,
  getOrderHistorySuccessEpic,
  getOrderHistoryFailEpic,
  getListStoreCode,
  setNewOrder,
  getCompletedOrderAndCylindersEpic,
  getCompletedOrderAndCylindersSuccessEpic,
  getCompletedOrderAndCylinderFailEpic,
  //linh
  setOrderRequestEpic,
  setOrderRequestSuccessEpic,
  setOrderRequestFailEpic,
  getOrderRequestEpic,
  getOrderRequestSuccessEpic,
  getOrderRequestFailEpic,
  //hang
  approvalOrderEpic,
  approvalOrderSuccessEpic,
  approvalOrderFailEpic,
  cancelOrderEpic,
  cancelOrderSuccessEpic,
  cancelOrderFailEpic,
  getShippingAllOrderInitEpic,
  getShippingAllOrderInitSuccessEpic,
  getShippingAllOrderInitFailEpic,

  getShippingAllOrderTankInitEpic,
  getShippingAllOrderTankInitSuccessEpic,
  getShippingAllOrderTankInitFailEpic,

  getShippingAllOrderDetailInitEpic,
  getShippingAllOrderDetailInitSuccessEpic,
  getShippingAllOrderDetailInitFailEpic,
  //tank driver
  getShippingAllOrderTankDetailInitEpic,
  getShippingAllOrderTankDetailInitSuccessEpic,
  getShippingAllOrderTankDetailInitFailEpic,
  //updadae don van chuyen tai xe
  getUpdateShippingAllOrderDetailInitEpic,
  getUpdateShippingAllOrderDetailInitSuccessEpic,
  getUpdateShippingAllOrderDetailInitFailEpic,
  //update don van chuyen tai x xe bon
  getUpdateShippingAllOrderTankDetailInitEpic,
  getUpdateShippingAllOrderTankDetailInitSuccessEpic,
  getUpdateShippingAllOrderTankDetailInitFailEpic,

  setCreateShippingOrderLocationEpic,
  setCreateShippingOrderLocationSuccessEpic,
  setCreateShippingOrderLocationFailEpic,
  //tao vi tri tai xe xe bon
  setCreateShippingOrderTankLocationEpic,
  setCreateShippingOrderTankLocationSuccessEpic,
  setCreateShippingOrderTankLocationFailEpic,

  getCreateShippingOrderLocationEpic,
  getCreateShippingOrderLocationSuccessEpic,
  getCreateShippingOrderLocationFailEpic,

  //
  getAllChildsEpic,
  getAllChildsSuccessEpic,
  getAllChildsFailEpic,
];
