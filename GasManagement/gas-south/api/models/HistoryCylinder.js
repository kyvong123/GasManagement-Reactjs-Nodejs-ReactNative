/**
 * CloneCylinder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const orderGSHistory = require("./orderGSHistory");

module.exports = {
  attributes: {

    /* <===== BÌNH ====> */
    // Id bình
    cylinder: {
      model: "cylinder",
    },

    // Mã bình
    serial: {
      type: "string",
    },

    // Cân nặng vỏ bình
    cylinderWeight: {
      type: "number",
    },

    // Hạn kiểm định
    cylinderCheckedDate: {
      type: 'string',
      columnType: 'datetime'
    },

    /* <===== LOẠI BÌNH ====> */
    // Id loại bình
    category: {
      model: "categorycylinder",
    },

    // Tên loại bình
    name: {
      type: "string",
    },

    // Loại van
    valve: {
      // model: "valve",
      type: "string",
    },

    // Màu sắc
    color: {
      // model: "colorgas",
      type: "string",
    },

    // Khối lượng loại bình
    mass: {
      type: "number",
    },

    // Id thương hiệu của bình
    manufacture: {
      model: "manufacture",
    },

    // Tên thương hiệu của bình
    manufactureName: {
      type: "string",
    },

    /* <===== THÔNG TIN KHÁC====> */

    status: {
      type: "string",
      isIn: ["BINH", "VO", "BINH_DAY"],
      defaultsTo: "BINH",
    },
    isShip: {
      type: "boolean",
      defaultsTo: true,
    },
    isShipOf: {
      model: "ordergshistory",
    },
    
    isReturn: {
      type: "boolean",
      defaultsTo: false,
    },
    acpReturn: {
      model: "user",
    },
    reasonReturn: {
      model: "reason",
    },
    reasonReturnStationchief: {
      model: "reason",
    },
    noteStationchief1: {
      // model: "valve",
      type: "string",
    },
    noteStationchief2: {
      // model: "valve",
      type: "string",
    },

    createdStationchiefBy: {
      model: "user",
    },
    createdStationchiefAt: {
      type: "string",
      columnType: "datetime",
      // autoCreatedAt: true,
    },
    
    amount: {
      type: "number",
    },
    orderID: {
      model: "ordergs",
    },
    
    isGasSouth: {
      type: "boolean",
      defaultsTo: true,
    },
    
    // Cân nặng bình khi hồi lưu
    weight: {
      type: "number",
    },

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
