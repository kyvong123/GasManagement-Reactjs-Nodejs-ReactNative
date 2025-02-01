import { createAction, createActions } from 'redux-actions';
import { LIST_ORDER, LIST_DELIVERY_STATISTICS } from '../types';


const listOrderofOrderManager = createAction(LIST_ORDER, listOrder => listOrder);
const listDeliveryStatistics = createAction(LIST_DELIVERY_STATISTICS, deliveryStatistics => deliveryStatistics);

export { listOrderofOrderManager, listDeliveryStatistics }
