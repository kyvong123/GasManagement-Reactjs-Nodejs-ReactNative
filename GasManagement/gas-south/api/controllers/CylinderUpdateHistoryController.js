/**
 * CylinderUpdateHistoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getCylinderUpdateHistory: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const { idCylinder } = req.query;

    if (!idCylinder) {
      return res.badRequest(Utils.jsonErr("idCylinder is required"));
    }

    try {
      const result = await CylinderUpdateHistory.find({
        cylinder: idCylinder,
      })
        .populate('manufacture');

      return res.json({
        success: true,
        data: result,
        message: "Lấy lịch sử cập nhật thông tin bình thành công",
      });
    } catch (error) {
      return res.serverError(Utils.jsonErr("Gặp lỗi khi lấy lịch sử cập nhật thông tin bình"));
    }
  },

};

