import { GETALL_SYSTEMPAGEMENU } from "config";
import getUserCookies from "getUserCookies";
import axios from "axios";
async function getAllMenuSystem(){
    let data;
  var user_cookies = await getUserCookies();
  // console.log("user_cookies"  ,user_cookies);
  if (user_cookies) {
    await axios
      .get(GETALL_SYSTEMPAGEMENU ,{
        headers: {
          Authorization: "Bearer " + user_cookies.token, 
        },
      })
      .then((response) => {
        // console.log("response Menu" , response);
        data = response;
      })
      .catch((errors) => {
        console.log("errors" , errors);
        data = errors.response;
      });
      return data;
  } else {
    return "Expired Token API";
  }
}
export default getAllMenuSystem;