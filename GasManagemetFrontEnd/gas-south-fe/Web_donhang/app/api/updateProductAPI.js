import axios from "axios";
import { UPDATEPRODUCT } from "config";
import getUserCookies from "getUserCookies";

async function updateProductAPI(
  serial,
  color,
  checkedDate,
  weight,
  // placeStatus,
  status,
  category,
  productId,
  //currentImportPrice,
  manufacture,
  selectedFile,
  valve,
  classification,
  productionDate,
  embossLetters
) {
  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    const params = {
      cylinder_id: productId,
      factory:
        user_cookies.user.userType === "Factory" ? user_cookies.user.id : "",
      //"general": generalId,
      //"agency": agencyId,
      img_url: selectedFile,
      color: color,
      checked_date: checkedDate,
      weight: weight,
      status: status,
      category: category,
      track: [],
      circleCount: 0,
      //"currentImportPrice":currentImportPrice,
      //price: currentImportPrice,
      manufacture: manufacture,
      valve: valve,
      classification: classification,
      productionDate: productionDate,
      embossLetters: embossLetters
    };
    // console.log(params);
    let url = UPDATEPRODUCT;
    await axios
      .post(url, params, {
        headers: {
          Authorization: "Bearer " + user_cookies.token,
          // 'Access-Control-Allow-Origin': '*',
          /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
        },
      })
      .then(function (response) {
        //console.log(response);
        data = response;
      })
      .catch(function (err) {
        console.log(err);
        data = err.response;
      });

    return data;
  }
  else {
    return "Expired Token API";
  }
}

export default updateProductAPI;
