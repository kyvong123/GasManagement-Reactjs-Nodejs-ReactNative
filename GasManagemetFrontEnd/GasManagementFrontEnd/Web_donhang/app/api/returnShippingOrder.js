import axios from 'axios';
import { RETURNSHIPPINGORDER } from 'config';
import getUserCookies from "getUserCookies";
import showToast from "showToast";
async function returnShippingOrder(userId, shippingOrderId, cylinders) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "userId": userId,
            "shippingOrderId": shippingOrderId,
            "cylinders": cylinders,
            
        };


        await axios.post(
            RETURNSHIPPINGORDER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                data = response;
                //console.log(response);
                if (data.status == 200){
                    showToast(data.data.message)
                    // window.location.reload();
                }
                else {
                    showToast("Hồi lưu thất bại")
                }
                
                
              
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

export default returnShippingOrder;


