import { handleActions } from 'redux-actions';
import { TEST123 } from '../types';

const INITIAL_STATE = {
    info: { email: '', name: '', age: 0 }
};

const people = handleActions({

    [TEST123]: (state, action) => {
        // console.log('TEST_REDUER: ', action.payload)
        return {
            ...state,
            info: { ...action.payload }
        }
    },
}, INITIAL_STATE);

export default people;