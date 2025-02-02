//const SERVERAPI='https://api.4te.vn/';
//const SERVERAPI = 'http://api-4te.crmdvs.vn/';
// const SERVERAPI = 'http://localhost:1337/';
// const SERVERAPI = "http://192.168.0.112:9099/";
// const SERVERAPI = "http://14.161.1.28:9099/";

const SERVERAPI = "http://127.0.0.1:9099/";
// const SERVERAPI = "http://172.21.2.70:9099/";
// const SERVERAPI = 'http://localhost:1340/';

// const SERVERAPI = 'http://14.161.1.28:1337/';

//const SERVERAPI = 'http://14.161.1.28:1340/';

//Sopet
// const SERVERAPI = 'http://45.119.84.155:1337/';

// GasSouth
// const SERVERAPI = 'http://45.119.84.155:1338/';
// const SERVERAPI = 'https://gsapi.vsmartoffice.vn/';

// const SERVERAPI = "http://192.168.1.26:1338/";
// const SERVERAPI = "http://192.168.1.9:1338/";
// const SERVERAPI = "http://192.168.1.22:1338/";

const IMPORTPRODUCTSUBSIDIARY = SERVERAPI + "cylinder/importFromSubsidiary";
const GETLISTMANUFACTURE = SERVERAPI + "manufacture/listManufacture";
const GETALLCHILD = SERVERAPI + "user/getAllChild";
const GETLISTSCHEDULE = SERVERAPI + "schedule/getListSchedule";
const GETUSERINFOR = SERVERAPI + "user/getInforById";
const ACCEPTREQUEST = SERVERAPI + "cylinder/confirmReqImport";
const DELETEREQUEST = SERVERAPI + "cylinder/removeReqImport";
const TOPEXPORTCYLINDER = SERVERAPI + "report/getTopExport";
const GETREQIMPORT = SERVERAPI + "cylinder/getReqImport";
const IMPORTCYLINDERBYEXCEL = SERVERAPI + "cylinder/createReqImport";
const GETCOMPANYTOFIX = SERVERAPI + "user/getAllCompanyToFix";
const GETDRIVERIMPORTCYLINDER = SERVERAPI + "user/getDriverImport";
const UPDATEORDER = SERVERAPI + "order/changeOrderStatus";
const GETORDERFACTORY =
  SERVERAPI + "order/getOrderShippingOfFactory?factoryId=";
const CREATECALENDERINSPECTOR = SERVERAPI + "schedule/createSchedule";
const GET_ALLERROR_REASION = SERVERAPI + "history/findStatic";
const UPDATE_REASION = SERVERAPI + "history/update";
const GETALLORDER = SERVERAPI + "order/getOrders";
const CREATEORDER = SERVERAPI + "order/setOrder";
const GETSTAFF = SERVERAPI + "inspector/getStaff";
const GETINSPECTOR = SERVERAPI + "inspector/getInspector";
const NAMEDRIVE = SERVERAPI + "user/listNameDriver";
const GETSTOCKGAS = SERVERAPI + "report/getListChild";
const GETDRIVE = SERVERAPI + "user/getDriver";
const URLSERVERIMAGE = SERVERAPI + "images/";
const GETAVATARUSER = SERVERAPI + "user/getAvatar";
const CHANGEPASSWORD = SERVERAPI + "user/change_password";
const CHANGINFOREUSER = SERVERAPI + "user/updateInformationUser";
const UPDATEBRANDINFORMATION = SERVERAPI + "manufacture/updateBrandInformation";
const LOGINURL = SERVERAPI + "user/login";
const REGISTERURL = SERVERAPI + "user/create";
const GETALLUSERURL = SERVERAPI + "user";
const GETALLBRANCH =
  SERVERAPI + "station/getListStation?id=$id&stationType=$stationType";
const GETDESTINATIONURL = SERVERAPI + "user/getDestination";
const GETALLCYLINDER = SERVERAPI + "cylinderCancel/create";
const GETALLREPORT = SERVERAPI + "report";
const GETALLREPORTNEW = SERVERAPI + "report/getCustomerReport";
const ADDPRODUCTURL = SERVERAPI + "cylinder/create";
const UPDATEPRODUCT = SERVERAPI + "cylinder/updateCylinder";
const ADDREPORTURL = SERVERAPI + "report";
const GETCYLINDERBYID = SERVERAPI + "cylinder/getDetail/:id";
const IMPORTPRODUCT = SERVERAPI + "cylinder/import";
const ADDUSERURL = SERVERAPI + "user/addUser";
const ADDBRANCH = SERVERAPI + "station/createStation";
const ADDPRODUCTTYPEURL = SERVERAPI + "categoryCylinder/create";
const UPDATEUSERURL = SERVERAPI + "user/updateChild";
const SEARCHSERIAL =
  SERVERAPI +
  'cylinder/?where={"serial":{"contains":"?keyword"}, "current":"?id"}&limit=50&skip=?skip';
const SEARCHCYLINDER =
  SERVERAPI + "manufacture/find?type=1&cylinder_serial=[$serial]";
