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
import i18n from "i18n-js";
import { setLanguage } from "../../helper/auth";
import { Alert } from "react-native";
import currentinventory from "../../api/currentinventory";

import { GCIT, GCITS, GCITF } from "../../types";

import { gcit, gcits, gcitf } from "../../actions/CurrentInventoryActions";
import {
  exportPlaceSuccess,
  exportPlaceFail,
} from "../../actions/ManufactureAction";

//getCurrentInventory
const gcitEpic = (action$, state$) =>
  action$.pipe(
    ofType(GCIT),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        currentinventory.getCurrentInventory.url({ ...action.payload }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(gcits(response.response));
        }),
        catchError((error) => handleError(error, exportPlaceFail))
      )
    )
  );

const gcitsEpic = (action$) =>
  action$.pipe(
    ofType(GCITS),
    mergeMap((action) => {
      return EMPTY;
    })
  );

const gcitfEpic = (action$) =>
  action$.pipe(
    ofType(GCITF),
    mergeMap((action) => {
      //setToken(action.payload);
      return EMPTY;
    })
  );
export default [gcitEpic, gcitsEpic, gcitfEpic];
