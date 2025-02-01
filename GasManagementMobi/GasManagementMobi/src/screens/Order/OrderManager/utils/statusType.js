import React from 'react';
import { Text } from 'react-native';
import { COLOR } from '../../../../constants';

const statusType = (status) => {
  switch (status) {
    case 0:
      return (
        <Text style={{ color: COLOR.STATUS_WAITING, fontWeight: 'bold' }}>
          Chờ xác nhận
        </Text>
      );
    case 1:
      return (
        <Text style={{ color: COLOR.STATUS_CONFIRM, fontWeight: 'bold' }}>
          Đã xác nhận
        </Text>
      );
    case 2:
      return (
        <Text style={{ color: COLOR.STATUS_DELIVERY, fontWeight: 'bold' }}>
          Đang giao
        </Text>
      );
    case 3:
      return (
        <Text style={{ color: COLOR.STATUS_DONE, fontWeight: 'bold' }}>
          Đã hoàn thành
        </Text>
      );
    case 4:
      return (
        <Text style={{ color: COLOR.STATUS_CANCEL, fontWeight: 'bold' }}>
          Không duyệt
        </Text>
      );
    default:
      return (
        <Text style={{ color: COLOR.STATUS_WAITING, fontWeight: 'bold' }}>
          Chờ xác nhận
        </Text>
      );
  }
};

export default statusType;


const gray_dark = "#343a40";
const orange = "#fd7e14";
const yellow = "#ffc107";
const success = "#28a745";
const red = "#dc3545";
const blue = "#096Ab2";

export const ORDER_STATUS = new Map([
  ["DON_HANG_MOI", { name: "Đơn hàng mới", color: gray_dark }],
  ["TO_NHAN_LENH_DA_DUYET", { name: "Tổ nhận lệnh đã duyệt", color: gray_dark }],
  ["TNLGUI_XACNHAN", { name: "TNL gửi kh duyệt lại", color: orange }],
  ["TU_CHOI_LAN_1", { name: "Từ chối lần 1", color: yellow }],
  ["TU_CHOI_LAN_2", { name: "Từ chối lần 2", color: yellow }],
  ["GUI_DUYET_LAI", { name: "Gửi duyệt lại", color: orange }],
  ["DA_DUYET", { name: "Đã duyệt", color: success }],
  ["DDTRAMGUI_XACNHAN", { name: "Trạm duyệt lại", color: yellow }],
  ["DDTRAM_DUYET", { name: "Trạm đã duyệt", color: success }],
  ["DANG_GIAO", { name: "Đang giao", color: yellow }],
  ["DA_HOAN_THANH", { name: "Đã hoàn thành", color: success }],
  ["DIEU_DO_TRAM_XACNHAN_HOANTHANH", { name: "Trạm xác nhận đơn hoàn thành", color: success }],
  ["KHONG_DUYET", { name: "Đã hủy", color: red }],
]);

export const ORDER_STATUS_HISTORY = new Map([
  ["TO_NHAN_LENH_DA_DUYET", { name: "Tổ nhận lệnh đã duyệt", color: gray_dark }],
  ["DON_HANG_MOI", { name: "Đơn hàng mới", color: gray_dark }],
  ["TU_CHOI_LAN_1", { name: "Từ chối lần 1", color: yellow }],
  ["TU_CHOI_LAN_2", { name: "Từ chối lần 2", color: yellow }],
  ["GUI_DUYET_LAI", { name: "Gửi duyệt lại", color: orange }],
  ["DA_DUYET", { name: "Đã duyệt", color: success }],
  ["DANG_GIAO", { name: "Đang giao", color: yellow }],
  ["DA_HOAN_THANH", { name: "Đã hoàn thành", color: success }],
  ["KHONG_DUYET", { name: "Đã hủy", color: red }],
  ["DIEU_DO_TRAM_XACNHAN_HOANTHANH", { name: "Trạm xác nhận đơn hoàn thành", color: success }],
  ["DDTRAMGUI_XACNHAN", { name: "Trạm gửi khách hàng duyệt lại", color: yellow }],
  ["DDTRAM_DUYET", { name: "Trạm đã duyệt", color: success }],
  ["KHDDTRAM_DUYET", { name: "Khách hàng đã duyệt đơn", color: success }],
  ["KHKHONG_DUYET", { name: "khách hàng hủy đơn hàng", color: red }],
  ["TNLGUI_XACNHAN", { name: "TNL Gửi kh duyệt lại", color: orange }],
  ["KHOI_TAO_DON_HANG", { name: "Khởi tạo đơn hàng", color: orange }],
]);

export const ORDER_STATUS_CUSTOMERS = new Map([
  ["TO_NHAN_LENH_DA_DUYET", { name: "Đang duyệt", color: orange }],
  ["DON_HANG_MOI", { name: "Chờ xác nhận", color: gray_dark }],
  ["TU_CHOI_LAN_1", { name: "Đang duyệt", color: orange }],
  ["TU_CHOI_LAN_2", { name: "Đang duyệt", color: orange }],
  ["GUI_DUYET_LAI", { name: "Đang duyệt", color: orange }],
  ["TNLGUI_XACNHAN", { name: "Duyệt lại", color: yellow }],
  ["DA_DUYET", { name: "Đang duyệt", color: orange }],//kế toán đã duyệt
  ["DANG_GIAO", { name: "Đang giao", color: yellow }],
  ["DA_HOAN_THANH", { name: "Đã hoàn thành", color: success }],
  ["KHONG_DUYET", { name: "Đã hủy", color: red }],
  ["DDTRAMGUI_XACNHAN", { name: "Duyệt lại", color: yellow }],
  ["DDTRAM_DUYET", { name: "Đã duyệt", color: success }],
]);