const CREATEHISTORY = SERVERAPI + "history/importCylinder";
const GETCYLINDERBYSERIAL = SERVERAPI + "cylinder/getCylinderBySerial";
const DELETEUSER = SERVERAPI + "user/$user_id";
const DELETEPRODUCTURL = SERVERAPI + "cylinder/$cylinder_id";
const GETALLMANUFACTURER = SERVERAPI + "manufacture/list";
const GETALLTYPEGAS = SERVERAPI + "categoryCylinder/list?id=$Id";
const DELETEMANUFACTURER = SERVERAPI + "manufacture/$manufacture";
const ADDMANUFACTURER = SERVERAPI + "manufacture/create";
const GETINFORMATIONCYLINDERS = SERVERAPI + "cylinder/getInfomation";
const GETINFORMATIONCYLINDERSRETURN =
  SERVERAPI + "cylinder/getInfomationReturn";
const GETINFORMATIONCYLINDERSEXCEL = SERVERAPI + "cylinder/getInfomationExcel";
const GETREPORTIMPORTOREXPORTURL = SERVERAPI + "report/reportCylinder";
const ADDCYLINDERCANCEL = SERVERAPI + "cylinderCancel/create";
const GETHISTORYIMPORTURL =
  SERVERAPI +
  'history/?where={"$to_or_from":"$id_user","type":{"in":["IMPORT","TURN_BACK"]}}&limit=9999999999';
const GETHISTORYIMPORTURLUPDATEFOREXPORT =
  SERVERAPI +
  'history/?where={"$to_or_from":"$id_user","type":{"in":["EXPORT","SALE"]}}&limit=9999999999';
const GETHISTORYIMPORTURLUPDATEFOREXPORTFORSALE =
  SERVERAPI +
  'history/?where={"$to_or_from":"$id_user","saler":"$id_saler","type":{"in":["EXPORT","SALE"]}}&limit=9999999999';
const UPDATEPRICEURL = SERVERAPI + "cylinder/updatePrice";
const LISTHISTORYPRICE =
  SERVERAPI +
  "cylinder/searchCylinder?cylinder_serial=$cylinder_serial&page=$page&limit=$limit";
const PRICEHISTORY = SERVERAPI + "priceHistory?cylinder_id=$cylinder_id";
const GETLISTCUSTOMER = SERVERAPI + "report/getCustomers?page=$page&limit=10";
const GETALLFACTORY = SERVERAPI + "user/getAllFactory";
const PARTNER = SERVERAPI + "partner/relationship";
const FIXER_PARTNER = SERVERAPI + "partner/getFixersRelationship";
const FIXER = SERVERAPI + "partner/getAllFixerM";
const UPDATE_VERIFIED_DATES = SERVERAPI + "cylinder/updateVerifiedDates";
const UPDATE_VERIFIED_DATES_EXCELL =
  SERVERAPI + "cylinder/updateCylinderInformationExcel";
const EXPORT_PLACE = SERVERAPI + "exportPlace";
const REPORT_CHART = SERVERAPI + "report/reportChartData";
const REPORT_PIE_CHART = SERVERAPI + "imex/getCurrentInventory";
const GET_REPORT_CHILD = SERVERAPI + "user/getReportChilds";
const REPORT_TURN_BACK_INFO = SERVERAPI + "report/getTurnBackInfo";
const CALL_DATA_TURN_BACK_INFO = SERVERAPI + "report/getTurnBackCylinders";
const GET_CHILD_END_NUMBER_IMPORT =
  SERVERAPI + "report/getChildAndNumberImportByDateTime";
const GET_CHILD_END_NUMBER_EXPORT = SERVERAPI + "imex/getExport";
//&searchs[0][type]=$searchs[0][type]&searchs[0][contents][0]=$searchs[0][contents][0]&searchs[0][contents][1]=$searchs[0][contents][1]&searchs[0][contents][2]=$searchs[0][contents][2]&searchs[0][contents][3]=$searchs[0][contents][3];
const EXPORT_CYLINDER_BY_HISTORY =
  SERVERAPI + "report/getCylinderHistoryExcels";
const EXPORT_REPORT_BY_TARGET_AND_DATETIME =
  SERVERAPI + "report/getReportExcels";
const GETALLSTATION = SERVERAPI + "regionCompany/getListRegion?id=$id";
const GETALLPERSONNEL = SERVERAPI + "regionCompany/getListPersonnel?id=$id";
const ADDALLSTATION = SERVERAPI + "regionCompany/createRegion";
const TOTALCYLINDERCREATE = SERVERAPI + "imex/getStatistics";
const GETLISTSTATION = SERVERAPI + "user/getListUserByTpe";
const GETALLTRANSINVOICE = SERVERAPI + "transinvoice/getAllTransInvoice";
const GETORDERGASBYCODE = SERVERAPI + "ordergas/getOrderGasByCode";
const CREATETRANSINVOICE = SERVERAPI + "transinvoice/createTransInvoice";
const GETTYPECUSTOMER = SERVERAPI + "user/getListByCustomerType";
const GETLISTBRANCH = SERVERAPI + "user/getListBranch";
const GETALLPROVINCE = SERVERAPI + "region/getAllRegion";
const CHECKCYLINDERSFORORDER =
  SERVERAPI + "order/getCylinderInformationForOrder";
