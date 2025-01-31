import { handleActions } from 'redux-actions';
import {  LOG_OUT } from '../types';

const INITIAL_STATE ={
    username: '',
    password: '',
    isLoading: false,
    error: ''
};

const app = handleActions({[LOG_OUT]: () => INITIAL_STATE
}, INITIAL_STATE);

export { app as default };