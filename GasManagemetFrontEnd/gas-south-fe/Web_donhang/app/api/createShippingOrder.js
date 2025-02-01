import axios from 'axios';
import { CREATESHIPPINGORDER } from 'config';
import getUserCookies from "getUserCookies";
import openNotificationWithIcon from "../../app/js/helpers/notification";
import showToast from "showToast";
async function createShippingOrder(
    ShippingOrder, ShippingOrderDetail, ShippingCustomerDetail, ShippingTextDetail
    
    ) {


    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "ShippingOrder" : ShippingOrder,
            "ShippingOrderDetail" : ShippingOrderDetail,
            "ShippingCustomerDetail" : ShippingCustomerDetail,
            "ShippingTextDetail" : ShippingTextDetail,
                  
            
        };

        await axios.post(
            CREATESHIPPINGORDER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                console.log("CREATESHIPPINGORDER",response);
                data = response;
                if(data.data.success === true ){
                    openNotificationWithIcon('success', 'Xuất đơn hàng thành công')
                    // window.location.reload(); 
                }
                else {
                    // showToast("Tạo đơn hàng thất bại",data.data.message)
                    openNotificationWithIcon('error', 'Xuất đơn hàng thất bại')
                }
                              
            })
            .catch(function (err) {
                // console.log(err);
                // showToast("Tạo đơn hàng thất bại")
                openNotificationWithIcon('error', 'Gặp lỗi!!!')
            });


        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default createShippingOrder;


