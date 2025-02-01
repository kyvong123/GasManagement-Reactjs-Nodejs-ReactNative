const PlaceStatus = require("../constants/PlaceStatus");
const UserTypes = require("../constants/UserTypes");
const excelToJson = require("convert-excel-to-json");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  /**
   * Parse excel to cylinder json list
   * @param files
   * @returns {Promise}
   */
  excelToCylinder: async function (
    files,
    ownerId,
    fixerId,
    companyId,
    classification,
    manufacture,
    userType,
    ownerName
  ) {
    //console.log(files);
    const excel = files[0];
    let result = {
      body: [],
      err: "non of error",
      status: false,
    };

    const cylinders = excelToJson({
      sourceFile: excel.fd,
      header: {
        rows: 1,
      },
      // columnToKey: {
      //   A: 'serial',
      //   B: 'img_url',
      //   C: 'color',
      //   D: 'checkedDate',
      //   E: 'weight',
      //   F: 'placeStatus',
      //   G: 'status',
      //   H: 'circleCount',
      //   I: 'currentImportPrice',
      //   J: 'manufacture'
      // }
      columnToKey: {
        A: "serial",
        B: "color",
        C: "valve",
        //E: 'classification',
        D: "checkedDate",
        E: "weight",
        //F: 'manufacture'
      },
    });
    //return Cylinder.createEach(cylinders.Sheet1).fetch();
    let body = [];
    let errorLogs = [];
    const datas = cylinders.Sheet1;
    // console.log('REMOVE EXCEL::::', datas);
    if (datas.length > 0) {
      for (let i = 0; i < datas.length; i++) {
        createdData = await createEach(
          datas[i],
          i + 2,
          ownerId,
          fixerId,
          companyId,
          classification,
          manufacture,
          userType,
          ownerName
        );
        if (!createdData.status) {
          errorLogs.push(createdData.err);
          //break;
        } else {
          //console.log('Created data::::', createdData);
          body.push(createdData.data);
        }
      }
      result.body = body;
    } else {
      result.err = "Data import is empty";
      result.status = false;
    }

    if (body.length === datas.length) {
      result.status = true;
    }

    if (errorLogs.length > 0) {
      result.err = errorLogs.join(";");
    }

    //console.log('RESULT IMPORT::::', result);
    return result;
  },

  excelReqToCylinder: async function (
    files,
    ownerId,
    id_ReqTo,
    classification,
    manufacture
  ) {
    //console.log(files);
    const excel = files[0];
    let result = {
      body: [],
      err: "non of error",
      status: false,
    };

    const cylinders = excelToJson({
      sourceFile: excel.fd,
      header: {
        rows: 1,
      },
      // columnToKey: {
      //   A: 'serial',
      //   B: 'img_url',
      //   C: 'color',
      //   D: 'checkedDate',
      //   E: 'weight',
      //   F: 'placeStatus',
      //   G: 'status',
      //   H: 'circleCount',
      //   I: 'currentImportPrice',
      //   J: 'manufacture'
      // }
      columnToKey: {
        // A: 'serial',
        // B: 'img_url',
        // C: 'color',
        // D: 'checkedDate',
        // E: 'weight',
        // F: 'currentImportPrice',
        // G: 'manufacture'
        A: "serial",
        B: "color",
        C: "valve",
        //E: 'classification',
        D: "checkedDate",
        E: "weight",
        // F: 'manufacture'
      },
    });
    //return Cylinder.createEach(cylinders.Sheet1).fetch();
    let body = [];
    let errorLogs = [];
    const datas = cylinders.Sheet1;
    // console.log('REMOVE EXCEL::::', datas);

    try {
      if (datas.length > 0) {
        const createReq = await ReqImport.create({
          id_ReqFrom: ownerId,
          id_ReqTo: id_ReqTo,
          createdBy: ownerId,
          status_Req: "INIT",
        }).fetch();
        if (createReq.id) {
          for (let i = 0; i < datas.length; i++) {
            createdData = await createEachReqDetail(
              datas[i],
              i + 2,
              ownerId,
              id_ReqTo,
              createReq.id,
              classification,
              manufacture
            );
            if (!createdData.status) {
              errorLogs.push(createdData.err);
              //break;
            } else {
              //console.log('Created data::::', createdData);
              body.push(createdData.data);
            }

            // let createDetailReq = await DetailReqImport.create({
            //   request: createReq.id,
            //   serial: datas[i].serial,
            //   img_url: datas[i].img_url,
            //   color: datas[i].color,
            //   checkedDate: datas[i].checkedDate,
            //   weight: datas[i].weight,
            //   currentImportPrice: datas[i].currentImportPrice,
            //   manufacture: datas[i].manufacture
            // }).fetch()

            // if (createDetailReq) {
            //   body.push(createDetailReq)
            // }
            // else {
            //   errorLogs.push(datas[i].serial)
            // }
          }
        }
      } else {
        result.err = "Data import is empty";
        result.status = false;
      }

      if (body.length === datas.length) {
        result.status = true;
        result.body = body;
      }

      if (errorLogs.length > 0) {
        result.err = errorLogs.join(";");
      }

      //console.log('RESULT IMPORT::::', result);
      return result;
    } catch (err) {
      result.status = false;
      result.err = err.message;
      return result;
    }
  },

  //
  excelToCylinderFromSubsidiary: async function (
    files,
    ownerId,
    /* classification, manufacture, category, assetType, rentalPartner, */ isChildOf,
    userType,
    ownerName
  ) {
    //console.log(files);
    const excel = files[0];
    let result = {
      body: [],
      err: "không có lỗi",
      status: false,
      resCode: "",
      duplicateCylinders: [],
      errorCylinders: [],
    };

    const cylinders = excelToJson({
      sourceFile: excel.fd,
      header: {
        rows: 1,
      },

      columnToKey: {
        A: "serial",
        B: "color",
        C: "valve",
        D: "checkedDate",
        E: "weight",
        I: "classification",
        J: "manufacture",
        K: "category",
        L: "productionDate",
        M: "embossLetters",
      },
    });
    let body = [];
    let errorLogs = [];

    // Kiểm tra nếu không có Sheet nào
    if (Object.keys(cylinders).length === 0) {
      result.status = false;
      result.err = "File excel rỗng, không có Sheet nào";
      return result;
    }
    // Lấy tên của Sheet đầu tiên
    const firstSheet = Object.keys(cylinders)[0];
    // Lấy dữ liệu của Sheet đầu tiên
    const datas = cylinders[firstSheet];
    // let datas
    // if (Array.isArray(cylinders)) {
    //   datas = cylinders[0];
    // }
    // else {
    //   datas = cylinders
    // }

    const idImex = Date.now();
    if (datas.length > 0) {
      // for(let i = 0; i < datas.length; i++){
      for (const data of datas) {
        const createdData = await createEachFromSubsidiary(
          data,
          /* index + 2, */ ownerId,
          /* classification, manufacture, category,  assetType, rentalPartner, */ isChildOf,
          userType,
          idImex,
          ownerName
        );
        if (!createdData.status) {
          errorLogs.push(createdData.err);
          // Kiểm tra xem mã lỗi là trùng bình
          // Thêm vao danh sách riêng
          if (createdData.resCode === "ERROR-00090") {
            result.duplicateCylinders.push(data);
          }
          if (createdData.resCode === "ERROR-00091") {
            result.errorCylinders.push(data);
          }
          //break;
        } else {
          //console.log('Created data::::', createdData);
          body.push(createdData.data);
        }
      }
      result.body = body;
      // }
    } else {
      result.err = "Dữ liệu nhập bị rỗng.";
      result.status = false;
    }

    if (body.length === datas.length) {
      result.status = true;
    }

    if (errorLogs.length > 0) {
      result.err = errorLogs.join(";");
      // Nếu có bình trùng thì đổi resCode === ERROR-00090
      // *** Chú ý:
      // Vẫn có thể xảy ra trường hợp lỗi
      // Bao gồm bình trùng + lỗi khác
      if (result.duplicateCylinders.length > 0) {
        result.resCode = "ERROR-00090";
      }
    }

    //console.log('RESULT IMPORT::::', result);
    return result;
  },

  /**
   * Parse excel to cylinder json list
   * @param cylinder_id
   * @param user
   * @returns {Promise}
   */
  upPlaceStatus: async function (cylinder_id, user) {
    let cylinder = await Cylinder.findOne({ id: cylinder_id });
    console.log(cylinder_id, cylinder, user);
    let newPlaceStatus = PlaceStatus.UN_KNOW;

    switch (cylinder.placeStatus) {
      case PlaceStatus.IN_FACTORY:
        if (user.userType !== UserTypes.Factory) {
          return false;
        }
        newPlaceStatus = PlaceStatus.DELIVERING;
        break;
      // case PlaceStatus.FACTORY2GENERAL:
      //     if (user.userType !== UserTypes.General) return false;
      //     newPlaceStatus = PlaceStatus.IN_GENERAL;
      //     break;
      case PlaceStatus.IN_GENERAL:
        if (user.userType !== UserTypes.General) {
          return false;
        }
        newPlaceStatus = PlaceStatus.DELIVERING;
        break;
      // case PlaceStatus.GENERAL2AGENCY:
      //     if (user.userType !== UserTypes.Agency) return false;
      //     newPlaceStatus = PlaceStatus.IN_AGENCY;
      //     break;
      case PlaceStatus.IN_AGENCY:
        if (user.userType !== UserTypes.Agency) {
          return false;
        }
        newPlaceStatus = PlaceStatus.DELIVERING;
        break;
      // case PlaceStatus.AGENCY2CUSTOMER:
      //     if(user.userType !== UserTypes.Factory) return null;
      //     break;
      // case PlaceStatus.IN_CUSTOMER:
      //     if(user.userType !== UserTypes.Factory) return null;
      //     break;
      default:
        return false;
    }

    return Cylinder.update({ id: cylinder_id })
      .set({
        placeStatus: newPlaceStatus,
      })
      .fetch();
  },

  //---------
  createEachCylinders: async function (
    data,
    ownerId,
    parent,
    userType,
    idImex /* , prefix */,
    ownerName
  ) {
    let createdData = {
      status: false,
      data: {},
      err: "",
    };
    const makeProductionName = (serial) => {
      const char = serial.split("")[1];
      switch (char) {
        case "B":
          return "Bình khí";
        case "A":
          return "Bình An";
        case "C":
          return "Setco";
        case "S":
          return "SMPC";
        case "F":
          return "Fsec";
        case "T":
          return "HT (Hai Thành)";
        case "H":
          return "Hong Leon";
        case "P":
          return "PMG";
        case "V":
          return "VPT(Việt Petro)";
        case "L":
          return "Linh Gas";
        case "J":
          return "JCC";
        case "K":
          return "Đơn vị khác";
        default:
          return "Không xác định";
      }
    };
    try {
      const db = await StatisticVer2.getDatastore().manager;
      const startOfDay = moment().startOf("day").toISOString();
      const endOfDay = moment().endOf("day").toISOString();

      const availableManufacture = await Manufacture.findOne({
        where: { owner: parent, id: data.manufacture },
      });
      if (!availableManufacture) {
        createdData.err = `Manufacture ${data.manufacture} is not available on your system, please check data for ${data.serial}`;
        return createdData;
      }

      const isExistCategory = await CategoryCylinder.findOne({
        id: data.category,
      });
      if (!isExistCategory) {
        createdData.err = `Cannot find the cylinder type with id = ${data.category} in the system`;
        return createdData;
      }

      const exitsCylinder = await Cylinder.findOne({ serial: data.serial });
      if (exitsCylinder) {
        /* --- Cập nhật lại thông tin bình khi trùng mã --- */
        if (
          !["DELIVERING", "IN_CUSTOMER"].includes(exitsCylinder.placeStatus)
        ) {
          if (exitsCylinder.current === ownerId) {
            // Ghi vào bảng CylinderImex
            // Xuất bình đi khai báo lại
            await CylinderImex.create({
              cylinder: exitsCylinder.id,
              status: exitsCylinder.status ? exitsCylinder.status : "EMPTY",
              condition: exitsCylinder.classification
                ? exitsCylinder.classification.toUpperCase()
                : "NEW",
              idImex: idImex ? idImex : Date.now(),
              typeImex: "OUT",
              flow: "REPAIR",
              flowDescription: "RE_DECLARE",
              category: exitsCylinder.category ? exitsCylinder.category : null,
              manufacture: exitsCylinder.manufacture
                ? exitsCylinder.manufacture
                : null,
              createdBy: ownerId,
              objectId: ownerId,
              // history: null,
            });

            /**
             * Cập nhật thông tin thống kê
             * STATISTIC - RETURN_FOR_REPAIR
             * STATISTIC - INVENTORY
             * STATISTIC - INVENTORY_CONDITION
             */
            // create a filter for a statistic to update
            const _objId = exitsCylinder.current;
            const filter = {
              startDate: startOfDay,
              endDate: endOfDay,
              objectId: ObjectId(_objId),
              cylinderTypeId: ObjectId(exitsCylinder.category),
              manufactureId: ObjectId(exitsCylinder.manufacture),
            };
            // update document
            let updateAccordingConditionCyl = {};
            if (
              exitsCylinder.classification &&
              exitsCylinder.classification.toUpperCase() === "OLD"
            ) {
              updateAccordingConditionCyl = {
                inventoryOldCylinder: {
                  $add: [{ $ifNull: ["$inventoryOldCylinder", 0] }, -1],
                },
              };
            } else {
              updateAccordingConditionCyl = {
                inventoryNewCylinder: {
                  $add: [{ $ifNull: ["$inventoryNewCylinder", 0] }, -1],
                },
              };
            }

            const updateDoc = [
              {
                $set: {
                  inventoryCylinder: {
                    $add: [{ $ifNull: ["$inventoryCylinder", 0] }, -1],
                  },
                  goodsIssue: { $add: [{ $ifNull: ["$goodsIssue", 0] }, 1] },
                  returnForRepair: {
                    $cond: {
                      if: {
                        $in: [
                          ObjectId(ownerId),
                          { $ifNull: ["$returnForRepair.to", []] },
                        ],
                      },
                      then: {
                        $map: {
                          input: "$returnForRepair",
                          as: "eachReturnStatistic",
                          in: {
                            $mergeObjects: [
                              "$$eachReturnStatistic",
                              {
                                $cond: {
                                  if: {
                                    $eq: [
                                      "$$eachReturnStatistic.to",
                                      ObjectId(ownerId),
                                    ],
                                  },
                                  then: {
                                    quantity: {
                                      $add: [
                                        "$$eachReturnStatistic.quantity",
                                        1,
                                      ],
                                    },
                                  },
                                  else: {},
                                },
                              },
                            ],
                          },
                        },
                      }, // process array making appropriate change to correct element
                      else: {
                        $concatArrays: [
                          { $ifNull: ["$returnForRepair", []] },
                          [{ to: ObjectId(ownerId), quantity: 1 }],
                        ],
                      },
                    },
                  },
                  ...updateAccordingConditionCyl,
                },
              },
            ];
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            await db
              .collection("statisticver2")
              .updateOne(filter, updateDoc, options);
          } else {
            // Ghi vào bảng CylinderImex
            // Xuất bình đi khai báo lại
            await CylinderImex.create({
              cylinder: exitsCylinder.id,
              status: exitsCylinder.status ? exitsCylinder.status : "EMPTY",
              condition: exitsCylinder.classification
                ? exitsCylinder.classification.toUpperCase()
                : "NEW",
              idImex: idImex ? idImex : Date.now(),
              typeImex: "OUT",
              flow: "REPAIR",
              flowDescription: "RE_DECLARE",
              category: exitsCylinder.category ? exitsCylinder.category : null,
              manufacture: exitsCylinder.manufacture
                ? exitsCylinder.manufacture
                : null,
              createdBy: ownerId,
              objectId: exitsCylinder.current,
              // history: null,
            });

            /**
             * Cập nhật thông tin thống kê
             * STATISTIC - RETURN_FOR_REPAIR
             * STATISTIC - INVENTORY
             * STATISTIC - INVENTORY_CONDITION
             */
            // create a filter for a statistic to update
            const _objId = exitsCylinder.current;
            const filter = {
              startDate: startOfDay,
              endDate: endOfDay,
              objectId: ObjectId(_objId),
              cylinderTypeId: ObjectId(exitsCylinder.category),
              manufactureId: ObjectId(exitsCylinder.manufacture),
            };
            // update document
            let updateAccordingConditionCyl = {};
            if (
              exitsCylinder.classification &&
              exitsCylinder.classification.toUpperCase() === "OLD"
            ) {
              updateAccordingConditionCyl = {
                inventoryOldCylinder: {
                  $add: [{ $ifNull: ["$inventoryOldCylinder", 0] }, -1],
                },
              };
            } else {
              updateAccordingConditionCyl = {
                inventoryNewCylinder: {
                  $add: [{ $ifNull: ["$inventoryNewCylinder", 0] }, -1],
                },
              };
            }

            const updateDoc = [
              {
                $set: {
                  inventoryCylinder: {
                    $add: [{ $ifNull: ["$inventoryCylinder", 0] }, -1],
                  },
                  goodsIssue: { $add: [{ $ifNull: ["$goodsIssue", 0] }, 1] },
                  returnForRepair: {
                    $cond: {
                      if: {
                        $in: [
                          ObjectId(ownerId),
                          { $ifNull: ["$returnForRepair.to", []] },
                        ],
                      },
                      then: {
                        $map: {
                          input: "$returnForRepair",
                          as: "eachReturnStatistic",
                          in: {
                            $mergeObjects: [
                              "$$eachReturnStatistic",
                              {
                                $cond: {
                                  if: {
                                    $eq: [
                                      "$$eachReturnStatistic.to",
                                      ObjectId(ownerId),
                                    ],
                                  },
                                  then: {
                                    quantity: {
                                      $add: [
                                        "$$eachReturnStatistic.quantity",
                                        1,
                                      ],
                                    },
                                  },
                                  else: {},
                                },
                              },
                            ],
                          },
                        },
                      }, // process array making appropriate change to correct element
                      else: {
                        $concatArrays: [
                          { $ifNull: ["$returnForRepair", []] },
                          [{ to: ObjectId(ownerId), quantity: 1 }],
                        ],
                      },
                    },
                  },
                  ...updateAccordingConditionCyl,
                },
              },
            ];
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            await db
              .collection("statisticver2")
              .updateOne(filter, updateDoc, options);
          }
        }

        const dataUpdate = { ...data };
        dataUpdate.productionName = makeProductionName(data.serial);
        dataUpdate.factory = parent;
        dataUpdate.current = ownerId;
        dataUpdate.placeStatus =
          userType === "Factory"
            ? "IN_FACTORY"
            : userType === "Fixer"
            ? "IN_REPAIR"
            : "IN_" + userType.toUpperCase();
        // data.classification = classification;
        // data.manufacture = manufacture;
        // dataUpdate.manufacturedBy = ownerId;
        // data.category = category;
        dataUpdate.updatedBy = ownerId;
        const updatedCylinder = await Cylinder.updateOne({
          id: exitsCylinder.id,
        }).set(dataUpdate);

        if (!updatedCylinder) {
          createdData.err = `UPDATE fail`;
          return createdData;
        }

        // Ghi tiếp vào bảng CylinderImex
        await CylinderImex.create({
          cylinder: updatedCylinder.id,
          status: updatedCylinder.status ? updatedCylinder.status : "EMPTY",
          condition: updatedCylinder.classification
            ? updatedCylinder.classification.toUpperCase()
            : "NEW",
          idImex: idImex ? idImex : Date.now(),
          typeImex: "IN",
          flow: "REPAIR",
          flowDescription: "RE_DECLARE",
          category: updatedCylinder.category ? updatedCylinder.category : null,
          manufacture: updatedCylinder.manufacture
            ? updatedCylinder.manufacture
            : null,
          createdBy: ownerId,
          objectId: ownerId,
          // history: null,
        });

        /**
         * Cập nhật thông tin thống kê
         * STATISTIC - RECOVERED_FOR_REPAIR
         * STATISTIC - INVENTORY
         * STATISTIC - INVENTORY_CONDITION
         */
        // create a filter for a statistic to update
        const _objId = ownerId;
        const filter = {
          startDate: startOfDay,
          endDate: endOfDay,
          objectId: ObjectId(_objId),
          cylinderTypeId: ObjectId(exitsCylinder.category),
          manufactureId: ObjectId(exitsCylinder.manufacture),
        };
        // update document
        let updateAccordingConditionCyl = {};
        if (
          exitsCylinder.classification &&
          exitsCylinder.classification.toUpperCase() === "OLD"
        ) {
          updateAccordingConditionCyl = {
            inventoryOldCylinder: {
              $add: [{ $ifNull: ["$inventoryOldCylinder", 0] }, 1],
            },
          };
        } else {
          updateAccordingConditionCyl = {
            inventoryNewCylinder: {
              $add: [{ $ifNull: ["$inventoryNewCylinder", 0] }, 1],
            },
          };
        }

        const updateDoc = [
          {
            $set: {
              inventoryCylinder: {
                $add: [{ $ifNull: ["$inventoryCylinder", 0] }, 1],
              },
              goodsReceipt: { $add: [{ $ifNull: ["$goodsReceipt", 0] }, 1] },
              recoveredForRepair: {
                $cond: {
                  if: {
                    $in: [
                      ObjectId(exitsCylinder.current),
                      { $ifNull: ["$recoveredForRepair.from", []] },
                    ],
                  },
                  then: {
                    $map: {
                      input: "$recoveredForRepair",
                      as: "eachRecoverStatistic",
                      in: {
                        $mergeObjects: [
                          "$$eachRecoverStatistic",
                          {
                            $cond: {
                              if: {
                                $eq: [
                                  "$$eachRecoverStatistic.from",
                                  ObjectId(exitsCylinder.current),
                                ],
                              },
                              then: {
                                quantity: {
                                  $add: ["$$eachRecoverStatistic.quantity", 1],
                                },
                              },
                              else: {},
                            },
                          },
                        ],
                      },
                    },
                  }, // process array making appropriate change to correct element
                  else: {
                    $concatArrays: [
                      { $ifNull: ["$recoveredForRepair", []] },
                      [{ from: ObjectId(exitsCylinder.current), quantity: 1 }],
                    ],
                  },
                },
              },
              ...updateAccordingConditionCyl,
            },
          },
        ];
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        await db
          .collection("statisticver2")
          .updateOne(filter, updateDoc, options);

        createdData.status = true;
        createdData.data = updatedCylinder;

        /* --- Ghi lại lịch sử khai báo/cập nhật bình --- */
        let updateType = "UNKNOW";
        if (userType === "Fixer") {
          updateType = "PAINT_CURING";
        }
        if (userType === "Factory") {
          updateType = "REPRINT_THE_IDENTIFIER";
        }

        await CylinderUpdateHistory.create({
          cylinder: updatedCylinder.id,
          type: updateType,
          manufacture: updatedCylinder.manufacture,
          weight: updatedCylinder.weight,
          color: updatedCylinder.color,
          valve: updatedCylinder.valve,
          createdByName: ownerName,
          createdBy: ownerId,
        });

        return createdData;
      } //het doan binh trung
      data.productionName = makeProductionName(data.serial);
      data.factory = parent;
      data.current = ownerId;
      data.placeStatus =
        userType === "Factory"
          ? "IN_FACTORY"
          : userType === "Fixer"
          ? "IN_REPAIR"
          : "IN_" + userType.toUpperCase();
      // data.classification = classification;
      // data.manufacture = manufacture;
      data.manufacturedBy = ownerId;
      // data.category = category;
      data.createdBy = ownerId;
      const cylinder = await Cylinder.create(data).fetch();

      // Ghi tiếp vào bảng CylinderImex
      await CylinderImex.create({
        cylinder: cylinder.id,
        status: cylinder.status ? cylinder.status : "EMPTY",
        condition: cylinder.classification
          ? cylinder.classification.toUpperCase()
          : "NEW",
        idImex: idImex ? idImex : Date.now(),
        typeImex: "IN",
        flow: "CREATE",
        category: cylinder.category ? cylinder.category : null,
        manufacture: cylinder ? cylinder.manufacture : null,
        createdBy: ownerId,
        objectId: ownerId,
        // history: null,
      });

      /**
       * Cập nhật thông tin thống kê
       * STATISTIC - CREATE
       * STATISTIC - INVENTORY
       * STATISTIC - CREATE_CONDITION
       * STATISTIC - INVENTORY_CONDITION
       */
      // create a filter for a statistic to update
      const filter = {
        startDate: startOfDay,
        endDate: endOfDay,
        objectId: ObjectId(cylinder.createdBy),
        cylinderTypeId: ObjectId(cylinder.category),
        manufactureId: ObjectId(cylinder.manufacture),
      };
      // update document
      let updateAccordingConditionCyl = {};
      if (
        cylinder.classification &&
        cylinder.classification.toUpperCase() === "OLD"
      ) {
        updateAccordingConditionCyl = {
          createdOldCylinder: 1,
          inventoryOldCylinder: 1,
        };
      } else {
        updateAccordingConditionCyl = {
          createdNewCylinder: 1,
          inventoryNewCylinder: 1,
        };
      }

      const updateDoc = {
        $inc: {
          createdCylinder: 1,
          inventoryCylinder: 1,
          goodsReceipt: 1,
          ...updateAccordingConditionCyl,
        },
      };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      await db
        .collection("statisticver2")
        .updateOne(filter, updateDoc, options);

      //console.log('Created data::::', createdData);
      createdData.status = true;
      createdData.data = cylinder;

      /* --- Ghi lại lịch sử khai báo/cập nhật bình --- */
      let updateType = "CREATE";

      await CylinderUpdateHistory.create({
        cylinder: cylinder.id,
        type: updateType,
        manufacture: cylinder.manufacture,
        weight: cylinder.weight,
        color: cylinder.color,
        valve: cylinder.valve,
        createdByName: ownerName,
        createdBy: ownerId,
      });

      return createdData;
    } catch (err) {
      createdData.err = err.message;
      return createdData;
    }
  },
};

