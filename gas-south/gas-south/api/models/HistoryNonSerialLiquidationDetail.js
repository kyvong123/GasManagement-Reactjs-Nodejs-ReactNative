/**
 * HistoryNonSerialLiquidationDetail.js
 * Chi tiết thông tin, số lượng bình trong lịch sử thanh lý các bình không có/ không đọc được serial
 * 
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //---Lịch sử thanh lý---//
    objectId: {
      model: 'user',
    },

    type: {
      type: 'string',
      isIn: ['EXPORT', 'TURN_BACK', 'IMPORT', 'SALE', 'GIVE_BACK', 'LIQUIDATE'],
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
        'SALE', 'CANCEL', 'LIQUIDATE']
    },

    flowDescription: {
      type: 'string',
      isIn: [
        'CREATE', 'DECLARE', 'SELL', 'BUY', 'OWN', 'RENT', 'ROTATION',
        'TO_FIX', 'FIXED', 'CANCEL', 'TURN_BACK', 'RETURN', 'BY_SYSTEM',
        'CHANGE_WAREHOUSE', 'TURNBACK_TO_WAREHOUSE',
        'IMPORT_EMPTY_NIS', 'EXPORT_EMPTY_NIS',
        'IMPORT_FULL_NIS', 'EXPORT_FULL_NIS',
        'REFILL',
        'AUTO_PRINT',
        'LIQUIDATE',
      ]
    },

    //---Thông tin bình thanh lý---//
    // // id thương hiệu
    // manufacture: {
    //   model: 'manufacture',
    // },

    // // tên thương hiệu
    // manufactureName: {
    //   type: 'string',
    // },
    // số văn bản thanh lý
    numberContract: {
      type: 'string',
      unique: true,
      required: true
    },


    // id loại bình
    cylinderType: {
      model: 'categorycylinder',
    },

    // tên loại bình
    cylinderTypeName: {
      type: 'string',
    },

    // số lượng bình
    quantity: {
      type: 'number',
    },

    // Add a reference to HistoryNonSerialLiquidationHeader
    header: {
      model: 'historynonserialliquidationheader',
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

