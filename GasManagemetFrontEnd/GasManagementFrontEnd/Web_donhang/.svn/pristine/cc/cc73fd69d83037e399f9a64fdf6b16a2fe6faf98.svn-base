import axios from "axios";
import { GETALLUSERDELETED } from "config";
import getUserCookies from "getUserCookies";
async function getAllUserDeleted() {
    let data;
    var user_cookies = await getUserCookies();
    // console.log("assec token" , user_cookies);
    if (user_cookies) {
   
      await axios
        .post( GETALLUSERDELETED, {
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
  export default  getAllUserDeleted ;
  
