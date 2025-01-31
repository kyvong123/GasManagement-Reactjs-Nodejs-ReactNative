import axios from "axios";
import { GETSHIPPINGORDER } from "config";
import showToast from "showToast";
import getUserCookies from "getUserCookies";
async function getShippingOrder(id) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    const params = {
        shippingorderId: id
    };

    await axios
      .post(GETSHIPPINGORDER, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function (response) {
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

export default getShippingOrder;
