import axios from 'axios';
import { PARTNER } from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";
async function getAllPartner(user_type) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let url = PARTNER
        let uri = ""
        console.log("user_cookies",user_cookies);
        if (user_cookies.user.userType === Constants.FIXER) {
            uri = url + `?isHasYourself=true&parentRoot=${user_cookies.user.parentRoot}&isHasChild=${true}`
        } 
        else {
            if (!!user_type) {
                uri = url + `?isHasYourself=false&parentRoot=${user_cookies.user.parentRoot}&isHasChild=${true}`
            } 
            else {
                uri = url + `?isHasYourself=false&parentRoot=${user_cookies.user.parentRoot}`
            }
        }

        await axios.get(
            uri,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default getAllPartner;