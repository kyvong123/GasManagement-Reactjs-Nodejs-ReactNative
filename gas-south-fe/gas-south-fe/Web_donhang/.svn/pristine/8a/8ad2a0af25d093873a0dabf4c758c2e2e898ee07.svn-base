import axios from 'axios';
import {DELETEUSER} from 'config';
import getUserCookies from "getUserCookies";

async function deleteUserAPI(id)  {


    let data;
    var user_cookies=await getUserCookies();
    if(user_cookies) {

        let url = DELETEUSER.replace("$user_id",id);

    await axios.delete(
        url, {
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

export default deleteUserAPI;


