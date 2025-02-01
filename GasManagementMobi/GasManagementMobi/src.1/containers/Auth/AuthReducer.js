import { handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import { Actions } from 'react-native-router-flux';
import { setToken, onSignOut, setTernant, isSignedIn, setTernantsToken} from '../../helpers/Auth';
import { setCurrentUser } from '../../helpers/permissions';

import {
    EMAIL_CHANGED,
    GET_TERNANTS_BY_EMAIL,
    GET_TERNANTS_BY_EMAIL_SUCCESS,
    GET_TERNANTS_BY_ANOTHER_EMAIL_SUCCESS,
    GET_TERNANTS_BY_EMAIL_FAIL,
    TERNANT_CHANGED,
    REPLACE_TERNANTS,
    // EMAIL_CHANGED,
    // PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    FETCH_USER_INFO,
    FETCH_USER_INFO_SUCCESS,
    FETCH_USER_INFO_FAIL,
    SET_ACCESS_TOKEN,
    REFRESH_ACCESS_TOKEN_FAIL,
    FETCH_META_DATA,
    FETCH_META_DATA_SUCCESS,
    FETCH_META_DATA_FAIL,
    LOG_OUT,
    SWITCH_DOMAIN,
    SWITCH_DOMAIN_SUCCESS,
    SWITCH_DOMAIN_FAIL,
    SWITCH_DOMAIN_REDIRECT,
    TYPE_SIGN_IN_NORMAL,
    TYPE_SIGN_IN_ANOTHER,
    TYPE_AUTHORIZED,
  } from './types';

const INITIAL_STATE = Map({
    ternant: null,
    ternants: List(),
    anotherTernants: List(),
    serverData: Map({
        loading: false,
        metaData: Map()
    }),
    emailAddress: '',
    userInfo: Map(),
    error: '',
    errorStep2: '',
    loading: false,
    accessToken: null,
    expires: null,
    refreshToken: null,
    isAuthorize: false,
    init: false,
    checkedSignIn: false
  });
//   const saveAllData = async (state) => {
//     try {
//       await AsyncStorage.setItem('GOALS', JSON.stringify(state));
//     } catch (error) {
//       console.log('AsyncStorage save error: ' + error.message);
//     }
//   }
const authReducer = handleActions({
    [EMAIL_CHANGED]: (state, action) => state.merge(action.payload, { error: ''}),
    [GET_TERNANTS_BY_EMAIL]: (state) => state.merge({loading: true, error: ''}),
    [GET_TERNANTS_BY_EMAIL_SUCCESS]: (state, action) => {
        if(action.meta.type === TYPE_SIGN_IN_ANOTHER) {
            Actions.signInAnotherStep2();
            return state.merge({anotherTernants: action.payload.ternants,loading: false, error: ''});
        }
        else if (action.meta.type === TYPE_SIGN_IN_NORMAL){
            Actions.signInStep2();
        }
        return state.merge(action.payload,{loading: false, error: ''});
    },
    [GET_TERNANTS_BY_EMAIL_FAIL]: (state, action) => state.merge(action.payload,{loading: false}),
    [TERNANT_CHANGED]: (state, action) => {
        const {ternant} = action.payload;
        setTernant(ternant);
        return state.merge(action.payload);
    },
    [REPLACE_TERNANTS]: (state, action) => {
        const ternants = state.get('anotherTernants');
        return state.merge({ternants, anotherTernants: List()});
    },
    [LOGIN_USER_SUCCESS]: (state, action) =>{
        Actions.app();
        setCurrentUser(action.payload);
        return state.merge(action.payload,{loading: false, error: '', errorStep2: '', password: '', emailAddress: ''});
    },
    [LOGIN_USER_FAIL]: (state, action) => state.merge({errorStep2: action.payload.error, password: '', loading: false}),
    [LOGIN_USER]: (state, action) => {
        if(action.meta.type === TYPE_SIGN_IN_NORMAL){
            return state.merge(action.payload, {loading: true, error: '', errorStep2: ''});
        }
        return state.merge({anotherTernant: action.payload.ternant, emailAddress: action.payload.emailAddress, password: action.payload.password, loading: true, error: '', errorStep2: ''});
    },

    [FETCH_USER_INFO_SUCCESS]: (state, action) =>{
        Actions.app();
        setCurrentUser(action.payload);
        const emailAddress = action.payload.userInfo.emailAddress;
        const ternant = state.get('ternant');
        const token = state.get('accessToken');
        const ternants = state.get('ternants').toJS();
        const expires = state.get('expires');
        const refreshToken = state.get('refreshToken');
        const ownerTernants = action.payload.userInfo.tenants || [];
        setTernantsToken(emailAddress, ternant, token, refreshToken, expires, ternants, ownerTernants);

        return state.merge(action.payload,{loading: false, error: '', checkedSignIn: true});
    },
    [FETCH_USER_INFO_FAIL]: (state, action) => {
        Actions.auth();
        return state.merge(action.payload,{loading: false, checkedSignIn: true});
    },
    [FETCH_USER_INFO]: (state, action) => state.merge(action.payload, {loading: true, error: ''}),

    [SET_ACCESS_TOKEN]: (state, action) => {
        const {accessToken, expires, refreshToken} = action.payload;
        setToken(accessToken,expires, refreshToken);
        return state.merge(action.payload);
    },
    [REFRESH_ACCESS_TOKEN_FAIL]: () => {
        onSignOut();
        Actions.auth();
        return INITIAL_STATE;
    },
    [FETCH_META_DATA_SUCCESS]: (state, action) =>state.setIn(['serverData','loading'],false).setIn(['serverData', 'metaData'],fromJS(action.payload.metaData)),
    [FETCH_META_DATA_FAIL]: (state) => state.setIn(['serverData','loading'],false),
    [FETCH_META_DATA]: (state) => state.setIn(['serverData','loading'],true),
    [LOG_OUT]: () => {
        onSignOut();
        Actions.auth();
        return INITIAL_STATE;
    },
    [SWITCH_DOMAIN]: (state, action) => state.merge(action.payload),
    [SWITCH_DOMAIN_SUCCESS]: (state) => {
        Actions.app();
        return state;
    },
    [SWITCH_DOMAIN_FAIL]: (state) => {
        Actions.signInAnotherDomain();
        return state;
    },
    [SWITCH_DOMAIN_REDIRECT]: (state) => {
        return state;
    }
    // [PERMISSION_CHANGED]: (state, action) => {
    //     const {accessToken, expiresIn, refreshToken} = action.payload.data;

    //     setToken(accessToken,expiresIn, refreshToken);
    //     setCurrentUser(action.payload.data);
    //     const { emailAddress } = action.payload.data.userInfo;
    //     const ternant = state.get('ternant');
    //     const ternants = state.get('ternants').toJS();
    //     const ownerTernants = action.payload.data.userInfo.tenants || [];
    //     setTernantsToken(emailAddress, ternant, accessToken, refreshToken, expiresIn, ternants, ownerTernants);
    //     return state.merge(action.payload.data.userInfo, { accessToken, expiresIn, refreshToken });
    // }
    
}, INITIAL_STATE);

export { authReducer as default };
