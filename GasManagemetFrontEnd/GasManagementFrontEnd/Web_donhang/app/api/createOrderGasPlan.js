import Axios from "axios";
import { CREATEORDERGASPLAN } from "../js/config/config";
import getUserCookies from "../js/helpers/getUserCookies"


const createOrderGasPlan = async (body) => {
    const user_cookies = await getUserCookies();

    if (user_cookies) {
        try {
            const res = await Axios.post(CREATEORDERGASPLAN, body, {
                headers: {
                    Authorization: "Bearer " + user_cookies.token,
                },
            });
            return res.data
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        return "Expired Token API";
    }
}

export default createOrderGasPlan;