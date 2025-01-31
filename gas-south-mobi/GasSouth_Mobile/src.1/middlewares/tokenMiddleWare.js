import {Observable } from 'rxjs/Observable';
import {getToken, isTokenExpired} from '../helpers/Auth';
import {ajaxAdapter} from '../helpers/Utils';
import {END_POINT} from '../constants';

export const tokenMiddleWare = action => Observable
            // .fromPromise(isTokenExpired())
            // .map(result => {
            //     console.log(result);
            //     if(!result){
            //         const token = getToken();
            //         console.log(token);
            //     }
            //     return action;
            // });
            .fromPromise(getToken())
            .map(token => {
                if(token){
                    action.payload.token  = token;
                }
                return action;
            });
            
// const refreshToken(ternant) = ajaxAdapter(END_POINT.refreshToken.url(ternant, action.payload.refreshToken),END_POINT.refreshToken.method)
// .retry(3)
// .switchMap(({response}) => {
//   // status+ (data[] or message)
//   console.log('refreshTokenEpic',response);
//   if(response.status !== 200){
//     return Observable.of(refreshAccessTokenFail());
    
//   }
//   const { accessToken, expiresIn, refreshToken } = response.data;
//   const expires = Math.round(Date.now()/1000) + expiresIn;
//   return Observable.concat(
//     Observable.of(setAccessToken(accessToken, expires, refreshToken)),
//     Observable.of(action.payload.callback).delay(1000)
//   );
// })
// .catch((error) =>
//   {
//     console.log(error);
//     return Observable.of(refreshAccessTokenFail('Sorry, something went wrong. Please try again later.'));
//   }
// );