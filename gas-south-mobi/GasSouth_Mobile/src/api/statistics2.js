import { API_URL } from "../constants";
import axios from "axios";

const getAggregate = async (id, dateStart, dateEnd, token) => {
  try {
    let fetchData = await axios.get(
      `${API_URL}/reportVer3/getAggregate?target=${id}&startDate=${dateStart}&endDate=${dateEnd}`,
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

const getStationDetail = async (
  id,
  statisticalType,
  dateStart,
  dateEnd,
  token
) => {
  try {
    let fetchData = await axios.get(
      `${API_URL}/reportVer3/getStatistic?target=${id}&statisticalType=${statisticalType}&startDate=${dateStart}&endDate=${dateEnd}`,
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

const getFixerDetail = async (
  id,
  statisticalType,
  condition,
  dateStart,
  dateEnd,
  manufacture,
  token
) => {
  try {
    let fetchData = await axios.get(
      `${API_URL}/reportVer2/getAggregateByCylindersCondition?target=${id}&statisticalType=${statisticalType}&condition=${condition}&startDate=${dateStart}&endDate=${dateEnd}&manufacture=${manufacture}`,
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

const getExportHistory = async (to_or_from, type, id, page, token) => {
  try {
    let fetchData = await axios.get(
      `${API_URL}/history/getHistoriesByType?to_or_from=${to_or_from}&type=${type}&id_user=${id}&page=${page}`,
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

const getListChildren = async (params, token) => {
  try {
    let fetchData = await axios.post(`${API_URL}/user/getSubChilds`, params, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return fetchData;
  } catch (error) {
    console.warn(error);
    return null;
  }
};

const getTotalInitCylinders = async (id, token) => {
  try {
    let fetchData = await axios.get(
      `${API_URL}/reportVer2/getTotalCylinder?target=${id}`,
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

const getAggregateRepairFactory = async (
  id,
  dateStart,
  dateEnd,
  condition,
  token
) => {
  try {
    let fetchData = await axios.get(
      `${API_URL}/reportVer3/getAggregateRepairFactory?objectId=${id}&startDate=${dateStart}&endDate=${dateEnd}&condition=${condition}`,
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

const getListStations = async (id, stationType, token) => {
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

export default {
  getAggregate,
  getStationDetail,
  getFixerDetail,
  getExportHistory,
  getListChildren,
  getTotalInitCylinders,
  getAggregateRepairFactory,
  getListStations,
};
