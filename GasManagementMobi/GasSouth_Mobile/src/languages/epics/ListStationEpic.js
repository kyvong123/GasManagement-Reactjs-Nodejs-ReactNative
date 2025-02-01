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
// import exportApi from "../api/export";
// import statisticsApi from "../api/statistics";

import { GET_LIST_STATION } from "../../types";
import {
  exportPlaceSuccess,
  exportPlaceFail,
} from "../../actions/ManufactureAction";
import {
  getListStation,
  getListStationSuccess,
} from "../../actions/ListStationAction";

//getExport
const getListStationEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_LIST_STATION),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        `/station/getListStation?id=${action.payload.id}`,
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(getListStationSuccess(response.response));
        }),
        catchError((error) => handleError(error, exportPlaceFail))
      )
    )
  );
};

export default [getListStationEpic];
