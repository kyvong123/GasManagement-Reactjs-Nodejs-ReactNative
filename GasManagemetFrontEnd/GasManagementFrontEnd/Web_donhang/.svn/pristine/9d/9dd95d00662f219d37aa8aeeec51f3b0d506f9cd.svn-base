import axios from "axios";
import { DELETEORDERTANK } from "config";
import getUserCookies from "getUserCookies";

async function deleteOrderTankTruck(id) {
  let data;
  var user_cookies = await getUserCookies();
  let params = {
    ordertankId: id,
  };
  if (user_cookies) {
    await axios
      .post(DELETEORDERTANK, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then(function(response) {
        data = response;
      })
      .catch(function(err) {
        console.log(err);
        data = err.response;
      });

    return data;
  } else {
    return "Expired Token API";
  }
}

export default deleteOrderTankTruck;
