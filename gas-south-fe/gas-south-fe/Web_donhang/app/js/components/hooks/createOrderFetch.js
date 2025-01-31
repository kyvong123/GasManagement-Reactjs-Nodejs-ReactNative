import { useEffect, useState } from "react";
import orderManagement from "../../../api/orderManagementApi";

export const createOrderFetch = () => {
    const [valves, setValves] = useState([]);
    const [colors, setColors] = useState([]);
    const [menuFacture, setMenuFacture] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    // get valve
    useEffect(() => {
        const getValves = async () => {
            setLoading(true);
            const res = await orderManagement.getValves();
            if (res && res.data) {
                setValves(res.data);
            }
            setLoading(false);
        };
        getValves();
    }, []);
    // get color
    useEffect(() => {
        const getColors = async () => {
            setLoading(true);
            const res = await orderManagement.getColors();
            if (res && res.data) {
                setColors(res.data);
            }
            setLoading(false);
        };
        getColors();
    }, []);
    // get manuFacture
    useEffect(() => {
        const getMenuFacture = async () => {
            setLoading(true);
            const res = await orderManagement.getMenuFacture();
            if (res && res.data) {
                setMenuFacture(res.data);
            }
            setLoading(false);
        };
        getMenuFacture();
    }, []);
    // get category
    useEffect(() => {
        const getCategory = async () => {
            setLoading(true);
            const res = await orderManagement.getCategory();
            if (res && res.data) {
                setCategory(res.data);
            }
            setLoading(false);
        };
        getCategory();
    }, []);

    return {
        valves,
        colors,
        menuFacture,
        category,
        loading,
        setLoading,
    };
};
