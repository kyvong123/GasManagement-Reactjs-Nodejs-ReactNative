/**
 * orderGSHistory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    customer: {
      model: "user",
    },
    status: {
      type: "boolean",
      defaultsTo: false,
    },
    note: {
      type: "string",
    },
    fromDate: {
      type: "string",
      columnType: "datetime",
      required: true,
    },
    cylinderType: {
      type: "string",
      isIn: ["BINH", "VO"],
      defaultsTo: "BINH",
    },
    toDate: {
      type: "string",
      columnType: "datetime",
      required: true,
    },
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
    priceDetail: {
      collection: "TypeCylinderPriceDetail",
      via: "typePriceId",
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
