/**
 * HistoryNonSerialLiquidationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // Thanh lý bình
  createLiquidationHistory: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty body'));
    }

    const {
      objectId,
      quantity,
      details,
      // [
      //   {
      //     manufacture,
      //     manufactureName,
      //     cylinderType,
      //     cylinderTypeName,
      //     quantity,
      //   },
      //   ...
      // ]
    } = req.body

    const userInfo = req.userInfo

    if (!objectId) {
      return res.badRequest(Utils.jsonErr('objectId is required'));
    }

    if (!quantity) {
      return res.badRequest(Utils.jsonErr('quantity is required'));
    }

    if (!Array.isArray(details)) {
      return res.badRequest(Utils.jsonErr('details is wrong type'));
    }

    if (details.length === 0) {
      return res.badRequest(Utils.jsonErr('details is required'));
    }
    try {
      const createdExportHeader = await HistoryNonSerialLiquidationHeader.create({
        objectId,
        quantity,
        type: 'LIQUIDATE',
        typeImex: 'OUT',
        flow: 'LIQUIDATE',
        flowDescription: 'LIQUIDATE',
        createdBy: userInfo.id,
      }).fetch()

      await Promise.all(details.map(async detail => {
        await HistoryNonSerialLiquidationDetail.create({
          objectId: objectId,
          // manufacture: detail.manufacture,
          // manufactureName: detail.manufactureName,
          numberContract: detail.numberContract,
          cylinderType: detail.cylinderType,
          cylinderTypeName: detail.cylinderTypeName,
          quantity: detail.quantity,
          type: 'LIQUIDATE',
          typeImex: 'OUT',
          flow: 'LIQUIDATE',
          flowDescription: 'LIQUIDATE',
          header: createdExportHeader.id,
          createdBy: userInfo.id,
        })
      }))

      return res.json({ success: true, message: "Tạo thành công" });
    }
    catch (err) {
      return res.json({ success: false, message: "Gặp lỗi khi tạo bản ghi" });
    }

  },
};
