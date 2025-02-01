import axios from "axios";
import getUserCookies from "getUserCookies";
import { GET_IMPORT_EXPORT_ORDER_TANK_TRUCK } from "config";

async function getImportExportOrderTankTruck(fromDate, toDate) {
  let data;
  var user_cookies = await getUserCookies();

  if (user_cookies) {
    let url = GET_IMPORT_EXPORT_ORDER_TANK_TRUCK;
    let params = {
      "fromDate": fromDate,
      "toDate": toDate,
    };
    await axios
      .post(url, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then(function(response) {
        data = response;
      })
      .catch(function(err) {
        data = err.response;
      });

    return data;
  } else {
    return "Expired Token API";
  }
}

export default getImportExportOrderTankTruck;
