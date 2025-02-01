import axios from 'axios';
import { GETLISTBRANCH } from 'config';
import getUserCookies from 'getUserCookies';

async function getListBranchAPI(id) {
    // console.log("vao get list branch API");
    let data;
    var user_cookies = await getUserCookies();
    //console.log(user_cookies);
    //console.log(id);
    if (user_cookies) {
        //console.log("vao user_cookies");
        const params = { 
            reqListBranch: {
                "id": id
            }
        };
        // console.log(params);
        await axios.post(
            GETLISTBRANCH, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
                // console.log(response);
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

export default getListBranchAPI;