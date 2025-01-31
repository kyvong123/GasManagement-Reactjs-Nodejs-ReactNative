import axios from "axios";
import { ACCESS_ORDER } from "../js/config/config";
import getUserCookies from "getUserCookies";

async function accessOrder(idOder, userId) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    let params = {
      note: "Điều độ trạm xác nhận hoàn thành",
    };
    await axios
      .put(ACCESS_ORDER + `?id=${idOder}&userid=${userId}`, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then(function (response) {
        //console.log(response);
        data = response;
      })
      .catch(function (err) {
        console.log(err);
        data = err.response;
      });

    return data;
  } else {
    return "Expired Token API";
  }
}

export default accessOrder;
