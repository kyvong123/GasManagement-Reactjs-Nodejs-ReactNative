/**
 * SequenceOrderCode.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    type: {
      type: "string",
      isIn: ['MV', 'CV', 'DB'],
      defaultsTo: 'DB'
    },

    number: {
      type: "number",
      defaultsTo: 1,
    },

    year: {
      type: "number",
      required: true,
    },

    month: {
      type: "number",
      required: true,
    },

    isDeleted: {
      type: "boolean",
      defaultsTo: false,
    },

    // Add a reference



    // ---
    createdBy: {
      model: "user",
    },

    updatedBy: {
      model: "user",
    },

    deletedBy: {
      model: "user",
    },

    createdAt: {
      type: "string",
      columnType: "datetime",
      autoCreatedAt: true,
    },

    updatedAt: {
      type: "string",
      columnType: "datetime",
      autoCreatedAt: true,
    },

    deletedAt: {
      type: "string",
      columnType: "datetime",
    },
  },
};
