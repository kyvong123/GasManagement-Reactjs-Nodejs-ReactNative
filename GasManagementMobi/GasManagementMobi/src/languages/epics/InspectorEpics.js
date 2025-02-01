import { ajax } from "rxjs/ajax";
import { throwError, of, EMPTY } from "rxjs";
import { ofType } from "redux-observable";
import { groupBy } from "lodash";
import { Alert } from "react-native";
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
import {
  SET_CHECKLIST,
  SET_CHECKLIST_SUCCESS,
  SET_CHECKLIST_FAIL,
  MTHCHK,
  MTHCHK_SUCCESS,
  MTHCHK_FAIL,
  MTDATE,
  MTDATE_SUCCESS,
  MTDATE_FAIL,
  GETALLCHILD,
  GETALLCHILD_SUCCESS,
  GETALLCHILD_FAIL,
} from "../../types";

import { destinationList } from "../../helper/selector";

import { setLanguage, getLanguage } from "../../helper/auth";

import {
  setChecklist,
  setChecklistSuccess,
  setChecklistFail,
  mthchk,
  mthchkSuccess,
  mthchkFail,
  mtdateSuccess,
  mtdateFail,
  getallchild,
  getallchildSuccess,
  getallchildFail,
} from "../../actions/InspectorActions";

import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { Component } from "react";

const translationGetters = {
  en: () => require("../../languages/en.json"),
  vi: () => require("../../languages/vi.json"),
};

componentWillUnmount = () => {
  console.log("Inspector Unmount");
};

componentDidMount = async () => {
  console.log("Inspector Didmount");
  try {
    console.log("Can get Language");
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener(
        "change",
        this.handleChangeLanguage(languageCode)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const chooseLanguageConfig = (lgnCode) => {
  let fallback = { languageTag: "vi" };
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = { languageTag: lgnCode };
  }

  const { languageTag } = fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setChecklistEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_CHECKLIST),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        //console.log("setChecklistEpic", action.payload);
        ajaxAdapter("/inspector/checklist", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            // console.log("setChecklistEpic_Success", response.response);
            if (response.response.success === true) {
              Actions.app();
              // console.log("setChecklistEpic_Success", response.response);
              return setChecklistSuccess(response.response);
            }
            console.log("setChecklistEpic_Fail");
            return setChecklistFail(response.response.message);
            //return {type: 'SET_CHECKLIST_FAIL'}
          }),
          catchError((error) => {
            console.log("catchError_setChecklistEpic", error);
            return handleError(error, setChecklistFail);
          })
        )
      //return EMPTY;
    )
  );

const setChecklistSuccessEpic = (action$) =>
  action$.pipe(
    ofType(SET_CHECKLIST_SUCCESS),
    mergeMap((action) => {
      // console.log("set_Checklist_SUCCESS", action.payload);
      Alert.alert(translate("notification"), action.payload.respond.message);
      // alert(action.payload.message);
      return EMPTY;
    })
  );

const setChecklistFailEpic = (action$) =>
  action$.pipe(
    ofType(SET_CHECKLIST_FAIL),
    mergeMap((action) => {
      // console.log("set_Checklist_FAIL", action.payload);
      //setToken(action.payload);
      Alert.alert(translate("notification"), action.payload.error);
      return EMPTY;
    })
  );

const setMthChecklistEpic = (action$, state$) =>
  action$.pipe(
    ofType(MTHCHK),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        //console.log("setChecklistEpic", action.payload);
        ajaxAdapter(
          "/inspector/setMonthlyChecklist",
          "POST",
          action.payload
        ).pipe(
          retry(3),
          map((response) => {
            // console.log("setMonthlyChecklist", response.response);
            if (response.response.success === true) {
              Actions.app();
              // console.log("setMonthlyChecklist_Success", response.response);
              return mthchkSuccess(response.response);
            }
            console.log("setMonthlyChecklist_Fail");
            return mthchkFail(response.response.message);
          }),
          catchError((error) => {
            console.log("catchError_setMonthlyChecklistEpic", error);
            return handleError(error, mthchkFail);
          })
        )
      //return EMPTY;
    )
  );

