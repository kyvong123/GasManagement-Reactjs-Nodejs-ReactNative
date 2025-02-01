import axios from "axios";
import getUserCookies from "getUserCookies";
import { GETFILTERAPI } from "config";
async function getAllOrderByCustomerId(startDay, endDay, customerId) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    let url = GETFILTERAPI.replace("${startDay}", startDay)
      .replace("${endDay}", endDay)
      .replace("${customerId}", customerId);
    await axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then(function(response) {
        data = response.data;
      })
      .catch(function(error) {
        data = error;
      });
    return data;
  } else {
    return "Expired Token API";
  }
}

export default getAllOrderByCustomerId;
