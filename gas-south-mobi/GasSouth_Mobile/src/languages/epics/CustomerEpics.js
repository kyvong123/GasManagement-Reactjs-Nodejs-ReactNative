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
} from "../../types";
import {
  getListByCustomerType,
  getListByCustomerTypeSuccess,
  getListByCustomerTypeFail,
  getListBranch,
  getListBranchSuccess,
  getListBranchFail,
  getListTruck,
  getListTruckSuccess,
  getListTruckFail,
  getListCustomerType,
  getListCustomerTypeSuccess,
  getListCustomerTypeFail,
} from "../../actions/CustomerActions";
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
import { throwError, of, EMPTY } from "rxjs";
import { ofType } from "redux-observable";
import { ajaxAdapter, handleError } from "../../helper/utils";
import { Alert } from "react-native";
import customerApi from "../../api/customer";

const customerEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LIST_BY_CUSTOMER_TYPE),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/user/getListByCustomerType", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.response.success === true) {
            //Actions.app();
            return getListByCustomerTypeSuccess(response.response);
          }
          return getListByCustomerTypeFail(response.response.message);
        }),
        catchError((error) => {
          return handleError(error, getListByCustomerTypeFail);
        })
      )
    )
  );
const customerSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_BY_CUSTOMER_TYPE_SUCCESS),
    mergeMap((action) => {
      // alert(action.payload.resulListCustomer.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const customerFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_BY_CUSTOMER_TYPE_FAIL),
    mergeMap((action) => {
      alert(action.payload.errorListCustomer);
      return EMPTY;
    })
  );

const branchEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LIST_BRANCH),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/user/getListBranch", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.response.success === true) {
            //Actions.app();
            return getListBranchSuccess(response.response);
          }
          return getListBranchFail(response.response.message);
        }),
        catchError((error) => {
          console.log("getListBranchFailerror", error);
          return handleError(error, getListBranchFail);
        })
      )
    )
  );
const branchSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_BRANCH_SUCCESS),
    mergeMap((action) => {
      // alert(action.payload.resulListCustomer.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const branchFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_BRANCH_FAIL),
    mergeMap((action) => {
      //setToken(action.payload);
      // alert("Thông báo",action.payload.errorListBranch);
      return EMPTY;
    })
  );

const TruckEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LIST_TRUCK),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/truck/getListTruck", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.response.success === true) {
            //Actions.app();
            return getListTruckSuccess(response.response);
          }
          return getListTruckFail(response.response.message);
        }),
        catchError((error) => {
          console.log("getListTruckFailerror", error);
          return handleError(error, getListTruckFail);
        })
      )
    )
  );
const TruckSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_TRUCK_SUCCESS),
    mergeMap((action) => {
      // alert(action.payload.resulListCustomer.message);
      //alert(action.payload.message);
      return EMPTY;
    })
  );

const TruckFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_TRUCK_FAIL),
    mergeMap((action) => {
      // console.log("TruckFailEpic", action.payload);
      //setToken(action.payload);
      // alert("Thông báo",action.payload.errorListTruck);
      return EMPTY;
    })
  );

// export const mapStateToProps = state => ({
//     // CustomerActions: state.cylinders.CustomerActions,
// })

const customersEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LIST_CUSTOMER_TYPE),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter(
        customerApi.getCustomers.url({
          isChildOf: action.payload.reqCustomer.isChildOf,
          customerType: action.payload.reqCustomer.customerType,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        map((response) => {
          if (response.response.success === true) {
            //Actions.app();
            return getListCustomerTypeSuccess(response.response);
          }
          return getListCustomerTypeFail(response.response.message);
        }),
        catchError((error) => {
          console.log("getListCustomerTypeERROR", error);
          return handleError(error, getListCustomerTypeFail);
        })
      )
    )
  );

const customersSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_CUSTOMER_TYPE_SUCCESS),
    mergeMap((action) => {
      return EMPTY;
    })
  );

const customersFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_CUSTOMER_TYPE_FAIL),
    mergeMap((action) => {
      // console.log("customerSuccessFailEpic", action.payload);
      //setToken(action.payload);
      alert(action.payload.errorListCustomer);
      return EMPTY;
    })
  );

export default [
  customerEpic,
  customerSuccessEpic,
  customerFailEpic,
  branchEpic,
  branchSuccessEpic,
  branchFailEpic,
  TruckEpic,
  TruckFailEpic,
  TruckSuccessEpic,
  customersEpic,
  customersSuccessEpic,
  customersFailEpic,
];
