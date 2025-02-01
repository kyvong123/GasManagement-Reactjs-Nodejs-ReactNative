import {
    ajax
} from "rxjs/ajax";
import {
    throwError,
    of ,
    EMPTY
} from "rxjs";
import {
    ofType
} from "redux-observable";
import {
    groupBy
} from "lodash";
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
import {
    ajaxAdapter,
    handleError
} from "../helper/utils";
import {
    Actions
} from "react-native-router-flux";
import i18n from "i18n-js";
import {
    setLanguage
} from "../helper/auth";
import {
    Alert
} from "react-native";
import cyclinderApi from '../api/cyclinder';

import {
    GSTT,
    GSTTS,
    GSTTF
} from "../types";
import {
    exportPlaceSuccess,
    exportPlaceFail
} from '../actions/ManufactureAction';
import {
   gstt,
   gsttf,
   gstts
} from "../actions/StatisticActions";

const gsttEpic = (action$, state$) =>
    action$.pipe(
        ofType(GSTT),
        tap((action) => {
            action.payload.token = state$.value.auth.token;
            return action;
        }),
        distinctUntilChanged(),
        switchMap(action =>
            ajaxAdapter(
                cyclinderApi.GSTTurl.url({
                    id: action.payload.target_id,
                    dateStart: action.payload.start_date,
                    dateEnd: action.payload.end_date,
                    statisticalType: action.payload.statisticalType
                }), 'GET', action.payload
            ).pipe(
                retry(3),
                switchMap(response => {
                    return of(gstts(response.response))
                }),
                catchError(error => handleError(error, exportPlaceFail))
            ))
    );

const gsttSuccessEpic = (action$) =>
    action$.pipe(
        ofType(GSTTS),
        mergeMap((action) => {
            console.log("Export_SUCCESS", action.payload);
            return EMPTY;
        })
    );

const gsttFailEpic = (action$) =>
    action$.pipe(
        ofType(GSTTF),
        mergeMap((action) => {
            console.log("Export_FAIL", action.payload);
            //setToken(action.payload);
            return EMPTY;
        })
    );

export default [
    gsttEpic,
    gsttSuccessEpic,
    gsttFailEpic
];