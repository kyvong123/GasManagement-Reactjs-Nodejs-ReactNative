/**
 * Valve.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
    },

    code: {
      type: "string",
      required: true,
    },

    // Add a reference to oderGasDetail
    // valve: {
    //   collection: ["odergasdetail", "ordergas"],
    //   via: "valve",
    // },

    isDeleted: {
      type: "boolean",
      defaultsTo: false,
    },

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
      autoUpdatedAt: true,
    },

    deletedAt: {
      type: "string",
      columnType: "datetime",
    },
  },
};
