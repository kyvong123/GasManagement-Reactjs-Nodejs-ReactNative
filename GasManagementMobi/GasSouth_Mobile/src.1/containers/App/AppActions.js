import { createActions } from 'redux-actions';
// import { Actions } from 'react-native-router-flux';
import { SHOW_ERROR_TOAST, SHOW_WARM_TOAST, SHOW_INFO_TOAST, HIDE_TOAST, LOG_OUT  } from './types';

export const {showErrorToast, showWarmToast, showInfoToast, hideToast, logOut }  = createActions({
    [SHOW_ERROR_TOAST]: (toastMessage, toastDuration) => ({toast:{toastMessage, toastDuration}}),
    [SHOW_WARM_TOAST]: (toastMessage, toastDuration) => ({toast:{toastMessage, toastDuration}}),
    [SHOW_INFO_TOAST]: (toastMessage, toastDuration) => ({toast:{toastMessage, toastDuration}}),
    [HIDE_TOAST]: () => ({}),
    [LOG_OUT]: () => ({})
});
