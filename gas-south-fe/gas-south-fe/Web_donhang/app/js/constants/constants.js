const HTTP_SUCCESS_NOBODY = 204;
const HTTP_SUCCESS_CREATED = 201;
const HTTP_SUCCESS_BODY = 200;

const FACTORY_TITLE = "Thương Nhân Sở Hữu";
const GENERAL_TITLE = "Tổng đại lý";
const PARTNER = "Đối tác";
const AGENCY_TITLE = "Hệ Thống Đại lý";
const STATION_TITLE = "Trạm Chiết Nạp";
const PRODUCT_TITLE = "Quản trị Dữ Liệu Vỏ";
const DASHBOARD_TITLE = "Thống Kê";
// const DASHBOARD = "DashBoard"
const REPORT_TITLE = "Phản Hồi";
const CUSTOMER_TITLE = "Khách hàng";
const STAFF_TITLE = "Nhân Viên";
const USER_TITLE = "Người Dùng";
const DRIVER_TITLE = "Tài xế";
const USERTYPE_TITLE = "Loại người dùng";
const MANUFACTURER_TITLE = "Thương Hiệu";
const COORDINATOR_TITLE = "Điều Phối";
const FIX_TITLE = "Sửa chữa";
const FACTORY_CHILD = "Công ty - Chi nhánh trực thuộc";
const SUPERADMIN = "SuperAdmin";
const GOVERMENT = "Government";
const FACTORY = "Factory";
const PERSONNEL = "Personnel";
const STATION = "Station";
const GENERAL = "General";
const AGENCY = "Agency";
const NORMAL = "Normal";
const DRIVER = "Driver";

const THANHTRA_TITLE = "thanh tra";
const THANHTRA = "ThanhTra";

const PLACESTATUS_ENUM = [
  {
    value: "Tại thương nhân sở hữu",
    key: "IN_FACTORY",
  },
  {
    value: "Tại trạm chiết xuất",
    key: "IN_STATION",
  },
  {
    value: "Tại tổng đại lý",
    key: "IN_GENERAL",
  },
  {
    value: "Đang vận chuyển",
    key: "DELIVERING",
  },
  {
    value: "Tại Hệ Thống Đại lý",
    key: "IN_AGENCY",
  },
  {
    value: "Tại người dân",
    key: "IN_CUSTOMER",
  },
  {
    value: "Nhà máy sửa chữa",
    key: "IN_REPAIR",
  },
  {
    value: "Tại xe",
    key: "IN_VEHICLE",
  },
];

const COLOR_ENUM = [
  {
    value: "Đỏ",
    key: "Red",
  },
  {
    value: "Xanh lá",
    key: "Green",
  },
  {
    value: "Xanh dương",
    key: "Blue",
  },
  {
    value: "Xám",
    key: "Grey",
  },
  {
    value: "Hồng",
    key: "Pink",
  },
  {
    value: "6 Màu",
    key: "6 Colors",
  },
];

const STATUS_ENUM = [
  {
    value: "Hết hạn sử dụng",
    key: "DISABLED",
  },
  {
    value: "Đủ gas",
    key: "FULL",
  },
  {
    value: "Hết gas",
    key: "EMPTY",
  },
];

const IMPORT_FACTORY = "IMPORT_FACTORY";
const EXPORT_FACTORY = "EXPORT_FACTORY";
const EXPORT_WAREHOUSE = "EXPORT_WAREHOUSE";
const EXPORT_BACK_FACTORY = "EXPORT_BACK_FACTORY";

const IMPORT_STATION = "IMPORT_STATION";
const EXPORT_STATION = "EXPORT_STATION";
const OWNER = "Owner";
const EXPORT_TYPE = "EXPORT";
const EXPORT_FULL_WAREHOUSE = "EXPORT_FULL_WAREHOUSE";
const TURN_BACK_TYPE = "TURN_BACK";
const IMPORT_TYPE = "IMPORT";
const SALE_TYPE = "SALE";
const GIVE_BACK_TYPE = "GIVE_BACK";
const FIXER = "Fixer";
const TURN_BACK_NOT_IN_SYSTEM = "TURN_BACK_NOT_IN_SYSTEM";
const BUY = "BUY";
const RENT = "RENT";
const TO_FIX = "TO_FIX";
const RETURN_CYLINDER = "RETURN_CYLINDER";
const RETURN = "RETURN";
const CHANGE_DATE = "CHANGE_DATE";
const ORDER_STATUS = [
  {
    value: "Gửi duyệt lại",
    key: "GUI_DUYET_LAI",
    color: "#fd7e14",
  },
  {
    value: "Từ chối lần 2",
    key: "TU_CHOI_LAN_1",
    color: "#ffc107",
  },
  {
    value: "Từ chối lần 2",
    key: "TU_CHOI_LAN_2",
    color: "#ffc107",
  },
  {
    value: "Đơn hàng mới",
    key: "DON_HANG_MOI",
    color: "#343a40",
  },
  {
    value: "Đang duyệt",
    key: "DANG_DUYET",
    color: "#fd7e14",
  },
  {
    value: "Đã duyệt",
    key: "DA_DUYET",
    color: "#28a745",
  },
  {
    value: "Đã hoàn thành",
    key: "DA_HOAN_THANH",
    color: "#28a745",
  },
  {
    value: "Không duyệt",
    key: "KHONG_DUYET",
    color: "#dc3545",
  },
  {
    value: "Đơn hàng mới",
    key: "TO_NHAN_LENH_DA_DUYET",
    color: "#343a40",
  },
];
export default {
  // DASHBOARD,
  THANHTRA_TITLE,
  THANHTRA,
  DRIVER_TITLE,
  USERTYPE_TITLE,
  DRIVER,
  EXPORT_TYPE,
  EXPORT_FULL_WAREHOUSE,
  EXPORT_BACK_FACTORY,
  TURN_BACK_TYPE,
  IMPORT_TYPE,
  SALE_TYPE,
  GIVE_BACK_TYPE,
  HTTP_SUCCESS_BODY,
  HTTP_SUCCESS_CREATED,
  HTTP_SUCCESS_NOBODY,
  FACTORY_TITLE,
  GENERAL_TITLE,
  PARTNER,
  AGENCY_TITLE,
  STATION_TITLE,
  PRODUCT_TITLE,
  DASHBOARD_TITLE,

  REPORT_TITLE,
  USER_TITLE,
  SUPERADMIN,
  GOVERMENT,
  FACTORY,
  PERSONNEL,
  STATION,
  GENERAL,
  AGENCY,
  NORMAL,
  COLOR_ENUM,
  PLACESTATUS_ENUM,
  STATUS_ENUM,
  STAFF_TITLE,
  CUSTOMER_TITLE,
  IMPORT_FACTORY,
  EXPORT_FACTORY,
  EXPORT_WAREHOUSE,
  IMPORT_STATION,
  EXPORT_STATION,
  MANUFACTURER_TITLE,
  FIXER,
  TURN_BACK_NOT_IN_SYSTEM,
  BUY,
  RENT,
  TO_FIX,
  FIX_TITLE,
  RETURN_CYLINDER,
  CHANGE_DATE,
  FACTORY_CHILD,
  OWNER,
  COORDINATOR_TITLE,
  RETURN,
  ORDER_STATUS,
};
