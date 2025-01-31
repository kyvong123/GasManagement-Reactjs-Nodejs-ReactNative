import axios from "axios";
import { DELETEORDERDETAILITEM } from "config";
import getUserCookies from "getUserCookies";

async function deleteOrderDetailItem(itemId, userID) {
  let data;
  var user_cookie = await getUserCookies();
  if (user_cookie) {
    let url = DELETEORDERDETAILITEM.replace("${itemId}", itemId).replace(
      "${userId}",
      userID
    );
    await axios
      .delete(url, {
        headers: { Authorization: "Bearer " + user_cookie.token },
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

export default deleteOrderDetailItem;
