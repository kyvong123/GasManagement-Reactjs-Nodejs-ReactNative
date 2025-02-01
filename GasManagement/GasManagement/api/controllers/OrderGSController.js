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
const OrderDetailController = require("./OrderDetailController");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {
  createOrderGSConfirmationHistory,
} = require("../services/OrderGSConfirmationHistory");

module.exports = {
  getStatus: async function (req, res) {
    // if (!req.query?.orderCode)
    //   return res.json({
    //     success: false,
    //     message: "Không có code order - vui lòng nhập code order",
    //   });
    try {
      if (!req.query.status || req.query.status === "") {
        let order = await OrderGS.find({ isDeleted: { "!=": true } })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers");
        if (!order || order.length <= 0) {
          return res.json({
            success: false,

            message: "Không tìm thấy đơn hàng",
          });
        }
        return res.json({
          success: true,
          data: order,
          message: "Lấy đơn hàng theo tất cả trạng thái thành công",
        });
      }
      let order = await OrderGS.find({
        isDeleted: { "!=": true },
        status: req.query.status,
      })
        .sort("createdAt DESC")
        .populate("orderDetail", { isDeleted: { "!=": true } })
        .populate("supplier")
        .populate("customers");
      if (!order || order.length <= 0) {
        return res.json({
          success: false,
          message: `Không tìm thấy đơn hàng ở trạng thái ${req.query.status}`,
        });
      }
      return res.json({
        success: true,
        data: order,
        message: `Lấy đơn hàng theo trạng thái ${req.query.status} thành công`,
      });
    } catch (error) {
      return res.json({
        success: false,

        message: "Gặp lỗi khi lấy đơn hàng theo trạng thái",
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
        .sort("createdAt DESC")
        .populate("orderDetail", { isDeleted: { "!=": true } })
        .populate("delivery", { isDeleted: { "!=": true } })
        .populate("reasonForCancellatic");
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
      return res.json({
        success: false,

        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },
  getListScheduleOfCustomers: async function (req, res) {
    const objectId = req.query.objectId;
    // const userInfor = await User.findOne({isDeleted: {"!=": true}, id: userId });
    if (!req.query.To && !req.query.From && !req.query.orderCode) {
      return res.json({
        success: false,
        message: "Vui lòng chọn ngày tháng hoặc nhập mã đơn hàng !!",
      });
    }
    if (req.query.orderCode) {
      try {
        var UpperCode = req.query.orderCode.toUpperCase();
        let order = await OrderGS.find({
          isDeleted: { "!=": true },
          orderCode: UpperCode,
          customers: req.query.objectId,
          orderType: req.query.type,
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers")
          .populate("delivery", { isDeleted: { "!=": true } });
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
        return res.json({
          success: false,

          message: "Gặp lỗi khi lấy đơn hàng",
        });
      }
    }
    try {
      let order = await OrderGS.find({
        isDeleted: { "!=": true },
        createdAt: {
          ">=": req.query.From,
          "<=": req.query.To,
        },
        // supplier: req.query.supplier,
        // area: req.query.area,
        customers: req.query.objectId,
        orderType: req.query.type,
        // status: req.query.status,
      })
        .sort("createdAt DESC")
        .populate("orderDetail", { isDeleted: { "!=": true } })
        .populate("supplier")
        .populate("customers")
        .populate("delivery", { isDeleted: { "!=": true } });
      if (!order || order.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      return res.json({
        success: true,
        data: order,
        message: "Lấy đơn hàng theo ngày tháng và code thành công",
      });
    } catch (error) {
      return res.json({
        success: false,

        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },
  getListScheduleOfSuppliers: async function (req, res) {
    const userId = req.query.userid;
    const userInfor = await User.findOne({
      isDeleted: { "!=": true },
      id: userId,
    });

    if (!req.query.To && !req.query.From && !req.query.orderCode) {
      return res.json({
        success: false,
        message: "Vui lòng chọn ngày tháng hoặc nhập mã đơn hàng !!",
      });
    }
    if (req.query.orderCode) {
      try {
        var UpperCode = req.query.orderCode.toUpperCase();
        let order = await OrderGS.find({
          isDeleted: { "!=": true },
          orderCode: UpperCode,
          customers: req.query.objectId,
          orderType: req.query.type,
        })
          .sort("createdAt DESC")
          .populate("area")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers")
          .populate("delivery", { isDeleted: { "!=": true } });
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
        return res.json({
          success: false,

          message: "Gặp lỗi khi lấy đơn hàng",
        });
      }
    }
    try {
      console.log("aaaa", userInfor.userRole);
      if (
        userInfor.userRole === "To_nhan_lenh" ||
        userInfor.userRole === "phongKD"
      ) {
        let order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": req.query.From,
            "<=": req.query.To,
          },

          customers: req.query.objectId,
          area: req.query.area,
          supplier: req.query.station,
          orderType: req.query.type,
        })
          .sort("createdAt DESC")
          .populate("area")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers")
          .populate("delivery", { isDeleted: { "!=": true } });
        if (!order || order.length <= 0) {
          return res.json({
            success: false,
            message: "Không tìm thấy đơn hàng",
          });
        }

        return res.json({
          success: true,
          data: order,
          message: "Lấy đơn hàng theo ngày tháng và code thành công",
        });
      } else if (
        userInfor.userRole === "Ke_toan" ||
        userInfor.userRole === "Ke_toan_vo_binh"
      ) {
        let order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": req.query.From,
            "<=": req.query.To,
          },

          customers: req.query.objectId,
          area: req.query.area,
          supplier: req.query.station,
          orderType: req.query.type,
          status: { "!=": "DON_HANG_MOI" },
        })
          .sort("createdAt DESC")
          .populate("area")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers")
          .populate("delivery", { isDeleted: { "!=": true } });

        if (userInfor.userRole === "Ke_toan_vo_binh") {
          order = order.filter(
            (item) =>
              item.orderType === "COC_VO" || item.orderType === "MUON_VO"
          );
        }
        if (!order || order.length <= 0) {
          return res.json({
            success: false,
            message: "Không tìm thấy đơn hàng",
          });
        }

        return res.json({
          success: true,
          data: order,
          message: "Lấy đơn hàng theo ngày tháng và code thành công",
        });
      } else if (userInfor.userRole === "Dieu_do_tram") {
        let order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": req.query.From,
            "<=": req.query.To,
          },
          isDeleted: { "!=": true },
          supplier: req.query.station,
          // orderType: req.query.type,
          status: [
            "DA_DUYET",
            "DA_HOAN_THANH",
            "DANG_GIAO",
            "DDTRAMGUI_XACNHAN",
            "DDTRAM_DUYET",
          ],
        })
          .sort("createdAt DESC")
          .populate("area")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers")
          .populate("delivery", { isDeleted: { "!=": true } });
        if (!order || order.length <= 0) {
          return res.json({
            success: false,
            message: "Không tìm thấy đơn hàng",
          });
        }

        return res.json({
          success: true,
          data: order,
          message: "Lấy đơn hàng theo ngày tháng và code thành công",
        });
      } else if (userInfor.userType === "Factory") {
        let order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": req.query.From,
            "<=": req.query.To,
          },

          isDeleted: { "!=": true },
          supplier: req.query.userid,
          orderType: req.query.type,
          status: ["DA_DUYET", "DA_HOAN_THANH", "DANG_GIAO"],
        })
          .sort("createdAt DESC")
          .populate("area")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers")
          .populate("delivery", { isDeleted: { "!=": true } });
        if (!order || order.length <= 0) {
          return res.json({
            success: false,
            message: "Không tìm thấy đơn hàng",
          });
        }

        return res.json({
          success: true,
          data: order,
          message: "Lấy đơn hàng theo ngày tháng và code thành công",
        });
      } else if (userInfor.userType === "Tram") {
        let order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": req.query.From,
            "<=": req.query.To,
          },

          isDeleted: { "!=": true },
          supplier: req.query.station,
          // orderType: req.query.type,
          status: [
            "DA_DUYET",
            "DDTRAMGUI_XACNHAN",
            "DDTRAM_DUYET",
            "DA_HOAN_THANH",
            "DANG_GIAO",
          ],
        })
          .sort("createdAt DESC")
          .populate("area")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("customers")
          .populate("delivery", { isDeleted: { "!=": true } });
        if (!order || order.length <= 0) {
          return res.json({
            success: false,
            message: "Không tìm thấy đơn hàng",
          });
        }

        return res.json({
          success: true,
          data: order,
          message: "Lấy đơn hàng theo ngày tháng và code thành công",
        });
      }

      let order = await OrderGS.find({
        isDeleted: { "!=": true },
        createdAt: {
          ">=": req.query.From,
          "<=": req.query.To,
        },
        // supplier: req.query.supplier,
        // area: req.query.area,
        customers: req.query.objectId,
        area: req.query.area,
        supplier: req.query.station,
        orderType: req.query.type,
        status: { "!=": "DON_HANG_MOI" },
        // status: statuss,
        // status: req.query.status,
      })
        .sort("createdAt DESC")
        .populate("area")
        .populate("orderDetail", { isDeleted: { "!=": true } })
        .populate("supplier")
        .populate("customers")
        .populate("delivery", { isDeleted: { "!=": true } });
      if (!order || order.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      return res.json({
        success: true,
        data: order,
        message: "Lấy đơn hàng theo ngày tháng và code thành công",
      });
    } catch (error) {
      return res.json({
        success: false,

        message: "Gặp lỗi khi lấy đơn hàng",
      });
    }
  },
  // getFilter
  delete: async function (req, res) {
    if (!req.query.userid) {
      console.log("Empty req.query.userid");
      return res.badRequest(Utils.jsonErr("Empty userid"));
    }
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
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

      return res.json({
        success: true,
        message: "Xóa thành công.",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: "Gặp lỗi khi xóa đơn",
      });
    }
  },
  acpOrder: async function (req, res) {
    let noteSup = req.body.note;
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    try {
      const orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      const reason1 = null;
      // console.log("datane", taodata);
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor.id);
      var updatedOrderGS = null;
      if (!userInfor || userInfor.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      if (userInfor.userRole === "To_nhan_lenh") {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "TO_NHAN_LENH_DA_DUYET",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "TO_NHAN_LENH_DA_DUYET"
        );
      }
      if (
        userInfor.userRole === "Truong_phongKD" &&
        orderGS.status === "TU_CHOI_LAN_1"
      ) {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "GUI_DUYET_LAI",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "GUI_DUYET_LAI"
        );
      }
      if (
        userInfor.userRole === "Pho_giam_docKD" &&
        orderGS.status === "TU_CHOI_LAN_2"
      ) {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "GUI_DUYET_LAI",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "GUI_DUYET_LAI"
        );
      }
      if (
        userInfor.userRole === "Ke_toan" ||
        userInfor.userRole === "Ke_toan_vo_binh"
      ) {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "DA_DUYET",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "DA_DUYET"
        );
      }
      if (userInfor.userRole === "Dieu_do_tram") {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "DA_HOAN_THANH",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "DIEU_DO_TRAM_XACNHAN_HOANTHANH"
        );
      }
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

  acpOrdercomplete: async function (req, res) {
    let noteSup = req.body.note;
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    try {
      const orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      const reason1 = null;
      // console.log("datane", taodata);
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor.id);
      var updatedOrderGS = null;
      if (!userInfor || userInfor.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      if (userInfor.userRole === "Dieu_do_tram") {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "DA_HOAN_THANH",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "DIEU_DO_TRAM_XACNHAN_HOANTHANH"
        );
      }

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

  acpOrderdieudotramcomplete: async function (req, res) {
    let noteSup = req.body.note;
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    try {
      const orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      const reason1 = null;
      // console.log("datane", taodata);
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor.id);
      var updatedOrderGS = null;
      if (!userInfor || userInfor.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      if (userInfor.userRole === "Dieu_do_tram") {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "DDTRAM_DUYET",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "DDTRAM_DUYET"
        );
      }

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

  acpOrderdieudotramguicomplete: async function (req, res) {
    let noteSup = req.body.note;
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    try {
      const orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      const reason1 = null;
      // console.log("datane", taodata);
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor.id);
      var updatedOrderGS = null;
      if (!userInfor || userInfor.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      if (userInfor.userRole === "Dieu_do_tram") {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "DDTRAMGUI_XACNHAN",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "DDTRAMGUI_XACNHAN"
        );
      }

      if (userInfor.userRole === "To_nhan_lenh") {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "TNLGUI_XACNHAN",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "TNLGUI_XACNHAN"
        );
      }

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

  acpOrderkhachhangcomplete: async function (req, res) {
    let noteSup = req.body.note;
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    try {
      const orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      const reason1 = null;
      // console.log("datane", taodata);
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor.id);
      var updatedOrderGS = null;
      if (!userInfor || userInfor.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      if (
        (userInfor.userRole === "SuperAdmin" &&
          userInfor.userType === "General") ||
        (userInfor.userRole === "SuperAdmin" && userInfor.userType === "Agency")
      ) {
        //begin hoa bo sung them xem trang thai don la gi
        if (orderGS.status === "TNLGUI_XACNHAN") {
          updatedOrderGS = await OrderGS.updateOne({
            isDeleted: { "!=": true },
            _id: req.query.id,
          }).set({
            status: "TO_NHAN_LENH_DA_DUYET",
            noteSup,
          });
          createOrderGSConfirmationHistory(
            userInfor,
            orderGS,
            noteSup,
            "TO_NHAN_LENH_DA_DUYET"
          );
        } else {
          updatedOrderGS = await OrderGS.updateOne({
            isDeleted: { "!=": true },
            _id: req.query.id,
          }).set({
            status: "DDTRAM_DUYET",
            noteSup,
          });
          createOrderGSConfirmationHistory(
            userInfor,
            orderGS,
            noteSup,
            "KHDDTRAM_DUYET"
          );
        }
      }

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
  findbyIdUser: async function (req, res) {
    try {
      if (!req.query.userid) {
        return res.json({
          success: false,
          message: "Cần nhập id khách hàng",
        });
      }
      var order = null;
      order = await OrderGS.find({
        isDeleted: { "!=": true },
        customers: req.query.userid,
      });
      if (order.length <= 0) {
        return res.json({
          success: false,
          message: "Không có đơn hàng nào",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Tìm thông tin đơn hàng theo mã khách hàng thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },
  notacpOrder: async function (req, res) {
    let noteSup = req.body.note;
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    if (!noteSup)
      return res.json({
        success: false,
        message: "phải có lý do KHONG DUYET",
      });
    try {
      const { reasonForCancellatic } = req.body;
      const orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      const reason1 = null;
      // console.log("datane", taodata);
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor.id);
      if (!userInfor || userInfor.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      var updatedOrderGS = null;
      if (
        userInfor.userRole === "To_nhan_lenh" ||
        userInfor.userRole === "Truong_phongKD" ||
        userInfor.userRole === "Pho_giam_docKD"
      ) {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "KHONG_DUYET",
          status2: "KHONG_DUYET",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "KHONG_DUYET"
        );
      }
      if (
        userInfor.userRole === "Ke_toan" ||
        userInfor.userRole === "Ke_toan_vo_binh"
      ) {
        console.log("DON HANG MOI", orderGS.status2);
        if (orderGS.status2 == "DON_HANG_MOI") {
          updatedOrderGS = await OrderGS.updateOne({
            isDeleted: { "!=": true },
            _id: req.query.id,
          }).set({
            status: "TU_CHOI_LAN_1",
            status2: "TU_CHOI_LAN_1",
            noteSup,
          });
          createOrderGSConfirmationHistory(
            userInfor,
            orderGS,
            noteSup,
            "TU_CHOI_LAN_1"
          );
        }

        console.log("DON HANG MOI 2", userInfor.userRole, userInfor.status2);
        if (
          orderGS.status2 == "TU_CHOI_LAN_1" &&
          (userInfor.userRole === "Ke_toan_vo_binh" ||
            userInfor.userRole === "Ke_toan")
        ) {
          updatedOrderGS = await OrderGS.updateOne({
            isDeleted: { "!=": true },
            _id: req.query.id,
          }).set({
            status: "TU_CHOI_LAN_2",
            status2: "TU_CHOI_LAN_2",
            noteSup,
          });
          createOrderGSConfirmationHistory(
            userInfor,
            orderGS,
            noteSup,
            "TU_CHOI_LAN_2"
          );
        }
      }
      // await Promise.all(
      //   reasonForCancellatic.map(async (cancel) => {
      //     const orderGSID = req.query.id;
      //     const cancelBy = userInfor.id;
      //     const { reason } = cancel;
      //     await CancelHistory.create({ orderGSID, reason, cancelBy });
      //   })
      // );
      if (!updatedOrderGS || updatedOrderGS.length == 0) {
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

  notacpOrderKH: async function (req, res) {
    let noteSup = req.body.note;
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order",
      });
    if (!noteSup)
      return res.json({
        success: false,
        message: "phải có lý do KHONG DUYET",
      });
    try {
      const { reasonForCancellatic } = req.body;
      const orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      const reason1 = null;
      // console.log("datane", taodata);
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor.id);
      if (!userInfor || userInfor.length <= 0) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      var updatedOrderGS = null;
      if (
        (userInfor.userRole === "SuperAdmin" &&
          userInfor.userType === "General") ||
        (userInfor.userRole === "SuperAdmin" && userInfor.userType === "Agency")
      ) {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.id,
        }).set({
          status: "KHONG_DUYET",
          status2: "KHONG_DUYET",
          noteSup,
        });
        createOrderGSConfirmationHistory(
          userInfor,
          orderGS,
          noteSup,
          "KHKHONG_DUYET"
        );
      }

      if (!updatedOrderGS || updatedOrderGS.length == 0) {
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
  /**
   * "PUT /categoryCylinder/updateById"
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  updateById: async function (req, res) {
    let updateData = req.body;

    if (!req.query?.id || req.body == null)
      return res.json({
        success: false,
        message: "Không có id order hoặc không có body",
      });
    try {
      let orderGS = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      if (!orderGS) {
        return res.json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      // ------------------
      // update order Details
      if (updateData.orderDetail) {
        const result = OrderDetailController.updateMany(updateData.orderDetail);
        console.log("result", result);
        result.then((result) => {
          if (result.success === false) {
            return res.json({
              success: false,
              message: result.message,
            });
          }
        });
        delete updateData.orderDetail;
      }
      // ---------------------
      let updatedOrderGS = await OrderGS.updateOne({
        isDeleted: { "!=": true },
        _id: req.query.idDetail,
      }).set(updateData);

      // khi status DA_HOAN_THANH thi ngày hoàn thành sẽ được tạo
      if (updateData.status === "DA_HOAN_THANH") {
        updatedOrderGS = await OrderGS.updateOne({
          isDeleted: { "!=": true },
          _id: req.query.idDetail,
        }).set({
          dateDone: new Date().toISOString(), //"2011-12-19T15:28:46.493Z",
        });
      }
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

  getAllIfIdIsSupplier: async function (req, res) {
    if (!req.query?.userid) {
      return res.json({
        success: false,
        message: "không có userid",
      });
    }
    try {
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });
      // console.log(userInfor);
      // console.log(userInfor.id);
      if (!userInfor) {
        return res.json({ success: false, message: "Không tìm thấy user" });
      }
      console.log(userInfor.userType, userInfor.userRole);
      let orders = [];
      if (
        userInfor.userType == "Tong_cong_ty" &&
        (userInfor.userRole == "Ke_toan" ||
          userInfor.userRole == "Giam_doc" ||
          userInfor.userRole == "Truong_phongKD" ||
          userInfor.userRole == "Pho_giam_docKD" ||
          userInfor.userRole == "SuperAdmin")
      ) {
        orders = await OrderGS.find({
          isDeleted: { "!=": true },
          orderType: req.query.type,
          status: { "!=": "DON_HANG_MOI" },
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");
      }
      if (
        userInfor.userType == "Agency" &&
        userInfor.userRole == "SuperAdmin"
      ) {
        orders = await OrderGS.find({
          isDeleted: { "!=": true },
          orderType: req.query.type,
          status: { "!=": "DON_HANG_MOI" },
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");
      }
      if (
        (userInfor.userType == "Factory" && userInfor.userRole == "Owner") ||
        (userInfor.userType == "Tram" &&
          userInfor.userRole == "Dieu_do_tram") ||
        (userInfor.userType == "Tram" && userInfor.userRole == "Truong_tram") ||
        (userInfor.userType == "Tram" && userInfor.userRole == "Ke_toan_tram")
      ) {
        //la tai khoan tram
        if (userInfor.userType == "Factory" && userInfor.userRole == "Owner") {
          orders = await OrderGS.find({
            isDeleted: { "!=": true },
            supplier: req.query.userid,
            orderType: req.query.type,

            status: [
              "DA_DUYET",
              "DA_HOAN_THANH",
              "DANG_GIAO",
              "DDTRAM_DUYET",
              "DDTRAMGUI_XACNHAN",
              "KHONG_DUYET",
            ],
          })
            .sort("createdAt DESC")
            .populate("orderDetail", { isDeleted: { "!=": true } })
            .populate("supplier")
            .populate("delivery", { isDeleted: { "!=": true } })
            .populate("customers");
        } else {
          orders = await OrderGS.find({
            isDeleted: { "!=": true },
            supplier: req.query.objectId,
            orderType: req.query.type,
            // or: [
            //   { status: "DA_DUYET" },
            //   { status: "DA_HOAN_THANH" },
            //   { status: "DANG_GIAO" },
            // ],
            status: [
              "DA_DUYET",
              "DA_HOAN_THANH",
              "DANG_GIAO",
              "DDTRAM_DUYET",
              "DDTRAMGUI_XACNHAN",
              "KHONG_DUYET",
            ],
          })
            .sort("createdAt DESC")
            .populate("orderDetail", { isDeleted: { "!=": true } })
            .populate("supplier")
            .populate("delivery", { isDeleted: { "!=": true } })
            .populate("customers");
        }
      }

      if (
        (userInfor.userType == "Factory" && userInfor.userRole == "Deliver") ||
        (userInfor.userType == "Tram" && userInfor.userRole == "Deliver") ||
        (userInfor.userType == "Vehicle" && userInfor.userRole == "Truck")
      ) {
        orders = await OrderGS.find({
          isDeleted: { "!=": true },
          supplier: userInfor.isChildOf,
          // or: [
          //   { status: "DA_DUYET" },
          //   { status: "DA_HOAN_THANH" },
          //   { status: "DANG_GIAO" },
          // ],
          status: ["DDTRAM_DUYET", "DANG_GIAO"],
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");
      }
      if (
        userInfor.userType == "Tong_cong_ty" &&
        (userInfor.userRole == "To_nhan_lenh" ||
          userInfor.userRole == "phongKD")
      ) {
        orders = await OrderGS.find({
          isDeleted: { "!=": true },
          orderType: req.query.type,
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");
      }

      if (
        userInfor.userType == "Tong_cong_ty" &&
        userInfor.userRole == "Ke_toan_vo_binh"
      ) {
        let ktdata = await OrderGS.find({
          isDeleted: { "!=": true },
          orderType: req.query.type,
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");
      }

      if (
        userInfor.userType == "Tong_cong_ty" &&
        (userInfor.userRole == "To_nhan_lenh" ||
          userInfor.userRole == "phongKD")
      ) {
        orders = await OrderGS.find({
          isDeleted: { "!=": true },
          orderType: req.query.type,
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");
      }

      if (
        userInfor.userType == "Tong_cong_ty" &&
        userInfor.userRole == "Ke_toan_vo_binh"
      ) {
        let ktdata = await OrderGS.find({
          isDeleted: { "!=": true },
          orderType: req.query.type,
          status: { "!=": "DON_HANG_MOI" },
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");

        orders = ktdata.filter(
          (item) => item.orderType === "COC_VO" || item.orderType === "MUON_VO"
        );
      }
      // console.log(orders);
      if (orders.length === 0) {
        return res.json({
          success: false,
          message: "Không có đơn hàng nào",
        });
      }
      return res.json({
        success: true,
        data: orders,
        message: "Đã tìm thấy đơn hàng",
      });
    } catch (error) {
      return res.serverError(error);
    }
  },

  getStation: async function (req, res) {
    const {
      userInfo
    } = req;

    try {
      // const parent = await getRootParent(userInfo.id);
      // if (!parent) {
      //   return res.json({ success: false, message: "Không tìm thấy" });
      // }

      const Tram = await User.find({
        isDeleted: { "!=": true },
        userType: "Factory",
        userRole: "Owner",
        stationType: "Own",
        // organization: parent.id,
      })
        .sort("createdAt DESC")
        .populate("area");
      if (Tram.length === 0) {
        return res.json({ success: false, message: "Không tìm thấy" });
      } else {
        return res.json({
          success: true,
          data: Tram,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  getArea: async function (req, res) {
    try {
      const getArea = await Area.find({
        isDeleted: { "!=": true },
        _id: req.query.area,
      }).sort("createdAt DESC");
      if (getArea.length === 0) {
        return res.json({ success: false, message: "Không tìm thấy" });
      } else {
        return res.json({
          success: true,
          data: getArea,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },

  getListUserByType: async function (req, res) {
    const { isChildOf, customerType } = req.query;

    if (!isChildOf) {
      return res.badRequest(Utils.jsonErr("Id is required"));
    }

    try {
      // Khách hàng công nghiệp
      if (customerType === "Industry") {
        const result = await User.find({
          isDeleted: { "!=": true },
          customerType: customerType,
          userType: "General",
          userRole: "SuperAdmin",
          isChildOf: isChildOf,
          isDeleted: false,
        });

        if (result.length > 0) {
          return res.json({
            success: true,
            data: result,
            message: "Tìm thấy danh sách khách hàng",
          });
        } else {
          return res.json({
            success: false,
            message: "Không tìm thấy khách hàng nào",
          });
        }
      }

      // Đại lý phân phối
      if (customerType === "Distribution") {
        const result = await User.find({
          isDeleted: { "!=": true },
          customerType: {
            "!=": "Industry",
          },
          userType: "General",
          userRole: "SuperAdmin",
          isChildOf: isChildOf,
          isDeleted: false,
        });

        if (result.length > 0) {
          return res.json({
            success: true,
            data: result,
            message: "Tìm thấy danh sách khách hàng",
          });
        } else {
          return res.json({
            success: false,
            message: "Không tìm thấy khách hàng nào",
          });
        }
      }

      // Cửa Hàng Bán Lẻ
      if (customerType === "Agency") {
        const result = await User.find({
          isDeleted: { "!=": true },
          // customerType: customerType,
          userType: "Agency",
          userRole: "SuperAdmin",
          isChildOf: isChildOf,
          isDeleted: false,
        });

        if (result.length > 0) {
          return res.json({
            success: true,
            data: result,
            message: "Tìm thấy danh sách khách hàng",
          });
        } else {
          return res.json({
            success: false,
            message: "Không tìm thấy khách hàng nào",
          });
        }
      }
    } catch (error) {
      return res.json({
        success: false,
        message: "Gặp lỗi khi tìm kiếm danh sách khách hàng",
      });
    }
  },
  getListUserByStation: async function (req, res) {
    const { stationID, customerCode } = req.query;
    if (!stationID) {
      return res.badRequest(Utils.jsonErr("Id is required"));
    }
    try {
      // Khách hàng công nghiệp
      if (stationID && !customerCode) {
        const result = await User.find({
          isDeleted: { "!=": true },
          isChildOf: stationID,
          isDeleted: false,
        });

        if (result.length > 0) {
          return res.json({
            success: true,
            data: result,
            message: "Tìm thấy danh sách khách hàng",
          });
        } else {
          return res.json({
            success: false,
            message: "Không tìm thấy khách hàng nào",
          });
        }
      }
      if (stationID && customerCode) {
        const result = await User.find({
          isDeleted: { "!=": true },
          isChildOf: stationID,
          isDeleted: false,
        });

        if (result.length > 0) {
          return res.json({
            success: true,
            data: result,
            message: "Tìm thấy danh sách khách hàng",
          });
        } else {
          return res.json({
            success: false,
            message: "Không tìm thấy khách hàng nào",
          });
        }
      }
    } catch (error) {
      return res.json({
        success: false,
        message: "Gặp lỗi khi tìm kiếm danh sách khách hàng",
      });
    }
  },

  layCuaHangTrucThuocTram: async function (req, res) {
    try {
      const store = await User.find({
        isDeleted: { "!=": true },
        userType: "Khach_hang",
        userRole: "Cua_hang_thuoc_tram",
        isDeleted: { "!=": true },
      }).sort("createdAt DESC");
      if (store.length === 0) {
        return res.json({ success: false, message: "Không tìm thấy" });
      } else {
        return res.json({
          success: true,
          data: store,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  layTongDaiLy: async function (req, res) {
    try {
      const store = await User.find({
        isDeleted: { "!=": true },
        userType: "Khach_hang",
        userRole: "Tong_dai_ly",
        isDeleted: { "!=": true },
      }).sort("createdAt DESC");
      if (store.length === 0) {
        return res.json({ success: false, message: "Không tìm thấy" });
      } else {
        return res.json({
          success: true,
          data: store,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  layCongTy: async function (req, res) {
    try {
      const store = await User.find({
        isDeleted: { "!=": true },
        userType: "Khach_hang",
        userRole: "Cong_ty",
      }).sort("createdAt DESC");
      if (!store) {
        return res.json({ success: false, message: "Không tìm thấy" });
      } else {
        return res.json({
          success: true,
          data: store,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  getTypeCustomer2: async function (req, res) {
    try {
      // if (!req.query.type || !req.query.objectId || !req.query.area) {
      //   return res.json({
      //     success: false,
      //     data: [],
      //     message: "Vui lòng chọn trạm , khu vực ( vùng ) và đối tượng",
      //   });
      let allUser = null;
      let criteria = {
        isDeleted: { $ne: true },
        // supplier: ObjectId(req.query.supplier),
        // area: ObjectId(req.query.area),
        // customerType: req.query.type,
      };

      let db = OrderGS.getDatastore().manager;
      if (req.query.supplier) {
        allUser = await db
          .collection("ordergs")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                isDeleted: { $ne: true },
                supplier: ObjectId(req.query.supplier),
                // createdAt: {
                //   $lt: new Date(req.query.to).toISOString(),
                // },
              },
            },
            {
              $group: {
                _id: "$customers",
              },
            },
          ])
          .toArray();
      } else {
        allUser = await db
          .collection("ordergs")
          .aggregate([
            // {
            //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
            // },
            {
              $match: {
                isDeleted: { $ne: true },
                // createdAt: {
                //   $lt: new Date(req.query.to).toISOString(),
                // },
              },
            },
            {
              $group: {
                _id: "$customers",
              },
            },
          ])
          .toArray();
      }
      // }
      var stringUser = [];
      // let allUser2;
      console.log(allUser);
      for (let i = 0; i < allUser.length; i++) {
        var userne = allUser[i]._id;
        // console.log(userne);
        allUser2 = await User.find({
          _id: `${userne}`,
          userType: "Khach_hang",
          userRole: req.query.type,
          area: req.query.area,
        }).populate("area");
        // console.log(allUser2[0]);
        // console.log(i);
        if (allUser2[0] != null || allUser2[0] != undefined) {
          stringUser.push(allUser2[0] ? allUser2[0] : null);
        }
      }
      if (!stringUser || stringUser.length <= 0) {
        return res.json({
          success: false,
          data: {},
          message: "Thống kê không thành công",
        });
      }
      return res.json({
        success: true,
        data: stringUser,
        message: "Thống kê thành công",
      });
    } catch (error) {
      return res.serverError(error);
    }
  },
  getCustomerByCode: async function (req, res) {
    try {
      let store = [];
      store = await User.find({
        name: req.query.name,
        code: req.query.code,
      }).sort("createdAt DESC");
      if (store.length === 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy",
        });
      } else {
        return res.json({
          success: true,
          data: store,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  getTypeCustomer: async function (req, res) {
    try {
      // if (!req.query.type || !req.query.objectId || !req.query.area) {
      //   return res.json({
      //     success: false,
      //     data: [],
      //     message: "Vui lòng chọn trạm , khu vực ( vùng ) và đối tượng",
      //   });

      let store = null;
      store = await User.find({
        isDeleted: { "!=": true },
        userType: "Khach_hang",
        userRole: req.query.type,
        or: [
          { OfStation: req.query.objectId },
          { isChildOf: req.query.objectId },
        ],
        area: req.query.area,
      }).sort("createdAt DESC");
      if (store === null || store.length === 0) {
        return res.json({
          success: false,

          message: "Không tìm thấy",
        });
      } else {
        return res.json({
          success: true,
          data: store,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  showAddressUser: async function (req, res) {
    try {
      const userInfor = await User.find({
        isDeleted: { "!=": true },
        id: req.query.objectId,
      })
        .sort("createdAt DESC")
        .populate("isChildOf")
        .populate("area");
      if (!userInfor) {
        return res.json({ success: false, message: "Không tìm thấy" });
      } else {
        return res.json({
          success: true,
          data: userInfor,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  showAddressCustomer: async function (req, res) {
    try {
      const userInfor = await ShippingGS.find({
        isDeleted: { "!=": true },
        orderID: req.query.orderID,
      });
      if (!userInfor) {
        return res.json({ success: false, message: "Không tìm thấy" });
      } else {
        return res.json({
          success: true,
          data: userInfor,
          message: "Đã tìm thấy",
        });
      }
    } catch (error) {
      return res.serverError(error);
    }
  },
  getAllIfIdIsCustomer: async function (req, res) {
    const objectId = req.query.objectId;
    // const userInfor = await User.findOne({isDeleted: {"!=": true}, id: userId });
    try {
      if (!req.query.status || req.query.status === "") {
        let orders = await OrderGS.find({
          isDeleted: { "!=": true },
          customers: objectId,
          orderType: req.query.type,
        })
          .sort("createdAt DESC")
          .populate("orderDetail", { isDeleted: { "!=": true } })
          .populate("supplier")
          .populate("delivery", { isDeleted: { "!=": true } })
          .populate("customers");
        if (orders.length === 0) {
          return res.json({ success: false, message: "Không có đơn hàng nào" });
        }
        return res.json({
          success: true,
          data: orders,
          message: "Đã tìm thấy đơn hàng",
        });
      }

      let orders = await OrderGS.find({
        isDeleted: { "!=": true },
        customers: objectId,
        orderType: req.query.type,
        // status: req.query.status,
      })
        .sort("createdAt DESC")
        .populate("orderDetail", { isDeleted: { "!=": true } })
        .populate("supplier")
        .populate("delivery", { isDeleted: { "!=": true } })
        .populate("customers");
      if (orders.length === 0) {
        return res.json({ success: false, message: "Không có đơn hàng nào" });
      }
      return res.json({
        success: true,
        data: orders,
        message: "Đã tìm thấy đơn hàng",
      });
    } catch (error) {
      return res.serverError(error);
    }
  },

  getUserByCode: async function (req, res) {
    if (!req.query?.userType || !req.query?.userRole)
      return res.json({
        success: false,
        message: "Không cuserType,userRole",
      });
    try {
      let order = await User.find({
        isDeleted: { "!=": true },
        userType: req.query.userType,
        userRole: req.query.userRole,
        playerID: { "!=": "" },
      });
      if (!order || order.length <= 0) {
        return res.json({
          success: false,

          message: "Không tìm thấy user",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Lấy user thành công",
      });
    } catch (error) {
      return res.json({
        success: false,

        message: "Gặp lỗi khi lấy user",
      });
    }
  },

  create: async function (req, res) {
    //status default is INIT
    const {
      delivery,
      placeOfDelivery,
      note,
      // statusforPGD,
      status,
      // statusforCTM,
      // statusforTRAM,
      supplier,
      customerType,
      area,
      customers,
      orderType,
      orderDetails,
      dateCreated,
    } = req.body;

    const { userInfo } = req;

    if (!req.body.customers) {
      return res.json({ success: false, message: "Buộc phải nhập khách hàng" });
    }

    if (!req.body.area) {
      return res.json({
        success: false,
        message: "Buộc phải nhập khu vực , địa chỉ",
      });
    }

    if (!req.body.delivery) {
      return res.json({
        success: false,
        message: "Buộc phải nhập địa chỉ , ngày giao hàng ",
      });
    }

    if (!req.body.orderDetails) {
      return res.json({
        success: false,
        message: "Buộc phải nhập đầy đủ thông tin đơn hàng ",
      });
    }

    if (dateCreated) {
      const _date = moment(dateCreated, moment.ISO_8601);
      if (!_date.isValid()) {
        return res.json({
          success: false,
          message: "Sai định dạng ngày tạo đơn",
        });
      }
    }

    try {
      const checkCustomer = await User.findOne({
        isDeleted: { "!=": true },
        // userType: "Khach_hang",
        id: req.body.customers,
      });
      if (!checkCustomer) {
        return res.json({
          success: false,
          message: "Không tồn tại khách hàng này",
        });
      }
      const checkSupplier = await User.findOne({
        isDeleted: { "!=": true },
        // userType: "Tram",
        id: req.body.supplier,
      });
      if (!checkSupplier) {
        return res.json({ success: false, message: "Không tồn tại trạm này" });
      }
      //================//

      let _type = "";
      if (orderType === "KHONG") {
        _type = "DB";
      }
      if (orderType === "MUON_VO") {
        _type = "MV";
      }
      if (orderType === "COC_VO") {
        _type = "CV";
      }

      const _currentDate = dateCreated ? new Date(dateCreated) : new Date();
      const _YYYY = _currentDate.getFullYear();
      const _M = _currentDate.getMonth() + 1;
      const _year = _YYYY.toString().slice(-2);
      const _month = `${_M}`.padStart(2, "0");

      const seqOrderCode = await SequenceOrderCode.findOne({
        type: _type,
        year: _YYYY,
        month: _M,
      });

      let createdSeqNewMonth;
      if (!seqOrderCode) {
        createdSeqNewMonth = await SequenceOrderCode.create({
          type: _type,
          year: _YYYY,
          month: _M,
          number: 1,
          createdBy: req.userInfo.id,
        }).fetch();
      }

      const _numberOrderCode = `${seqOrderCode ? seqOrderCode.number : 1
        }`.padStart(5, "0");

      const orderCode = `${_type}${_year}${_month}${_numberOrderCode}`;

      const checkOrderCode = await OrderGS.findOne({
        orderCode,
      });

      if (checkOrderCode) {
        return res.badRequest(
          Utils.jsonErr(`Duplicate order code: ${checkOrderCode?.orderCode}`)
        );
      }

      const now = new Date().toISOString();

      var order = null;
      order = await OrderGS.create({
        orderCode,
        note,
        // statusforPGD,
        status,
        // statusforCTM,
        // statusforTRAM,
        createdBy: req.query.objectId,
        customerType: checkCustomer.userRole,
        supplier: checkSupplier.id,
        customers: checkCustomer.id,
        area,
        orderType,
        placeOfDelivery: placeOfDelivery === "STATION" ? placeOfDelivery : "CUSTOMER",
        createdAt: dateCreated || now,
      }).fetch();

      const _nextSeqId = seqOrderCode ? seqOrderCode.id : createdSeqNewMonth.id;
      const _nextSeqNumber = seqOrderCode
        ? seqOrderCode.number + 1
        : createdSeqNewMonth + 1;
      await SequenceOrderCode.updateOne({ id: _nextSeqId }).set({
        number: _nextSeqNumber,
      });

      var checkdelivery = 0;
      delivery.map((shippingGS1) => {
        const { deliveryAddress, deliveryDate } = shippingGS1;
        if (
          deliveryAddress &&
          deliveryDate &&
          Object.keys(shippingGS1).length > 0
        ) {
          checkdelivery++;
        }
      });

      if (checkdelivery == delivery.length) {
        await Promise.all(
          delivery.map(async (shippingGS) => {
            const orderID = order.id;
            const { deliveryAddress, deliveryDate } = shippingGS;
            await ShippingGS.create({
              orderID,
              deliveryAddress,
              placeOfDelivery: placeOfDelivery === "STATION" ? placeOfDelivery : "CUSTOMER",
              deliveryDate,
            });
          })
        );
      }

      var checkordeDetail = 0;
      orderDetails.map((orderDetail) => {
        const {
          manufacture,
          categoryCylinder,
          colorGas,
          valve,
          quantity,
          price,
        } = orderDetail;
        if (
          valve &&
          manufacture &&
          categoryCylinder &&
          colorGas &&
          quantity &&
          price &&
          Object.keys(orderDetail).length > 0
        ) {
          checkordeDetail++;
        }
      });

      if (checkordeDetail == orderDetails.length) {
        await Promise.all(
          orderDetails.map(async (orderDetail) => {
            const orderGSId = order.id;
            const {
              manufacture,
              categoryCylinder,
              colorGas,
              valve,
              quantity,
              price,
            } = orderDetail;

            // Lấy thêm thông tin tên, khối lượng của loại bình
            const categoryInfo = await CategoryCylinder.findOne({
              id: categoryCylinder,
            });
            await OrderDetail.create({
              orderGSId,
              manufacture,
              categoryCylinder,
              categoryName: categoryInfo ? categoryInfo.name : "",
              categoryMass: categoryInfo ? categoryInfo.mass : 0,
              colorGas,
              valve,
              quantity,
              price,
            });
          })
        );
      }

      if (
        checkdelivery != delivery.length ||
        checkordeDetail != orderDetails.length
      ) {
        if (checkordeDetail == orderDetails.length) {
          await OrderDetail.destroy({
            orderGSId: order.id,
          });
        }

        if (checkdelivery == delivery.length) {
          await ShippingGS.destroy({
            orderID: order.id,
          });
        }

        await OrderGS.destroy({
          id: order.id,
        });

        return res.json({ success: false, message: "Tạo đơn hàng thất bại" });
      }

      let db = OrderDetail.getDatastore().manager;
      var notification = `First Quantity before update of orderID : ${order.id}`;
      let firstQTT = await db
        .collection("orderdetail")
        .aggregate([
          // {
          //   $unwind: { path: "$dateDone", preserveNullAndEmptyArrays: true },
          // },
          {
            $match: {
              orderGSId: ObjectId(order.id),
            },
          },
          {
            $group: {
              _id: { notification },
              TSL: { $sum: "$quantity" },
            },
          },
        ])
        .toArray();

      updatedOrderGS = await OrderGS.updateOne({
        _id: order.id,
      }).set({
        firstQuantity: firstQTT[0] ? firstQTT[0].TSL : 0,
      });

      const checkOrder2 = await OrderGS.findOne({
        _id: order.id,
      });

      // Ghi lại lịch sử tạo đơn hàng
      createOrderGSConfirmationHistory(
        userInfo,
        checkOrder2,
        note,
        "KHOI_TAO_DON_HANG"
      )

      if (userInfo.userRole === "To_nhan_lenh") {
        await OrderGS.updateOne({
          // isDeleted: { "!=": true },
          _id: checkOrder2.id,
        }).set({
          status: "TO_NHAN_LENH_DA_DUYET",
          // noteSup: note,
        });
        createOrderGSConfirmationHistory(
          userInfo,
          checkOrder2,
          note,
          "TO_NHAN_LENH_DA_DUYET"
        );
      }

      return res.json({
        success: true,
        data: checkOrder2,
        message: "Tạo đơn hàng thành công",
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: error.message,
      });
    }
  },

  updateOrderHeader: async function (req, res) {
    const { orderId } = req.query;

    const { note } = req.body;

    if (!orderId) {
      return res.badRequest(Utils.jsonErr("orderId is required"));
    }

    if (!note) {
      return res.badRequest(Utils.jsonErr("note is required"));
    }

    try {
      const existedOrder = await OrderGS.findOne({ id: orderId });
      if (!existedOrder) {
        return res.badRequest(Utils.jsonErr("Order not found "));
      }

      const updated = await OrderGS.updateOne({
        id: existedOrder.id,
      }).set({
        note,
      });

      return res.json({
        success: true,
        data: updated,
        message: "Cập thật đơn hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  getOrderStatus: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const { orderId } = req.query;

    if (!orderId) {
      return res.badRequest(Utils.jsonErr("orderId is required"));
    }

    try {
      const order = await OrderGS.findOne({ id: orderId });

      if (!order) {
        return res.badRequest(Utils.jsonErr("Order not found!"));
      }

      return res.json({
        success: true,
        data: order,
        message: "Lấy thông tin đơn hàng thành công",
      })
    } catch (error) {
      return res.serverError(Utils.jsonErr("Gặp lỗi khi lấy trạng thái đơn hàng"));
    }
  },

};

// *************** Function to get root Parent of user tree
async function getRootParent(parentId) {
  try {
    if (parentId === null || typeof parentId === 'undefined' || parentId === '') { return ''; }
    let parent = await User.findOne({ id: parentId });
    if (!parent) { return ''; }
    if (parent.userType === USER_TYPE.Factory && parent.userRole === USER_ROLE.SUPER_ADMIN) { return parent; }
    return await getRootParent(parent.isChildOf);
  }
  catch (error) {
    console.log(error.message)
  }
};