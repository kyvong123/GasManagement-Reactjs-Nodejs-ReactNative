import {Observable } from 'rxjs/Observable';
import {getTernant} from '../helpers/Auth';

export const ternantMiddleWare = action => Observable
.fromPromise(getTernant())
.map(ternant => {
    if(ternant){
        action.payload.ternant  =ternant;
    }
    return action;
});