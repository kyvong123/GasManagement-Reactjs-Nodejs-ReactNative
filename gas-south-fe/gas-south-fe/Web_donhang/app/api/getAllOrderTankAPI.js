import { GETALLORDERTANK } from "config";
import getUserCookies from "getUserCookies";
import axios from "axios";
async function getAllOrderTank() {
  let data;
  var user_cookies = await getUserCookies();
  // console.log(user_cookies);
  // console.log("user_cookies"  ,user_cookies);
  if (user_cookies) {
    await axios
      .get(GETALLORDERTANK, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then((response) => {
        data = response;
      })
      .catch((errors) => {
        data = errors.response;
      });
    return data;
  } else {
    return "Expired Token API";
  }
}
export default getAllOrderTank;
