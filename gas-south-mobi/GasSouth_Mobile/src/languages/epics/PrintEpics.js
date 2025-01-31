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
import { GET_LST_CYLINDER } from "../../types";

import { destinationList } from "../../helper/selector";

import { setLanguage } from "../../helper/auth";

import {
  getLstCylinder,
  getLstCylinderSuccess,
  getLstCylinderFail,
} from "../../actions/PrintActions";

// Cuong them vao
const getListInforCylinderEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_LST_CYLINDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        //console.log("getListInforCylinderEpic", action.payload);
        ajaxAdapter("/cylinder/searchCylinders", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            // console.log("begin_getListInforCylinderEpic", response.response);
            if (response.response.success === true) {
              //Actions.app();
              // console.log("getListInforCylinderEpic_Success", response.response);
              return getLstCylinderSuccess(
                response.response.data_cylindersInfor
              );
            }
            console.log("getListInforCylinderEpic_Fail");
            return getLstCylinderFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            console.log("catchError_setChecklistEpic", error);
            return handleError(error, getLstCylinderFail);
          })
        )
      //return EMPTY;
    )
  );

export const mapStateToProps = (state) => ({
  //cyclinderAction: state.cylinders.cyclinderAction,
  //error: state.auth.error
  languageCode: state.language.languageCode,
});
export default [getListInforCylinderEpic];
