import axios from "axios";
import { GET_STATISTICSELL } from "../js/config/config";
import getUserCookies from "getUserCookies";

async function getAllStatisticSell(
  startDate,
  endDate,
  customerRole,
  customerType,
  stationId,
  customerId
) {
  let data;
  var user_cookies = await getUserCookies();

  let params = {};

  if (startDate) params = { ...params, fromDate: startDate };
  if (endDate) params = { ...params, toDate: endDate };
  if (customerRole) params = { ...params, customerRole };
  if (customerType) params = { ...params, customerType };
  if (stationId) params = { ...params, stationId };
  if (customerId) params = { ...params, customerId };

  if (user_cookies) {
    await axios
      .get(
        GET_STATISTICSELL,
        //+ `?fromDate=${startDate}&toDate=${endDate}&customerRole=${customerRole}&customerType=${customerType}&stationId=${stationId}&customerId=${customerId}`,
        {
          headers: {
            Authorization: "Bearer " + user_cookies.token,
          },
          params: params
        }
      )
      .then((response) => {
        data = response;
      })
      .catch((error) => {
        data = error.response;
      });
    return data;
  } else {
    return "Expired Token API";
  }
}

export default getAllStatisticSell;
