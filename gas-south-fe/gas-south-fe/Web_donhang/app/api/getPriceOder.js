import { GET_PRICE_ORDER } from "../js/config/config";
import getUserCookies from "getUserCookies";
import axios from "axios";

async function getPriceOder(deliverydate, customer, cylinderType) {
  console.log("date", deliverydate);
  console.log("custommer", customer);
  let data;
  var user_cookies = await getUserCookies();

  if (user_cookies) {
    let url =
      GET_PRICE_ORDER +
      `?deliverydate=${deliverydate}&customer=${customer}&cylinderType=${cylinderType}
      `;
    await axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then(function (response) {
        data = response;
      })
      .catch(function (err) {
        data = err.response;
      });
    return data;
  } else {
    return "Expired Token API";
  }
}

export default getPriceOder;
