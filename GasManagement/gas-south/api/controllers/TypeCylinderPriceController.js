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

  getPriceOfCustomers: async function (req, res) {
    try {
      if (
        !req.query.deliverydate ||
        !req.query.customer ||
        !req.query.cylinderType
      ) {
        return res.json({
          success: false,
          message: "Vui lòng chọn ngày tháng và khách hàng, loai bang gia !!",
        });
      }

      var checkUser = await User.findOne({
        _id: req.query.customer,
      });
      if (!checkUser || checkUser.length <= 0) {
        return res.json({
          success: false,
          message: "Không có khách hàng này",
        });
      }

      if (req.query.customer) {
        let lstPrice = await TypeCylinderPrice.find({
          isDeleted: { "!=": true },
          cylinderType: req.query.cylinderType,
          fromDate: {
            "<=": req.query.deliverydate,
          },
          toDate: {
            ">=": req.query.deliverydate,
          },
          customer: req.query.customer,
          //status: true,
        }).populate("priceDetail", { isDeleted: { "!=": true } });
        if (!lstPrice || lstPrice.length <= 0) {
          return res.json({
            success: false,
            message: "Không tìm thấy bảng giá",
          });
        }

        return res.json({
          success: true,
          data: lstPrice,
          message: "Lấy bảng giá theo ngày tháng và khách hàng thành công",
        });
      }
    } catch (error) {
      return res.json({
        success: false,

        message: "Gặp lỗi khi lấy bảng giá",
      });
    }
  },

  ShowListTypeprice: async function (req, res) {
    try {
      typePricelist = await TypeCylinderPrice.find({
        isDeleted: { "!=": true },
      })
        .populate("customer")
        // .populate("categoryCylinder")
        // .populate("colorGas")
        // .populate("valve")
        .sort("fromDate");
      if (!typePricelist) {
        return res.json({
          success: false,
          message: "Không tìm thấy bảng giá",
        });
      }
      return res.json({
        success: true,
        data: typePricelist,
        message: "Lấy danh sách bảng giá thành công",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy bảng giá",
      });
    }
  },

  getTypeCylinderPriceDetail: async function (req, res) {
    try {
      //
      let db = await TypeCylinderPriceDetail.getDatastore().manager;
      let _Aggregate = await db
        .collection("typecylinderpricedetail")
        .aggregate([
          // {
          //   $match: {
          //     typePriceId: ObjectId("62d8e1c9f137397a889a71b7"),
          //   },
          // },
          {
            $lookup: {
              from: "user",
              localField: "customer",
              foreignField: "_id",
              as: "KhachHang",
            },
          },
          {
            $unwind: {
              path: "$KhachHang",
            },
          },
          {
            $lookup: {
              from: "user",
              localField: "KhachHang.isChildOf",
              foreignField: "_id",
              as: "Tram",
            },
          },
          {
            $unwind: {
              path: "$Tram",
            },
          },
          {
            $lookup: {
              from: "manufacture",
              localField: "manufacture",
              foreignField: "_id",
              as: "manufacture",
            },
          },
          {
            $unwind: {
              path: "$manufacture",
            },
          },
          {
            $lookup: {
              from: "categorycylinder",
              localField: "categoryCylinder",
              foreignField: "_id",
              as: "categoryCylinder",
            },
          },
          {
            $unwind: {
              path: "$categoryCylinder",
            },
          },
          {
            $lookup: {
              from: "typecylinderprice",
              localField: "typePriceId",
              foreignField: "_id",
              as: "typePriceId",
            },
          },
          {
            $unwind: {
              path: "$typePriceId",
            },
          },
          {
            $project: {
              idTram: "$Tram._id",
              TenTram: "$Tram.name",
              idKhachHang: "$KhachHang._id",
              MaKhachHang: "$KhachHang.code",
              TenKhachHang: "$KhachHang.name",
              idThuongHieu: "$manufacture._id",
              TenThuongHieu: "$manufacture.name",
              idLoaiBinh: "$categoryCylinder._id",
              TenLoaiBinh: "$categoryCylinder.name",
              Gia: "$price",
              LoaiGia: "$typePriceId.cylinderType",
              NgayBatDau: "$typePriceId.fromDate",
              NgayKetThuc: "$typePriceId.toDate",
              typePriceId: "$typePriceId._id",
            },
          },
          {
            $sort: {
              TenThuongHieu: 1.0,
              TenTram: 1.0,
              TenKhachHang: 1.0,
              NgayBatDau: 1.0,
              TenLoaiBinh: 1.0,
            },
          },
        ])
        .toArray();

      return res.json({
        success: true,
        data: _Aggregate,
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy chi tiết bảng giá",
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
      const deleteTypePrice = await TypeCylinderPrice.updateOne({
        isDeleted: { "!=": true },
        id,
      }).set({
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: req.query.userid,
      });

      if (!deleteTypePrice) {
        return res.json({
          success: false,
          data: {},
          message: "Không tìm thấy đơn giá để xóa",
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

  updatePriceDetail: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const {
      typePriceId,
      manufacture,
      fromDate, // ISOString date
      toDate, // ISOString date
      priceDetails,
      // [
      //   {
      //     categoryCylinder, // Id
      //     price,         // number
      //   },
      //   ...
      // ]
    } = req.body;

    if (!typePriceId) {
      return res.badRequest(Utils.jsonErr("typePriceId is required"));
    }

    if (!manufacture) {
      return res.badRequest(Utils.jsonErr("manufacture is required"));
    }

    if (!fromDate) {
      return res.badRequest(Utils.jsonErr("fromDate is required"));
    }

    if (!toDate) {
      return res.badRequest(Utils.jsonErr("toDate is required"));
    }

    if (!priceDetails) {
      return res.badRequest(Utils.jsonErr("priceDetails is required"));
    }

    if (!Array.isArray(priceDetails)) {
      return res.badRequest(Utils.jsonErr("priceDetails is of wrong type"));
    }

    try {
      const updatedRecord = await TypeCylinderPrice.updateOne({
        id: typePriceId,
        isDeleted: { "!=": true },
      }).set({ fromDate, toDate });

      if (!updatedRecord) {
        return res.badRequest(Utils.jsonErr("Không tìm thấy bảng giá"));
      }

      await Promise.all(
        priceDetails.map(async (detail) => {
          await TypeCylinderPriceDetail.updateOne({
            typePriceId: updatedRecord.id,
            customer: updatedRecord.customer,
            manufacture,
            categoryCylinder: detail.categoryCylinder,
          }).set({
            price: detail.price,
          });
        })
      );

      return res.json({
        success: true,
        message: "Cập nhật bảng giá thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  createPriceDetailExcel: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const {
      cylinderType,
      customer,
      note,
      userId,
      manufacture,
      fromDate, // ISOString date
      toDate, // ISOString date
      priceDetails,
    } = req.body;

    if (!manufacture) {
      return res.badRequest(Utils.jsonErr("manufacture is required"));
    }

    if (!fromDate) {
      return res.badRequest(Utils.jsonErr("fromDate is required"));
    }

    if (!toDate) {
      return res.badRequest(Utils.jsonErr("toDate is required"));
    }

    if (!priceDetails) {
      return res.badRequest(Utils.jsonErr("priceDetails is required"));
    }

    var checkUser = await User.findOne({
      _id: customer,
    });
    if (!checkUser || checkUser.length <= 0) {
      return res.json({
        success: false,
        message: "Không có khách hàng này",
      });
    }

    //================//
    let typePrice = null;
    let dateDelivery = new Date().toISOString();
    try {
      typePrice = await TypeCylinderPrice.create({
        customer: customer,
        note: note,
        fromDate: fromDate,
        toDate: toDate,
        createdBy: userId,
        createdAt: dateDelivery,
        cylinderType,
        status: true,
      }).fetch();
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
    if (!typePrice)
      return res.json({ success: false, message: "Tạo bảng giá thất bại" });

    if (!Array.isArray(priceDetails)) {
      return res.badRequest(Utils.jsonErr("priceDetails is of wrong type"));
    }

    try {
      await Promise.all(
        priceDetails.map(async (element) => {
          const typeCyliderDetail = await TypeCylinderPriceDetail.create({
            typePriceId: typePrice.id,
            customer: customer,
            manufacture: manufacture,
            categoryCylinder: element.categoryCylinder,
            price: element.price,
            createdBy: userId,
            createdAt: dateDelivery,
            cylinderType: cylinderType,
          }).fetch();
        })
      );

      return res.json({
        success: true,
        message: "Tạo bảng giá thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  updateById: async function (req, res) {
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id bảng giá",
      });
    try {
      let typecylider = await TypeCylinderPrice.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!typecylider) {
        return res.json({ success: false, message: "Không tìm thấy bảng giá" });
      }
      let updateData = req.body;
      let updatedTypeCylinder = await TypeCylinderPrice.updateOne({
        isDeleted: { "!=": true },
        _id: req.query.id,
      }).set(updateData);
      if (!updatedTypeCylinder) {
        return res.json({
          success: false,
          message: "Cập nhật bảng giá thất bại",
        });
      }
      return res.json({
        success: true,
        data: updatedTypeCylinder,
        message: "Cập nhật bảng giá thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },

  create: async function (req, res) {
    //status default is INIT
    const { customer, note, fromDate, toDate, userId } = req.body;

    var checkUser = await User.findOne({
      _id: customer,
    });
    if (!checkUser || checkUser.length <= 0) {
      return res.json({
        success: false,
        message: "Không có khách hàng này",
      });
    }
    if (!req.body.fromDate || !req.body.toDate) {
      return res.json({
        success: false,
        message: "Buộc phải nhập ngày bắt đầu và ngày kết thúc",
      });
    }

    //================//
    let typePrice = null;
    let dateDelivery = new Date().toISOString();
    try {
      typePrice = await TypeCylinderPrice.create({
        customer: customer,
        note: note,
        fromDate: fromDate,
        toDate: toDate,
        createdBy: userId,
        createdAt: dateDelivery,
      }).fetch();
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
    if (!typePrice)
      return res.json({ success: false, message: "Tạo bảng giá thất bại" });

    return res.json({
      success: true,
      data: typePrice,
      message: "Tạo bảng giá thành công",
    });
  },
};
