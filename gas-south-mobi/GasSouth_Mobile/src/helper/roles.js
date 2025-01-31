import { Actions } from "react-native-router-flux";
import {
  IMPORT,
  EXPORT,
  TURN_BACK,
  STATION,
  AGENCY,
  GENERAL,
  FACTORY,
  GOVERNMENT,
  SUPER_ADMIN,
  DAILY_REPORT,
  FIXER,
  DAILY_REPORT_1,
  RETURN_CYLINDER,
  TO_FIX,
  DELIVER,
  INSPECTOR,
  DAILY_REPORTNEW,
  DAILY_REPORTNEW_VER2,
  DAILY_REPORTNEW_VER3,
  ORDERS,
  EXPORT_CYLINDER_EMPTY,
  DRIVER_TAB,
  DRIVER_TANK,
  TNL,
  TRUONG_TRAM,
  KT_TRAM,
  KT,
  SALESMANAGER,
  TRUCK,
  VEHICLE_INVENTORY_STATISTICS,
  WAREHOUSE_MANAGER,
} from "../types";
import { translate } from "i18n-js";

let userTypes = {
  SuperAdmin: [
    {
      name: "CHECK_CYLINDER",
      code: "#009347",
      action: "scanAdmin",
      iconName: "check",
    },

    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: DAILY_REPORTNEW,
      iconName: "calendar-export",
    },

    {
      name: "SEND_NOTIFICATION",
      code: "#F6921E",
      action: "alert",
      iconName: "file-send",
    },
    {
      name: "SEE_FEEDBACK_FROM_CONSUMERS",
      code: "#F6921E",
      action: "pageEmpty",
      iconName: "file-eye",
    },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },

    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
  ],
  Government: [
    {
      name: "CHECK_INFORMATION",
      code: "#009347",
      action: "scanAdmin",
      iconName: "check",
    },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    {
      name: "SEND_NOTIFICATION",
      code: "#F6921E",
      action: "alert",
      iconName: "file-send",
    },
    {
      name: "SEE_FEEDBACK_FROM_CONSUMERS",
      code: "#F6921E",
      action: "reportList",
      iconName: "file-eye",
    },
  ],
  // đăng nhập app với tài khoản tài xế
  Factory: [
    // {
    //   name: 'ENTER_THE_RETURN_SERIAL',
    //   code: '#009347',
    //   action: TURN_BACK,
    //   iconName: 'application-import',
    // },
    // {
    //   name: 'EXPORT_CYLINDER',
    //   code: '#009347',
    //   action: EXPORT,
    //   iconName: 'export',
    // },
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },

    // {
    //   name: "ORDER_MANAGEMENT",
    //   code: "#009347",
    //   action: "OrderManagement",
    //   type: "STATION",
    //   iconName: "export",
    // },
    // {name: 'Nhập bình từ trạm chiết', code: '#C00000', action: IMPORT, iconName: "application-import"},
    // {
    //   name: 'EXPORT_THE_SHELL',
    //   code: '#F6921E',
    //   action: EXPORT,
    //   type: 'STATION',
    //   iconName: 'export',
    // },

    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: 'statisticManager',
    //   iconName: 'calendar-export',
    // },

    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
    //du them thống kê giao hàng
    // {
    //   name: "STATISTICAL_INFORMATION",
    //   code: "#F6921E",
    //   action: "statisticCustomer",
    //   iconName: "calendar-export",
    // },
    //du them thống kê bình lỗi
    // {
    //   name: "STATISTICAL_JAR_ERROR",
    //   code: "#F6921E",
    //   action: "statisticJarError",
    //   iconName: "calendar-export",
    // },

    // thông thêm kho xe
    // đăng nhập bẳng tài khoản xe
    {
      name: "EXPORT_CYLINDER_TO",
      code: "#009347",
      action: EXPORT_CYLINDER_WAREHOUSE_STEP1,
    },
    {
      name: "RETRACE_FULL_BOTTLE",
      code: "#009347",
      action: "statisticJarError",
    },
    {
      name: "EXPORT_EMPTY_CYLINDER_TO",
      code: "#009347",
      action: "statisticJarError",
    },
    {
      name: "Statistics_Report",
      code: "#009347",
      action: "statisticJarError",
    },
  ],
  Station: [
    {
      name: "ENTER_THE_SERIAL_OF_GAS_CYLINDER_TO_BE_LOADED",
      code: "#009347",
      action: IMPORT,
      iconName: "application-import",
    },
    {
      name: "EXPORT_CYLINDER",
      code: "#009347",
      action: "EXPORT_PARENT_CHILD",
      iconName: "export",
    },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    {
      name: "EXPORT_TO_TRADERS",
      code: "#F6921E",
      action: EXPORT,
      iconName: "export",
    },

    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: DAILY_REPORTNEW,
      iconName: "calendar-export",
    },
    // {
    //     name: "UPDATE_ORDER_STATUS",
    //     code: "#F6921E",
    //     action: 'UpdateOrderStatus',
    //     iconName: "calendar-export"
    // },
    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
  ],
  General: [
    {
      name: "IMPORT_CYLINDER",
      code: "#009347",
      action: IMPORT,
      iconName: "application-import",
    },
    {
      name: "EXPORT_TO_RETAIL",
      code: "#009347",
      action: EXPORT,
      iconName: "export",
    },
    // {
    //   name: 'CREATE_ORDER',
    //   code: '#009347',
    //   action: ORDERS,
    //   iconName: 'application-import',
    // },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    //du thêm nút tạo đơn hàng
    {
      name: "CREATE_NEW_ORDERS",
      code: "#009347",
      action: "orderScreen",
      type: "STATION",
      iconName: "export",
    },
    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: DAILY_REPORTNEW,
    //   iconName: 'calendar-export',
    // },
    // {
    //     name: "UPDATE_ORDER_STATUS",
    //     code: "#F6921E",
    //     action: 'UpdateOrderStatus',
    //     iconName: "calendar-export"
    // },
    //du thêm thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
  ],
  Agency: [
    {
      name: "IMPORT_CYLINDER",
      code: "#009347",
      action: IMPORT,
      iconName: "application-import",
    },
    {
      name: "SELL_CYLINDER",
      code: "#009347",
      action: EXPORT,
      iconName: "export",
    },
    // {
    //   name: 'CREATE_ORDER',
    //   code: '#009347',
    //   action: ORDERS,
    //   iconName: 'application-import',
    // },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    //du thêm nút tạo đơn hàng
    {
      name: "CREATE_NEW_ORDERS",
      code: "#009347",
      action: "orderScreen",
      type: "STATION",
      iconName: "export",
    },
    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: DAILY_REPORTNEW,
    //   iconName: 'calendar-export',
    // },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
  ],
  Normal: [
    {
      name: "ENTER_THE_RETURN_SERIAL",
      code: "#009347",
      action: IMPORT,
      iconName: "application-import",
    },
    {
      name: "EXPORT_WAREHOUSE",
      code: "#009347",
      action: EXPORT,
      iconName: "export",
    },
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      iconName: "export",
    },
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: DAILY_REPORTNEW,
      iconName: "calendar-export",
    },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_DELIVERY",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
    // thông thêm thông tin thống kê
    {
      name: "STATISTICAL_INFORMATION_VER2",
      code: "#F6921E",
      action: DAILY_REPORTNEW_VER3,
      iconName: "calendar-export",
    },
    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
  ],
  Fixer: [
    {
      name: "IMPORT_CYLINDERS_TO_FIX",
      code: "#009347",
      action: IMPORT,
      iconName: "application-import",
      typeForPartner: TO_FIX,
    },
    {
      name: "EXPORT_RETURNS",
      code: "#009347",
      action: EXPORT,
      iconName: "export",
      typeForPartner: TO_FIX,
    },

    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: DAILY_REPORTNEW,
      iconName: "calendar-export",
    },
    {
      name: "EXPORT_HISTORY",
      code: "#F6921E",
      action: "ExportHistory",
      iconName: "calendar-export",
    },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    // Thông thêm thông tin thống kê ver 2
    {
      name: "STATISTICAL_INFORMATION_VER2",
      code: "#F6921E",
      action: DAILY_REPORTNEW_VER3,
      iconName: "calendar-export",
    },
    // {
    //     name: "UPDATE_ORDER_STATUS",
    //     code: "#F6921E",
    //     action: 'UpdateOrderStatus',
    //     iconName: "calendar-export"
    // },
  ],
};

