import axios from "axios";
import { ADDUSERURL } from "config";
import getUserCookies from "getUserCookies";

async function addUserAPI(
  child,
  email,
  name,
  address,
  password = "A123!@#",
  userType,
  userRole = "SuperAdmin",
  owner = null,
  code,
  lat,
  lng,
  phone,
  prefix,
  customerType
) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    if (password === "") {
      password = "A123!@#";
    }
    let params = {
      email: email,
      name: name,

      address: address,
      password: password,
      userType: userType,
      userRole: userRole === "" ? "SuperAdmin" : userRole,
      owner: owner === false ? null : owner,
      isChildOf: child,
      code: code,
      lat: lat,
      lng: lng,
      prefix: prefix,
      phone: phone,
      customerType: customerType,
    };
    console.log(params);
    await axios
      .post(ADDUSERURL, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function(response) {
        //console.log(response);
        data = response;
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

export default addUserAPI;
