import { handleActions } from 'redux-actions';
import { CHANGE_LANGUAGE } from '../types';

const INITIAL_STATE = {
    languageCode: ""
};

const language = handleActions({
    [CHANGE_LANGUAGE]: (state, action) => {
        // console.log("change_language",action);
        return {
            ...state,
            ...action.payload
        }
    }
}, INITIAL_STATE);

export { language as default };