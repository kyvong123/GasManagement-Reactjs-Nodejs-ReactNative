
import { createAction } from 'redux-actions';
import { IS_DISABLE_SIGNATURE, TYPE_DELIVERY, DELIVERY_STORE_SERIAL, STORE_ORDER_SELECTION, DRIVER_RESET_LIST_SERIAL_ORDER, DELIVERY_DELETE_SERIAL } from '../types';

const changeTypeDeliveryAction = createAction(TYPE_DELIVERY, currentType => currentType);
const deliveryStoreSerialAction = createAction(DELIVERY_STORE_SERIAL, serial => serial);
const driverStoreCurrentOrder = createAction(STORE_ORDER_SELECTION, order => order);
const driverResetListSerialOrder = createAction(DRIVER_RESET_LIST_SERIAL_ORDER);
const driverDeliveryDeleteSerial = createAction(DELIVERY_DELETE_SERIAL, serial => serial);

export { changeTypeDeliveryAction, deliveryStoreSerialAction, driverStoreCurrentOrder, driverResetListSerialOrder, driverDeliveryDeleteSerial };