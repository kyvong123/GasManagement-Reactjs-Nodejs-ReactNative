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
import exportApi from "../../api/export";
import statisticsApi from "../../api/statistics";

import { GET_LIST_MANUFACTURE } from "../../types";
import {
  exportPlaceSuccess,
  exportPlaceFail,
} from "../../actions/ManufactureAction";
import {
  getListStation,
  getListManufactureResult,
} from "../../actions/ListManufactureAction";

//getExport
const getListManufactureEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_LIST_MANUFACTURE),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        `/manufacture/listManufacture?isChildOf=${action.payload.isChildOf}`,
        "POST",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(getListManufactureResult(response.response));
        }),
        catchError((error) => handleError(error, exportPlaceFail))
      )
    )
  );
};

export default [getListManufactureEpic];
