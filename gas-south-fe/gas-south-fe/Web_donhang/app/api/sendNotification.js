import axios from "axios";
import { SENDNOTIFICATION } from "config";
import getUserCookies from "getUserCookies";

async function sendNotification(title, message, device, iddata) {
  let data;
  const user_cookies = await getUserCookies();
  if (user_cookies) {
    let params = {
      title: title,//"Tiêu đề của thông báo"
      data: `Đơn hàng số: ${message}`,//ordercode
      device: device,//player_id
      appname: "Gassouth",
      iddata: iddata,//id Dơn hàng
    };

    await axios
      .post(SENDNOTIFICATION, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function(response) {
        console.log("sendNotification", response);
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

export default sendNotification;
