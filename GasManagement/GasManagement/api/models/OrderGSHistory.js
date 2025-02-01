/**
 * orderGSHistory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    orderID: {
      model: "ordergs",
    },
    customer: {
      model: "user",
    },

    //Id nhóm khách hàng để tính ga dư
    group: {
      model: "customergroups",
    },

    // Tên nhóm khách hàng
    groupName: {
      type: "string",
    },

    // Ngưỡng tính gas dư
    threshold: {
      type: "number",
    },
    
    supplier: {
      model: "user",
    },
    area: {
      model: "area",
    },
    userType: {
      type: "string",
    },
    deliveryAddress: {
      type: "string",
      required: true,
    },
    deliveryDate: {
      type: "string",
      columnType: "datetime",
      required: true,
    },
    driver: {
      model: "user",
    },
    driverName: {
      type: "string",
    },

    vehicle: {
      model: "user",
    },
    
    transport: {
      type: "string",
      required: true,
    },
    signature: {
      type: "string",
      //required: true
    },
    mass: {
      type: "number",
      defaultsTo: 0,
    },
    B6: {
      type: "number",
      defaultsTo: 0,
    },
    B12: {
      type: "number",
      defaultsTo: 0,
    },
    B20: {
      type: "number",
      defaultsTo: 0,
    },
    B45: {
      type: "number",
      defaultsTo: 0,
    },
    dateDone: {
      type: "string",
      columnType: "datetime",
    },
    shippingType: {
      type: "string",
      isIn: ["GIAO_HANG", "GIAO_VO", "TRA_VO", "TRA_BINH_DAY", "TRA_VO_KHAC"],
      defaultsTo: "GIAO_HANG",
    },
    cancel: {
      model: "cancelhistory",
    },
    isDeleted: {
      type: "boolean",
      defaultsTo: false,
    },
    deletedBy: {
      model: "user",
    },
    createdAt: {
      type: "string",
      columnType: "datetime",
    },
    updatedAt: {
      type: "string",
      columnType: "datetime",
    },
    createdBy: {
      model: "user",
    },

    updatedBy: {
      model: "user",
    },
    deletedAt: {
      type: "string",
      columnType: "datetime",
    },
  },
};
