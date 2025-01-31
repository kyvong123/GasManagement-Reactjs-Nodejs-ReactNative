/**
 * OrderGS.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    orderCode: {
      type: "string",
      required: true,
      unique: true,
    },

    orderDetail: {
      collection: "orderdetail",
      via: "orderGSId",
    },
    delivery: {
      collection: "shippinggs",
      via: "orderID",
    },
    status: {
      type: "string",
      isIn: [
        "DON_HANG_MOI",
        "TO_NHAN_LENH_DA_DUYET",
        "TU_CHOI_LAN_1",
        "TU_CHOI_LAN_2",
        "GUI_DUYET_LAI",
        "DANG_DUYET",
        "DA_DUYET",
        "DDTRAM_DUYET",
        "DDTRAMGUI_XACNHAN",
        "DANG_GIAO",
        "DA_HOAN_THANH",
        "KHONG_DUYET",
        "DA_HUY",
        "TNLGUI_XACNHAN",
      ],
      defaultsTo: "DON_HANG_MOI",
    },
    status2: {
      //dung cho KH
      type: "string",
      isIn: [
        "DON_HANG_MOI",
        "TU_CHOI_LAN_1",
        "TU_CHOI_LAN_2",
        "GUI_DUYET_LAI",
        "DANG_DUYET",
        "DA_DUYET",
        "DANG_GIAO",
        "DA_HOAN_THANH",
        "KHONG_DUYET",
        "DDTRAM_DUYET",
        "DDTRAMGUI_XACNHAN",
        "DA_HUY",
        "TNLGUI_XACNHAN",
      ],
      defaultsTo: "DON_HANG_MOI",
    },
    firstQuantity: {
      type: "number",
      defaultsTo: 0,
    },
    // ngày hoàn thành đơn hàng
    dateDone: {
      type: "string",
      columnType: "datetime",
      defaultsTo: "",
    },

    supplier: {
      model: "user",
      // required: true,
    },
    area: {
      model: "area",
      required: true,
    },
    customerType: {
      type: "string",
      defaultsTo: "KHONG",
    },
    customerName: {
      type: "string",
    },
    customers: {
      model: "user",
      required: true,
    },

    // Nhóm khách hàng để tính ga dư
    group: {
      model: "customergroups",
    },

    groupName: {
      type: "string",
    },

    threshold: {
      type: "number",
    },

    // Xác định nơi nhận hàng: tại trạm hoặc tại địa chỉ khách hàng
    placeOfDelivery: {
      type: "string",
      isIn: ["STATION", "CUSTOMER"],
      defaultsTo: "CUSTOMER",
    },

    orderType: {
      type: "string",
      isIn: ["KHONG", "COC_VO", "MUON_VO"],
      defaultsTo: "KHONG",
    },

    note: {
      type: "string",
    },
    noteSup: {
      type: "string",
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
    createdBy: {
      model: "user",
    },

    updatedBy: {
      model: "user",
    },
    reasonForCancellatic: {
      model: "cancelhistory",
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
