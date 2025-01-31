import axios from 'axios';
import { UPDATEUSERURL } from 'config';
import getUserCookies from "getUserCookies";

async function updateUserAPI(target_id, name, address, new_password = "", /*phone,*/ LAT, LNG, codebranch, prefix) {


    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {};
        if (new_password === "") {
            params = {
                "target_id": target_id,
                "name": name,
                "address": address,
                //"phone": phone,
                "LAT": LAT,
                "LNG": LNG,
                "code": codebranch,
                "prefix": prefix
            };
        } else {
            params = {
                "target_id": target_id,
                "name": name,
                "address": address,
                "new_password": new_password,
                //"phone": phone,
                "LAT": LAT,
                "LNG": LNG,
                "code": codebranch,
                "prefix": prefix
            };
        }

        console.log(params);
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


