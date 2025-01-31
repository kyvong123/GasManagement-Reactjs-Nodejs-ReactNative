
import { createAction } from 'redux-actions';
import { IS_DISABLE_SIGNATURE, TRUCK_TYPE_DELIVERY, TRUCK_DELIVERY_STORE_SERIAL, TRUCK_STORE_ORDER_SELECTION, TRUCK_RESET_LIST_SERIAL_ORDER, TRUCK_DELIVERY_DELETE_SERIAL } from '../types';

const changeTypeDeliveryTruckAction = createAction(TRUCK_TYPE_DELIVERY, currentType => currentType);
const deliveryStoreSerialTruckAction = createAction(TRUCK_DELIVERY_STORE_SERIAL, serial => serial);
const truckStoreCurrentOrder = createAction(TRUCK_STORE_ORDER_SELECTION, order => order);
const truckResetListSerialOrder = createAction(TRUCK_RESET_LIST_SERIAL_ORDER);
const truckDeliveryDeleteSerial = createAction(TRUCK_DELIVERY_DELETE_SERIAL, serial => serial);

export { changeTypeDeliveryTruckAction, deliveryStoreSerialTruckAction, truckStoreCurrentOrder, truckResetListSerialOrder, truckDeliveryDeleteSerial };