const AUTOCREATECYLYNDER = SERVERAPI + "cylinder/autoGenerateCylinder";
const CREATEEXPORTORDERHISTORY = SERVERAPI + "history/createExportOrderHistory";
const GETALLSHIPPINGORDER =
  SERVERAPI + "shippingorder/getAllShippingOrder?userId=";
const CREATESHIPPINGORDER = SERVERAPI + "shippingorder/create";
const GETSHIPPINGORDER = SERVERAPI + "shippingorder/getShippingOrderById";
const UPDATEDRIVERSHIPPINGORDER =
  SERVERAPI + "shippingorder/updateShippingOrder";
const UPDATESHIPPINGORDERDETAIL =
  SERVERAPI + "shippingorderdetail/updateShippingOrderDetail";
const DELETESHIPPINGORDERNOTE = SERVERAPI + "shippingorder/updateNote";
const UPDATESHIPPINGCUSTOMERDETAIL =
  SERVERAPI + "shippingcustomerdetail/updateShippingCustomerDetail";
const UPDATEORDEROLD = SERVERAPI + "shippingorderdetail/updateProvince";
const UPDATESHIPPINGTEXTDETAIL =
  SERVERAPI + "shippingtextdetail/updateShippingTextDetail";
const SEARCHSHIPPINGORDERCODE =
  SERVERAPI + "order/findOrder?orderCode=$orderCode";
const DELETESHIPPINGCUSTOMERDETAIL =
  SERVERAPI + "shippingcustomerdetail/cancelShippingCustomerDetail";
const RETURNSHIPPINGORDER = SERVERAPI + "shippingOrder/return";
const GET_LISTREASON = SERVERAPI + "reason/showListReason";
const GET_QUANTITYREASO = SERVERAPI + "history/error";
const GETALL_USERTYPE = SERVERAPI + "userType/getAllUserType";
const CREATE_USERTYPE = SERVERAPI + "userType/createUserType";
const DELETE_USERTYPE = SERVERAPI + "userType/deleteUserType";
const UPDATE_USERTYPE = SERVERAPI + "userType/updateUserType";
const GETDETAILEXPORTORDER = SERVERAPI + "order/getDetailExportOrder";
const GETORDERHISTORIES = SERVERAPI + "order/getOrderHistories";
const DELETE_ORDER = SERVERAPI + "order/deleteOrder/$order_Id";
const GETEXPORTDATAPRINT = SERVERAPI + "print/getExportDataPrint";
const GETALLCARRIER = SERVERAPI + "carrier/getAllCarrier";
const GETALLTRANSINVOICEDETAIL =
  SERVERAPI + "transinvoicedetail/getDetailOfTransInvoice?transInvoiceId=$id";
const SEND_REPORT = SERVERAPI + "SendNotification";
const SENDNOTIFICATION = SERVERAPI + "SendNotificationForEachDevice";
const GETALLUSERSYSTEM = SERVERAPI + "systemuser/getAllSystemUser";
const ADDUSERSYSTEM = SERVERAPI + "systemuser/createSystemUser";
const UPDATEUSERSYSTEM = SERVERAPI + "systemuser/updateSystemUser";
const DELETEUSERSYSTEM = SERVERAPI + "systemuser/deleteSystemUser";
const UPDATEPASSWORD = SERVERAPI + "systemuser/updatePasswordSystemUser";
const GETLOCATION_TRANSINVOICEDETAIL =
  SERVERAPI + "translocationinvoice/getLocationBytransInvoiceDetailId";
const DELETE_TRANSINVOICE = SERVERAPI + "transinvoice/cancelTransInvoice";
const GETORDER_OF_ORDERGASDETAIL = SERVERAPI + "ordergas/searchOrderGas";
const GETALLUSERDELETED = SERVERAPI + "systemuser/getAllSystemUserDeleted";
const GET_SYSTEMPAGEBYLEVEL = SERVERAPI + "systemPage/getSystemPageByLevel/";
const GETALL_SYSTEMUSERTYPEPAGE =
  SERVERAPI + "systemUserTypePage/getAllSystemUserTypePage";
const CREATE_SYSTEMUSERTYPEPAGE =
  SERVERAPI + "systemUserTypePage/createSystemUserTypePage";
const UPDATE_SYSTEMUSERTYPEPAGE =
  SERVERAPI + "systemUserTypePage/updateSystemUserTypePage";
const DELETE_SYSTEMUSERTYPEPAGE =
  SERVERAPI + "systemUserTypePage/deleteSystemUserTypePage";
