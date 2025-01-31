import axios from "axios";
import { CREATERETURNCYLINDERS } from "config";
import getUserCookies from "getUserCookies";

async function createHistoryReturn(actionType,driver,idDriver,license_plate,cylinder,reason) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    let params = {
        actionType:actionType,
        driver:driver,
        idDriver:idDriver,
        license_plate:license_plate,
        reason,
        cylinders:cylinder,
        signature: ""
    };
    await axios
      .post(CREATERETURNCYLINDERS, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function(response) {
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
export default createHistoryReturn;
