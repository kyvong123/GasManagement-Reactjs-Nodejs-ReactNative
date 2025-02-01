import {
    createActions
} from 'redux-actions';
import {
    FETCH_CYLINDER,
    FETCH_CYLINDER_SUCCESS,
    FETCH_CYLINDER_FAIL,
    REPORT_CYCLINDER,
    REPORT_CYCLINDER_SUCCESS,
    REPORT_CYCLINDER_FAIL,
    ADD_CYLINDER,
    UPDATE_CYLINDERS,
    UPDATE_CYLINDERS_FAIL,
    UPDATE_CYLINDERS_SUCCESS,
    DELETE_CYLINDERS,
    CHANGE_CYCLINDER_ACTION,
    LOG_OUT,
    TYPE_FOR_PARTNER,
    RETURN_GAS,
    RETURN_GAS_SUCCESS,
    RETURN_GAS_FAIL,
    GET_DUPLICATE_CYLINDER,
    GET_DUPLICATE_CYLINDER_SUCCESS,
    GET_DUPLICATE_CYLINDER_FAIL,
    IMPORT_DUP_CYLINDER,
    IMPORT_DUP_CYLINDER_SUCCESS,
    IMPORT_DUP_CYLINDER_FAIL
} from '../types';
export const {
    fetchCylinder,
    fetchCylinderSuccess,
    fetchCylinderFail,
    reportCyclinder,
    reportCyclinderSuccess,
    reportCyclinderFail,
    changeCyclinderAction,
    addCylinder,
    deleteCylinders,
    updateCylinders,
    updateCylindersSuccess,
    updateCylindersFail,
    logOut,
    typeForPartner,
    returnGas,
    returnGasSuccess,
    returnGasFail,
    getDuplicateCylinder,
    getDuplicateCylinderSuccess,
    getDuplicateCylinderFail,
    importDupCylinder,
    importDupCylinderSuccess,
    importDupCylinderFail,
} = createActions({
    [FETCH_CYLINDER]: (scanResults,type) => ({
        scanResults,type
    }),
    [FETCH_CYLINDER_SUCCESS]: (cyclinder) => ({
        cyclinder
    }),
    [FETCH_CYLINDER_FAIL]: (error = '') => ({
        error
    }),
    [REPORT_CYCLINDER]: (cylinder, description) => ({ cylinder, description }),
    [REPORT_CYCLINDER_SUCCESS]: () => ({}),
    [REPORT_CYCLINDER_FAIL]: (error = '') => ({
        error
    }),

    [CHANGE_CYCLINDER_ACTION]: (cyclinderAction) => ({
        cyclinderAction
    }),
    [ADD_CYLINDER]: (id) => ({
        id
    }),
    [DELETE_CYLINDERS]: () => ({}),
    [UPDATE_CYLINDERS]: (payload) => (payload),
    [UPDATE_CYLINDERS_SUCCESS]: () => ({}),
    [UPDATE_CYLINDERS_FAIL]: (error = '') => ({
        error
    }),
    [LOG_OUT]: () => ({}),
    [TYPE_FOR_PARTNER]: (data) => ({
        data
    }),
    [RETURN_GAS]: (payload) => ({payload}),
    [RETURN_GAS_SUCCESS]: () => ({}),
    [RETURN_GAS_FAIL]: (error = 'Lỗi hồi lưu') => ({
        error
    }),
    [GET_DUPLICATE_CYLINDER]: (form, id, actionType) => ({
        form, 
        id, 
        actionType
    }),
    [GET_DUPLICATE_CYLINDER_SUCCESS]: (result_getDuplicateCylinder) => ({ result_getDuplicateCylinder }),
    [GET_DUPLICATE_CYLINDER_FAIL]: (error) => ({ error }),

    [IMPORT_DUP_CYLINDER]: (payload) => (payload),
    [IMPORT_DUP_CYLINDER_SUCCESS]: () => ({}),
    [IMPORT_DUP_CYLINDER_FAIL]: (error = '') => ({error}),
});