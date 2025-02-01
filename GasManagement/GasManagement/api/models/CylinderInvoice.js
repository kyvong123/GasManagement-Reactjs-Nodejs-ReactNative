/**
 * CylinderInvoice.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    serial: {
      type: 'string',
      required: true
    },

    phone: {
      type: 'string',
      required: true
    },
    customerID: {
      model: 'customer',
      required: true
    },
    customerName: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
    valve: {
      type: 'string',
    },
    typeCylinder: {
      type: 'string',
    },
    productionDate: {
      type: 'string',
      allowNull: true
    },
    productionName: {
      type: 'string',
      allowNull: true
    },
    saler: {
      type: 'string',
    },
    driver: {
      type: 'string',
      allowNull: true
    },
    driverPhone: {
      type: 'string',
      allowNull: true
    },
    customConfirm: {
      type: 'boolean',
      defaultsTo: false,
    },
    // ---
    isDeleted: {
      type: 'boolean',
      defaultsTo: false,
    },

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