let userRoles = {
  SuperAdmin: [
    {
      name: "ENTER_THE_RETURN_SERIAL",
      code: "#009347",
      action: TURN_BACK,
      iconName: "application-import",
    },
    {
      name: "EXPORT_CYLINDER",
      code: "#009347",
      action: EXPORT,
      iconName: "export",
    },
    // {name: 'Nhập bình từ trạm chiết', code: '#C00000', action: IMPORT, iconName: "application-import"},
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    {
      name: "EXPORT_THE_SHELL",
      code: "#F6921E",
      action: EXPORT,
      type: "STATION",
      iconName: "export",
    },

    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: DAILY_REPORTNEW,
      iconName: "calendar-export",
    },
    {
      name: "STATISTICAL_INFORMATION_VER2",
      code: "#F6921E",
      action: DAILY_REPORTNEW_VER2,
      iconName: "calendar-export",
    },
    {
      name: "STATISTICAL_INFORMATION_VER3",
      code: "#F6921E",
      action: DAILY_REPORTNEW_VER3,
      iconName: "calendar-export",
    },
    {
      name: "VEHICLE_INVENTORY_STATISTICS",
      code: "#F6921E",
      action: VEHICLE_INVENTORY_STATISTICS,
      iconName: "calendar-export",
    },
    // {
    //   name: 'BIỂU ĐỒ SỐ DƯ',
    //   code: '#F6921E',
    //   action: 'LinerChart',
    //   iconName: 'calendar-export',
    // },
    // {
    //     name: "CREATE_ORDER",
    //     code: "#F6921E",
    //     action: 'CreateOrder',
    //     iconName: "calendar-export"
    // },
    // {
    //     name: "ORDER_STATUS",
    //     code: "#F6921E",
    //     action: 'OrderStatus',
    //     iconName: "calendar-export"
    // },
    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
  ],
  Deliver: [
    {
      name: "DELIVERY",
      code: "#009347",
      action: "driverListOrder_V2",
      iconName: "application-import",
    },
    {
      name: "TURN_BACK",
      code: "#ff8000",
      action: "Reflux",
      iconName: "application-import",
    },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#ff8000",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
    {
      name: "IMPORT_CYLINDER",
      code: "#009347",
      action: IMPORT,
      iconName: "application-import",
    },
    {
      name: "ENTER_THE_RETURN_SERIAL",
      code: "#009347",
      action: TURN_BACK,
      iconName: "application-import",
    },
    {
      name: "DRIVER_TAB",
      code: "#009347",
      action: "Driver",
      iconName: "application-import",
    },
    {
      name: "DRIVER_TANK",
      code: "#009347",
      action: "DriverTank",
      iconName: "application-import",
    },
  ],
  Inspector: [
    {
      name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
      code: "#009347",
      action: "ChecklistForUsingSystemOfCylinder",
      iconName: "application-import",
    },
    {
      name: "MONTHLY_CHECKLIST",
      code: "#009347",
      action: "CHECKLST",
      iconName: "export",
    },
  ],
  //du thêm
  TNL: [
    // {
    //   name: 'ENTER_THE_RETURN_SERIAL',
    //   code: '#009347',
    //   action: IMPORT,
    //   iconName: 'application-import',
    // },
    // {
    //   name: 'EXPORT_WAREHOUSE',
    //   code: '#009347',
    //   action: EXPORT,
    //   iconName: 'export',
    // },
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      iconName: "export",
    },
    {
      name: "CREATE_NEW_ORDERS",
      code: "#009347",
      action: "orderInfoUserScreen",
      type: "STATION",
      iconName: "export",
    },
    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: DAILY_REPORTNEW,
    //   iconName: 'calendar-export',
    // },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
  ],
  //du thêm
  KT: [
    // {
    //   name: 'ENTER_THE_RETURN_SERIAL',
    //   code: '#009347',
    //   action: IMPORT,
    //   iconName: 'application-import',
    // },
    // {
    //   name: 'EXPORT_WAREHOUSE',
    //   code: '#009347',
    //   action: EXPORT,
    //   iconName: 'export',
    // },
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      iconName: "export",
    },
    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: DAILY_REPORTNEW,
    //   iconName: 'calendar-export',
    // },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
  ],
  //du thêm xử lý cho tài khoản trưởng phòng kinh doanh
  SalesManager: [
    // {
    //   name: 'ENTER_THE_RETURN_SERIAL',
    //   code: '#009347',
    //   action: IMPORT,
    //   iconName: 'application-import',
    // },
    // {
    //   name: 'EXPORT_WAREHOUSE',
    //   code: '#009347',
    //   action: EXPORT,
    //   iconName: 'export',
    // },
    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      iconName: "export",
    },
    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: DAILY_REPORTNEW,
    //   iconName: 'calendar-export',
    // },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
    //du them thống kê bình lỗi
    {
      name: "STATISTICAL_JAR_ERROR",
      code: "#F6921E",
      action: "statisticJarError",
      iconName: "calendar-export",
    },
    //du them thống kê doanh thu
    {
      name: "STATISTICAL_REVENUE",
      code: "#F6921E",
      action: "statisticRevenue",
      iconName: "calendar-export",
    },
  ],
  //du thêm
  TRUONG_TRAM: [
    // {
    //   name: 'ENTER_THE_RETURN_SERIAL',
    //   code: '#009347',
    //   action: TURN_BACK,
    //   iconName: 'application-import',
    // },
    // {
    //   name: 'EXPORT_CYLINDER',
    //   code: '#009347',
    //   action: EXPORT,
    //   iconName: 'export',
    // },
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },

    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    // {name: 'Nhập bình từ trạm chiết', code: '#C00000', action: IMPORT, iconName: "application-import"},
    // {
    //   name: 'EXPORT_THE_SHELL',
    //   code: '#F6921E',
    //   action: EXPORT,
    //   type: 'STATION',
    //   iconName: 'export',
    // },

    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: 'statisticManager',
    //   iconName: 'calendar-export',
    // },

    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
    //du them thống kê bình lỗi
    {
      name: "STATISTICAL_JAR_ERROR",
      code: "#F6921E",
      action: "statisticJarError",
      iconName: "calendar-export",
    },
  ],
  //du thêm
  KT_TRAM: [
    // {
    //   name: 'ENTER_THE_RETURN_SERIAL',
    //   code: '#009347',
    //   action: TURN_BACK,
    //   iconName: 'application-import',
    // },
    // {
    //   name: 'EXPORT_CYLINDER',
    //   code: '#009347',
    //   action: EXPORT,
    //   iconName: 'export',
    // },
    // {
    //   name: 'CREATE_NEW_ORDERS',
    //   code: '#009347',
    //   action: 'orderScreen',
    //   type: 'STATION',
    //   iconName: 'export',
    // },

    {
      name: "ORDER_MANAGEMENT",
      code: "#009347",
      action: "OrderManagement",
      type: "STATION",
      iconName: "export",
    },
    // {name: 'Nhập bình từ trạm chiết', code: '#C00000', action: IMPORT, iconName: "application-import"},
    // {
    //   name: 'EXPORT_THE_SHELL',
    //   code: '#F6921E',
    //   action: EXPORT,
    //   type: 'STATION',
    //   iconName: 'export',
    // },

    // {
    //   name: 'STATISTICAL_INFORMATION',
    //   code: '#F6921E',
    //   action: 'statisticManager',
    //   iconName: 'calendar-export',
    // },

    // {
    //     name: "CHECKLIST_FOR_USING_SYSTEM_OF_CYLINDER",
    //     code: "#009347",
    //     action: 'ChecklistForUsingSystemOfCylinder',
    //     iconName: "application-import"
    // },
    // {
    //     name: "MONTHLY_CHECKLIST",
    //     code: "#009347",
    //     action: 'CHECKLST',
    //     iconName: "export"
    // },
    //du them thống kê giao hàng
    {
      name: "STATISTICAL_INFORMATION",
      code: "#F6921E",
      action: "statisticCustomer",
      iconName: "calendar-export",
    },
    //du them thống kê bình lỗi
    // {
    //   name: 'STATISTICAL_JAR_ERROR',
    //   code: '#F6921E',
    //   action: 'statisticJarError',
    //   iconName: 'calendar-export',
    // },
  ],
  Truck: [
    {
      name: "STATISTICAL_INFORMATION",
      code: "#009347",
      action: "TruckOrderStatistics",
      iconName: "calendar-export",
    },
    {
      name: "DELIVERY",
      code: "#ff8000",
      action: "truckListOrder",
      iconName: "application-import",
    },
    {
      name: "TURN_BACK",
      code: "#ff8000",
      action: "Reflux",
      iconName: "application-import",
    },
  ],
};

export const getUserType = (userType) => {
  switch (userType) {
    case SUPER_ADMIN:
      return userTypes.SuperAdmin;
    case GOVERNMENT:
      return userTypes.Government;
    case FACTORY:
      return userTypes.Factory;
    case GENERAL:
      return userTypes.General;
    case AGENCY:
      return userTypes.Agency;
    case STATION:
      return userTypes.Station;
    case FIXER:
      return userTypes.Fixer;
    default:
      return userTypes.Normal;
  }
};

export const getUserRole = (userRole) => {
  switch (userRole) {
    case SUPER_ADMIN:
      return userRoles.SuperAdmin;
    case DELIVER:
      return userRoles.Deliver;
    case INSPECTOR:
      return userRoles.Inspector;
    case TNL: //tổ nhận lệnh
      return userRoles.TNL;
    case KT: //kế toán
      return userRoles.KT;
    case SALESMANAGER: //trưởng phòng kinh doanh
      return userRoles.SalesManager;
    case TRUONG_TRAM: //trưởng phòng kinh doanh
      return userRoles.TRUONG_TRAM;
    case KT_TRAM: //trưởng phòng kinh doanh
      return userRoles.KT_TRAM;
    case TRUCK: //kho xe
      return userRoles.Truck;
  }
};
