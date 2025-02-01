import axios from "axios";
import { GET_IDDEVICE } from "config";
import getUserCookies from "getUserCookies";

async function getIdDevice(userType, userRole) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    await axios
      .get(`${GET_IDDEVICE}?userType=${userType}&userRole=${userRole}`, {
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

export default getIdDevice;
