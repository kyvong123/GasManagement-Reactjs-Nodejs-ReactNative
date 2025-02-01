/**
 * FeedBack.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    nameDriver: {
      type: "string",
    },
    idDriver: {
      type: "string",
    },
    fixType: {
      type: "string",
      isIn: ["BINH", "VO", "BINH_DAY"],
      defaultsTo: "BINH",
    },
    isDone: {
      type: "boolean",
      defaultsTo: false,
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
    createdBy: {
      model: "user",
    },
    updatedBy: {
      model: "user",
    },
    isDeleted: {
      type: "boolean",
      defaultsTo: false,
    },
    deletedBy: {
      model: "user",
    },
  },
};
