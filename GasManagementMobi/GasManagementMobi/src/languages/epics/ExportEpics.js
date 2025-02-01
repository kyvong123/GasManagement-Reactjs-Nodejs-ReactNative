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
import exportApi from "../../api/export";
import statisticsApi from "../../api/statistics";

import {
  GET_Export,
  GET_Export_SUCCESS,
  GET_Export_FAIL,
  GET_STATISTICS,
} from "../../types";
import {
  exportPlaceSuccess,
  exportPlaceFail,
} from "../../actions/ManufactureAction";
import {
  getExport,
  getExportSuccess,
  getExportFail,
  getExportCylinderSuccess,
  getImportCylinderSuccess,
  getStatisticsResult,
} from "../../actions/ExportActions";

//getExport
const getExportEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_Export),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        exportApi.getExport.url({ ...action.payload }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          if (action.payload.statisticalType == "byItself")
            if (
              action.payload.action == "EXPORT_CYLINDER" ||
              action.payload.action == "EXPORT_CELL_CYLINDER"
            )
              return of(getExportCylinderSuccess(response.response));
            else return of(getImportCylinderSuccess(response.response));
          return of(getExportSuccess(response.response));
        }),
        catchError((error) => handleError(error, exportPlaceFail))
      )
    )
  );
};

const getStatisticsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_STATISTICS),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        statisticsApi.getStatistics.url({ ...action.payload }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          // if (action.payload.statisticalType == 'byItself')
          //   if (action.payload.action == 'EXPORT_CYLINDER')
          //     return of(getExportCylinderSuccess(response.response))
          //   else return of(getImportCylinderSuccess(response.response))
          return of(getStatisticsResult(response.response));
        }),
        catchError((error) => handleError(error, exportPlaceFail))
      )
    )
  );
};

const getExportSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_Export_SUCCESS),
    mergeMap((action) => {
      //console.log("Export_SUCCESS", action.payload);
      return EMPTY;
    })
  );

const getExportFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_Export_FAIL),
    mergeMap((action) => {
      //console.log("Export_FAIL", action.payload);
      //setToken(action.payload);
      return EMPTY;
    })
  );

export default [
  getExportEpic,
  getExportSuccessEpic,
  getExportFailEpic,
  getStatisticsEpic,
];
