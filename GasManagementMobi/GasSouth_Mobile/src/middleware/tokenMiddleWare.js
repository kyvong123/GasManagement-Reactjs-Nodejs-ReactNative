import { Observable } from 'rxjs';
import {getToken, isTokenExpired} from '../helper/auth';

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