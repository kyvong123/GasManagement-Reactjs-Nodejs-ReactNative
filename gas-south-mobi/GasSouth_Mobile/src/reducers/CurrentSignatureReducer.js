import { handleActions } from 'redux-actions';
import { CURRENT_SIGNATURE, DELETE_SIGNATURE, IS_DISABLE_SIGNATURE } from '../types';

const INITIAL_STATE = {
    SignBase64: '',
    isShowOverlayDisableSignature: false
};

const currentSignatureReducer = handleActions({

    [CURRENT_SIGNATURE]: (state, action) => {
        return {
            ...state,
            SignBase64: action.payload,
        }
    },
    [DELETE_SIGNATURE]: (state, action) => {
        return {
            ...state,
            SignBase64: '',
        }
    },
    [IS_DISABLE_SIGNATURE]: (state, { payload }) =>
    ({
        ...state,
        isShowOverlayDisableSignature: payload
    })

}, INITIAL_STATE);

export default currentSignatureReducer;