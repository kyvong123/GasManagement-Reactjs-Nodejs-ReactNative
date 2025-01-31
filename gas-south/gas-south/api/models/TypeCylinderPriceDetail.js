/**
 * OrderDetail.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    typePriceId: {
      model: "TypeCylinderPrice",
      required: true,
    },
    customer: {
      model: "user",
    },
    cylinderType: {
      type: "string",
      isIn: ["BINH", "VO"],
      defaultsTo: "BINH",
    },
    manufacture: {
      model: "manufacture",
      required: true,
    },
    categoryCylinder: {
      model: "categorycylinder",
      required: true,
    },
    price: {
      type: "number",
      defaultsTo: 0,
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
    isDeleted: {
      type: "boolean",
      defaultsTo: false,
    },
    deletedBy: {
      model: "user",
    },

    deletedAt: {
      type: "string",
      columnType: "datetime",
    },
  },
};
