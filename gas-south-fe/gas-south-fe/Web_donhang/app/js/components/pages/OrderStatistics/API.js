import axiosClient from "../../../../api/axiosClient";
import getUserCookies from "../../../../js/helpers/getUserCookies";
class Api {
    getListManufacture = async () => {
        let data
        var user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                data = await axiosClient.get(`/manufacture/ShowList`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (e) {
                console.log(e);
            }
            return data.data;
        } else {
            return "Invalid Token API";
        }
    };
    getStatistic = async (params) => {
        let data
        var user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                data = await axiosClient.get(`/history/findStatic?type=${params.type}&status=${params.status}&manufactureID=${params.id}&From=${params.from}&To=${params.to}`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (e) {
                console.log(e);
            }
            return data;
        } else {
            return "Invalid Token API";
        }
    }
    getStatisticMass = async (params, mass) => {
        let data
        var user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                data = await axiosClient.get(`/history/findStatic?type=${params.type}&status=${params.status}&manufactureID=${params.id}&From=${params.from}&To=${params.to}&mass=${mass}`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (e) {
                console.log(e);
            }
            return data;
        } else {
            return "Invalid Token API";
        }
    }
}
const api = new Api();
export default api;