/**
 * OrderGas.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    customerCode: {
      type: "string",
      unique: true,
    },

    customerId: {
      model: "customer",
    },

    monthPlan: {
      type: "number",
    },
    yearPlan: {
      type: "number",
    },

    note: {
      type: "string",
    },

    quantity: {
      type: "number",
    },

    // ---
    isDeleted: {
      type: "boolean",
      defaultsTo: false,
    },

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
    },

    deletedAt: {
      type: "string",
      columnType: "datetime",
    },
  },
};
