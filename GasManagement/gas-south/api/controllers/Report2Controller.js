/**
 * Report2Controller
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const USER_TYPE = require("../constants/UserTypes");
const USER_ROLE = require("../constants/UserRoles");
const e = require("express");

module.exports = {
  // Thống kê trạm
  // Nếu xem từ Chi nhánh thì thống kê các trạm của chi nhánh đó
  getStatistic: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
      statisticalType, // isIn: ['byItself', 'byItsChildren']
      // filter,          // Theo loại bình [6, 12, 20, 45, ...]
    } = req.query;

    let {
      startDate, // ISODate
      endDate, // ISODate
    } = req.query;
    console.log(req.query);
    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    // if (!startDate) {
    //     return res.badRequest(Utils.jsonErr('startDate is required'));
    // }

    // if (!endDate) {
    //     return res.badRequest(Utils.jsonErr('endDate is required'));
    // }

    if (!statisticalType) {
      return res.badRequest(Utils.jsonErr("statisticalType is required"));
    } else {
      const typeStatistic = ["byItself", "byItsChildren"];
      if (!typeStatistic.includes(statisticalType)) {
        return res.badRequest(Utils.jsonErr("statisticalType is wrong"));
      }
    }

    try {
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, "0");
        let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + "/" + dd + "/" + yyyy;

        startDate = new Date(today).toISOString();
        endDate = new Date().toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến thời điểm hiện tại
        // startDate = startDate
        endDate = new Date().toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ 1970-01-01 đến endDate
        startDate = new Date(0).toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
        isDeleted: false,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // Tìm parentRoot
      const parent = await getRootParent(target);
      if (!parent) {
        return res.badRequest(Utils.jsonErr("parentRoot not found"));
      }

      // Tìm danh sách loại bình
      const cylinderCategory = await CategoryCylinder.find({
        isDeleted: { "!=": true },
        createdBy: parent.id,
        isDeleted: false,
      });
      const _numberCategory = cylinderCategory.length;

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp thống kê chính nó
      if (statisticalType === "byItself") {
        returnData.data.push({
          id: infoTarget.id,
          name: infoTarget.name,
          detail: [],
        });

        returnData.data[0].detail = await Promise.all(
          cylinderCategory.map(async (category) => {
            return {
              id: category.id,
              code: category.code,
              name: category.name,
              mass: category.mass,
              statistic: {
                // Tạo mới
                create: 0,
                // Nhập vỏ
                importShellFromFixer: 0,
                importShellFromElsewhere: 0,
                turnback: 0,
                returnFullCylinder: 0, // hồi lưu bình đầy
                // Xuất vỏ:
                exportShellToFixer: 0,
                exportShellToElsewhere: 0,
                // Bán hàng:
                numberSale: 0,
                // Xuất hàng:
                numberExport: 0,
                massExport: 0,
                // Thanh lý
                cancel: 0 /* Tạm thời chưa tính */,
                // Tồn kho
                inventory: 0,
              },
            };
          })
        );

        // *** BEGIN - CHỈNH LẠI NGÀY TÌM KIẾM THEO COLLECTION STATISTIC *** //
        const dataStatistic = await Statistic.find({
          idStation: infoTarget.id,
          startDate: { ">=": startDate },
          endDate: { "<=": endDate },
          isDeleted: { "!=": true },
        }).sort("startDate ASC");
        // /!\
        // - Trường hợp không tìm thấy startDate trong collection Statistic
        // /!\
        // - Trường hợp không tìm thấy endDate trong collection Statistic
        // /!\
        // Trường hợp tìm thấy cả startDate và endDate trong collection Statistic
        // *** END - CHỈNH LẠI NGÀY TÌM KIẾM THEO COLLECTION STATISTIC *** //

        // - // - //
        if (dataStatistic.length > 0) {
          // --- GROUP Statistic theo startDate ---
          const groupStatisticByDay = await groupByArray(
            dataStatistic,
            "startDate"
          );

          await Promise.all(
            groupStatisticByDay.map(async (eachDayStatistic, indexEachDay) => {
              const _lastDayStatistic = groupStatisticByDay.length - 1;

              await Promise.all(
                returnData.data[0].detail.map(async (cylinderType, index) => {
                  const indexStatistic = eachDayStatistic.values.findIndex(
                    (statistic) => cylinderType.id === statistic.idCylinderType
                  );

                  // Tạo mới
                  returnData.data[0].detail[index].statistic.create +=
                    eachDayStatistic.values[indexStatistic].create;
                  // Nhập vỏ
                  returnData.data[0].detail[
                    index
                  ].statistic.importShellFromFixer +=
                    eachDayStatistic.values[
                      indexStatistic
                    ].importShellFromFixer;
                  returnData.data[0].detail[
                    index
                  ].statistic.importShellFromElsewhere +=
                    eachDayStatistic.values[
                      indexStatistic
                    ].importShellFromElsewhere;
                  returnData.data[0].detail[index].statistic.turnback +=
                    eachDayStatistic.values[indexStatistic].turnback;
                  returnData.data[0].detail[
                    index
                  ].statistic.returnFullCylinder +=
                    eachDayStatistic.values[indexStatistic].returnFullCylinder;
                  // Xuất vỏ:
                  returnData.data[0].detail[
                    index
                  ].statistic.exportShellToFixer +=
                    eachDayStatistic.values[indexStatistic].exportShellToFixer;
                  returnData.data[0].detail[
                    index
                  ].statistic.exportShellToElsewhere +=
                    eachDayStatistic.values[
                      indexStatistic
                    ].exportShellToElsewhere;
                  // Xuất hàng:
                  returnData.data[0].detail[index].statistic.numberExport +=
                    eachDayStatistic.values[indexStatistic].numberExport;
                  returnData.data[0].detail[index].statistic.massExport +=
                    eachDayStatistic.values[indexStatistic].massExport;
                  // Bán hàng:
                  returnData.data[0].detail[index].statistic.numberSale +=
                    eachDayStatistic.values[indexStatistic].numberSale;
                  // Thanh lý
                  returnData.data[0].detail[index].statistic.cancel +=
                    eachDayStatistic.values[indexStatistic].cancel;
                  // Tồn kho - lấy theo ngày cuối cùng
                  if (indexEachDay === _lastDayStatistic) {
                    returnData.data[0].detail[index].statistic.inventory =
                      eachDayStatistic.values[indexStatistic].inventory;
                  }
                })
              );
            })
          );

          // Trường hợp startDate và endDate nằm trong khoảng statistic đã tính toán sẵn
          if (
            startDate === dataStatistic[0].startDate &&
            endDate === dataStatistic[dataStatistic.length - 1].endDate
          ) {
          }
          // Trường hợp startDate và endDate nằm ngoài khoảng statistic đã tính toán sẵn
          else {
            const dateCalculate = [];

            // Tính toán lại startDate và endDate
            if (endDate !== dataStatistic[dataStatistic.length - 1].endDate) {
              dateCalculate.push({
                startDate: dataStatistic[dataStatistic.length - 1].endDate,
                endDate,
              });
            }
            if (startDate !== dataStatistic[0].startDate) {
              dateCalculate.push({
                startDate,
                endDate: dataStatistic[0].startDate,
              });
            }

            dateCalculate.sort(compareEndDate);

            await Promise.all(
              dateCalculate.map(async (dateCal, _indexDateCal) => {
                const _lastDayCalculate = dateCalculate.length - 1;

                // BEGIN === Code tạm ===
                // Coi nhà máy được tạo bởi công ty mẹ là Chi nhánh Bình Khí
                const fixers = await User.find({
                  isDeleted: { "!=": true },
                  isChildOf: parent.id,
                  userType: "Fixer",
                  userRole: "SuperAdmin",
                  isDeleted: false,
                });
                const infoBinhKhi = fixers[0];
                // END === Code tạm ===

                // *** BEGIN Tính số lượng khai báo bình ***
                // Tính số lượng bình được khai báo trong khoảng thời gian
                // Và lọc danh sách bình theo từng loại
                await Promise.all(
                  returnData.data[0].detail.map(async (cylinderType, index) => {
                    const count = await CylinderImex.count({
                      createdAt: {
                        ">=": dateCal.startDate,
                        "<=": dateCal.endDate,
                      },
                      objectId: target,
                      category: cylinderType.id,
                      flow: "CREATE",
                      isDeleted: false,
                    });
                    returnData.data[0].detail[index].statistic.create += count;
                  })
                );
                // *** END Tính số lượng khai báo bình ***

                // *** BEGIN Tính nhập bình ***
                // Tìm bản ghi nhập bình trong khoảng thời gian
                let importHistoryRecord = await History.find({
                  createdAt: { ">=": dateCal.startDate, "<=": dateCal.endDate },
                  to: target,
                  type: { in: ["IMPORT", "TURN_BACK", "RETURN"] },
                  isDeleted: { "!=": true },
                }).populate("cylinders");

                // Trường hợp có nhà máy (Bình Khí)
                if (infoBinhKhi) {
                  // Tìm bản ghi nhập vỏ từ Chi nhánh Bình Khí
                  let importHR_fromFixer = _.remove(
                    importHistoryRecord,
                    (o) => {
                      return o.from === infoBinhKhi.id && o.type === "IMPORT";
                    }
                  );
                  if (importHR_fromFixer.length > 0) {
                    await Promise.all(
                      importHR_fromFixer.map(async (history) => {
                        // Lọc danh sách bình theo từng loại
                        for (let i = 0; i < _numberCategory; i++) {
                          const count = _.remove(history.cylinders, (o) => {
                            return (
                              o.category === returnData.data[0].detail[i].id
                            );
                          });
                          returnData.data[0].detail[
                            i
                          ].statistic.importShellFromFixer += count.length;
                        }
                      })
                    );
                  }
                }

                // Tìm bản ghi nhập vỏ từ nơi khác
                let importHR_fromElsewhere = _.remove(
                  importHistoryRecord,
                  (o) => {
                    return (
                      /* o.from !== infoBinhKhi.id && */ o.type === "IMPORT"
                    );
                  }
                );
                if (importHR_fromElsewhere.length > 0) {
                  await Promise.all(
                    importHR_fromElsewhere.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      for (let i = 0; i < _numberCategory; i++) {
                        const count = _.remove(history.cylinders, (o) => {
                          return o.category === returnData.data[0].detail[i].id;
                        });
                        returnData.data[0].detail[
                          i
                        ].statistic.importShellFromElsewhere += count.length;
                      }
                    })
                  );
                }

                // Tìm bản ghi hồi lưu bình đầy
                let return_fullCylinders = _.remove(
                  importHistoryRecord,
                  (o) => {
                    return (
                      /* o.from !== infoBinhKhi.id && */ o.type === "RETURN"
                    );
                  }
                );
                if (return_fullCylinders.length > 0) {
                  await Promise.all(
                    return_fullCylinders.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      for (let i = 0; i < _numberCategory; i++) {
                        const count = _.remove(history.cylinders, (o) => {
                          return o.category === returnData.data[0].detail[i].id;
                        });
                        returnData.data[0].detail[
                          i
                        ].statistic.returnFullCylinder += count.length;
                      }
                    })
                  );
                }

                // Còn lại là bản ghi hồi lưu trong importHistoryRecord
                if (importHistoryRecord.length > 0) {
                  await Promise.all(
                    importHistoryRecord.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      for (let i = 0; i < _numberCategory; i++) {
                        const count = _.remove(history.cylinders, (o) => {
                          return o.category === returnData.data[0].detail[i].id;
                        });
                        returnData.data[0].detail[i].statistic.turnback +=
                          count.length;
                      }
                    })
                  );
                }
                // *** END Tính nhập bình ***

                // *** BEGIN Tính xuất vỏ ***
                // Tìm bản ghi xuất vỏ trong khoảng thời gian
                // OLD-VERSION: Chỉ tính xuất vỏ có bản ghi nhập tương ứng
                // NEW-VERSION: Có thể phát sinh lỗi khi xuất vỏ cho trạm và Bình Khí cùng 1 lúc
                let exportShellHistoryRecord = await History.find({
                  isDeleted: { "!=": true },
                  createdAt: { ">=": dateCal.startDate, "<=": dateCal.endDate },
                  // type: 'IMPORT', // OLD-VERSION
                  from: target,
                  type: "EXPORT", // NEW-VERSION
                  typeForPartner: { "!=": "" },
                })
                  .populate("toArray")
                  .populate("cylinders");

                // Trường hợp có nhà máy (Bình Khí)
                if (infoBinhKhi) {
                  // Tìm bản ghi xuất vỏ tới Chi nhánh Bình Khí
                  let exportHR_toFixer = _.remove(
                    exportShellHistoryRecord,
                    (o) => {
                      // return o.to === infoBinhKhi.id;
                      return (
                        o.typeForPartner === "TO_FIX" &&
                        o.toArray.find((_to) => _to.id === infoBinhKhi.id)
                      );
                    }
                  );
                  if (exportHR_toFixer.length > 0) {
                    await Promise.all(
                      exportHR_toFixer.map(async (history) => {
                        // Lọc danh sách bình theo từng loại
                        for (let i = 0; i < _numberCategory; i++) {
                          const count = _.remove(history.cylinders, (o) => {
                            return (
                              o.category === returnData.data[0].detail[i].id
                            );
                          });
                          returnData.data[0].detail[
                            i
                          ].statistic.exportShellToFixer += count.length;
                        }
                      })
                    );
                  }
                }

                // Còn lại là bản ghi xuất vỏ tới nơi khác trong importHistoryRecord;
                if (exportShellHistoryRecord.length > 0) {
                  await Promise.all(
                    exportShellHistoryRecord.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      for (let i = 0; i < _numberCategory; i++) {
                        const count = _.remove(history.cylinders, (o) => {
                          return o.category === returnData.data[0].detail[i].id;
                        });
                        returnData.data[0].detail[
                          i
                        ].statistic.exportShellToElsewhere += count.length;
                      }
                    })
                  );
                }
                // *** END Tính xuất vỏ ***

                // *** BEGIN Tính xuất hàng ***
                // Tìm bản ghi xuất hàng trong khoảng thời gian
                let exportHistoryRecord = await History.find({
                  isDeleted: { "!=": true },
                  createdAt: { ">=": dateCal.startDate, "<=": dateCal.endDate },
                  from: target,
                  type: "EXPORT",
                  typeForPartner: "",
                }).populate("cylinders");

                if (exportHistoryRecord.length > 0) {
                  await Promise.all(
                    exportHistoryRecord.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      await Promise.all(
                        returnData.data[0].detail.map(
                          async (cylinderType, index) => {
                            const count = _.remove(history.cylinders, (o) => {
                              return o.category === cylinderType.id;
                            });
                            returnData.data[0].detail[
                              index
                            ].statistic.numberExport += count.length;
                            returnData.data[0].detail[
                              index
                            ].statistic.massExport +=
                              count.length * cylinderType.mass;
                          }
                        )
                      );
                      // for (let i = 0; i < _numberCategory; i++) {
                      //     const count = _.remove(history.cylinders, o => { return o.category === returnData.data[0].detail[i].id; });
                      //     returnData.data[0].detail[i].statistic.numberExport += count.length
                      // }
                    })
                  );
                }
                // *** END Tính xuất hàng ***

                // *** BEGIN Bán hàng ***
                // Tìm bản ghi xuất hàng trong khoảng thời gian
                let saleHistoryRecord = await History.find({
                  isDeleted: { "!=": true },
                  createdAt: { ">=": startDate, "<=": endDate },
                  from: target,
                  type: "SALE",
                }).populate("cylinders");
                // console.log(saleHistoryRecord.cylinders, 'length sale')
                if (saleHistoryRecord.length > 0) {
                  await Promise.all(
                    saleHistoryRecord.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      await Promise.all(
                        returnData.data[0].detail.map(
                          async (cylinderType, index) => {
                            const count = _.remove(history.cylinders, (o) => {
                              return o.category === cylinderType.id;
                            });
                            returnData.data[0].detail[
                              index
                            ].statistic.numberSale += count.length;
                          }
                        )
                      );
                      // for (let i = 0; i < _numberCategory; i++) {
                      //     const count = _.remove(history.cylinders, o => { return o.category === returnData.data[0].detail[i].id; });
                      //     returnData.data[0].detail[i].statistic.numberExport += count.length
                      // }
                    })
                  );
                }
                // *** END Tính bán hàng ***

                // *** BEGIN Tính vỏ thanh lý ***
                // Lọc danh sách bình theo từng loại
                await Promise.all(
                  returnData.data[0].detail.map(async (cylinderType, index) => {
                    // Tìm bản ghi thánh lý trong khoảng thời gian
                    const count = await CylinderImex.count({
                      createdAt: {
                        ">=": dateCal.startDate,
                        "<=": dateCal.endDate,
                      },
                      objectId: target,
                      category: cylinderType.id,
                      flow: "CANCEL",
                    });
                    returnData.data[0].detail[index].statistic.cancel += count;
                  })
                );
                // *** END Tính vỏ thanh lý ***

                // *** BEGIN Tính tồn kho ***
                if (
                  _indexDateCal === _lastDayCalculate &&
                  // Trường hợp endDate gửi lên là ngày đã được tính thống kê
                  endDate !== dataStatistic[dataStatistic.length - 1].endDate
                ) {
                  for (let i = 0; i < _numberCategory; i++) {
                    //                        [dataStatistic]
                    //         4  5       5  6       6  7       7  8
                    // ---------||---------||---------||---------||---------> Time
                    //       end  start end  start end  start end  start
                    //                 ^                    ^
                    //                 |                    |
                    //                 ----------------------
                    //               start                 end

                    // Tìm bản ghi nhập kho tính từ dateCal.startDate đến dateCal.endDate
                    const count_importHistoryRecord = await CylinderImex.count({
                      createdAt: {
                        ">": dateCal.startDate,
                        "<=": dateCal.endDate,
                      },
                      objectId: target,
                      category: returnData.data[0].detail[i].id,
                      typeImex: "IN",
                    });

                    // Tìm bản ghi xuất kho tính từ dateCal.startDate đến dateCal.endDate
                    const count_exportHistoryRecord = await CylinderImex.count({
                      createdAt: {
                        ">": dateCal.startDate,
                        "<=": dateCal.endDate,
                      },
                      objectId: target,
                      category: returnData.data[0].detail[i].id,
                      typeImex: "OUT",
                    });

                    returnData.data[0].detail[i].statistic.inventory +=
                      count_importHistoryRecord - count_exportHistoryRecord;
                  }
                }
                // *** END Tính tồn kho ***
              })
            );
          }
        }
        // - // - //
        else {
          // BEGIN === Code tạm ===
          // Coi nhà máy được tạo bởi công ty mẹ là Chi nhánh Bình Khí
          const fixers = await User.find({
            isDeleted: { "!=": true },
            isChildOf: parent.id,
            userType: "Fixer",
            userRole: "SuperAdmin",
            isDeleted: false,
          });
          const infoBinhKhi = fixers[0];
          // END === Code tạm ===

          // *** BEGIN Tính số lượng khai báo bình ***
          // Tính số lượng bình được khai báo trong khoảng thời gian
          // Và lọc danh sách bình theo từng loại
          await Promise.all(
            returnData.data[0].detail.map(async (cylinderType, index) => {
              const count = await CylinderImex.count({
                createdAt: { ">=": startDate, "<=": endDate },
                objectId: target,
                category: cylinderType.id,
                flow: "CREATE",
              });
              returnData.data[0].detail[index].statistic.create = count;
            })
          );
          // *** END Tính số lượng khai báo bình ***

          // *** BEGIN Tính nhập bình ***
          // Tìm bản ghi nhập bình trong khoảng thời gian
          let importHistoryRecord = await History.find({
            isDeleted: { "!=": true },
            createdAt: { ">=": startDate, "<=": endDate },
            to: target,
            type: { in: ["IMPORT", "TURN_BACK", "RETURN"] },
          }).populate("cylinders");

          // Trường hợp có nhà máy (Bình Khí)
          if (infoBinhKhi) {
            // Tìm bản ghi nhập vỏ từ Chi nhánh Bình Khí
            let importHR_fromFixer = _.remove(importHistoryRecord, (o) => {
              return o.from === infoBinhKhi.id && o.type === "IMPORT";
            });
            if (importHR_fromFixer.length > 0) {
              await Promise.all(
                importHR_fromFixer.map(async (history) => {
                  // Lọc danh sách bình theo từng loại
                  for (let i = 0; i < _numberCategory; i++) {
                    const count = _.remove(history.cylinders, (o) => {
                      return o.category === returnData.data[0].detail[i].id;
                    });
                    returnData.data[0].detail[
                      i
                    ].statistic.importShellFromFixer += count.length;
                  }
                })
              );
            }
          }

          // Tìm bản ghi nhập vỏ từ nơi khác
          let importHR_fromElsewhere = _.remove(importHistoryRecord, (o) => {
            return /* o.from !== infoBinhKhi.id && */ o.type === "IMPORT";
          });
          if (importHR_fromElsewhere.length > 0) {
            await Promise.all(
              importHR_fromElsewhere.map(async (history) => {
                // Lọc danh sách bình theo từng loại
                for (let i = 0; i < _numberCategory; i++) {
                  const count = _.remove(history.cylinders, (o) => {
                    return o.category === returnData.data[0].detail[i].id;
                  });
                  returnData.data[0].detail[
                    i
                  ].statistic.importShellFromElsewhere += count.length;
                }
              })
            );
          }

          // Tìm bản ghi hồi lưu bình đầy
          let return_fullCylinders = _.remove(importHistoryRecord, (o) => {
            return /* o.from !== infoBinhKhi.id && */ o.type === "RETURN";
          });
          if (return_fullCylinders.length > 0) {
            await Promise.all(
              return_fullCylinders.map(async (history) => {
                // Lọc danh sách bình theo từng loại
                for (let i = 0; i < _numberCategory; i++) {
                  const count = _.remove(history.cylinders, (o) => {
                    return o.category === returnData.data[0].detail[i].id;
                  });
                  returnData.data[0].detail[i].statistic.returnFullCylinder +=
                    count.length;
                }
              })
            );
          }

          // Còn lại là bản ghi hồi lưu trong importHistoryRecord
          if (importHistoryRecord.length > 0) {
            await Promise.all(
              importHistoryRecord.map(async (history) => {
                // Lọc danh sách bình theo từng loại
                for (let i = 0; i < _numberCategory; i++) {
                  const count = _.remove(history.cylinders, (o) => {
                    return o.category === returnData.data[0].detail[i].id;
                  });
                  returnData.data[0].detail[i].statistic.turnback +=
                    count.length;
                }
              })
            );
          }
          // *** END Tính nhập bình ***

          // *** BEGIN Tính xuất vỏ ***
          // Tìm bản ghi xuất vỏ trong khoảng thời gian
          // OLD-VERSION: Chỉ tính xuất vỏ có bản ghi nhập tương ứng
          // NEW-VERSION: Có thể phát sinh lỗi khi xuất vỏ cho trạm và Bình Khí cùng 1 lúc
          let exportShellHistoryRecord = await History.find({
            isDeleted: { "!=": true },
            createdAt: { ">=": startDate, "<=": endDate },
            // type: 'IMPORT', // OLD-VERSION
            from: target,
            type: "EXPORT", // NEW-VERSION
            typeForPartner: { "!=": "" },
          })
            .populate("toArray")
            .populate("cylinders");

          // Trường hợp có nhà máy (Bình Khí)
          if (infoBinhKhi) {
            // Tìm bản ghi xuất vỏ tới Chi nhánh Bình Khí
            let exportHR_toFixer = _.remove(exportShellHistoryRecord, (o) => {
              // return o.to === infoBinhKhi.id;
              return (
                o.typeForPartner === "TO_FIX" &&
                o.toArray.find((_to) => _to.id === infoBinhKhi.id)
              );
            });
            if (exportHR_toFixer.length > 0) {
              await Promise.all(
                exportHR_toFixer.map(async (history) => {
                  // Lọc danh sách bình theo từng loại
                  for (let i = 0; i < _numberCategory; i++) {
                    const count = _.remove(history.cylinders, (o) => {
                      return o.category === returnData.data[0].detail[i].id;
                    });
                    returnData.data[0].detail[i].statistic.exportShellToFixer +=
                      count.length;
                  }
                })
              );
            }
          }

          // Còn lại là bản ghi xuất vỏ tới nơi khác trong importHistoryRecord;
          if (exportShellHistoryRecord.length > 0) {
            await Promise.all(
              exportShellHistoryRecord.map(async (history) => {
                // Lọc danh sách bình theo từng loại
                for (let i = 0; i < _numberCategory; i++) {
                  const count = _.remove(history.cylinders, (o) => {
                    return o.category === returnData.data[0].detail[i].id;
                  });
                  returnData.data[0].detail[
                    i
                  ].statistic.exportShellToElsewhere += count.length;
                }
              })
            );
          }
          // *** END Tính xuất vỏ ***

          // *** BEGIN Tính xuất hàng ***
          // Tìm bản ghi xuất hàng trong khoảng thời gian
          let exportHistoryRecord = await History.find({
            isDeleted: { "!=": true },
            createdAt: { ">=": startDate, "<=": endDate },
            from: target,
            type: "EXPORT",
            typeForPartner: "",
          }).populate("cylinders");

          if (exportHistoryRecord.length > 0) {
            await Promise.all(
              exportHistoryRecord.map(async (history) => {
                // Lọc danh sách bình theo từng loại
                await Promise.all(
                  returnData.data[0].detail.map(async (cylinderType, index) => {
                    const count = _.remove(history.cylinders, (o) => {
                      return o.category === cylinderType.id;
                    });
                    returnData.data[0].detail[index].statistic.numberExport +=
                      count.length;
                    returnData.data[0].detail[index].statistic.massExport +=
                      count.length * cylinderType.mass;
                  })
                );
                // for (let i = 0; i < _numberCategory; i++) {
                //     const count = _.remove(history.cylinders, o => { return o.category === returnData.data[0].detail[i].id; });
                //     returnData.data[0].detail[i].statistic.numberExport += count.length
                // }
              })
            );
          }
          // *** END Tính nhập hàng ***

          // *** BEGIN Bán hàng ***
          // Tìm bản ghi xuất hàng trong khoảng thời gian
          let saleHistoryRecord = await History.find({
            isDeleted: { "!=": true },
            createdAt: { ">=": startDate, "<=": endDate },
            from: target,
            type: "SALE",
          }).populate("cylinders");
          // console.log(saleHistoryRecord.cylinders, 'length sale')
          if (saleHistoryRecord.length > 0) {
            await Promise.all(
              saleHistoryRecord.map(async (history) => {
                // Lọc danh sách bình theo từng loại
                await Promise.all(
                  returnData.data[0].detail.map(async (cylinderType, index) => {
                    const count = _.remove(history.cylinders, (o) => {
                      return o.category === cylinderType.id;
                    });
                    returnData.data[0].detail[index].statistic.numberSale +=
                      count.length;
                  })
                );
                // for (let i = 0; i < _numberCategory; i++) {
                //     const count = _.remove(history.cylinders, o => { return o.category === returnData.data[0].detail[i].id; });
                //     returnData.data[0].detail[i].statistic.numberExport += count.length
                // }
              })
            );
          }
          // *** END Tính bán hàng ***

          // *** BEGIN Tính vỏ thanh lý ***
          // Lọc danh sách bình theo từng loại
          await Promise.all(
            returnData.data[0].detail.map(async (cylinderType, index) => {
              // Tìm bản ghi thánh lý trong khoảng thời gian
              const count = await CylinderImex.count({
                createdAt: { ">=": startDate, "<=": endDate },
                objectId: target,
                category: cylinderType.id,
                flow: "CANCEL",
              });
              returnData.data[0].detail[index].statistic.cancel += count;
            })
          );
          // *** END Tính vỏ thanh lý ***

          // *** BEGIN Tính tồn kho ***
          //
          //                        [dataStatistic]
          //                               6  7       7  8
          // -------------------------------||---------||---------------------------> Time
          //                             end  start end  start
          //      ^                    ^                      ^                    ^
          //      |                    |                      |                    |
          //      ----------------------                      ----------------------
          //      start                 end                   start                 end

          // Tìm bản ghi Statistic ngay sau endDate
          const lastDayStatistic = await Statistic.find({
            isDeleted: { "!=": true },
            // startDate: { '>=': startDate },
            endDate: { "<=": endDate },
            idStation: infoTarget.id,
          })
            .sort("endDate DESC")
            .limit(1);

          // Trường hợp tìm thấy ngày có bản ghi Statistic
          if (lastDayStatistic.length !== 0) {
            // Tìm các bản ghi trong ngày đó
            const lastDataStatistic = await Statistic.find({
              isDeleted: { "!=": true },
              endDate: lastDayStatistic[0].endDate,
              idStation: infoTarget.id,
            });

            // Lấy tồn kho của ngày gần nhất trong Statistic cho từng loại bình
            await Promise.all(
              returnData.data[0].detail.map(async (category, index) => {
                const foundIndex = lastDataStatistic.findIndex(
                  (_dataStatistic) =>
                    _dataStatistic.idCylinderType === category.id
                );

                if (foundIndex !== -1) {
                  returnData.data[0].detail[index].statistic.inventory =
                    lastDataStatistic[foundIndex].inventory;
                }
              })
            );

            for (let i = 0; i < _numberCategory; i++) {
              // Tìm bản ghi nhập kho tính từ bản ghi Statistic của ngày gần nhất đến endDate
              const count_importHistoryRecord = await CylinderImex.count({
                createdAt: { ">": lastDayStatistic[0].endDate, "<=": endDate },
                objectId: target,
                category: returnData.data[0].detail[i].id,
                typeImex: "IN",
              });

              // Tìm bản ghi xuất kho tính từ bản ghi Statistic của ngày gần nhất đến endDate
              const count_exportHistoryRecord = await CylinderImex.count({
                createdAt: { ">": lastDayStatistic[0].endDate, "<=": endDate },
                objectId: target,
                category: returnData.data[0].detail[i].id,
                typeImex: "OUT",
              });

              returnData.data[0].detail[i].statistic.inventory +=
                count_importHistoryRecord - count_exportHistoryRecord;
            }
          }
          // Trường hợp không tìm thấy bản ghi Statistic nào
          else {
            for (let i = 0; i < _numberCategory; i++) {
              // Tìm bản ghi nhập kho tính đến endDate
              const count_importHistoryRecord = await CylinderImex.count({
                createdAt: { "<=": endDate },
                objectId: target,
                category: returnData.data[0].detail[i].id,
                typeImex: "IN",
              });

              // Tìm bản ghi xuất kho tính đến endDate
              const count_exportHistoryRecord = await CylinderImex.count({
                createdAt: { "<=": endDate },
                objectId: target,
                category: returnData.data[0].detail[i].id,
                typeImex: "OUT",
                flow: { nin: ["GIVE_BACK"] },
              });

              returnData.data[0].detail[i].statistic.inventory =
                count_importHistoryRecord - count_exportHistoryRecord;
            }
          }
          // *** END Tính tồn kho ***
        }
      }
      // Trường hợp thống kê các đơn vị con
      else {
        // Tìm các trạm con của chi nhánh
        const childs = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: "Factory",
          userRole: "Owner",
          isDeleted: false,
        });

        // BEGIN === Code tạm ===
        // Coi nhà máy được tạo bởi công ty mẹ là Chi nhánh Bình Khí
        const fixers = await User.find({
          isDeleted: { "!=": true },
          isChildOf: parent.id,
          userType: "Fixer",
          userRole: "SuperAdmin",
          isDeleted: false,
        });
        const infoBinhKhi = fixers[0];
        // END === Code tạm ===

        returnData.data = await Promise.all(
          childs.map(async (child) => {
            let _returnData = {
              id: child.id,
              name: child.name,
              detail: [],
            };

            _returnData.detail = await Promise.all(
              cylinderCategory.map(async (category) => {
                return {
                  id: category.id,
                  code: category.code,
                  name: category.name,
                  mass: category.mass,
                  statistic: {
                    // Tạo mới
                    create: 0,
                    // Nhập vỏ
                    importShellFromFixer: 0,
                    importShellFromElsewhere: 0,
                    turnback: 0,
                    returnFullCylinder: 0, // hồi lưu bình đầy
                    // Xuất vỏ:
                    exportShellToFixer: 0,
                    exportShellToElsewhere: 0,
                    // Bán hàng:
                    numberSale: 0,
                    // Xuất hàng:
                    numberExport: 0,
                    massExport: 0,
                    // Thanh lý
                    cancel: 0 /* Tạm thời chưa tính */,
                    // Tồn kho
                    inventory: 0,
                  },
                };
              })
            );

            // *** BEGIN - CHỈNH LẠI NGÀY TÌM KIẾM THEO COLLECTION STATISTIC *** //
            const dataStatistic = await Statistic.find({
              isDeleted: { "!=": true },
              startDate: { ">=": startDate },
              endDate: { "<=": endDate },
              idStation: child.id,
            }).sort("startDate ASC");

            // /!\
            // - Trường hợp không tìm thấy startDate trong collection Statistic
            // /!\
            // - Trường hợp không tìm thấy endDate trong collection Statistic
            // /!\
            // Trường hợp tìm thấy cả startDate và endDate trong collection Statistic
            // *** END - CHỈNH LẠI NGÀY TÌM KIẾM THEO COLLECTION STATISTIC *** //

            // - // - //
            if (dataStatistic.length > 0) {
              // --- GROUP Statistic theo startDate ---
              const groupStatisticByDay = await groupByArray(
                dataStatistic,
                "startDate"
              );

              await Promise.all(
                groupStatisticByDay.map(
                  async (eachDayStatistic, indexEachDay) => {
                    const _lastDayStatistic = groupStatisticByDay.length - 1;

                    await Promise.all(
                      _returnData.detail.map(async (cylinderType, index) => {
                        const indexStatistic =
                          eachDayStatistic.values.findIndex(
                            (statistic) =>
                              cylinderType.id === statistic.idCylinderType
                          );

                        // Tạo mới
                        _returnData.detail[index].statistic.create +=
                          eachDayStatistic.values[indexStatistic].create;
                        // Nhập vỏ
                        _returnData.detail[
                          index
                        ].statistic.importShellFromFixer +=
                          eachDayStatistic.values[
                            indexStatistic
                          ].importShellFromFixer;
                        _returnData.detail[
                          index
                        ].statistic.importShellFromElsewhere +=
                          eachDayStatistic.values[
                            indexStatistic
                          ].importShellFromElsewhere;
                        _returnData.detail[index].statistic.turnback +=
                          eachDayStatistic.values[indexStatistic].turnback;
                        _returnData.detail[index].statistic.return +=
                          eachDayStatistic.values[indexStatistic].return;
                        // Xuất vỏ:
                        _returnData.detail[
                          index
                        ].statistic.exportShellToFixer +=
                          eachDayStatistic.values[
                            indexStatistic
                          ].exportShellToFixer;
                        _returnData.detail[
                          index
                        ].statistic.exportShellToElsewhere +=
                          eachDayStatistic.values[
                            indexStatistic
                          ].exportShellToElsewhere;
                        // Xuất hàng:
                        _returnData.detail[index].statistic.numberExport +=
                          eachDayStatistic.values[indexStatistic].numberExport;
                        _returnData.detail[index].statistic.massExport +=
                          eachDayStatistic.values[indexStatistic].massExport;
                        // Bán hàng:
                        _returnData.detail[index].statistic.numberSale +=
                          eachDayStatistic.values[indexStatistic].numberExport;
                        // Thanh lý
                        _returnData.detail[index].statistic.cancel +=
                          eachDayStatistic.values[indexStatistic].cancel;
                        // Tồn kho - lấy theo ngày cuối cùng
                        if (indexEachDay === _lastDayStatistic) {
                          _returnData.detail[index].statistic.inventory =
                            eachDayStatistic.values[indexStatistic].inventory;
                        }
                      })
                    );
                  }
                )
              );

              // Trường hợp startDate và endDate nằm trong khoảng statistic đã tính toán sẵn
              if (
                startDate === dataStatistic[0].startDate &&
                endDate === dataStatistic[dataStatistic.length - 1].endDate
              ) {
              }
              // Trường hợp startDate và endDate nằm ngoài khoảng statistic đã tính toán sẵn
              else {
                const dateCalculate = [];

                // Tính toán lại startDate và endDate
                if (
                  endDate !== dataStatistic[dataStatistic.length - 1].endDate
                ) {
                  dateCalculate.push({
                    startDate: dataStatistic[dataStatistic.length - 1].endDate,
                    endDate,
                  });
                }
                if (startDate !== dataStatistic[0].startDate) {
                  dateCalculate.push({
                    startDate,
                    endDate: dataStatistic[0].startDate,
                  });
                }

                dateCalculate.sort(compareEndDate);

                // BEGIN === Code tạm ===
                // Coi nhà máy được tạo bởi công ty mẹ là Chi nhánh Bình Khí
                const fixers = await User.find({
                  isDeleted: { "!=": true },
                  isChildOf: parent.id,
                  userType: "Fixer",
                  userRole: "SuperAdmin",
                  isDeleted: false,
                });
                const infoBinhKhi = fixers[0];
                // END === Code tạm ===

                await Promise.all(
                  dateCalculate.map(async (dateCal, _indexDateCal) => {
                    const _lastDayCalculate = dateCalculate.length - 1;

                    // *** BEGIN Tính số lượng khai báo bình ***
                    // Tính số lượng bình được khai báo trong khoảng thời gian
                    // Và lọc danh sách bình theo từng loại
                    await Promise.all(
                      _returnData.detail.map(async (cylinderType, index) => {
                        const count = await CylinderImex.count({
                          createdAt: {
                            ">=": dateCal.startDate,
                            "<=": dateCal.endDate,
                          },
                          objectId: child.id,
                          category: cylinderType.id,
                          flow: "CREATE",
                        });
                        _returnData.detail[index].statistic.create += count;
                      })
                    );
                    // *** END Tính số lượng khai báo bình ***

                    // *** BEGIN Tính nhập bình ***
                    // Tìm bản ghi nhập bình trong khoảng thời gian
                    let importHistoryRecord = await History.find({
                      isDeleted: { "!=": true },
                      createdAt: {
                        ">=": dateCal.startDate,
                        "<=": dateCal.endDate,
                      },
                      to: child.id,
                      type: { in: ["IMPORT", "TURN_BACK", "RETURN"] },
                    }).populate("cylinders");

                    // Trường hợp có nhà máy (Bình Khí)
                    if (infoBinhKhi) {
                      // Tìm bản ghi nhập vỏ từ Chi nhánh Bình Khí
                      let importHR_fromFixer = _.remove(
                        importHistoryRecord,
                        (o) => {
                          return (
                            o.from === infoBinhKhi.id && o.type === "IMPORT"
                          );
                        }
                      );
                      if (importHR_fromFixer.length > 0) {
                        await Promise.all(
                          importHR_fromFixer.map(async (history) => {
                            // Lọc danh sách bình theo từng loại
                            for (let i = 0; i < _numberCategory; i++) {
                              const count = _.remove(history.cylinders, (o) => {
                                return o.category === _returnData.detail[i].id;
                              });
                              _returnData.detail[
                                i
                              ].statistic.importShellFromFixer += count.length;
                            }
                          })
                        );
                      }
                    }

                    // Tìm bản ghi nhập vỏ từ nơi khác
                    let importHR_fromElsewhere = _.remove(
                      importHistoryRecord,
                      (o) => {
                        return (
                          /* o.from !== infoBinhKhi.id && */ o.type === "IMPORT"
                        );
                      }
                    );
                    if (importHR_fromElsewhere.length > 0) {
                      await Promise.all(
                        importHR_fromElsewhere.map(async (history) => {
                          // Lọc danh sách bình theo từng loại
                          for (let i = 0; i < _numberCategory; i++) {
                            const count = _.remove(history.cylinders, (o) => {
                              return o.category === _returnData.detail[i].id;
                            });
                            _returnData.detail[
                              i
                            ].statistic.importShellFromElsewhere +=
                              count.length;
                          }
                        })
                      );
                    }

                    // Tìm bản ghi hồi lưu bình đầy
                    let return_fullCylinders = _.remove(
                      importHistoryRecord,
                      (o) => {
                        return (
                          /* o.from !== infoBinhKhi.id && */ o.type === "RETURN"
                        );
                      }
                    );
                    if (return_fullCylinders.length > 0) {
                      await Promise.all(
                        return_fullCylinders.map(async (history) => {
                          // Lọc danh sách bình theo từng loại
                          for (let i = 0; i < _numberCategory; i++) {
                            const count = _.remove(history.cylinders, (o) => {
                              return o.category === _returnData.detail[i].id;
                            });
                            _returnData.detail[
                              i
                            ].statistic.returnFullCylinder += count.length;
                          }
                        })
                      );
                    }

                    // Còn lại là bản ghi hồi lưu trong importHistoryRecord
                    if (importHistoryRecord.length > 0) {
                      await Promise.all(
                        importHistoryRecord.map(async (history) => {
                          // Lọc danh sách bình theo từng loại
                          for (let i = 0; i < _numberCategory; i++) {
                            const count = _.remove(history.cylinders, (o) => {
                              return o.category === _returnData.detail[i].id;
                            });
                            _returnData.detail[i].statistic.turnback +=
                              count.length;
                          }
                        })
                      );
                    }
                    // *** END Tính nhập bình ***

                    // *** BEGIN Tính xuất vỏ ***
                    // Tìm bản ghi xuất vỏ trong khoảng thời gian
                    // OLD-VERSION: Chỉ tính xuất vỏ có bản ghi nhập tương ứng
                    // NEW-VERSION: Có thể phát sinh lỗi khi xuất vỏ cho trạm và Bình Khí cùng 1 lúc
                    let exportShellHistoryRecord = await History.find({
                      isDeleted: { "!=": true },
                      createdAt: {
                        ">=": dateCal.startDate,
                        "<=": dateCal.endDate,
                      },
                      // type: 'IMPORT', // OLD-VERSION
                      from: child.id,
                      type: "EXPORT", // NEW-VERSION
                      typeForPartner: { "!=": "" },
                    })
                      .populate("toArray")
                      .populate("cylinders");

                    // Trường hợp có nhà máy (Bình Khí)
                    if (infoBinhKhi) {
                      // Tìm bản ghi xuất vỏ tới Chi nhánh Bình Khí
                      let exportHR_toFixer = _.remove(
                        exportShellHistoryRecord,
                        (o) => {
                          // return o.to === infoBinhKhi.id;
                          return (
                            o.typeForPartner === "TO_FIX" &&
                            o.toArray.find((_to) => _to.id === infoBinhKhi.id)
                          );
                        }
                      );
                      if (exportHR_toFixer.length > 0) {
                        await Promise.all(
                          exportHR_toFixer.map(async (history) => {
                            // Lọc danh sách bình theo từng loại
                            for (let i = 0; i < _numberCategory; i++) {
                              const count = _.remove(history.cylinders, (o) => {
                                return o.category === _returnData.detail[i].id;
                              });
                              _returnData.detail[
                                i
                              ].statistic.exportShellToFixer += count.length;
                            }
                          })
                        );
                      }
                    }

                    // Còn lại là bản ghi xuất vỏ tới nơi khác trong importHistoryRecord;
                    if (exportShellHistoryRecord.length > 0) {
                      await Promise.all(
                        exportShellHistoryRecord.map(async (history) => {
                          // Lọc danh sách bình theo từng loại
                          for (let i = 0; i < _numberCategory; i++) {
                            const count = _.remove(history.cylinders, (o) => {
                              return o.category === _returnData.detail[i].id;
                            });
                            _returnData.detail[
                              i
                            ].statistic.exportShellToElsewhere += count.length;
                          }
                        })
                      );
                    }
                    // *** END Tính xuất vỏ ***

                    // *** BEGIN Tính xuất hàng ***
                    // Tìm bản ghi xuất hàng trong khoảng thời gian
                    let exportHistoryRecord = await History.find({
                      isDeleted: { "!=": true },
                      createdAt: {
                        ">=": dateCal.startDate,
                        "<=": dateCal.endDate,
                      },
                      from: child.id,
                      type: "EXPORT",
                      typeForPartner: "",
                    }).populate("cylinders");

                    if (exportHistoryRecord.length > 0) {
                      await Promise.all(
                        exportHistoryRecord.map(async (history) => {
                          // Lọc danh sách bình theo từng loại
                          await Promise.all(
                            _returnData.detail.map(
                              async (cylinderType, index) => {
                                const count = _.remove(
                                  history.cylinders,
                                  (o) => {
                                    return o.category === cylinderType.id;
                                  }
                                );
                                _returnData.detail[
                                  index
                                ].statistic.numberExport += count.length;
                                _returnData.detail[
                                  index
                                ].statistic.massExport +=
                                  count.length * cylinderType.mass;
                              }
                            )
                          );
                          // for (let i = 0; i < _numberCategory; i++) {
                          //     const count = _.remove(history.cylinders, o => { return o.category === _returnData.detail[i].id; });
                          //     _returnData.detail[i].statistic.numberExport += count.length
                          // }
                        })
                      );
                    }
                    // *** END Tính xuất hàng ***

                    // *** BEGIN Bán hàng ***
                    // Tìm bản ghi xuất hàng trong khoảng thời gian
                    let saleHistoryRecord = await History.find({
                      isDeleted: { "!=": true },
                      createdAt: { ">=": startDate, "<=": endDate },
                      from: target,
                      type: "SALE",
                    }).populate("cylinders");
                    // console.log(saleHistoryRecord.cylinders, 'length sale')
                    if (saleHistoryRecord.length > 0) {
                      await Promise.all(
                        saleHistoryRecord.map(async (history) => {
                          // Lọc danh sách bình theo từng loại
                          await Promise.all(
                            returnData.data[0].detail.map(
                              async (cylinderType, index) => {
                                const count = _.remove(
                                  history.cylinders,
                                  (o) => {
                                    return o.category === cylinderType.id;
                                  }
                                );
                                returnData.data[0].detail[
                                  index
                                ].statistic.numberSale += count.length;
                              }
                            )
                          );
                          // for (let i = 0; i < _numberCategory; i++) {
                          //     const count = _.remove(history.cylinders, o => { return o.category === returnData.data[0].detail[i].id; });
                          //     returnData.data[0].detail[i].statistic.numberExport += count.length
                          // }
                        })
                      );
                    }
                    // *** END Tính bán hàng ***

                    // *** BEGIN Tính vỏ thanh lý ***
                    // Lọc danh sách bình theo từng loại
                    await Promise.all(
                      _returnData.detail.map(async (cylinderType, index) => {
                        // Tìm bản ghi thánh lý trong khoảng thời gian
                        const count = await CylinderImex.count({
                          createdAt: {
                            ">=": dateCal.startDate,
                            "<=": dateCal.endDate,
                          },
                          objectId: child.id,
                          category: cylinderType.id,
                          flow: "CANCEL",
                        });
                        _returnData.detail[index].statistic.cancel += count;
                      })
                    );
                    // *** END Tính vỏ thanh lý ***

                    // *** BEGIN Tính tồn kho ***
                    if (
                      _indexDateCal === _lastDayCalculate &&
                      // Trường hợp endDate gửi lên là ngày đã được tính thống kê
                      endDate !==
                        dataStatistic[dataStatistic.length - 1].endDate
                    ) {
                      for (let i = 0; i < _numberCategory; i++) {
                        //                        [dataStatistic]
                        //         4  5       5  6       6  7       7  8
                        // ---------||---------||---------||---------||---------> Time
                        //       end  start end  start end  start end  start
                        //                 ^                    ^
                        //                 |                    |
                        //                 ----------------------
                        //               start                 end

                        // Tìm bản ghi nhập kho tính từ dateCal.startDate đến dateCal.endDate
                        const count_importHistoryRecord =
                          await CylinderImex.count({
                            createdAt: {
                              ">": dateCal.startDate,
                              "<=": dateCal.endDate,
                            },
                            objectId: child.id,
                            category: _returnData.detail[i].id,
                            typeImex: "IN",
                          });

                        // Tìm bản ghi xuất kho tính từ dateCal.startDate đến dateCal.endDate
                        const count_exportHistoryRecord =
                          await CylinderImex.count({
                            createdAt: {
                              ">": dateCal.startDate,
                              "<=": dateCal.endDate,
                            },
                            objectId: child.id,
                            category: _returnData.detail[i].id,
                            typeImex: "OUT",
                          });

                        _returnData.detail[i].statistic.inventory +=
                          count_importHistoryRecord - count_exportHistoryRecord;
                      }
                    }
                    // *** END Tính tồn kho ***
                  })
                );
              }
            }
            // - // - //
            else {
              // *** BEGIN Tính số lượng khai báo bình ***
              // Tính số lượng bình được khai báo trong khoảng thời gian
              // Và lọc danh sách bình theo từng loại
              await Promise.all(
                _returnData.detail.map(async (cylinderType, index) => {
                  const count = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: child.id,
                    category: cylinderType.id,
                    flow: "CREATE",
                  });
                  _returnData.detail[index].statistic.create = count;
                })
              );
              // *** END Tính số lượng khai báo bình ***

              // *** BEGIN Tính nhập bình ***
              // Tìm bản ghi nhập bình trong khoảng thời gian
              let importHistoryRecord = await History.find({
                isDeleted: { "!=": true },
                createdAt: { ">=": startDate, "<=": endDate },
                to: child.id,
                type: { in: ["IMPORT", "TURN_BACK", "RETURN"] },
              }).populate("cylinders");

              // Trường hợp có nhà máy (Bình Khí)
              if (infoBinhKhi) {
                // Tìm bản ghi nhập vỏ từ Chi nhánh Bình Khí
                let importHR_fromFixer = _.remove(importHistoryRecord, (o) => {
                  return (
                    o.from === infoBinhKhi.id &&
                    o.type === "IMPORT" &&
                    o.typeForPartner !== ""
                  );
                });
                if (importHR_fromFixer.length > 0) {
                  await Promise.all(
                    importHR_fromFixer.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      for (let i = 0; i < _numberCategory; i++) {
                        const count = _.remove(history.cylinders, (o) => {
                          return o.category === _returnData.detail[i].id;
                        });
                        _returnData.detail[i].statistic.importShellFromFixer +=
                          count.length;
                      }
                    })
                  );
                }
              }

              // Tìm bản ghi nhập vỏ từ nơi khác
              let importHR_fromElsewhere = _.remove(
                importHistoryRecord,
                (o) => {
                  return o.type === "IMPORT" && o.typeForPartner !== "";
                }
              );
              if (importHR_fromElsewhere.length > 0) {
                await Promise.all(
                  importHR_fromElsewhere.map(async (history) => {
                    // Lọc danh sách bình theo từng loại
                    for (let i = 0; i < _numberCategory; i++) {
                      const count = _.remove(history.cylinders, (o) => {
                        return o.category === _returnData.detail[i].id;
                      });
                      _returnData.detail[
                        i
                      ].statistic.importShellFromElsewhere += count.length;
                    }
                  })
                );
              }

              // Tìm bản ghi hồi lưu bình đầy
              let return_fullCylinders = _.remove(importHistoryRecord, (o) => {
                return /* o.from !== infoBinhKhi.id && */ o.type === "RETURN";
              });
              if (return_fullCylinders.length > 0) {
                await Promise.all(
                  return_fullCylinders.map(async (history) => {
                    // Lọc danh sách bình theo từng loại
                    for (let i = 0; i < _numberCategory; i++) {
                      const count = _.remove(history.cylinders, (o) => {
                        return o.category === _returnData.detail[i].id;
                      });
                      _returnData.detail[i].statistic.returnFullCylinder +=
                        count.length;
                    }
                  })
                );
              }

              // Tìm bản ghi hồi lưu trong importHistoryRecord
              let turnbackHR = _.remove(importHistoryRecord, (o) => {
                return o.type === "TURN_BACK";
              });
              if (turnbackHR.length > 0) {
                await Promise.all(
                  turnbackHR.map(async (history) => {
                    // Lọc danh sách bình theo từng loại
                    for (let i = 0; i < _numberCategory; i++) {
                      const count = _.remove(history.cylinders, (o) => {
                        return o.category === _returnData.detail[i].id;
                      });
                      _returnData.detail[i].statistic.turnback += count.length;
                    }
                  })
                );
              }
              // *** END Tính nhập bình ***

              // *** BEGIN Tính xuất vỏ ***
              // Tìm bản ghi xuất vỏ trong khoảng thời gian
              // OLD-VERSION: Chỉ tính xuất vỏ có bản ghi nhập tương ứng
              // NEW-VERSION: Có thể phát sinh lỗi khi xuất vỏ cho trạm và Bình Khí cùng 1 lúc
              let exportShellHistoryRecord = await History.find({
                isDeleted: { "!=": true },
                createdAt: { ">=": startDate, "<=": endDate },
                // type: 'IMPORT', // OLD-VERSION
                from: child.id,
                type: "EXPORT", // NEW-VERSION
                typeForPartner: { "!=": "" },
              })
                .populate("toArray")
                .populate("cylinders");

              // Trường hợp có nhà máy (Bình Khí)
              if (infoBinhKhi) {
                // Tìm bản ghi xuất vỏ tới Chi nhánh Bình Khí
                let exportHR_toFixer = _.remove(
                  exportShellHistoryRecord,
                  (o) => {
                    // return o.to === infoBinhKhi.id;
                    return (
                      o.typeForPartner === "TO_FIX" &&
                      o.toArray.find((_to) => _to.id === infoBinhKhi.id)
                    );
                  }
                );
                if (exportHR_toFixer.length > 0) {
                  await Promise.all(
                    exportHR_toFixer.map(async (history) => {
                      // Lọc danh sách bình theo từng loại
                      for (let i = 0; i < _numberCategory; i++) {
                        const count = _.remove(history.cylinders, (o) => {
                          return o.category === _returnData.detail[i].id;
                        });
                        _returnData.detail[i].statistic.exportShellToFixer +=
                          count.length;
                      }
                    })
                  );
                }
              }

              // Còn lại là bản ghi xuất vỏ tới nơi khác trong importHistoryRecord;
              if (exportShellHistoryRecord.length > 0) {
                await Promise.all(
                  exportShellHistoryRecord.map(async (history) => {
                    // Lọc danh sách bình theo từng loại
                    for (let i = 0; i < _numberCategory; i++) {
                      const count = _.remove(history.cylinders, (o) => {
                        return o.category === _returnData.detail[i].id;
                      });
                      _returnData.detail[i].statistic.exportShellToElsewhere +=
                        count.length;
                    }
                  })
                );
              }
              // *** END Tính xuất vỏ ***

              // *** BEGIN Tính xuất hàng ***
              // Tìm bản ghi xuất hàng trong khoảng thời gian
              let exportHistoryRecord = await History.find({
                isDeleted: { "!=": true },
                createdAt: { ">=": startDate, "<=": endDate },
                from: child.id,
                type: "EXPORT",
                typeForPartner: "",
              }).populate("cylinders");

              if (exportHistoryRecord.length > 0) {
                await Promise.all(
                  exportHistoryRecord.map(async (history) => {
                    // Lọc danh sách bình theo từng loại
                    await Promise.all(
                      _returnData.detail.map(async (cylinderType, index) => {
                        const count = _.remove(history.cylinders, (o) => {
                          return o.category === cylinderType.id;
                        });
                        _returnData.detail[index].statistic.numberExport +=
                          count.length;
                        _returnData.detail[index].statistic.massExport +=
                          count.length * cylinderType.mass;
                      })
                    );
                    // for (let i = 0; i < _numberCategory; i++) {
                    //     const count = _.remove(history.cylinders, o => { return o.category === _returnData.detail[i].id; });
                    //     _returnData.detail[i].statistic.numberExport += count.length
                    // }
                  })
                );
              }
              // *** END Tính xuất hàng ***

              // *** BEGIN Bán hàng ***
              // Tìm bản ghi xuất hàng trong khoảng thời gian
              let saleHistoryRecord = await History.find({
                isDeleted: { "!=": true },
                createdAt: { ">=": startDate, "<=": endDate },
                from: target,
                type: "SALE",
              }).populate("cylinders");
              // console.log(saleHistoryRecord.cylinders, 'length sale')
              if (saleHistoryRecord.length > 0) {
                await Promise.all(
                  saleHistoryRecord.map(async (history) => {
                    // Lọc danh sách bình theo từng loại
                    await Promise.all(
                      returnData.data[0].detail.map(
                        async (cylinderType, index) => {
                          const count = _.remove(history.cylinders, (o) => {
                            return o.category === cylinderType.id;
                          });
                          returnData.data[0].detail[
                            index
                          ].statistic.numberSale += count.length;
                        }
                      )
                    );
                    // for (let i = 0; i < _numberCategory; i++) {
                    //     const count = _.remove(history.cylinders, o => { return o.category === returnData.data[0].detail[i].id; });
                    //     returnData.data[0].detail[i].statistic.numberExport += count.length
                    // }
                  })
                );
              }
              // *** END Tính bán hàng ***

              // *** BEGIN Tính vỏ thanh lý ***
              // Lọc danh sách bình theo từng loại
              await Promise.all(
                _returnData.detail.map(async (cylinderType, index) => {
                  // Tìm bản ghi thánh lý trong khoảng thời gian
                  const count = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: child.id,
                    category: cylinderType.id,
                    flow: "CANCEL",
                  });
                  _returnData.detail[index].statistic.cancel += count;
                })
              );
              // *** END Tính vỏ thanh lý ***

              // *** BEGIN Tính tồn kho ***
              //
              //                        [dataStatistic]
              //                               6  7       7  8
              // -------------------------------||---------||---------------------------> Time
              //                             end  start end  start
              //      ^                    ^                      ^                    ^
              //      |                    |                      |                    |
              //      ----------------------                      ----------------------
              //      start                 end                   start                 end

              // Tìm bản ghi Statistic ngay sau endDate
              const lastDayStatistic = await Statistic.find({
                isDeleted: { "!=": true },
                // startDate: { '>=': startDate },
                endDate: { "<=": endDate },
                idStation: child.id,
              })
                .sort("endDate DESC")
                .limit(1);

              // Trường hợp tìm thấy ngày có bản ghi Statistic
              if (lastDayStatistic.length !== 0) {
                // Tìm các bản ghi trong ngày đó
                const lastDataStatistic = await Statistic.find({
                  isDeleted: { "!=": true },
                  endDate: lastDayStatistic[0].endDate,
                  idStation: child.id,
                });

                // Lấy tồn kho của ngày gần nhất trong Statistic cho từng loại bình
                await Promise.all(
                  _returnData.detail.map(async (category, index) => {
                    const foundIndex = lastDataStatistic.findIndex(
                      (_dataStatistic) =>
                        _dataStatistic.idCylinderType === category.id
                    );

                    if (foundIndex !== -1) {
                      _returnData.detail[index].statistic.inventory =
                        lastDataStatistic[foundIndex].inventory;
                    }
                  })
                );

                for (let i = 0; i < _numberCategory; i++) {
                  // Tìm bản ghi nhập kho tính từ bản ghi Statistic của ngày gần nhất đến endDate
                  const count_importHistoryRecord = await CylinderImex.count({
                    createdAt: {
                      ">": lastDayStatistic[0].endDate,
                      "<=": endDate,
                    },
                    objectId: child.id,
                    category: _returnData.detail[i].id,
                    typeImex: "IN",
                  });

                  // Tìm bản ghi xuất kho tính từ bản ghi Statistic của ngày gần nhất đến endDate
                  const count_exportHistoryRecord = await CylinderImex.count({
                    createdAt: {
                      ">": lastDayStatistic[0].endDate,
                      "<=": endDate,
                    },
                    objectId: child.id,
                    category: _returnData.detail[i].id,
                    typeImex: "OUT",
                  });

                  _returnData.detail[i].statistic.inventory +=
                    count_importHistoryRecord - count_exportHistoryRecord;
                }
              }
              // Trường hợp không tìm thấy bản ghi Statistic nào
              else {
                for (let i = 0; i < _numberCategory; i++) {
                  // Tìm bản ghi nhập kho tính đến endDate
                  const count_importHistoryRecord = await CylinderImex.count({
                    createdAt: { "<=": endDate },
                    objectId: child.id,
                    category: _returnData.detail[i].id,
                    typeImex: "IN",
                  });

                  // Tìm bản ghi xuất kho tính đến endDate
                  const count_exportHistoryRecord = await CylinderImex.count({
                    createdAt: { "<=": endDate },
                    objectId: child.id,
                    category: _returnData.detail[i].id,
                    typeImex: "OUT",
                  });

                  _returnData.detail[i].statistic.inventory =
                    count_importHistoryRecord - count_exportHistoryRecord;
                }
              }
              // *** END Tính tồn kho ***
            }

            return _returnData;
          })
        );
      }

      returnData.success = true;
      returnData.resCode = "SUCCESS-00022";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      return res.json({
        status: false,
        resCode: "CATCH-00004",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  getAggregate: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
    } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    let {
      startDate, // ISODate
      endDate, // ISODate
    } = req.query;

    try {
      const db = await StatisticVer2.getDatastore().manager;

      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // // Tìm parentRoot
      // const parent = await getRootParent(target);
      // if (!parent) {
      //     return res.badRequest(Utils.jsonErr("parentRoot not found"));
      // }

      // Tìm info chi nhánh Bình Khí
      const infoBinhKhi = await User.findOne({
        isDeleted: { "!=": true },
        email: "chinhanhbinhkhi@pgs.com.vn",
      });
      if (!infoBinhKhi) {
        return res.badRequest(Utils.jsonErr("Bình Khí not found"));
      }

      // // Tìm danh sách loại bình
      // const cylinderCategory = await CategoryCylinder.find({
      //     isDeleted: { "!=": true },
      //     createdBy: parent.id,
      //     isDeleted: false,
      // });
      // const _numberCategory = cylinderCategory.length;

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp target là công ty mẹ
      // Xem thông tin của các chi nhánh
      if (
        infoTarget.userType === "Factory" &&
        infoTarget.userRole === "SuperAdmin"
      ) {
        // Tìm các chi nhánh con (bao gồm trường hợp đặc biệt: NMSC)
        const regions = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: { in: ["Region", "Fixer"] },
          userRole: "SuperAdmin",
        });

        const _list = await Promise.all(
          regions.map(async (region) => {
            // Nếu là Nhà máy sửa chữa thì lấy luôn
            if (region.userType === "Fixer") {
              return ObjectId(region.id);
            } else {
              // Tìm các trạm con của chi nhánh
              const stations = await User.find({
                isDeleted: { "!=": true },
                isChildOf: region.id,
                userType: "Factory",
                userRole: "Owner",
              });

              const stationIds = [];

              stations.forEach((station) => {
                stationIds.push(ObjectId(station.id));
              });

              return stationIds;
            }
          })
        );

        const listStationID = _list.flat();

        //#region Dữ liểu trả về - Mẫu Cũ
        /* // Thống kê từng chi nhánh
                returnData.data = await Promise.all(
                    childs.map(async (child) => {
                        // Tạo cấu trúc dữ liệu trả về cho từng chi nhánh
                        let _returnRegionData = {
                            id: child.id,
                            name: child.name,
                            detail: [],
                        };

                        // Tạo cấu trúc dữ liệu trả về cho từng loại bình của chi nhánh
                        _returnRegionData.detail = await Promise.all(
                            cylinderCategory.map(async (category) => {
                                return {
                                    id: category.id,
                                    code: category.code,
                                    name: category.name,
                                    mass: category.mass,
                                    statistic: {
                                        // Khai báo mới
                                        create: 0,
                                        // Xuất hàng:
                                        numberExport: 0,
                                        massExport: 0,
                                        // Hồi lưu
                                        turnback: 0,
                                        // Tồn kho
                                        inventory: 0,
                                    },
                                };
                            })
                        );

                        // Trường hợp đặc biệt chi nhánh là nhà máy sửa chữa
                        if (child.userType === "Fixer") {
                            
                        }
                        // Trường hợp còn lại
                        else {
                            // Tìm các đơn vị con (chỉ lấy trạm)
                            const _childs = await User.find({
                                isDeleted: { "!=": true },
                                isChildOf: child.id,
                                userType: "Factory",
                                userRole: "Owner",
                                isDeleted: false,
                            });

                            // Lấy danh sách id của toàn bộ đơn vị con
                            const listChildId = await getUsersId(_childs);
                        }

                        return _returnRegionData;
                    })
                ); */
        //#endregion

        //#region Dữ liểu trả về - Mẫu Mới
        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                objectId: { $in: listStationID },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                turnbackCylinder: {
                  $sum: {
                    $sum: "$turnbackCylinder.quantity",
                  },
                },
                exportCylinder: {
                  $sum: {
                    $sum: "$exportCylinder.quantity",
                  },
                },
                numberExport: {
                  $sum: "$numberExport",
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id.objectId",
                foreignField: "_id",
                as: "inforStation",
              },
            },
            {
              $unwind: {
                path: "$inforStation",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "user",
                let: {
                  idParrentUser: "$inforStation.isChildOf",
                  idChild: "$inforStation._id",
                  userTypeChild: "$inforStation.userType",
                  emailChild: "$inforStation.email",
                  nameChild: "$inforStation.name",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$_id", "$$idParrentUser"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$idChild",
                          else: "$_id",
                        },
                      },
                      email: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$emailChild",
                          else: "$email",
                        },
                      },
                      name: {
                        $cond: {
                          if: {
                            $eq: ["$$userTypeChild", "Fixer"],
                          },
                          then: "$$nameChild",
                          else: "$name",
                        },
                      },
                    },
                  },
                ],
                as: "inforRegion",
              },
            },
            {
              $unwind: {
                path: "$inforRegion",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  idRegion: "$inforRegion._id",
                  cylinderTypeId: "$_id.cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                turnbackCylinder: {
                  $sum: "$turnbackCylinder",
                },
                exportCylinder: {
                  $sum: "$exportCylinder",
                },
                numberExport: {
                  $sum: "$numberExport",
                },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.idRegion",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    statistic: {
                      create: "$createdCylinder",
                      turnback: "$turnbackCylinder",
                      exportCylinder: "$exportCylinder",
                      numberExport: "$exportCylinder",
                      massExport: "$LoaiBinh.mass",
                      inventory: "$inventoryCylinder",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: "$stationInfo._id",
                name: "$stationInfo.name",
                detail: "$detail",
              },
            },
          ])
          .toArray();

        // listDetail = {};
        // returnData.data.map((item) =>
        //   item.detail.map((element) => {
        //     if (!listDetail[element.mass])
        //       listDetail[element.mass] = {
        //         code: element.code,
        //         name: element.name,
        //         mass: element.mass,
        //         id: element.id,
        //       };
        //   })
        // );

        listDetail = {
          45: {
            code: "2303B45",
            name: "Bình 45Kg",
            mass: 45,
          },
          6: {
            code: "B6",
            name: "Bình 6Kg",
            mass: 6,
          },
          20: {
            code: "B20",
            name: "Bình 20Kg",
            mass: 20,
          },
          12: {
            code: "2303B12",
            name: "Bình 12Kg",
            mass: 12,
          },
        };

        //Lấp ô trống trên báo cáo
        returnData.data.map((item) => {
          if (item.detail.length < Object.entries(listDetail).length) {
            Object.entries(listDetail).map((element) => {
              b = item.detail.map((value) => value.mass);
              if (!b.includes(Number(element[0]))) {
                item.detail.push({
                  statistic: {
                    create: 0,
                    exportEmptyCylinderToBinhKhi: 0,
                    exportEmptyCylinderToElsewhere: 0,
                    importCylinderFromBinhKhi: 0,
                    importCylinderFromElsewhere: 0,
                    inventory: 0,
                    massExport: 0,
                    returnFullCylinder: 0,
                    turnback: 0,
                    exportCylinder: 0,
                    liquidationCylinder: 0,
                  },
                  ...element[1],
                });
              }
            });
          }
          item.detail.map((element) => {
            element.statistic.massExport =
              element.mass * element.statistic.exportCylinder || 0;
            return element;
          });
          return item;
        });
        console.log(returnData.data);
        //#endregion
      }
      // Trường hợp còn lại, target là chi nhánh
      // Xem thông tin của các trạm con
      else {
        // Tìm các trạm con của chi nhánh
        const childs = await User.find({
          isDeleted: { "!=": true },
          isChildOf: target,
          userType: "Factory",
          userRole: "Owner",
        });

        const listStationID = [];

        childs.forEach((child) => {
          listStationID.push(ObjectId(child.id));
        });

        const listStationIDBinhkhi = [];
        const childsFixer = await User.find({
          isDeleted: { "!=": true },
          userType: "Fixer",
        });

        childsFixer.forEach((child) => {
          listStationIDBinhkhi.push(ObjectId(child.id));
        });

        //#region Dữ liểu trả về - Mẫu Cũ
        // // Thống kê từng trạm
        // returnData.data = await Promise.all(
        //     childs.map(async (child) => {
        //         // Tạo cấu trúc dữ liệu trả về cho từng trạm
        //         let _returnStationData = {
        //             id: child.id,
        //             name: child.name,
        //             detail: [],
        //         };

        //         _returnStationData.detail = await Promise.all(
        //             cylinderCategory.map(async (category) => {
        //                 return {
        //                     id: category.id,
        //                     code: category.code,
        //                     name: category.name,
        //                     statistic: {
        //                         // Khai báo mới
        //                         create: 0,
        //                         // Xuất hàng:
        //                         numberExport: 0,
        //                         massExport: 0,
        //                         // Hồi lưu
        //                         turnback: 0,
        //                         // Tồn kho
        //                         inventory: 0,
        //                     },
        //                 };
        //             })
        //         );
        //     })
        // );
        //#endregion

        //#region Dữ liểu trả về - Mẫu Mới
        returnData.data = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                objectId: { $in: listStationID },
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $unwind: {
                path: "$importCylinder",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$exportEmptyCylinder",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                },
                inventoryCylinder: {
                  $last: "$inventoryCylinder",
                },
                createdCylinder: {
                  $sum: "$createdCylinder",
                },
                importCylinderFromBinhKhi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$importCylinder.from", ObjectId(infoBinhKhi.id)],
                      },
                      "$importCylinder.quantity",
                      0,
                    ],
                  },
                },
                importCylinderFromElsewhere: {
                  $sum: {
                    $cond: [
                      {
                        $ne: ["$importCylinder.from", ObjectId(infoBinhKhi.id)],
                      },
                      "$importCylinder.quantity",
                      0,
                    ],
                  },
                },
                turnbackCylinder: {
                  $sum: {
                    $sum: "$turnbackCylinder.quantity",
                  },
                },
                returnFullCylinder: {
                  $sum: {
                    $sum: "$returnFullCylinder.quantity",
                  },
                },
                exportEmptyCylinderToBinhKhi: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$exportEmptyCylinder.to", listStationIDBinhkhi],
                      },
                      "$exportEmptyCylinder.quantity",
                      0,
                    ],
                  },
                },
                exportEmptyCylinderToElsewhere: {
                  $sum: {
                    $cond: [
                      {
                        $ne: [
                          "$exportEmptyCylinder.to",
                          ObjectId(infoBinhKhi.id),
                        ],
                      },
                      "$exportEmptyCylinder.quantity",
                      0,
                    ],
                  },
                },
                exportCylinder: {
                  $sum: {
                    $sum: "$exportCylinder.quantity",
                  },
                },
                numberExport: {
                  $sum: "$numberExport",
                },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    code: "$LoaiBinh.code",
                    id: "$LoaiBinh._id",
                    mass: "$LoaiBinh.mass",
                    name: "$LoaiBinh.name",
                    statistic: {
                      create: "$createdCylinder",
                      importCylinderFromBinhKhi: "$importCylinderFromBinhKhi",
                      importCylinderFromElsewhere:
                        "$importCylinderFromElsewhere",
                      turnback: "$turnbackCylinder",
                      returnFullCylinder: "$returnFullCylinder",
                      exportEmptyCylinderToBinhKhi:
                        "$exportEmptyCylinderToBinhKhi",
                      exportEmptyCylinderToElsewhere:
                        "$exportEmptyCylinderToElsewhere",
                      // exportCylinder: "$exportCylinder",
                      numberExport: "$exportCylinder",
                      massExport: {
                        $multiply: ["$exportCylinder", "$LoaiBinh.mass"],
                      },
                      inventory: "$inventoryCylinder",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "user",
                localField: "_id",
                foreignField: "_id",
                as: "stationInfo",
              },
            },
            {
              $unwind: {
                path: "$stationInfo",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                id: "$stationInfo._id",
                name: "$stationInfo.name",
                detail: "$detail",
              },
            },
          ])
          .toArray();
        //#endregion
      }

      //Bosung KyVong
      listDetail = {
        45: {
          code: "2303B45",
          name: "Bình 45Kg",
          mass: 45,
        },
        6: {
          code: "B6",
          name: "Bình 6Kg",
          mass: 6,
        },
        20: {
          code: "B20",
          name: "Bình 20Kg",
          mass: 20,
        },
        12: {
          code: "2303B12",
          name: "Bình 12Kg",
          mass: 12,
        },
      };

      //Lấp ô trống trên báo cáo
      returnData.data.map((item) => {
        if (item.detail.length < Object.entries(listDetail).length) {
          Object.entries(listDetail).map((element) => {
            b = item.detail.map((value) => value.mass);
            if (!b.includes(Number(element[0]))) {
              item.detail.push({
                statistic: {
                  create: 0,
                  exportEmptyCylinderToBinhKhi: 0,
                  exportEmptyCylinderToElsewhere: 0,
                  importCylinderFromBinhKhi: 0,
                  importCylinderFromElsewhere: 0,
                  inventory: 0,
                  massExport: 0,
                  returnFullCylinder: 0,
                  turnback: 0,
                  exportCylinder: 0,
                  liquidationCylinder: 0,
                },
                ...element[1],
              });
            }
          });
        }
        item.detail.map((element) => {
          element.statistic.massExport =
            element.mass * element.statistic.exportCylinder || 0;
          return element;
        });
        return item;
      });

      let cylinderTypes = [];
      returnData.data[0].detail.map((item) => {
        if (!cylinderTypes.includes(item.code)) cylinderTypes.push(item.code);
      });
      returnData.cylinderTypes = cylinderTypes;
      returnData.success = true;
      returnData.resCode = "SUCCESS-00023";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      return res.json({
        status: false,
        resCode: "CATCH-00005",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  // Phiên bản cũ
  getExportChart_OLD: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
      statisticalType, // isIn: ['byItself', 'byItsChildren']
      dataType, // isIn: ['month', 'quarter']
    } = req.query;

    let { year, filter } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    if (!dataType) {
      return res.badRequest(Utils.jsonErr("dataType is required"));
    } else {
      const DATA_TYPE = ["month", "quarter"];
      if (!DATA_TYPE.includes(dataType)) {
        return res.badRequest(Utils.jsonErr("dataType is wrong"));
      }
    }

    if (!statisticalType) {
      return res.badRequest(Utils.jsonErr("statisticalType is required"));
    } else {
      const STATISTIC_TYPE = ["byItself", "byItsChildren"];
      if (!STATISTIC_TYPE.includes(statisticalType)) {
        return res.badRequest(Utils.jsonErr("statisticalType is wrong"));
      }
    }

    // Tùy biến flow để tìm kiếm xuất hàng/xuất vỏ/...
    if (!filter || filter === "undefined" || filter === "null") {
      filter = "EXPORT";
    } else {
      const FLOW = ["CREATE", "EXPORT", "IMPORT", "EXPORT_CELL", "IMPORT_CELL"];
      filter = filter.split(",");

      const found = filter.findIndex((flow) => !FLOW.includes(flow));
      if (found >= 0) {
        return res.badRequest(Utils.jsonErr("filter is wrong"));
      } else {
        filter = { in: filter };
      }
    }

    try {
      let MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let QUARTER = [1, 2, 3, 4];

      if (!year) {
        year = new Date().getFullYear();
      } else {
        // Đổi year về kiểu số
        year = parseInt(year);
      }

      // Trường hợp là năm hiện tại thì tính từ tháng 1 đến tháng hiện tại
      if (year === new Date().getFullYear()) {
        const currentMonth = new Date().getMonth();
        MONTH.splice(currentMonth + 1);
        QUARTER.splice(Math.ceil((currentMonth + 1) / 3));
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
        isDeleted: false,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // Tìm parentRoot
      const parent = await getRootParent(target);
      if (!parent) {
        return res.badRequest(Utils.jsonErr("parentRoot not found"));
      }

      // Tìm danh sách loại bình
      const cylinderCategory = await CategoryCylinder.find({
        isDeleted: { "!=": true },
        createdBy: parent.id,
        isDeleted: false,
      });

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp thống kê chính nó
      if (statisticalType === "byItself") {
        // Trường hợp thống kê theo tháng
        if (dataType === "month") {
          // Thống kê từng tháng
          returnData.data = await Promise.all(
            MONTH.map(async (month) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnMonthData = {
                month: month,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong tháng
              const startDate = new Date(year, month - 1, 1).toISOString();
              const endDate = new Date(
                year,
                month,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong tháng
              _returnMonthData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnMonthData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: target,
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong tháng
                  _returnMonthData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnMonthData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong tháng
                  _returnMonthData.totalNumber += numberExportCylinder;
                  _returnMonthData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnMonthData;
            })
          );
        }

        // Trường hợp thống kê theo quý
        if (dataType === "quarter") {
          // Thống kê từng quý
          returnData.data = await Promise.all(
            QUARTER.map(async (quarter) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnQuarterData = {
                quarter: quarter,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong quý
              const startDate = new Date(
                year,
                (quarter - 1) * 3,
                1
              ).toISOString();
              const endDate = new Date(
                year,
                (quarter - 1) * 3 + 3,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong quý
              _returnQuarterData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnQuarterData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: target,
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong quý
                  _returnQuarterData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnQuarterData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong quý
                  _returnQuarterData.totalNumber += numberExportCylinder;
                  _returnQuarterData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnQuarterData;
            })
          );
        }
      }
      // Trường hợp thống kê các đơn vị con
      else {
        // Danh sách đơn vị xuất hàng cần tìm kiếm
        let targets = [];

        // Trường hợp target là công ty mẹ
        // Xem thông tin của các chi nhánh
        if (
          infoTarget.userType === "Factory" &&
          infoTarget.userRole === "SuperAdmin"
        ) {
          // Tìm các chi nhánh con
          // Không bao gồm trường hợp đặc biệt: NMSC - vì không xuất hàng
          const regions = await User.find({
            isDeleted: { "!=": true },
            isChildOf: target,
            // userType: { in: ['Region', 'Fixer'] },
            userType: "Region",
            userRole: "SuperAdmin",
            isDeleted: false,
          });

          // Lấy danh sách id của toàn bộ chi nhánh
          const listRegionId = await getUsersId(regions);

          // Tìm các trạm con của chi nhánh
          const stations = await User.find({
            isDeleted: { "!=": true },
            isChildOf: { in: listRegionId },
            userType: "Factory",
            userRole: "Owner",
            isDeleted: false,
          });

          // Lấy danh sách id của toàn bộ trạm
          const listStationId = await getUsersId(stations);

          targets = listStationId;
        }
        // Trường hợp target là chi nhánh
        // Xem thông tin của các trạm con
        else if (
          infoTarget.userType === "Region" &&
          infoTarget.userRole === "SuperAdmin"
        ) {
          // Tìm các trạm con của chi nhánh
          const stations = await User.find({
            isDeleted: { "!=": true },
            isChildOf: target,
            userType: "Factory",
            userRole: "Owner",
            isDeleted: false,
          });

          // Lấy danh sách id của toàn bộ trạm
          const listStationId = await getUsersId(stations);

          targets = listStationId;
        }
        // Trường hợp còn lại
        else {
          return res.badRequest(
            Utils.jsonErr("target không thuộc đối tượng được thống kê")
          );
        }

        // Trường hợp thống kê theo tháng
        if (dataType === "month") {
          // Thống kê từng tháng
          returnData.data = await Promise.all(
            MONTH.map(async (month) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnMonthData = {
                month: month,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong tháng
              const startDate = new Date(year, month - 1, 1).toISOString();
              const endDate = new Date(
                year,
                month,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong tháng
              _returnMonthData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              if (targets.length === 0) return _returnMonthData;

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnMonthData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: { in: targets },
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong tháng
                  _returnMonthData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnMonthData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong tháng
                  _returnMonthData.totalNumber += numberExportCylinder;
                  _returnMonthData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnMonthData;
            })
          );
        }

        // Trường hợp thống kê theo quý
        if (dataType === "quarter") {
          // Thống kê từng quý
          returnData.data = await Promise.all(
            QUARTER.map(async (quarter) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnQuarterData = {
                quarter: quarter,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong quý
              const startDate = new Date(
                year,
                (quarter - 1) * 3,
                1
              ).toISOString();
              const endDate = new Date(
                year,
                (quarter - 1) * 3 + 3,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong quý
              _returnQuarterData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnQuarterData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: { in: targets },
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong quý
                  _returnQuarterData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnQuarterData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong quý
                  _returnQuarterData.totalNumber += numberExportCylinder;
                  _returnQuarterData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnQuarterData;
            })
          );
        }
      }

      returnData.success = true;
      returnData.resCode = "SUCCESS-00024";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      return res.json({
        status: false,
        resCode: "CATCH-00007",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  getExportChart: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
      statisticalType, // isIn: ['byItself', 'byItsChildren']
      dataType, // isIn: ['month', 'quarter']
    } = req.query;

    let {
      startDate, // ISODate
      endDate, // ISODate
      year,
      filter, // Option: Tùy biến flow để tìm kiếm xuất hàng/xuất vỏ/...
    } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    if (!dataType) {
      return res.badRequest(Utils.jsonErr("dataType is required"));
    } else {
      const DATA_TYPE = ["month", "quarter"];
      if (!DATA_TYPE.includes(dataType)) {
        return res.badRequest(Utils.jsonErr("dataType is wrong"));
      }
    }

    if (!statisticalType) {
      return res.badRequest(Utils.jsonErr("statisticalType is required"));
    } else {
      const STATISTIC_TYPE = ["byItself", "byItsChildren"];
      if (!STATISTIC_TYPE.includes(statisticalType)) {
        return res.badRequest(Utils.jsonErr("statisticalType is wrong"));
      }
    }

    // Tùy biến flow để tìm kiếm xuất hàng/xuất vỏ/...
    if (!filter || filter === "undefined" || filter === "null") {
      filter = "EXPORT";
    } else {
      const FLOW = ["CREATE", "EXPORT", "IMPORT", "EXPORT_CELL", "IMPORT_CELL"];
      filter = filter.split(",");

      const found = filter.findIndex((flow) => !FLOW.includes(flow));
      if (found >= 0) {
        return res.badRequest(Utils.jsonErr("filter is wrong"));
      } else {
        filter = { in: filter };
      }
    }

    try {
      let DATE = [
        // {month: Number, year: Number},
        // {}, ...
      ];

      if (startDate && endDate) {
        // Kiểm tra định dạng ISODate
        if (
          !moment(startDate, moment.ISO_8601, true).isValid() ||
          !moment(endDate, moment.ISO_8601, true).isValid()
        ) {
          return res.badRequest(
            Utils.jsonErr("startDate or endDate format incorrect")
          );
        }

        // Chuyển startDate và endDate kiểu String ISODate về Date Object
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        // Trường hợp startDate < endDate thì đổi ngược lại thứ tự
        if (startDate - endDate > 0) {
          const temp = startDate;
          startDate = endDate;
          endDate = temp;
        }

        //
        let MONTH_startDate = startDate.getMonth() + 1;
        let YEAR_startDate = startDate.getFullYear();
        let MONTH_endDate = endDate.getMonth() + 1;
        let YEAR_endDate = endDate.getFullYear();
        //
        let currentQuarter = Math.ceil(MONTH_startDate / 3);
        let isDuplicateQuater = false;

        DATE.push({
          month: MONTH_startDate,
          year: YEAR_startDate,
          quarter: currentQuarter,
          isDuplicateQuater,
        });

        let i = 0;
        while (
          YEAR_startDate !== YEAR_endDate ||
          MONTH_startDate !== MONTH_endDate
        ) {
          // Tính lại tháng năm
          if (MONTH_startDate === 12) {
            MONTH_startDate = 1;
            YEAR_startDate += 1;
          } else {
            MONTH_startDate += 1;
          }

          // Tính lại quý
          const cursoQuater = Math.ceil(MONTH_startDate / 3);
          if (currentQuarter === cursoQuater) {
            isDuplicateQuater = true;
          } else {
            currentQuarter = cursoQuater;
            isDuplicateQuater = false;
          }

          DATE.push({
            month: MONTH_startDate,
            year: YEAR_startDate,
            quarter: currentQuarter,
            isDuplicateQuater,
          });

          i++;
          // Giới hạn chỉ tìm kiếm trong 24 tháng
          if (i === 23) break;
        }
      } else {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        let _startMonth = 1;
        let _endMonth = 12;
        //
        let currentQuarter = Math.ceil(_startMonth / 3);
        let isDuplicateQuater = false;

        if (!year) {
          year = currentYear;
        } else {
          // Đổi year về kiểu số
          year = parseInt(year);
        }

        // Trường hợp là năm hiện tại thì tính từ tháng 1 đến tháng hiện tại
        if (year === currentYear) {
          _endMonth = currentMonth;
        }

        // Trường hợp nhỏ hơn năm hiện tại thì tính đủ 12 tháng
        if (year < currentYear) {
          // _endMonth = _endMonth
        }

        // Trường hợp lớn hơn năm hiện tại thì không có dữ liệu
        if (year > currentYear) {
          return res.badRequest(
            Utils.jsonErr("There are no data available for this year")
          );
        }

        do {
          DATE.push({
            month: _startMonth,
            year: year,
            quarter: currentQuarter,
            isDuplicateQuater,
          });

          _startMonth++;

          // Tính lại quý
          const cursoQuater = Math.ceil(_startMonth / 3);
          if (currentQuarter === cursoQuater) {
            isDuplicateQuater = true;
          } else {
            currentQuarter = cursoQuater;
            isDuplicateQuater = false;
          }
        } while (_startMonth <= _endMonth);
      }

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
        isDeleted: false,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      // Tìm parentRoot
      const parent = await getRootParent(target);
      if (!parent) {
        return res.badRequest(Utils.jsonErr("parentRoot not found"));
      }

      // Tìm danh sách loại bình
      const cylinderCategory = await CategoryCylinder.find({
        isDeleted: { "!=": true },
        createdBy: parent.id,
        isDeleted: false,
      });

      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: [
          // {id: infoTarget.id, name: infoTarget.name, detail: []},
        ],
      };

      // Trường hợp thống kê chính nó
      if (statisticalType === "byItself") {
        // Trường hợp thống kê theo tháng
        if (dataType === "month") {
          // Thống kê từng tháng
          returnData.data = await Promise.all(
            DATE.map(async ({ month, year }) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnMonthData = {
                month,
                year,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong tháng
              const startDate = new Date(year, month - 1, 1).toISOString();
              const endDate = new Date(
                year,
                month,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong tháng
              _returnMonthData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnMonthData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: target,
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong tháng
                  _returnMonthData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnMonthData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong tháng
                  _returnMonthData.totalNumber += numberExportCylinder;
                  _returnMonthData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnMonthData;
            })
          );
        }

        // Trường hợp thống kê theo quý
        if (dataType === "quarter") {
          // Lọc danh sách quý bị trùng
          // Do 1 quý có 3 tháng
          _.remove(DATE, (dataDate) => {
            return dataDate.isDuplicateQuater;
          });

          // Thống kê từng quý
          returnData.data = await Promise.all(
            DATE.map(async ({ quarter, year }) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnQuarterData = {
                quarter,
                year,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong quý
              const startDate = new Date(
                year,
                (quarter - 1) * 3,
                1
              ).toISOString();
              const endDate = new Date(
                year,
                (quarter - 1) * 3 + 3,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong quý
              _returnQuarterData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnQuarterData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: target,
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong quý
                  _returnQuarterData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnQuarterData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong quý
                  _returnQuarterData.totalNumber += numberExportCylinder;
                  _returnQuarterData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnQuarterData;
            })
          );
        }
      }
      // Trường hợp thống kê các đơn vị con
      else {
        // Danh sách đơn vị xuất hàng cần tìm kiếm
        let targets = [];

        // Trường hợp target là công ty mẹ
        // Xem thông tin của các chi nhánh
        if (
          infoTarget.userType === "Factory" &&
          infoTarget.userRole === "SuperAdmin"
        ) {
          // Tìm các chi nhánh con
          // Không bao gồm trường hợp đặc biệt: NMSC - vì không xuất hàng
          const regions = await User.find({
            isDeleted: { "!=": true },
            isChildOf: target,
            // userType: { in: ['Region', 'Fixer'] },
            userType: "Region",
            userRole: "SuperAdmin",
            isDeleted: false,
          });

          // Lấy danh sách id của toàn bộ chi nhánh
          const listRegionId = await getUsersId(regions);

          // Tìm các trạm con của chi nhánh
          const stations = await User.find({
            isDeleted: { "!=": true },
            isChildOf: { in: listRegionId },
            userType: "Factory",
            userRole: "Owner",
            isDeleted: false,
          });

          // Lấy danh sách id của toàn bộ trạm
          const listStationId = await getUsersId(stations);

          targets = listStationId;
        }
        // Trường hợp target là chi nhánh
        // Xem thông tin của các trạm con
        else if (
          infoTarget.userType === "Region" &&
          infoTarget.userRole === "SuperAdmin"
        ) {
          // Tìm các trạm con của chi nhánh
          const stations = await User.find({
            isDeleted: { "!=": true },
            isChildOf: target,
            userType: "Factory",
            userRole: "Owner",
            isDeleted: false,
          });

          // Lấy danh sách id của toàn bộ trạm
          const listStationId = await getUsersId(stations);

          targets = listStationId;
        }
        // Trường hợp còn lại
        else {
          return res.badRequest(
            Utils.jsonErr("target không thuộc đối tượng được thống kê")
          );
        }

        // Trường hợp thống kê theo tháng
        if (dataType === "month") {
          // Thống kê từng tháng
          returnData.data = await Promise.all(
            DATE.map(async ({ month, year }) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnMonthData = {
                month,
                year,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong tháng
              const startDate = new Date(year, month - 1, 1).toISOString();
              const endDate = new Date(
                year,
                month,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong tháng
              _returnMonthData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              if (targets.length === 0) return _returnMonthData;

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnMonthData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: { in: targets },
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong tháng
                  _returnMonthData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnMonthData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong tháng
                  _returnMonthData.totalNumber += numberExportCylinder;
                  _returnMonthData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnMonthData;
            })
          );
        }

        // Trường hợp thống kê theo quý
        if (dataType === "quarter") {
          // Lọc danh sách quý bị trùng
          // Do 1 quý có 3 tháng
          _.remove(DATE, (dataDate) => {
            return dataDate.isDuplicateQuater;
          });

          // Thống kê từng quý
          returnData.data = await Promise.all(
            DATE.map(async ({ quarter, year }) => {
              // Tạo cấu trúc dữ liệu trả về cho từng tháng
              let _returnQuarterData = {
                quarter,
                year,
                totalNumber: 0,
                totalMass: 0,
                detail: [],
              };

              // Set thời gian tìm kiếm trong quý
              const startDate = new Date(
                year,
                (quarter - 1) * 3,
                1
              ).toISOString();
              const endDate = new Date(
                year,
                (quarter - 1) * 3 + 3,
                0,
                23,
                59,
                59,
                999
              ).toISOString();

              // Tạo cấu trúc dữ liệu trả về cho từng loại bình trong quý
              _returnQuarterData.detail = await Promise.all(
                cylinderCategory.map(async (category) => {
                  return {
                    id: category.id,
                    code: category.code,
                    name: category.name,
                    mass: category.mass,
                    statistic: {
                      // Khai báo mới
                      create: 0,
                      // Xuất hàng:
                      numberExport: 0,
                      massExport: 0,
                      // Hồi lưu
                      turnback: 0,
                      // Tồn kho
                      inventory: 0,
                    },
                  };
                })
              );

              // Thống kê theo từng loại bình
              await Promise.all(
                _returnQuarterData.detail.map(async (cylinderType, index) => {
                  // Tính số lượng bình xuất hàng
                  const numberExportCylinder = await CylinderImex.count({
                    createdAt: { ">=": startDate, "<=": endDate },
                    objectId: { in: targets },
                    category: cylinderType.id,
                    flow: filter,
                    // typeImex: 'OUT',
                  });
                  // Tính số lượng và khối lượng của riêng từng loại bình trong quý
                  _returnQuarterData.detail[index].statistic.numberExport +=
                    numberExportCylinder;
                  _returnQuarterData.detail[index].statistic.massExport +=
                    numberExportCylinder * cylinderType.mass;

                  // Tính tổng số lượng và khối lượng trong quý
                  _returnQuarterData.totalNumber += numberExportCylinder;
                  _returnQuarterData.totalMass +=
                    numberExportCylinder * cylinderType.mass;
                })
              );

              return _returnQuarterData;
            })
          );
        }
      }

      returnData.success = true;
      returnData.resCode = "SUCCESS-00024";
      returnData.message = "Lấy thông tin thống kê thành công";

      return res.json(returnData);
    } catch (error) {
      return res.json({
        status: false,
        resCode: "CATCH-00007",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  getAggregateByCylindersCondition: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    try {
      const objectId = req.query.target;
      let startDate = req.query.startDate;
      let endDate = req.query.endDate;
      const condition = req.query.condition;

      const CONDITIONS = ["NEW", "OLD"];

      if (!CONDITIONS.includes(condition.toUpperCase())) {
        return res.badRequest(Utils.jsonErr("Wrong condition!"));
      }

      // Trường hợp không truyền lên khoảng thời gian thống kê
      // Mặc định tìm trong ngày
      if (!startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Trong ngày
        const now = moment();

        startDate = now.startOf("day").toISOString();
        endDate = now.endOf("day").toISOString();
      } else if (startDate && !endDate) {
        // Khoảng thời gian tìm kiếm: Từ startDate đến cuối tháng
        const _staD = moment();

        // startDate = startDate
        endDate = _staD.endOf("month").toISOString();
      } else if (!startDate && endDate) {
        // Khoảng thời gian tìm kiếm: Từ đầu tháng đến endDate
        const _endD = moment();

        startDate = _endD.startOf("month").toISOString();
        // endDate = endDate
      }

      // Tìm info target
      // const infoTarget = await User.findOne({
      //   isDeleted: { "!=": true },
      //   id: objectId,
      // });
      // if (!infoTarget) {
      //   return res.badRequest(Utils.jsonErr("target not found"));
      // }

      const db = await StatisticVer2.getDatastore().manager;

      if (condition.toUpperCase() === "NEW") {
        const returnData = await db
          .collection("statisticver2")
          .aggregate(
            [
              {
                $match: {
                  objectId: ObjectId(objectId),
                  startDate: {
                    $gte: startDate,
                  },
                  endDate: {
                    $lte: endDate,
                  },
                },
              },
              {
                $sort: {
                  startDate: 1,
                },
              },
              {
                $group: {
                  _id: {
                    objectId: "$objectId",
                    cylinderTypeId: "$cylinderTypeId",
                    manufactureId: "$manufactureId",
                  },
                  inventoryNewCylinder: {
                    $last: "$inventoryNewCylinder",
                  },
                  createdNewCylinder: {
                    $sum: "$createdCylinder",
                  },
                  exportEmptyNewCylinder: {
                    $sum: "$exportEmptyCylinder",
                  },
                  // manufactureId: "$manufactureId",
                },
              },
              {
                $lookup: {
                  from: "categorycylinder",
                  localField: "_id.cylinderTypeId",
                  foreignField: "_id",
                  as: "LoaiBinh",
                },
              },
              {
                $unwind: {
                  path: "$LoaiBinh",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: "manufacture",
                  localField: "_id.manufactureId",
                  foreignField: "_id",
                  as: "ThuongHieu",
                },
              },
              {
                $unwind: {
                  path: "$ThuongHieu",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $group: {
                  _id: "$_id.objectId",
                  detail: {
                    $push: {
                      categoryCode: "$LoaiBinh.code",
                      categoryId: "$LoaiBinh._id",
                      categoryMass: "$LoaiBinh.mass",
                      categoryName: "$LoaiBinh.name",
                      create: "$createdNewCylinder",
                      exportShellToFixer: "$exportEmptyNewCylinder",
                      inventory: "$inventoryNewCylinder",
                      manufactureId: "$ThuongHieu._id",
                      manufactureStatisticId: "$manufactureId",
                      manufactureName: "$ThuongHieu.name",
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
            {
              allowDiskUse: true,
            }
          )
          .toArray();
        let cylinderTypes = [];
        returnData[0].detail.map((item) => {
          if (!cylinderTypes.includes(item.categoryCode))
            cylinderTypes.push(item.categoryCode);
        });
        console.log(returnData);
        return res.json({
          success: true,
          data: returnData,
          cylinderTypes: cylinderTypes,
        });
      } else {
        const returnData = await db
          .collection("statisticver2")
          .aggregate([
            {
              $match: {
                objectId: ObjectId(objectId),
                startDate: {
                  $gte: startDate,
                },
                endDate: {
                  $lte: endDate,
                },
              },
            },
            {
              $sort: {
                startDate: 1,
              },
            },
            {
              $group: {
                _id: {
                  objectId: "$objectId",
                  cylinderTypeId: "$cylinderTypeId",
                  manufactureId: "$manufactureId",
                },
                inventoryOldCylinder: {
                  $last: "$inventoryOldCylinder",
                },
                createdOldCylinder: {
                  $sum: "$createdOldCylinder",
                },
                exportEmptyOldCylinder: {
                  $sum: "$exportEmptyOldCylinder",
                },
              },
            },
            {
              $lookup: {
                from: "categorycylinder",
                localField: "_id.cylinderTypeId",
                foreignField: "_id",
                as: "LoaiBinh",
              },
            },
            {
              $unwind: {
                path: "$LoaiBinh",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "manufacture",
                localField: "_id.manufactureId",
                foreignField: "_id",
                as: "ThuongHieu",
              },
            },
            {
              $unwind: {
                path: "$ThuongHieu",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$_id.objectId",
                detail: {
                  $push: {
                    categoryCode: "$LoaiBinh.code",
                    categoryId: "$LoaiBinh.id",
                    categoryMass: "$LoaiBinh.mass",
                    categoryName: "$LoaiBinh.name",
                    create: "$createdOldCylinder",
                    exportShellToFixer: "$exportEmptyOldCylinder",
                    inventory: "$inventoryOldCylinder",
                    manufactureName: "$ThuongHieu.name",
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ])
          .toArray();
        let cylinderTypes = [];
        returnData[0].detail.map((item) => {
          if (!cylinderTypes.includes(item.categoryCode))
            cylinderTypes.push(item.categoryCode);
        });
        console.log(returnData);

        return res.json({
          success: true,
          data: returnData,
          cylinderTypes: cylinderTypes,
        });
      }

      // returnData.success = true;
      // returnData.resCode = "SUCCESS-00026";
      // returnData.message = "Lấy thông tin thống kê thành công";

      // return res.json(returnData);
    } catch (error) {
      return res.json({
        status: false,
        resCode: "CATCH-00008",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },

  getTotalCylinder: async function (req, res) {
    if (Object.keys(req.query).length === 0) {
      return res.badRequest(Utils.jsonErr("Empty query"));
    }

    const {
      target, // Id
      // statisticalType,    // isIn: ['byItself', 'byItsChildren']
      // condition,          // isIn: ['NEW', 'OLD']
    } = req.query;

    if (!target) {
      return res.badRequest(Utils.jsonErr("target is required"));
    }

    try {
      // Tạo cấu trúc dữ liệu trả về
      let returnData = {
        success: false,
        resCode: "",
        message: "",
        data: {
          numberCreated: 0,
        },
      };

      // Tìm info target
      const infoTarget = await User.findOne({
        isDeleted: { "!=": true },
        id: target,
        isDeleted: false,
      });
      if (!infoTarget) {
        return res.badRequest(Utils.jsonErr("target not found"));
      }

      const count = await CylinderImex.count({ flow: "CREATE" });

      returnData.success = true;
      returnData.resCode = "SUCCESS-00026";
      returnData.message = "Lấy thông tin thống kê thành công";
      returnData.data.numberCreated = count;

      return res.json(returnData);
    } catch (error) {
      return res.json({
        status: false,
        resCode: "CATCH-00011",
        data: {
          error: error.message,
        },
        message: "Gặp lỗi khi lấy thông tin",
      });
    }
  },
};

// === === ===

// ************* Get list user Id ************
getUsersId = async function (userInfo) {
  const result = await Promise.all(
    userInfo.map(async (user) => {
      return user.id;
    })
  );
  return result;
};

// *************** Function to get root Parent of user tree
async function getRootParent(parentId) {
  try {
    if (
      parentId === null ||
      typeof parentId === "undefined" ||
      parentId === ""
    ) {
      return "";
    }
    let parent = await User.findOne({
      isDeleted: { "!=": true },
      id: parentId,
    });
    if (!parent) {
      return "";
    }
    if (
      parent.userType === USER_TYPE.Factory &&
      parent.userRole === USER_ROLE.SUPER_ADMIN
    ) {
      return parent;
    }
    return await getRootParent(parent.isChildOf);
  } catch (error) {
    console.log(error.message);
  }
}

//
async function groupByArray(xs, key) {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      rv.push({
        key: v,
        values: [x],
      });
    }
    return rv;
  }, []);
}

//
function compareEndDate(a, b) {
  if (a.endDate < b.endDate) {
    return -1;
  }
  if (a.endDate > b.endDate) {
    return 1;
  }
  return 0;
}
