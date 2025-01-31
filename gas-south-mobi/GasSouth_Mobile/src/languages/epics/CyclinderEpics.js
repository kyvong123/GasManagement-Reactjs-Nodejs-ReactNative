import { Alert } from "react-native";
import { EMPTY, of } from "rxjs";
import { ofType } from "redux-observable";
import saver from "../../utils/saver";
import {
  distinctUntilChanged,
  switchMap,
  retry,
  mergeMap,
  tap,
  catchError,
  map,
} from "rxjs/operators";

import { Actions } from "react-native-router-flux";
import {
  FETCH_CYLINDER,
  REPORT_CYCLINDER,
  FETCH_CYLINDER_FAIL,
  REPORT_CYCLINDER_SUCCESS,
  REPORT_CYCLINDER_FAIL,
  UPDATE_CYLINDERS,
  UPDATE_CYLINDERS_SUCCESS,
  UPDATE_CYLINDERS_FAIL,
  ADD_CYLINDER,
  RETURN_GAS,
  RETURN_GAS_FAIL,
  GET_DUPLICATE_CYLINDER,
  GET_DUPLICATE_CYLINDER_SUCCESS,
  GET_DUPLICATE_CYLINDER_FAIL,
  IMPORT_DUP_CYLINDER,
  IMPORT_DUP_CYLINDER_SUCCESS,
  IMPORT_DUP_CYLINDER_FAIL,
} from "../../types";
import cyclinderApi from "../../api/cyclinder";
import { ajaxAdapter, handleError } from "../../helper/utils";

import {
  fetchCylinderSuccess,
  fetchCylinderFail,
  reportCyclinderSuccess,
  reportCyclinderFail,
  updateCylindersSuccess,
  updateCylindersFail,
  returnGas,
  returnGasSuccess,
  returnGasFail,
  getDuplicateCylinder,
  getDuplicateCylinderSuccess,
  getDuplicateCylinderFail,
  importDupCylinder,
  importDupCylinderSuccess,
  importDupCylinderFail,
} from "../../actions/CyclinderActions";

import addLocalCyclinder from "./../../api/addLocalCyclinder";
import { add } from "react-native-reanimated";

// import { tokenMiddleWare } from '../middleware'

// const getCyclinderByListEpic = (action$) => action$.pipe(
//   ofType(FETCH_CYLINDER),
// retry(3),
// mergeMap(action =>
//   ajaxAdapter(
//   cyclinderApi.getCyclinderFromList.url(action.payload.scanResults),
//   'GET'
// )
const getCyclinderByListEpic = (action$, state$) =>
  action$.pipe(
    ofType(FETCH_CYLINDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        cyclinderApi.getCyclinderFromList.url({
          cylinder_serial: action.payload.scanResults,
          type: action.payload.type,
        }),
        "GET",
        action.payload
      )
        // retry(3),
        // mergeMap(action =>
        //   ajaxAdapter(
        //   cyclinderApi.getCyclinderFromList.url(action.payload.scanResults),
        //   'GET'
        // )
        .pipe(
          retry(3),
          switchMap((response) => {
            // Actions.push("result2")
            return of(fetchCylinderSuccess(response.response));
          }),
          catchError((error) => handleError(error, fetchCylinderFail))
        )
    )
  );

const getCyclinderFailEpic = (action$, state$) =>
  action$.pipe(
    ofType(FETCH_CYLINDER_FAIL),
    mergeMap((action) => {
      if (Actions.currentScene !== "scan") {
        //  Actions.reset("result2")
        // Alert.alert(
        //     'Không tìm thấy mã bình nào',
        //     'Vui lòng thử lại',
        //     [
        //         {text: 'Tìm lại', onPress: async () => {await saver.setTypeCamera(false) ; Actions.push("scan")}},
        //         {text: 'Quét thủ công', onPress: () => Actions.scanManual()},
        //     ],
        //     {cancelable: false}
        Alert.alert(
          "Không tìm thấy mã bình nào",
          "Vui lòng thử lại",
          [
            {
              text: "ok",
              onPress: async () => {
                console.log("ok");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Không tìm thấy mã bình nào",
          "Vui lòng thử lại",
          [
            //!!state$.value.cylinders.cyclinderAction ? {text: 'Quét QR', onPress: async () => {await saver.setTypeCamera(true) ; Actions.push("scan")}} : null,
            {
              text: "Quét mã",
              onPress: async () => {
                await saver.setTypeCamera(false);
                Actions.push("scan");
              },
            },
            { text: "Quét thủ công", onPress: () => Actions.scanManual() },
          ],
          { cancelable: false }
        );
      }

      return EMPTY;
    })
  );

const reportCyclinderEpic = (action$) =>
  action$.pipe(
    ofType(REPORT_CYCLINDER),
    retry(3),
    mergeMap((action) =>
      ajaxAdapter(
        cyclinderApi.reportCyclinder.url(),
        "POST",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(reportCyclinderSuccess());
        }),
        catchError((error) => handleError(error, reportCyclinderFail))
      )
    )
  );
const reportCyclinderSuccessEpic = (action$) =>
  action$.pipe(
    ofType(REPORT_CYCLINDER_SUCCESS),
    mergeMap((action) => {
      Alert.alert(
        "Gửi phản hồi thành công",
        "Phản hồi của bạn đã được gửi. Chân thành cảm ơn.",
        [{ text: "Ok", onPress: () => Actions.pop() }],
        { cancelable: false }
      );
      return EMPTY;
    })
  );
const reportCyclinderFailEpic = (action$) =>
  action$.pipe(
    ofType(REPORT_CYCLINDER_FAIL),
    mergeMap((action) => {
      Alert.alert(
        "Gửi phản hồi thất bại",
        "Vui lòng thử lại",
        [{ text: "Ok" }],
        { cancelable: false }
      );
      return EMPTY;
    })
  );
const updateCylindersEpic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_CYLINDERS),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        cyclinderApi.updateCylinders.url(),
        "POST",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(updateCylindersSuccess());
        }),

        catchError((error) => handleError(error, updateCylindersFail))
      )
    )
  );
