import axios from 'axios';
import { UPDATEDRIVERSHIPPINGORDER } from 'config';
import getUserCookies from "getUserCookies";
import showToast from "showToast";
async function updateShippingOrder(shippingorderId,status) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "shippingorderId":shippingorderId,
            "status": status,  
            
        };


        await axios.post(
            UPDATEDRIVERSHIPPINGORDER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                data = response;
                console.log("data1",data);
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

export default updateShippingOrder;


