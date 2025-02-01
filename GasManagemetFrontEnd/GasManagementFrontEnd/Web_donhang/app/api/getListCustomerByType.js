import axios from "axios";
import { GET_LIST_CUSTOMER_BY_TYPE } from "config";
import getUserCookies from "getUserCookies";

async function getListCustomerByType(id,customerType) {
  // GỌi khách hàng công nghiệp customerType = "Industry"
  // GỌi khách hàng phân phối customerType = "Distribution"

  let data;
  var user_cookies = await getUserCookies();
  if (user_cookies) {
    let url = GET_LIST_CUSTOMER_BY_TYPE.replace("$id", id).replace("$type", customerType);
    console.log("Cyan URL", url);
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

export default getListCustomerByType;