const updateCylindersSuccessEpic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_CYLINDERS_SUCCESS),
    mergeMap((action) => {
      addLocalCyclinder.removeItem();
      const { userType } = state$.value.auth.user;
      const { cyclinderAction } = state$.value.cylinders;
      Alert.alert("Thành công", "Thao tác thành công", [{ text: "Ok" }], {
        cancelable: false,
      });
      // if (userType === 'Agency' && cyclinderAction === 'EXPORT') {
      //     Actions.customer()
      //     return EMPTY
      // }
      Actions.reset("app");
      return EMPTY;
    })
  );
const updateCylindersFailEpic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_CYLINDERS_FAIL),
    mergeMap((action) => {
      addLocalCyclinder.removeItem();
      Alert.alert("Thao tác thất bại", "Vui lòng thử lại", [{ text: "Ok" }], {
        cancelable: false,
      });
      Actions.reset("app");
      return EMPTY;
    })
  );

const returnGasEpic = (action$, state$) =>
  action$.pipe(
    ofType(RETURN_GAS),
    retry(3),
    mergeMap((action) =>
      ajaxAdapter("/returnGas", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.status === 200) {
            //Actions.app();
            // console.log("returnGas", response.response);
            return EMPTY;
          }
          return handleError(response, returnGasFail);
        }),
        catchError((error) => handleError(error, returnGasFail))
      )
    )
  );

const returnGasFailEpic = (action$, state$) =>
  action$.pipe(
    ofType(RETURN_GAS_FAIL),
    mergeMap((action) => {
      Alert.alert("Thao tác thất bại", "Vui lòng thử lại", [{ text: "Ok" }], {
        cancelable: false,
      });
      Actions.reset("app");
      return EMPTY;
    })
  );

export const mapStateToProps = (state) => ({
  cyclinderAction: state.cylinders.cyclinderAction,
});

const getDuplicateCylinderEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_DUPLICATE_CYLINDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    mergeMap((action, state) =>
      ajaxAdapter("/cylinder/checkExport", "POST", action.payload).pipe(
        retry(3),
        map((response) => {
          if (response.response.status === true) {
            // console.log("getDuplicateCylinderSuccess--->", response.response);
            return getDuplicateCylinderSuccess(response.response);
          }
          return EMPTY;
        }),
        catchError((error) => {
          console.log("getDuplicateCylinderFail--->", error);
          return EMPTY;
        })
      )
    )
  );

const getDuplicateCylinderSuccessEpic = (action$) =>
  action$.pipe(
    ofType(GET_DUPLICATE_CYLINDER_SUCCESS),
    mergeMap((action) => {
      // console.log("getDuplicateCylinder_SUCCESS", action.payload);
      return action.payload;
    })
  );

const getDuplicateCylinderFailEpic = (action$) =>
  action$.pipe(
    ofType(GET_DUPLICATE_CYLINDER_FAIL),
    mergeMap((action) => {
      // console.log("getDuplicateCylinder_FAIL", action.payload);
      return EMPTY;
    })
  );

const importDupCylinderEpic = (action$, state$) =>
  action$.pipe(
    ofType(IMPORT_DUP_CYLINDER),
    tap((action) => {
      action.payload.token = state$.value.auth.token;
      return action;
    }),
    distinctUntilChanged(),
    switchMap((action) =>
      ajaxAdapter(
        cyclinderApi.importDupCylinder.url(),
        "POST",
        action.payload
      ).pipe(
        retry(3),
        switchMap((response) => {
          return of(importDupCylinderSuccess());
        }),
        catchError((error) => {
          handleError(error, importDupCylinderFail);
        })
      )
    )
  );
const importDupCylinderSuccessEpic = (action$, state$) =>
  action$.pipe(
    ofType(IMPORT_DUP_CYLINDER_SUCCESS),
    mergeMap((action) => {
      addLocalCyclinder.removeItem();
      const { userType } = state$.value.auth.user;
      const { cyclinderAction } = state$.value.cylinders;
      Alert.alert("Thành công", "Thao tác thành công", [{ text: "Ok" }], {
        cancelable: false,
      });
      Actions.reset("app");
      return EMPTY;
    })
  );
const importDupCylinderFailEpic = (action$, state$) =>
  action$.pipe(
    ofType(IMPORT_DUP_CYLINDER_FAIL),
    mergeMap((action) => {
      addLocalCyclinder.removeItem();
      Alert.alert("Thao tác thất bại", "Vui lòng thử lại", [{ text: "Ok" }], {
        cancelable: false,
      });
      Actions.reset("app");
      return EMPTY;
    })
  );
export default [
  getCyclinderByListEpic,
  getCyclinderFailEpic,
  reportCyclinderEpic,
  reportCyclinderSuccessEpic,
  reportCyclinderFailEpic,
  updateCylindersEpic,
  updateCylindersSuccessEpic,
  updateCylindersFailEpic,
  returnGasEpic,
  returnGasFailEpic,
  getDuplicateCylinderEpic,
  getDuplicateCylinderSuccessEpic,
  getDuplicateCylinderFailEpic,
  importDupCylinderEpic,
  importDupCylinderSuccessEpic,
  importDupCylinderFailEpic,
];