const GETLISTGENERAL = SERVERAPI + "user/getListGeneral";
const GETLISTAGENCY = SERVERAPI + "user/getListAgency";
const CREATE_CYLINDERGAS = SERVERAPI + "cylindergas/create";
const SEARCH_CYLINDERGAS = SERVERAPI + "cylindergas/getCylinder?serial=$serial";
const UPDATE_CYLINDERGAS = SERVERAPI + "cylindergas/updateCylinder";
const DELETE_CYLINDERGAS = SERVERAPI + "cylindergas/removeCylinder";
const GETALL_CARRIER = SERVERAPI + "carrier/getAllCarrier";
const CREATE_CARRIER = SERVERAPI + "carrier/createCarrier";
const UPDATE_CARRIER = SERVERAPI + "carrier/updateCarrier";
const CANCEL_CARRIER = SERVERAPI + "carrier/cancelCarrier";
const CHANGEPASSWORD_CARRIER = SERVERAPI + "carrier/adminChangePassword";
const GETWAREHOUSE = SERVERAPI + "user/getWareHouse";
const GETALL_WAREHOUSE = SERVERAPI + "warehouse/getAllWareHouse";
const GET_WAREHOUSEBYID = SERVERAPI + "warehouse/getWareHouseById";
const CREATE_WAREHOUSE = SERVERAPI + "warehouse/createWareHouse";
const UPDATE_WAREHOUSE = SERVERAPI + "warehouse/updateWareHouse";
const DELETE_WAREHOUSE = SERVERAPI + "warehouse/deleteWareHouse";
const CREATECUSTOMER = SERVERAPI + "CustomerGas/createCustomerGas";
const DELETECUSTOMER = SERVERAPI + "CustomerGas/deletedCustomerGas";
const UPDATECUSTOMER = SERVERAPI + "CustomerGas/updateCustomerGas";
const GETALLCUSTOMERPLAN = SERVERAPI + "customerGasPlan/getAll";
const GETCUSTOMERPLANBYID = SERVERAPI + "customerGasPlan/getById";
const CREATECUSTOMERPLAN = SERVERAPI + "customerGasPlan/create";
const UPDATECUSTOMERPLAN = SERVERAPI + "customerGasPlan/update";
const DELETECUSTOMERPLAN = SERVERAPI + "customerGasPlan/delete";
const GET_STATIONBYID = SERVERAPI + "user/getInforById";
const CREATEDUPLICATECYLINDER = SERVERAPI + "cylinder/createDuplicate";
const GETPRINTGETTURNBACKTDATAPRINT = SERVERAPI + "print/getTurnbacktDataPrint";
const GETDATAGETACTIONDATA = SERVERAPI + "data/getActionData";
const CREATE_WAREHOUSEPLAN = SERVERAPI + "warehouseplan/createWareHousePlan";
const GETALL_WAREHOUSEPLANBYWAREHOUSEID =
  SERVERAPI +
  "warehouseplan/getAllWareHousePlanByWareHouseId?warehouseId=$wareHouseId";
const UPDATE_WAREHOUSEPLAN = SERVERAPI + "warehouseplan/updateWareHousePlan";
const DELETE_WAREHOUSEPLAN = SERVERAPI + "warehouseplan/deleteWareHousePlan";
const IMPORTCYLINDERDUPLICATE =
  SERVERAPI + "cylinder/importDuplicateFromSubsidiary";
const SHIPPINGORDERLOCATION =
  SERVERAPI + "shippingorderlocation/getLocationByShippingOrderDetailID";
const ADDTRUCK = SERVERAPI + "truck/createTruck";
const GETTRUCK = SERVERAPI + "truck/getListTruck";
const UPDATETRUCK = SERVERAPI + "truck/updateTruck";
const VEHICLE_TRUCK = SERVERAPI + "vehicle/truck";
const VEHICLE_TRUCK_EXCEL = SERVERAPI + "vehicle/truck/excel";
const GETLISTTRUCKEXCEL = SERVERAPI + "truck/getExcelTruck";
const DELETETRUCK = SERVERAPI + "Truck/delTruck";
const GETCYLINDERDUPLICATE = SERVERAPI + "cylinder/getCylinderDuplicate";
const EXCELCYLINDERDUPLICATE =
  SERVERAPI + "cylinder/getCylinderDuplicateExcels";
