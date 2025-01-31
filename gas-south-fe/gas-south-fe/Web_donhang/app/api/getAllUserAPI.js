import axios from 'axios';
import {GETALLUSERURL,GETDESTINATIONURL} from 'config';
import getUserCookies from 'getUserCookies'
import Constant from 'Constants'

async function getAllUserAPI(type) {

    let data;
    let url=''
    var user_cookies = await getUserCookies();
    if(user_cookies.user.userType==='SuperAdmin')
    {
        url=GETALLUSERURL;
        if(type === Constant.FACTORY)
        {
            url+="/?where={\"userType\":\"Factory\"}";
            console.log(url);
        }
        else if(type === Constant.GENERAL)
        {
            url+="/?where={\"userType\":\"General\"}";
            console.log(url);
        }
        else if(type === Constant.AGENCY)
        {
            url+="/?where={\"userType\":\"Agency\"}";
            console.log(url);
        }
        else if(type === Constant.STATION)
        {
            url+="/?where={\"userType\":\"Station\"}";
            console.log(url);
        }
    }
    else{
        url=GETDESTINATIONURL;
        if(type === Constant.FACTORY)
        {
            url+="/?user_type=Factory";
            console.log(url);
        }
        else if(type === Constant.GENERAL)
        {
          url+="/?user_type=General";
          console.log(url);
        }
        else if(type === Constant.AGENCY)
        {
          url+="/?user_type=Agency";
          console.log(url);
        }
        else if(type === Constant.STATION)
        {
          url+="/?user_type=Station";
          console.log(url);
        }
    }
    

    if (user_cookies) {
        await axios.get(
            url,
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

export default getAllUserAPI;


