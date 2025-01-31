import axios from 'axios';
import {EXCELCYLINDERDUPLICATE} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";

async function excelCylinderDuplicate() {


    let data;
    var user_cookies = await getUserCookies();
    if (user_cookies) {
        let url = EXCELCYLINDERDUPLICATE
        await axios.get(
            url,
            // params,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                },
                responseType: 'blob'
            }
        )
            .then(function (response) {
                data = response.data;
                
                const url = window.URL.createObjectURL(new Blob([response.data]));

                const link = document.createElement('a');
                link.href = url;
                //let disposition = response.headers['content-disposition']
                let filename = `Danh_sach_binh_trung.xlsx`;
                link.setAttribute('download', filename); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch(function (err) {
                data = err.response;
            });

        return data;
    } else {
        return "Expired Token API";
    }


}

export default excelCylinderDuplicate;


