/**
 * ShippingGS.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    orderID: {
      model: "ordergs",
    },

    deliveryAddress: {
      type: "string",
      required: true,
    },

    // Xác định nơi nhận hàng: tại trạm hoặc tại địa chỉ khách hàng
    placeOfDelivery: {
      type: "string",
      isIn: ["STATION", "CUSTOMER"],
      defaultsTo: "CUSTOMER",
    },

    deliveryDate: {
      type: "string",
      columnType: "datetime",
      required: true,
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
