import axios from "axios";
import { GETALLUSERSYSTEM } from "config";
import getUserCookies from "getUserCookies";

async function getAllUserSystem() {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    await axios
      .get(GETALLUSERSYSTEM ,{
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then((response) => {
        console.log("response" , response);
        data = response;
      })
      .catch((errors) => {
        console.log("errors" , errors);
        data = err.response;
      });
      return data;
  } else {
    return "Expired Token API";
  }
}
export default  getAllUserSystem ;
