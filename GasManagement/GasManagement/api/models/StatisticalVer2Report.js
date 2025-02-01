/**
 * StatisticVer2Report.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    // --- --- THỜI GIAN THỐNG KÊ --- --- //
    startDate: {
      type: "string",
      columnType: "datetime",
    },

    endDate: {
      type: "string",
      columnType: "datetime",
    },

    // --- --- THÔNG TIN ĐỐI TƯỢNG --- --- //
    objectId: {
      model: "user",
    },

    // relatedObjectId: {
    //     model: 'user',
    // },

    // --- --- THÔNG TIN BÌNH --- --- //
    // Loại bình
    cylinderTypeId: {
      model: "categorycylinder",
    },

    // Thương hiệu bình //
    manufactureId: {
      model: "manufacture",
    },

    // --- --- THÔNG TIN THỐNG KÊ --- --- //

    // Thống kê số bình xuất khỏi đơn vị (kho/trạm/nhà máy/đại lý/...): STATISTIC - GOODS_ISSUE
    goodsIssue: {
      type: "number",
      defaultsTo: 0,
    },

    // Thống kê số bình nhập vào đơn vị (kho/trạm/nhà máy/đại lý/...): STATISTIC - GOODS_RECEIPT
    goodsReceipt: {
      type: "number",
      defaultsTo: 0,
    },

    // Thống kê số bình tồn kho: STATISTIC - INVENTORY
    inventoryCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    // Thống kê cho nhà máy sửa chữa: Bình mới, bình sửa chữa
    // Thống kê số vỏ tồn kho: STATISTIC - INVENTORY_CONDITION
    // - [1]: Số vỏ mới tồn mới
    inventoryNewCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    // - [2]: Số vỏ cũ tồn
    inventoryOldCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    // Thống kê số bình đã tạo: STATISTIC - CREATE
    createdCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    // Thống kê cho nhà máy sửa chữa: Bình mới, bình sửa chữa
    // Thống kê số bình đã tạo: STATISTIC - CREATE_CONDITION
    // - [1]: Số bình khai báo mới
    createdNewCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    // - [2]: Số bình sơn sửa, khai báo lại
    createdOldCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    /* ---- Nhập vỏ ---- */
    // Thống kê số vỏ nhập về: STATISTIC - IMPORT_CYLINDER
    // Tương đương với bản cũ:
    // - importShellFromFixer: Tìm bản ghi nhập vỏ từ Chi nhánh Bình Khí
    // - importShellFromElsewhere: Tìm bản ghi nhập vỏ từ nơi khác
    importCylinder: {
      type: "json",
      // jsonObject: {
      //     from: 'userId',
      //     quantity: 'number'
      // },
    },

    /* ---- Xuất bình ---- */
    // Thống kê số bình (hàng) đã xuất: STATISTIC - EXPORT_CYLINDER
    // Sau khi (bên A) Import, ghi lại số lượng xuất hàng (từ bên B) có đủ thông tin (xuất từ B đến A).
    exportCylinder: {
      type: "json",
      // jsonObject: {
      //     to: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê số bình (hàng) đã xuất: STATISTIC - NUMBER_EXPORT
    // Ghi lại số lượng xuất hàng ra khỏi kho (bên B), không cần đợi (bên A) nhập hàng,
    // vì thế không có đủ thông tin (từ đâu đến đâu), nên chỉ ghi lại số lượng xuất ra.
    // Tương đương với bản cũ:
    // - numberExport: Số lượng xuất hàng trong khoảng thời gian
    numberExport: {
      type: "number",
      defaultsTo: 0,
    },

    // --- --- THÔNG TIN CHUNG --- --- //
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
