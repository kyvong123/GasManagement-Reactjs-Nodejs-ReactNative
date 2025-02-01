/**
 * SeenOrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

  createSeenOrder: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const { userId, orderId } = req.body;

    if (!userId) {
      return res.badRequest(Utils.jsonErr("userId is required"));
    }

    if (!orderId) {
      return res.badRequest(Utils.jsonErr("orderId is required"));
    }

    try {
      const db = await SeenOrder.getDatastore().manager;
      const now = (new Date()).toISOString();

      // create a filter for a seen-order to update
      const filter = { user: ObjectId(userId), order: ObjectId(orderId) };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      // create a document that sets the date and time it last seen recently
      const updateDoc = {
        $set: {
          updatedAt: now,
        },
        $setOnInsert: {
          user: ObjectId(userId),
          order: ObjectId(orderId),
          createdAt: now,
        }
      };
      const result = await db.collection("seenorder").updateOne(filter, updateDoc, options);

      return res.json({
        success: true,
        data: result,
        message: "Tạo lịch sử xem đơn hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr("Gặp lỗi khi tạo lịch sử xem đơn hàng"));
    }
  },

  // Thống kê số lượng đơn hàng chưa xem của user
  // Tạm sử dụng
  // Cần viết lại vì hiệu suất kém
  // Dữ liệu đơn hàng lớn sẽ không hoạt động
  getNumberUnseenOrder: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const {
      userid: userId,
      To,
      From,
      orderCode,
      objectId,
      type,
      area,
      station,
    } = req.query;

    const userInfor = await User.findOne({
      id: userId,
    });

    if (!To && !From && !orderCode) {
      return res.json({
        success: false,
        message: "Vui lòng chọn ngày tháng hoặc nhập mã đơn hàng !!",
      });
    }

    try {

      let order = [];

      if (orderCode) {
        // try {
        const UpperCode = orderCode.toUpperCase();
        order = await OrderGS.find({
          isDeleted: { "!=": true },
          orderCode: UpperCode,
          customers: objectId,
          orderType: type,
        })
      }

      else if (
        userInfor.userRole === "To_nhan_lenh" ||
        userInfor.userRole === "phongKD"
      ) {
        order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": From,
            "<=": To,
          },
          customers: objectId,
          area: area,
          supplier: station,
          orderType: type,
        })
      } else if (
        userInfor.userRole === "Ke_toan" ||
        userInfor.userRole === "Ke_toan_vo_binh"
      ) {
        order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": From,
            "<=": To,
          },

          customers: objectId,
          area: area,
          supplier: station,
          orderType: type,
          status: { "!=": "DON_HANG_MOI" },
        })
      } else if (userInfor.userType === "Factory") {
        order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": From,
            "<=": To,
          },
          isDeleted: { "!=": true },
          supplier: userId,
          orderType: type,
          status: ["DA_DUYET", "DA_HOAN_THANH", "DANG_GIAO"],
        })
      } else if (userInfor.userType === "Tram") {
        order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": From,
            "<=": To,
          },
          isDeleted: { "!=": true },
          supplier: station,
          // orderType: req.query.type,
          status: ["DA_DUYET", "DA_HOAN_THANH", "DANG_GIAO"],
        })
      } else {
        order = await OrderGS.find({
          isDeleted: { "!=": true },
          createdAt: {
            ">=": From,
            "<=": To,
          },
          customers: objectId,
          area: area,
          supplier: station,
          orderType: type,
          status: { "!=": "DON_HANG_MOI" },
        })
      }

      const numberOrder = order.length;
      if (numberOrder >= 1) {
        const orderIds = order.map(ord => ObjectId(ord.id));

        const db = await OrderGS.getDatastore().manager;

        const _aggregate = await db
          .collection("ordergs")
          .aggregate([
            {
              "$match": {
                "_id": {
                  "$in": orderIds
                }
              }
            },
            {
              "$lookup": {
                "from": "seenorder",
                "let": {
                  "orderId": "$_id"
                },
                "pipeline": [
                  {
                    "$match": {
                      "$expr": {
                        "$and": [
                          {
                            "$eq": [
                              "$order",
                              "$$orderId"
                            ]
                          },
                          {
                            "$eq": [
                              "$user",
                              ObjectId(userInfor.id)
                            ]
                          }
                        ]
                      }
                    }
                  }
                ],
                "as": "seenorder"
              }
            },
            {
              "$match": {
                "seenorder": {
                  "$size": 0.0
                }
              }
            },
            {
              "$project": {
                "orderCode": 1.0
              }
            }
          ]).toArray();

        const countUnseenOrder = _aggregate.length;

        return res.json({
          success: true,
          data: countUnseenOrder,
          unseenOrder: _aggregate,
          message: "Lấy số lượng đơn hàng chưa đọc thành công",
        });
      }

      return res.json({
        success: true,
        data: 0,
        message: "Lấy số lượng đơn hàng chưa đọc thành công",
      });

    } catch (error) {
      return res.serverError(Utils.jsonErr("Gặp lỗi khi lấy số lượng đơn hàng chưa đọc"));
    }
  },

};

