import axios from "axios";
import { ADDPRODUCTTYPEURL } from "config";
import showToast from "showToast";
import getUserCookies from "getUserCookies";
async function addProductTypeAPI(typeCode, typeName, mass) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    const params = {
      code: typeCode,
      name: typeName,
      userId: user_cookies.user.id,
      mass: mass
    };

    await axios
      .post(ADDPRODUCTTYPEURL, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function(response) {
        data = response;
        console.clear();
        console.log(data);
        if (data.data.status === false) {
          showToast(data.data.message);
        } else {
          showToast(data.data.message);
        }
      })
      .catch(function(err) {
        console.log(err);
        data = err.response;
      });

    return data;
  } else {
    return "Expired Token API";
  }
}

export default addProductTypeAPI;
