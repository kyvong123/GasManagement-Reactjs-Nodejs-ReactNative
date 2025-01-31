import {createActions} from 'redux-actions';
import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    LOG_OUT,
    FETCH_USERS,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAIL,
    FETCH_USERS_TYPE_FOR_PARTNER,
    // Cuong them vao
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_FAIL,
    GET_LIST_DRIVER,
    GET_LIST_DRIVER_SUCCESS,
    GET_LIST_DRIVER_FAIL,
    GET_SIGNATURE,
    GET_SIGNATURE_SUCCESS,
    GET_SIGNATURE_FAIL,
    GET_USER_INFO,
    GET_USER_INFO_SUCCESS,
    GET_USER_INFO_FAIL,
    CHANGE_PASSWORD_SUCCESS,
} from '../types';

export const {
    loginUser,
    loginUserSuccess,
    loginUserFail,
    fetchUsers,
    fetchUsersSuccess,
    fetchUsersFail,
    fetchUsersTypeForPartner,
    logOut,    
    // Cuong them vao
    changePassword,
    changePasswordFail,
    getListDriver,
    getListDriverSuccess,
    getListDriverFail,
    getSignature,
    getSignatureSuccess,
    getSignatureFail,
    getUserInfo,
    getUserInfoSuccess,
    getUserInfoFail,
    changePasswordSuccess,
} = createActions({
    [LOGIN_USER]: (email, password,playerID) => ({email, password,playerID}),
    [LOGIN_USER_SUCCESS]: (userInfo) => ({...userInfo}),
    [LOGIN_USER_FAIL]: (error) => ({error}),
    [FETCH_USERS]: () => ({}),
    [FETCH_USERS_SUCCESS]: (users) => ({
        users
    }),
    [FETCH_USERS_FAIL]: (error = '') => ({
        error
    }),
    [FETCH_USERS_TYPE_FOR_PARTNER]: () => ({}),
    [LOG_OUT]: () => ({}),
    // Cuong them vao
    [CHANGE_PASSWORD]: (email , password, new_password, new_password_confirm) => ({email , password, new_password, new_password_confirm}),
    [CHANGE_PASSWORD_FAIL]: (error) => ({error}),
    [GET_LIST_DRIVER]: (id) => ({id}),
    [GET_LIST_DRIVER_SUCCESS]: (listNameDriver) => ({listNameDriver}),
    [GET_LIST_DRIVER_FAIL]: (error) => ({error}),
    [GET_SIGNATURE]: (id) => ({id}),
    [GET_SIGNATURE_SUCCESS]: (signature) => ({
        signature
    }),
    [GET_SIGNATURE_FAIL]: (error) => ({error}),
    [GET_USER_INFO]: (id) => ({id}),
    [GET_USER_INFO_SUCCESS]: (inforTBComp) => ({inforTBComp}),
    [GET_USER_INFO_FAIL]: (error) => ({error}),
    [CHANGE_PASSWORD_SUCCESS]:(message) => ({message}),

});

