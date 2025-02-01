import axios from 'axios';
import {DELETEUSERSYSTEM} from 'config';
import getUserCookies from "getUserCookies";

async function deleteUserSystemAPI(id)  {
    let data;
    var user_cookies=await getUserCookies();
    
    if(user_cookies) {
        const params = {
            "systemUserId":id,
            "deletedBy": user_cookies.user.id
        }

        // console.log("params" , params);
    await axios.post(
        DELETEUSERSYSTEM, params, {
            headers: {
                "Authorization" : "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function(response) {
               console.log(response);
                data = response;
                // window.location.reload();
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

export default deleteUserSystemAPI;
