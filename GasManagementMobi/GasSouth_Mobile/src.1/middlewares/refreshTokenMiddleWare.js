import {Observable } from 'rxjs/Observable';
import {getRefreshToken} from '../helpers/Auth';

export const refreshTokenMiddleWare = action => Observable
            .fromPromise(getRefreshToken())
            .map(refreshToken => {
                if(refreshToken){
                    action.payload.refreshToken  = refreshToken;
                }
                return action;
            });