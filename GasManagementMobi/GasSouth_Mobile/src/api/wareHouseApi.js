import { API_URL } from "../constants";
import axios from "axios";

// lấy thông tin tài xế
const getDriver = async (params, token) => {
  try {
    const fetchData = await axios.post(
      `${API_URL}/user/listNameDriver`,
      params,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return fetchData;
  } catch (error) {
    console.log("get driver error: " + error);
  }
};

// lấy thông tin khách hàng
const getCustomers = async (id, stationType, token) => {
  try {
    let fetchData = await axios.get(
      `${API_URL}/station/getListStation?id=${id}&stationType=${stationType}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
};

export default { getDriver, getCustomers };
