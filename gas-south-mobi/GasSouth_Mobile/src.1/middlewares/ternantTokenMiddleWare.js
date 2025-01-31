
import {Observable } from 'rxjs/Observable';
import {getDomainToken} from '../helpers/Auth';


 export const ternantTokenMiddleWare = action => Observable
            .fromPromise(getDomainToken(action.payload.domain))
            .map(tokenObject => {
                if(tokenObject){
                    action.payload.token = tokenObject.token;
                    action.payload.switchToken = tokenObject.switchToken;
                    action.payload.refreshToken = tokenObject.refreshToken;
                    action.payload.expires = tokenObject.expires;
                }
                return action;
            });