import axios from "axios";
import { GETSTATISTICEXCEL } from "config";
import getUserCookies from "../js/helpers/getUserCookies";

async function getStatisticExcel(toDate, stationId, areaId, customerType) {
  const url = GETSTATISTICEXCEL;
  
  const user_cookies = await getUserCookies();
  
  if (user_cookies) {
    let params = {
      toDate: toDate,
    };

    if(stationId && stationId !== "") params = {...params, stationId: stationId}
    if(areaId && areaId !== "") params = {...params, areaId: areaId}
    if(customerType && customerType !== "") params = {...params, customerType: customerType };

    const res = await axios.get(url, {
      params: params,
      headers: {
        Authorization: "Bearer " + user_cookies.token,
      },
    });
    return res.data
  } else {
    return "Expired Token API";
  }
}

export default getStatisticExcel;