const TURNBACKCYLINDERDUPLICATE = SERVERAPI + "history/turnBackCylinder";
const DELETE_SYSTEM_MENU = SERVERAPI + "SystemPageMenu/cancelSystemPageMenu";
const GETALL_SYSTEMPAGES = SERVERAPI + "systemPage/getAllSystemPage";
const CREATE_SYSTEM_MENU = SERVERAPI + "SystemPageMenu/createPageMenu";
const UPDATE_SYSTEM_MENU = SERVERAPI + "SystemPageMenu/updateSystemPageMenu";
const GETCUSTOMER = SERVERAPI + "CustomerGas/getAllCustomer";
const GETCUSTOMERBYID = SERVERAPI + "CustomerGas/getCustomerGasById";
const GETALL_SYSTEMPAGEMENU = SERVERAPI + "SystemPageMenu/getAll";
const GETALLEXPORTORDER = SERVERAPI + "ExportOrder/getAllExportOrder";
const CREATEEXPORTORDER = SERVERAPI + "ExportOrder/createExportOrder";
const UPDATEEXPORTORDER = SERVERAPI + "ExportOrder/updateExportOrder";
const DELETEEXPORTORDER = SERVERAPI + "ExportOrder/deleteExportOrder";
const GETALLORDERTANK = SERVERAPI + "ordertank/getAllOrderTank";
const FINDORDERTANK = SERVERAPI + "ordertank/getOrderTankByOrderCode";
const GETALLCUSTOMERRECEIVE = SERVERAPI + "user/getAllUserOfParent";
const DELETEORDERTANK = SERVERAPI + "ordertank/deleteOrderTank";
const GETEXPORTORDERID = SERVERAPI + "ExportOrder/getExportOrderByID";
const EXPORTCYLINDERDUPLICATE = SERVERAPI + "cylinder/ExportDuplicateCylinder";
const GET_ALL_SETTING = SERVERAPI + "SystemSetting/getAllSystemSetting";
const GET_CREATE_SETTING = SERVERAPI + "SystemSetting/createSystemSetting";
const GET_UPDATE_SETTING = SERVERAPI + "SystemSetting/updateSystemSetting";
const GET_DELETE_SETTING = SERVERAPI + "SystemSetting/deletedSystemSetting";
const IMPORTCYLINDERDUPLICATES = SERVERAPI + "cylinder/ImportDuplicateCylinder";
const GETEXPORTPLACE = SERVERAPI + "cylinder/getExportPlace";
const GET_ORDERTANKBYCUSTOMERGASID =
  SERVERAPI + "ordertank/getOrderTankByCustomerGasId";
const EXPORT_WAREHOUSE = SERVERAPI + "importexport/ManageImportExportWareHouse";
const FINDORDERTANKBYNAME =
  SERVERAPI + "ordertank/getOrderTankByCustomerGasName";
const CONFIRMATIONSTATUS = SERVERAPI + "ExportOrder/confirmationStatus";
const BACKSTATUS = SERVERAPI + "ExportOrder/backStatus";
const CONFIRMATIONORDERSTATUS =
  SERVERAPI + "ExportOrder/changeExportOrderStatus";
const GETLOCATION_EXPORTDETAIL =
  SERVERAPI + "exportorderlocation/getLocationByOrderTankID?orderTankID={id}";
const UPDATEORDEREXPORTDETAIL =
  SERVERAPI + "ExportOrderDetail/updateExportOrderDetail";
const GET_USERTYPEBYID = SERVERAPI + "userType/getUserTypeById";
const GETDASHBOARDFIXER = SERVERAPI + "imex/searchCylindersImex";
const DETAILDASHBOARDFIXER = SERVERAPI + "imex/detailCylindersImex";
const GETDASHBOARD = SERVERAPI + "reportVer2/getStatistic";
const GETDASHBOARD_KHO_XE = SERVERAPI + "reportVer2/getStatisticKhoXe";
const GETAGGREGATEDASHBOARD = SERVERAPI + "reportVer2/getAggregate";
const GETAGGREGATEDASHBOARD_KHO_XE = SERVERAPI + "reportVer2/getAggregateKhoXe";
const GETHISTORIESBYTYPE = SERVERAPI + "history/getHistoriesByType";
const GETHISTORYCYLINDERLIST =
  SERVERAPI + "cylinder/historyCylinder?cylinderId=$cylinderId";
const GETIMEXLOCATIONCYLINDERSIMEX = SERVERAPI + "imex/locationCylindersImex";
const GETEXPORTCHART = SERVERAPI + "reportVer2/getExportChart";
const GET_IMPORT_EXPORT_ORDER_TANK_TRUCK =
  SERVERAPI + "importexport/manageWareHouse";
const GET_CUSTOMER_BY_GAS_BY_CODE =
  SERVERAPI + "CustomerGas/getCustomerGasByCode";
const CREATE_ORDER_TANK_TRUCK = SERVERAPI + "ordertank/createOrderTank";
const UPDATE_ORDER_TANK_TRUCK = SERVERAPI + "ordertank/updateOrderTank";
const IMEXGETDETAILCYLINDERSIMEXEXCELS =
  SERVERAPI + "imex/getDetailCylindersImexExcels";
const ACCESSRIGHT = SERVERAPI + "systemPage/aceessRight";
const LOGIN_SYSTEMUSER = SERVERAPI + "systemuser/login";
const CREATESYSTEMPAGE = SERVERAPI + "systemPage/creteSystemPage";
const HISTORYGETCYLINDERHISTORYEXCELS =
  SERVERAPI + "history/getCylinderHistoryExcels";
const FIND_DESTINATION = SERVERAPI + "cylinder/getDestinationBySerial";
const CHANGE_STATUS = SERVERAPI + "ordertank/changeStatus";
const HISTORY_NOTE = SERVERAPI + "ordertank/getHistoryNote?orderTankID=$id";
const CHANGESTATUS = SERVERAPI + "order/changeStatus";
const GETORDERSOFGASTANK = SERVERAPI + "order/getOrdersOfGasTank";
const GET_ALL_LIST_CUSTOMER = SERVERAPI + "user/getListUserCustomer";
const GET_LIST_CUSTOMER_BY_TYPE =
  SERVERAPI + "user/getListUserByType?isChildOf=$id&customerType=$type";
