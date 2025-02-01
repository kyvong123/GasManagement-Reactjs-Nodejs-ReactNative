import axiosClient from "./axiosClient";
import getUserCookies from "getUserCookies";
class PriceManagement {
    getAll = async () => {
        let data;
        var user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                let url = `/typepricedetail/getTypePrice`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });

            } catch (e) {
                console.log(e);
            }
            return data;
        } else {
            return "Invalid Token API";
        }
    };
    getCustomerByCode = async (code, name) => {
        let data;
        var user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                let url = `/orderGS/getCustomerByCode?code=${code}&name=${name}`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });

            } catch (e) {
                console.log(e);
            }
            return data;
        } else {
            return "Invalid Token API";
        }
    };

    getPriceDetail = async (id) => {
        let data;
        var user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                data = await axiosClient.get(`/typepricedetail/getTypePriceDetail?typePriceId=${id}`, {
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
    getCustomer = async (id, type) => {
        let data;
        var user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                data = await axiosClient.get(`/orderGS/getTypeCustomers3?isChildOf=${id}&customerType=${type}`, {
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
const priceManagement = new PriceManagement();

export default priceManagement;