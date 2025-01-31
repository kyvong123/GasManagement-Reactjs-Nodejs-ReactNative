// import callApi from "../js/util/apiCaller";
import {GETALL_SYSTEMPAGES} from "config";
import getUserCookies from "getUserCookies";
import axios  from 'axios'

async function getAllSystemPage(){
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        await axios
          .get(GETALL_SYSTEMPAGES ,{
            headers: {
              Authorization: "Bearer " + user_cookies.token,
            },
          })
          .then((response) => {
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
export default getAllSystemPage;