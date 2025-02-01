/**
 * StatisticVer2Controller
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require("moment");
const mongoose = require("mongoose");
// const StatisticVer2Report = require("../models/StatisticalVer2Report");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  // Thống kê trạm
  // Nếu xem từ Chi nhánh thì thống kê các trạm của chi nhánh đó
  getStatistic: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
      statisticalType, // isIn: ['byItself', 'byItsChildren']
    } = req.query;

    let {
      startDate, // ISODate
      endDate, // ISODate
    } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    if (!statisticalType) {
      return res.badRequest(Utils.jsonErr("statisticalType is required"));
    } else {
      const STATISTIC_TYPES = ["byItself", "byItsChildren"];
      if (!STATISTIC_TYPES.includes(statisticalType)) {
        return res.badRequest(Utils.jsonErr("statisticalType is wrong"));
      }
    }

    try {
      const db = await StatisticVer2.getDatastore().manager;
      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // Tìm info chi nhánh Bình Khí
      const infoBinhKhi = await User.findOne({
        isDeleted: { "!=": true },
        email: "chinhanhbinhkhi@pgs.com.vn",
      });
      if (!infoBinhKhi) {
        return res.badRequest(Utils.jsonErr("Bình Khí not found"));
      }

      const listXuongSon = await User.find({
        isDeleted: { "!=": true },
        userType: "Fixer",
        stationType: "Own",
      });
      let infoXuongSon = [];
      listXuongSon.forEach((item) => infoXuongSon.push(ObjectId(item.id)));
      if (!infoXuongSon) {
        return res.badRequest(Utils.jsonErr("Xưởng sơn not found"));
      }
      //begin hoapd tim tat ca cac nha may sua chua
      const listStationIDBinhkhi = [];
      const childsFixer = await User.find({
        isDeleted: { "!=": true },
        userType: "Fixer",
      });

      childsFixer.forEach((child) => {
        listStationIDBinhkhi.push(ObjectId(child.id));
      });

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp thống kê chính nó ,
      if (statisticalType === "byItself") {
        //#region Dữ liểu trả về - Mẫu Cũ

        //#region Dữ liểu trả về - Mẫu Mới
        //begin Vong

        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                isTruck: { $ne: true },
                objectId: ObjectId(target),
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1.0,
              },
            },

            {
              $lookup: {
                from: "categorycylinder",
                localField: "cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "objectId",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    stationName: "$stationInfo.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      importEmptyCylinder: {
                        $sum: "$importCylinder.quantity",
                      },
                      returnFullCylinder: {
                        $sum: "$returnFullCylinder.quantity",
                      },
                      importEmptyCylinderObject: "$importCylinder",
                      exportCylinderObject: "$exportCylinder",
                      returnFullCylinderObject: "$returnFullCylinder",
                      exportEmptyCylinderObject: "$exportEmptyCylinder",
                      exportCylinder: {
                        $sum: "$exportCylinder.quantity",
                      },
                      exportEmptyCylinder: {
                        $sum: "$exportEmptyCylinder.quantity",
                      },
                      // massExport: "$LoaiBinh.mass",
                      inventoryCylinder: "$inventoryCylinder",
                      cylinderTypeId: "$cylinderTypeId",
                      importNewCylinder: "$importNewCylinder",
                      importOldCylinder: "$importOldCylinder",
                      importCylinderNewFromBinhKhi: {
                        $sum: {
                          $cond: [
                            {
                              $and: [
                                {
                                  $eq: [
                                    "$importCylinder.from",
                                    ObjectId(infoBinhKhi.id),
                                  ],
                                },
                                { $eq: ["importCylinder.status", "new"] },
                              ],
                            },
                            "$importCylinder.quantity",
                            0,
                          ],
                        },
                      },
                      importCylinderOldFromBinhKhi: {
                        $sum: {
                          $cond: [
                            {
                              $and: [
                                {
                                  $eq: [
                                    "$importCylinder.from",
                                    ObjectId(infoBinhKhi.id),
                                  ],
                                },
                                { $eq: ["importCylinder.status", "old"] },
                              ],
                            },
                            "$importCylinder.quantity",
                            0,
                          ],
                        },
                      },
                      importCylinderFromXuongSon: {
                        $sum: {
                          $cond: [
                            {
                              $in: ["$importCylinder.from", infoXuongSon],
                            },
                            "$importCylinder.quantity",
                            0,
                          ],
                        },
                      },
                      importCylinderFromElsewhere: {
                        $sum: {
                          $cond: [
                            {
                              $and: [
                                {
                                  $ne: [
                                    "$importCylinder.from",
                                    ObjectId(infoBinhKhi.id),
                                  ],
                                },
                                {
                                  $not: {
                                    $in: ["$importCylinder.from", infoXuongSon],
                                  },
                                },
                              ],
                            },
                            "$importCylinder.quantity",
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          ])
          .toArray();

        isInArray = (array, id) => {
          if (array.some((item) => item.equals(id))) return true;
          else return false;
        };

        // returnData.data

        //end vong
        // var result = [];
        // returnData.data[0].detail &&
        //   returnData.data[0].detail.reduce(function (res, value) {
        //     if (!res[value.mass.toString() + value.stationName]) {
        //       res[value.mass.toString() + value.stationName] = {
        //         mass: value.mass,
        //         code: value.code,
        //         name: value.name,
        //         stationName: value.stationName,
        //         id: value.id,
        //         statistic: {
        //           createdCylinder: 0,
        //           massExport: 0,
        //           returnFullCylinder: 0,
        //           exportCylinder: 0,
        //           exportEmptyCylinder: 0,
        //           importEmptyCylinder: 0,
        //           importNewCylinder: 0,
        //           importOldCylinder: 0,
        //           importCylinderFromBinhKhi: 0,
        //           importCylinderFromXuongSon: 0,
        //           importCylinderFromElsewhere: 0,
        //           importEmptyCylinderObject: [],
        //           exportCylinderObject: [],
        //           exportEmptyCylinderObject: [],
        //           returnFullCylinderObject: [],
        //         },
        //       };
        //       result.push(res[value.mass.toString() + value.stationName]);
        //     }
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importEmptyCylinder +=
        //       value.statistic.importEmptyCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importNewCylinder +=
        //       value.statistic.importNewCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importOldCylinder +=
        //       value.statistic.importOldCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importCylinderFromBinhKhi +=
        //       value.statistic.importCylinderFromBinhKhi || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importCylinderFromXuongSon +=
        //       value.statistic.importCylinderFromXuongSon || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importCylinderFromElsewhere +=
        //       value.statistic.importCylinderFromElsewhere || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.createdCylinder += value.statistic.createdCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.massExport += value.statistic.massExport || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.returnFullCylinder +=
        //       value.statistic.returnFullCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.exportCylinder += value.statistic.exportCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.exportEmptyCylinder +=
        //       value.statistic.exportEmptyCylinder || 0;
        //     if (value.statistic.importEmptyCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.importEmptyCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .importEmptyCylinderObject,
        //         ...[value.statistic.importEmptyCylinderObject],
        //       ];

        //     if (value.statistic.returnFullCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.returnFullCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .returnFullCylinderObject,
        //         ...[value.statistic.returnFullCylinderObject],
        //       ];

        //     if (value.statistic.exportCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.exportCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .exportCylinderObject,
        //         ...[value.statistic.exportCylinderObject],
        //       ];

        //     if (value.statistic.exportEmptyCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.exportEmptyCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .exportEmptyCylinderObject,
        //         ...[value.statistic.exportEmptyCylinderObject],
        //       ];
        //     return res;
        //   }, {});
        // returnData.data[0].detail = result;
        let a = 5;
        //#endregion
      }
      // Trường hợp thống kê các đơn vị con
      else {
        // Tìm các trạm con của chi nhánh

        //begin vong2

        let {
          startDate, // ISODate
          endDate, // ISODate
        } = req.query;

        const childs = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: "Factory",
          userRole: "Owner",
        });

        const listStationID = [];

        childs.forEach((child) => {
          listStationID.push(ObjectId(child.id));
        });

        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                isTruck: { $ne: true },
                objectId: { $in: listStationID },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1.0,
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "objectId",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    objectId: "$objectId",
                    stationName: "$stationInfo.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      exportCylinder: {
                        $sum: "$exportCylinder.quantity",
                      },
                      importEmptyCylinder: {
                        $sum: "$importCylinder.quantity",
                      },
                      exportEmptyCylinder: {
                        $sum: "$exportEmptyCylinder.quantity",
                      },
                      returnFullCylinder: {
                        $sum: "$returnFullCylinder.quantity",
                      },
                      returnFullCylinderObject: "$returnFullCylinder",
                      exportCylinderObject: "$exportCylinder",
                      exportEmptyCylinderObject: "$exportEmptyCylinder",
                      importEmptyCylinderObject: "$importCylinder",
                    },
                  },
                },
              },
            },
          ])
          .toArray();

        let a = 5;
        //end vong 2
        var result = [];
        returnData.data[0].detail.reduce((objectTong, value) => {
          if (!objectTong[value.stationName]) {
            objectTong[value.stationName] = {
              stationName: value.stationName,
              detail: [],
            };
            result.push(objectTong[value.stationName]);
          }
          objectTong[value.stationName].detail.push(value);
          return objectTong;
        }, {});
        returnData.data[0].detail = result;
      }

      returnData.success = true;
      returnData.resCode = "SUCCESS-00030";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      console.error(error.message);
      return res.json({
        status: false,
        resCode: "CATCH-00012",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  getStatisticKhoXe: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
      statisticalType, // isIn: ['byItself', 'byItsChildren']
    } = req.query;

    let {
      startDate, // ISODate
      endDate, // ISODate
    } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    if (!statisticalType) {
      return res.badRequest(Utils.jsonErr("statisticalType is required"));
    } else {
      const STATISTIC_TYPES = ["byItself", "byItsChildren"];
      if (!STATISTIC_TYPES.includes(statisticalType)) {
        return res.badRequest(Utils.jsonErr("statisticalType is wrong"));
      }
    }

    try {
      const db = await StatisticVer2.getDatastore().manager;
      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // Tìm info chi nhánh Bình Khí
      const infoBinhKhi = await User.findOne({
        isDeleted: { "!=": true },
        email: "chinhanhbinhkhi@pgs.com.vn",
      });
      if (!infoBinhKhi) {
        return res.badRequest(Utils.jsonErr("Bình Khí not found"));
      }

      const listXuongSon = await User.find({
        isDeleted: { "!=": true },
        userType: "Fixer",
        stationType: "Own",
      });
      let infoXuongSon = [];
      listXuongSon.forEach((item) => infoXuongSon.push(ObjectId(item.id)));
      if (!infoXuongSon) {
        return res.badRequest(Utils.jsonErr("Xưởng sơn not found"));
      }
      //begin hoapd tim tat ca cac nha may sua chua
      const listStationIDBinhkhi = [];
      const childsFixer = await User.find({
        isDeleted: { "!=": true },
        userType: "Fixer",
      });

      childsFixer.forEach((child) => {
        listStationIDBinhkhi.push(ObjectId(child.id));
      });

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp thống kê chính nó ,
      if (statisticalType === "byItself") {
        //#region Dữ liểu trả về - Mẫu Cũ

        //#region Dữ liểu trả về - Mẫu Mới
        //begin Vong

        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                isTruck: { $eq: true },
                objectId: ObjectId(target),
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1.0,
              },
            },

            {
              $lookup: {
                from: "categorycylinder",
                localField: "cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "objectId",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    stationName: "$stationInfo.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      importEmptyCylinder: {
                        $sum: "$importCylinder.quantity",
                      },
                      returnFullCylinder: {
                        $sum: "$returnFullCylinder.quantity",
                      },
                      importEmptyCylinderObject: "$importCylinder",
                      exportCylinderObject: "$exportCylinder",
                      returnFullCylinderObject: "$returnFullCylinder",
                      exportEmptyCylinderObject: "$exportEmptyCylinder",
                      exportCylinder: {
                        $sum: "$exportCylinder.quantity",
                      },
                      exportEmptyCylinder: {
                        $sum: "$exportEmptyCylinder.quantity",
                      },
                      // massExport: "$LoaiBinh.mass",
                      inventoryCylinder: "$inventoryCylinder",
                      cylinderTypeId: "$cylinderTypeId",
                      importNewCylinder: "$importNewCylinder",
                      importOldCylinder: "$importOldCylinder",
                      importCylinderFromBinhKhi: {
                        $sum: {
                          $cond: [
                            {
                              $eq: [
                                "$importCylinder.from",
                                ObjectId(infoBinhKhi.id),
                              ],
                            },
                            "$importCylinder.quantity",
                            0,
                          ],
                        },
                      },
                      importCylinderFromXuongSon: {
                        $sum: {
                          $cond: [
                            {
                              $in: ["$importCylinder.from", infoXuongSon],
                            },
                            "$importCylinder.quantity",
                            0,
                          ],
                        },
                      },
                      importCylinderFromElsewhere: {
                        $sum: {
                          $cond: [
                            {
                              $and: [
                                {
                                  $ne: [
                                    "$importCylinder.from",
                                    ObjectId(infoBinhKhi.id),
                                  ],
                                },
                                {
                                  $not: {
                                    $in: ["$importCylinder.from", infoXuongSon],
                                  },
                                },
                              ],
                            },
                            "$importCylinder.quantity",
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          ])
          .toArray();

        isInArray = (array, id) => {
          if (array.some((item) => item.equals(id))) return true;
          else return false;
        };

        // returnData.data

        //end vong
        // var result = [];
        // returnData.data[0].detail &&
        //   returnData.data[0].detail.reduce(function (res, value) {
        //     if (!res[value.mass.toString() + value.stationName]) {
        //       res[value.mass.toString() + value.stationName] = {
        //         mass: value.mass,
        //         code: value.code,
        //         name: value.name,
        //         stationName: value.stationName,
        //         id: value.id,
        //         statistic: {
        //           createdCylinder: 0,
        //           massExport: 0,
        //           returnFullCylinder: 0,
        //           exportCylinder: 0,
        //           exportEmptyCylinder: 0,
        //           importEmptyCylinder: 0,
        //           importNewCylinder: 0,
        //           importOldCylinder: 0,
        //           importCylinderFromBinhKhi: 0,
        //           importCylinderFromXuongSon: 0,
        //           importCylinderFromElsewhere: 0,
        //           importEmptyCylinderObject: [],
        //           exportCylinderObject: [],
        //           exportEmptyCylinderObject: [],
        //           returnFullCylinderObject: [],
        //         },
        //       };
        //       result.push(res[value.mass.toString() + value.stationName]);
        //     }
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importEmptyCylinder +=
        //       value.statistic.importEmptyCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importNewCylinder +=
        //       value.statistic.importNewCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importOldCylinder +=
        //       value.statistic.importOldCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importCylinderFromBinhKhi +=
        //       value.statistic.importCylinderFromBinhKhi || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importCylinderFromXuongSon +=
        //       value.statistic.importCylinderFromXuongSon || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.importCylinderFromElsewhere +=
        //       value.statistic.importCylinderFromElsewhere || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.createdCylinder += value.statistic.createdCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.massExport += value.statistic.massExport || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.returnFullCylinder +=
        //       value.statistic.returnFullCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.exportCylinder += value.statistic.exportCylinder || 0;
        //     res[
        //       value.mass.toString() + value.stationName
        //     ].statistic.exportEmptyCylinder +=
        //       value.statistic.exportEmptyCylinder || 0;
        //     if (value.statistic.importEmptyCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.importEmptyCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .importEmptyCylinderObject,
        //         ...[value.statistic.importEmptyCylinderObject],
        //       ];

        //     if (value.statistic.returnFullCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.returnFullCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .returnFullCylinderObject,
        //         ...[value.statistic.returnFullCylinderObject],
        //       ];

        //     if (value.statistic.exportCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.exportCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .exportCylinderObject,
        //         ...[value.statistic.exportCylinderObject],
        //       ];

        //     if (value.statistic.exportEmptyCylinderObject)
        //       res[
        //         value.mass.toString() + value.stationName
        //       ].statistic.exportEmptyCylinderObject = [
        //         ...res[value.mass.toString() + value.stationName].statistic
        //           .exportEmptyCylinderObject,
        //         ...[value.statistic.exportEmptyCylinderObject],
        //       ];
        //     return res;
        //   }, {});
        // returnData.data[0].detail = result;
        let a = 5;
        //#endregion
      }
      // Trường hợp thống kê các đơn vị con
      else {
        // Tìm các trạm con của chi nhánh

        //begin vong2

        let {
          startDate, // ISODate
          endDate, // ISODate
        } = req.query;

        const childs = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: "Factory",
          userRole: "Owner",
        });

        const listStationID = [];

        childs.forEach((child) => {
          listStationID.push(ObjectId(child.id));
        });

        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                isTruck: { $eq: true },
                objectId: { $in: listStationID },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1.0,
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "objectId",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    objectId: "$objectId",
                    stationName: "$stationInfo.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      exportCylinder: {
                        $sum: "$exportCylinder.quantity",
                      },
                      importEmptyCylinder: {
                        $sum: "$importCylinder.quantity",
                      },
                      exportEmptyCylinder: {
                        $sum: "$exportEmptyCylinder.quantity",
                      },
                      returnFullCylinder: {
                        $sum: "$returnFullCylinder.quantity",
                      },
                      returnFullCylinderObject: "$returnFullCylinder",
                      exportCylinderObject: "$exportCylinder",
                      exportEmptyCylinderObject: "$exportEmptyCylinder",
                      importEmptyCylinderObject: "$importCylinder",
                    },
                  },
                },
              },
            },
          ])
          .toArray();

        let a = 5;
        //end vong 2
        var result = [];
        returnData.data[0].detail.reduce((objectTong, value) => {
          if (!objectTong[value.stationName]) {
            objectTong[value.stationName] = {
              stationName: value.stationName,
              detail: [],
            };
            result.push(objectTong[value.stationName]);
          }
          objectTong[value.stationName].detail.push(value);
          return objectTong;
        }, {});
        returnData.data[0].detail = result;
      }

      returnData.success = true;
      returnData.resCode = "SUCCESS-00030";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      console.error(error.message);
      return res.json({
        status: false,
        resCode: "CATCH-00012",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  // Thống kê chi nhánh
  // Xem thống kê từ công ty mẹ - chọn "Tất cả"
  getAggregate: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
    } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    let {
      startDate, // ISODate
      endDate, // ISODate
    } = req.query;

    try {
      const db = await StatisticVer2.getDatastore().manager;

      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // // Tìm parentRoot
      // const parent = await getRootParent(target);
      // if (!parent) {
      //     return res.badRequest(Utils.jsonErr("parentRoot not found"));
      // }

      // Tìm info chi nhánh Bình Khí
      const infoBinhKhi = await User.findOne({
        isDeleted: { "!=": true },
        email: "chinhanhbinhkhi@pgs.com.vn",
      });
      if (!infoBinhKhi) {
        return res.badRequest(Utils.jsonErr("Bình Khí not found"));
      }

      // // Tìm danh sách loại bình
      // const cylinderCategory = await CategoryCylinder.find({
      //     isDeleted: { "!=": true },
      //     createdBy: parent.id,
      //     isDeleted: false,
      // });
      // const _numberCategory = cylinderCategory.length;

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp target là công ty mẹ
      // Xem thông tin của các chi nhánh
      if (
        infoTarget.userType === "Factory" &&
        infoTarget.userRole === "SuperAdmin"
      ) {
        // Tìm các chi nhánh con (bao gồm trường hợp đặc biệt: NMSC)
        const regions = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: { in: ["Region", "Fixer"] },
          userRole: "SuperAdmin",
        });

        const _list = await Promise.all(
          regions.map(async (region) => {
            // Nếu là Nhà máy sửa chữa thì lấy luôn
            if (region.userType === "Fixer") {
              return ObjectId(region.id);
            } else {
              // Tìm các trạm con của chi nhánh
              const stations = await User.find({
                isDeleted: { "!=": true },
                isChildOf: region.id,
                userType: "Factory",
                userRole: "Owner",
              });

              const stationIds = [];

              stations.forEach((station) => {
                stationIds.push(ObjectId(station.id));
              });

              return stationIds;
            }
          })
        );

        const listStationID = _list.flat();
        //#endregion
        //begin returnData aggregate
        //#region Dữ liểu trả về - Mẫu Mới
        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                objectId: { $in: listStationID },
                isTruck: { $ne: true },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                turnbackCylinder: {
                  $sum: {
                    $sum: "$turnbackCylinder.quantity",
                  },
                },
                returnFullCylinder: {
                  $sum: {
                    $sum: "$returnFullCylinder.quantity",
                  },
                },
                exportCylinder: {
                  $sum: {
                    $sum: "$exportCylinder.quantity",
                  },
                },
                exportCylinderTo: {
                  $push: "$exportCylinder.to",
                },
                exportCylinderObject: {
                  $push: "$exportCylinder",
                },

                exportEmptyCylinder: {
                  $sum: {
                    $sum: "$exportEmptyCylinder.quantity",
                  },
                },
                exportEmptyCylinderObject: {
                  $push: "$exportEmptyCylinder",
                },
                exportEmptyCylinderTo: {
                  $push: "$exportEmptyCylinder.to",
                },
                importEmptyCylinderFrom: {
                  $push: "$importCylinder.from",
                },
                importEmptyCylinder: {
                  $sum: {
                    $sum: "$importCylinder.quantity",
                  },
                },
                importEmptyCylinderObject: {
                  $push: "$importCylinder",
                },
                returnFullCylinderObject: {
                  $push: "$returnFullCylinder",
                },
                numberExport: {
                  $sum: "$numberExport",
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id.objectId",
                foreignField: "_id",
                as: "inforStation",
              },
            },
            {
              $unwind: {
                path: "$inforStation",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "user",
                let: {
                  idParrentUser: "$inforStation.isChildOf",
                  idChild: "$inforStation._id",
                  userTypeChild: "$inforStation.userType",
                  emailChild: "$inforStation.email",
                  nameChild: "$inforStation.name",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$_id", "$$idParrentUser"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$idChild",
                          else: "$_id",
                        },
                      },
                      email: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$emailChild",
                          else: "$email",
                        },
                      },
                      name: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$nameChild",
                          else: "$name",
                        },
                      },
                    },
                  },
                ],
                as: "inforRegion",
              },
            },
            {
              $unwind: {
                path: "$inforRegion",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  idRegion: "$inforRegion._id",
                  cylinderTypeId: "$_id.cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                turnbackCylinder: {
                  $sum: "$turnbackCylinder",
                },
                exportCylinder: {
                  $sum: "$exportCylinder",
                },
                exportCylinderTo: {
                  $push: "$exportCylinderTo",
                },
                exportCylinderObject: {
                  $push: "$exportCylinderObject",
                },
                exportEmptyCylinderObject: {
                  $push: "$exportEmptyCylinderObject",
                },
                importEmptyCylinderObject: {
                  $push: "$importEmptyCylinderObject",
                },
                returnFullCylinder: {
                  $sum: "$returnFullCylinder",
                },
                returnFullCylinderObject: {
                  $push: "$returnFullCylinderObject",
                },
                sumExportEmptyCylinder: {
                  $sum: "$exportEmptyCylinder",
                },
                importEmptyCylinder: {
                  $sum: "$importEmptyCylinder",
                },
                exportEmptyCylinderTo: {
                  $push: "$exportEmptyCylinderTo",
                },
                importEmptyCylinderFrom: {
                  $push: "$importEmptyCylinderFrom",
                },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.idRegion",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      turnbackCylinder: "$turnbackCylinder",
                      exportCylinder: "$exportCylinder",
                      exportCylinderTo: "$exportCylinderTo",
                      exportCylinderObject: "$exportCylinderObject",
                      exportEmptyCylinderObject: "$exportEmptyCylinderObject",
                      importEmptyCylinderObject: "$importEmptyCylinderObject",
                      exportEmptyCylinder: "$sumExportEmptyCylinder",
                      exportEmptyCylinderTo: "$exportEmptyCylinderTo",
                      importEmptyCylinder: "$importEmptyCylinder",
                      importEmptyCylinderFrom: "$importEmptyCylinderFrom",
                      massExport: {
                        $multiply: ["$exportCylinder", "$LoaiBinh.mass"],
                      },
                      massReturnFull: {
                        $multiply: ["$returnFullCylinder", "$LoaiBinh.mass"],
                      },
                      inventoryCylinder: "$inventoryCylinder",
                      returnFullCylinder: "$returnFullCylinder",
                      returnFullCylinderObject: "$returnFullCylinderObject",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: "$stationInfo._id",
                name: "$stationInfo.name",
                detail: "$detail",
              },
            },
          ])
          .toArray();

        let c = returnData.data;
        //#endregion
      }
      // Trường hợp còn lại, target là chi nhánh
      // Xem thông tin của các trạm con
      else {
        // Tìm các trạm con của chi nhánh
        const childs = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: "Factory",
          userRole: "Owner",
        });

        const listStationID = [];

        childs.forEach((child) => {
          listStationID.push(ObjectId(child.id));
        });

        //#region Dữ liểu trả về - Mẫu Mới
        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                objectId: { $in: listStationID },
                isTruck: { $ne: true },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $unwind: {
                path: "$importCylinder",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$exportEmptyCylinder",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                importCylinderFromBinhKhi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$importCylinder.from", ObjectId(infoBinhKhi.id)],
                      },
                      "$importCylinder.quantity",
                      0,
                    ],
                  },
                },
                importCylinderFromElsewhere: {
                  $sum: {
                    $cond: [
                      {
                        $ne: ["$importCylinder.from", ObjectId(infoBinhKhi.id)],
                      },
                      "$importCylinder.quantity",
                      0,
                    ],
                  },
                },
                turnbackCylinder: {
                  $sum: {
                    $sum: "$turnbackCylinder.quantity",
                  },
                },
                returnFullCylinder: {
                  $sum: {
                    $sum: "$returnFullCylinder.quantity",
                  },
                },
                exportEmptyCylinderToBinhKhi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$exportEmptyCylinder.to", listStationIDBinhkhi],
                      },
                      "$exportEmptyCylinder.quantity",
                      0,
                    ],
                  },
                },
                exportEmptyCylinderToElsewhere: {
                  $sum: {
                    $cond: [
                      {
                        $ne: [
                          "$exportEmptyCylinder.to",
                          ObjectId(infoBinhKhi.id),
                        ],
                      },
                      "$exportEmptyCylinder.quantity",
                      0,
                    ],
                  },
                },
                exportCylinder: {
                  $sum: {
                    $sum: "$exportCylinder.quantity",
                  },
                },
                numberExport: {
                  $sum: "$numberExport",
                },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      importCylinderFromBinhKhi: "$importCylinderFromBinhKhi",
                      importCylinderFromElsewhere:
                        "$importCylinderFromElsewhere",
                      turnbackCylinder: "$turnbackCylinder",
                      returnFullCylinder: "$returnFullCylinder",
                      exportEmptyCylinderToBinhKhi:
                        "$exportEmptyCylinderToBinhKhi",
                      exportEmptyCylinderToElsewhere:
                        "$exportEmptyCylinderToElsewhere",
                      exportCylinder: "$exportCylinder",
                      numberExport: "$numberExport",
                      massExport: {
                        $multiply: ["$exportCylinder", "$LoaiBinh.mass"],
                      },
                      inventoryCylinder: "$inventoryCylinder",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: "$stationInfo._id",
                name: "$stationInfo.name",
                detail: "$detail",
              },
            },
          ])
          .toArray();
        //#endregion
      }
      //end tất cả

      returnData.success = true;
      returnData.resCode = "SUCCESS-00031";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      console.error(error.message);
      return res.json({
        status: false,
        resCode: "CATCH-00013",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  getAggregateKhoXe: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
    } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    let {
      startDate, // ISODate
      endDate, // ISODate
    } = req.query;

    try {
      const db = await StatisticVer2.getDatastore().manager;

      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // // Tìm parentRoot
      // const parent = await getRootParent(target);
      // if (!parent) {
      //     return res.badRequest(Utils.jsonErr("parentRoot not found"));
      // }

      // Tìm info chi nhánh Bình Khí
      const infoBinhKhi = await User.findOne({
        isDeleted: { "!=": true },
        email: "chinhanhbinhkhi@pgs.com.vn",
      });
      if (!infoBinhKhi) {
        return res.badRequest(Utils.jsonErr("Bình Khí not found"));
      }

      // // Tìm danh sách loại bình
      // const cylinderCategory = await CategoryCylinder.find({
      //     isDeleted: { "!=": true },
      //     createdBy: parent.id,
      //     isDeleted: false,
      // });
      // const _numberCategory = cylinderCategory.length;

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp target là công ty mẹ
      // Xem thông tin của các chi nhánh
      if (
        infoTarget.userType === "Factory" &&
        infoTarget.userRole === "SuperAdmin"
      ) {
        // Tìm các chi nhánh con (bao gồm trường hợp đặc biệt: NMSC)
        const regions = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: { in: ["Region", "Fixer"] },
          userRole: "SuperAdmin",
        });

        const _list = await Promise.all(
          regions.map(async (region) => {
            // Nếu là Nhà máy sửa chữa thì lấy luôn
            if (region.userType === "Fixer") {
              return ObjectId(region.id);
            } else {
              // Tìm các trạm con của chi nhánh
              const stations = await User.find({
                isDeleted: { "!=": true },
                isChildOf: region.id,
                userType: "Factory",
                userRole: "Owner",
              });

              const stationIds = [];

              stations.forEach((station) => {
                stationIds.push(ObjectId(station.id));
              });

              return stationIds;
            }
          })
        );

        const listStationID = _list.flat();
        //#endregion
        //begin returnData aggregate
        //#region Dữ liểu trả về - Mẫu Mới
        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                objectId: { $in: listStationID },
                isTruck: { $eq: true },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                turnbackCylinder: {
                  $sum: {
                    $sum: "$turnbackCylinder.quantity",
                  },
                },
                returnFullCylinder: {
                  $sum: {
                    $sum: "$returnFullCylinder.quantity",
                  },
                },
                exportCylinder: {
                  $sum: {
                    $sum: "$exportCylinder.quantity",
                  },
                },
                exportCylinderTo: {
                  $push: "$exportCylinder.to",
                },
                exportCylinderObject: {
                  $push: "$exportCylinder",
                },

                exportEmptyCylinder: {
                  $sum: {
                    $sum: "$exportEmptyCylinder.quantity",
                  },
                },
                exportEmptyCylinderObject: {
                  $push: "$exportEmptyCylinder",
                },
                exportEmptyCylinderTo: {
                  $push: "$exportEmptyCylinder.to",
                },
                importEmptyCylinderFrom: {
                  $push: "$importCylinder.from",
                },
                importEmptyCylinder: {
                  $sum: {
                    $sum: "$importCylinder.quantity",
                  },
                },
                importEmptyCylinderObject: {
                  $push: "$importCylinder",
                },
                numberExport: {
                  $sum: "$numberExport",
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id.objectId",
                foreignField: "_id",
                as: "inforStation",
              },
            },
            {
              $unwind: {
                path: "$inforStation",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "user",
                let: {
                  idParrentUser: "$inforStation.isChildOf",
                  idChild: "$inforStation._id",
                  userTypeChild: "$inforStation.userType",
                  emailChild: "$inforStation.email",
                  nameChild: "$inforStation.name",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$_id", "$$idParrentUser"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$idChild",
                          else: "$_id",
                        },
                      },
                      email: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$emailChild",
                          else: "$email",
                        },
                      },
                      name: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$nameChild",
                          else: "$name",
                        },
                      },
                    },
                  },
                ],
                as: "inforRegion",
              },
            },
            {
              $unwind: {
                path: "$inforRegion",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  idRegion: "$inforRegion._id",
                  cylinderTypeId: "$_id.cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                turnbackCylinder: {
                  $sum: "$turnbackCylinder",
                },
                exportCylinder: {
                  $sum: "$exportCylinder",
                },
                exportCylinderTo: {
                  $push: "$exportCylinderTo",
                },
                exportCylinderObject: {
                  $push: "$exportCylinderObject",
                },
                exportEmptyCylinderObject: {
                  $push: "$exportEmptyCylinderObject",
                },
                importEmptyCylinderObject: {
                  $push: "$importEmptyCylinderObject",
                },
                returnFullCylinder: {
                  $sum: "$returnFullCylinder",
                },
                sumExportEmptyCylinder: {
                  $sum: "$exportEmptyCylinder",
                },
                importEmptyCylinder: {
                  $sum: "$importEmptyCylinder",
                },
                exportEmptyCylinderTo: {
                  $push: "$exportEmptyCylinderTo",
                },
                importEmptyCylinderFrom: {
                  $push: "$importEmptyCylinderFrom",
                },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.idRegion",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      turnbackCylinder: "$turnbackCylinder",
                      exportCylinder: "$exportCylinder",
                      exportCylinderTo: "$exportCylinderTo",
                      exportCylinderObject: "$exportCylinderObject",
                      exportEmptyCylinderObject: "$exportEmptyCylinderObject",
                      importEmptyCylinderObject: "$importEmptyCylinderObject",
                      exportEmptyCylinder: "$sumExportEmptyCylinder",
                      exportEmptyCylinderTo: "$exportEmptyCylinderTo",
                      importEmptyCylinder: "$importEmptyCylinder",
                      importEmptyCylinderFrom: "$importEmptyCylinderFrom",
                      massExport: {
                        $multiply: ["$exportCylinder", "$LoaiBinh.mass"],
                      },
                      massReturnFull: {
                        $multiply: ["$returnFullCylinder", "$LoaiBinh.mass"],
                      },
                      inventoryCylinder: "$inventoryCylinder",
                      returnFullCylinder: "$returnFullCylinder",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: "$stationInfo._id",
                name: "$stationInfo.name",
                detail: "$detail",
              },
            },
          ])
          .toArray();

        let c = returnData.data;
        //#endregion
      }
      // Trường hợp còn lại, target là chi nhánh
      // Xem thông tin của các trạm con
      else {
        // Tìm các trạm con của chi nhánh
        const childs = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: "Factory",
          userRole: "Owner",
        });

        const listStationID = [];

        childs.forEach((child) => {
          listStationID.push(ObjectId(child.id));
        });

        //#region Dữ liểu trả về - Mẫu Mới
        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                objectId: { $in: listStationID },
                isTruck: { $ne: true },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $unwind: {
                path: "$importCylinder",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$exportEmptyCylinder",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                importCylinderFromBinhKhi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$importCylinder.from", ObjectId(infoBinhKhi.id)],
                      },
                      "$importCylinder.quantity",
                      0,
                    ],
                  },
                },
                importCylinderFromElsewhere: {
                  $sum: {
                    $cond: [
                      {
                        $ne: ["$importCylinder.from", ObjectId(infoBinhKhi.id)],
                      },
                      "$importCylinder.quantity",
                      0,
                    ],
                  },
                },
                turnbackCylinder: {
                  $sum: {
                    $sum: "$turnbackCylinder.quantity",
                  },
                },
                returnFullCylinder: {
                  $sum: {
                    $sum: "$returnFullCylinder.quantity",
                  },
                },
                exportEmptyCylinderToBinhKhi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$exportEmptyCylinder.to", listStationIDBinhkhi],
                      },
                      "$exportEmptyCylinder.quantity",
                      0,
                    ],
                  },
                },
                exportEmptyCylinderToElsewhere: {
                  $sum: {
                    $cond: [
                      {
                        $ne: [
                          "$exportEmptyCylinder.to",
                          ObjectId(infoBinhKhi.id),
                        ],
                      },
                      "$exportEmptyCylinder.quantity",
                      0,
                    ],
                  },
                },
                exportCylinder: {
                  $sum: {
                    $sum: "$exportCylinder.quantity",
                  },
                },
                numberExport: {
                  $sum: "$numberExport",
                },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    statistic: {
                      createdCylinder: "$createdCylinder",
                      importCylinderFromBinhKhi: "$importCylinderFromBinhKhi",
                      importCylinderFromElsewhere:
                        "$importCylinderFromElsewhere",
                      turnbackCylinder: "$turnbackCylinder",
                      returnFullCylinder: "$returnFullCylinder",
                      exportEmptyCylinderToBinhKhi:
                        "$exportEmptyCylinderToBinhKhi",
                      exportEmptyCylinderToElsewhere:
                        "$exportEmptyCylinderToElsewhere",
                      exportCylinder: "$exportCylinder",
                      numberExport: "$numberExport",
                      massExport: {
                        $multiply: ["$exportCylinder", "$LoaiBinh.mass"],
                      },
                      inventoryCylinder: "$inventoryCylinder",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: "$stationInfo._id",
                name: "$stationInfo.name",
                detail: "$detail",
              },
            },
          ])
          .toArray();
        //#endregion
      }
      returnData.success = true;
      returnData.resCode = "SUCCESS-00031";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      console.error(error.message);
      return res.json({
        status: false,
        resCode: "CATCH-00013",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  // Thống kê nhà máy sửa chữa
  // Xem thống kê từ công ty mẹ - chọn Nhà máy sửa chữa
  getAggregateRepairFactory: async function (req, res) {
    try {
      const objectId = req.query.objectId;
      let startDate = req.query.startDate;
      let endDate = req.query.endDate;
      const condition = req.query.condition;

      const CONDITIONS = ["NEW", "OLD"];

      if (!CONDITIONS.includes(condition.toUpperCase())) {
        return res.badRequest(Utils.jsonErr("Wrong condition!"));
      }

      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: objectId,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      const db = await StatisticVer2.getDatastore().manager;
      //begin returndata aggregaterepair
      const returnData = await db
        .collection("statisticver2")
        .aggregate(
          [
            {
              $match: {
                objectId: ObjectId(objectId),
                isTruck: { $ne: true },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryNewCylinder: {
                  $last: "$inventoryNewCylinder",
                },
                createdNewCylinder: {
                  $sum: "$createdOldCylinder",
                },

                createdOldCylinder: {
                  $sum: "$createdOldCylinder",
                },
                exportEmptyNewCylinder: {
                  $sum: "$exportEmptyNewCylinder",
                },
                exportEmptyOldCylinder: {
                  $sum: "$exportEmptyOldCylinder",
                },
                exportEmptyCylinder: { $push: "$exportEmptyCylinder" },
                // exportEmptyCylinderObject: {
                //   $push: {
                //     object: "$exportEmptyCylinder",
                //     newQuantity: "$exportEmptyNewCylinder",
                //     oldQuantity: "$exportEmptyOldCylinder",
                //   },
                // },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                Declaration: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    name: "$LoaiBinh.name",
                    numberNew: "$createdNewCylinder",
                    numberOld: "$createdOldCylinder",
                  },
                },
                Export: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    name: "$LoaiBinh.name",
                    numberNew: "$exportEmptyNewCylinder",
                    numberOld: "$exportEmptyOldCylinder",
                    exportEmptyCylinderObject: "$exportEmptyCylinder",
                  },
                },
                Inventory: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    name: "$LoaiBinh.name",
                    numberNew: {
                      $subtract: [
                        "$createdNewCylinder",
                        "$exportEmptyNewCylinder",
                      ],
                    },
                    numberOld: {
                      $subtract: [
                        "$createdOldCylinder",
                        "$exportEmptyOldCylinder",
                      ],
                    },
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
          {
            allowDiskUse: true,
          }
        )
        .toArray();

      return res.json({
        success: true,
        returnData,
      });
    } catch (error) {
      console.error(error.message);
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },

  getAggregateRepairFactoryKhoXe: async function (req, res) {
    try {
      const objectId = req.query.objectId;
      let startDate = req.query.startDate;
      let endDate = req.query.endDate;
      const condition = req.query.condition;

      const CONDITIONS = ["NEW", "OLD"];

      if (!CONDITIONS.includes(condition.toUpperCase())) {
        return res.badRequest(Utils.jsonErr("Wrong condition!"));
      }

      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: objectId,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      const db = await StatisticVer2.getDatastore().manager;
      //begin returndata aggregaterepair
      const returnData = await db
        .collection("statisticver2")
        .aggregate(
          [
            {
              $match: {
                objectId: ObjectId(objectId),
                isTruck: { $eq: true },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryNewCylinder: {
                  $last: "$inventoryNewCylinder",
                },
                createdNewCylinder: {
                  $sum: "$createdOldCylinder",
                },

                createdOldCylinder: {
                  $sum: "$createdOldCylinder",
                },
                exportEmptyNewCylinder: {
                  $sum: "$exportEmptyNewCylinder",
                },
                exportEmptyOldCylinder: {
                  $sum: "$exportEmptyOldCylinder",
                },
                // exportEmptyCylinderObject: {
                //   $push: {
                //     object: "$exportEmptyCylinder",
                //     newQuantity: "$exportEmptyNewCylinder",
                //     oldQuantity: "$exportEmptyOldCylinder",
                //   },
                // },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                Declaration: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    name: "$LoaiBinh.name",
                    numberNew: "$createdNewCylinder",
                    numberOld: "$createdOldCylinder",
                  },
                },
                Export: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    name: "$LoaiBinh.name",
                    numberNew: "$exportEmptyNewCylinder",
                    numberOld: "$exportEmptyOldCylinder",
                    exportEmptyCylinderObject: "$exportEmptyCylinderObject",
                  },
                },
                Inventory: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    name: "$LoaiBinh.name",
                    numberNew: {
                      $subtract: [
                        "$createdNewCylinder",
                        "$exportEmptyNewCylinder",
                      ],
                    },
                    numberOld: {
                      $subtract: [
                        "$createdOldCylinder",
                        "$exportEmptyOldCylinder",
                      ],
                    },
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
          {
            allowDiskUse: true,
          }
        )
        .toArray();

      return res.json({
        success: true,
        returnData,
      });
    } catch (error) {
      console.error(error.message);
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },
};