/**
 * Action for /cylinder/create
 * @param req
 * @param res
 * @returns {*}
 */
async function createEach(
  data,
  index,
  ownerId,
  fixerId,
  companyId,
  classification,
  manufacture,
  userType,
  ownerName
) {
  let createdData = {
    status: false,
    data: {},
    err: "",
  };
  try {
    const availableManufacture = await Manufacture.findOne({
      where: { owner: ownerId, id: manufacture },
    });

    if (!availableManufacture) {
      createdData.err = `Manufacture ${manufacture} is not available on your system, please check data at line ${index} of excel `;
      return createdData;
    }

    const exitsCylinder = await Cylinder.findOne({
      where: { serial: data.serial, manufacture: manufacture },
    });
    if (exitsCylinder) {
      createdData.err = `The cylinder with serial ${data.serial} with manufacture ${manufacture} already exist, please check data at line ${index} of excel `;
      return createdData;
    }
    if (!companyId) {
      data.factory = ownerId;
      data.current = fixerId ? fixerId : ownerId;
      data.placeStatus = fixerId ? "IN_REPAIR" : "IN_FACTORY";
      data.classification = classification;
      data.manufacture = manufacture;
      data.manufacturedBy = fixerId ? fixerId : ownerId;
    } else {
      data.factory = ownerId;
      data.current = companyId;
      data.placeStatus = "IN_FACTORY";
      data.classification = classification;
      data.manufacture = manufacture;
      data.manufacturedBy = companyId;
    }
    // data.factory = ownerId;
    // data.current = fixerId ? fixerId : ownerId;
    // data.placeStatus =  fixerId ? 'IN_REPAIR' : 'IN_FACTORY';
    const cylinder = await Cylinder.create(data).fetch();
    //console.log('Created data::::', createdData);
    createdData.status = true;
    createdData.data = cylinder;

    /* --- Ghi lại lịch sử khai báo/cập nhật bình --- */
    let updateType = "CREATE";

    await CylinderUpdateHistory.create({
      cylinder: cylinder.id,
      type: updateType,
      manufacture: cylinder.manufacture,
      weight: cylinder.weight,
      color: cylinder.color,
      valve: cylinder.valve,
      createdByName: ownerName,
      createdBy: ownerId,
    });

    return createdData;
  } catch (err) {
    createdData.err = err.message;
    return createdData;
  }
}

