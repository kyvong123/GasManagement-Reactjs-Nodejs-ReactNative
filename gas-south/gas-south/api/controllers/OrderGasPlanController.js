/**
 * OrderGasController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createOrderGasPlan: async function (req, res) {
    if (!req.body) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }
    const nowDate = new Date().toISOString();

    try {
      const order = {
        customerCode: req.body.customerCode,
        customerId: req.body.customerId,
        monthPlan: req.body.monthPlan,
        yearPlan: req.body.yearPlan,
        quantity: req.body.quantity,
        userId: req.body.userId,
      };

      if (!order.customerCode) {
        return res.json({
          success: false,
          message: "customerCode is not defined. Please check out again.",
        });
      }

      if (!order.customerId) {
        return res.json({
          success: false,
          message: "customerId is not defined. Please check out again.",
        });
      }

      if (!order.monthPlan) {
        return res.json({
          success: false,
          message: "monthPlan is not defined. Please check out again.",
        });
      }

      if (!order.yearPlan) {
        return res.json({
          success: false,
          message: "yearPlan is not defined. Please check out again.",
        });
      }

      if (!order.quantity) {
        return res.json({
          success: false,
          message: "quantity is not defined. Please check out again.",
        });
      }

      const checkCustomer = await User.findOne({
        isDeleted: { "!=": true },
        _id: order.customerId,
      });

      if (!checkCustomer) {
        return res.json({
          success: false,
          message: "Khách hàng không tồn tại.",
        });
      }

      //hoapd tim neu co thi update, khong co thi create
      const checkOrdernew = await OrderGasPlan.findOne({
        isDeleted: { "!=": true },
        customerId: order.customerId,
        monthPlan: order.monthPlan,
        yearPlan: order.yearPlan,
        createdBy: order.userId,
      });

      if (checkOrdernew) {
        dataUpdate = {};
        dataUpdate.quantity = order.quantity;
        dataUpdate.updatedBy = order.userId;
        dataUpdate.updatedAt = nowDate;
        const result = await OrderGasPlan.updateOne({
          isDeleted: { "!=": true },
          _id: checkOrdernew.id,
        }).set(dataUpdate);
        if (!result) {
          return res.json({
            success: false,
            message: "Lỗi cập nhật.",
          });
        } else {
          return res.json({
            success: true,
            Order: result,
          });
        }
      } else {
        const newOrder = await OrderGasPlan.create({
          customerCode: order.customerCode,
          customerId: order.customerId,
          monthPlan: order.monthPlan,
          yearPlan: order.yearPlan,
          quantity: order.quantity,
          createdBy: order.userId,
          createdAt: nowDate,
        }).fetch();

        if (!newOrder) {
          return res.json({
            success: false,
            message: "Lỗi tạo mới.",
          });
        } else {
          return res.json({
            success: true,
            Order: newOrder,
          });
        }
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },
};