const AUTOCREATECYLINDER = SERVERAPI + "cylinder/autoCreateCylinder";
const GET_FIXER_STATION = SERVERAPI + "user/getFixerAndStation";
const GETALLSUPPORT = SERVERAPI + "support/getAllSupport";
const CREATESUPPORT = SERVERAPI + "support/create";
const DELETESUPPORT = SERVERAPI + "support/deleted";
const UPDATESUPPORT = SERVERAPI + "support/update";
const DELETEONEIMG = SERVERAPI + "support/removeImage";
const UPDATECONTENTSUPPORT = SERVERAPI + "support/updateContent";
const UPDATEIMAGESUPPORT = SERVERAPI + "support/uploadImage";
const ODERDETAIL = SERVERAPI + "orderDetail/createOrderDetail";
const UPDATE_ORDERDETAIL = SERVERAPI + "orderDetail/update";
const GET_PRICE_ORDER = SERVERAPI + "typepricedetail/getPriceOfCustomers";
const GET_IDDEVICE = SERVERAPI + "orderGS/getUserByCode";
const GETALL_EXPORTORDER_BYORDERTANKID =
  SERVERAPI +
  "ExportOrderDetail/getAllExportOrderOByOrderTankID?_orderTankID=$id";
const CREATERETURNCYLINDERS = SERVERAPI + "cylinder/returnCylinders";
const EXPORTWITHOUTCODE = SERVERAPI + "cylinder/createExportHistory";
const IMPORTWITHOUTCODE = SERVERAPI + "cylinder/createImportHistory";
const SHELLCYLINDER = SERVERAPI + "cylinder/createLiquidationHistory";
const GET_TOTALIMPORT = SERVERAPI + "statistic/non-serial/getTotalImport";
const GET_TOTALLIQUIDATION =
  SERVERAPI + "statistic/non-serial/getTotalLiquidation";
const GET_TOTALEXPORT = SERVERAPI + "statistic/non-serial/getTotalExport";
const GET_STATISTICSELL = SERVERAPI + "history/statisticSell";
const GETAREABYSTATIONID = SERVERAPI + "area?StationID=${StationID}";
const GETFILTERAPI =
  SERVERAPI +
  "orderGS/Customers/getFromTo?From=${startDay}&To=${endDay}&objectId=${customerId}";
const DELETEORDERDETAILITEM =
  SERVERAPI + "orderDetail/delete?id=${itemId}&userid=${userId}";
const DELETE_USERBYID =
  SERVERAPI + "user/deleteUserById?id=${itemId}&userid=${userId}";
const ACCESS_ORDER = SERVERAPI + "orderGS/acpOrdercomplete";
const GETSTATISTICEXCEL = SERVERAPI + "history/statisticExcel";
const CREATEORDERGASPLAN = SERVERAPI + "ordergas/createOrderGasPlan";
const GET_CYLINDER_UPDATE_HISTORY = SERVERAPI + "cylinder/update-history";

// Statistic Ver 2
const GET_STATISTIC_BY_STATION = SERVERAPI + "reportVer3/getStatistic";
const GET_STATISTIC_ALL_REGION = SERVERAPI + "reportVer3/getAggregate";
const GET_STATISTIC_REPAIR_FACTORY =
  SERVERAPI + "reportVer3/getAggregateRepairFactory";

// Statistic Ver 2
const GET_STATISTIC_BY_STATION_KHO_XE =
  SERVERAPI + "reportVer3/getStatisticKhoXe";
const GET_STATISTIC_ALL_REGION_KHO_XE =
  SERVERAPI + "reportVer3/getAggregateKhoXe";
const GET_STATISTIC_REPAIR_FACTORY_KHO_XE =
  SERVERAPI + "reportVer3/getAggregateRepairFactoryKhoXe";

