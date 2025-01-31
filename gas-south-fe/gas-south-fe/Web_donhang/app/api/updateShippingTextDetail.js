import axios from 'axios';
import { UPDATESHIPPINGTEXTDETAIL } from 'config';
import getUserCookies from "getUserCookies";
import showToast from "showToast";
async function updateShippingTextDetail(checkTurnback,shippingorderId,listUpdateShipping) {
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "isTurnback":checkTurnback,
            "shippingorderId": shippingorderId,
            "ShippingTextDetail": listUpdateShipping   
            
        };


        await axios.post(
            UPDATESHIPPINGTEXTDETAIL, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                data = response;
                console.log(data);
                if (data.data.success === true){
                    showToast("Cập nhật thành công")
                    //window.location.reload();
                }
                else {
                    showToast("Cập nhật thất bại do chưa chọn bình hồi lưu")
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

export default updateShippingTextDetail;


