import axios from 'axios';
import { IMPORTPRODUCT } from 'config';
import getUserCookies from "getUserCookies";

async function importProductsFromExcelAPI(upload_file, fixerID, ListChildCompany, classification, manufacture) {
    const user_cookies = await getUserCookies();
    let data = new FormData();
        //console.log("some manufacture", manufacture, fixerID, ListChildCompany, classification, upload_file)
        
    data.append('fixerId', fixerID);
    data.append('companyId', ListChildCompany);
    data.append('classification', classification);
    data.append('manufacture', manufacture);
    data.append('upload_file', upload_file);

    // for (var value of data.values()) {
    //     console.log("9999", value); 
    // }

    //console.log("import excelelel", data);
    if (user_cookies) {
        await axios.post(
            IMPORTPRODUCT, data,
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
        console.log("hello111");
        return "Expired Token API";
    }
}

export default importProductsFromExcelAPI;