export {
  GETSTATISTICEXCEL,
  GET_LIST_CUSTOMER_BY_TYPE,
  IMPORTPRODUCTSUBSIDIARY,
  GETALLCHILD,
  FIXER,
  GETUSERINFOR,
  GETDRIVERIMPORTCYLINDER,
  IMPORTCYLINDERBYEXCEL,
  ACCEPTREQUEST,
  TOPEXPORTCYLINDER,
  GETREQIMPORT,
  GETCOMPANYTOFIX,
  GETORDERFACTORY,
  UPDATEORDER,
  GETSTAFF,
  GETALLORDER,
  CREATEORDER,
  CREATECALENDERINSPECTOR,
  GETINSPECTOR,
  NAMEDRIVE,
  GETSTOCKGAS,
  GETDRIVE,
  URLSERVERIMAGE,
  GETAVATARUSER,
  CHANGEPASSWORD,
  CHANGINFOREUSER,
  UPDATEBRANDINFORMATION,
  GETHISTORYIMPORTURLUPDATEFOREXPORTFORSALE,
  UPDATEPRICEURL,
  GETHISTORYIMPORTURLUPDATEFOREXPORT,
  GETHISTORYIMPORTURL,
  GETREPORTIMPORTOREXPORTURL,
  SEARCHSERIAL,
  ADDUSERURL,
  ADDREPORTURL,
  GETALLREPORT,
  ADDPRODUCTURL,
  IMPORTPRODUCT,
  GETALLCYLINDER,
  GETALLUSERURL,
  LOGINURL,
  UPDATE_VERIFIED_DATES,
  REGISTERURL,
  GETCYLINDERBYID,
  GETCYLINDERBYSERIAL,
  CREATEHISTORY,
  DELETEUSER,
  GETDESTINATIONURL,
  GETALLMANUFACTURER,
  GETALLTYPEGAS,
  DELETEMANUFACTURER,
  ADDMANUFACTURER,
  GETINFORMATIONCYLINDERS,
  DELETEPRODUCTURL,
  SEARCHCYLINDER,
  LISTHISTORYPRICE,
  UPDATEPRODUCT,
  PRICEHISTORY,
  GETLISTCUSTOMER,
  GETALLFACTORY,
  PARTNER,
  FIXER_PARTNER,
  EXPORT_PLACE,
  REPORT_CHART,
  REPORT_PIE_CHART,
  GET_REPORT_CHILD,
  REPORT_TURN_BACK_INFO,
  CALL_DATA_TURN_BACK_INFO,
  GET_CHILD_END_NUMBER_IMPORT,
  GET_CHILD_END_NUMBER_EXPORT,
  EXPORT_CYLINDER_BY_HISTORY,
  UPDATEUSERURL,
  EXPORT_REPORT_BY_TARGET_AND_DATETIME,
  GETALLREPORTNEW,
  GETLISTSCHEDULE,
  GETINFORMATIONCYLINDERSEXCEL,
  GETLISTMANUFACTURE,
  DELETEREQUEST,
  ADDCYLINDERCANCEL,
  ADDPRODUCTTYPEURL,
  GETALLSTATION,
  GETALLPERSONNEL,
  ADDALLSTATION,
  GETALLBRANCH,
  ADDBRANCH,
  TOTALCYLINDERCREATE,
  GETLISTSTATION,
  GETALLTRANSINVOICE,
  GETTYPECUSTOMER,
  GETLISTBRANCH,
  GETALLPROVINCE,
  CHECKCYLINDERSFORORDER,
  AUTOCREATECYLYNDER,
  CREATEEXPORTORDERHISTORY,
  GETALLSHIPPINGORDER,
  CREATESHIPPINGORDER,
  GETORDERGASBYCODE,
  CREATETRANSINVOICE,
  GETSHIPPINGORDER,
  UPDATEDRIVERSHIPPINGORDER,
  UPDATESHIPPINGORDERDETAIL,
  DELETESHIPPINGORDERNOTE,
  UPDATESHIPPINGCUSTOMERDETAIL,
  UPDATEORDEROLD,
  UPDATESHIPPINGTEXTDETAIL,
  SEARCHSHIPPINGORDERCODE,
  DELETESHIPPINGCUSTOMERDETAIL,
  RETURNSHIPPINGORDER,
  GETALL_USERTYPE,
  CREATE_USERTYPE,
  DELETE_USERTYPE,
  UPDATE_USERTYPE,
  GETDETAILEXPORTORDER,
  GETORDERHISTORIES,
  DELETE_ORDER,
  GETEXPORTDATAPRINT,
  GETALLCARRIER,
  GETALLTRANSINVOICEDETAIL,
  SEND_REPORT,
  SENDNOTIFICATION,
  GETALLUSERSYSTEM,
  ADDUSERSYSTEM,
  UPDATEUSERSYSTEM,
  DELETEUSERSYSTEM,
  UPDATEPASSWORD,
  GETLOCATION_TRANSINVOICEDETAIL,
  DELETE_TRANSINVOICE,
  GETORDER_OF_ORDERGASDETAIL,
  GETALLUSERDELETED,
  GET_SYSTEMPAGEBYLEVEL,
  GETALL_SYSTEMUSERTYPEPAGE,
  CREATE_SYSTEMUSERTYPEPAGE,
  UPDATE_SYSTEMUSERTYPEPAGE,
  DELETE_SYSTEMUSERTYPEPAGE,
  GETLISTGENERAL,
  GETLISTAGENCY,
  CREATE_CYLINDERGAS,
  SEARCH_CYLINDERGAS,
  UPDATE_CYLINDERGAS,
  DELETE_CYLINDERGAS,
  GETALL_CARRIER,
  CREATE_CARRIER,
  UPDATE_CARRIER,
  CANCEL_CARRIER,
  CHANGEPASSWORD_CARRIER,
  GETALL_WAREHOUSE,
  GETWAREHOUSE,
  GET_WAREHOUSEBYID,
  CREATE_WAREHOUSE,
  UPDATE_WAREHOUSE,
  DELETE_WAREHOUSE,
  CREATECUSTOMER,
  DELETECUSTOMER,
  CREATEDUPLICATECYLINDER,
  GET_STATIONBYID,
  UPDATECUSTOMER,
  GETALLCUSTOMERPLAN,
  GETCUSTOMERPLANBYID,
  CREATECUSTOMERPLAN,
  UPDATECUSTOMERPLAN,
  DELETECUSTOMERPLAN,
  GETPRINTGETTURNBACKTDATAPRINT,
  GETDATAGETACTIONDATA,
  GETALL_WAREHOUSEPLANBYWAREHOUSEID,
  CREATE_WAREHOUSEPLAN,
  UPDATE_WAREHOUSEPLAN,
  DELETE_WAREHOUSEPLAN,
  IMPORTCYLINDERDUPLICATE,
  SHIPPINGORDERLOCATION,
  GETCYLINDERDUPLICATE,
  EXCELCYLINDERDUPLICATE,
  TURNBACKCYLINDERDUPLICATE,
  DELETE_SYSTEM_MENU,
  GETALL_SYSTEMPAGES,
  CREATE_SYSTEM_MENU,
  UPDATE_SYSTEM_MENU,
  ADDTRUCK,
  UPDATETRUCK,
  GETTRUCK,
  VEHICLE_TRUCK,
  VEHICLE_TRUCK_EXCEL,
  GETLISTTRUCKEXCEL,
  DELETETRUCK,
  GETCUSTOMER,
  GETCUSTOMERBYID,
  GETALL_SYSTEMPAGEMENU,
  GETALLEXPORTORDER,
  CREATEEXPORTORDER,
  DELETEEXPORTORDER,
  GETALLORDERTANK,
  FINDORDERTANK,
  GETEXPORTORDERID,
  DELETEORDERTANK,
  GETALLCUSTOMERRECEIVE,
  UPDATEEXPORTORDER,
  EXPORTCYLINDERDUPLICATE,
  GET_ALL_SETTING,
  GET_CREATE_SETTING,
  GET_UPDATE_SETTING,
  GET_DELETE_SETTING,
  IMPORTCYLINDERDUPLICATES,
  GETEXPORTPLACE,
  GET_ORDERTANKBYCUSTOMERGASID,
  EXPORT_WAREHOUSE,
  FINDORDERTANKBYNAME,
  CONFIRMATIONSTATUS,
  BACKSTATUS,
  UPDATE_VERIFIED_DATES_EXCELL,
  CONFIRMATIONORDERSTATUS,
  GETLOCATION_EXPORTDETAIL,
  UPDATEORDEREXPORTDETAIL,
  GET_USERTYPEBYID,
  GETDASHBOARDFIXER,
  DETAILDASHBOARDFIXER,
  GETDASHBOARD,
  GETDASHBOARD_KHO_XE,
  GETAGGREGATEDASHBOARD,
  GETAGGREGATEDASHBOARD_KHO_XE,
  GETHISTORIESBYTYPE,
  GETHISTORYCYLINDERLIST,
  GETIMEXLOCATIONCYLINDERSIMEX,
  GETEXPORTCHART,
  GET_IMPORT_EXPORT_ORDER_TANK_TRUCK,
  GET_CUSTOMER_BY_GAS_BY_CODE,
  CREATE_ORDER_TANK_TRUCK,
  UPDATE_ORDER_TANK_TRUCK,
  IMEXGETDETAILCYLINDERSIMEXEXCELS,
  ACCESSRIGHT,
  LOGIN_SYSTEMUSER,
  CREATESYSTEMPAGE,
  HISTORYGETCYLINDERHISTORYEXCELS,
  FIND_DESTINATION,
  CHANGE_STATUS,
  HISTORY_NOTE,
  CHANGESTATUS,
  GETORDERSOFGASTANK,
  GET_ALL_LIST_CUSTOMER,
  AUTOCREATECYLINDER,
  GET_FIXER_STATION,
  GETALLSUPPORT,
  CREATESUPPORT,
  DELETESUPPORT,
  UPDATESUPPORT,
  DELETEONEIMG,
  UPDATECONTENTSUPPORT,
  UPDATEIMAGESUPPORT,
  GETALL_EXPORTORDER_BYORDERTANKID,
  GETINFORMATIONCYLINDERSRETURN,
  CREATERETURNCYLINDERS,
  EXPORTWITHOUTCODE,
  IMPORTWITHOUTCODE,
  SHELLCYLINDER,
  GET_TOTALIMPORT,
  GET_TOTALLIQUIDATION,
  GET_TOTALEXPORT,
  GETAREABYSTATIONID,
  GETFILTERAPI,
  DELETEORDERDETAILITEM,
  DELETE_USERBYID,
  ODERDETAIL,
  UPDATE_ORDERDETAIL,
  ACCESS_ORDER,
  GET_LISTREASON,
  GET_QUANTITYREASO,
  GET_ALLERROR_REASION,
  UPDATE_REASION,
  GET_PRICE_ORDER,
  GET_IDDEVICE,
  GET_STATISTICSELL,
  CREATEORDERGASPLAN,
  SERVERAPI,
  GET_CYLINDER_UPDATE_HISTORY,
  GET_STATISTIC_BY_STATION,
  GET_STATISTIC_ALL_REGION,
  GET_STATISTIC_REPAIR_FACTORY,
  GET_STATISTIC_BY_STATION_KHO_XE,
  GET_STATISTIC_ALL_REGION_KHO_XE,
  GET_STATISTIC_REPAIR_FACTORY_KHO_XE,
};
