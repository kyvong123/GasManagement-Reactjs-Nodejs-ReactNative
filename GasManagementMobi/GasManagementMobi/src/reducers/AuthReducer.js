import { handleActions } from 'redux-actions';
import {
    LOG_OUT,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    FETCH_USERS,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAIL, FETCH_USERS_TYPE_FOR_PARTNER,
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
import { Actions } from 'react-native-router-flux';

const INITIAL_STATE = {
    inforTBComp: { name: '' },
    isChildOf: undefined,
    _userInfo: undefined,
};

const auth = handleActions({

    [LOGIN_USER]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: '',
            loading: true,
        }
    },
    [LOGIN_USER_SUCCESS]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            _userInfo: action.payload.user,
            loading: false,
            error: '',
            password: undefined,
            isChildOf: action.payload.user.isChildOf
        }
    },
    [LOGIN_USER_FAIL]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: "Email hoặc Mật khẩu không chính xác",
            loading: false,
        }
    },
    [FETCH_USERS]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: '',
            loading: true,
        }
    },
    [FETCH_USERS_SUCCESS]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: '',
            loading: false,
        }
    },
    [FETCH_USERS_FAIL]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: ''
        }
    },
    [FETCH_USERS_TYPE_FOR_PARTNER]: (state, action) => {
        // console.log("state", state);
        return {
            ...state,
            ...action.payload,
            error: '',
            loading: true,
        }
    },
    [LOG_OUT]: () => INITIAL_STATE,
    // Cuong them vao
    [CHANGE_PASSWORD]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: '',
            loading: false,
        }
    },
    [CHANGE_PASSWORD_SUCCESS]: (state, action) => {
        //console.log("aaaaaaaa"+ state)
        return {
            ...state,
            ...action.payload,
            error: '.',
            loading: false,
        }
    },
    [CHANGE_PASSWORD_FAIL]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: 'Đổi password không thành công',
            loading: false,
        }
    },
    [GET_LIST_DRIVER]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: ''
        }
    },
    [GET_LIST_DRIVER_SUCCESS]: (state, action) => {
        // console.log("get_list_driver", action);
        return {
            ...state,
            ...action.payload,
            error: ''
        }
    },
    [GET_LIST_DRIVER_FAIL]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: 'Lấy thông tin driver không thành công'
        }
    },
    [GET_SIGNATURE]: (state, action) => {
        // console.log("g_signature", action)
        return {
            ...state,
            ...action.payload,
            error: ''
        }
    },
    [GET_SIGNATURE_SUCCESS]: (state, action) => {
        // console.log("get_signatuer_driver", action);
        return {
            ...state,
            ...action.payload,
            error: ''
        }
    },
    [GET_SIGNATURE_FAIL]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: 'Lấy thông tin chữ ký không thành công'
        }
    },
    [GET_USER_INFO]: (state, action) => {
        // console.log('GET_USER_INFO', action)
        return {
            ...state,
            ...action.payload,
            error: ''
        }
    },
    [GET_USER_INFO_SUCCESS]: (state, action) => {

        return {
            ...state,
            ...action.payload,
            error: '',
            isChildOf: ''
        }
    },
    [GET_USER_INFO_FAIL]: (state, action) => {
        return {
            ...state,
            ...action.payload,
            error: 'Lấy thông tin công ty hồi lưu không thành công'
        }
    },
}, INITIAL_STATE);

export { auth as default };