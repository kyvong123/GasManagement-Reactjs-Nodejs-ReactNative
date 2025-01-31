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
const UserTypes = require("../constants/UserTypes");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  getHistory: async function (req, res) {
    const cylinder = await CloneCylinder.findOne({
      isDeleted: { "!=": true },
      serial: req.query.serial,
      color: req.query.color,
      manufacture: req.query.manufacture,
      category: req.query.cate,
      valve: req.query.valve,
    });
    console.log(cylinder.id);
    if (!cylinder || cylinder.length <= 0) {
      return res.json({ success: false, message: "Không tìm thấy bình" });
    }
    try {
      let history = await HistoryCylinder.find({
        isDeleted: { "!=": true },
        cylinder: cylinder.id,
        status: req.query.status,
        isDeleted: { "!=": true },
      });
      if (!history || history.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy lịch sử",
        });
      }
      return res.json({
        success: true,
        data: history,
        message: "Lấy lịch sử thành công",
      });
    } catch (error) {
      return res.json({
        success: false,

        message: "Gặp lỗi khi lấy lịch sử",
      });
    }
  },
  // getFilter
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
      const deleteOrder = await OrderGS.updateOne({
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

          message: "Không tìm thấy đơn để xóa",
        });
      }

      return res.json({ success: true, message: "Xóa thành công." });
    } catch (error) {
      return res.json({
        success: false,

        message: "Gặp lỗi khi xóa đơn",
      });
    }
  },

  update: async function (req, res) {
    if (!req.query) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const { id } = req.query;

    if (!id) {
      return res.badRequest(Utils.jsonErr("Id is required"));
    }
    // if (!name) {
    //     return res.badRequest(Utils.jsonErr('name is required'));
    // }

    const history = await HistoryCylinder.findOne({
      isDeleted: { "!=": true },
      _id: id,
    });
    if (!history) {
      return res.json({
        status: false,
        resCode: "ERROR-00107",
        data: {},
        message: "Không tìm thấy lịch sử cần cập nhật",
      });
    }
    try {
      dataUpdate = req.body;
      const result = await HistoryCylinder.updateOne({
        isDeleted: { "!=": true },
        _id: id,
      }).set(dataUpdate);

      if (result) {
        return res.json({
          success: true,
          data: result,
          message: "Cập nhật thành công.",
        });
      } else {
        return res.json({ success: false, message: "Cập nhật thất bại." });
      }
    } catch (error) {
      return res.json(error.message);
    }
  },

  countCylinderError: async function (req, res) {
    try {
      const reasons = await Reason.find({
        isDeleted: { "!=": true },
      });
      console.log(reasons);
      let stringError = [];
      for (let i = 0; i < reasons.length; i++) {
        history = await HistoryCylinder.find({
          createdAt: {
            ">=": new Date(req.query.From).toISOString(),
            "<=": new Date(req.query.To).toISOString(),
          },
          reasonReturn: reasons[i].id,
        });
        stringError.push({
          name: reasons[i].name,
          amount: history.length,
          code: reasons[i].code,
        });
        // stringError.push(reasons[i].name + ": " + history.length);
      }
      if (stringError.length <= 0) {
        return res.json({
          success: false,
          message: "Thất bại hoặc không có data.",
        });
      }
      return res.json({
        success: true,
        data: stringError,
        message: "Thống kê số lỗi theo lỗi bình thành công.",
      });
    } catch (error) {
      return res.json(error.message);
    }
  },

  // Thống kê bình lỗi
  // thay thế cho API countCylinderError
  aggregateCylinderError: async function (req, res) {
    const { From, To, stationId } = req.query;

    if (!From) {
      return res.badRequest(Utils.jsonErr("From is required"));
    }

    if (!To) {
      return res.badRequest(Utils.jsonErr("To is required"));
    }

    try {
      const timeRange = [
        {
          $match: {
            createdAt: {
              $gte: From,
              $lte: To,
            },
            reasonReturn: {
              $ne: null,
            },
          },
        },
      ];

      let criteria = [...timeRange];

      if (stationId) {
        const matchStation = [
          {
            $lookup: {
              from: "ordergs",
              let: {
                orderId: "$orderID",
                station: ObjectId(stationId),
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ["$_id", "$$orderId"],
                        },
                        {
                          $eq: ["$supplier", "$$station"],
                        },
                      ],
                    },
                  },
                },
                {
                  $project: {
                    _id: 1.0,
                  },
                },
              ],
              as: "order",
            },
          },
          {
            $match: {
              order: {
                $gt: [
                  {
                    $size: "$order",
                  },
                  0.0,
                ],
              },
            },
          },
        ];

        criteria.push(...matchStation);
      }

      const db = await HistoryCylinder.getDatastore().manager;
      const _aggregate = await db
        .collection("historycylinder")
        .aggregate([
          ...criteria,
          {
            $lookup: {
              from: "cylinder",
              localField: "cylinder",
              foreignField: "_id",
              as: "cylinder",
            },
          },
          {
            $unwind: {
              path: "$cylinder",
            },
          },
          {
            $group: {
              _id: "$reasonReturn",
              amount: {
                $sum: 1.0,
              },
              cylinders: {
                $push: {
                  idHistory: "$$ROOT._id",
                  serial: "$$ROOT.cylinder.serial",
                  reasonCreatedAt: "$$ROOT.createdAt",
                  reasonReturnStationchief: "$$ROOT.reasonReturnStationchief",
                },
              },
            },
          },
          {
            $lookup: {
              from: "reason",
              localField: "_id",
              foreignField: "_id",
              as: "reason",
            },
          },
          {
            $unwind: {
              path: "$reason",
            },
          },
          {
            $project: {
              _id: 1.0,
              name: "$reason.name",
              code: "$reason.code",
              amount: 1.0,
              cylinders: 1.0,
            },
          },
        ])
        .toArray();

      return res.json({
        success: true,
        data: _aggregate,
        message: "Thống kê số lỗi theo lỗi bình thành công.",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: [],
        message: error.message,
      });
    }
  },

  // Lấy thông tin bình lỗi và lý do
  getReasonCylinderError: async function (req, res) {
    const { idHistoryCylinder } = req.query;

    if (!idHistoryCylinder) {
      return res.badRequest(Utils.jsonErr("Id is required"));
    }

    try {
      const db = await HistoryCylinder.getDatastore().manager;
      const _aggregate = await db
        .collection("historycylinder")
        .aggregate([
          {
            $match: {
              _id: ObjectId(idHistoryCylinder),
            },
          },
          {
            $lookup: {
              from: "cylinder",
              localField: "cylinder",
              foreignField: "_id",
              as: "cylinder",
            },
          },
          {
            $unwind: {
              path: "$cylinder",
            },
          },
          {
            $lookup: {
              from: "reason",
              localField: "reasonReturn",
              foreignField: "_id",
              as: "reasonReturn",
            },
          },
          {
            $unwind: {
              path: "$reasonReturn",
            },
          },
          {
            $lookup: {
              from: "user",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
            },
          },
          {
            $unwind: {
              path: "$createdBy",
            },
          },
          {
            $lookup: {
              from: "reason",
              localField: "reasonReturnStationchief",
              foreignField: "_id",
              as: "reasonReturnStationchief",
            },
          },
          {
            $unwind: {
              path: "$reasonReturnStationchief",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "user",
              localField: "createdStationchiefBy",
              foreignField: "_id",
              as: "createdStationchiefBy",
            },
          },
          {
            $unwind: {
              path: "$createdStationchiefBy",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              serial: "$cylinder.serial",
              "reasonOfDriver.reason": "$reasonReturn.name",
              "reasonOfDriver.driverName": "$createdBy.name",
              "reasonOfDriver.createdAt": "$createdAt",
              "reasonOfStationChief.reason": "$reasonReturnStationchief.name",
              "reasonOfStationChief.stationChiefName":
                "$createdStationchiefBy.name",
              "reasonOfStationChief.createdAt": "$createdStationchiefAt",
              solution: "$noteStationchief2",
            },
          },
        ])
        .toArray();

      return res.json({
        success: true,
        data: _aggregate,
        message: "Lấy thông tin bình lỗi thành công.",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  // Xác nhận bình lỗi và lý do
  confirmCylinderError: async function (req, res) {
    const {
      idHistoryCylinder,
      reasonReturnStationchief,
      noteStationchief1,
      noteStationchief2,
    } = req.body;

    const userInfo = req.userInfo;

    if (!idHistoryCylinder) {
      return res.badRequest(Utils.jsonErr("Id is required"));
    }

    try {
      const updatedConfirm = await HistoryCylinder.updateOne({
        _id: idHistoryCylinder,
      }).set({
        reasonReturnStationchief: reasonReturnStationchief
          ? reasonReturnStationchief
          : null,
        noteStationchief1,
        noteStationchief2,
        createdStationchiefBy: userInfo.id,
        createdStationchiefAt: new Date().toISOString(),
      });

      if (!updatedConfirm) {
        return res.badRequest(
          Utils.jsonErr("Không tìm thấy id lịch sử bình lỗi")
        );
      }

      return res.json({
        success: true,
        data: updatedConfirm,
        message: "Cập nhật thông tin thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  statisticSell: async function (req, res) {
    const {
      fromDate,
      toDate,
      stationId,
      customerId,
      customerRole,
      customerType,
    } = req.query;

    try {
      const criteriaCustomer = [{ $eq: ["$_id", "$$idCustomer"] }];

      if (stationId) {
        criteriaCustomer.push({ $eq: ["$isChildOf", ObjectId(stationId)] });
      }

      if (customerRole && customerType) {
        criteriaCustomer.push({ $eq: ["$userType", customerType] });
        criteriaCustomer.push({ $eq: ["$userRole", customerRole] });
      }

      if (customerId) {
        criteriaCustomer.push({ $eq: ["$_id", ObjectId(customerId)] });
      }

      let db = await OrderGSHistory.getDatastore().manager;
      let _Aggregate = await db
        .collection("ordergshistory")
        .aggregate([
          {
            $match: {
              deliveryDate: {
                $gte: fromDate,
                $lte: toDate,
              },
            },
          },
          {
            $lookup: {
              from: "user",
              let: {
                idCustomer: "$customer",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: criteriaCustomer,
                    },
                  },
                },
              ],
              as: "customer",
            },
          },
          {
            $unwind: {
              path: "$customer",
            },
          },
          {
            $lookup: {
              from: "historycylinder",
              localField: "_id",
              foreignField: "isShipOf",
              as: "historycylinder",
            },
          },
          {
            $unwind: {
              path: "$historycylinder",
            },
          },
          {
            $group: {
              _id: {
                shippingType: "$shippingType",
                name: "$historycylinder.name",
                mass: "$historycylinder.mass",
                manufactureName: "$historycylinder.manufactureName",
              },
              count: {
                $sum: "$historycylinder.amount",
              },
            },
          },
        ])
        .toArray();

      return res.json({
        status: true,
        data: _Aggregate,
        message: "OK",
      });
    } catch (error) {
      return res.json({
        status: false,
        data: [],
        message: error.message,
      });
    }
  },

  statisticExcel: async function (req, res) {
    const { toDate, stationId, areaId, customerType } = req.query;
    const { userInfo } = req;

    if (!toDate) {
      return res.badRequest(Utils.jsonErr("toDate is required"));
    }

    if (customerType) {
      const CUSTOMER_TYPES = ["Industry", "Distribution", "Agency"];
      if (!CUSTOMER_TYPES.includes(customerType)) {
        return res.badRequest(Utils.jsonErr("Wrong customerType"));
      }
    }

    try {
      // Xử lý ngày tháng thống kê
      const startOfOneMonthAgo = moment(toDate).subtract(1, 'months').startOf("month").toISOString();
      const endOfOneMonthAgo = moment(toDate).subtract(1, 'months').endOf("month").toISOString();
      const dateOfOneMonthAgo = moment(toDate).subtract(1, 'months').toISOString();
      const startOfCurrentMonth = moment(toDate).startOf("month").toISOString();
      const dateOfCurrentMonth = moment(toDate).toISOString();

      const criteriaCustomer = [{ $eq: ["$_id", "$$idCustomer"] }];

      if (stationId) {
        criteriaCustomer.push({ $eq: ["$isChildOf", ObjectId(stationId)] });
      }

      // if (areaId) {
      //   criteriaCustomer.push({ $eq: ["$area", ObjectId(areaId)] });
      // }

      switch (customerType) {
        case "Industry":
          criteriaCustomer.push({ $eq: ["$userType", "General"] });
          criteriaCustomer.push({ $eq: ["$userRole", "SuperAdmin"] });
          criteriaCustomer.push({ $eq: ["$customerType", "Industry"] });
          break;
        case "Distribution":
          criteriaCustomer.push({ $eq: ["$userType", "General"] });
          criteriaCustomer.push({ $eq: ["$userRole", "SuperAdmin"] });
          criteriaCustomer.push({ $ne: ["$customerType", "Industry"] });
          break;
        case "Agency":
          criteriaCustomer.push({ $eq: ["$userType", "Agency"] });
          criteriaCustomer.push({ $eq: ["$userRole", "SuperAdmin"] });
          break;
        default:
          criteriaCustomer.push({ $in: ["$userType", ["General", "Agency"]] });
          criteriaCustomer.push({ $eq: ["$userRole", "SuperAdmin"] });
          break;
      }

      const queryMatch = (startDate, endDate, area) => {
        const criteriaOrder = {
          "createdAt": {
            "$gte": startDate,
            "$lte": endDate
          },
          "status": {
            "$nin": [
              "KHONG_DUYET",
              "DA_HUY"
            ]
          },
          "orderType": "KHONG"
        };

        if (area) {
          criteriaOrder.area = ObjectId(area);
        }

        return criteriaOrder;
      }

      const db = await OrderGSHistory.getDatastore().manager;

      // Thống kê - Số lượng thực hiện của tháng
      const matchAggMonth = queryMatch(startOfOneMonthAgo, endOfOneMonthAgo, areaId)
      const _aggregateMonth = await db
        .collection("ordergs")
        .aggregate([
          {
            "$match": matchAggMonth
          },
          {
            "$lookup": {
              "from": "user",
              "let": {
                "idCustomer": "$customers"
              },
              "pipeline": [
                {
                  "$match": {
                    "$expr": {
                      "$and": criteriaCustomer
                    }
                  }
                }
              ],
              "as": "customer"
            }
          },
          {
            "$unwind": {
              "path": "$customer"
            }
          },
          {
            "$addFields": {
              "customerType": {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$customer.userType",
                          "Agency"
                        ]
                      },
                      "then": "Hệ Thống Đại Lý"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$customer.customerType",
                          "Industry"
                        ]
                      },
                      "then": "Khách Hàng Công Nghiệp Bình"
                    }
                  ],
                  "default": "Tổng Đại Lý"
                }
              }
            }
          },
          {
            "$lookup": {
              "from": "area",
              "localField": "area",
              "foreignField": "_id",
              "as": "area"
            }
          },
          {
            "$unwind": {
              "path": "$area"
            }
          },
          {
            "$facet": {
              "other": [
                {
                  "$match": {
                    "status": {
                      "$ne": "DA_HOAN_THANH"
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "orderdetail",
                    "localField": "_id",
                    "foreignField": "orderGSId",
                    "as": "orderDetail"
                  }
                },
                {
                  "$unwind": {
                    "path": "$orderDetail"
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$customer._id",
                      "customerCode": "$customer.code",
                      "customerName": "$customer.name",
                      "customerType": "$customerType",
                      "areaName": "$area.name",
                      "shippingType": "$shippingType"
                    },
                    "count": {
                      "$sum": {
                        "$multiply": [
                          "$orderDetail.quantity",
                          "$orderDetail.categoryMass"
                        ]
                      }
                    }
                  }
                }
              ],
              "completed": [
                {
                  "$match": {
                    "status": {
                      "$eq": "DA_HOAN_THANH"
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "ordergshistory",
                    "localField": "_id",
                    "foreignField": "orderID",
                    "as": "ordergshistory"
                  }
                },
                {
                  "$unwind": {
                    "path": "$ordergshistory",
                    // "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$lookup": {
                    "from": "historycylinder",
                    "localField": "ordergshistory._id",
                    "foreignField": "isShipOf",
                    "as": "historycylinder"
                  }
                },
                {
                  "$unwind": {
                    "path": "$historycylinder",
                    // "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$customer._id",
                      "customerCode": "$customer.code",
                      "customerName": "$customer.name",
                      "customerType": "$customerType",
                      "areaName": "$area.name",
                      "shippingType": "$ordergshistory.shippingType"
                    },
                    "count": {
                      "$sum": "$historycylinder.mass"
                    }
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$_id.customerId",
                      "customerCode": "$_id.customerCode",
                      "customerName": "$_id.customerName",
                      "customerType": "$_id.customerType",
                      "areaName": "$_id.areaName"
                    },
                    "count": {
                      "$accumulator": {
                        "init": `function () {
                          // Set the initial state
                          return {
                            GIAO_HANG: 0, TRA_BINH_DAY: 0
                          }
                        }`,
                        "accumulate": `function (state, count, shippingType) {
                          // Define how to update the state
                          if (shippingType === 'GIAO_HANG') {
                            state.GIAO_HANG += count
                          }
                          if (shippingType === 'TRA_BINH_DAY') {
                            state.GIAO_HANG -= count
                          }
                          return state
                        }`,
                        "accumulateArgs": [
                          "$count",
                          "$_id.shippingType"
                        ],
                        "merge": `function (state1, state2) {
                          // When the operator performs a merge,
                          return {
                            // add the fields from the two states
                            GIAO_HANG: state1.GIAO_HANG + state2.GIAO_HANG,
                            TRA_BINH_DAY: state1.TRA_BINH_DAY + state2.TRA_BINH_DAY
                          }
                        }`,
                        "finalize": `function (state) {
                          // After collecting the results from all documents,
                          return (state.GIAO_HANG - state.TRA_BINH_DAY) // calculate
                        }`,
                        "lang": "js"
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            "$project": {
              "result": {
                "$concatArrays": [
                  "$other",
                  "$completed"
                ]
              }
            }
          },
          {
            "$unwind": {
              "path": "$result"
            }
          },
          {
            "$group": {
              "_id": "$result._id",
              "count": {
                "$sum": "$result.count"
              }
            }
          }
        ])
        .toArray();

      // Thống kê - 'TH lũy kế' đến 1 tháng trước so với toDate
      const matchAggToDate = queryMatch(startOfOneMonthAgo, dateOfOneMonthAgo, areaId)
      const _aggregaToDate = await db
        .collection("ordergs")
        .aggregate([
          {
            "$match": matchAggToDate
          },
          {
            "$lookup": {
              "from": "user",
              "let": {
                "idCustomer": "$customers"
              },
              "pipeline": [
                {
                  "$match": {
                    "$expr": {
                      "$and": criteriaCustomer
                    }
                  }
                }
              ],
              "as": "customer"
            }
          },
          {
            "$unwind": {
              "path": "$customer"
            }
          },
          {
            "$addFields": {
              "customerType": {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$customer.userType",
                          "Agency"
                        ]
                      },
                      "then": "Hệ Thống Đại Lý"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$customer.customerType",
                          "Industry"
                        ]
                      },
                      "then": "Khách Hàng Công Nghiệp Bình"
                    }
                  ],
                  "default": "Tổng Đại Lý"
                }
              }
            }
          },
          {
            "$lookup": {
              "from": "area",
              "localField": "area",
              "foreignField": "_id",
              "as": "area"
            }
          },
          {
            "$unwind": {
              "path": "$area"
            }
          },
          {
            "$facet": {
              "other": [
                {
                  "$match": {
                    "status": {
                      "$ne": "DA_HOAN_THANH"
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "orderdetail",
                    "localField": "_id",
                    "foreignField": "orderGSId",
                    "as": "orderDetail"
                  }
                },
                {
                  "$unwind": {
                    "path": "$orderDetail"
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$customer._id",
                      "customerCode": "$customer.code",
                      "customerName": "$customer.name",
                      "customerType": "$customerType",
                      "areaName": "$area.name",
                      "shippingType": "$shippingType"
                    },
                    "count": {
                      "$sum": {
                        "$multiply": [
                          "$orderDetail.quantity",
                          "$orderDetail.categoryMass"
                        ]
                      }
                    }
                  }
                }
              ],
              "completed": [
                {
                  "$match": {
                    "status": {
                      "$eq": "DA_HOAN_THANH"
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "ordergshistory",
                    "localField": "_id",
                    "foreignField": "orderID",
                    "as": "ordergshistory"
                  }
                },
                {
                  "$unwind": {
                    "path": "$ordergshistory",
                    // "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$lookup": {
                    "from": "historycylinder",
                    "localField": "ordergshistory._id",
                    "foreignField": "isShipOf",
                    "as": "historycylinder"
                  }
                },
                {
                  "$unwind": {
                    "path": "$historycylinder",
                    // "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$customer._id",
                      "customerCode": "$customer.code",
                      "customerName": "$customer.name",
                      "customerType": "$customerType",
                      "areaName": "$area.name",
                      "shippingType": "$ordergshistory.shippingType"
                    },
                    "count": {
                      "$sum": "$historycylinder.mass"
                    }
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$_id.customerId",
                      "customerCode": "$_id.customerCode",
                      "customerName": "$_id.customerName",
                      "customerType": "$_id.customerType",
                      "areaName": "$_id.areaName"
                    },
                    "count": {
                      "$accumulator": {
                        "init": `function () {
                          // Set the initial state
                          return {
                            GIAO_HANG: 0, TRA_BINH_DAY: 0
                          }
                        }`,
                        "accumulate": `function (state, count, shippingType) {
                          // Define how to update the state
                          if (shippingType === 'GIAO_HANG') {
                            state.GIAO_HANG += count
                          }
                          if (shippingType === 'TRA_BINH_DAY') {
                            state.GIAO_HANG -= count
                          }
                          return state
                        }`,
                        "accumulateArgs": [
                          "$count",
                          "$_id.shippingType"
                        ],
                        "merge": `function (state1, state2) {
                          // When the operator performs a merge,
                          return {
                            // add the fields from the two states
                            GIAO_HANG: state1.GIAO_HANG + state2.GIAO_HANG,
                            TRA_BINH_DAY: state1.TRA_BINH_DAY + state2.TRA_BINH_DAY
                          }
                        }`,
                        "finalize": `function (state) {
                          // After collecting the results from all documents,
                          return (state.GIAO_HANG - state.TRA_BINH_DAY) // calculate
                        }`,
                        "lang": "js"
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            "$project": {
              "result": {
                "$concatArrays": [
                  "$other",
                  "$completed"
                ]
              }
            }
          },
          {
            "$unwind": {
              "path": "$result"
            }
          },
          {
            "$group": {
              "_id": "$result._id",
              "count": {
                "$sum": "$result.count"
              }
            }
          }
        ])
        .toArray();

      // Thống kê - Lũy kế các loại bình (toDate + 1 tháng)
      const matchAggCylinderTypes = queryMatch(startOfCurrentMonth, dateOfCurrentMonth, areaId)
      const _aggregaCylinderTypes = await db
        .collection("ordergs")
        .aggregate([
          {
            "$match": matchAggCylinderTypes
          },
          {
            "$lookup": {
              "from": "user",
              "let": {
                "idCustomer": "$customers"
              },
              "pipeline": [
                {
                  "$match": {
                    "$expr": {
                      "$and": criteriaCustomer
                    }
                  }
                }
              ],
              "as": "customer"
            }
          },
          {
            "$unwind": {
              "path": "$customer"
            }
          },
          {
            "$addFields": {
              "customerType": {
                "$switch": {
                  "branches": [
                    {
                      "case": {
                        "$eq": [
                          "$customer.userType",
                          "Agency"
                        ]
                      },
                      "then": "Hệ Thống Đại Lý"
                    },
                    {
                      "case": {
                        "$eq": [
                          "$customer.customerType",
                          "Industry"
                        ]
                      },
                      "then": "Khách Hàng Công Nghiệp Bình"
                    }
                  ],
                  "default": "Tổng Đại Lý"
                }
              }
            }
          },
          {
            "$lookup": {
              "from": "area",
              "localField": "area",
              "foreignField": "_id",
              "as": "area"
            }
          },
          {
            "$unwind": {
              "path": "$area"
            }
          },
          {
            "$facet": {
              "other": [
                {
                  "$match": {
                    "status": {
                      "$ne": "DA_HOAN_THANH"
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "orderdetail",
                    "localField": "_id",
                    "foreignField": "orderGSId",
                    "as": "orderDetail"
                  }
                },
                {
                  "$unwind": {
                    "path": "$orderDetail"
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$customer._id",
                      "customerCode": "$customer.code",
                      "customerName": "$customer.name",
                      "customerType": "$customerType",
                      "areaName": "$area.name",
                      "shippingType": "$shippingType",
                      "cylinderTypeName": "$orderDetail.categoryName"
                    },
                    "count": {
                      "$sum": {
                        "$multiply": [
                          "$orderDetail.quantity",
                          "$orderDetail.categoryMass"
                        ]
                      }
                    }
                  }
                }
              ],
              "completed": [
                {
                  "$match": {
                    "status": {
                      "$eq": "DA_HOAN_THANH"
                    }
                  }
                },
                {
                  "$lookup": {
                    "from": "ordergshistory",
                    "localField": "_id",
                    "foreignField": "orderID",
                    "as": "ordergshistory"
                  }
                },
                {
                  "$unwind": {
                    "path": "$ordergshistory",
                    // "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$lookup": {
                    "from": "historycylinder",
                    "localField": "ordergshistory._id",
                    "foreignField": "isShipOf",
                    "as": "historycylinder"
                  }
                },
                {
                  "$unwind": {
                    "path": "$historycylinder",
                    // "preserveNullAndEmptyArrays": true
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$customer._id",
                      "customerCode": "$customer.code",
                      "customerName": "$customer.name",
                      "customerType": "$customerType",
                      "areaName": "$area.name",
                      "shippingType": "$ordergshistory.shippingType",
                      "cylinderTypeName": "$historycylinder.name"
                    },
                    "count": {
                      "$sum": "$historycylinder.mass"
                    }
                  }
                },
                {
                  "$group": {
                    "_id": {
                      "customerId": "$_id.customerId",
                      "customerCode": "$_id.customerCode",
                      "customerName": "$_id.customerName",
                      "customerType": "$_id.customerType",
                      "areaName": "$_id.areaName",
                      "cylinderTypeName": "$_id.cylinderTypeName"
                    },
                    "count": {
                      "$accumulator": {
                        "init": `function () {
                          // Set the initial state
                          return {
                            GIAO_HANG: 0, TRA_BINH_DAY: 0
                          }
                        }`,
                        "accumulate": `function (state, count, shippingType) {
                          // Define how to update the state
                          if (shippingType === 'GIAO_HANG') {
                            state.GIAO_HANG += count
                          }
                          if (shippingType === 'TRA_BINH_DAY') {
                            state.GIAO_HANG -= count
                          }
                          return state
                        }`,
                        "accumulateArgs": [
                          "$count",
                          "$_id.shippingType"
                        ],
                        "merge": `function (state1, state2) {
                          // When the operator performs a merge,
                          return {
                            // add the fields from the two states
                            GIAO_HANG: state1.GIAO_HANG + state2.GIAO_HANG,
                            TRA_BINH_DAY: state1.TRA_BINH_DAY + state2.TRA_BINH_DAY
                          }
                        }`,
                        "finalize": `function (state) {
                          // After collecting the results from all documents,
                          return (state.GIAO_HANG - state.TRA_BINH_DAY) // calculate
                        }`,
                        "lang": "js"
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            "$project": {
              "result": {
                "$concatArrays": [
                  "$other",
                  "$completed"
                ]
              }
            }
          },
          {
            "$unwind": {
              "path": "$result"
            }
          },
          {
            "$group": {
              "_id": "$result._id",
              "count": {
                "$sum": "$result.count"
              }
            }
          }
        ])
        .toArray();

      /* Lấy thông tin người dùng đã nhập vào cột 'Sản lượng kế hoạch' */
      // Tính tháng, năm cần tìm kiếm
      const month = moment(toDate).month() + 1;
      const year = moment(toDate).year();

      const _aggregaGasPlan = await db.collection("ordergasplan")
        .aggregate([
          {
            "$match": {
              "createdBy": ObjectId(userInfo.id),
              "yearPlan": year,
              "monthPlan": month
            }
          },
          {
            "$project": {
              "_id": 0,
              "customerId": 1,
              "customerCode": 1,
              "yearPlan": 1,
              "monthPlan": 1,
              "quantity": 1
            }
          }
        ])
        .toArray();

      return res.json({
        status: true,
        data: {
          _aggregateMonth,
          _aggregaToDate,
          _aggregaCylinderTypes,
          _aggregaGasPlan,
        },
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  findStatic: async function (req, res) {
    try {
      var history = null;
      if (req.query.error == "true" || req.query.error) {
        if (req.query.reason) {
          history = await HistoryCylinder.find({
            isDeleted: { "!=": true },
            manufacture: req.query.manufactureID,
            status: req.query.status,
            isGasSouth: req.query.isGS,
            mass: req.query.mass,
            reasonReturn: req.query.reason,
            createdAt: {
              ">=": new Date(req.query.From).toISOString(),
              "<=": new Date(req.query.To).toISOString(),
            },
          }).populate("cylinder");
        } else {
          history = await HistoryCylinder.find({
            isDeleted: { "!=": true },
            manufacture: req.query.manufactureID,
            status: req.query.status,
            isGasSouth: req.query.isGS,
            mass: req.query.mass,
            reasonReturn: { "!=": null },
            createdAt: {
              ">=": new Date(req.query.From).toISOString(),
              "<=": new Date(req.query.To).toISOString(),
            },
          }).populate("cylinder");
        }
      } else {
        type = req.query.type.toUpperCase();
        if (type == "RETURN") {
          console.log("zo return");
          history = await HistoryCylinder.find({
            isDeleted: { "!=": true },
            manufacture: req.query.manufactureID,
            status: req.query.status,
            isGasSouth: req.query.isGS,
            mass: req.query.mass,
            isReturn: "true",
            isShip: "false",
            createdAt: {
              ">=": new Date(req.query.From).toISOString(),
              "<=": new Date(req.query.To).toISOString(),
            },
          }).populate("cylinder");
        }
        if (type == "SHIP") {
          console.log("zo ship");
          history = await HistoryCylinder.find({
            isDeleted: { "!=": true },
            manufacture: req.query.manufactureID,
            status: req.query.status,
            isGasSouth: req.query.isGS,
            mass: req.query.mass,
            isShip: "true",
            isReturn: "false",
            createdAt: {
              ">=": new Date(req.query.From).toISOString(),
              "<=": new Date(req.query.To).toISOString(),
            },
          }).populate("cylinder");
        }
      }
      if (!history || history.length <= 0) {
        return res.json({
          success: false,
          message: "Thống kê không thành công hoặc không có data",
        });
      }
      let history1 = 0;
      let quantity = 0;
      for (let i = 0; i < history.length; i++) {
        history1 += history[i].mass;
        quantity++;
      }
      console.log(history1);
      return res.json({
        success: true,
        data: history,
        mass: history1,
        quantity: quantity,
        message: "Thống kê thành công",
      });
    } catch (error) {
      // console.log(error);
      return res.json(error.message);
    }
  },
  create: async function (req, res) {
    //status default is INIT
    try {
      if (
        !req.query.serial ||
        req.query.serial == null ||
        req.query.serial == ""
      ) {
        return res.json({
          success: false,
          message: "Mời nhập serial của bình",
        });
      }
      const checkUser = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      if (!checkUser || checkUser.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      const cylinder = await Cylinder.findOne({
        isDeleted: { "!=": true },
        serial: req.query.serial,
      });
      console.log(cylinder);
      if (!cylinder || cylinder.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy bình" });
      }
      if (
        !req.query.orderid ||
        req.query.orderid == null ||
        req.query.orderid == ""
      ) {
        return res.json({
          success: false,
          message: "Mời nhập mã của đơn hàng",
        });
      }
      const order = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.orderid,
      });
      if (!order || order.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      //================//
      const category = await CategoryCylinder.findOne({
        isDeleted: { "!=": true },
        id: cylinder.category,
      });
      if (!category || category.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy loại bình",
        });
      }
      const manufacture = await Manufacture.findOne({
        isDeleted: { "!=": true },
        id: cylinder.manufacture,
      });
      if (!manufacture || manufacture.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy tên thương hiệu",
        });
      }
      const { isShip, isReturn } = req.body;
      let checkValid = await HistoryCylinder.findOne({
        orderID: req.query.orderid,
        cylinder: cylinder.id,
        isShipOf: req.query.of,
        isShip,
        isReturn,
        reasonReturn: req.query.reason,
      });
      if (checkValid) {
        return res.json({
          success: false,
          message: "Bình này đã tồn tại trong thống kê này",
        });
      }
      let history = null;
      history = await HistoryCylinder.create({
        cylinder: cylinder.id,
        serial: element.serial,
        cylinderWeight: cylinder.weight,
        cylinderCheckedDate: cylinder.checkedDate,
        orderID: order.id,
        status: req.query.status,
        isShipOf: req.query.of,
        isShip,
        isReturn,
        createdBy: checkUser.id,
        category: category.id,
        name: category.name,
        mass: category.mass,
        manufacture: cylinder.manufacture,
        embossLetters: cylinder.embossLetters,
        productionDate: cylinder.productionDate,
        manufactureName: manufacture.name,
        color: cylinder.color,
        valve: cylinder.valve,
        reasonReturn: req.query.reason,
        amount: 1,
      }).fetch();
      if (!history || history.length <= 0) {
        return res.json({
          success: false,
          message: "Tạo lịch sử thất bại",
        });
      }
      var total6 = await HistoryCylinder.count({
        mass: 6,
        orderID: req.query.orderID,
        isShipOf: req.query.of,
        isShip,
        isReturn,
      });
      var total12 = await HistoryCylinder.count({
        mass: 12,
        orderID: req.query.orderID,
        isShipOf: req.query.of,
        isShip,
        isReturn,
      });
      var total20 = await HistoryCylinder.count({
        mass: 20,
        orderID: req.query.orderID,
        isShipOf: req.query.of,
        isShip,
        isReturn,
      });
      var total45 = await HistoryCylinder.count({
        mass: 45,
        orderID: req.query.orderID,
        isShipOf: req.query.of,
        isShip,
        isReturn,
      });
      var total = total6 + total12 + total20 + total45;
      var totalmass = total6 * 6 + total12 * 12 + total20 * 20 + total45 * 45;
      let updatedOrderGSHistory = await OrderGSHistory.updateOne({
        isDeleted: { "!=": true },
        _id: req.query.of,
      }).set({
        quantity: total,
        mass: totalmass,
        B6: total6,
        B12: total12,
        B20: total20,
        B45: total45,
      });
      return res.json({
        success: true,
        data: updatedOrderGSHistory,
        message: "Tạo lịch sử thành công",
      });
    } catch (error) {
      // end try
      return res.json({ success: false, message: error.message });
    }
  },

  // Thong tin binh trong 1 lich su giao nhan
  inforHistoryCylinder: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const { isShipOf } = req.query;

    if (!isShipOf) {
      return res.badRequest(Utils.jsonErr("Invalid parameter"));
    }

    try {
      let db = await HistoryCylinder.getDatastore().manager;
      let _Aggregate = await db
        .collection("historycylinder")
        .aggregate([
          {
            $match: { isShipOf: ObjectId(isShipOf) },
          },
          {
            $group: {
              _id: {
                manufacture: "$manufacture",
                manufactureName: "$manufactureName",
                category: "$category",
                name: "$name",
                color: "$color",
                valve: "$valve",
                status: "$status",
              },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      return res.json({
        success: true,
        data: _Aggregate,
        message: "ok",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi" + error.message,
      });
    }
  },
};
