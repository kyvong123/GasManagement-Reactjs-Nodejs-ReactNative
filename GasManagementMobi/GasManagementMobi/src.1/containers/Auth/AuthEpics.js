import {Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {sortBy as _sortBy} from 'lodash';
import {END_POINT} from '../../constants';
import {removeSpace, Base64, ajaxAdapter} from '../../helpers/Utils';
import { hasKnowledgePermission, KnowledgePermissions} from '../../helpers/permissions';

import { LOGIN_USER, 
  REFRESH_ACCESS_TOKEN,
  REFRESH_ACCESS_TOKEN_FAIL,
  FETCH_USER_INFO, 
  GET_TERNANTS_BY_EMAIL, 
  FETCH_REFRESH_TOKEN, 
  SET_ACCESS_TOKEN,
FETCH_META_DATA, TYPE_SIGN_IN_ANOTHER, TYPE_AUTHORIZED, SWITCH_DOMAIN, SWITCH_DOMAIN_REDIRECT } from './types';

import {
  loginUserSuccess,
  loginUserFail,
  logOut,
  setAccessToken,
  ternantChanged,
  replaceTernants,
  fetchUserInfo,
  fetchUserInfoSuccess,
  fetchUserInfoFail,
  refreshAccessToken,
  refreshAccessTokenFail,
  fetchRefreshToken,
  fetchMetaData,
  fetchMetaDataSuccess,
  fetchMetaDataFail,
  getTernantsByEmail,
  getTernantsByEmailSuccess,
  getTernantsByAnotherEmailSuccess,
  getTernantsByEmailFail, 
  switchDomainFail,
  switchDomain,
  switchDomainSuccess,
  switchDomainRedirect
} from './AuthActions';
import { fetchArticleServices } from '../../containers/Services/ServiceActions';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';

const getTernantsByEmailEpic = action$ =>
action$.ofType(GET_TERNANTS_BY_EMAIL)
.debounceTime(150)
.distinctUntilChanged()
.switchMap(action => 
  ajaxAdapter(END_POINT.getTernantByEmail.url(Base64.encode(removeSpace(action.payload.emailAddress))),END_POINT.getTernantByEmail.method)
  .retry(3)
  .mergeMap(({response}) => {
    if(response.status !== 200){
      return Observable.of(getTernantsByEmailFail(response.data.errors[0].login));
      
    }
    let ternants = [];
    if(response.data && response.data.associations){
      ternants = response.data.associations;
      ternants = _sortBy(ternants, ['companyName', 'domain']);

    }
    return Observable.of(getTernantsByEmailSuccess(ternants, action.meta.type));
    
  })
  .catch((error) =>
      //  Observable.of(getTernantsByEmailFail('Load ternants fail', error))
      Observable.of(getTernantsByEmailFail('Sorry, something went wrong. Please try again later.'))
    
  ));

const loginUserEpic = (action$, state) =>
action$.ofType(LOGIN_USER)
.debounceTime(150)
.distinctUntilChanged()
.switchMap(action => 
  ajaxAdapter(END_POINT.loginUser.url(action.payload.ternant),END_POINT.loginUser.method,action.payload)
  .retry(3)
  .mergeMap(({response}) => {
    console.log(response);
    if(response.status !== 200){
      return Observable.of(loginUserFail(response.message));
      
    }
    if((response.data && response.data.customerInfo && !response.data.userInfo) || !hasKnowledgePermission(KnowledgePermissions.AAC_MANAGE_ARTICLES, response.data.userInfo)){
      return Observable.of(loginUserFail('Sorry, but you do not have access to the management console. Please contact your administrator for more information.'));
    }

    const { accessToken, refreshToken, userInfo } = response.data;
    const expires = Math.round(Date.now()/1000) + response.data.expiresIn;

    if(action.meta.type === TYPE_SIGN_IN_ANOTHER){
      return Observable.concat(
        Observable.of(setAccessToken(accessToken, expires, refreshToken)),
        Observable.of(loginUserSuccess(userInfo)),
        Observable.of(fetchUserInfo()),
        Observable.of(fetchMetaData()),
        Observable.of(ternantChanged(action.payload.ternant)),
        Observable.of(replaceTernants())
      );
    }
    return Observable.concat(
      // TODO: move setToken from reducer to here
      Observable.of(setAccessToken(accessToken, expires, refreshToken)),
      Observable.of(loginUserSuccess(userInfo)),
      Observable.of(fetchUserInfo()),
      Observable.of(fetchMetaData()),
      Observable.of(ternantChanged(action.payload.ternant)),
      // Observable.of(fetchUserInfo())
    );
    
  })
  .catch((error) =>
    {
      console.log(error);
      
      return Observable.of(loginUserFail('Sorry, something went wrong. Please try again later.'));
    }
    
  ));

  const fetchRefreshTokenEpic = (action$, store, { ternantMiddleWare, refreshTokenMiddleWare }) =>
  action$.ofType(FETCH_REFRESH_TOKEN)
  .mergeMap(action => refreshTokenMiddleWare(action))
  .mergeMap(action => ternantMiddleWare(action))
  .switchMap(action => {
    console.log('fetchRefreshTokenEpic*****', action);

    if(!action.payload.refreshToken || !action.payload.ternant){
      return Observable.of(refreshAccessTokenFail());
    }
    return ajaxAdapter(END_POINT.refreshToken.url(action.payload.ternant, action.payload.refreshToken),END_POINT.refreshToken.method)
    .distinctUntilChanged()
    .retry(3)
    .switchMap(({response}) => {
      // status+ (data[] or message)
      // console.log('response*****',response);
      // return Observable.of(refreshAccessTokenFail());
      if(response.status !== 200){
        return Observable.of(refreshAccessTokenFail());
        
      }
      const { accessToken, expiresIn, refreshToken } = response.data;
      const expires = Math.round(Date.now()/1000) + expiresIn;
      return Observable.of(setAccessToken(accessToken, expires, refreshToken));
    })
    .catch((error) =>
      {
        console.log(error);
        return Observable.of(refreshAccessTokenFail('Sorry, something went wrong. Please try again later.'));
      }
    );
  });

const refreshTokenEpic = (action$) =>
action$.ofType(REFRESH_ACCESS_TOKEN)
.takeUntil(action$.ofType(REFRESH_ACCESS_TOKEN_FAIL))
.mergeMap(action => 
  Observable.of(action.payload.callback)
    .startWith(fetchRefreshToken()));

const userInfoEpic = (action$, store, { tokenMiddleWare, ternantMiddleWare }) =>
action$.ofType(FETCH_USER_INFO)
.delay(1000)
.mergeMap(action => tokenMiddleWare(action))
.mergeMap(action => ternantMiddleWare(action))
.switchMap(action => {
    if(!action.payload.token || !action.payload.ternant){
      return Observable.of(fetchUserInfoFail());
    }

      
    return ajaxAdapter(END_POINT.userInfo.url(action.payload.ternant),END_POINT.userInfo.method, action.payload)
    .retry(3)
    .switchMap(({response}) => {      
      if(response.status === 600  || response.status === 605){
        return Observable.of(logOut());
        
      }
      if(response.status !== 200){
        return Observable.of(fetchUserInfoFail({error: response.message}));
        
      }
      if((response.data && response.data.customerInfo && !response.data.userInfo) || !hasKnowledgePermission(KnowledgePermissions.AAC_MANAGE_ARTICLES, response.data.userInfo)){
        return Observable.of(fetchUserInfoFail('Sorry, but you do not have access to the management console. Please contact your administrator for more information.'));
      }
      const { userInfo } = response.data;
      return Observable.concat(
        Observable.of(fetchUserInfoSuccess(userInfo)),
        Observable.of(ternantChanged(action.payload.ternant)),
        Observable.of(fetchMetaData()),
        Observable.of(getTernantsByEmail(userInfo.emailAddress, TYPE_AUTHORIZED))
      );
    })
    .catch((error) =>{
      console.log('error:', error);
      if(error.status === 401){
        const callback = Object.assign({},action);
          return Observable.of(refreshAccessToken(callback));
      }
      return Observable.of(fetchUserInfoFail('Sorry, something went wrong. Please try again later.'));
    });
});

const metaDataEpic = (action$, store, { ternantMiddleWare }) =>
action$.ofType(FETCH_META_DATA)
.delay(1000)
.distinctUntilChanged()
.mergeMap(action => ternantMiddleWare(action))
.switchMap(action => {
    if( !action.payload.ternant){
      return Observable.of(fetchMetaDataFail());
    }
    return ajaxAdapter(END_POINT.getMetaData.url(action.payload.ternant),END_POINT.getMetaData.method, action.payload)
    .retry(3)
    .mergeMap(({response}) => {

      if(response.status === 600 || response.status === 605){
        return Observable.of(logOut());
      }

      if(response.status !== 200){
        return Observable.of(fetchMetaDataFail({error: response.message}));
        
      }
      const { metadata } = response.data;
      return Observable.of(fetchMetaDataSuccess(metadata));
    })
    .catch((error) =>{
      if(error.status === 401){
        // return Observable.of(fetchUserInfoFail(null));
        const callback = Object.assign({},action);
        return Observable.of(refreshAccessToken(callback));
      }
      return Observable.of(fetchMetaDataFail('Sorry, something went wrong. Please try again later.'));
    });
});

const switchDomainEpic = (action$, store, { ternantMiddleWare, ternantTokenMiddleWare }) =>
action$.ofType(SWITCH_DOMAIN)
.distinctUntilChanged()
.mergeMap(action => ternantMiddleWare(action))
.mergeMap(action => ternantTokenMiddleWare(action))
.switchMap(action => {
    if( action.payload.token){
      return Observable.concat(
        Observable.of(ternantChanged(action.payload.domain)),
        Observable.of(setAccessToken(action.payload.token, action.payload.expires, action.payload.refreshToken)),
        Observable.of(fetchMetaData()),
        Observable.of(fetchArticleServices()),
        Observable.of(switchDomainSuccess())
      );
    }
    else if (action.payload.switchToken) {
      action.payload.token = action.payload.switchToken;
      return ajaxAdapter(END_POINT.getSSOToken.url(action.payload.ternant, action.payload.domain),END_POINT.getSSOToken.method, action.payload)
      .retry(3)
      .mergeMap(({response}) => {
        if(response.status !== 200){
          return Observable.of(switchDomainFail());
        }
        const { ssoToken } = response.data;
        return Observable.of(switchDomainRedirect(ssoToken, action.payload.domain));
      })
      .catch((error) =>Observable.of(switchDomainFail()));
    }
    
      return Observable.of(switchDomainFail());  
    
});


const switchDomainRedirectEpic = (action$, store) =>
action$.ofType(SWITCH_DOMAIN_REDIRECT)
.distinctUntilChanged()
.switchMap(action => {
    if (action.payload.ssoToken) {
      action.payload.token = action.payload.switchToken;
      return ajaxAdapter(END_POINT.switchDomainWithSSOToken.url(action.payload.domain, action.payload.ssoToken),END_POINT.switchDomainWithSSOToken.method, action.payload)
      .retry(3)
      .mergeMap(({response}) => {
        console.log('switchDomainRedirectEpic response: ', response);
      })
      .catch((error) =>Observable.of(switchDomainFail()));
    }
    
      return Observable.of(switchDomainFail());  
    
}); 





export default [loginUserEpic, getTernantsByEmailEpic, userInfoEpic, refreshTokenEpic, fetchRefreshTokenEpic, metaDataEpic, switchDomainEpic, switchDomainRedirectEpic] ;
