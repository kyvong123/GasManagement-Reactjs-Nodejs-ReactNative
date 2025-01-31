/**
 * CustomerGroupsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  createCustomerGroup: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const { name, code, threshold } = req.body;
    const { userInfo } = req;

    if (!name) {
      return res.badRequest(Utils.jsonErr("Name is required"));
    }

    if (!code) {
      return res.badRequest(Utils.jsonErr("Code is required"));
    }

    if (threshold < 0) {
      return res.badRequest(Utils.jsonErr("Threshold is required"));
    }

    try {
      // Kiểm tra trùng code
      const isCodeExist = await CustomerGroups.findOne({ code, });

      if (isCodeExist) {
        return res.badRequest(Utils.jsonErr("Customer code already exists"));
      }

      const createdArea = await CustomerGroups.create({
        name,
        code,
        threshold,
        createdBy: userInfo.id,
      }).fetch();

      if (!createdArea) {
        return res.json({
          success: false,
          data: {},
          message: "Tạo nhóm khách hàng thất bại",
        });
      }

      return res.json({
        success: true,
        data: createdArea,
        message: "Tạo nhóm khách hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr("Gặp lỗi khi tạo nhóm khách hàng"));
    }
  },

  // Lấy toàn bộ danh sách nhóm khách hàng
  listCustomerGroup: async function (req, res) {
    try {

      const customersGroups = await CustomerGroups.find({ isDeleted: { "!=": true } });

      return res.json({
        success: true,
        data: customersGroups,
        message: "Đã tìm thấy",
      });

    } catch (error) {
      return res.serverError(Utils.jsonErr("Gặp lỗi khi lấy danh sách nhóm khách hàng"));
    }
  },

  // Xóa nhóm khách hàng
  deleteCustomerGroup: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const { customerTypeId, } = req.body;
    const userInfo = req.userInfo;

    if (!customerTypeId) {
      return res.badRequest(Utils.jsonErr("ID is required"));
    }

    const roles = ['SuperAdmin', 'Owner'];
    if (!roles.includes(userInfo.userRole)) {
      return res.badRequest(Utils.jsonErr("Không có quyền xóa"));
    }

    try {
      const deleted = await CustomerGroups.updateOne({
        id: customerTypeId,
      })
        .set({ isDeleted: true });

      if (!deleted) {
        return res.json({
          success: false,
          data: {},
          message: "Xóa nhóm khách hàng thất bại"
        });
      }

      return res.json({
        success: true,
        data: deleted,
        message: "Xóa nhóm khách hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

  // Cập nhật nhóm khách hàng
  updateCustomerGroup: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const { customerTypeId, name, threshold } = req.body;

    if (!customerTypeId) {
      return res.badRequest(Utils.jsonErr("ID is required"));
    }

    dataUpdate = {};

    if (name) dataUpdate.name = name;
    if (threshold >= 0) dataUpdate.threshold = threshold;

    try {
      const updated = await User.updateOne({
        _id: customerTypeId,
        isDeleted: { "!=": true },
      })
        .set(dataUpdate);

      if (!updated) {
        return res.json({ success: false, data: {}, message: "Cập nhật nhóm khách hàng thất bại" });
      }

      return res.json({
        success: true,
        data: updated,
        message: "Cập nhật nhóm khách hàng thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message));
    }
  },

};

