/**
 * OrderDetailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  updateMany: async function (orderDetails) {
    console.log("orderDetails", orderDetails);
    let updatedOrderDetail;
    let result = {
      success: true,
      message: "",
    };
    try {
      for (let index = 0; index < orderDetails.length; index++) {
        const element = orderDetails[index];
        if (element.quantity > 0) {
          if (
            !element.id.trim() ||
            !element.manufacture.trim() ||
            !element.categoryCylinder.trim() ||
            !element.colorGas.trim() ||
            !element.valve.trim() ||
            !element.valve.price()
          ) {
            result.success = false;
            result.message = "Vui long nhập đủ trường";
            console.log(result);
            return result;
          }
        } else {
          result.success = false;
          result.message = "số lượng phải lớn hơn 0";
          console.log(result);
          return result;
        }
        updatedOrderDetail = await OrderDetail.updateOne({
          isDeleted: { "!=": true },
          _id: element.id,
        }).set(element);
      }
      if (!updatedOrderDetail || updatedOrderDetail.length <= 0) {
        console.log("cap nhat orderDetail error");
        result.success = false;
        result.message = "cap nhat orderDetail error";
        console.log(result);
        return result;
      }
      // updatedstatusOrderGS = await OrderGS.updateOne({
      //   isDeleted: { "!=": true },
      //   _id: req.query.id,
      // }).set({
      //   status: "DON_HANG_MOI",
      //   status2 : "DON_HANG_MOI",
      // });
      console.log("update orderDetail success");
      return result;
    } catch (error) {
      console.log(error);
      result.success = false;
      result.message = error;
      return result;
    }
  },
  updateById: async function (req, res) {
    const bodyData = req.body;
    // kiểm tra nếu có không có id sẽ báo lỗi
    // nếu body rỗng thì báo lỗi
    if (
      !req.query?.id ||
      (bodyData && // 👈 null and undefined check
        Object.keys(bodyData).length === 0 &&
        Object.getPrototypeOf(bodyData) === Object.prototype)
    )
      return res.json({
        success: false,
        message: "Không có id order hoặc không có dữ liệu",
      });
    // check dữ liệu chuyền vào nếu có trường mà không có dữ liễu sẽ báo lỗi
    // nếu không có trường thì cho qua
    if (
      ("quantity" in bodyData == true && !bodyData.quantity == true) ||
      ("manufacture" in bodyData == true && !bodyData.manufacture == true) ||
      ("categoryCylinder" in bodyData == true &&
        !bodyData.categoryCylinder == true) ||
      ("colorGas" in bodyData == true && !bodyData.colorGas == true) ||
      ("valve" in bodyData == true && !bodyData.valve == true) ||
      ("price" in bodyData == true && !bodyData.price == true)
    ) {
      return res.json({
        success: false,
        message: "Không có dữ liệu",
      });
    }
    try {
      let checkStatus = await OrderGS.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      });
      const userInfor = await User.findOne({
        isDeleted: { "!=": true },
        id: req.query.userid,
      });

      // Cập nhật note trên đơn hàng 
      if (bodyData.note && checkStatus) {
        await OrderGS.updateOne({ id: checkStatus.id })
          .set({ note: bodyData.note })
      }

      if (userInfor.userType == "Khach_hang") {
        if (checkStatus.status == "DON_HANG_MOI") {
          let updatedOrderDetail = await OrderDetail.updateOne({
            isDeleted: { "!=": true },
            id: req.query.idDetail,
          }).set({
            quantity: bodyData.quantity,
            manufacture: bodyData.manufacture,
            categoryCylinder: bodyData.categoryCylinder,
            colorGas: bodyData.colorGas,
            valve: bodyData.valve,
            price: bodyData.price,
          });
          if (!updatedOrderDetail || updatedOrderDetail.length <= 0) {
            return res.json({
              success: false,
              message: "Cập nhật đơn hàng thất bại",
            });
          }
          return res.json({
            success: true,
            data: updatedOrderDetail,
            message: "Cập nhật đơn hàng thành công",
          });
        }
      }
      if (userInfor.userType != "Khach_hang") {
        let updatedOrderDetail = await OrderDetail.updateOne({
          isDeleted: { "!=": true },
          id: req.query.idDetail,
        }).set({
          quantity: bodyData.quantity,
          manufacture: bodyData.manufacture,
          categoryCylinder: bodyData.categoryCylinder,
          colorGas: bodyData.colorGas,
          valve: bodyData.valve,
          price: bodyData.price,
        });
        if (!updatedOrderDetail || updatedOrderDetail.length <= 0) {
          return res.json({
            success: false,
            message: "Cập nhật đơn hàng thất bại",
          });
        }
        return res.json({
          success: true,
          data: updatedOrderDetail,
          message: "Cập nhật đơn hàng thành công",
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },
  getOrderDetailByOrderGSId: async function (req, res) {
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order - vui lòng nhập id order",
      });
    try {
      let orderDetail = await OrderDetail.find({
        isDeleted: { "!=": true },
        orderGSId: req.query.id,
      })
        .populate("manufacture")
        .populate("categoryCylinder")
        .populate("colorGas")
        .populate("valve")
        .populate("orderGSId");
      if (!orderDetail || orderDetail.length <= 0) {
        return res.json({
          success: false,
          message: "Không tìm thấy chi tiết đơn hàng",
        });
      }
      return res.json({
        success: true,
        data: orderDetail,
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy chi tiết đơn hàng",
      });
    }
  },
  getOrderDetail: async function (req, res) {
    if (!req.query?.id)
      return res.json({
        success: false,
        message: "Không có id order detail - vui lòng nhập id order detail",
      });
    try {
      let orderDetail = await OrderDetail.findOne({
        isDeleted: { "!=": true },
        id: req.query.id,
      })
        .populate("manufacture")
        .populate("categoryCylinder")
        .populate("colorGas")
        .populate("valve");
      if (!orderDetail) {
        return res.json({
          success: false,
          message: "Không tìm thấy chi tiết đơn hàng",
        });
      }
      return res.json({
        success: true,
        data: orderDetail,
      });
    } catch (error) {
      return res.json({
        success: false,
        data: {},
        message: "Gặp lỗi khi lấy chi tiết đơn hàng",
      });
    }
  },
  create: async function (req, res) {
    const {
      orderGSId,
      manufacture,
      categoryCylinder,
      colorGas,
      valve,
      quantity,
      price,
    } = req.body;
    if (
      !orderGSId ||
      !manufacture ||
      !categoryCylinder ||
      !colorGas ||
      !valve ||
      !quantity ||
      !price
    ) {
      console.log("thiếu 1 trường hoặc trường bị rỗng");
      return res.json({
        success: false,
        message: "Không có dữ liệu",
      });
    }

    try {
      // Lấy thêm thông tin tên, khối lượng của loại bình
      const categoryInfo = await CategoryCylinder.findOne({ id: categoryCylinder })

      const orderDetail = await OrderDetail.create({
        orderGSId,
        manufacture,
        categoryCylinder,
        categoryName: categoryInfo ? categoryInfo.name : '',
        categoryMass: categoryInfo ? categoryInfo.mass : 0,
        colorGas,
        valve,
        quantity,
        price,
      }).fetch();

      if (!orderDetail)
        return res.json({
          success: false,
          message: "Tạo chi tiết đơn hàng thất bại",
        });

      return res.json({
        success: true,
        data: orderDetail,
        message: "Tạo chi tiết đơn hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr("Gặp lỗi khi tạo đơn hàng"));
    }
  },
  delete: async function (req, res) {
    if (!req.query.userid) {
      console.log("Empty req.query.userid");
      return res.badRequest(Utils.jsonErr("Empty user id"));
    }
    if (Object.keys(req.query.id).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query id order"));
    }

    const { id } = req.query;

    try {
      const deleteOrder = await OrderDetail.updateOne({
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
};
