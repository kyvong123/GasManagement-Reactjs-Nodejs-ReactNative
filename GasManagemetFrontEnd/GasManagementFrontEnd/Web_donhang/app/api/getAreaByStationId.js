import axios from "axios";
import getUserCookies from "getUserCookies";
import { GETAREABYSTATIONID } from "config";

async function getAreaByStationId(paramStationId) {
  let data;
  let user_cookies = await getUserCookies();
  let url = GETAREABYSTATIONID.replace("${StationID}", paramStationId);
  if (user_cookies) {
    await axios
      .get(url, {
        headers: { Authorization: "Bearer " + user_cookies.token },
      })
      .then(function(response) {
        data = response;
      })
      .catch(function(err) {
        data = err;
      });
    return data;
  } else {
    return "Expired Token API";
  }
}
export default getAreaByStationId;
