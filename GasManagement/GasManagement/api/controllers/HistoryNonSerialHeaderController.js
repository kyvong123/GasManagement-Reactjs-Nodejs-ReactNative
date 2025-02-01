/**
 * HistoryNonSerialHeaderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createExportHistory: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty body'));
    }

    const {
      from,
      to,
      quantity,
      driverName,
      vehicleLicensePlate,
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

    if (!from) {
      return res.badRequest(Utils.jsonErr('from is required'));
    }
    // && details[0].manufacture == 'GasSouth'
    if (!to) {
      return res.badRequest(Utils.jsonErr('to is required'));
    }

    if (!quantity) {
      return res.badRequest(Utils.jsonErr('quantity is required'));
    }

    if (!driverName) {
      return res.badRequest(Utils.jsonErr('driverName is required'));
    }

    if (!vehicleLicensePlate) {
      return res.badRequest(Utils.jsonErr('vehicleLicensePlate is required'));
    }

    if (!Array.isArray(details)) {
      return res.badRequest(Utils.jsonErr('details is wrong type'));
    }

    if (details.length === 0) {
      return res.badRequest(Utils.jsonErr('details is required'));
    }
    try {
      const createdExportHeader = await HistoryNonSerialHeader.create({
        from,
        to,
        quantity,
        driverName,
        vehicleLicensePlate,
        type: 'EXPORT',
        typeImex: 'OUT',
        flow: 'EXPORT_CELL',
        flowDescription: details[0].manufacture == 'GasSouth' ? 'EXPORT_EMPTY_NIS_TO_REPAIR' : 'EXPORT_EMPTY_NIS_OTHER',
        createdBy: userInfo.id,
      }).fetch()

      await Promise.all(details.map(async detail => {
        await HistoryNonSerialDetail.create({
          objectId: from,
          // manufacture: detail.manufacture,
          // manufactureName: detail.manufactureName,
          typeCell: details[0].manufacture == 'GasSouth' ? 'GASSOUTH' : 'OTHER',
          cylinderType: detail.cylinderType,
          cylinderTypeName: detail.cylinderTypeName,
          quantity: detail.quantity,
          type: 'EXPORT',
          typeImex: 'OUT',
          flow: 'EXPORT_CELL',
          flowDescription: details[0].manufacture == 'GasSouth' ? 'EXPORT_EMPTY_NIS_TO_REPAIR' : 'EXPORT_EMPTY_NIS_OTHER',
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

  createImportHistory: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr('Empty body'));
    }

    const {
      from,
      to,
      quantity,
      driverName,
      vehicleLicensePlate,
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

    if (!from) {
      return res.badRequest(Utils.jsonErr('from is required'));
    }

    if (!to) {
      return res.badRequest(Utils.jsonErr('to is required'));
    }

    if (!quantity) {
      return res.badRequest(Utils.jsonErr('quantity is required'));
    }

    if (!driverName) {
      return res.badRequest(Utils.jsonErr('driverName is required'));
    }

    if (!vehicleLicensePlate) {
      return res.badRequest(Utils.jsonErr('vehicleLicensePlate is required'));
    }

    if (!Array.isArray(details)) {
      return res.badRequest(Utils.jsonErr('details is wrong type'));
    }

    if (details.length === 0) {
      return res.badRequest(Utils.jsonErr('details is required'));
    }
    // console.log('detail', details[0].manufacture)
    // console.log(from == to)
    try {
      const createdExportHeader = await HistoryNonSerialHeader.create({
        from,
        to,
        quantity,
        driverName,
        vehicleLicensePlate,
        type: from == to ? 'TURN_BACK' : 'IMPORT',
        typeImex: 'IN',
        flow: from == to ? 'TURN_BACK' : 'IMPORT_CELL',
        flowDescription: from == to ? 'TURN_BACK' : details[0].manufacture == 'GasSouth' ? 'IMPORT_EMPTY_NIS_TO_REPAIR' : 'IMPORT_EMPTY_NIS_OTHER',
        createdBy: userInfo.id,
      }).fetch()

      await Promise.all(details.map(async detail => {
        await HistoryNonSerialDetail.create({
          objectId: to,
          // manufacture: detail.manufacture,
          // manufactureName: detail.manufactureName,
          typeCell: details[0].manufacture == 'GasSouth' ? 'GASSOUTH' : 'OTHER',
          cylinderType: detail.cylinderType,
          cylinderTypeName: detail.cylinderTypeName,
          quantity: detail.quantity,
          type: from == to ? 'TURN_BACK' : 'IMPORT',
          typeImex: 'IN',
          flow: from == to ? 'TURN_BACK' : 'IMPORT_CELL',
          flowDescription: from == to ? 'TURN_BACK' : details[0].manufacture == 'GasSouth' ? 'IMPORT_EMPTY_NIS_TO_REPAIR' : 'IMPORT_EMPTY_NIS_OTHER',
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
