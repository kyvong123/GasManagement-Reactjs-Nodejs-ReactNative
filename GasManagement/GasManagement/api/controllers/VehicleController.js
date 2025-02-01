/**
 * VehicleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ReportServices = require("../services/ReportService");
//const USER_TYPES = require('../constants/UserTypes');
const excel = require("node-excel-export");
const passValidator = require("password-validator");
const moment = require('moment');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const passSchema = new passValidator();
const passMinLen = 6;
const passMaxLen = 24;

// Scheme for password validation
// See ref https://github.com/tarunbatra/password-validator
passSchema
  .is()
  .min(passMinLen)
  .is()
  .max(passMaxLen)
  .has()
  .letters()
  .has()
  .digits();

const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: "FF000000",
      },
    },
    font: {
      color: {
        rgb: "FFFFFFFF",
      },
      sz: 14,
      bold: true,
      underline: true,
    },
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: "FFFFCCFF",
      },
    },
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: "FF00FF00",
      },
    },
  },
};

module.exports = {
  createTruck: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const {
      email,
      password,
      name,
      userType,
      userRole,
      isChildOf,
      owner,
      code,
      license_plate,
      load_capacity,
    } = req.body;

    const emailExist = await User.findOne({
      isDeleted: { "!=": true },
      email: email,
    });
    if (emailExist) {
      return res.badRequest(Utils.jsonErr("Email da ton tai"));
    }

    if (!name) {
      return res.badRequest(Utils.jsonErr("Name is required"));
    }

    if (!userType) {
      return res.badRequest(Utils.jsonErr("UserType is required"));

    }
    if (!userRole) {
      return res.badRequest(Utils.jsonErr("UserRole is required"));
    }

    if (!isChildOf) {
      return res.badRequest(Utils.jsonErr("IsChildOf is required"));
    }

    if (!owner) {
      return res.badRequest(Utils.jsonErr("Owner is required"));
    }

    if (!license_plate) {
      return res.badRequest(Utils.jsonErr("License plate is required"));
    }

    if (!passSchema.validate(password)) {
      return res.badRequest(
        Utils.jsonErr(
          "Password must be 6-24 characters, including letters and digits"
        )
      );
    }

    try {
      const result = await UserManager.createUser({
        email,
        password,
        name,
        userType,
        userRole,
        isChildOf,
        owner,
        code,
        license_plate,
        load_capacity,
      });

      if (!result.success) {
        return res.badRequest(Utils.jsonErr(result.err));
        // return res.json({ success: false, message: "Thêm xe thất bại" })
      }

      return res.json({
        success: true,
        data: result.data,
        message: "Thêm xe thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  getListTruck: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const { id } = req.query;

    if (!id) {
      return res.badRequest(Utils.jsonErr("ID is required"));
    }

    try {
      const result = await User.find({
        isChildOf: id,
        owner: id,
        userType: 'Vehicle',
        userRole: 'Truck',
        isDeleted: { "!=": true },
      });

      return res.json({
        success: true,
        data: result,
        message: "Lấy danh sách xe thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  updateTruck: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const { vehicleId, code, license_plate, load_capacity } = req.body;

    if (!vehicleId) {
      return res.badRequest(Utils.jsonErr("ID is required"));
    }

    dataUpdate = {};

    // if (code) dataUpdate.code = code;
    // if (license_plate) dataUpdate.license_plate = license_plate;
    if (load_capacity) dataUpdate.load_capacity = load_capacity;

    try {
      const updated = await User.updateOne({
        _id: vehicleId,
        isDeleted: { "!=": true },
      })
        .set(dataUpdate);

      if (!updated) {
        return res.json({ success: false, data: {}, message: "Cập nhật xe thất bại" });
      }

      return res.json({
        success: true,
        data: updated,
        message: "Cập nhật xe thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  deleteTruck: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const { vehicleId, } = req.body;
    const userInfo = req.userInfo;

    if (!vehicleId) {
      return res.badRequest(Utils.jsonErr("ID is required"));
    }

    const roles = ['SuperAdmin', 'Owner'];
    if (!roles.includes(userInfo.userRole)) {
      return res.badRequest(Utils.jsonErr("Không có quyền xóa"));
    }

    try {
      const deleted = await User.updateOne({
        id: vehicleId,
        isChildOf: userInfo.id,
      })
        .set({ isDeleted: true });

      if (!deleted) {
        return res.json({ success: false, data: {}, message: "Xóa xe thất bại" });
      }

      return res.json({
        success: true,
        data: deleted,
        message: "Xóa xe thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  getExcelTruck: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const { id } = req.query;

    if (!id) {
      return res.badRequest(Utils.jsonErr("ID is required"));
    }

    try {
      const heading = [["Danh sách xe"]];

      let specification;
      specification = {
        licensePlate: {
          // <- the key should match the actual data key
          displayName: "Biển số xe", // <- Here you specify the column header
          headerStyle: styles.cellGreen, // <- Header style
          // cellStyle: function(value, row) { // <- style renderer function
          //   // if the status is 1 then color in green else color in red
          //   // Notice how we use another cell value to style the current one
          //   return (row.status_id === 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible
          // },
          width: 100, // <- width in pixels
        },
        loadCapacity: {
          displayName: "Trọng tải của xe",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
      };

      const dataSet = await ReportServices.getDataForTruck(id);

      const report = excel.buildExport([
        // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
        {
          name: "Report", // <- Specify sheet name (optional)
          heading: heading, // <- Raw heading array (optional)
          specification: specification,
          data: dataSet, // <-- Report data
        },
      ]);

      res.setHeader("Content-disposition", "attachment; filename=report.xlsx");
      res.setHeader(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      return res.send(report);
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  getOrderHistory: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      vehicleId,
      type,
      // startDate,  // type: ISOString
      // endDate,    // type: ISOString
      page,
      limit,
    } = req.query;

    let {
      startDate,  // type: ISOString
      endDate,    // type: ISOString
    } = req.query;

    if (!vehicleId) {
      return res.badRequest(Utils.jsonErr("vehicleId is required"));
    }

    if (!type) {
      return res.badRequest(Utils.jsonErr("type is required"));
    }

    const SHIPPING_TYPE = ['GIAO_HANG', 'HOI_LUU'];
    if (!SHIPPING_TYPE.includes(type)) {
      return res.badRequest(Utils.jsonErr("Wrong shipping type"));
    }

    if (startDate) {
      const _startDate = moment(startDate, moment.ISO_8601)
      if (!_startDate.isValid()) {
        return res.badRequest(Utils.jsonErr('startDate is wrong format'))
      }
    }

    if (endDate) {
      const _endDate = moment(endDate, moment.ISO_8601)
      if (!_endDate.isValid()) {
        return res.badRequest(Utils.jsonErr('endDate is wrong format'))
      }
    }

    let _shippingTypes = ['GIAO_HANG', 'GIAO_VO'];
    if (type === 'HOI_LUU') {
      _shippingTypes = ['TRA_VO', 'TRA_BINH_DAY', 'TRA_VO_KHAC'];
    }


    // Phân trang
    let _page = parseInt(page);
    if (!Number.isInteger(_page) || _page < 1) {
      _page = 1;
    }

    let _limit = parseInt(limit);
    if (!Number.isInteger(_limit) || _limit < 1) {
      _limit = 10;
    }

    const _skip = _limit * (_page - 1);

    // Thời gian tìm kiếm
    if (!startDate && !endDate) {
      // Khoảng thời gian tìm kiếm: Trong ngày
      let now = moment();

      startDate = now.startOf("day").toISOString();
      endDate = now.endOf("day").toISOString();
    } else if (startDate && !endDate) {
      // Khoảng thời gian tìm kiếm: Từ startDate đến thời điểm hiện tại
      // startDate = startDate
      endDate = moment().endOf("day").toISOString();
    } else if (!startDate && endDate) {
      // Khoảng thời gian tìm kiếm: Từ 1970-01-01 đến endDate
      startDate = moment(0).toISOString();
      // endDate = endDate
    }

    try {
      const db = await OrderGSHistory.getDatastore().manager;
      const _aggregate = await db
        .collection("ordergshistory")
        .aggregate([
          {
            "$match": {
              "createdAt": {
                "$gte": startDate,
                "$lte": endDate
              },
              "vehicle": ObjectId(vehicleId),
              "shippingType": {
                "$in": _shippingTypes
              }
            }
          },
          {
            "$sort": {
              "createdAt": -1.0
            }
          },
          {
            "$lookup": {
              "from": "ordergs",
              "localField": "orderID",
              "foreignField": "_id",
              "as": "order"
            }
          },
          {
            "$unwind": {
              "path": "$order",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            "$lookup": {
              "from": "user",
              "localField": "customer",
              "foreignField": "_id",
              "as": "customer"
            }
          },
          {
            "$unwind": {
              "path": "$customer",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            "$group": {
              "_id": {
                "orderId": "$order._id",
                "orderCode": "$order.orderCode",
                "customerName": "$customer.name",
                "customerAddress": "$customer.address"
              },
              "date": {
                "$push": "$createdAt"
              }
            }
          },
          {
            "$project": {
              "_id": 0.0,
              "orderId": "$_id.orderId",
              "orderCode": "$_id.orderCode",
              "date": 1.0,
              "customerName": "$_id.customerName",
              "customerAddress": "$_id.customerAddress"
            }
          }
        ])
        .toArray();

      return res.json({
        success: true,
        data: _aggregate,
        message: "Lấy lịch sử đơn hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  getDetailOrderHistory: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const { orderHistoryId, type } = req.query;

    if (!orderHistoryId) {
      return res.badRequest(Utils.jsonErr("orderHistoryId is required"));
    }

    const SHIPPING_TYPE = ['GIAO_HANG', 'HOI_LUU'];
    if (!SHIPPING_TYPE.includes(type)) {
      return res.badRequest(Utils.jsonErr("Wrong shipping type"));
    }

    let _shippingTypes = ['GIAO_HANG', 'GIAO_VO'];
    if (type === 'HOI_LUU') {
      _shippingTypes = ['TRA_VO', 'TRA_BINH_DAY', 'TRA_VO_KHAC'];
    }

    try {
      const db = await OrderGSHistory.getDatastore().manager;
      const _aggregate = await db
        .collection("ordergshistory")
        .aggregate([
          {
            "$match": {
              "orderID": ObjectId(orderHistoryId),
              "shippingType": {
                "$in": _shippingTypes
              }
            }
          },
          {
            "$lookup": {
              "from": "historycylinder",
              "localField": "_id",
              "foreignField": "isShipOf",
              "as": "historycylinder"
            }
          },
          {
            "$unwind": {
              "path": "$historycylinder",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            "$lookup": {
              "from": "reason",
              "localField": "historycylinder.reasonReturn",
              "foreignField": "_id",
              "as": "reasonReturn"
            }
          },
          {
            "$unwind": {
              "path": "$reasonReturn",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            "$group": {
              "_id": {
                "orderHistoryId": "$_id",
                "manufactureId": "$historycylinder.manufacture",
                "manufactureName": "$historycylinder.manufactureName",
                "cylinderTypeId": "$historycylinder.category",
                "cylinderTypeName": "$historycylinder.name",
                "color": "$historycylinder.color",
                "valve": "$historycylinder.valve",
                "reasonReturnId": "$reasonReturn._id",
                "reasonReturnName": "$reasonReturn.name"
              },
              "count": {
                "$sum": 1.0
              },
              "deliveryDate": {
                "$first": "$deliveryDate"
              },
              "driverName": {
                "$first": "$driverName"
              },
              "licensePlate": {
                "$first": "$transport"
              }
            }
          },
          {
            "$group": {
              "_id": {
                "orderHistoryId": "$_id.orderHistoryId"
              },
              "deliveryDate": {
                "$first": "$deliveryDate"
              },
              "driverName": {
                "$first": "$driverName"
              },
              "licensePlate": {
                "$first": "$licensePlate"
              },
              "total": {
                "$sum": "$count"
              },
              "cylinders": {
                "$push": {
                  "manufactureId": "$_id.manufactureId",
                  "manufactureName": "$_id.manufactureName",
                  "cylinderTypeId": "$_id.cylinderTypeId",
                  "cylinderTypeName": "$_id.cylinderTypeName",
                  "color": "$_id.color",
                  "valve": "$_id.valve",
                  "count": "$count",
                  "reasonReturnId": "$_id.reasonReturnId",
                  "reasonReturnName": "$_id.reasonReturnName"
                }
              }
            }
          }
        ])
        .toArray();

      return res.json({
        success: true,
        data: _aggregate,
        message: "Lấy chi tiết lịch sử đơn hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

};
