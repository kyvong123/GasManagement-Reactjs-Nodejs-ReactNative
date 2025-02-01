import { useEffect, useState } from "react";
import orderManagement from "../../../api/orderManagementApi";

export const createOrderCustomerFetch = () => {
    const [location, setLocation] = useState({ address: [], area: "" });
    // get address
    useEffect(() => {
        const getLocation = async () => {
            const res = await orderManagement.getLocation();
            if (res) {
                console.log("Dữ liệu khách hàng là: ", res.address);
                setLocation(res);
            }
        };
        getLocation();
    }, []);
    return {
        location, setLocation
    };
};
