/**
 * CylinderInvoiceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createCylinderInvoice: async function (req, res) {
    if (!req.body) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }
    try {
      const invoice = {
        serial: req.body.serial,
        // image: req.body.image,
        // imageCylinder: req.body.imageCylinder,
        customerID: req.body.customerID,
        // cylinderID: null,
        // name: req.body.name,
        phone: req.body.phone,
        // address: req.body.address,
      };

      if (!invoice.phone) {
        return res.json({
          success: false,
          message: "phone không xác định.",
        });
      }
      if (!invoice.serial) {
        return res.json({
          success: false,
          message: "serial không xác định.",
        });
      } else {
        const checkSerial = await Cylinder.findOne({
          isDeleted: { "!=": true },
          serial: invoice.serial,
          // isDeleted: false
        });

        if (!checkSerial || checkSerial == "" || checkSerial == null) {
          return res.json({
            success: false,
            message: "Sản phẩm không tồn tại.",
          });
        } else {
          if (checkSerial.placeStatus != "IN_CUSTOMER") {
            return res.json({
              success: false,
              message: "Sản phẩm chưa được phân phối cho người dân.",
            });
          }
        }

        invoice.cylinderID = checkSerial.id;
      }
      const _invoice = await CylinderInvoice.create(invoice).fetch();

      if (!_invoice || _invoice == "" || _invoice == null) {
        return res.json({
          success: false,
          message: "Lỗi...Tạo bản ghi thất bại.",
        });
      } else {
        return res.json({
          success: true,
          message: "Bản ghi đã được tạo thành công.",
          CylinderInvoice: _invoice,
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },
  updateCylinderInvoice: async function (req, res) {
    if (!req.query) {
      return res.badRequest(Utils.jsonErr("Empty params"));
    }
    try {
      const invoice = await CylinderInvoice.updateOne({
        isDeleted: { "!=": true },
        _id: req.query.id,
      }).set({ customConfirm: true });
      if (!invoice) {
        return res.json({
          success: false,
          message: "Cập nhật không thành công.",
        });
      } else {
        return res.json({
          success: true,
          message: "Cập nhật thành công.",
          HistoryInvoice: invoice
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },

  // Lấy tất cả bản ghi
  getAllCylinderInvoice: async function (req, res) {
    try {
      const checkInvoice = await CylinderInvoice.find({
        isDeleted: { "!=": true },
        isDeleted: false,
      })
        .populate("cylinderID")
        .populate("customerID");
      // .sort('createdAt DESC');

      if (!checkInvoice || checkInvoice == "" || checkInvoice == null) {
        return res.json({
          success: false,
          message: "Không tìm thấy bản ghi nào.",
        });
      } else {
        return res.json({
          success: true,
          CylinderInvoices: checkInvoice,
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },

  // Lấy tất cả bản ghi của 1 khách hàng
  getAllInvoiceOfCustomer: async function (req, res) {
    try {
      const checkInvoice = await CylinderInvoice.find({
        customerID: req.query.customerID,
        phone: { "!=": null },
        isDeleted: false,
      });
      // .populate('serial')
      // .populate('customerId')
      // .sort('createdAt DESC');
      if (!checkInvoice || checkInvoice == "" || checkInvoice == null) {
        return res.json({
          success: false,
          message: "Không tìm thấy bản ghi nào.",
        });
      } else {
        return res.json({
          success: true,
          CylinderInvoices: checkInvoice,
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },
};
