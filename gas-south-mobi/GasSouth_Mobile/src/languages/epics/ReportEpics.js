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
import reportApi from "../../api/report";
import saver from "../../utils/saver";

import {
  REPORT,
  REPORT_SUCCESS,
  REPORT_FAIL,
  REPORT_CHART,
  REPORT_CHART_SUCCESS,
  REPORT_CHART_FAIL,
  REPORT_CHART_BAR,
  REPORT_CHART_BAR_SUCCESS,
  REPORT_CHART_BAR_FAIL,
} from "../../types";
import {
  reportSuccess,
  reportFail,
  reportChartSuccess,
  reportChartFail,
  reportChartBarSuccess,
  reportChartBarFail,
} from "../../actions/ReportActions";
import { destinationList } from "../../helper/selector";
import { Alert } from "react-native";
import cyclinderApi from "../../api/cyclinder";
import {
  fetchCylinderFail,
  fetchCylinderSuccess,
} from "../../actions/CyclinderActions";

const reportEpic = (action$, state$) =>
  action$.pipe(
    ofType(REPORT),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        reportApi.getReport.url({ type: "EXPORT" }),
        "post",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          // console.log("responseaaaaaa", response);
          return of(reportSuccess(response.response));
        }),
        catchError((error) => handleError(error, reportFail))
      )
    )
  );

const reportEpicSuccess = (action$) => action$.pipe(ofType(REPORT_SUCCESS));
const reportEpicFail = (action$) =>
  action$.pipe(
    ofType(REPORT_FAIL),
    mergeMap((action) => {
      Alert.alert(
        "Không tìm thấy báo cáo nào",
        "Vui lòng thử lại",
        [{ text: "Ok" }],
        { cancelable: false }
      );
      return EMPTY;
    })
  );
const reportChartEpic = (action$, state$) =>
  action$.pipe(
    ofType(REPORT_CHART),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        reportApi.getReportChart.url({
          target_id: state$.value.auth.user.id,
          factory_id: state$.value.auth.user.parentRoot,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(reportChartSuccess(response.response));
        }),
        catchError((error) => handleError(error, reportChartFail))
      )
    )
  );

const reportChartEpicSuccess = (action$) =>
  action$.pipe(ofType(REPORT_CHART_SUCCESS));
const reportChartEpicFail = (action$) =>
  action$.pipe(
    ofType(REPORT_CHART_FAIL),
    mergeMap((action) => {
      Alert.alert(
        "Không tìm thấy báo cáo chart nào",
        "Vui lòng thử lại",
        [{ text: "Ok" }],
        { cancelable: false }
      );
      return EMPTY;
    })
  );
const reportChartBarEpic = (action$, state$) =>
  action$.pipe(
    ofType(REPORT_CHART_BAR),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        reportApi.getReportChartBar.url(),
        "post",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(reportChartBarSuccess(response.response));
        }),
        catchError((error) => handleError(error, reportChartBarFail))
      )
    )
  );

const reportChartBarEpicSuccess = (action$) =>
  action$.pipe(ofType(REPORT_CHART_BAR_SUCCESS));
const reportChartBarEpicFail = (action$) =>
  action$.pipe(
    ofType(REPORT_CHART_BAR_FAIL),
    mergeMap((action) => {
      Alert.alert(
        "Không tìm thấy báo cáo chart nào",
        "Vui lòng thử lại",
        [{ text: "Ok" }],
        { cancelable: false }
      );
      return EMPTY;
    })
  );

export default [
  reportEpic,
  reportEpicFail,
  reportChartEpic,
  reportChartEpicFail,
  reportChartBarEpic,
  reportChartBarEpicFail,
];
