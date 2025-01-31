/**
 * CylinderUpdateHistory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    cylinder: {
      model: 'cylinder',
    },

    type: {
      type: 'string',
      isIn: ['CREATE', 'REPRINT_THE_IDENTIFIER', 'PAINT_CURING', 'UNKNOW'],
      defaultsTo: 'UNKNOW'
    },

    // Thương hiệu
    manufacture: {
      model: 'manufacture',
    },

    manufactureName: {
      type: 'string',
    },

    // Trọng lượng
    weight: {
      type: 'number'
    },

    // Màu sắc
    color: {
      type: 'string',
      defaultsTo: 'Grey'
    },

    // Loại van
    valve: {
      type: 'string'
    },

    createdByName: {
      type: 'string',
    },

    // ---
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
      autoCreatedAt: true,
    },

    deletedAt: {
      type: 'string',
      columnType: 'datetime',
    },

  },

};

