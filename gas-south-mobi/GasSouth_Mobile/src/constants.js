export const COLOR = {
  BLUE: "#006698",
  LIGHTBLUE: "#096AB2",
  DARKGRAY: "#3B434F",
  GRAY: "#8E8E93",
  MEDIUMGRAY: "#80858D",
  ORANGE: "#FF9E16",
  LIGHTGRAY: "#D8D8D8",
  WHITE: "#FFF",
  LIGHTBLACK: "#4A4A4A",
  BACKGROUNDGRAY: "#F8F8F8",
  BACKGROUNDLIGHTGRAY: "#FAFAFA",
  BLACK: "#2B2B2A",
  RED: "red",
  GREEN_MAIN: "#009347",
  GRAY_OPTION: "#ebebeb",
  STATUS_CONFIRM: "#3579f7",
  STATUS_CANCEL: "#eb4b46",
  STATUS_DELIVERY: "#f5921e",
  STATUS_DONE: "#199d59",
  STATUS_WAITING: "#6b6b6b",
};
export const GAS = {
  GAS1: require("./static/images/gas-1.png"),
  GAS2: require("./static/images/gas-2.png"),
  GAS3: require("./static/images/gas-3.png"),
  GAS4: require("./static/images/gas-4.jpg"),
  GAS5: require("./static/images/gas-5.jpg"),
  GAS6: require("./static/images/gas-6.jpg"),
};
// export const API_URL = 'http://apicitypetro.crmdvs.vn';
// export const API_URL = 'http://127.0.0.1:9099';
// export const API_URL = 'http://14.161.1.28:9099';

// export const API_URL = "http://192.168.1.53:9099"; // ở nhà
// export const API_URL = "http://192.168.0.119:9099";
export const API_URL = "https://gsapi.vsmartoffice.vn";
// export const API_URL = 'http://192.168.0.112:9099';
//  export const API_URL = 'http://45.119.84.155:1338'
// export const API_URL = 'http://14.161.1.28:1340'

//Sopet
// export const API_URL = 'http://45.119.84.155:1337'

//Gas South
//export const API_URL = 'http://45.119.84.155:1338'

// export const API_URL = 'https://api.4te.vn'
// export const API_URL = 'http://localhost:1337'
// export const API_URL = 'http://192.168.0.102:1338'
// export const API_URL = 'http://api-staging.4te.vn'

export const SHIPPING_TYPE = {
  GIAO_HANG: "GIAO_HANG", // Giao bình đầy
  GIAO_VO: "GIAO_VO", // Giao vỏ
  TRA_VO: "TRA_VO", // Trả vỏ
  TRA_BINH_DAY: "TRA_BINH_DAY", // Trả bình đầy
  TRA_VO_KHAC: "TRA_VO_KHAC", // Trả vỏ khác
  //Khách thêm chức năng, để tạm ở đây :))
  HOI_LUU_KHO_XE: "HOI_LUU_KHO_XE",
};
Object.freeze(SHIPPING_TYPE);

export const CYLINDER_STATUS = {
  BINH: "BINH",
  VO: "VO",
  BINH_DAY: "BINH_DAY",
};

Object.freeze(CYLINDER_STATUS);
