import axios from "axios";
import { CREATEHISTORY } from "config";
import getUserCookies from "getUserCookies";
import Constant from "Constants";
import showToast from "showToast";
async function createHistoryAPI(
  driver,
  license_plate,
  cylinders,
  type,
  to_id,
  import_type,
  numberOfCylinder,
  from_id,
  to_array,
  number_array,
  phoneCustomer = "",
  nameCustomer = "",
  addressCustomer = "",
  typeForPartner,
  exportPlace,
  idDriver,
  sign,
  cylinderImex,
  idImex,
  typeImex,
  flow,
  cylinerIneligible,
  turnBack_cylinerIneligible,
  shipper = "",
  phoneNumber = ""
) {
  let data;
  try {
    var user_cookies = await getUserCookies();
    console.log(user_cookies);
  } catch (error) {
    console.log(error.message);
  }

  let count = 0;
  //console.log(number_array);
  if (!!number_array) {
    for (let i = 0; i < number_array.length; i++) {
      let item = parseInt(number_array[i]);
      count += item;
    }
    // if (count !== cylinders.length) {
    //     return {data: {message: "Số lượng không chính xác!!!"}};
    // }
  }
  if (user_cookies) {
    let params = {};
    switch (type) {
      case Constant.EXPORT_BACK_FACTORY:
        params = {
          driver: driver,
          license_plate: license_plate,
          from: user_cookies.user.id,
          to: to_id,
          cylinders: cylinders,
          type: Constant.EXPORT_TYPE,
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case Constant.IMPORT_FACTORY:
        params = {
          driver: driver,
          license_plate: license_plate,
          to: user_cookies.user.id,
          cylinders: cylinders,
          type: import_type,
          from: from_id ? from_id : null,
          numberOfCylinder: parseInt(numberOfCylinder),
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case "IMPORT_DIRECT":
        params = {
          driver: driver,
          license_plate: license_plate,
          to: to_id ? to_id : user_cookies.user.id,
          toImportDirectId: to_id,
          cylinders: cylinders,
          type: import_type,
          from: from_id ? from_id : null,
          numberOfCylinder: parseInt(numberOfCylinder),
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeForPartner: typeForPartner,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case Constant.EXPORT_WAREHOUSE:
        console.log("askJal;dSas", to_id, to_array);
        params = {
          driver: driver,
          license_plate: license_plate,
          from: user_cookies.user.id,
          idTruck: to_array,
          isTruck: true,
          to: to_id === "" ? null : to_id,
          numberArray: number_array,
          cylinders: cylinders,
          type: Constant.EXPORT_TYPE,
          exportPlace: exportPlace,
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case Constant.EXPORT_FACTORY:
        console.log("askJal;dSas", to_id, to_array);
        params = {
          driver: driver,
          license_plate: license_plate,
          from: user_cookies.user.id,
          toArray: to_array,
          to: to_id === "" ? null : to_id,
          numberArray: number_array,
          cylinders: cylinders,
          type: Constant.EXPORT_TYPE,
          exportPlace: exportPlace,
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case Constant.IMPORT_STATION:
        params = {
          driver: driver,
          license_plate: license_plate,
          from: from_id,
          to: user_cookies.user.id,
          cylinders: cylinders,
          type: import_type,
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case Constant.EXPORT_STATION:
        params = {
          driver: driver,
          license_plate: license_plate,
          from: user_cookies.user.id,
          to: to_id,
          cylinders: cylinders,
          type: Constant.EXPORT_TYPE,
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case Constant.SALE_TYPE:
        if (
          (user_cookies.user.userType === "Agency" ||
            user_cookies.user.userType === "General") &&
          user_cookies.user.userRole === "SuperAdmin"
        ) {
          params = {
            driver: driver,
            license_plate: license_plate,
            from: user_cookies.user.id,
            cylinders: cylinders,
            type: Constant.SALE_TYPE,
            saler: user_cookies.user.id,
            salerName: user_cookies.user.name,
            phoneCustomer: phoneCustomer,
            addressCustomer: addressCustomer,
            nameCustomer: nameCustomer,
            shipper: shipper,
            phoneNumber: phoneNumber,
            idDriver: idDriver,
            signature: sign,
            cylinderImex: cylinderImex,
            idImex: idImex,
            typeImex: typeImex,
            flow: flow,
            cylinerIneligible: cylinerIneligible,
            turnBack_cylinerIneligible: turnBack_cylinerIneligible,
          };
        } else {
          params = {
            driver: driver,
            license_plate: license_plate,
            from: user_cookies.user.isChildOf,
            cylinders: cylinders,
            type: Constant.SALE_TYPE,
            saler: user_cookies.user.id,
            phoneCustomer: phoneCustomer,
            addressCustomer: addressCustomer,
            nameCustomer: nameCustomer,
            shipper: shipper,
            phoneNumber: phoneNumber,
            idDriver: idDriver,
            signature: sign,
            cylinderImex: cylinderImex,
            idImex: idImex,
            typeImex: typeImex,
            flow: flow,
            cylinerIneligible: cylinerIneligible,
            turnBack_cylinerIneligible: turnBack_cylinerIneligible,
          };
        }
        break;
      case Constant.TURN_BACK_NOT_IN_SYSTEM:
        if (typeForPartner) {
          params = {
            driver: driver,
            license_plate: license_plate,
            from: to_id,
            to: user_cookies.user.id,
            type: Constant.IMPORT_TYPE,
            numberOfCylinder: parseInt(numberOfCylinder),
            typeForPartner: typeForPartner,
            idDriver: idDriver,
            signature: sign,
            cylinderImex: cylinderImex,
            idImex: idImex,
            typeImex: typeImex,
            flow: flow,
            cylinerIneligible: cylinerIneligible,
            turnBack_cylinerIneligible: turnBack_cylinerIneligible,
          };
        }
        break;
      case Constant.EXPORT_TYPE:
        params = {
          driver: driver,
          license_plate: license_plate,
          from: user_cookies.user.id,
          toArray: to_array,
          to: to_id !== "" ? to_id : null,
          cylindersWithoutSerial: parseInt(numberOfCylinder),
          type: Constant.EXPORT_TYPE,
          cylinders: cylinders,
          typeForPartner: typeForPartner,
          numberArray: number_array,
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
        };
        break;
      case Constant.EXPORT_EMPTY_WAREHOUSE:
        params = {
          driver: driver,
          license_plate: license_plate,
          from: user_cookies.user.id,
          idTruck: to_array,
          to: to_id !== "" ? to_id : null,
          cylindersWithoutSerial: parseInt(numberOfCylinder),
          type: Constant.EXPORT_TYPE,
          cylinders: cylinders,
          typeForPartner: typeForPartner,
          numberArray: number_array,
          idDriver: idDriver,
          signature: sign,
          cylinderImex: cylinderImex,
          idImex: idImex,
          typeImex: typeImex,
          flow: flow,
          cylinerIneligible: cylinerIneligible,
          turnBack_cylinerIneligible: turnBack_cylinerIneligible,
          isTruck: true,
        };
        break;
      case Constant.IMPORT_TYPE:
        if (!!typeForPartner) {
          params = {
            driver: driver,
            license_plate: license_plate,
            // "from": to_id,
            from: from_id,
            to: user_cookies.user.id,
            cylindersWithoutSerial: parseInt(numberOfCylinder),
            type: Constant.IMPORT_TYPE,
            cylinders: cylinders,
            typeForPartner: typeForPartner,
            idDriver: idDriver,
            signature: sign,
            cylinderImex: cylinderImex,
            idImex: idImex,
            typeImex: typeImex,
            flow: flow,
            cylinerIneligible: cylinerIneligible,
            turnBack_cylinerIneligible: turnBack_cylinerIneligible,
          };
        }
        break;
    }
    console.log(`${type}::::PARAMS`, params);
    // return;
    await axios
      .post(CREATEHISTORY, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function(response) {
        // console.log("data day ne", response);
        data = response;
        if (data.status == 201 || data.status == 200) {
          showToast("Thành công");
        } else {
          showToast("Thất bại");
        }
        //window.location.reload();
      })
      .catch(function(err) {
        console.log(err);
        data = { data: { message: "Danh sách mã bình chưa chính xác!!!" } };
      });

    return data;
  } else {
    return "Expired Token API";
  }
}

export default createHistoryAPI;
