import { API_URL } from '../constants';
import axios from 'axios';

const getAllOrderTank = async () => {
  try {
    let fetchData = await axios.get(`${API_URL}/ordertank/getAllOrder`);

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const getAllCustomer = async (token) => {
  try {
    let fetchData = await axios.post(`${API_URL}/CustomerGas/getAllCustomer`,{},
    {
      headers: { Authorization: `Bearer ${token}` }
    });

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const getExportWarehouse = async () => {
  try {
    let fetchData = await axios.get(`${API_URL}/warehouse/getAllWareHouse`);

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const createOrderTank = async (params) => {
  try {
    let fetchData = await axios.post(`${API_URL}/ordertank/createOrderTank`, 
      params
    );

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const deleteOrderTank = async (params) => {
  try {
    let fetchData = await axios.post(`${API_URL}/ordertank/deleteOrderTank`, params);

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const sendNotification = async (params) => {
  try {
    let fetchData = await axios.post(`${API_URL}/SendNotificationForEachDevice`, params);

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const checkSpurlus = async (params) => {
  try {
    let fetchData = await axios.post(`${API_URL}/importexport/manageWareHouse`, params);

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

const ManageImportExportWareHouse = async (params) => {
  try {
    let fetchData = await axios.post(`${API_URL}/importexport/ManageImportExportWareHouse`, params);

    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
}

export default {
  getAllOrderTank,
  getAllCustomer,
  getExportWarehouse,
  createOrderTank,
  deleteOrderTank,
  sendNotification,
  checkSpurlus,
  ManageImportExportWareHouse
};


