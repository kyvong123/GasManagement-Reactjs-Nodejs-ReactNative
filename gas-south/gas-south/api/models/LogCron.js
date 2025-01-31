/**
 * LogCron.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type: {
      type: 'string',
      isIn: ['SCHEDULE', 'EXPORT_EXCEL', 'RESET_ORDER_CODE_MONTHLY'],
      defaultsTo: 'SCHEDULE'
    },

    note: {
      type: 'string',
    },

    status: {
      type: 'string',
      isIn: ['ERROR', 'ERROR_WRITE_FILE', 'ERROR_CRON'],
      defaultsTo: 'ERROR'
    },

    error: {
      type: 'string'
    },

    error_message: {
      type: 'string'
    },

    //      

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
    },

    deletedAt: {
      type: 'string',
      columnType: 'datetime',
    },
  },

};