async function createEachReqDetail(
  data,
  index,
  ownerId,
  id_ReqTo,
  idRequest,
  classification,
  manufacture
) {
  let createdData = {
    status: false,
    data: {},
    err: "",
  };
  try {
    const availableManufacture = await Manufacture.findOne({
      where: { owner: id_ReqTo, id: manufacture },
    });

    if (!availableManufacture) {
      createdData.err = `Manufacture ${manufacture} is not available on your system, please check data at line ${index} of excel `;
      return createdData;
    }

    const exitsCylinder = await Cylinder.findOne({
      //where: {serial: data.serial, manufacture: manufacture},
      serial: data.serial,
    });
    if (exitsCylinder) {
      createdData.err = `The cylinder with serial ${data.serial} with manufacture ${manufacture} already exist, please check data at line ${index} of excel `;
      return createdData;
    }
    //data.factory = ownerId;
    //data.current = id_ReqTo ? id_ReqTo : ownerId;
    //data.placeStatus =  id_ReqTo ? 'IN_REPAIR' : 'IN_FACTORY';
    data.createdBy = ownerId;
    data.request = idRequest;
    data.classification = classification;
    data.manufacture = manufacture;
    const reqDetail = await DetailReqImport.create(data).fetch();
    //console.log('Created data::::', createdData);
    createdData.status = true;
    createdData.data = reqDetail;
    return createdData;
  } catch (err) {
    createdData.err = err.message;
    return createdData;
  }
}

