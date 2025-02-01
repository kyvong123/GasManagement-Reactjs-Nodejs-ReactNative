/**
 * OrderDetailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
    const { note, fromDate, toDate, userId, cylinderType, manufacture } =
      req.body;

    const listcustomer = await Promise.all(
      req.body.customerlst.map(async (element) => {
        return {
          customer: element.customer,
        };
      })
    );

    for (let i = 0; i < listcustomer.length; i++) {
      if (!listcustomer[i].customer) {
        console.log("thiếu 1 trường hoặc trường bị rỗng");
        return res.json({
          success: false,
          message: "Không có dữ liệu khách hàng",
        });
      }

      var checkUser = await User.findOne({
        _id: listcustomer[i].customer,
      });
      if (!checkUser || checkUser.length <= 0) {
        return res.json({
          success: false,
          message: "Không có khách hàng này",
        });
      }
    }

    //begin check valid mang truyen len
    const product = await Promise.all(
      req.body.typeCylinderDetail.map(async (element) => {
        return {
          categoryCylinder: element.categoryCylinder,
          price: element.price,
        };
      })
    );
    for (let i = 0; i < product.length; i++) {
      if (!product[i].categoryCylinder || !product[i].price) {
        console.log("thiếu 1 trường hoặc trường bị rỗng");
        return res.json({
          success: false,
          message: "Không có dữ liệu",
        });
      }
    }
    //end check valid mang truyen len

    //=========begin tao bang gia=======//
    let dateDelivery = new Date().toISOString();
    for (let i = 0; i < listcustomer.length; i++) {
      let typePrice = null;

      try {
        typePrice = await TypeCylinderPrice.create({
          customer: listcustomer[i].customer,
          cylinderType: cylinderType,
          note: note,
          fromDate: fromDate,
          toDate: toDate,
          createdBy: userId,
          createdAt: dateDelivery,
          status: true,
        }).fetch();
      } catch (error) {
        return res.json({
          success: false,
          message: error.message,
        });
      }
      if (!typePrice)
        return res.json({ success: false, message: "Tạo bảng giá thất bại" });
      await Promise.all(
        product.map(async (element) => {
          const typeCyliderDetail = await TypeCylinderPriceDetail.create({
            typePriceId: typePrice.id,
            customer: listcustomer[i].customer,
            manufacture: manufacture,
            categoryCylinder: element.categoryCylinder,
            price: element.price,
            createdBy: userId,
            createdAt: dateDelivery,
            cylinderType: cylinderType,
          }).fetch();

          if (!typeCyliderDetail)
            return res.json({
              success: false,
              message: "Tạo chi tiết bảng giá thất bại",
            });
        })
      );
    }

    return res.json({
      success: true,
      message: "Tạo bảng giá thành công",
    });
  },
};
