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
import {
  setToken,
  onSignOut,
  setUsers_DesList,
  getUsers_DesList,
} from "../../helper/auth";
import userApi from "../../api/user";
import saver from "../../utils/saver";
import { connect } from "react-redux";
import {
  LOGIN_USER,
  FETCH_USER_INFO,
  LOG_OUT,
  LOGIN_USER_SUCCESS,
  FETCH_USERS,
  FETCH_USERS_SUCCESS,
  STATION,
  FETCH_USERS_TYPE_FOR_PARTNER,
  TO_FIX,
  FIXER,
  FACTORY,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAIL,
  GET_LIST_DRIVER,
  GET_LIST_DRIVER_SUCCESS,
  GET_SIGNATURE,
  GET_SIGNATURE_SUCCESS,
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
} from "../../types";
import {
  loginUserSuccess,
  loginUserFail,
  fetchUsersSuccess,
  fetchUsersFail,
  logOut,
  changePasswordFail,
  getListDriverSuccess,
  getListDriverFail,
  getSignature,
  getSignatureSuccess,
  getSignatureFail,
  getUserInfoSuccess,
  getUserInfoFail,
  changePasswordSuccess,
} from "../../actions/AuthActions";
// import { destinationList } from "../helper/selector";
import { Alert } from "react-native";

const loginUserEpic = (action$, state$) =>
  action$.pipe(
    ofType(LOGIN_USER),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/user/login", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.status === 200) {
            Actions.app();
            return loginUserSuccess(response.response);
          }
          return handleError(response, loginUserFail);
        }),
        catchError((error) => handleError(error, loginUserFail))
      )
    )
  );

// Cuong them vao
const changePasswordEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHANGE_PASSWORD),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/user/change_password", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.status === 200) {
            //Actions.app();
            return changePasswordSuccess(response.response);
          }
          return handleError(response, changePasswordFail);
        }),
        catchError((error) => handleError(error, changePasswordFail))
      )
    )
  );

const changePasswordSuccessEpic = (action$) =>
  action$.pipe(
    ofType(CHANGE_PASSWORD_SUCCESS),
    mergeMap((action) => {
      return EMPTY;
    })
  );

const getListDriverEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LIST_DRIVER),
    // tap(action => {
    //     action.payload.token = state$.value.auth.token;
    //     return action;
    // }),
    // distinctUntilChanged(),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/user/listNameDriver", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.status === 200) {
            //Actions.app();
            return getListDriverSuccess(response.response);
          }
          return handleError(response, getListDriverFail);
        }),
        catchError((error) => handleError(error, getListDriverFail))
      )
    )
  );

const getListDriverSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_LIST_DRIVER_SUCCESS),
    mergeMap((action) => {
      return EMPTY;
    })
  );

const getSignatureEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_SIGNATURE),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/user/getSignature", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.status === 200) {
            //Actions.app();
            return getSignatureSuccess(response.response);
          }
          return handleError(response, getSignatureFail);
        }),
        catchError((error) => handleError(error, getSignatureFail))
      )
    )
  );

const getSignatureSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_SIGNATURE_SUCCESS),
    mergeMap((action) => {
      //setToken(action.payload);
      return EMPTY;
    })
  );

// End Cuong them vao

const logoutUserEpic = (action$) =>
  action$.pipe(
    ofType(LOG_OUT),
    mergeMap((action) => {
      // TODO: destroy token here
      onSignOut();
      Actions.application();
      return EMPTY;
    })
  );

const loginUserSuccessEpic = (action$) =>
  action$.pipe(
    ofType(LOGIN_USER_SUCCESS),
    mergeMap((action) => {
      setToken(action.payload);
      return EMPTY;
    })
  );

const fetchUsers = (action$, state$) =>
  action$.pipe(
    ofType(FETCH_USERS),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        userApi.getUsers.url(
          saver.getTypeCyclinder() !== ""
            ? {
                action_type: saver.getDataCyclinder(),
                user_type: STATION,
              }
            : { action_type: saver.getDataCyclinder(), user_type: "" }
        ),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          //const users = groupBy(response.response, (e) => e.userType)
          return of(fetchUsersSuccess(response.response));
        }),
        catchError((error) => {
          return handleError(error, fetchUsersFail);
        })
      )
    )
  );

const fetchUsersSuccessEpic = (action$) =>
  action$.pipe(
    ofType(FETCH_USERS_SUCCESS),
    mergeMap((action) => {
      let v;
      if (action.payload.hasOwnProperty("users")) {
        if (action.payload.users.length > 0) {
          // tiep o day
          setUsers_DesList(action.payload);
        }
      }

      return EMPTY;
    })
  );

const fetchUsersTypePartner = (action$, state$) =>
  action$.pipe(
    ofType(FETCH_USERS_TYPE_FOR_PARTNER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        state$.value.cylinders.typeForPartner === TO_FIX
          ? state$.value.auth.user.userType === FACTORY
            ? userApi.getFixerRelationship.url({
                parentRoot: state$.value.auth.user.parentRoot,
              })
            : userApi.getUsersTypeForPartner.url({
                isHasYourself: true,
                parentRoot: state$.value.auth.user.parentRoot,
                isHasChild: true,
              })
          : userApi.getUsersTypeForPartner.url({
              isHasYourself: false,
              parentRoot: state$.value.auth.user.parentRoot,
              isHasChild: false,
            }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          //const users = groupBy(response.response, (e) => e.userType)
          return of(fetchUsersSuccess(response.response));
        }),
        catchError((error) => {
          return handleError(error, fetchUsersFail);
        })
      )
    )
  );

const getInforTurnbackCompEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_USER_INFO),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap((action, state) =>
      ajaxAdapter("/user/getInforById", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.status === 200) {
            //Actions.app();
            return getUserInfoSuccess(response.response.data);
          }
          return handleError(response, getUserInfoFail);
        }),
        catchError((error) => handleError(error, getUserInfoFail))
      )
    )
  );

const getInforTurnbackCompSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_USER_INFO_SUCCESS),
    mergeMap((action) => {
      //setToken(action.payload);
      return EMPTY;
    })
  );

export const mapStateToProps = (state) => ({
  cyclinderAction: state.cylinders.cyclinderAction,
  //error: state.auth.error
});
export default [
  loginUserEpic,
  loginUserSuccessEpic,
  logoutUserEpic,
  fetchUsers,
  fetchUsersSuccessEpic,
  fetchUsersTypePartner,
  changePasswordEpic,
  changePasswordSuccessEpic,
  getListDriverEpic,
  getListDriverSuccessEpic,
  getSignatureEpic,
  getSignatureSuccessEpic,
  getInforTurnbackCompEpic,
  getInforTurnbackCompSuccessEpic,
];