export const ORDER_STATUS_CUSTOMERS_HEADER = new Map([
  ["DON_HANG_MOI", { name: "Chờ xác nhận", color: gray_dark }],
  ["TO_NHAN_LENH_DA_DUYET", { name: "Đang duyệt", color: orange }],
  // ["TU_CHOI_LAN_1", { name: "Đang duyệt", color: orange }],
  // ["TU_CHOI_LAN_2", { name: "Đang duyệt", color: orange }],
  // ["GUI_DUYET_LAI", { name: "Đang duyệt", color: orange }],
  // ["DA_DUYET", { name: "Đã duyệt", color: success }],
  ["DDTRAMGUI_XACNHAN", { name: "Duyệt lại", color: yellow }],
  ["DDTRAM_DUYET", { name: "Đã duyệt", color: success }],
  ["DANG_GIAO", { name: "Đang giao", color: yellow }],
  ["DA_HOAN_THANH", { name: "Đã hoàn thành", color: success }],
  ["KHONG_DUYET", { name: "Đã hủy", color: red }],
]);

export const ORDER_STATUS_TNL = new Map([
  ["DON_HANG_MOI", { name: "Đơn hàng mới", color: gray_dark }],
  ["TO_NHAN_LENH_DA_DUYET", { name: "đang duyệt", color: orange }],
  ["TU_CHOI_LAN_1", { name: "Từ chối lần 1", color: yellow }],
  ["TU_CHOI_LAN_2", { name: "Từ chối lần 2", color: yellow }],
  ["GUI_DUYET_LAI", { name: "Gửi duyệt lại", color: orange }],
  ["TNLGUI_XACNHAN", { name: "Gửi kh duyệt lại", color: orange }],
  ["DA_DUYET", { name: "Đã duyệt", color: success }],
  ["DDTRAMGUI_XACNHAN", { name: "Trạm duyệt lại", color: yellow }],
  ["DDTRAM_DUYET", { name: "Trạm đã duyệt", color: success }],
  ["DANG_GIAO", { name: "Đang giao", color: yellow }],
  ["DA_HOAN_THANH", { name: "Đã hoàn thành", color: success }],
  ["KHONG_DUYET", { name: "Đã hủy", color: red }],
]);

export const ORDER_STATUS_KT = new Map([
  ["TNLGUI_XACNHAN", { name: "TNL Gửi kh duyệt lại", color: orange }],
  ["TO_NHAN_LENH_DA_DUYET", { name: "Đơn hàng mới", color: gray_dark }],
  ["TU_CHOI_LAN_1", { name: "Từ chối lần 1", color: yellow }],
  ["TU_CHOI_LAN_2", { name: "Từ chối lần 2", color: yellow }],
  ["GUI_DUYET_LAI", { name: "Gửi duyệt lại", color: orange }],
  ["DA_DUYET", { name: "Đã duyệt", color: success }],
  ["DDTRAMGUI_XACNHAN", { name: "Trạm duyệt lại", color: yellow }],
  ["DDTRAM_DUYET", { name: "Trạm đã duyệt", color: success }],
  ["DANG_GIAO", { name: "Đang giao", color: yellow }],
  ["DA_HOAN_THANH", { name: "Đã hoàn thành", color: success }],
  ["KHONG_DUYET", { name: "Đã hủy", color: red }],
]);

export const ORDER_STATUS_TRAM = new Map([
  ["DA_DUYET", { name: "Đơn hàng mới", color: gray_dark }],
  ["DDTRAM_DUYET", { name: "Đã duyệt", color: orange }],
  ["DDTRAMGUI_XACNHAN", { name: "Gửi duyệt lại", color: yellow }],
  ["DANG_GIAO", { name: "Đang giao", color: yellow }],
  ["DA_HOAN_THANH", { name: "Đã hoàn thành", color: success }],
  ["KHONG_DUYET", { name: "Đã hủy", color: red }],
]);


export const ORDER_TYPE = new Map([
  ["KHONG", { name: "Đơn đổi vỏ" }],
  ["COC_VO", { name: "Cọc vỏ" }],
  ["MUON_VO", { name: "Mượn vỏ" }],
]);

export const USER_ROLE = new Map([
  ["To_nhan_lenh", { name: "Tổ nhận lệnh" }],
  ["Ke_toan", { name: "Kế toán" }],
  ["Ke_toan_vo_binh", { name: "Kế toán vỏ bình" }],
  ["Truong_phongKD", { name: "Trưởng phòng kinh doanh" }],
  ["Pho_giam_docKD", { name: "Phó giám đốc kinh doanh" }],
  ["Dieu_do_tram", { name: "Điều độ trạm" }],
  ["SuperAdmin", { name: "Khách hàng" }],
]);

export const SHIPPING_TYPE_STATUS = new Map([
  ["TRA_VO_KHAC", { name: "Trả vỏ khác" }],
  ["GIAO_VO", { name: "Giao vỏ" }],
  ["TRA_BINH_DAY", { name: "Trả bình đầy" }],
  ["TRA_VO", { name: "Trả vỏ" }],
  ["GIAO_HANG", { name: "Giao hàng" }],
]);
