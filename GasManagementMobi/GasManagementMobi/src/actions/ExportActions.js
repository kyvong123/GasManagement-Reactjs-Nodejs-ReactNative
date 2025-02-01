import {
  createActions
} from 'redux-actions';
import {
  GET_Export,
  GET_Export_SUCCESS,
  GET_Export_FAIL,
  GET_Export_CYLINDER_SUCCESS,
  GET_Import_CYLINDER_SUCCESS,
  GET_STATISTICS,
  GET_STATISTICS_RESULT,
  GET_STATISTICS_ERR
  // GSTT,
  // GSTTS,
  // GSTTF
} from '../types';

export const {
  getExport,
  getExportSuccess,
  getExportFail,
  // gstt,
  // gstts,
  // gsttf
  getExportCylinderSuccess,
  getImportCylinderSuccess,
  getStatistics,
  getStatisticsResult,
  getStatisticsError
} = createActions({
  [GET_Export]: (
    target,
    action,
    startDate,
    endDate,
    statisticalType,
    typesOfChildren,
    isAll,
    isUserTyper) => ({
      target,
      action,
      startDate,
      endDate,
      statisticalType,
      typesOfChildren,
      isAll,
      isUserTyper
    }),
  [GET_Export_SUCCESS]: (result_getExport) => ({
    result_getExport
  }),
  [GET_STATISTICS]: (statisticalType, target, startDate, endDate, typesOfChildren, manufactureId) => ({
    statisticalType, target, startDate, endDate, typesOfChildren, manufactureId
  }),
  [GET_STATISTICS_ERR]: (statisticsErr) => ({
    statisticsErr
  }),
  [GET_STATISTICS_RESULT]: (statisticsResult) => ({
    statisticsResult
  }),
  [GET_Export_FAIL]: (error) => ({
    error
  }),
  [GET_Export_CYLINDER_SUCCESS]: (result_getExport_Cylinder) => ({
    result_getExport_Cylinder
  }),
  [GET_Import_CYLINDER_SUCCESS]: (result_getImport_Cylinder) => ({
    result_getImport_Cylinder
  })
  // [GSTT]: (target_id, start_date, end_date, statisticalType) => ({
  //     target_id,
  //     start_date,
  //     end_date,
  //     statisticalType
  // }),
  // [GSTTS]: (result_gsst) => ({
  //     result_gsst
  // }),
  // [GSTTF]: (error) => ({
  //     error
  // }),
});