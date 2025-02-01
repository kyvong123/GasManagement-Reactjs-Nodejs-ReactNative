import axiosClient from "./axiosClient";
import getUserCookies from "../js/helpers/getUserCookies";
class PriceManagement {
    getManufacture = async () => {
        let data;
        let user_cookies = await getUserCookies();
        if (user_cookies) {
            try {
                let url = "manufacture/ShowList";
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
            } catch (error) {
                console.log(error);
            }
            return data;
        } else {
            console.log("invalid token API");
        }
    };
    getStation = async () => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = "/orderGS/getStation";
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid token API");
            }
        } catch (error) {
            console.log(error);
        }
    };
    // get area
    getArea = async (params) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `area?StationID=${params}`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid token API");
            }
        } catch (error) {
            console.log(error);
        }
    };
    getCategoryCylinder = async () => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `/categoryCylinder/getAll`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid token API");
            }
        } catch (error) {
            console.log(error);
        }
    };
    getCustomer = async (id, type) => {
        try {
            let data;
            let params

            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = "/orderGS/getTypeCustomers3";
                data = await axiosClient.get(`/orderGS/getTypeCustomers3?isChildOf=${id}&customerType=${type}`, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid Token API");
            }
        } catch (e) {
            console.log(e);
        }
    }
    getNameCustomer = async (id, type) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `/orderGS/getTypeCustomers3s?isChildOf=${id}&customerType=${type}`;
                data = await axiosClient.get(url, {
                    params,
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                console.log(data);
                return data;
            } else {
                console.log("Invalid Token API");
            }

        } catch (error) {
            console.log("Error");
        }
    }
    CreatePrice = async (body) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            console.log(body);

            if (user_cookies) {
                let url = `/typepricedetail/createtypepricedetail`;
                data = await axiosClient.post(url, body, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                console.log(data);
                return data;
            } else {
                console.log("Invalid Token API");
            }

        } catch (e) {
            console.log(e);
        }
    }
    getCustomerByStationID = async (id) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `/orderGS/getCustomerByStationID?stationID=${id}`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                console.log(id);
                return data;
            } else {
                console.log("Invalid Token API");
            }

        } catch (error) {
            console.log(error);
        }
    }
    getAllPrice = async () => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `/typepricedetail/getTypePriceDetail`;
                data = await axiosClient.get(url, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid Token API");
            }
        } catch (error) {
            console.log(error);
        }
    }
    updatePriceDetail = async (body) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `/typepricedetail/updateDetail`;
                data = await axiosClient.post(url, body, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid Token API");
            }
        } catch (error) {
            console.log(error);
        }
    }
    createPriceByExcel = async (body) => {
        try {
            let data;
            let user_cookies = await getUserCookies();
            if (user_cookies) {
                let url = `/typepricedetail/createPriceDetailExcel`;
                data = await axiosClient.post(url, body, {
                    headers: { Authorization: "Bearer " + user_cookies.token },
                });
                return data;
            } else {
                console.log("Invalid Token API");
            }
        } catch (error) {
            console.log(error);
        }
    }

}

const priceManagement = new PriceManagement();
export default priceManagement;
