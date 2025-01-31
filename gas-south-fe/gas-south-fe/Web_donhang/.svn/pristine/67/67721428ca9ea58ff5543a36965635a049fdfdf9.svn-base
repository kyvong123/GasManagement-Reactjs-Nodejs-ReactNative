import axios from 'axios';
import {GETALLSUPPORT} from 'config';
import getUserCookies from 'getUserCookies';

async function getAllSupport(){
    let data;
    var user_cookies = await getUserCookies();

    if(user_cookies){
       await axios.get(GETALLSUPPORT,{
           headers:{
            Authorization: "Bearer " + user_cookies.token,
           },
        })
        .then((response)=>{
            data = response
        })
        .catch((error)=>{
            
            data = error.response;
        });
        return data;
    }else{
        return "Expired Token API";
    }
}

export default getAllSupport