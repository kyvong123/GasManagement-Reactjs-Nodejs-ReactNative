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
import { CHANGE_LANGUAGE } from "../../types";

import { destinationList } from "../../helper/selector";

import { setLanguage } from "../../helper/auth";

import { changeLanguage } from "../../actions/LanguageActions";

// Cuong them vao
const changeLanguageEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHANGE_LANGUAGE),
    // tap(action => {
    //     action.payload.languageCode = state$.value.language.languageCode;
    //     return action;
    // }),
    // distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) => {
        //Actions.application();
        // console.log("lgn code",action.payload.languageCode);
        //return changeLanguage('en')
        return EMPTY;
      }
      // ajaxAdapter("/user/change_password", "POST", action.payload).pipe(
      //     retry(3),
      //     map(response => {
      //         if (response.status === 200) {
      //             Actions.app();
      //             return logOut();
      //         }
      //         return handleError(response, changePasswordFail);
      //     }),
      //     catchError(error => handleError(error, changePasswordFail))
      // )
    )
  );

// const loginUserSuccessEpic = action$ =>
// action$.pipe(
//     ofType(LOGIN_USER_SUCCESS),
//     mergeMap(action => {
//         setToken(action.payload);
//         return EMPTY;
//     })
// );

// End Cuong them vao

export const mapStateToProps = (state) => ({
  //cyclinderAction: state.cylinders.cyclinderAction,
  //error: state.auth.error
  languageCode: state.language.languageCode,
});
export default [changeLanguageEpic];
