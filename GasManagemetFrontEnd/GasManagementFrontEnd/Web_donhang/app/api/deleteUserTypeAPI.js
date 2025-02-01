import axios from 'axios';
import {DELETE_USERTYPE} from 'config';
import getUserCookies from "getUserCookies";

async function deleteUserType(id)  {
    let data;
    var user_cookies=await getUserCookies();

    if(user_cookies) {
        // let url = DELETE_USERTYPE.replace("$usertypeId",id);
        // console.log(url)
        const params = {
            "usertypeId": id}
    await axios.post(
        DELETE_USERTYPE, params, {
            headers: {
                "Authorization" : "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function(response) {
               //console.log(response);
                data = response;
            })
            .catch(function(err) {console.log(err);
                data = err.response;
            });

        return data;
    }
    else {
        return "Expired Token API";
    }
}
export default deleteUserType;


