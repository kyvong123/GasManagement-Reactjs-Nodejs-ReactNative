import axios from "axios";
import { UPDATE_ORDER_TANK_TRUCK } from "config";
import getUserCookies from "getUserCookies";

async function updateOrderTankTruck(
  ordertankId,
  orderCode,
  customergasId,
  userId,
  warehouseId,
  quantity,
  divernumber,
  typeproduct,
  fromdeliveryDate,
  todeliveryDate,
  deliveryHours,
  status,
  reminderschedule,
  note,
  image,
  imagechange
) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    let params = {
      ordertankId: ordertankId,
      orderCode: orderCode,
      customergasId: customergasId,
      userId: userId,
      warehouseId: warehouseId,
      quantity: quantity,
      divernumber: divernumber,
      typeproduct: typeproduct,
      fromdeliveryDate: fromdeliveryDate,
      todeliveryDate: todeliveryDate,
      deliveryHours: deliveryHours,
      status: status,
      reminderschedule: reminderschedule,
      note: note,
      image: image,
      imagechange: imagechange,
    };
    console.clear();
    console.log(params);
    await axios
      .post(UPDATE_ORDER_TANK_TRUCK, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function(response) {
        console.log(response);
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

export default updateOrderTankTruck;
