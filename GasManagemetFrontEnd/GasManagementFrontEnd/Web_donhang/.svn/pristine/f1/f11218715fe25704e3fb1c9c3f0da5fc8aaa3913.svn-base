import axios from 'axios';
import { IMPORTCYLINDERBYEXCEL } from 'config';
import getUserCookies from "getUserCookies";

async function sendReqCreFromExcelAPI(upload_file, id_ReqTo, classification, manufacture) {
    const user_cookies = await getUserCookies();
    let data = new FormData();

    console.log("some manufacture", manufacture, id_ReqTo, classification, upload_file);
    
    data.append('id_ReqTo', id_ReqTo);
    data.append('classification', classification);
    data.append('manufacture', manufacture);
    data.append('upload_file', upload_file);

    console.log("import excelelel", data);
    if (user_cookies) {
        await axios.post(
            IMPORTCYLINDERBYEXCEL, data,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                    //"Content-Type": "multipart/form-data"
                }
            }
        ).then(function (response) {

            data = response;
        }).catch(function (err) {
            console.log("tester", err);
            data = err.response;
        });
        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default sendReqCreFromExcelAPI;


