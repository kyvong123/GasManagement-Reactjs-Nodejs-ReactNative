import axios from 'axios';
import {GETALLUSERURL} from 'config';
import getUserCookies from "getUserCookies";

async function updateUserAllowReport(allowReport) {


    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        const params = {
            "allowReport": allowReport,
        };

        let url=GETALLUSERURL+"/"+user_cookies.user.id;
        await axios.put(
            url, params, {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                    // 'Access-Control-Allow-Origin': '*',
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
    }
    else {
        return "Expired Token API";
    }
}

export default updateUserAllowReport;


