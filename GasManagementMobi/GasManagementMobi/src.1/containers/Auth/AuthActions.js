import { createActions } from 'redux-actions';
import {
  EMAIL_CHANGED,
  GET_TERNANTS_BY_EMAIL,
  GET_TERNANTS_BY_EMAIL_SUCCESS,
  GET_TERNANTS_BY_ANOTHER_EMAIL_SUCCESS,
  GET_TERNANTS_BY_EMAIL_FAIL,
  TERNANT_CHANGED,
  REPLACE_TERNANTS,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  FETCH_USER_INFO,
  FETCH_USER_INFO_SUCCESS,
  FETCH_USER_INFO_FAIL,
  SET_ACCESS_TOKEN,
  REFRESH_ACCESS_TOKEN,
  REFRESH_ACCESS_TOKEN_SUCCESS,
  REFRESH_ACCESS_TOKEN_FAIL,
  FETCH_REFRESH_TOKEN,
  FETCH_REFRESH_TOKEN_SUCCESS,
  FETCH_REFRESH_TOKEN_FAIL,
  FETCH_META_DATA,
  FETCH_META_DATA_SUCCESS,
  FETCH_META_DATA_FAIL,
  LOG_OUT,
  SWITCH_DOMAIN,
  SWITCH_DOMAIN_SUCCESS,
  SWITCH_DOMAIN_FAIL,
  SWITCH_DOMAIN_REDIRECT,
  TYPE_SIGN_IN_NORMAL
} from './types';

export const  {
  emailChanged,
  getTernantsByEmail,
  getTernantsByEmailSuccess,
  getTernantsByAnotherEmailSuccess,
  getTernantsByEmailFail,
  ternantChanged,
  replaceTernants,
  loginUser,
  loginUserSuccess,
  loginUserFail,
  fetchUserInfo,
  fetchUserInfoSuccess,
  fetchUserInfoFail,
  setAccessToken,
  refreshAccessToken,
  refreshAccessTokenSuccess,
  refreshAccessTokenFail,
  fetchRefreshToken,
  fetchRefreshTokenSuccess,
  fetchRefreshTokenFail,
  fetchMetaData,
  fetchMetaDataSuccess,
  fetchMetaDataFail,
  logOut,
  switchDomain,
  switchDomainSuccess,
  switchDomainRedirect,
  switchDomainFail
} = createActions({
    [EMAIL_CHANGED]: (emailAddress) => ({emailAddress}),
    [GET_TERNANTS_BY_EMAIL]: [(emailAddress) => ({emailAddress}), (emailAddress, type=TYPE_SIGN_IN_NORMAL) => ({type})],
    [GET_TERNANTS_BY_EMAIL_SUCCESS]:[(ternants) => ({ternants}), (ternants, type = TYPE_SIGN_IN_NORMAL) => ({type})],
    [GET_TERNANTS_BY_EMAIL_FAIL]:(error) => ({error}),
    [TERNANT_CHANGED]: (ternant) => ({ternant}),
    [REPLACE_TERNANTS]: () => ({}),
    [LOGIN_USER]: [(ternant, emailAddress, password) => ({ternant, emailAddress, password}), (ternant, emailAddress, password, type=TYPE_SIGN_IN_NORMAL) => ({type})],
    [LOGIN_USER_SUCCESS]: (userInfo) => ({ userInfo }),
    [LOGIN_USER_FAIL]: (error) => ({ error }),
    [FETCH_USER_INFO]: () => ({loading: true}),
    [FETCH_USER_INFO_SUCCESS]: (userInfo) => ({ userInfo }),
    [FETCH_USER_INFO_FAIL]: (error='') => ({error}),
    [SET_ACCESS_TOKEN]: (accessToken, expires, refreshToken) => ({accessToken, expires, refreshToken}),
    [REFRESH_ACCESS_TOKEN]: (callback) => ({callback,loading: true}),
    [REFRESH_ACCESS_TOKEN_SUCCESS]: (callback) => ({callback,loading: true}),
    [REFRESH_ACCESS_TOKEN_FAIL]: (error) => ({ error }),
    [FETCH_REFRESH_TOKEN]: (ternant,refreshToken) => ({ternant,refreshToken,loading: true}),
    [FETCH_REFRESH_TOKEN_SUCCESS]: () => ({loading: true}),
    [FETCH_REFRESH_TOKEN_FAIL]: (error) => ({ error }),
    [FETCH_META_DATA]: () => ({}),
    [FETCH_META_DATA_SUCCESS]: (metaData) => ({metaData}),
    [FETCH_META_DATA_FAIL]: (error) => ({ error }),
    [LOG_OUT]: () => ({}),
    [SWITCH_DOMAIN]: (domain) => ({domain}),
    [SWITCH_DOMAIN_SUCCESS]: () => ({}),
    [SWITCH_DOMAIN_REDIRECT]: (ssoToken, domain) => ({ssoToken, domain}),
    [SWITCH_DOMAIN_FAIL]: () => ({}),
  });

