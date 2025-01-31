import axios from 'axios';
import { CREATE_SYSTEMUSERTYPEPAGE } from 'config';
import getUserCookies from "getUserCookies";

async function createSystemUserTypePage(userTypeId, pageId, parentId) {

    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "userTypeId" : userTypeId, 
            "pageId" : pageId, 
            "parentId" : parentId, 
        };
        await axios.post(
            CREATE_SYSTEMUSERTYPEPAGE, params, {
            headers: {
                "Authorization": "Bearer " + user_cookies.token
                /*"Authorization" : "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
            }
        })
            .then(function (response) {
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

export default createSystemUserTypePage;


