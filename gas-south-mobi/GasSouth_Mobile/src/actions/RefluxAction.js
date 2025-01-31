import { createAction, createActions } from 'redux-actions';
import { TYPE_REFLUX, STORE_SERIAL, RELUX_DELETE_SERIAL, IS_CHILD_OF, DRIVER_RESET_LIST_SERIAL_RELUX } from '../types';

const changeTypeRefuxAction = createAction(TYPE_REFLUX, currentType => currentType);
const storeSerialAction = createAction(STORE_SERIAL, serial => serial);
const deleteSerialAction = createAction(RELUX_DELETE_SERIAL, serial => serial);
const storeTramAction = createAction(IS_CHILD_OF, serial => serial);
const driverResetSerialsReflux = createAction(DRIVER_RESET_LIST_SERIAL_RELUX, data => data);

export { changeTypeRefuxAction, storeSerialAction, deleteSerialAction, driverResetSerialsReflux }