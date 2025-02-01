import { createActions } from 'redux-actions';
import {
    CHANGE_LANGUAGE
} from '../types';

export const {
    changeLanguage
} = createActions({
    // Cuong them vao
    [CHANGE_LANGUAGE]: (languageCode) => ({ languageCode })
})
