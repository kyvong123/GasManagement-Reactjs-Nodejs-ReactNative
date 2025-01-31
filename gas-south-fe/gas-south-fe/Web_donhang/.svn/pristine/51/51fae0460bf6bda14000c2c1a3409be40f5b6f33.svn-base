import axios from 'axios';
import { IMPORTCYLINDERDUPLICATE } from 'config';
import getUserCookies from "getUserCookies";

async function importCylinderDuplicate(upload_file, classification, manufacture, category) {
    const user_cookies = await getUserCookies();
    let data
    let params = {
        "listCylinders": upload_file,
        "classification": classification,
        "manufacture": manufacture,
        "category": category
    }
    if (user_cookies) 
    {
        await axios.post(
            IMPORTCYLINDERDUPLICATE, params,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token,
                    //"Content-Type": "multipart/form-data"
                }
            }
        ).then(function (response) {
            console.log("câccacacac",response)
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

export default importCylinderDuplicate;