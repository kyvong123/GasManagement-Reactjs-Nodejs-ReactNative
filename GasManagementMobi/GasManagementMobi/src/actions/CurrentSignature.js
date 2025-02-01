import { createAction } from 'redux-actions';
import { CURRENT_SIGNATURE, DELETE_SIGNATURE, IS_DISABLE_SIGNATURE } from '../types';

const storeSignatureAction = createAction(CURRENT_SIGNATURE, base64 => base64)
const deleteSignatureAction = createAction(DELETE_SIGNATURE, data => data);
const setShowOverlayDisableSignatureAction = createAction(IS_DISABLE_SIGNATURE, _bool => _bool);

export { storeSignatureAction, deleteSignatureAction, setShowOverlayDisableSignatureAction }