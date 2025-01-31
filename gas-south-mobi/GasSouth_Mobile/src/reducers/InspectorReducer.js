import { handleActions } from 'redux-actions';
import {
    SET_CHECKLIST,
    SET_CHECKLIST_SUCCESS,
    SET_CHECKLIST_FAIL,
    SET_TANK_CHECKING_RECORD,
    SET_TANK_CHECKING_RECORD_SUCCESS,
    SET_TANK_CHECKING_RECORD_FAIL,
    TAKCR,
    VALVE_FLANGE_RECORD,
    VAPO_CHK_RECORD,
    ETHSYSRECORD,
    FREFGTREC,
    MTHCHK,
    MTHCHK_SUCCESS,
    MTHCHK_FAIL,
    MTDATE,
    MTDATE_SUCCESS,
    MTDATE_FAIL,
    GETALLCHILD,
    GETALLCHILD_SUCCESS,
    GETALLCHILD_FAIL
} from '../types';

const INITIAL_STATE = {};

const inspector = handleActions({
    [SET_CHECKLIST]: (state, action) => {
        // console.log("reducer_Checklist", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_CHECKLIST_SUCCESS]: (state, action) => {
        // console.log("reducer_Checklist_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_CHECKLIST_FAIL]: (state, action) => {
        // console.log("reducer_Checklist_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_TANK_CHECKING_RECORD]: (state, action) => {
        // console.log("reducer_TankCheckingRecord", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_TANK_CHECKING_RECORD_SUCCESS]: (state, action) => {
        // console.log("reducer_TankCheckingRecord_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [SET_TANK_CHECKING_RECORD_FAIL]: (state, action) => {
        // console.log("reducer_TankCheckingRecord_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [TAKCR]: (state, action) => {
        // console.log("reducer_TAKCR", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [VALVE_FLANGE_RECORD]: (state, action) => {
        // console.log("reducer_VALVE_FLANGE_RECORD", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [VAPO_CHK_RECORD]: (state, action) => {
        // console.log("reducer_VAPORIZER_RECORD", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [ETHSYSRECORD]: (state, action) => {
        // console.log("reducer_EARTH_SYSTEM_RECORD", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [FREFGTREC]: (state, action) => {
        // console.log("reducer_FIREFIGHTING_RECORD", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [MTHCHK]: (state, action) => {
        // console.log("reducer_MthlChecklist", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [MTHCHK_SUCCESS]: (state, action) => {
        // console.log("reducer_MthlChecklist_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [MTHCHK_FAIL]: (state, action) => {
        // console.log("reducer_MthlChecklist_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [MTDATE]: (state, action) => {
        // console.log("reducer_MtnDate", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [MTDATE_SUCCESS]: (state, action) => {
        // console.log("reducer_MtnDate_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [MTDATE_FAIL]: (state, action) => {
        // console.log("reducer_MtnDate_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GETALLCHILD]: (state, action) => {
        // console.log("reducer_getAllChild", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GETALLCHILD_SUCCESS]: (state, action) => {
        // console.log("reducer_getAllChild_Success", action);
        return {
            ...state,
            ...action.payload
        }
    },
    [GETALLCHILD_FAIL]: (state, action) => {
        // console.log("reducer_getAllChild_Fail", action);
        return {
            ...state,
            ...action.payload
        }
    },
}, INITIAL_STATE);

export { inspector as default };