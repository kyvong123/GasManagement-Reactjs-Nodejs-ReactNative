import axios from 'axios';
import { IMPORTPRODUCTSUBSIDIARY } from 'config';
import getUserCookies from "getUserCookies";

async function importCylinderBySubsidiaryAPI(upload_file, classification, manufacture, category) {
    const user_cookies = await getUserCookies();
    let data = new FormData();
    
    data.append('classification', classification);
    data.append('manufacture', manufacture);
    data.append('category',category)
    // data.append('assetType', assetType);
    // data.append('rentalPartner', rentalPartner);
    data.append('upload_file', upload_file);

    console.log("bbbbbbbb",data);
    if (user_cookies) {
        await axios.post(
            IMPORTPRODUCTSUBSIDIARY, data,
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

export default importCylinderBySubsidiaryAPI;