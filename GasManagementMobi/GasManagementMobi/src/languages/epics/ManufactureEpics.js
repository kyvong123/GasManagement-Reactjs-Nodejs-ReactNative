import { throwError, of, EMPTY } from "rxjs";
import { ofType } from "redux-observable";
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
import manufactureApi from "../../api/manufacture";

import {
  EXPORT_PLACE,
  EXPORT_PLACE_SUCCESS,
  EXPORT_PLACE_FAIL,
} from "../../types";
import {
  exportPlaceSuccess,
  exportPlaceFail,
} from "../../actions/ManufactureAction";
import { Alert } from "react-native";
const exportPlaceEpic = (action$, state$) =>
  action$.pipe(
    ofType(EXPORT_PLACE),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        manufactureApi.getExportPlace.url({
          owner: state$.value.auth.user.parentRoot,
        }),
        "GET",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(exportPlaceSuccess(response.response));
        }),
        catchError((error) => handleError(error, exportPlaceFail))
      )
    )
  );

const exportPlaceEpicFail = (action$) =>
  action$.pipe(
    ofType(EXPORT_PLACE_FAIL),
    mergeMap((action) => {
      // Alert.alert(
      //     'Không tìm thấy báo cáo nào',
      //     'Vui lòng thử lại',
      //     [
      //         {text: 'Ok'},
      //     ],
      //     {cancelable: false}
      // )
      return EMPTY;
    })
  );

export default [exportPlaceEpic, exportPlaceEpicFail];
