import axios from 'axios';
import {GETHISTORYIMPORTURL, GETHISTORYIMPORTURLUPDATEFOREXPORT, GETHISTORYIMPORTURLUPDATEFOREXPORTFORSALE} from 'config';
import getUserCookies from 'getUserCookies'

async function getHistoryImportAPI(to_or_from, page) {

    let data;
    var user_cookies = await getUserCookies();
    
    if (user_cookies) {
        
        let url = GETHISTORYIMPORTURL.replace("$to_or_from", to_or_from).replace("$id_user", user_cookies.user.id)

        if (to_or_from === "from")
        {
            if (user_cookies.user.userType === "Agency" && user_cookies.user.userRole !== "SuperAdmin")
            {
                if (user_cookies.user.userType === "Agency" && user_cookies.user.userRole !== "Owner")
                {
                    // Đây là đại lý ntn ???
                    url = GETHISTORYIMPORTURLUPDATEFOREXPORTFORSALE.replace("$to_or_from", to_or_from).replace("$id_user", user_cookies.user.isChildOf).replace("$id_saler", user_cookies.user.id)
                }
                else {
                    // Đại lý trực thuộc
                    url = GETHISTORYIMPORTURLUPDATEFOREXPORT.replace("$to_or_from", to_or_from).replace("$id_user", user_cookies.user.isChildOf)
                }
            }
            else {
                // Các tài khoản khác không phải đại lý
                url = GETHISTORYIMPORTURLUPDATEFOREXPORT.replace("$to_or_from", to_or_from).replace("$id_user", user_cookies.user.id)
            }
        }
        
        await axios.get(
          url,
            {
                headers: {
                    "Authorization" : "Bearer " + user_cookies.token
                    /*"Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTY4NjcyNDliYzY2OTZlY2VlNzMwZSIsInB3aCI6NzQ4NDYyMjc2LCJpYXQiOjE1NDE4Mzc1MzUsImV4cCI6MTU0MTkyMzkzNX0.gkD_Ym2uk17YcQydIuQ8q0Vm5a8SmF1KygrdnVX-4l0'*/
                }
            }
        )
            .then(function (response) {
                data = response;
            })
            .catch(function (err) {
                data = err.response;
            });
        return data;
    }
    else {
        return "Expired Token API";
    }
}

export default getHistoryImportAPI;