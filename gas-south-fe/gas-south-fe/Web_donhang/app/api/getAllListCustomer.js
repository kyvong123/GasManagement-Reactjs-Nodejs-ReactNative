import axios from "axios";
import { GET_ALL_LIST_CUSTOMER } from "config";
import getUserCookies from "getUserCookies";

async function getAllListCustomer() {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    let url = GET_ALL_LIST_CUSTOMER;
    await axios
      .get(
        url,
        {
          headers: {
            Authorization: "Bearer " + user_cookies.token,
            /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
          },
        }
      )
      .then(function (response) {
        data = response;
      })
      .catch(function (err) {
        data = err.response;
      });

    return data;
  } else {
    return "Expired Token API";
  }
}

export default getAllListCustomer;
