import axios from 'axios';
import { CREATE_CARRIER } from 'config';
import getUserCookies from "getUserCookies";

async function createCarrierAPI(email, password, address, phone, code, name, driverNumber, avatar) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "email": email,
            "password": password,
            "address": address,
            "phone": phone,
            "userType": user_cookies.user.userType,
            "userRole": user_cookies.user.userRole,
            "code": code,
            "name": name,
            "driverNumber": driverNumber,
            "avatar" : avatar,
            "userId" : user_cookies.user.id,
            "createBy": user_cookies.user.id,
        };
        console.log(params)
        await axios.post(
            CREATE_CARRIER, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                console.log(err)
                data = err.response;
            });
        return data;
    } else {
        return "Expired Token API";
    }
}
export default createCarrierAPI;


