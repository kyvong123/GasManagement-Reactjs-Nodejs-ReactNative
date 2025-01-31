/**
 * StatisticController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const excel = require("node-excel-export");

const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: "FF8ac2ce",
      },
    },
    font: {
      color: {
        rgb: "FF000000",
      },
      sz: 14,
      bold: true,
      // underline: true
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
  getTotalImport: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty query'));
    }

    const {
      id,
      startDate,
      endDate,
    } = req.query

    if (!id) {
      return res.badRequest(Utils.jsonErr('id is required'));
    }

    if (!startDate) {
      return res.badRequest(Utils.jsonErr('startDate is required'));
    }

    if (!endDate) {
      return res.badRequest(Utils.jsonErr('endDate is required'));
    }

    try {
      const _object = await User.findOne({ id })
      if (!_object) {
        return res.badRequest(Utils.jsonErr('Không tìm thấy thông tin trạm cần thống kê'))
      }

      const _startDate = moment(startDate, moment.ISO_8601)
      if (!_startDate.isValid()) {
        return res.badRequest(Utils.jsonErr('startDate is wrong format'))
      }

      const _endDate = moment(endDate, moment.ISO_8601)
      if (!_endDate.isValid()) {
        return res.badRequest(Utils.jsonErr('endDate is wrong format'))
      }

      /**
       * Tìm thông tin thương hiệu và loại bình
       * Cách 1
       */
      // Tìm thông tin toàn bộ thương hiệu
      // const manufactures = await Manufacture.find()

      // Tìm thông tin toàn bộ loại bình
      // const cylinderTypes = await CategoryCylinder.find()

      // Thống kê
      let db = await HistoryNonSerialDetail.getDatastore().manager;

      let criteria = {
        "createdAt": {
          $gte: startDate,
          $lte: endDate,
        },
        "objectId": ObjectId(_object.id),
        "type": { $in: ["IMPORT", "TURN_BACK"] },
      }

      let _aggregate = await db.collection('historynonserialdetail').aggregate([
        {
          $match: criteria
        },
        {
          $group: {
            _id: { typeCell: "$typeCell", cylinderType: "$cylinderType" },
            totalQuantity: { $sum: "$quantity" }
          }
        },


        /**
         * Tìm thông tin thương hiệu và loại bình
         * Cách 2
         */
        // {
        //   $lookup:
        //   {
        //     from: "manufacture",
        //     localField: "_id.manufacture",
        //     foreignField: "_id",
        //     as: "ThuongHieu"
        //   }
        // },
        {
          $lookup:
          {
            from: "categorycylinder",
            localField: "_id.cylinderType",
            foreignField: "_id",
            as: "LoaiBinh"
          }
        },
        // {
        //   $unwind:
        //   {
        //     path: "$ThuongHieu",
        //     preserveNullAndEmptyArrays: false
        //   }
        // },
        {
          $unwind:
          {
            path: "$LoaiBinh",
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $project:
          {
            // specifications
            manufacture: "$_id.typeCell",
            manufactureName: {
              $cond: { if: { $eq: ["$_id.typeCell", 'GASSOUTH'] }, then: 'Vỏ GasSouth', else: 'Vỏ khác' }
            },
            cylinderType: "$LoaiBinh._id",
            cylinderTypeName: "$LoaiBinh.name",
            totalQuantity: 1,
            _id: 0,
          }
        },
      ]).toArray()

      // const data = _aggregate.reduce(
      //   (previousValue, currentValue) => {
      //     const foundManu = manufactures.find(manu => manu.id = currentValue._id.manufacture)
      //     const foundCytp = cylinderTypes.find(cytp => cytp.id = currentValue._id.cylinderTypeName)

      //     return previousValue.concat({
      //       "manufacture": currentValue._id.manufacture,
      //       "manufactureName": foundManu ? foundManu.name : 'Unknow',
      //       "cylinderType": currentValue._id.cylinderType,
      //       "cylinderTypeName": foundCytp ? foundCytp.name : 'Unknow',
      //       "totalQuantity": currentValue.totalQuantity,
      //     })
      //   },
      //   []
      // )
      return res.json({
        success: true,
        message: "Lấy thông tin thống kê thành công",
        // data,
        data: _aggregate,
      })

    } catch (error) {
      return res.json({ success: false, message: "Gặp lỗi khi lấy thông tin", data: [] });
    }
  },

  getTotalExport: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty query'));
    }

    const {
      id,
      startDate,
      endDate,
    } = req.query

    if (!id) {
      return res.badRequest(Utils.jsonErr('id is required'));
    }

    if (!startDate) {
      return res.badRequest(Utils.jsonErr('startDate is required'));
    }

    if (!endDate) {
      return res.badRequest(Utils.jsonErr('endDate is required'));
    }

    try {
      const _object = await User.findOne({ id })
      if (!_object) {
        return res.badRequest(Utils.jsonErr('Không tìm thấy thông tin trạm cần thống kê'))
      }

      const _startDate = moment(startDate, moment.ISO_8601)
      if (!_startDate.isValid()) {
        return res.badRequest(Utils.jsonErr('startDate is wrong format'))
      }

      const _endDate = moment(endDate, moment.ISO_8601)
      if (!_endDate.isValid()) {
        return res.badRequest(Utils.jsonErr('endDate is wrong format'))
      }

      /**
       * Tìm thông tin thương hiệu và loại bình
       * Cách 1
       */
      // Tìm thông tin toàn bộ thương hiệu
      // const manufactures = await Manufacture.find()

      // Tìm thông tin toàn bộ loại bình
      // const cylinderTypes = await CategoryCylinder.find()

      // Thống kê
      let db = await HistoryNonSerialDetail.getDatastore().manager;

      let criteria = {
        "createdAt": {
          $gte: startDate,
          $lte: endDate,
        },
        "objectId": ObjectId(_object.id),
        "type": "EXPORT",
      }
      let _aggregate = await db.collection('historynonserialdetail').aggregate([
        {
          $match: criteria
        },
        {
          $group: {
            _id: { typeCell: "$typeCell", cylinderType: "$cylinderType" },
            totalQuantity: { $sum: "$quantity" }
          }
        },


        /**
         * Tìm thông tin thương hiệu và loại bình
         * Cách 2
         */
        // {
        //   $lookup:
        //   {
        //     from: "manufacture",
        //     localField: "_id.manufacture",
        //     foreignField: "_id",
        //     as: "ThuongHieu"
        //   }
        // },
        {
          $lookup:
          {
            from: "categorycylinder",
            localField: "_id.cylinderType",
            foreignField: "_id",
            as: "LoaiBinh"
          }
        },
        // {
        //   $unwind:
        //   {
        //     path: "$ThuongHieu",
        //     preserveNullAndEmptyArrays: false
        //   }
        // },
        {
          $unwind:
          {
            path: "$LoaiBinh",
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $project:
          {
            // specifications
            manufacture: "$_id.typeCell",
            manufactureName: {
              $cond: { if: { $eq: ["$_id.typeCell", 'GASSOUTH'] }, then: 'Vỏ GasSouth', else: 'Vỏ khác' }
            },
            cylinderType: "$LoaiBinh._id",
            cylinderTypeName: "$LoaiBinh.name",
            totalQuantity: 1,
            _id: 0,
          }
        },
      ]).toArray()

      // const data = _aggregate.reduce(
      //   (previousValue, currentValue) => {
      //     const foundManu = manufactures.find(manu => manu.id = currentValue._id.manufacture)
      //     const foundCytp = cylinderTypes.find(cytp => cytp.id = currentValue._id.cylinderTypeName)

      //     return previousValue.concat({
      //       "manufacture": currentValue._id.manufacture,
      //       "manufactureName": foundManu ? foundManu.name : 'Unknow',
      //       "cylinderType": currentValue._id.cylinderType,
      //       "cylinderTypeName": foundCytp ? foundCytp.name : 'Unknow',
      //       "totalQuantity": currentValue.totalQuantity,
      //     })
      //   },
      //   []
      // )

      return res.json({
        success: true,
        message: "Lấy thông tin thống kê thành công",
        // data,
        data: _aggregate,
      })

    } catch (error) {
      return res.json({ success: false, message: "Gặp lỗi khi lấy thông tin", data: [] });
    }
  },

  getTotalLiquidation: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty query'));
    }

    const {
      id,
      startDate,
      endDate,
    } = req.query

    if (!id) {
      return res.badRequest(Utils.jsonErr('id is required'));
    }

    if (!startDate) {
      return res.badRequest(Utils.jsonErr('startDate is required'));
    }

    if (!endDate) {
      return res.badRequest(Utils.jsonErr('endDate is required'));
    }

    try {
      const _object = await User.findOne({ id })
      if (!_object) {
        return res.badRequest(Utils.jsonErr('Không tìm thấy thông tin trạm cần thống kê'))
      }

      const _startDate = moment(startDate, moment.ISO_8601)
      if (!_startDate.isValid()) {
        return res.badRequest(Utils.jsonErr('startDate is wrong format'))
      }

      const _endDate = moment(endDate, moment.ISO_8601)
      if (!_endDate.isValid()) {
        return res.badRequest(Utils.jsonErr('endDate is wrong format'))
      }

      /**
       * Tìm thông tin thương hiệu và loại bình
       * Cách 1
       */
      // Tìm thông tin toàn bộ thương hiệu
      // const manufactures = await Manufacture.find()

      // Tìm thông tin toàn bộ loại bình
      // const cylinderTypes = await CategoryCylinder.find()

      // Thống kê
      let db = await HistoryNonSerialDetail.getDatastore().manager;

      let criteria = {
        "createdAt": {
          $gte: startDate,
          $lte: endDate,
        },
        "objectId": ObjectId(_object.id),
        "type": "LIQUIDATE",
      }

      let _aggregate = await db.collection('historynonserialliquidationdetail').aggregate([
        {
          $match: criteria
        },
        {
          $group: {
            _id: { numberContract: "$numberContract", cylinderType: "$cylinderType" },
            totalQuantity: { $sum: "$quantity" }
          }
        },


        /**
         * Tìm thông tin thương hiệu và loại bình
         * Cách 2
         */
        // {
        //   $lookup:
        //   {
        //     from: "manufacture",
        //     localField: "_id.manufacture",
        //     foreignField: "_id",
        //     as: "ThuongHieu"
        //   }
        // },
        {
          $lookup:
          {
            from: "categorycylinder",
            localField: "_id.cylinderType",
            foreignField: "_id",
            as: "LoaiBinh"
          }
        },
        // {
        //   $unwind:
        //   {
        //     path: "$ThuongHieu",
        //     preserveNullAndEmptyArrays: false
        //   }
        // },
        {
          $unwind:
          {
            path: "$LoaiBinh",
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $project:
          {
            // specifications
            numberContract: "$_id.numberContract",
            cylinderType: "$LoaiBinh._id",
            cylinderTypeName: "$LoaiBinh.name",
            totalQuantity: 1,
            _id: 0,
          }
        },
      ]).toArray()
      console.log(_aggregate)
      return res.json({
        success: true,
        message: "Lấy thông tin thống kê thành công",
        // data,
        data: _aggregate,
      })

    } catch (error) {
      return res.json({ success: false, message: "Gặp lỗi khi lấy thông tin", data: [] });
    }
  },

  // Thống kê hồi lưu về kho xe
  getStatisticTurnBackVehicle: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty query'));
    }

    const {
      vehicleId,
      startDate,
      endDate,
    } = req.query

    if (!vehicleId) {
      return res.badRequest(Utils.jsonErr('vehicleId is required'));
    }

    if (!startDate) {
      return res.badRequest(Utils.jsonErr('startDate is required'));
    }

    if (!endDate) {
      return res.badRequest(Utils.jsonErr('endDate is required'));
    }

    try {
      const _object = await User.findOne({ id: vehicleId })
      if (!_object) {
        return res.badRequest(Utils.jsonErr('Không tìm thấy thông tin xe cần thống kê'))
      }

      const _startDate = moment(startDate, moment.ISO_8601)
      if (!_startDate.isValid()) {
        return res.badRequest(Utils.jsonErr('startDate is wrong format'))
      }

      const _endDate = moment(endDate, moment.ISO_8601)
      if (!_endDate.isValid()) {
        return res.badRequest(Utils.jsonErr('endDate is wrong format'))
      }

      /**
       * Tìm thông tin thương hiệu và loại bình
       * Cách 1
       */
      // Tìm thông tin toàn bộ thương hiệu
      // const manufactures = await Manufacture.find()

      // Tìm thông tin toàn bộ loại bình
      // const cylinderTypes = await CategoryCylinder.find()

      // Thống kê
      let db = await OrderGSHistory.getDatastore().manager;

      let criteria = {
        "createdAt": {
          $gte: startDate,
          $lte: endDate,
        },
        "vehicle": ObjectId(_object.id),
        "shippingType": {
          "$in": [
            "TRA_VO",
            "TRA_BINH_DAY",
            "TRA_VO_KHAC"
          ]
        },
      }

      let _aggregate = await db.collection('ordergshistory').aggregate([
        {
          $match: criteria
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
            "path": "$historycylinder"
          }
        },
        {
          "$group": {
            "_id": {
              "manufactureId": "$historycylinder.manufacture",
              "manufactureName": "$historycylinder.manufactureName",
              "categoryId": "$historycylinder.category",
              "categoryName": "$historycylinder.name"
            },
            "count": {
              "$sum": 1.0
            }
          }
        },
      ]).toArray()

      return res.json({
        success: true,
        message: "Lấy thông tin thống kê thành công",
        // data,
        data: _aggregate,
      })

    } catch (error) {
      return res.json({ success: false, message: "Gặp lỗi khi lấy thông tin", data: [] });
    }
  },

  // Lịch sử hồi lưu về kho xe
  getHistoriesTurnBackVehicle: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty query'));
    }

    const {
      vehicleId,
      startDate,
      endDate,
    } = req.query

    if (!vehicleId) {
      return res.badRequest(Utils.jsonErr('vehicleId is required'));
    }

    if (!startDate) {
      return res.badRequest(Utils.jsonErr('startDate is required'));
    }

    if (!endDate) {
      return res.badRequest(Utils.jsonErr('endDate is required'));
    }

    try {
      const _object = await User.findOne({ id: vehicleId })
      if (!_object) {
        return res.badRequest(Utils.jsonErr('Không tìm thấy thông tin xe cần thống kê'))
      }

      const _startDate = moment(startDate, moment.ISO_8601)
      if (!_startDate.isValid()) {
        return res.badRequest(Utils.jsonErr('startDate is wrong format'))
      }

      const _endDate = moment(endDate, moment.ISO_8601)
      if (!_endDate.isValid()) {
        return res.badRequest(Utils.jsonErr('endDate is wrong format'))
      }

      /**
       * Tìm thông tin thương hiệu và loại bình
       * Cách 1
       */
      // Tìm thông tin toàn bộ thương hiệu
      // const manufactures = await Manufacture.find()

      // Tìm thông tin toàn bộ loại bình
      // const cylinderTypes = await CategoryCylinder.find()

      // Thống kê
      let db = await OrderGSHistory.getDatastore().manager;

      let criteria = {
        "createdAt": {
          $gte: startDate,
          $lte: endDate,
        },
        "vehicle": ObjectId(_object.id),
        "shippingType": {
          "$in": [
            "TRA_VO",
            "TRA_BINH_DAY",
            "TRA_VO_KHAC"
          ]
        },
      }

      let _aggregate = await db.collection('ordergshistory').aggregate([
        {
          $match: criteria
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
          "$project": {
            "customerName": "$customer.name",
            "vehicle": "$transport",
            "date": "$deliveryDate",
            "count": {
              "$size": "$historycylinder"
            }
          }
        },
      ]).toArray()

      return res.json({
        success: true,
        message: "Lấy thông tin thống kê thành công",
        // data,
        data: _aggregate,
      })

    } catch (error) {
      return res.json({ success: false, message: "Gặp lỗi khi lấy thông tin", data: [] });
    }
  },

  // Xuất excel - danh sách bình hồi lưu về kho xe
  excelCylindersTurnbackToVehicle: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const { id } = req.query;

    if (!id) {
      return res.badRequest(Utils.jsonErr("ID is required"));
    }

    try {
      const heading = [["Báo cáo hồi lưu kho xe"]];

      let specification;
      specification = {
        serial: {
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
        color: {
          displayName: "Màu sắc",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        checkedDate: {
          displayName: "Hạn kiểm định",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        valve: {
          displayName: "Loại van",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        cylinderTypeName: {
          displayName: "Loại bình",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        cylinderWeight: {
          displayName: "Cân nặng",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        returnWeight: {
          displayName: "Cân nặng hồi lưu",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        remainingGas: {
          displayName: "Gas dư",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        vehicleCode: {
          displayName: "Mã kho nhập",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        vehicleName: {
          displayName: "Tên kho nhập",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        date: {
          displayName: "Ngày hồi lưu",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        customerCode: {
          displayName: "Mã khách hàng",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        customerName: {
          displayName: "Tên khách hàng",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        driverName: {
          displayName: "Tên tài xế",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        licensePlate: {
          displayName: "Biển số",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
        returnPlace: {
          displayName: "Nơi hồi lưu",
          headerStyle: styles.cellGreen,
          // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
          //   return (value === 1) ? 'Active' : 'Inactive';
          // },
          width: 100, // <- width in chars (when the number is passed as string)
        },
      };

      const db = await OrderGSHistory.getDatastore().manager;
      const dataSet = await db
        .collection("ordergshistory")
        .aggregate([
          {
            "$match": {
              "_id": ObjectId(id)
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
            "$lookup": {
              "from": "user",
              "localField": "vehicle",
              "foreignField": "_id",
              "as": "vehicle"
            }
          },
          {
            "$unwind": {
              "path": "$vehicle",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            "$lookup": {
              "from": "user",
              "localField": "vehicle.isChildOf",
              "foreignField": "_id",
              "as": "station"
            }
          },
          {
            "$unwind": {
              "path": "$station",
              "preserveNullAndEmptyArrays": true
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
            "$project": {
              "serial": "$historycylinder.serial",
              "color": "$historycylinder.color",
              "checkedDate": "$historycylinder.cylinderCheckedDate",
              "valve": "$historycylinder.valve",
              "cylinderTypeName": "$historycylinder.name",
              "cylinderWeight": "$historycylinder.cylinderWeight",
              "returnWeight": "$historycylinder.weight",
              "remainingGas": {
                "$subtract": [
                  "$historycylinder.weight",
                  {
                    "$add": [
                      "$historycylinder.cylinderWeight",
                      "$threshold"
                    ]
                  }
                ]
              },
              "vehicleCode": "$vehicle.code",
              "vehicleName": "$vehicle.name",
              "date": "$createdAt",
              "customerCode": "$customer.code",
              "customerName": "$customer.name",
              "driverName": "$driverName",
              "licensePlate": "$transport",
              "returnPlace": "$station.name"
            }
          }
        ])
        .toArray();

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

};
