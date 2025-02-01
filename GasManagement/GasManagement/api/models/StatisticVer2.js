/**
 * StatisticVer2.js
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

    importNewCylinder: {
      type: "json",
      // jsonObject: {
      //     from: 'userId',
      //     quantity: 'number'
      // },
    },

    importOldCylinder: {
      type: "json",
      // jsonObject: {
      //     from: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê số vỏ hồi lưu: STATISTIC - TURNBACK_CYLINDER
    // Tương đương với bản cũ:
    // - turnback: Tìm bản ghi hồi lưu
    turnbackCylinder: {
      // type: 'number',
      // defaultsTo: 0,
      type: "json",
      // jsonObject: {
      //     from: 'userId',
      //     quantity: 'number'
      // },
    },

    // // Thống kê số bình hồi lưu từ khách (hộ gia đình): STATISTIC - TURN_BACK_FROM_CUSTOMER
    // turnbackCylinderFromCustomer: {
    //     type: 'json',
    //     // jsonObject: {
    //     //     // Hiện tại khách là hộ gia đình không lưu thông tin
    //     //     // nên gộp chung và để mặc định là "CUSTOMER_1"
    //     //     from: 'customerId',
    //     //     quantity: 'number'
    //     // },
    // },

    // Thống kê hồi lưu bình đầy: STATISTIC - RETURN_FULL_CYLINDER
    // Tương đương với bản cũ:
    // - returnFullCylinder
    returnFullCylinder: {
      type: "json",
      // jsonObject: {
      //     from: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê số vỏ thu hồi về sơn sửa: STATISTIC - RECOVERED_FOR_REPAIR
    // Hỗ trợ ghi lại thông tin nhập bình để sơn sửa (tương ứng với RETURN_FOR_REPAIR)
    // Số lượng các bình đã khai báo rồi, thu hồi về sơn sửa/khai báo lại
    recoveredForRepair: {
      type: "json",
      // jsonObject: {
      //     from: 'userId',
      //     quantity: 'number'
      // },
    },

    /* ---- Xuất vỏ ---- */
    // Thống kê số vỏ trả lại từ khách hàng: STATISTIC - GIVE_BACK_CYLINDER
    // [1] Tìm những bình đang ở người dân
    giveBackCylinder: {
      type: "json",
      // jsonObject: {
      //     to: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê số vỏ trả lại từ nơi khác: STATISTIC - TRANSITION_CYLINDER
    // [2] Còn lại là những bình đang ở nơi khác
    // + Trường hợp là Khách hàng thì hồi lưu về
    transitionCylinder: {
      type: "json",
      // jsonObject: {
      //     to: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê số vỏ trả lại từ nơi khác: STATISTIC - BRINGING_IN_CYLINDER
    // [3] Còn lại là những bình đang ở nơi khác
    // + Trường hợp còn lại: trạm, nhà máy
    bringingInCylinder: {
      type: "json",
      // jsonObject: {
      //     to: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê số vỏ đã xuất: STATISTIC - EXPORT_EMPTY_CYLINDER
    // Tương đương với bản cũ:
    // - exportShellToFixer: Tìm bản ghi xuất vỏ tới Chi nhánh Bình Khí
    // - exportShellToElsewhere: Tìm bản ghi xuất vỏ tới nơi khác
    exportEmptyCylinder: {
      type: "json",
      // jsonObject: {
      //     to: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê cho nhà máy sửa chữa: vỏ mới, vỏ sửa chữa
    // Thống kê số vỏ đã xuất: STATISTIC - EXPORT_EMPTY_CYLINDER_CONDITION
    // - [1]: Số vỏ mới
    exportEmptyNewCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    // - [2]: Số vỏ cũ
    exportEmptyOldCylinder: {
      type: "number",
      defaultsTo: 0,
    },

    // Thống kê số vỏ trả lại từ khách hàng: STATISTIC - GIVE_BACK_CYLINDER
    // Hỗ trợ ghi đúng dữ liệu cho thao tác hồi lưu bình đầy (RETURN_FULL_CYLINDER)
    // Số liệu nơi trả bình (khách hàng) sẽ thay đổi tương ứng
    giveBackFullCylinder: {
      type: "json",
      // jsonObject: {
      //     to: 'userId',
      //     quantity: 'number'
      // },
    },

    // Thống kê số vỏ trả lại để sơn sửa: STATISTIC - RETURN_FOR_REPAIR
    // Hỗ trợ ghi lại thông tin trả bình để sơn sửa
    // Số lượng các bình đã khai báo rồi, trả về sơn sửa/khai báo lại
    returnForRepair: {
      type: "json",
      // jsonObject: {
      //     to: 'userId',
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

    // // Thống kê số bình xuất kho: STATISTIC - GOODS_ISSUE
    // goodsIssue: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // // Thống kê số bình nhập kho: STATISTIC - GOODS_RECEIPT
    // goodsReceipt: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // /* 01. Kho Vỏ */
    // // // Thống kê số bình đã tạo: STATISTIC - CREATE
    // // createdCylinder: {
    // //     type: 'number',
    // //     defaultsTo: 0,
    // // },

    // // Thống kê số bình hồi lưu từ xe: STATISTIC - TURN_BACK_FROM_TRUCK
    // turnbackCylinderFromTruck: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // /* 02. Kho Thành Phẩm */
    // // Thống kê số bình đã nạp gas: STATISTIC - REFILL
    // refillCylinder: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // // Thống kê số bình đã bán (xuất hàng): STATISTIC - SALE
    // saleCylinder: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // /* 03. Kho Xe */
    // // Thống kê số bình hồi lưu từ khách về xe: STATISTIC - TURN_BACK_FROM_CUSTOMER
    // turnbackCylinderFromCustomer: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // // Thống kê số bình đã xuất (xuất hàng từ xe cho khách): STATISTIC - EXPORT_FROM_TRUCK
    // exportCylinderFromTruck: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // /* 04. Khách hàng: Đại lý, Cửa hàng bán lẻ,... */
    // // Thống kê số bình nhập kho: STATISTIC - GOODS_RECEIPT
    // // goodsReceipt: {
    // //   type: 'number',
    // //   defaultsTo: 0,
    // // },

    // // Thống kê số bình hồi lưu từ khách hàng về kho xe: STATISTIC - RETURN_FROM_CUSTOMER_TO_TRUCK
    // returnFromCustomerToTruck: {
    //     type: 'number',
    //     defaultsTo: 0,
    // },

    // --- --- THÔNG TIN CHUNG --- --- //

    //dành cho kho xe

    isTruck: {
      type: "boolean",
      defaultsTo: false,
    },
    //nếu xuất nhập từ kho xe thì isTruck=true
    truckId: {
      model: "user",
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
      autoUpdatedAt: true,
    },

    deletedAt: {
      type: "string",
      columnType: "datetime",
    },
  },
};
