import React, { Component } from "react";
import {
  CREATEORDER,
  GETALLORDER,
  GETORDERHISTORIES,
  DELETE_ORDER,
  CANCELSHIPPINGORDER,
} from "./../../../config/config";
import {
  Row,
  Col,
  Input,
  Button,
  Table,
  Icon,
  Dropdown,
  Badge,
  Menu,
  Switch,
  Radio,
  Form,
  DatePicker,
  Tooltip,
  Modal
} from "antd";
import "./CreateOrder.scss";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "getUserCookies";
import ViewOrderHistories from "./viewOrderHistories";
import EditOrder from "./editOrder";
import Highlighter from "react-highlight-words";
import Constants from "Constants";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import getDetailExportOrderAPI from "../../../../api/getDetailExportOrderAPI";
import deleteOrderAPI from "../../../../api/deleteOrderAPI";
import showToast from "showToast";
import ImportPrinter from "./../printer/ImportPrinter";
import getExportDataPrint from "../../../../api/getExportDataPrint";
import "./ListOrder.scss";
const { RangePicker } = DatePicker;

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

class ListOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
      data: [],
      isLoading: false,
      isLoadingViewOrderHistories: false,
      isLoadingViewEditOrder: false,
      viewingRecord: "",
      //
      listOrderNow: [],
      listOrderOld: [],
      listOrderOldBegin: [],
      listOrderNowBegin: [],
      listMenuCreateOrderTableExcel: [],
      //
      listAllOrder: [],
      orderHistories: [],

      //
      bordered: true,
      enableFilter: false,
      size: "default",
      warning: "none",
      warningValue: "none",
      startDate: "",
      endDate: "",

      // Print
      text: "AAA",
      // enablePrint: false,
      editingKey: "",
      exportDataPrint: [],

      // detailExportData
      detailDataExport: [],
      dataSource: [],
      //
      openModalCancel: false,
      reasonCancelOrder:"",
      orderShippingId:'',
    };
  }

  isEditing = (record) => record.key === this.state.editingKey;

  edit(key) {
    // // console.log('key', key)
    this.setState({ editingKey: key });
  }

  getAllOrder = async (id, token) => {
    this.setState({ isLoading: true });
    let user_cookies = await getUserCookies();
    let parmas = {
      orderCreatedBy: user_cookies.user.id,
    };
    await callApi("POST", GETALLORDER, parmas, token).then((res) => {
      let temp = [];
      //  console.log("data order", res.data);
      let i = 0;
      for (let item of res.data.order) {
        temp.push({
          key: i,
          orderId: item.id ? item.id : "",
          //customerCode: item.customerId.id,
          orderCode: item.orderCode ? item.orderCode : "",
          customerId: item.customerId ? item.customerId.name : "",
          agencyId: item.agencyId ? item.agencyId.name : "",
          type: item.type == "B" ? "Bình" : "Vỏ",
          // warehouseId: item.warehouseId
          //valve: item.valve ? item.valve : '',
          //color: item.color ? item.color : '',
          // time: moment(item.time).format("HH:mm:ss"),
          //cylinderType: item.cylinderType ? item.cylinderType.name : '',
          // listCylinder: item.listCylinder,
          // listCylinder: item.listCylinder,
          note: item.note ? item.note : "",
          // status: item.status === "INIT" ? '' : item.status,

          // idCustomer: item.idCustomer.name,
          // idBranch: item.idBranch.name,
          // numberCylinders: item.numberCylinders ? item.numberCylinders : 0,
          listCylinder: item.listCylinder ? item.listCylinder : [],
          warehouseId: item.warehouseId ? item.warehouseId.name : "",
          // date: moment(item.orderDate).format("DD/MM/YYYY"),
          // expected_DeliveryDate: item.expected_DeliveryDate,
          createdAt: item.createdAt ? item.createdAt : "",
          expected_DeliveryDate: moment(item.deliveryDate).format("DD/MM/YYYY"),
          expected_DeliveryTime: moment(item.deliveryDate).format("HH:mm"),
          deliveryDate: item.deliveryDate ? item.deliveryDate : "",
          // status: item.status === "INIT" ? "Khởi tạo"
          // : item.status === "CONFIRMED" ? "Đã xác nhận đơn hàng"
          // : item.status === "DELIVERING" ? "Đang vận chuyển"
          // : item.status === "DELIVERED" ? "Đã giao"
          // : item.status === "COMPLETED" ? "Đã hoàn thành"
          // : item.status === "CANCELLED" ? "Đã bị hủy"
          // : item.status,
          status: item.status ? item.status : "",
        });
        i++;
      }

      //console.log("tempTest",Date.parse((temp[1].deliveryDate)));
      let listOrderNowDay = [];
      let listOrderOldDay = [];
      temp.map((item, index) => {
        // // console.log("item[index]",item.deliveryDate);
        let createdAtDate = item.createdAt;
        let endDay = new Date().setHours(23, 59, 59, 999);
        let start = new Date().setHours(0, 0, 0, 0);
        if (Date.parse(createdAtDate) >= start) {
          // console.log("Date.parse((item[index].deliveryDate))",Date.parse((item.deliveryDate)));
          listOrderNowDay.push(item);
        } else if (Date.parse(createdAtDate) < start) {
          listOrderOldDay.push(item);
        }
      });
      // console.log("listOrderNowDay",listOrderNowDay);
      // console.log("listOrderNowDay",listOrderOldDay);
      // console.log("listAllOrder11111111111",this.state.listAllOrder);

      this.setState({
        listAllOrder: temp,
        isLoading: false,
        listOrderNow: listOrderNowDay,
        listOrderOld: listOrderOldDay,
        listOrderOldBegin: listOrderOldDay,
        listOrderNowBegin: listOrderNowDay,
      });
    });
  };
  refresh() {
    this.forceUpdate(async () => {
      await this.getAllOrder();
    });
  }
  // async deleteOrderAPI(record) {
  //   var answer = window.confirm("Xóa");
  //   let order;
  //   if (answer) {
  //     order = await deleteOrderAPI(record);
  //     if (order) {
  //       console.log("order", order, "record", record);
  //       if (order.status === Constants.HTTP_SUCCESS_BODY) {
  //         showToast("DELETE_SUCCESS", 3000);
  //         this.refresh();
  //         return true;
  //       } else {
  //         showToast(
  //           order.data.message ? order.data.message : order.data.err_msg,
  //           2000
  //         );
  //         return false;
  //       }
  //     } else {
  //       showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
  //       return false;
  //     }
  //   }
  //   // console.log('register',order);
  // }

  handleCancelOrder = (record) => {

  }

  handleButtonExportExcel = () => {
    const data = this.state.listOrderNow.filter((order) => {
      // console.log("order.status",order.status);
      return order.status === "INIT";
    });
    console.log("data1111111111", data);
    let dataTable = [];
    let binh12A = [];
    let binh45A = [];
    let binh50A = [];
    let binh12COA = [];
    if (data) {
      for (let item in data) {
        // console.log("dataListOrderNow",data);
        for (let i = 0; i < data[item].listCylinder.length; i++) {
          console.log("data[item].listCylinder[i]", data[item].listCylinder[i]);
          if (data[item].listCylinder[i].cylinderType === "CYL50KG") {
            binh50A += parseInt(data[item].listCylinder[i].numberCylinders, 10);
          }
          // }if (data[item].listCylinder.cylinderType === "CYL45KG") {
          //     binh45A = binh45A + parseInt(data[item].listCylinder[i].numberCylinders,10);
          // } else  {
          //       binh12A = binh12A + parseInt(data[item].listCylinder[i].numberCylinders,10);
          // }
        }
        binh50A = data[item].listCylinder.filter((item) => {
          return item.cylinderType === "CYL50KG";
        });
        let count50 = 0;
        for (let i = 0; i < binh50A.length; i++) {
          count50 += +binh50A[i].numberCylinders;
        }
        console.log("count50", count50);
        console.log("binh50", binh50A);

        binh45A = data[item].listCylinder.filter((item) => {
          return item.cylinderType === "CYL45KG";
        });
        let count45 = 0;
        for (let i = 0; i < binh45A.length; i++) {
          count45 += +binh45A[i].numberCylinders;
        }
        console.log("count45", count45);
        console.log("binh45", binh45A);

        console.log("binh45", binh45A);
        binh12A = data[item].listCylinder.filter((item) => {
          return item.cylinderType === "CYL12KG";
        });
        let count12 = 0;
        for (let i = 0; i < binh12A.length; i++) {
          count12 += +binh12A[i].numberCylinders;
        }
        console.log("count12", count12);
        console.log("binh12", binh12A);
        binh12COA = data[item].listCylinder.filter((item) => {
          return item.cylinderType === "CYL12KGCO";
        });
        let count12CO = 0;
        for (let i = 0; i < binh12COA.length; i++) {
          count12CO += +binh12COA[i].numberCylinders;
        }
        console.log("count12", count12CO);
        console.log("binh12", binh12COA);
        console.log("Bình 12", binh12A);
        console.log("Bình 45", binh45A);
        console.log("Bình 50", binh50A);
        console.log(
          "data[item].expected_DeliveryDate",
          moment(data[item].createdAt).format("DD/MM/YYYY")
        );
        let dateBegin = moment(data[item].createdAt).format("DD/MM/YYYY");
        const statusBegin =
          data[item].status === "INIT"
            ? "Khởi tạo"
            : data[item].status === "CONFIRMED"
            ? "Đã xác nhận đơn hàng"
            : data[item].status === "DELIVERING"
            ? "Đang vận chuyển"
            : data[item].status === "DELIVERED"
            ? "Đã giao"
            : data[item].status === "COMPLETED"
            ? "Đã hoàn thành"
            : data[item].status === "CANCELLED"
            ? "Đã bị hủy"
            : data[item].status;
        if (data) {
          let obj = {
            No: item,
            createdAt: dateBegin,
            maKH: data[item].orderCode,
            Provine: data[item].agencyId,
            ten: data[item].customerId,
            soXe: "",
            thoiGianGH: data[item].expected_DeliveryDate,
            // 'Số lượng bình': data[item].listCylinder[items].numberCylinders,
            binh12: count12 + count12CO,
            binh45: count45,
            binh50: count50,
            ghiChu: data[item].note,
            trangThai: statusBegin,
          };
          dataTable.push(obj);
        }
      }
    }
    this.setState({
      listMenuCreateOrderTableExcel: dataTable,
    });
  };
  async componentDidMount() {
    // await this.getAllUser();
    let user_cookies = await getUserCookies();
    console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    this.setState({
      user_type: user_cookies.user.userType,
      tokenAPI: token,
      idAccount: id,
    });
    await this.getAllOrder(id, token);
    await this.handleButtonExportExcel();
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Tìm kiếm
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Nhập lại
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  getOrderHistories = async (record, index) => {
    // // console.log('getOrderHistories record', record)
    // // console.log('getOrderHistories index', index)
    this.setState({
      isLoadingViewOrderHistories: true,
      viewingRecord: record.orderId,
    });

    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;

    let params = {
      orderId: record.orderId,
    };
    await callApi("POST", GETORDERHISTORIES, params, token).then((res) => {
      // // console.log('GETORDERHISTORIES', res.data)
      if (res.data.status && res.data.resCode === "SUCCESS-00003") {
        // openNotificationWithIcon("success", res.data.message)

        // Chỉnh lại dữ liệu, trước khi chuyển cho viewOrderHitories
        let temp = [];
        let i = 0;
        for (let item of res.data.orderHistories) {
          temp.push({
            key: i,
            status:
              item.status === "INIT"
                ? "Khởi tạo"
                : item.status === "CONFIRMED"
                ? "Đã xác nhận đơn hàng"
                : item.status === "DELIVERING"
                ? "Đang vận chuyển"
                : item.status === "DELIVERED"
                ? "Đã giao"
                : item.status === "COMPLETED"
                ? "Đã hoàn thành"
                : item.status === "CANCELLED"
                ? "Đã bị hủy"
                : item.status,
            content: item.content ? item.content : "",
            createdBy: item.createdBy ? item.createdBy.name : "",
            createdAt: item.createdAt
              ? moment(item.createdAt).format("DD/MM/YYYY - HH:mm")
              : "",
          });
          i++;
        }

        this.setState({
          orderHistories: temp,
          isLoadingViewOrderHistories: false,
        });
      } else {
        // openNotificationWithIcon("error","Đã có lỗi xảy ra")
        this.setState({ isLoadingViewOrderHistories: false });
        openNotificationWithIcon("error", res.data.message);
      }
    });
  };

  expandedRowRender = (record, index) => {
    // // console.log('expandedRowRender', record, index)
    const columnsNestedTables = [
      {
        title: "Loại bình",
        dataIndex: "cylinderType",
        key: "cylinderType",
        width: 115,
      },
      { title: "Màu sắc", dataIndex: "color", key: "color", width: 150 },
      { title: "Loại van", dataIndex: "valve", key: "valve", width: 130 },
      {
        title: "Số lượng bình",
        dataIndex: "numberCylinders",
        key: "numberCylinders",
        width: 140,
      },

      // { title: 'Đã giao', /* dataIndex: 'numberCylinders', key: 'numberCylinders' */ },
    ];

    const data = [];
    const lengthListCylinder = record.listCylinder.length;
    // console.log("record.listCylinder",record.listCylinder)
    for (let i = 0; i < lengthListCylinder; i++) {
      data.push({
        key: i,
        cylinderType: record.listCylinder[i].cylinderType,
        color:
          record.listCylinder[i].color === "GRAY"
            ? "Xám"
            : record.listCylinder[i].color === "YELLOW"
            ? "Vàng"
            : record.listCylinder[i].color === "ORANGE"
            ? "Cam"
            : record.listCylinder[i].color === "RED"
            ? "Đỏ"
            : record.listCylinder[i].color,
        valve: record.listCylinder[i].valve,
        numberCylinders: record.listCylinder[i].numberCylinders,
      });
    }
    return (
      <Table
        columns={columnsNestedTables}
        dataSource={data}
        pagination={false}
      />
    );
  };

  handleToggle = (prop) => (enable) => {
    this.setState({ [prop]: enable });
  };

  handleSizeChange = (e) => {
    this.setState({ size: e.target.value });
  };

  handleDataChange = (enableFilter) => {
    this.setState({ enableFilter });
  };

  handleWarningChange = (e) => {
    const { value } = e.target;

    this.setState(
      {
        warning: value === "none" ? "none" : { position: value },
        warningValue: value,
      },
      this.filterData
    );
  };

  onChangeTime = (dates, dateStrings) => {
    this.setState(
      {
        startDate: dates[0] ? moment(dates[0]).toDate() : "",
        endDate: dates[0] ? moment(dates[1]).toDate() : "",
      },
      this.filterData
    );
  };

  filterData = () => {
    const {
      startDate,
      endDate,
      listAllOrder,
      data,
      listOrderOld,
      listOrderNow,
      warningValue,
    } = this.state;

    let tempData = listOrderOld;
    let tempDataNow = listOrderNow;
    if (this.state.enableFilter === true) {
      if (startDate && endDate) {
        // // console.log('startDate && endDate', startDate, endDate)
        tempData = tempData.filter((order) => {
          return (
            startDate <= moment(order.deliveryDate) &&
            moment(order.deliveryDate) <= endDate
          );
        });
      }

      // // console.log('warning', value)
      // // console.log('listAllOrder', listAllOrder)
      if (warningValue === "INIT") {
        tempData = this.state.listOrderOldBegin;
        // console.log("listOrderOld1",this.state.listOrderOldBegin);
        // // console.log('INIT')
        const data = tempData.filter((order) => {
          return order.status === "INIT";
        });
        // // console.log('data', data)
        this.setState({ listOrderOld: data });
      } else if (warningValue === "CONFIRMED") {
        tempData = this.state.listOrderOldBegin;
        const data = tempData.filter((order) => {
          return order.status === "CONFIRMED";
        });
        this.setState({ listOrderOld: data });
      } else if (warningValue === "DELIVERING") {
        tempData = this.state.listOrderOldBegin;
        const data = tempData.filter((order) => {
          return order.status === "DELIVERING";
        });
        this.setState({ listOrderOld: data });
      } else if (warningValue === "COMPLETED") {
        tempData = this.state.listOrderOldBegin;
        const data = tempData.filter((order) => {
          return order.status === "COMPLETED";
        });
        this.setState({ listOrderOld: data });
      }
    } else if (this.state.enableFilter === false) {
      // if (startDate && endDate) {
      // //     // console.log('startDate && endDate', startDate, endDate)
      //     tempDataNow =  tempDataNow.filter(order=>{
      //         return (startDate<=moment(order.deliveryDate) && moment(order.deliveryDate)<=endDate)
      //     })
      // }

      // // console.log('warning', value)
      // // console.log('listAllOrder', listAllOrder)
      if (warningValue === "INIT") {
        tempDataNow = this.state.listOrderNowBegin;
        // console.log("listOrderOld1",this.state.listOrderOldBegin);
        // // console.log('INIT')
        const data = tempDataNow.filter((order) => {
          return order.status === "INIT";
        });
        // // console.log('data', data)
        this.setState({ listOrderNow: data });
      } else if (warningValue === "CONFIRMED") {
        tempDataNow = this.state.listOrderNowBegin;
        const data = tempDataNow.filter((order) => {
          return order.status === "CONFIRMED";
        });
        this.setState({ listOrderNow: data });
      } else if (warningValue === "DELIVERING") {
        tempDataNow = this.state.listOrderNowBegin;
        const data = tempDataNow.filter((order) => {
          return order.status === "DELIVERING";
        });
        this.setState({ listOrderNow: data });
      } else if (warningValue === "COMPLETED") {
        tempDataNow = this.state.listOrderNowBegin;
        const data = tempDataNow.filter((order) => {
          return order.status === "COMPLETED";
        });
        this.setState({ listOrderNow: data });
      }
    }
  };

  handleOnBeforeGetContent = () => {
    // console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    this.setState({ text: "Loading new text..." /* , isLoading: true */ });

    return new Promise((resolve) => {
      // setTimeout(() => {
      //     this.setState({ text: "New, Updated Text!"/* , isLoading: false */ }, resolve);
      // }, 2000);
      this.setState(
        {
          text:
            "New, Updated Text!" /* , isLoading: false */ /* , exportDataPrint: 'CUONG' */,
        },
        resolve
      );
    });
  };

  getDataPrint = async (orderId, key) => {
    // // console.log('orderId', orderId)
    const result = await getExportDataPrint(orderId);
    // console.log('result', result)
    if (result.status === true) {
      this.setState({
        // enablePrint: true,
        editingKey: key,
        exportDataPrint: result.data,
      });
    }
  };

  getDetailExportOrder = async () => {
    // console.log('clicked getDetailExportOrder', this.state.viewingRecord)
    const result = await getDetailExportOrderAPI(this.state.viewingRecord);
    if (result.status === true) {
      let data = [];
      if (result.data.exportHistory) {
        const cylinders = result.data.exportHistory.cylinders;
        const lengthListCylinder = cylinders.length;
        for (let i = 0; i < lengthListCylinder; i++) {
          data.push({
            key: i,
            serial: cylinders[i].serial,
            color: cylinders[i].color,
            valve: cylinders[i].valve,
            weight: cylinders[i].weight,
            status: "Trạng thái",
          });
        }
      }
      this.setState({ dataSource: data });
      // this.setState({
      //     // enablePrint: true,
      //     // editingKey: key,
      //     detailDataExport: result.data
      // })
    }
  };
  showModalCancel = (record) => {
    this.setState({
      openModalCancel: true,
      orderShippingId: record.orderId
    })
    console.log("ececec", record);
  }

  handleOk = (token) => {
    let params = {
      orderShippingId: this.state.orderShippingId,
      userId: this.state.idAccount,
      reasonForCancellatic:this.state.reasonCancelOrder
    }
    callApi("POST",CANCELSHIPPINGORDER,params,token).then(res => {
      console.log(res);
      if(!res.data.success){
        showToast(res.data.message)
      } else{
        showToast('Hủy Đơn Thành Công')
        this.setState({
          openModalCancel:false
        })
        this.getAllOrder()
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  handleCancel = () => {
    this.setState({
      openModalCancel:false
    })
  }

  handleReasonCancelOrder = (e) => {
    this.setState({[e.target.name]:e.target.value})
  }

  render() {
    console.log(this.state.reasonCancelOrder);
    console.log(this.state.idAccount);
    const {
      bordered,
      enableFilter,
      size,
      // enablePrint
    } = this.state;

    const defaultPageSize = {
      defaultPageSize: 10,
    };

    const columns = [
      {
        title: "Mã đơn hàng",
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
        // fixed: "left",
        width: 115,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        ...this.getColumnSearchProps("createdAt"),
        width: 150,
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          return moment(a.createdAt) - moment(b.createdAt);
        },
        render: (text) => {
          return <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>;
        },
      },
      // {
      //   title: "Khách hàng",
      //   dataIndex: "customerId",
      //   key: "customerId",
      //   ...this.getColumnSearchProps("customerId"),
      //   width: 130,
      // },

      {
        title: "Nơi nhận",
        dataIndex: "warehouseId",
        key: "warehouseId",
        ...this.getColumnSearchProps("warehouseId"),
        width: 140,
      },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        ...this.getColumnSearchProps("type"),
        width: 75,
      },
      {
        title: "Ngày giao hàng",
        dataIndex: "expected_DeliveryDate",
        key: "expected_DeliveryDate",
        ...this.getColumnSearchProps("expected_DeliveryDate"),
        width: 190,
        // defaultSortOrder: 'descend',
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          return moment(a.deliveryDate) - moment(b.deliveryDate);
        },
        // render: (text) => {
        //     return (
        //         <div>{moment(text).format("DD/MM/YYYY")}</div>
        //     )
        // }
      },
      {
        title: "Giờ giao hàng",
        dataIndex: "expected_DeliveryTime",
        key: "expected_DeliveryTime",
        ...this.getColumnSearchProps("expected_DeliveryTime"),
        width: 140,
        // render: (text) => {
        //     return (
        //         <div>{moment(text).format("HH:mm:ss")}</div>
        //     )
        // }
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
        width: 115,
        render: (text) => {
          const txt =
            text === "INIT"
              ? "Khởi tạo"
              : text === "CONFIRMED"
              ? "Đã xác nhận đơn hàng"
              : text === "DELIVERING"
              ? "Đang vận chuyển"
              : text === "DELIVERED"
              ? "Đã giao"
              : text === "COMPLETED"
              ? "Đã hoàn thành"
              : text === "CANCELLED"
              ? "Đã bị hủy"
              : text;
          return <div>{txt}</div>;
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        ...this.getColumnSearchProps("note"),
        width: 99,
      },
      {
        title: "Thao tác",
        key: "operation",
        width: "200px",
        align: "center",
        // fixed: "right",
        render: (record, index) => {
          // const { enablePrint } = this.state;
          const editable = this.isEditing(record);
          return (
            <div title="">
              <Tooltip title="Lịch sử">
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  data-toggle="modal"
                  data-target="#view-order-histories-modal"
                  onClick={() => this.getOrderHistories(record, index)}
                  icon="plus"
                />
              </Tooltip>

              {!editable ? (
                <Tooltip title="Tải xuống">
                  <Button
                    type="primary"
                    style={{ marginRight: 5 }}
                    onClick={() =>
                      this.getDataPrint(record.orderId, record.key)
                    }
                    icon="download"
                  />
                </Tooltip>
              ) : (
                ""
              )}
              {editable ? (
                <Tooltip title="In">
                  <ReactToPrint
                    style={{ marginLeft: 5 }}
                    copyStyles={true}
                    // onBeforeGetContent={this.handleOnBeforeGetContent}
                    trigger={() => <Button type="primary" icon="printer" />}
                    content={() => this.componentRef}
                  />
                </Tooltip>
              ) : (
                ""
              )}
              <Tooltip title="Hủy Đơn Hàng">
                <Button
                  type="primary"
                  onClick={() => this.showModalCancel(record)}
                  icon="delete"
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
    let {
      listAllOrder,
      orderHistories,
      data,
      warning,
      isLoading,
      isLoadingViewOrderHistories,
      isLoadingViewEditOrder,
      viewingRecord,
      dataSource,
    } = this.state;
    console.log(this.state.openModalCancel);
    return (
      <div id="ListOrder">
        {/* <label style={{ color: 'red', fontSize: '24px', marginLeft: '530px' }}>Danh sách đơn hàng</label> */}
        <Row style={{ marginTop: 20 }}>
          <Col xs={1}></Col>
          <Col xs={22}>
            <h4>Danh sách đơn hàng</h4>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={22}>
            <Form
              layout="inline"
              // className="components-table-demo-control-bar"
              style={{ marginBottom: 16 }}
            >
              <Form.Item label="Lọc">
                <Switch
                  checked={enableFilter}
                  onChange={this.handleDataChange}
                />
              </Form.Item>
              <Form.Item label="Trạng thái">
                <Radio.Group
                  value={warning ? warning.position : "notConfirmed"}
                  onChange={this.handleWarningChange}
                >
                  {/* <Radio.Button value="notConfirmed">Chưa xác nhận</Radio.Button>
                            <Radio.Button value="notDelivered">Chưa được giao</Radio.Button> */}
                  <Radio.Button value="INIT">Khởi tạo</Radio.Button>
                  <Radio.Button value="CONFIRMED">Xác nhận</Radio.Button>
                  <Radio.Button value="DELIVERING">
                    Đang được vận chuyển
                  </Radio.Button>
                  <Radio.Button value="COMPLETED">Đã hoàn thành</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <RangePicker
                  ranges={{
                    "Hôm nay": [moment().startOf("day"), moment().endOf("day")],
                    "Tháng hiện tại": [
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ],
                  }}
                  showTime={{
                    format: "HH:mm",
                    defaultValue: [
                      moment("07:00", "HH:mm"),
                      moment("22:00", "HH:mm"),
                    ],
                  }}
                  format="DD/MM/YYYY HH:mm"
                  onChange={this.onChangeTime}
                />
              </Form.Item>
              <Form.Item>
                <ReactHTMLTableToExcel
                  className="btn btn-success"
                  table="listOrder"
                  filename="_Danh_Sach_Don_Hang_"
                  sheet="Danh sách đơn hàng"
                  buttonText="Xuất Excel"
                />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={1}>
            {/* <MenuCreateOrderExcel
              listMenuCreateOrderTableExcel={
                this.state.listMenuCreateOrderTableExcel
              }
            ></MenuCreateOrderExcel> */}
          </Col>
          <Col xs={22}>
            <Table
              //className="components-table-demo-nested"
              scroll={{ x: 1500, y: 420 }}
              //loading={isLoading}
              bordered={bordered}
              size={size}
              columns={columns.map((col) => {
                return {
                  ...col,
                  onCell: (record) => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                  }),
                };
              })}
              dataSource={
                enableFilter ? this.state.listOrderOld : this.state.listOrderNow
              }
              pagination={defaultPageSize}
              expandedRowRender={(record, index) =>
                this.expandedRowRender(record, index)
              }
              // onRow={(record, index) => (
              // //     console.log('record, index', record, index)
              //     // this.setState('')
              //   )}
            />
          </Col>
          <Col xs={1}></Col>
        </Row>
        <ViewOrderHistories
          orderHistories={orderHistories}
          isLoadingViewOrderHistories={isLoadingViewOrderHistories}
          getDetailExportOrder={this.getDetailExportOrder}
        />
        <EditOrder
          isLoadingViewEditOrder={isLoadingViewEditOrder}
          dataSource={dataSource}
        />
        <ImportPrinter
          ref={(el) => (this.componentRef = el)}
          dataPrint={this.state.exportDataPrint}
          text={this.state.text}
        />
        <Modal
        title="Hủy Đơn Hàng"
        visible={this.state.openModalCancel}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            Đóng
          </Button>,
          <Button key="submit" type="primary"  onClick={this.handleOk}>
            Hủy Đơn
          </Button>,
        ]}
      >
        <Form>
          <Form.Item label="Lí Do Hủy Đơn">
            <Input.TextArea name="reasonCancelOrder" onChange={this.handleReasonCancelOrder}/>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    );
  }
}

export default ListOrder;
