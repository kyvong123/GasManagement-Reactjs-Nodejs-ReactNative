import axios from 'axios';
import {EXPORT_REPORT_BY_TARGET_AND_DATETIME} from 'config';
import getUserCookies from 'getUserCookies'
import Constants from "Constants";

async function getReportExcelByTargetAndDateTimeAPI(target_ids,action_type, start_date, end_date) {


    let data;
    var user_cookies = await getUserCookies();
    try {
        end_date = end_date.toDate();
        start_date = start_date.toDate();
        end_date = (new Date(end_date.setHours(23, 59, 59, 999))).toISOString();
        start_date = (new Date(start_date.setHours(0, 0, 0, 0))).toISOString();
    }
    catch (error) {
        console.log(error)
    }
    if (user_cookies) {
        let url = EXPORT_REPORT_BY_TARGET_AND_DATETIME
        const params = {
            target_ids: !!target_ids ? target_ids : [user_cookies.user.id],
            action_type,
            start_date,
            end_date,
            parent_root:!!user_cookies.user.parentRoot?user_cookies.user.parentRoot:user_cookies.user.id
        }
        console.log('paramsnow',params);
        //console.log("user_cookies",user_cookies);
        await axios.post(
            url,
            params,
            {
                headers: {
                    "Authorization": "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
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
                let filename = `Bao_Cao_${action_type}_${end_date}.xlsx`;
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

export default getReportExcelByTargetAndDateTimeAPI;