async function createEachFromSubsidiary(
  data,
  /* index, */ ownerId,
  /* assetType, rentalPartner, */ isChildOf,
  userType,
  idImex,
  ownerName
) {
  let createdData = {
    status: false,
    data: {},
    err: "",
    resCode: "",
  };
  try {
    const db = await StatisticVer2.getDatastore().manager;
    const startOfDay = moment().startOf("day").toISOString();
    const endOfDay = moment().endOf("day").toISOString();

    const availableManufacture = await Manufacture.findOne({
      where: { owner: isChildOf, id: data.manufacture },
    });
    if (!availableManufacture) {
      createdData.err = `Manufacture ${data.manufacture} is not available on your system, please check data at line ${index} of excel `;
      createdData.resCode = "ERROR-00091";
      return createdData;
    }

    const isExistCategory = await CategoryCylinder.findOne({
      id: data.category,
    });
    if (!isExistCategory) {
      createdData.err = `Không tìm thấy loại bình với id = ${data.category} trong hệ thống`;
      createdData.resCode = "ERROR-00091";
      return createdData;
    }
    const patch = {};
    if (data.serial) {
      patch.serial = data.serial;
    }
    if (data.color) {
      patch.color = data.color;
    }
    if (data.weight) {
      patch.weight = data.weight;
    }
    if (data.checkedDate) {
      patch.checkedDate = data.checkedDate;
    }
    if (data.valve) {
      patch.valve = data.valve;
    }
    if (data.classification) {
      patch.classification = data.classification === "Bình cũ" ? "Old" : "New";
    }
    if (data.manufacture) {
      patch.manufacture = data.manufacture;
    }
    if (data.category) {
      patch.category = data.category;
    }
    if (data.embossLetters) {
      patch.embossLetters = data.embossLetters;
    }
    if (data.productionDate) {
      patch.productionDate = data.productionDate;
    }
    patch.factory = isChildOf;
    patch.current = ownerId;
    patch.placeStatus =
      userType === "Factory"
        ? "IN_FACTORY"
        : userType === "Fixer"
        ? "IN_REPAIR"
        : "IN_" + userType.toUpperCase();
    patch.manufacturedBy = ownerId;

    const exitsCylinder = await Cylinder.findOne({
      // where: {serial: data.serial, manufacture: manufacture},
      serial: data.serial,
    });
    let cylinder;
    if (exitsCylinder) {
      //Cập nhật lại bình nếu đã tồn tại
      patch.exportPlace = null;
      patch.exportDate = "";
      patch.updateBy = ownerId;
      cylinder = await Cylinder.updateOne({
        serial: data.serial,
      }).set(patch);
      // createdData.err = `Bình có mã ${data.serial} đã tồn tại đã được cập nhật lại.`;
      // createdData.resCode = 'ERROR-00090';
      // return createdData;

      // Ghi tiếp vào bảng CylinderImex

      await CylinderImex.create({
        cylinder: cylinder.id,
        status: cylinder.status ? cylinder.status : "EMPTY",
        condition: cylinder.classification
          ? cylinder.classification.toUpperCase()
          : "NEW",
        idImex: idImex ? idImex : Date.now(),
        typeImex: "IN",
        flow: "REPAIR",
        flowDescription: "RE_DECLARE",
        category: cylinder.category ? cylinder.category : null,
        manufacture: cylinder.manufacture ? cylinder.manufacture : null,
        createdBy: ownerId,
        objectId: cylinder.current,
        // history: null,
      });
      /**
       * Cập nhật thông tin thống kê
       * STATISTIC - RECOVERED_FOR_REPAIR
       * STATISTIC - INVENTORY
       * STATISTIC - INVENTORY_CONDITION
       */
      // create a filter for a statistic to update
      const _objId = ownerId;
      const filter = {
        startDate: startOfDay,
        endDate: endOfDay,
        objectId: ObjectId(_objId),
        cylinderTypeId: ObjectId(exitsCylinder.category),
        manufactureId: ObjectId(exitsCylinder.manufacture),
      };
      // update document
      let updateAccordingConditionCyl = {};
      if (
        exitsCylinder.classification &&
        exitsCylinder.classification.toUpperCase() === "OLD"
      ) {
        updateAccordingConditionCyl = {
          inventoryOldCylinder: {
            $add: [{ $ifNull: ["$inventoryOldCylinder", 0] }, 1],
          },
        };
      } else {
        updateAccordingConditionCyl = {
          inventoryNewCylinder: {
            $add: [{ $ifNull: ["$inventoryNewCylinder", 0] }, 1],
          },
        };
      }

      const updateDoc = [
        {
          $set: {
            inventoryCylinder: {
              $add: [{ $ifNull: ["$inventoryCylinder", 0] }, 1],
            },
            goodsReceipt: { $add: [{ $ifNull: ["$goodsReceipt", 0] }, 1] },
            recoveredForRepair: {
              $cond: {
                if: {
                  $in: [
                    ObjectId(exitsCylinder.current),
                    { $ifNull: ["$recoveredForRepair.from", []] },
                  ],
                },
                then: {
                  $map: {
                    input: "$recoveredForRepair",
                    as: "eachRecoverStatistic",
                    in: {
                      $mergeObjects: [
                        "$$eachRecoverStatistic",
                        {
                          $cond: {
                            if: {
                              $eq: [
                                "$$eachRecoverStatistic.from",
                                ObjectId(exitsCylinder.current),
                              ],
                            },
                            then: {
                              quantity: {
                                $add: ["$$eachRecoverStatistic.quantity", 1],
                              },
                            },
                            else: {},
                          },
                        },
                      ],
                    },
                  },
                }, // process array making appropriate change to correct element
                else: {
                  $concatArrays: [
                    { $ifNull: ["$recoveredForRepair", []] },
                    [{ from: ObjectId(exitsCylinder.current), quantity: 1 }],
                  ],
                },
              },
            },
            ...updateAccordingConditionCyl,
          },
        },
      ];
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      await db
        .collection("statisticver2")
        .updateOne(filter, updateDoc, options);

      createdData.status = true;
      createdData.data = cylinder;

      /* --- Ghi lại lịch sử khai báo/cập nhật bình --- */
      let updateType = "UNKNOW";
      if (userType === "Fixer") {
        updateType = "PAINT_CURING";
      }
      if (userType === "Factory") {
        updateType = "REPRINT_THE_IDENTIFIER";
      }

      await CylinderUpdateHistory.create({
        cylinder: cylinder.id,
        type: updateType,
        manufacture: cylinder.manufacture,
        weight: cylinder.weight,
        color: cylinder.color,
        valve: cylinder.valve,
        createdByName: ownerName,
        createdBy: ownerId,
      });
      return createdData;
    }

    patch.createdBy = ownerId;
    cylinder = await Cylinder.create(patch).fetch();

    // //Tạo mới  => ghi vào Redis ( thêm 1 bình)
    // //   //********************* REDIS ************************/
    // if (cylinder) {
    //   let isConnected
    //   let isExist
    //   try {
    //     isConnected = await redisServices.isConnectRedis()
    //   } catch (error) {
    //     isConnected = false
    //   }
    //   if (isConnected) {
    //     //=========== Bước 1: Đánh index cho HASH cylinder ========== Uncomment when use it
    //     try {
    //       await redisServices.ftCreatePromise(
    //         'idx:cylinders',
    //         {
    //           serial: {
    //             type: SchemaFieldTypes.TEXT
    //           },
    //         },
    //         {
    //           ON: 'HASH',
    //           PREFIX: 'cylinder:'
    //         }
    //       )
    //     } catch (e) {
    //       if (e.message === 'Index already exists') {
    //         console.log('Skipping index creation as it already exists.')
    //       } else {
    //         console.error(e)
    //       }
    //     }

    //     //=========== Buoc 2: Truy vấn Search với Redis ==========
    //     try {
    //       const search = await redisServices.ftSearchPromise("idx:cylinders", cylinder.serial)
    //       isExist = search.documents.length !== 0
    //     } catch (e) {
    //       console.log(e.message)
    //     }

    //     // // =========== Ghi du lieu cylinder moi vao Redis  ==========
    //     if (isExist) {
    //       const lastIndex = await redisServices.dbSizePromise()
    //       await redisServices.hSetPromise(`cylinder:${lastIndex + 1}`, {
    //         serial: item,
    //       })
    //     }
    //   }
    //   // //*********************************** */
    // }

    // Ghi tiếp vào bảng CylinderImex

    await CylinderImex.create({
      cylinder: cylinder.id,
      status: cylinder.status ? cylinder.status : "FULL",
      condition: cylinder.classification
        ? cylinder.classification.toUpperCase()
        : "NEW",
      idImex: idImex ? idImex : Date.now(),
      typeImex: "IN",
      flow: "CREATE",
      category: cylinder.category,
      manufacture: cylinder ? cylinder.manufacture : null,
      createdBy: ownerId,
      objectId: ownerId,
      // history: null,
    });
    /**
     * Cập nhật thông tin thống kê
     * STATISTIC - CREATE
     * STATISTIC - INVENTORY
     * STATISTIC - CREATE_CONDITION
     * STATISTIC - INVENTORY_CONDITION
     */
    // create a filter for a statistic to update
    const filter = {
      startDate: startOfDay,
      endDate: endOfDay,
      objectId: ObjectId(cylinder.createdBy),
      cylinderTypeId: ObjectId(cylinder.category),
      manufactureId: ObjectId(cylinder.manufacture),
    };
    // update document
    let updateAccordingConditionCyl = {};
    if (
      cylinder.classification &&
      cylinder.classification.toUpperCase() === "OLD"
    ) {
      updateAccordingConditionCyl = {
        createdOldCylinder: 1,
        inventoryOldCylinder: 1,
      };
    } else {
      updateAccordingConditionCyl = {
        createdNewCylinder: 1,
        inventoryNewCylinder: 1,
      };
    }

    const updateDoc = {
      $inc: {
        createdCylinder: 1,
        inventoryCylinder: 1,
        goodsReceipt: 1,
        ...updateAccordingConditionCyl,
      },
    };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };
    await db.collection("statisticver2").updateOne(filter, updateDoc, options);

    createdData.status = true;
    createdData.data = cylinder;

    /* --- Ghi lại lịch sử khai báo/cập nhật bình --- */
    let updateType = "CREATE";

    await CylinderUpdateHistory.create({
      cylinder: cylinder.id,
      type: updateType,
      manufacture: cylinder.manufacture,
      weight: cylinder.weight,
      color: cylinder.color,
      valve: cylinder.valve,
      createdByName: ownerName,
      createdBy: ownerId,
    });

    return createdData;
  } catch (err) {
    createdData.err = err.message;
    return createdData;
  }
}
