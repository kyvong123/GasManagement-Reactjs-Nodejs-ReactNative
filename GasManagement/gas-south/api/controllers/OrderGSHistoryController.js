/**
 * OrderGSController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { retry } = require("async");
const moment = require("moment");
const { nanoid } = require("nanoid");
const { obj } = require("pumpify");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// const OrderGSConfirmationHistory = require("../models/OrderGSConfirmationHistory");
// const orderGSHistory = require("../models/orderGSHistory");
// const OrderGSController = require("./OrderGSController");
const { message } = require("prompt");
const USER_TYPE = require("../constants/UserTypes");
const USER_ROLE = require("../constants/UserRoles");

module.exports = {
  /**
   // "GET /history/getOrderGSConfirmationHistory":
   * lấy  lịch sự duyệt của đơn hàng với id đơn hàng (id)
   * "READ_DELETED", // tìm tất cả Doc đã deleted
   * "READ", // tìm tất cả Doc
   * "UPDATE", // update cho Doc
   * "DELETE", // delete doc vĩnh viễn
   * @query id: id của đơn hàng orderGSId
   * @return data theo hành động
  */
  getOrderGSConfirmationHistory: async function (req, res) {
    console.log(req.body, req.query);
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order - vui lòng nhập id order",
      });
    try {
      let order = await OrderGSConfirmationHistory.find({
        isDeleted: { "!=": true },
        // action: req.query.action,
        action: ["TU_CHOI_LAN_1", "TU_CHOI_LAN_2", "GUI_DUYET_LAI"],
        orderGSId: req.query.id,
      }).populate("updatedBy");
      if (!order || order.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Lấy đơn hàng theo mã code thành công",
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },

  getOrderGSConfirmationHistoryall: async function (req, res) {
    console.log(req.body, req.query);
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order - vui lòng nhập id order",
      });
    try {
      let order = await OrderGSConfirmationHistory.find({
        isDeleted: { "!=": true },
        // action: req.query.action,
        //action: ["TU_CHOI_LAN_1", "TU_CHOI_LAN_2", "GUI_DUYET_LAI"],
        orderGSId: req.query.id,
      }).populate("updatedBy");
      if (!order || order.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Lấy đơn hàng theo mã code thành công",
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },

  /**
   // "POST /history/orderGSConfirmationHistoryRUD":
   * RUD(read, update, delete) lịch sự duyệt của đơn hàng với hành động(action)
   * "READ_DELETED", // tìm tất cả Doc đã deleted
   * "READ", // tìm tất cả Doc
   * "UPDATE", // update cho Doc
   * "DELETE", // delete doc vĩnh viễn
   * @query action hành động của dùng
   * @return data theo hành động
   */
  orderGSConfirmationHistoryRUD: async function (req, res) {
    const action = req.query.action;
    const actionString = [
      "READ_DELETED", // tìm tất cả Doc đã deleted
      "READ", // tìm tất cả Doc
      "UPDATE", // update cho Doc
      "DELETE", // delete doc vĩnh viễn
    ];
    let orders = null;
    const id = req.query.id;
    const bodyUpdate = req.body;

    if (!action || action === "" || !actionString.includes(action)) {
      return res.json({
        success: false,
        message: `Không có Action - vui lòng nhập action: ${actionString}`,
      });
    }

    try {
      switch (action) {
        case "READ":
          orders = await OrderGSConfirmationHistory.find().populate(
            "updatedBy"
          );
          break;
        case "READ_DELETED":
          orders = await OrderGSConfirmationHistory.find({
            isDeleted: true,
          }).populate("updatedBy");
          break;
        case "UPDATE":
          // action  phải co ID va body
          if (action == "UPDATE" && !id && !bodyUpdate === false) {
            return res.json({
              success: false,
              message: `action ${action} phải có id hoặc body - nhập id hoặc body`,
            });
          }
          orders = await OrderGSConfirmationHistory.updateOne({ id }).set(
            bodyUpdate
          );
          break;
        case "DELETE":
          // action  phải co ID
          if (action == "DELETE" && !id) {
            return res.json({
              success: false,
              message: `action ${action} phải có id - nhập id`,
            });
          }
          orders = await OrderGSConfirmationHistory.destroyOne({ id });
          break;
        default:
          console.log("action: ", actionString);
          return res.json({
            success: false,
            message: `Không có Action - vui lòng nhập action`,
          });
      }

      if (!orders || orders.length <= 0) {
        console.info(orders);
        return res.json({
          success: false,
          message: "Không tìm thấy Doc",
        });
      }
      return res.json({
        success: true,
        data: orders,
        message: `${action} thành công`,
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },

  getOrderByCode: async function (req, res) {
    if (!req.query?.orderCode)
      return res.json({
        success: false,
        message: "Không có code order - vui lòng nhập code order",
      });
    try {
      let order = await OrderGS.find({
        isDeleted: { "!=": true },
        orderCode: req.query.orderCode,
        customers: req.query.objectId,
      })
        .populate("orderDetail")
        .populate("delivery");
      if (!order) {
        return res.json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Lấy đơn hàng theo mã code thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },
  ShowListShippingHistory: async function (req, res) {
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có code order - vui lòng nhập code order",
      });
    try {
      order = await OrderGSHistory.find({
        isDeleted: { "!=": true },
        orderID: req.query.id,
      })
        // .populate("manufacture")
        // .populate("categoryCylinder")
        // .populate("colorGas")
        // .populate("valve")
        .populate("driver")
        .sort("deliveryDate");
      if (!order) {
        return res.json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Lấy chi tiết giao hàng của đơn hàng theo mã code thành công",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },

  delete: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }
    if (!req.query.userid) {
      console.log("Empty req.query.userid");
      return res.badRequest(Utils.jsonErr("Empty userid"));
    }

    const { id } = req.query;

    try {
      const deleteOrder = await OrderGSHistory.updateOne({
        isDeleted: { "!=": true },
        id,
      }).set({
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: req.query.userid,
      });

      if (!deleteOrder) {
        return res.json({
          success: false,
          data: {},
          message: "Không tìm thấy đơn để xóa",
        });
      }

      return res.json({ success: true, message: "Xóa thành công." });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi xóa đơn",
      });
    }
  },

  updateById: async function (req, res) {
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    try {
      let orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      let updateData = req.body;
      let updatedOrderGS = await OrderGSHistory.updateOne({
        isDeleted: { "!=": true },
        _id: req.query.id,
      }).set(updateData);
      if (!updatedOrderGS) {
        return res.json({
          success: false,
          message: "Cập nhật đơn hàng thất bại",
        });
      }
      return res.json({
        success: true,
        data: updatedOrderGS,
        message: "Cập nhật đơn hàng thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },
  findStatistics: async function (req, res) {
    let orderGS = null;
    let db = OrderGSHistory.getDatastore().manager;
    try {
      if (req.query.orderID) {
        var notification = `Statistics of order : ${req.query.orderID}`;
        orderGS = await db
          .collection("ordergshistory")
          .aggregate([
            // Stage 1: Filter pizza order documents by pizza size
            // {
            //   $match: {
            //     date: {
            //       $gte: new Date("2020-05-30").toISOString(),
            //       $lt: new Date("2022-06-30").toISOString(),
            //     },
            //   },
            // },
            {
              $match: { orderID: ObjectId(req.query.orderID) },
              isDeleted: { $ne: true },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
              // $group: { _id: "$mass", totalMass: { $sum: "$mass" } },
              // $group: { _id: "$B6", totalB6: { $sum: "$B6" } },
              // $group: { _id: "$B12", totalB12: { $sum: "$B12" } },
              // $group: { _id: "$B20", totalB20: { $sum: "$B20" } },
              // $group: { _id: "$B45", totalB45: { $sum: "$B45" } },
            },
          ])
          .toArray();
      } else {
        if (!req.query.from || !req.query.from) {
          return res.json({
            success: true,
            data: orderGS,
            message: "Nhập khoảng thời gian",
          });
        }
        var notification = `Statistics from ${req.query.from} to ${req.query.to}`;
        orderGS = await db
          .collection("ordergshistory")
          .aggregate([
            // Stage 1: Filter pizza order documents by pizza size
            // {
            //   $match: {
            //     date: {
            //       $gte: new Date("2020-05-30").toISOString(),
            //       $lt: new Date("2022-06-30").toISOString(),
            //     },
            //   },
            // },
            {
              $match: {
                isDeleted: { $ne: true },
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },

              // $group: { _id: "$mass", totalMass: { $sum: "$mass" } },
              // $group: { _id: "$B6", totalB6: { $sum: "$B6" } },
              // $group: { _id: "$B12", totalB12: { $sum: "$B12" } },
              // $group: { _id: "$B20", totalB20: { $sum: "$B20" } },
              // $group: { _id: "$B45", totalB45: { $sum: "$B45" } },
            },
          ])
          .toArray();
      }
      if (orderGS.length <= 0) {
        return res.json({
          success: false,
          data: orderGS,
          message: "Thống kê không thành công hoặc không có data",
        });
      }
      return res.json({
        success: true,
        data: orderGS,
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error,
      });
    }
  },
  findStatisticsFromOrder3: async function (req, res) {
    let ReturnGasFull = null;
    let itemDone = null;
    let db = OrderGSHistory.getDatastore().manager;
    try {
      if (!req.query.from || !req.query.to) {
        return res.json({
          success: true,
          data: orderGS,
          message: "Nhập khoảng thời gian",
        });
      }
      if (req.query.supplier) {
        if (req.query.area) {
          if (req.query.userType) {
            var notification = `Statistics to ${req.query.to} return of jar shell full`;
            ReturnGasFull = await db
              .collection("ordergshistory")
              .aggregate([
                {
                  $match: {
                    createdAt: {
                      $lt: new Date(req.query.to).toISOString(),
                    },
                    // dateDone: { "!=": "1" },
                    customer: ObjectId(req.query.customer),
                    supplier: ObjectId(req.query.supplier),
                    area: ObjectId(req.query.area),
                    isDeleted: { $ne: true },
                    userType: req.query.userType,
                    dateDone: { $exists: true, $ne: "" },
                    shippingType: "TRA_BINH_DAY",
                  },
                },
                {
                  $group: {
                    _id: { notification },
                    totalQuantity: { $sum: "$quantity" },
                    totalMass: { $sum: "$mass" },
                    B6: { $sum: "$B6" },
                    B12: { $sum: "$B12" },
                    B20: { $sum: "$B20" },
                    B45: { $sum: "$B45" },
                  },
                },
              ])
              .toArray();

            var notification = `Statistics of of shipping was done`;
            itemDone = await db
              .collection("ordergshistory")
              .aggregate([
                // {
                //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
                // },
                {
                  $match: {
                    dateDone: { $exists: true, $ne: "" },
                    shippingType: "GIAO_HANG",
                    isDeleted: { $ne: true },
                    customer: ObjectId(req.query.customer),
                    supplier: ObjectId(req.query.supplier),
                    area: ObjectId(req.query.area),
                    userType: req.query.userType,
                    createdAt: {
                      $lt: new Date(req.query.to).toISOString(),
                    },
                  },
                },
                {
                  $group: {
                    _id: { notification },
                    totalQuantity: { $sum: "$quantity" },
                    totalMass: { $sum: "$mass" },
                    B6: { $sum: "$B6" },
                    B12: { $sum: "$B12" },
                    B20: { $sum: "$B20" },
                    B45: { $sum: "$B45" },
                  },
                },
              ])
              .toArray();
            // if (!dataFromHistory) {
            //   return res.json({
            //     success: false,
            //     data: {},
            //     message: "Thống kê không thành công hoặc không có data",
            //   });
            // }
          }
          var notification = `Statistics to ${req.query.to} return of jar shell full`;
          ReturnGasFull = await db
            .collection("ordergshistory")
            .aggregate([
              {
                $match: {
                  createdAt: {
                    $lt: new Date(req.query.to).toISOString(),
                  },
                  // dateDone: { "!=": "1" },
                  isDeleted: { $ne: true },
                  customer: ObjectId(req.query.customer),
                  supplier: ObjectId(req.query.supplier),
                  area: ObjectId(req.query.area),
                  dateDone: { $exists: true, $ne: "" },
                  shippingType: "TRA_BINH_DAY",
                },
              },
              {
                $group: {
                  _id: { notification },
                  totalQuantity: { $sum: "$quantity" },
                  totalMass: { $sum: "$mass" },
                  B6: { $sum: "$B6" },
                  B12: { $sum: "$B12" },
                  B20: { $sum: "$B20" },
                  B45: { $sum: "$B45" },
                },
              },
            ])
            .toArray();

          var notification = `Statistics of of shipping was done`;
          itemDone = await db
            .collection("ordergshistory")
            .aggregate([
              // {
              //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
              // },
              {
                $match: {
                  dateDone: { $exists: true, $ne: "" },
                  shippingType: "GIAO_HANG",
                  isDeleted: { $ne: true },
                  customer: ObjectId(req.query.customer),
                  area: ObjectId(req.query.area),
                  createdAt: {
                    $lt: new Date(req.query.to).toISOString(),
                  },
                },
              },
              {
                $group: {
                  _id: { notification },
                  totalQuantity: { $sum: "$quantity" },
                  totalMass: { $sum: "$mass" },
                  B6: { $sum: "$B6" },
                  B12: { $sum: "$B12" },
                  B20: { $sum: "$B20" },
                  B45: { $sum: "$B45" },
                },
              },
            ])
            .toArray();
          // if (!dataFromHistory) {
          //   return res.json({
          //     success: false,
          //     data: {},
          //     message: "Thống kê không thành công hoặc không có data",
          //   });
          // }
        }
        var notification = `Statistics to ${req.query.to} return of jar shell full`;
        ReturnGasFull = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
                customer: ObjectId(req.query.customer),
                supplier: ObjectId(req.query.supplier),
                isDeleted: { $ne: true },
                dateDone: { $exists: true, $ne: "" },
                shippingType: "TRA_BINH_DAY",
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();

        var notification = `Statistics of of shipping was done`;
        itemDone = await db
          .collection("ordergshistory")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                dateDone: { $exists: true, $ne: "" },
                shippingType: "GIAO_HANG",
                isDeleted: { $ne: true },
                customer: ObjectId(req.query.customer),
                supplier: ObjectId(req.query.supplier),
                createdAt: {
                  $lt: new Date(req.query.to).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      let MassReturnGasFull = ReturnGasFull[0] ? ReturnGasFull[0].totalMass : 0;
      let MassItemDone = itemDone[0] ? itemDone[0].totalMass : 0;
      console.log("itemdone" + itemDone[0].totalMass);
      console.log("returngasfull" + ReturnGasFull[0].totalMass);
      var dataFromHistory = MassItemDone - MassReturnGasFull;
      if (!dataFromHistory || dataFromHistory == null) {
        return res.json({
          success: false,
          data: {},
          message: "Thống kê không thành công hoặc không có data",
        });
      }
      return res.json({
        success: true,
        data: dataFromHistory,
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error,
      });
    }
  },
  findStatisticsFromOrder2: async function (req, res) {
    let ReturnGasFull = null;
    let itemDone = null;
    let db = OrderGSHistory.getDatastore().manager;
    try {
      if (!req.query.to) {
        return res.json({
          success: true,
          data: orderGS,
          message: "Nhập khoảng thời gian",
        });
      }
      if (req.query.customer) {
        var notification = `Statistics to ${req.query.to} return of jar shell full`;
        ReturnGasFull = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
                customer: ObjectId(req.query.customer),
                dateDone: { $exists: true, $ne: "" },
                isDeleted: { $ne: true },
                shippingType: "TRA_BINH_DAY",
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();

        var notification = `Statistics of of shipping was done`;
        itemDone = await db
          .collection("ordergshistory")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                dateDone: { $exists: true, $ne: "" },
                shippingType: "GIAO_HANG",
                isDeleted: { $ne: true },
                customer: ObjectId(req.query.customer),
                createdAt: {
                  $lt: new Date(req.query.to).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      } else {
        var notification = `Statistics to ${req.query.to} return of jar shell full`;
        ReturnGasFull = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
                dateDone: { $exists: true, $ne: "" },
                isDeleted: { $ne: true },
                shippingType: "TRA_BINH_DAY",
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();

        var notification = `Statistics of of shipping was done`;
        itemDone = await db
          .collection("ordergshistory")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                dateDone: { $exists: true, $ne: "" },
                shippingType: "GIAO_HANG",
                isDeleted: { $ne: true },
                createdAt: {
                  $lt: new Date(req.query.to).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      let MassReturnGasFull = ReturnGasFull[0] ? ReturnGasFull[0].totalMass : 0;
      let MassItemDone = itemDone[0] ? itemDone[0].totalMass : 0;
      console.log("itemdone" + itemDone[0].totalMass);
      console.log("returngasfull" + ReturnGasFull[0].totalMass);
      let dataFromHistory = MassItemDone - MassReturnGasFull;
      if (!dataFromHistory || dataFromHistory == null) {
        return res.json({
          success: false,
          data: {},
          message: "Thống kê không thành công hoặc không có data",
        });
      }
      return res.json({
        success: true,
        data: dataFromHistory,
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error,
      });
    }
  },
  findStatisticsReturn2: async function (req, res) {
    try {
      if (!req.query.from || !req.query.to) {
        return res.json({
          success: true,
          data: orderGS,
          message: "Nhập khoảng thời gian",
        });
      }
      find = await HistoryCylinder.find({
        color: req.query.color,
        valve: req.query.valve,
        isReturn: "true",
        isShip: "false",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error,
      });
    }
  },
  findStatisticsFromOrder: async function (req, res) {
    let ReturnGasFull = null;
    let itemDone = null;
    let db = OrderGSHistory.getDatastore().manager;
    try {
      if (!req.query.from || !req.query.to) {
        return res.json({
          success: true,
          data: orderGS,
          message: "Nhập khoảng thời gian",
        });
      }
      if (req.query.customer) {
        var notification = `Statistics from ${req.query.from} to ${req.query.to} return of jar shell full`;
        ReturnGasFull = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
                customer: ObjectId(req.query.customer),
                isDeleted: { $ne: true },
                dateDone: { $exists: true, $ne: "" },
                shippingType: "TRA_BINH_DAY",
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();

        var notification = `Statistics of of shipping was done`;
        itemDone = await db
          .collection("ordergshistory")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                dateDone: { $exists: true, $ne: "" },
                isDeleted: { $ne: true },
                shippingType: "GIAO_HANG",
                customer: ObjectId(req.query.customer),
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      } else {
        var notification = `Statistics from ${req.query.from} to ${req.query.to} return of jar shell full`;
        ReturnGasFull = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                isDeleted: { $ne: true },
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
                dateDone: { $exists: true, $ne: "" },
                shippingType: "TRA_BINH_DAY",
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();

        var notification = `Statistics of of shipping was done`;
        itemDone = await db
          .collection("ordergshistory")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                dateDone: { $exists: true, $ne: "" },
                isDeleted: { $ne: true },
                shippingType: "GIAO_HANG",
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      let MassReturnGasFull = ReturnGasFull[0] ? ReturnGasFull[0].totalMass : 0;
      let MassItemDone = itemDone[0] ? itemDone[0].totalMass : 0;
      console.log("itemdone" + itemDone[0].totalMass);
      console.log("returngasfull" + ReturnGasFull[0].totalMass);
      let dataFromHistory = MassItemDone - MassReturnGasFull;
      if (!dataFromHistory || dataFromHistory == null) {
        return res.json({
          success: false,
          data: {},
          message: "Thống kê không thành công hoặc không có data",
        });
      }
      // }
      return res.json({
        success: true,
        data: dataFromHistory,
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error,
      });
    }
  },
  findStatisticsReturn: async function (req, res) {
    let orderGS = null;
    let db = OrderGSHistory.getDatastore().manager;
    if (!req.query.type) {
      return res.json({
        success: false,
        data: {},
        message: "Mời nhập type",
      });
    }
    try {
      if (req.query.type == "TRA_VO") {
        if (!req.query.from || !req.query.from) {
          return res.json({
            success: true,
            data: orderGS,
            message: "Nhập khoảng thời gian",
          });
        }
        var notification = `Statistics from ${req.query.from} to ${req.query.to} of return jar shell`;
        orderGS = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
                shippingType: req.query.type,
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      if (req.query.type == "TRA_BINH_DAY") {
        if (!req.query.from || !req.query.from) {
          return res.json({
            success: true,
            data: orderGS,
            message: "Nhập khoảng thời gian",
          });
        }
        var notification = `Statistics from ${req.query.from} to ${req.query.to} return of jar shell full`;
        orderGS = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
                shippingType: req.query.type,
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      if (orderGS.length <= 0) {
        return res.json({
          success: false,
          data: orderGS,
          message: "Thống kê không thành công hoặc không có data",
        });
      }
      let totalMasss = orderGS[0] ? orderGS[0].totalMass : 0;
      return res.json({
        success: true,
        data: orderGS,
        totalMasss,
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error,
      });
    }
  },
  findStatistics: async function (req, res) {
    let orderGS = null;
    let db = OrderGSHistory.getDatastore().manager;
    try {
      if (req.query.orderID) {
        var notification = `Statistics of order : ${req.query.orderID}`;
        orderGS = await db
          .collection("ordergshistory")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                orderID: ObjectId(req.query.orderID),
                dateDone: { $exists: true, $ne: "" },
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      if (req.query.customer) {
        var notification = `Statistics of customer : ${req.query.customer}`;
        orderGS = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                customer: ObjectId(req.query.customer),
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      if (!req.query.orderID && !req.query.customer) {
        if (!req.query.from || !req.query.from) {
          return res.json({
            success: true,
            data: orderGS,
            message: "Nhập khoảng thời gian",
          });
        }
        var notification = `Statistics from ${req.query.from} to ${req.query.to}`;
        orderGS = await db
          .collection("ordergshistory")
          .aggregate([
            {
              $match: {
                createdAt: {
                  $gte: new Date(req.query.from).toISOString(),
                  $lt: new Date(req.query.to).toISOString(),
                },
                // dateDone: { "!=": "1" },
              },
            },
            {
              $group: {
                _id: { notification },
                totalQuantity: { $sum: "$quantity" },
                totalMass: { $sum: "$mass" },
                B6: { $sum: "$B6" },
                B12: { $sum: "$B12" },
                B20: { $sum: "$B20" },
                B45: { $sum: "$B45" },
              },
            },
          ])
          .toArray();
      }
      console.log(orderGS);
      if (orderGS.length <= 0) {
        return res.json({
          success: false,
          data: orderGS,
          message: "Thống kê không thành công hoặc không có data",
        });
      }
      let totalMasss = orderGS[0] ? orderGS[0].totalMass : 0;
      return res.json({
        success: true,
        data: orderGS,
        totalMasss,
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error,
      });
    }
  },
  create: async function (req, res) {
    //status default is INIT
    const {
      deliveryDate,
      deliveryAddress,
      driver,
      driverName,
      customers,
      supplier,
      area,
      vehicle,
      transport,
      quantity,
      shippingType,
      cancel,
      mass,
      B6,
      B12,
      B20,
      B45,
      createdAt,
      userType,
      userid,
      signature,
      orderID,
    } = req.body;
    let customers1 = customers;
    if (shippingType == "GIAO_HANG" || shippingType == "GIAO_VO") {
      if (!orderID) {
        return res.json({
          success: false,
          message: "Buộc phải nhập mã đơn hàng",
        });
      }

      var checkOrder = await OrderGS.findOne({
        _id: orderID,
      });
      if (!checkOrder || checkOrder.length <= 0) {
        return res.json({
          success: false,
          message: "Không có đơn hàng này",
        });
      } else {
        customers1 = checkOrder.customers;
      }
    }
    var checkcustomer = await User.findOne({
      _id: customers1,
    });
    if (!checkcustomer || checkcustomer.length <= 0) {
      return res.json({
        success: false,
        message: "Không có khách hàng này",
      });
    }
    // if (!req.body.deliveryDate || !req.body.deliveryAddress) {
    //   return res.json({
    //     success: false,
    //     message: "Buộc phải nhập ngày giao và địa chỉ",
    //   });
    // }
    if (!req.body.driver && !req.body.transport) {
      return res.json({
        success: false,
        message: "Buộc phải nhập tài xế hoặc biển số xe",
      });
    }

    let vehicleId = null;
    if (vehicle) {
      vehicleId = vehicle;
    }

    if (!req.body.signature && !req.body.signature) {
      return res.json({
        success: false,
        message: "Buộc phải nhập chữ ký khách hàng",
      });
    }

    const checkUser = await User.findOne({
      isDeleted: { "!=": true },
      id: userid,
    });
    if (!checkUser || checkUser.length <= 0) {
      return res.json({ success: false, message: "Không tìm thấy user" });
    }
    //================//
    let order = null;
    let dateDelivery = new Date().toISOString();
    try {
      order = await OrderGSHistory.create({
        orderID: orderID,
        deliveryAddress,
        deliveryDate: dateDelivery,
        customer: customers1,
        group: checkcustomer.group ?? null,
        groupName: checkcustomer.groupName,
        threshold: checkcustomer.threshold,
        area: checkUser.area,
        userType: checkUser.userType,
        driver,
        driverName,
        vehicle: vehicleId,
        transport,
        quantity: 0,
        mass: 0,
        shippingType,
        B6: 0,
        B12: 0,
        B20: 0,
        B45: 0,
        createdAt: dateDelivery,
        createdBy: userid,
        signature,
      }).fetch();

      //begin hoa tao detail
      if (order) {
        const product = await Promise.all(
          req.body.cylinderDetail.map(async (element) => {
            return {
              serial: element.serial,
              status: element.status,
              isShip: element.isShip,
              isReturn: element.isReturn,
              reason: element.reason,
              weight: element.weight,
            };
          })
        );

        //begin check valid mang truyen len
        for (let i = 0; i < product.length; i++) {
          if (!product[i].serial) {
            console.log("Số Serial bị rỗng");
            await OrderGSHistory.destroy({
              id: order.id,
            });
            return res.json({
              success: false,
              message: "Số Serial bị rỗng",
            });
          }

          const cylinder = await Cylinder.findOne({
            isDeleted: { "!=": true },
            serial: product[i].serial,
          });
          console.log(cylinder);
          if (!cylinder || cylinder.length <= 0) {
            console.log("Số Serial bị rỗng");
            await OrderGSHistory.destroy({
              id: order.id,
            });
            return res.json({ success: false, message: "Không tìm thấy bình" });
          }
          let category = null;
          if (cylinder.category) {
            category = await CategoryCylinder.findOne({
              isDeleted: { "!=": true },
              id: cylinder.category,
            });
            if (!category || category.length <= 0) {
              await OrderGSHistory.destroy({
                id: order.id,
              });
              return res.json({
                success: false,
                message: "Không tìm thấy loại bình",
              });
            }
          } else {
            await OrderGSHistory.destroy({
              id: order.id,
            });
            return res.json({
              success: false,
              message: "Không tìm thấy loại bình",
            });
          }
          let manufacture = null;
          if (cylinder.manufacture) {
            manufacture = await Manufacture.findOne({
              isDeleted: { "!=": true },
              id: cylinder.manufacture,
            });
            if (!manufacture || manufacture.length <= 0) {
              await OrderGSHistory.destroy({
                id: order.id,
              });
              return res.json({
                success: false,
                message: "Không tìm thấy tên thương hiệu",
              });
            }
          } else {
            await OrderGSHistory.destroy({
              id: order.id,
            });
            return res.json({
              success: false,
              message: "Không tìm thấy tên thương hiệu",
            });
          }
          //hoapd kiem tra xem neu giao binh khong dung thuong hieu, loai binh, mau sac thi khong cho giao
          //buoc 1. xem loai binh, thuong hieu, mau sac co trong don dat hang khong
          if (shippingType == "GIAO_HANG" || shippingType == "GIAO_VO") {
            //

            let orderdetailcheck = await OrderDetail.find({
              isDeleted: { "!=": true },
              orderGSId: orderID,
              manufacture: cylinder.manufacture,
              categoryCylinder: cylinder.category,
            });
            if (!orderdetailcheck || orderdetailcheck.length <= 0) {
              await OrderGSHistory.destroy({
                id: order.id,
              });
              return res.json({
                success: false,
                message: "Không tìm thấy loại bình trong chi tiết đơn hàng",
              });
            }
            //bước 2: kiểm tra xem còn cho phép giao nữa không hay hết số lượng rồi
            let db = OrderDetail.getDatastore().manager;

            const aggregate = await db
              .collection("orderdetail")
              .aggregate([
                {
                  $match: {
                    isDeleted: false,
                    orderGSId: ObjectId(orderID),
                    manufacture: ObjectId(cylinder.manufacture),
                    categoryCylinder: ObjectId(cylinder.category),
                  },
                },
                {
                  $group: {
                    _id: null,
                    quantity: {
                      $sum: "$quantity",
                    },
                  },
                },
              ])
              .toArray();

            let db2 = HistoryCylinder.getDatastore().manager;

            const aggregate2 = await db2
              .collection("historycylinder")
              .aggregate([
                {
                  $match: {
                    isDeleted: false,
                    orderID: ObjectId(orderID),
                    manufacture: ObjectId(cylinder.manufacture),
                    category: ObjectId(cylinder.category),
                  },
                },
                {
                  $group: {
                    _id: null,
                    count: {
                      $sum: 1.0,
                    },
                  },
                },
              ])
              .toArray();

            if (aggregate.length && aggregate2.length) {
              if (aggregate[0].quantity <= aggregate2[0].count) {
                await OrderGSHistory.destroy({
                  id: order.id,
                });
                return res.json({
                  success: false,
                  message: "Số lượng giao đã vượt quá số lượng đặt",
                });
              }
            }
          }

          //end kiem tra xem neu giao binh khong dung thuong hieu, loai binh, mau sac thi khong cho giao

          product[i].id = cylinder.id;
          if (orderID) {
            product[i].orderID = orderID;
          } else {
            product[i].orderID = null;
          }
          product[i].isShipOf = order.id;
          product[i].category = category.id;
          product[i].name = category.name;
          product[i].mass = category.mass;
          product[i].manufacture = cylinder.manufacture;
          product[i].manufactureName = manufacture.name;
          product[i].color = cylinder.color;
          product[i].valve = cylinder.valve;
          product[i].cylinderWeight = cylinder.weight;
          product[i].cylinderCheckedDate = cylinder.checkedDate;
        }
        //end check valid mang truyen len

        await Promise.all(
          product.map(async (element) => {
            const history = await HistoryCylinder.create({
              cylinder: element.id,
              serial: element.serial,
              cylinderWeight: element.cylinderWeight,
              cylinderCheckedDate: element.cylinderCheckedDate,
              orderID: element.orderID,
              status: element.status,
              isShipOf: element.isShipOf,
              isShip: element.isShip,
              isReturn: element.isReturn,
              createdBy: userid,
              category: element.category,
              name: element.name,
              mass: element.mass,
              manufacture: element.manufacture,
              manufactureName: element.manufactureName,
              color: element.color,
              valve: element.valve,
              reasonReturn: element.reason,
              weight: element.weight,
              amount: 1,
            }).fetch();

            if (!history) {
              await HistoryCylinder.destroy({
                isShipOf: order.id,
              });
              await OrderGSHistory.destroy({
                id: order.id,
              });
              return res.json({
                success: false,
                message: "Tạo chi tiết thất bại",
              });
            }
          })
        );

        if (['GIAO_HANG', 'GIAO_VO'].includes(shippingType)) {
          /**
           * Thêm lịch sử và thay đổi trạng thái của bình
           */
          const productIds = product.map((_prod) => {
            return _prod.id;
          });
          // Tạo bản ghi xuất
          const resultExport = await History.create({
            driver: driverName,
            vehicle: vehicleId,
            license_plate: transport,
            cylinders: productIds,
            signature: `EXPORT_201 - Đơn hàng - ${shippingType}`,
            idDriver: driver,
            from:
              checkUser.userRole === "Deliver" || checkUser.userType === "Vehicle"
                ? checkUser.isChildOf
                : checkUser.id,
            to: customers1,
            type: "EXPORT",
            toArray: [customers1],
            numberArray: [req.body.cylinderDetail.length.toString()],
            numberOfCylinder: req.body.cylinderDetail.length,
            // cylindersWithoutSerial,
            amount: 0,
            // saler,
            // typeForPartner: "BUY",
            // exportByDriver,
            // turnbackByDriver,
            importExportBySystem: true, // Xác định xử lý xuất nhập bởi hệ thống
            createdBy: userid,
          });
          // Tạo bản ghi nhập
          const resultImport = await History.create({
            driver: driverName,
            vehicle: vehicleId,
            license_plate: transport,
            cylinders: productIds,
            signature: `IMPORT_201 - Đơn hàng - ${shippingType}`,
            idDriver: driver,
            from:
              checkUser.userRole === "Deliver" || checkUser.userType === "Vehicle"
                ? checkUser.isChildOf
                : checkUser.id,
            to: customers1,
            type: "IMPORT",
            // toArray,
            // numberArray,
            numberOfCylinder: req.body.cylinderDetail.length,
            // cylindersWithoutSerial,
            amount: 0,
            // saler,
            // typeForPartner: "BUY",
            // exportByDriver,
            // turnbackByDriver,
            importExportBySystem: true, // Xác định xử lý xuất nhập bởi hệ thống
            createdBy: userid,
          });
          // Tạo bản ghi tương ứng trong collection CylinderImex
          const _idImex = Date.now();
          const flowExport =
            shippingType === "GIAO_VO" ? "EXPORT_CELL" : "EXPORT";
          const flowImport =
            shippingType === "GIAO_VO" ? "IMPORT_CELL" : "IMPORT";
          const statusExport =
            shippingType === "GIAO_VO" ? "EMPTY" : "FULL";
          const statusImport =
            shippingType === "GIAO_VO" ? "EMPTY" : "FULL";
          await Promise.all(
            product.map(async (cylinder) => {
              // Bản ghi xuất
              await CylinderImex.create({
                cylinder: cylinder.id,
                // status: cylinder.status,
                status: statusExport,
                condition: cylinder.classification
                  ? cylinder.classification.toUpperCase()
                  : "OLD",
                idImex: _idImex,
                typeImex: "OUT",
                flow: flowExport,
                flowDescription: "ORDER",
                category: cylinder.category,
                manufacture: cylinder.manufacture,
                createdBy: userid,
                objectId: resultExport.from,
                history: resultExport.id,
              });
              // Bản ghi nhập
              await CylinderImex.create({
                cylinder: cylinder.id,
                // status: cylinder.status,
                status: statusImport,
                condition: cylinder.classification
                  ? cylinder.classification.toUpperCase()
                  : "OLD",
                idImex: _idImex,
                typeImex: "IN",
                flow: flowImport,
                flowDescription: "ORDER",
                category: cylinder.category,
                manufacture: cylinder.manufacture,
                createdBy: userid,
                objectId: resultImport.to,
                history: resultImport.id,
              });
            })
          );

          // Cập nhật trạng thái và vị trí bình sau khi tạo bản ghi nhập
          if (resultImport) {
            // Tìm thông tin from - nơi nhập vào
            const fromInfo = await User.findOne({
              id: resultImport.to,
            });

            let _placeStatus = "IN_FACTORY";
            let _current = fromInfo.id;

            switch (fromInfo.userType) {
              case USER_TYPE.Factory:
                _placeStatus = "IN_FACTORY";
                break;
              case USER_TYPE.Fixer:
                _placeStatus = "IN_REPAIR";
                break;
              case USER_TYPE.General:
                _placeStatus = "IN_GENERAL";
                break;
              case USER_TYPE.Agency:
                _placeStatus = "IN_AGENCY";
                break;
              case USER_TYPE.Vehicle:
                _placeStatus = "IN_VEHICLE";
                break;
              default:
                break;
            }

            let _updateForm = {
              placeStatus: _placeStatus,
              current: _current,
            };

            // Cập nhật lại thông tin bình
            await Cylinder.update({
              _id: { in: productIds },
            }).set(_updateForm);
          }
        }

        if (['TRA_VO', 'TRA_BINH_DAY'].includes(shippingType)) {
          /**
           * Thêm lịch sử và thay đổi trạng thái của bình
           */
          const productIds = product.map((_prod) => {
            return _prod.id;
          });
          // Tạo bản ghi xuất
          const resultExport = await History.create({
            driver: driverName,
            vehicle: vehicleId,
            license_plate: transport,
            cylinders: productIds,
            signature: `EXPORT_201 - Đơn hàng - ${shippingType}`,
            idDriver: driver,
            from: customers1,
            to:
              checkUser.userRole === "Deliver"
                ? checkUser.isChildOf
                : checkUser.id,
            type: "EXPORT",
            toArray: [
              checkUser.userRole === "Deliver"
                ? checkUser.isChildOf
                : checkUser.id
            ],
            numberArray: [req.body.cylinderDetail.length.toString()],
            numberOfCylinder: req.body.cylinderDetail.length,
            // cylindersWithoutSerial,
            amount: 0,
            // saler,
            // typeForPartner: "BUY",
            // exportByDriver,
            // turnbackByDriver,
            importExportBySystem: true, // Xác định xử lý xuất nhập bởi hệ thống
            createdBy: userid,
          });
          // Tạo bản ghi nhập
          const resultImport = await History.create({
            driver: driverName,
            vehicle: vehicleId,
            license_plate: transport,
            cylinders: productIds,
            signature: `IMPORT_201 - Đơn hàng - ${shippingType}`,
            idDriver: driver,
            from: customers1,
            to:
              checkUser.userRole === "Deliver"
                ? checkUser.isChildOf
                : checkUser.id,
            type: "IMPORT",
            // toArray,
            // numberArray,
            numberOfCylinder: req.body.cylinderDetail.length,
            // cylindersWithoutSerial,
            amount: 0,
            // saler,
            // typeForPartner: "BUY",
            // exportByDriver,
            // turnbackByDriver,
            importExportBySystem: true, // Xác định xử lý xuất nhập bởi hệ thống
            createdBy: userid,
          });
          // Tạo bản ghi tương ứng trong collection CylinderImex
          const _idImex = Date.now();
          const flowDescriptionExport =
            shippingType === "TRA_VO" ? "RETURN_CELL" : "RETURN";
          const flowDescriptionImport =
            shippingType === "TRA_VO" ? "RETURN_CELL" : "RETURN";
          const statusExport =
            shippingType === "TRA_VO" ? "EMPTY" : "FULL";
          const statusImport =
            shippingType === "TRA_VO" ? "EMPTY" : "FULL";
          await Promise.all(
            product.map(async (cylinder) => {
              // Bản ghi xuất
              await CylinderImex.create({
                cylinder: cylinder.id,
                // status: cylinder.status,
                status: statusExport,
                condition: cylinder.classification
                  ? cylinder.classification.toUpperCase()
                  : "OLD",
                idImex: _idImex,
                typeImex: "OUT",
                flow: "TURN_BACK",
                flowDescription: flowDescriptionExport,
                category: cylinder.category,
                manufacture: cylinder.manufacture,
                createdBy: userid,
                objectId: resultExport.from,
                history: resultExport.id,
              });
              // Bản ghi nhập
              await CylinderImex.create({
                cylinder: cylinder.id,
                // status: cylinder.status,
                status: statusImport,
                condition: cylinder.classification
                  ? cylinder.classification.toUpperCase()
                  : "OLD",
                idImex: _idImex,
                typeImex: "IN",
                flow: "TURN_BACK",
                flowDescription: flowDescriptionImport,
                category: cylinder.category,
                manufacture: cylinder.manufacture,
                createdBy: userid,
                objectId: resultImport.to,
                history: resultImport.id,
              });
            })
          );

          // Cập nhật trạng thái và vị trí bình sau khi tạo bản ghi nhập
          if (resultImport) {
            // Tìm thông tin from - nơi nhập vào
            const fromInfo = await User.findOne({
              id: resultImport.to,
            });

            let _placeStatus = "IN_FACTORY";
            let _current = fromInfo.id;

            switch (fromInfo.userType) {
              case USER_TYPE.Factory:
                _placeStatus = "IN_FACTORY";
                break;
              case USER_TYPE.Fixer:
                _placeStatus = "IN_REPAIR";
                break;
              case USER_TYPE.General:
                _placeStatus = "IN_GENERAL";
                break;
              case USER_TYPE.Agency:
                _placeStatus = "IN_AGENCY";
                break;
              case USER_TYPE.Vehicle:
                _placeStatus = "IN_VEHICLE";
                break;
              default:
                break;
            }

            let _updateForm = {
              placeStatus: _placeStatus,
              current: _current,
            };

            // Cập nhật lại thông tin bình
            await Cylinder.update({
              _id: { in: productIds },
            }).set(_updateForm);
          }
        }
        
      } else {
        return res.json({
          success: false,
          message: "Tạo đơn đã giao thất bại",
        });
      }
      //end hoa tao detail
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
    if (!order)
      return res.json({ success: false, message: "Tạo đơn đã giao thất bại" });

    if (shippingType == "GIAO_HANG") {
      return res.json({
        success: true,
        data: order,
        message: "Tạo đơn giao bình thành công",
      });
    } else if (shippingType == "GIAO_VO") {
      return res.json({
        success: true,
        data: order,
        message: "Tạo đơn giao vỏ bình thành công",
      });
    } else if (shippingType == "TRA_VO") {
      return res.json({
        success: true,
        data: order,
        message: "Tạo đơn hồi lưu vỏ Gassouth thành công",
      });
    } else if (shippingType == "TRA_BINH_DAY") {
      return res.json({
        success: true,
        data: order,
        message: "Tạo đơn hồi lưu bình đầy thành công",
      });
    } else if (shippingType == "TRA_VO_KHAC") {
      return res.json({
        success: true,
        data: order,
        message: "Tạo đơn hồi lưu vỏ khác thành công",
      });
    } else {
      return res.json({
        success: true,
        data: order,
        message: "Tạo đơn thành công",
      });
    }
  },

  createOther: async function (req, res) {
    //status default is INIT
    const {
      deliveryDate,
      deliveryAddress,
      driver,
      driverName,
      customer,
      supplier,
      area,
      vehicle,
      transport,
      quantity,
      shippingType,
      cancel,
      mass,
      B6,
      B12,
      B20,
      B45,
      createdAt,
      userType,
      userid,
      signature,
      customers,
    } = req.body;
    var checkcustomer = await User.findOne({
      _id: customers,
    });
    if (!checkcustomer || checkcustomer.length <= 0) {
      return res.json({
        success: false,
        message: "Không có khách hàng này",
      });
    }
    if (!req.body.driver && !req.body.transport) {
      return res.json({
        success: false,
        message: "Buộc phải nhập tài xế hoặc biển số xe",
      });
    }

    let vehicleId = null;
    if (vehicle) {
      vehicleId = vehicle;
    }

    if (!req.body.signature && !req.body.signature) {
      return res.json({
        success: false,
        message: "Buộc phải nhập chữ ký khách hàng",
      });
    }

    const checkUser = await User.findOne({
      isDeleted: { "!=": true },
      id: userid,
    });
    if (!checkUser || checkUser.length <= 0) {
      return res.json({ success: false, message: "Không tìm thấy user" });
    }
    //================//
    let order = null;
    let dateDelivery = new Date().toISOString();
    try {
      order = await OrderGSHistory.create({
        deliveryAddress,
        deliveryDate: dateDelivery,
        customer: customers,
        group: checkcustomer.group ?? null,
        groupName: checkcustomer.groupName,
        threshold: checkcustomer.threshold,
        area: checkUser.area,
        userType: checkUser.userType,
        driver,
        driverName,
        vehicle: vehicleId,
        transport,
        quantity: 0,
        mass: 0,
        shippingType,
        B6: 0,
        B12: 0,
        B20: 0,
        B45: 0,
        createdAt: dateDelivery,
        createdBy: userid,
        signature,
      }).fetch();

      //begin hoa tao detail
      const product = await Promise.all(
        req.body.cylinderDetail.map(async (element) => {
          return {
            category: element.category,
            amount: element.mass,
            isShip: element.isShip,
            isReturn: element.isReturn,
            status: element.status,
          };
        })
      );

      //begin check valid mang truyen len
      for (let i = 0; i < product.length; i++) {
        if (!product[i].category) {
          console.log("Loại bình bị rỗng");
          await OrderGSHistory.destroy({
            id: order.id,
          });

          return res.json({
            success: false,
            message: "Loại bình bị rỗng",
          });
        }

        const lscategory = await CategoryCylinder.findOne({
          isDeleted: { "!=": true },
          id: product[i].category,
        });
        if (!lscategory || lscategory.length <= 0) {
          await OrderGSHistory.destroy({
            id: order.id,
          });

          return res.json({
            success: false,
            message: "Không tìm thấy loại bình",
          });
        }

        product[i].isShipOf = order.id;
        product[i].category = lscategory.id;
        product[i].name = lscategory.name;
        product[i].mass = lscategory.mass;
      }
      //end check valid mang truyen len

      await Promise.all(
        product.map(async (element) => {
          const history = await HistoryCylinder.create({
            status: element.status,
            isShipOf: element.isShipOf,
            isShip: element.isShip,
            isReturn: element.isReturn,
            createdBy: userid,
            category: element.category,
            name: element.name,
            mass: element.mass,
            amount: element.amount,
          }).fetch();

          if (!history) {
            await OrderGSHistory.destroy({
              id: order.id,
            });

            await HistoryCylinder.destroy({
              isShipOf: order.id,
            });

            return res.json({
              success: false,
              message: "Tạo chi tiết thất bại",
            });
          }
        })
      );

      //end hoa tao detail
    } catch (error) {
      await OrderGSHistory.destroy({
        id: order.id,
      });

      await HistoryCylinder.destroy({
        isShipOf: order.id,
      });
      return res.json({
        success: false,
        message: error.message,
      });
    }
    if (!order)
      return res.json({ success: false, message: "Tạo đơn đã giao thất bại" });

    return res.json({
      success: true,
      data: order,
      message: "Tạo đơn hồi lưu vỏ khác thành công",
    });
  },
};
