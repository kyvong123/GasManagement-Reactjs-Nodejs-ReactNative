import axios from 'axios';
import { GETDETAILEXPORTORDER } from 'config';
import getUserCookies from 'getUserCookies';
import openNotificationWithIcon from "../js/helpers/notification";

async function getDetailExportOrderAPI(orderId) {
    let result = {
        status: false,
        data: {},
        message: '',
    };
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "orderId": orderId           
        };

        await axios.post(
            GETDETAILEXPORTORDER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token,
                "Content-Type": "application/json"
            }
            // , responseType: 'blob'
        })
            .then( response => {
                console.log('GETDETAILEXPORTORDER', response.data); 
                if (response.data.resCode === "SUCCESS-00010") {
                    // openNotificationWithIcon("success","Lấy thông tin xuất hàng thành công")
                    result.status = true
                    result.data = response.data.data
                    // return result
                }
                else {
                    openNotificationWithIcon("error","Lấy thông tin xuất hàng thất bại")
                    // result.status = false
                    result.message = response.data.message
                    // return result
                }
            })
            .catch( error => {
                console.log('error: ', error);
                // result.status = false
                result.message = error
                // return result
                openNotificationWithIcon("error", "Đã có lỗi xảy ra")
            });
        return result
    }
    else {
        // return "Expired Token API";
        // result.status = false
        result.message = "Expired Token API"
        return result
    }
}

export default getDetailExportOrderAPI;