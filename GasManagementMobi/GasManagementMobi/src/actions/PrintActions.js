import {createActions} from 'redux-actions';
import {
    GET_LST_CYLINDER,
    GET_LST_CYLINDER_SUCCESS,
    GET_LST_CYLINDER_FAIL
} from '../types';

export const {
    getLstCylinder,
    getLstCylinderSuccess,
    getLstCylinderFail
} = createActions({
    [GET_LST_CYLINDER]: (findCylinders) => ({findCylinders}),
    [GET_LST_CYLINDER_SUCCESS]: (list_inforCylinder) => ({list_inforCylinder}),
    [GET_LST_CYLINDER_FAIL]: (error = 'Lỗi lấy thông tin') => ({
        error
    }),
});

