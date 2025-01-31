import axios from "axios";
import {ADDUSERSYSTEM} from "config";
import getUserCookies from "getUserCookies";

async function addUserSystem(){
    
    let data;
    var user_cookies = await getUserCookies();
    if(user_cookies){
        let params = {
            "username": "",
            "status": 1,
            "fullname": "",
            "birthday": "",
            "address": "",
            "mobile": "",
            "email": "a",
            "sex": 2,
            "userTypeId": "",
            "profileimage": ""
        }
    }

}
export default addUserSystem;