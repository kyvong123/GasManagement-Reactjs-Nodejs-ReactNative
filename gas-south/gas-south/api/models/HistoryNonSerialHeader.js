/**
 * HistoryNonSerialHeader.js
 * Lịch sử xuất nhập các bình không có/ không đọc được serial
 * 
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //---Lịch sử xuất nhập---//
    from: {
      model: 'user',
    },

    to: {
      model: 'user',
    },

    quantity: {
      type: 'number',
    },

    driverName: {
      type: 'string',
    },

    driverId: {
      model: 'user',
    },

    vehicleLicensePlate: {
      type: 'string',
    },

    vehicleId: {
      model: 'truck',
    },

    type: {
      type: 'string',
      isIn: ['EXPORT', 'TURN_BACK', 'IMPORT', 'SALE', 'GIVE_BACK'],
    },

    typeImex: {
      type: 'string',
      isIn: ['IN', 'OUT']
    },

    flow: {
      type: 'string',
      isIn: ['CREATE', 'EXPORT', 'IMPORT',
        'EXPORT_CELL', 'IMPORT_CELL',
        'GIVE_BACK', 'TURN_BACK',
        'TRANSITION', 'RETURN',
        'SALE', 'CANCEL']
    },

    flowDescription: {
      type: 'string',
      isIn: [
        'CREATE', 'DECLARE', 'SELL', 'BUY', 'OWN', 'RENT', 'ROTATION',
        'TO_FIX', 'FIXED', 'CANCEL', 'TURN_BACK', 'RETURN', 'BY_SYSTEM',
        'CHANGE_WAREHOUSE', 'TURNBACK_TO_WAREHOUSE',
        'IMPORT_EMPTY_NIS', 'EXPORT_EMPTY_NIS', 'EXPORT_EMPTY_NIS_TO_REPAIR', 'EXPORT_EMPTY_NIS_OTHER',
        'IMPORT_FULL_NIS', 'EXPORT_FULL_NIS', 'IMPORT_EMPTY_NIS_TO_REPAIR', 'IMPORT_EMPTY_NIS_OTHER',
        'REFILL',
        'AUTO_PRINT',
      ]
    },

    //---Thông tin bình xuất nhập---//
    // // id thương hiệu
    // manufacture: {
    //   model: 'manufacture'
    // },

    // // tên thương hiệu
    // manufactureName: {
    //   type: 'string'
    // },

    // // id loại bình
    // cylinderType: {
    //   model: 'cylindertype'
    // },

    // // tên loại bình
    // cylinderTypeName: {
    //   type: 'string'
    // },

    // // số lượng bình
    // number: {
    //   type: 'number'
    // },

    // Add a reference to HistoryNonSerialDetail
    details: {
      collection: 'historynonserialdetail',
      via: 'header'
    },

    // --- --- ---
    createdBy: {
      model: 'user',
    },

    updatedBy: {
      model: 'user',
    },

    deletedBy: {
      model: 'user',
    },

    createdAt: {
      type: 'string',
      columnType: 'datetime',
      autoCreatedAt: true,
    },

    updatedAt: {
      type: 'string',
      columnType: 'datetime',
    },

    deletedAt: {
      type: 'string',
      columnType: 'datetime',
    },

  },

};

