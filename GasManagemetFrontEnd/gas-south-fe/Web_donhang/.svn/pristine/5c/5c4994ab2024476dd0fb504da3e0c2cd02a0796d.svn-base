import { DELETE_SYSTEM_MENU } from "config";
import getUserCookies from "getUserCookies";
import axios from "axios";

async function deleteSystemMenu(id) {
  let data;
  let user_cookies = await getUserCookies();
  if (user_cookies) {
    let param = {
      systemPageMenuId: id,
    };

    await axios
      .post(DELETE_SYSTEM_MENU, param, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
        },
      })
      .then((response) => {
        console.log("response", response);
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
export default deleteSystemMenu;
