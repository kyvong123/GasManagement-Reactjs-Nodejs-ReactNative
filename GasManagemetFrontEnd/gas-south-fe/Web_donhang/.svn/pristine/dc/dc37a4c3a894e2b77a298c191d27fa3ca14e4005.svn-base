import { UPDATE_SYSTEM_MENU } from "config";
import getUserCookies from "getUserCookies";
import axios from "axios";
async function updateSystemMenu(values) {
    console.log("param guiwr ;ene" , values);
    let data;
    let user_cookies = await getUserCookies();
    if (user_cookies) {
    //   let param = {
    //     systemPageMenuIdD:"",
    //     orderNo: "",
    //     pageId:"",
    //     name:"",
    //     url:"",
    //     clas : ""
    //   };
  
      await axios
        .post(UPDATE_SYSTEM_MENU, values, {
          headers: {
            Authorization: "Bearer " + user_cookies.token,
          },
        })
        .then((response) => {
          console.log("update thanh công response", response);
          data = response;
        })
        .catch((errors) => {
          console.log("errors", errors);
          data = errors.response;
        });
      return data;
    } else {
      return "Expired Token API";
    }
  }
  export default updateSystemMenu;