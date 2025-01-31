/**
 * CustomerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const USER_TYPE = require("../constants/UserTypes");
const USER_ROLE = require("../constants/UserRoles");
module.exports = {
  createInfo: async function (req, res) {
    if (!req.body) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    try {
      const info = {
        name: req.body.name.trim(),
        phone: req.body.phone ? req.body.phone : "",
        address: req.body.address ? req.body.address : "",
        lat: req.body.lat ? req.body.lat : 0,
        long: req.body.long ? req.body.long : 0,

        playerId: req.body.playerId,
        loginprovider: req.body.loginprovider ? req.body.loginprovider : "",
        providerkey: req.body.providerkey ? req.body.providerkey : "",
      };

      if (!info.name) {
        return res.json({
          success: false,
          message: "name is not defined. Please check out again.",
        });
      }

      if (
        info.phone &&
        info.phone !== "" &&
        info.phone !== null &&
        info.phone !== undefined
      ) {
        const checkExist = await Customer.findOne({
          isDeleted: { "!=": true },
          phone: info.phone,
        });

        if (checkExist) {
          return res.json({
            success: false,
            message:
              "Số điện thoại đã tồn tại. Vui lòng sử dụng số điện thoại khác.",
          });
        }
      }

      // if (!info.address) {
      //     return res.json({
      //         success: false,
      //         message: 'address is not defined. Please check out again.'
      //     });
      // }

      // if (!info.lat) {
      //     return res.json({
      //         success: false,
      //         message: 'lat is not defined. Please check out again.'
      //     });
      // }

      // if (!info.long) {
      //     return res.json({
      //         success: false,
      //         message: 'long is not defined. Please check out again.'
      //     });
      // }

      if (!info.playerId) {
        return res.json({
          success: false,
          message: "playerId is not defined. Please check out again.",
        });
      }

      const newInfo = await Customer.create(info).fetch();

      if (!newInfo || newInfo == "" || newInfo == null) {
        return res.json({
          success: false,
          message: "Lỗi...Không thể tạo thông tin khách hàng.",
        });
      } else {
        return res.json({
          success: true,
          customerInfo: newInfo,
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },

  updateAddress: async function (req, res) {
    if (!req.body) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    try {
      const update = {
        customerId: req.body.customerId.trim(),
        address: req.body.address.trim(),
        lat: req.body.lat,
        long: req.body.long,
      };

      if (!update.customerId) {
        return res.json({
          success: false,
          message: "customerId is not defined. Please check out again.",
        });
      }

      if (!update.address) {
        return res.json({
          success: false,
          message: "address is not defined. Please check out again.",
        });
      }

      if (!update.lat) {
        return res.json({
          success: false,
          message: "lat is not defined. Please check out again.",
        });
      }

      if (!update.long) {
        return res.json({
          success: false,
          message: "long is not defined. Please check out again.",
        });
      }

      const checkCustomer = await Customer.findOne({
        isDeleted: { "!=": true },
        _id: update.customerId,
      });

      if (!checkCustomer) {
        return res.json({
          success: false,
          message: "Khách hàng không tồn tại.",
        });
      }

      const changeAddress = await Customer.updateOne({
        isDeleted: { "!=": true },
        _id: update.customerId,
      }).set({
        address: update.address,
        lat: update.lat,
        long: update.long,
      });

      if (!changeAddress || changeAddress == "" || changeAddress == null) {
        return res.json({
          success: false,
          message: "Lỗi...Không thể thay đổi thông tin khách hàng.",
        });
      } else {
        return res.json({
          success: true,
          Customer: changeAddress,
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  },

  checkCustomerIsExist: async function (req, res) {
    if (!req.body) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    try {
      const customer = {
        phone: req.body.phone.trim(),
        loginprovider: req.body.loginprovider ? req.body.loginprovider : "",
        providerkey: req.body.providerkey ? req.body.providerkey : "",
        playerId: req.body.playerId,
      };
      // console.log(customer)
      if (!customer.phone) {
        return res.json({
          success: false,
          message: "phone is not defined. Please check out again.",
        });
      }

      if (!customer.playerId) {
        return res.json({
          success: false,
          message: "playerId is not defined. Please check out again.",
        });
      }

      const checkIsExist = await Customer.findOne({
        phone: customer.phone,
        isDeleted: { "!=": true },
      });
      // console.log('checkIsExist', checkIsExist)
      if (!checkIsExist || checkIsExist == "" || checkIsExist == null) {
        return res.json({
          success: false,
          message: "Số điện thoại chưa được liên kết với bất kỳ tài khoản nào.",
        });
      }

      const updatePlayerId = await Customer.updateOne({
        phone: customer.phone,
        isDeleted: { "!=": true },
      }).set({
        playerId: customer.playerId,
      });

      if (!updatePlayerId || updatePlayerId == "" || updatePlayerId == null) {
        return res.json({
          success: false,
          message: "Lỗi...Không thể cập nhật PlayerId cho số điện thoại.",
        });
      }

      if (customer.loginprovider == "" || customer.providerkey == "") {
        return res.json({
          success: true,
          Customer: updatePlayerId,
        });
      } else {
        const updateProvider = await Customer.updateOne({
          phone: customer.phone,
          isDeleted: { "!=": true },
        }).set({
          loginprovider: customer.loginprovider,
          providerkey: customer.providerkey,
        });

        if (!updateProvider || updateProvider == "" || updateProvider == null) {
          return res.json({
            success: false,
            message: "Lỗi...Không thể cập nhật Provider cho số điện thoại.",
          });
        } else {
          return res.json({
            success: true,
            Customer: updateProvider,
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

  loginProvider: async function (req, res) {
    if (!req.body) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    try {
      const provider = {
        loginprovider: req.body.loginprovider.trim(),
        providerkey: req.body.providerkey.trim(),
        playerId: req.body.playerId.trim(),
      };

      if (!provider.loginprovider) {
        return res.json({
          success: false,
          message: "login provider is not defined. Please check out again.",
        });
      }

      if (!provider.providerkey) {
        return res.json({
          success: false,
          message: "provider key is not defined. Please check out again.",
        });
      }

      if (!provider.playerId) {
        return res.json({
          success: false,
          message: "playerId is not defined. Please check out again.",
        });
      }

      const checkProvider = await Customer.findOne({
        isDeleted: { "!=": true },
        loginprovider: provider.loginprovider,
        providerkey: provider.providerkey,
      });

      if (!checkProvider || checkProvider == "" || checkProvider == null) {
        return res.json({
          success: false,
          message: "Tài khoản provider chưa tồn tại.",
        });
      }

      const updateProvider = await Customer.updateOne({
        isDeleted: { "!=": true },
        loginprovider: provider.loginprovider,
        providerkey: provider.providerkey,
      }).set({
        playerId: provider.playerId,
      });

      if (!updateProvider || updateProvider == "" || updateProvider == null) {
        return res.json({
          success: false,
          message: "Lỗi...Không thể thay đổi playerId",
        });
      } else {
        return res.json({
          success: true,
          Customer: updateProvider,
        });
      }
    } catch (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }
  },

  getCustomerById: async function (req, res) {
    if (!req.body) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    try {
      const checkCustomerId = req.body.CustomerId.trim();

      if (!checkCustomerId) {
        return res.json({
          status: false,
          message: "Customer Id is not defined. Please check out again.",
        });
      }

      const checkCustomer = await Customer.findOne({
        isDeleted: { "!=": true },
        _id: checkCustomerId,
      });

      if (!checkCustomer || checkCustomer == "" || checkCustomer == null) {
        return res.json({
          success: false,
          message: "Lỗi...Không tìm thấy Customer.",
        });
      } else {
        return res.json({
          success: true,
          Customer: checkCustomer,
        });
      }
    } catch (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }
  },

  updateCustomerInfo: async function (req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty body"));
    }

    const {
      customerId, // Id
      name, // string
      phone, // string
      address, // string
      lat, // number
      long, // number
    } = req.body;

    if (!customerId) {
      return res.badRequest(Utils.jsonErr("customerId is required"));
    }

    try {
      const customer = await Customer.findOne({
        isDeleted: { "!=": true },
        id: customerId,
      });

      if (!customer) {
        return res.badRequest(Utils.jsonErr("Not found customer"));
      }

      let updateInfo = {};

      if (name) {
        updateInfo.name = name;
      }

      if (phone) {
        updateInfo.phone = phone;
      }

      if (address) {
        updateInfo.address = address;
      }

      if (typeof lat === "number") {
        updateInfo.lat = lat;
      }

      if (typeof long === "number") {
        updateInfo.long = long;
      }

      if (Object.keys(updateInfo).length === 0) {
        return res.badRequest(Utils.jsonErr("Không có thông tin để cập nhật"));
      }

      const resultUpdate = await Customer.updateOne({
        isDeleted: { "!=": true },
        id: customerId,
      }).set(updateInfo);

      if (resultUpdate) {
        return res.json({
          status: true,
          resCode: "SUCCESS-00029",
          data: resultUpdate,
          message: "Cập nhật thông tin khách hàng thành công",
        });
      } else {
        return res.json({
          status: false,
          resCode: "ERROR-00099",
          data: {},
          message: "Không cập nhật được thông tin khách hàng",
        });
      }
    } catch (error) {
      return res.json({
        status: false,
        resCode: "CATCH-00010",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi cập nhật thông tin khách hàng",
      });
    }
  },
  // lấy danh sách cửa hàng đại lý trong bán kính 5km 
  getListAgency: async function (req, res) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    function rad2deg(rad) {
      return rad * (180 / Math.PI);
    }
    function getDistanceBetweenPointsNew(latitude1, longitude1, latitude2, longitude2, unit = 'miles') {
      // console.log(latitude1, longitude1)
      const theta = longitude1 - longitude2;
      let distance = (Math.sin(deg2rad(latitude1)) * Math.sin(deg2rad(latitude2))) + (Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) * Math.cos(deg2rad(theta)));
      distance = Math.acos(distance);
      distance = rad2deg(distance);
      distance = distance * 60 * 1.1515 * 1.609344;
      switch (unit) {
        case 'miles':
          distance = distance * 1000
          break;
        case 'kilometers':
          break;
      }
      return (Math.round(distance * 100) / 100);
    }

    try {
      const { ownerId, lat, lng } = req.query;
      if (!lat || !lng) {
        return res.json({
          success: false,
          message: "Không xác định được vị trí khách hàng",
        });
      }
      let result
      if (!ownerId || ownerId == 'null') {
        result = await User.find({
          userType: ["General", "Agency"],
          userRole: "SuperAdmin",
          customerType: { "!=": 'Industry' },
          codetax: { "!=": null },
          isDeleted: false,
        });
      } else {
        const parentRoot = await getRootParent(ownerId)
        result = await User.find({
          userType: ["General", "Agency"],
          userRole: "SuperAdmin",
          customerType: { "!=": 'Industry' },
          codetax: { "!=": null },
          organization: parentRoot,
          isDeleted: { "!=": true }
        });
      }
      console.log(ownerId)

      // console.log(result.length)
      if (result.length > 0) {
        const newResultHavePossition = []
        const newResultNoPossition = []
        let newResult
        result.forEach((item) => {
          if (item.LAT && item.LNG) {

            const distance = getDistanceBetweenPointsNew(Number(lat), Number(lng), item.LAT, item.LNG, 'kilometers')
            if (distance <= 5) { // lấy store trong bán kính 5km
              newResultHavePossition.push({
                ...item,
                distance: `${distance} km`
              })
            }
          } else {
            newResultNoPossition.push({
              ...item,
              distance: 'Không xác định'
            })
          }
        })
        const okLength = newResultHavePossition.length
        if (okLength > 10) {
          newResult = [...newResultHavePossition]
        } else {
          newResult = [...newResultHavePossition]
          for (let i = 0; i < newResultNoPossition.length; i++) {
            newResult.push(newResultNoPossition[i])
            if (newResultHavePossition.length >= 10) {
              return
            }
          }
        }
        // console.log('newResult', newResult)
        return res.json({
          success: true,
          data: newResult,
          message: "Tìm thấy danh sách khách hàng",
        });
      } else {
        return res.json({
          success: false,
          message: "Không tìm thấy khách hàng nào",
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        message: "Gặp lỗi khi tìm kiếm danh sách khách hàng",
      });
    }
  },
};
async function getRootParent(parentId) {
  if (parentId === null || typeof parentId === "undefined" || parentId === "") {
    return "";
  }
  let parent = await User.findOne({ isDeleted: { "!=": true }, id: parentId });
  if (!parent) {
    return "";
  }
  if (
    parent.userType === USER_TYPE.Factory &&
    parent.userRole === USER_ROLE.SUPER_ADMIN
  ) {
    return parent.id;
  }
  return await getRootParent(parent.isChildOf);
}