const setMthChecklistSuccessEpic = (action$) =>
  action$.pipe(
    ofType(MTHCHK_SUCCESS),
    mergeMap((action) => {
      // console.log("set_MthChecklist_SUCCESS", action.payload);
      Alert.alert(translate("notification"), action.payload.respond.message);
      // alert(action.payload.message);
      return EMPTY;
    })
  );

const setMthChecklistFailEpic = (action$) =>
  action$.pipe(
    ofType(MTHCHK_FAIL),
    mergeMap((action) => {
      // console.log("set_MthChecklist_FAIL", action.payload);
      //setToken(action.payload);
      Alert.alert(translate("notification"), action.payload.error);
      return EMPTY;
    })
  );

const getMtnDateEpic = (action$, state$) =>
  action$.pipe(
    ofType(MTDATE),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    //distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        //console.log("setChecklistEpic", action.payload);
        ajaxAdapter("/schedule/getSchedule", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            // console.log("getMtnDate", response.response);
            if (response.response.error === false) {
              //Actions.app();
              // console.log("getMtnDate_Success", response.response);
              return mtdateSuccess(response.response.maintenanceDate);
            }
            console.log("getMtnDate_Fail");
            return mtdateFail(response.response.message);
          }),
          catchError((error) => {
            console.log("catchError_getMtnDateEpic", error);
            return handleError(error, mtdateFail);
          })
        )
      //return EMPTY;
    )
  );

const getMtnDateSuccessEpic = (action$) =>
  action$.pipe(
    ofType(MTDATE_SUCCESS),
    mergeMap((action) => {
      // console.log("set_getMtnDate_SUCCESS", action.payload);
      //alert(action.payload.respond.message);
      // alert(action.payload.message);
      return EMPTY;
    })
  );

const getMtnDateFailEpic = (action$) =>
  action$.pipe(
    ofType(MTDATE_FAIL),
    mergeMap((action) => {
      // console.log("set_getMtnDate_FAIL", action.payload);
      //setToken(action.payload);
      Alert.alert(translate("notification"), action.payload.error);
      return EMPTY;
    })
  );

//

const getListChildCompEpic = (action$, state$) =>
  action$.pipe(
    ofType(GETALLCHILD),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    retry(3),
    mergeMap(
      (action, state) =>
        //Actions.application();
        //console.log("setChecklistEpic", action.payload);
        ajaxAdapter("/user/getAllChild", "POST", action.payload).pipe(
          retry(3),
          map((response) => {
            // console.log("getListChildCompEpic", response.response);
            if (response.response.error === false) {
              //Actions.app();
              // console.log("getListChildComp_Success", response.response);
              return getallchildSuccess(response.response.childCompany);
            }
            console.log("getListChildComp_Fail");
            return getallchildFail(response.response.message);
          }),
          catchError((error) => {
            console.log("catchError_getListChildCompEpic", error);
            return handleError(error, getallchildFail);
          })
        )
      //return EMPTY;
    )
  );

const getListChildCompSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GETALLCHILD_SUCCESS),
    mergeMap((action) => {
      // console.log("getListChildComp_Success", action.payload);
      //alert(action.payload.respond.message);
      // alert(action.payload.message);
      return EMPTY;
    })
  );

// export const mapStateToProps = state => ({
//         error: state.inspector.error
// });

export default [
  setChecklistEpic,
  setChecklistSuccessEpic,
  setChecklistFailEpic,
  setMthChecklistEpic,
  setMthChecklistSuccessEpic,
  setMthChecklistFailEpic,
  getMtnDateEpic,
  getMtnDateSuccessEpic,
  getMtnDateFailEpic,
  getListChildCompEpic,
  getListChildCompSuccessEpic,
];
