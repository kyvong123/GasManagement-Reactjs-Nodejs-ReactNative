import axios from "axios";
import { GET_CUSTOMER_BY_GAS_BY_CODE } from "config";
import getUserCookies from "getUserCookies";

async function getCustomerByCode(code) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    let params = {
      CustomerGasCode: code,
    };

    await axios
      .post(GET_CUSTOMER_BY_GAS_BY_CODE, params, {
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

export default getCustomerByCode;
