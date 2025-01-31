import axios from 'axios';
import { UPDATEUSERURL } from 'config';
import getUserCookies from "getUserCookies";

async function updateUserAPI(target_id, name, address, new_password = "", /*phone,*/ LAT, LNG, code, codeother, prefix, group, personRole, userType, customerType, phone) {


    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {};
        const other = (user_cookies.user.userType === 'Personnel' && user_cookies.user.userRole === 'SuperAdmin') ? { "codetax": codeother } :
            { "codebranch": codeother }
        if (new_password === "") {
            params = {
                "target_id": target_id,
                "name": name,
                "address": address,
                "phone": phone,
                "LAT": LAT,
                "LNG": LNG,
                "code": code,
                "prefix": prefix,
                "group": group,
                "personRole": personRole,
                "userType": userType,
                "customerType": customerType,
                ...other
            };
        } else {
            params = {
                "target_id": target_id,
                "name": name,
                "address": address,
                "new_password": new_password,
                "phone": phone,
                "LAT": LAT,
                "LNG": LNG,
                "code": code,
                "prefix": prefix,
                "group": group,
                "personRole": personRole,
                "userType": userType,
                "customerType": customerType,
                ...other
            };
        }

        // console.log('Param::::', params);
        await axios.post(
            UPDATEUSERURL, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
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
    } else {
        return "Expired Token API";
    }
}

export default updateUserAPI;


