import axios from 'axios';
import {GETLISTTRUCKEXCEL} from 'config';
import getUserCookies from 'getUserCookies'

async function getListDriverExcelAPI(id) {
    // console.log("vao get list excel truck");
    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let params = {
            "id": id,
        };
    
        await axios.post(
            GETLISTTRUCKEXCEL, params, {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                    //"Content-Type": "application/json"
                }
                , responseType: 'blob'
            })
                .then(function(response) {
                    //console.log(response);
                    data = response.data;
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    //let disposition = response.headers['content-disposition']
                    let filename = `Danh_sach_xe_${id}_.xlsx`;
                    link.setAttribute('download', filename); //or any other extension
                    document.body.appendChild(link);
                    link.click();
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

export default getListDriverExcelAPI;