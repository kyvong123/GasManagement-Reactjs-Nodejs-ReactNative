/**
 * SequenceOrderCodeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createSeq: async function (req, res) {
    const {
      type,
      year,
      month,
    } = req.body

    const user = req.userInfo

    if (!type) {
      return res.badRequest(Utils.jsonErr('type is required'))
    }

    if (!year) {
      return res.badRequest(Utils.jsonErr('year is required'))
    }

    if (!month) {
      return res.badRequest(Utils.jsonErr('month is required'))
    }

    try {
      const checkType = await SequenceOrderCode.findOne({
        type,
        year,
        month,
      })

      if (checkType) {
        return res.badRequest(Utils.jsonErr('Duplicate type'))
      }

      await SequenceOrderCode.create({
        type,
        year,
        month,
        createdBy: user.id,
      })

      return res.json({
        success: true,
        // data: {},
        message: "Tạo Seq cho Order Code thành công",
      })
    } catch (error) {
      return res.serverError(Utils.jsonErr(error.message))
    }
  }
};
