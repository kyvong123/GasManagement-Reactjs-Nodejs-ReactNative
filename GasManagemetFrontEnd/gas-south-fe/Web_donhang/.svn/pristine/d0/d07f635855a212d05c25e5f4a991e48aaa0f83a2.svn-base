import React, { Component, Fragment } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Icon,
  TimePicker,
  Radio,
  Switch,
} from "antd";

// import DatePicker from "react-datepicker";
import "./CreateOrder.scss";
import moment from "moment";
import required from "required";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import getDestinationUserAPI from "../../../../api/getDestinationUserAPI";
import Constants from "Constants";
import { GETTYPECUSTOMER, CREATEORDER, GETALLORDER } from "../../../config/config";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
import sendNotification from "./../../../../api/sendNotification";
import getAllManufacturer from "getAllManufacturer";
import getAllCustomerReceive from "../../../../api/getAllCustomerReceive"
import getListManufacturer from "../../../../api/getListManufacturer"
import getAllTypeGas from "../../../../api/getAllTypeGas";
import getAllStation from "../../../../api/getAllBranch";
import getListCustomerByType from "../../../../api/getListCustomerByType"
const { Option } = Select;
const provinceData = ["CYL6KG", "CYL12KG", "CYL20KG", "CYL45KG"];
const colorData = {
  CYL6KG: ["GRAY", "RED", "YELLOW"],
  CYL12KG: ["Shell", "VT", "Petro", "ORANGE"],
  CYL20KG: ["GRAY"],
  CYL45KG: ["GRAY"],
};
const vandata = {
  CYL6KG: ["POL", "COM", "VAN"],
  CYL12KG: ["COMPACT", "COM", "VAN"],
  CYL20KG: ["POL", "COM", "VAN"],
  CYL45KG: ["POL", "2 VAN", "COM"],
};
const typeCustomer = [
  {
    name: "Khách hàng công nghiệp",
    type: "Industry"
  },
  {
    name: "Đại lý phân phối",
    type: "Distribution"
  },
  {
    name: "Cửa hàng bán lẻ",
    type: "Agency"
  }
]
class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.options = [];
    this.state = {
      listManufacturers: [],
      listCompanyBegin: [],
      idManufacturers: "",
      Loading: false,
      orderType: false,
      arrayLength: 1,
      options: [],
      options3: [],
      options1: [],
      options2: [],
      cities1: colorData[provinceData[0]],
      cities2: vandata[provinceData[0]],
      color: colorData[provinceData[0]][0],
      valve: vandata[provinceData[0]][0],
      checkDeliveryTime: false,
      // secondCity1: '',
      name: "",
      agencyId: "",
      customerId: "",
      invoiceAddress: "",
      cylinderType: "",
      manufacturer: "",
      listUsers: [],
      open: false,
      checkCongtyCon: 1,
      // value: 1,
      listconttycon: "",
      distributionAgent: "",
      restaurantBuilding: "",
      industrialCustomers: "",
      listBrand: [],
      startHour: new Date(),
      startDate: new Date(),
      listUsersGeneral: [],
      listUsersAgency: [],
      listCompany: [],
      listUserFixer: [],
      // listUserFixer: [],
      valueCompany: "",
      expected_DeliveryTime: "",
      // expected_DeliveryDate: '',
      // valueColor:"",
      color: "",
      valve: "",
      maDH: "",
      countOrder: 0,
      tokenAPI: "",
      statusOrder: "init",
      idAccount: "",
      searchText: "",
      searchedColumn: "",
      listAllOrder: [],
      idCustomer: "",
      idBranch: "",
      option: [],
      option1: [],
      option2: [],
      // listCylinder: '',
      note: "",
      customerCode: "",
      agencyCode: "",
      warehouseId: "",
      orderId: "",
      orderCode: "",
      date: "",
      time: "",
      listUserCustomer: [],
      listUsersAgencyCustomer: [],
      listUsersRestaurantCustomer: [],
      valueCompeny: "",
      // secondCity2: '',
      listCylinder: [
        {
          cylinderType: "",
          valve: "",
          color: "",
          numberCylinders: "",
          manufacturer: ""
        },
      ],
      isSelectedDistribution: false,
      agencyIdCheck: false,
      type: "V",
      playerID: "",
      manufacturers: {},
      listTypeCylinder: [],
      idDestination: "",
      listCustomer: [],
      idCustomers:""
    };
  }

  handleProvinceChange = (value, index) => {
    console.log("addd", value, index)
    const val = [...this.state.listCylinder];
    (val[index].cylinderType = value),
      // console.log('sds', value)
      this.setState({
        cities1: colorData[value],
        cities2: vandata[value],
        color: colorData[value][1],
        valve: vandata[value][1],
        cylinderType: value,
      });
  };

  handleAgencyChange = (e, index) => {
    const val = [...this.state.listCylinder];
    val[index].numberCylinders = e.target.value;
    this.setState({
      listCylinder: val,
      countOrder: e.target.value,
    });
  };
  onSecondCityChange1 = (value, index) => {
    const val = [...this.state.listCylinder];
    (val[index].color = value.target.value),
      this.setState({
        color: value.target.value,
        listCylinder: val,
      });
  };
  onSecondCityChange2 = (value, index) => {
    const val = [...this.state.listCylinder];
    val[index].valve = value.target.value;
    this.setState({
      valve: value.target.value,
      listCylinder: val,
    });
  };
  handleAddClick = (e) => {
    this.setState(
      {
        listCylinder: [
          ...this.state.listCylinder,
          { cylinderType: "", valve: "", color: "", numberCylinders: "", manufacturer: "" },
        ],
      },
      () => {
      }
    );
  };
  handleDelClick = (e) => {
    const listCylinder1 =
      { color: '', cylinderType: '', numberCylinders: '', valve: '', manufacturer: '' }
    console.log("emptyListCylinder", this.state.listCylinder);
    const data = this.state.listCylinder;
    data.splice(data.length - 1, 1);
    this.setState({
      listCylinder: data,
    });
  };
  onChangeCurrent = async (e) => {
    // console.log('radio checked', e.target.value);
    e.preventDefault();
    // await this.getListBr("");

    await this.setState(
      {
        value: e.target.value,
        customerId: "",
        listBrand: [],
      },
      () => {
        // console.log('duc', this.state.value)
      }
    );
    // else
    if (e.target.value === 3) {
      document.getElementById("industrialCustomers").style.display = "block";
      document.getElementById("distributionAgent").style.display = "none";
      document.getElementById("restaurantBuilding").style.display = "none";
      this.setState({ isSelectedDistribution: true });
      console.log("isSelectedDistribution3", this.state.isSelectedDistribution);
    } else if (e.target.value === 2) {
      document.getElementById("restaurantBuilding").style.display = "block";
      document.getElementById("distributionAgent").style.display = "none";
      document.getElementById("industrialCustomers").style.display = "none";
      this.setState({ isSelectedDistribution: false });
      console.log("isSelectedDistribution2", this.state.isSelectedDistribution);
    } else if (e.target.value === 1) {
      document.getElementById("distributionAgent").style.display = "block";
      document.getElementById("restaurantBuilding").style.display = "none";
      document.getElementById("industrialCustomers").style.display = "none";
      console.log("isSelectedDistribution", this.state.isSelectedDistribution);
      await this.setState({
        // listconttycon: '',
        // doitac: '',
        distributionAgent: "",
        restaurantBuilding: "",
        industrialCustomers: "",
        isSelectedDistribution: false,
        idCustomer: "",
      });

    }
  };

  handleOpenChange = (open) => {
    this.setState({ open });
  };

  handleClose = () => this.setState({ open: false });

  refresh() {
    this.forceUpdate(async () => {
      await this.getAllUser();
      //this.setState({userEdit:{}});
    });
  }
  async componentDidMount() {
    // await this.getAllUserGeneral();
    // await this.getAllUserAGENCY();
    const result = await getAllCustomerReceive()
    await this.getListFixer();
    await this.onChangeTitle();
    // await this.getAllUser();
    let user_cookies = await getUserCookies();
    //console.log(user_cookies.user.id);
    let token = "Bearer " + user_cookies.token;
    let id = user_cookies.user.id;
    let station = await getAllStation(id);
    let data = [];
    if (user_cookies.user.userRole === "Owner" && user_cookies.user.userType === "Factory") {
      this.setState({
        type: "V",
        orderType: false
      })
    }
    else {
      this.setState({
        type: "B",
        orderType: true
      })
    }
    if (this.state.type === "V") {
      result.data.data.map((item, index) => {
        if (item.userType === "Fixer" && item.userRole === "SuperAdmin") {
          data.push(item);
        }
      })
    }
    else {
      if (user_cookies.user.userRole === "SuperAdmin" && user_cookies.user.userType === "Region") {
        station.data.data.map((item) => {
          data.push(item)
        })
      }
    }

    this.setState({
      listCompany: data,
      user_type: user_cookies.user.userType,
      tokenAPI: token,
      idAccount: id,
    });
    this.getAllOrder(id, token);
    this.getIndustryCustomer(id, token);
    this.getAllManufacturer();
    this.getTypeCylinder()

  }
  getTypeCylinder = async () => {
    let result = await getAllTypeGas()
    if (result.data.status === true) {
      this.setState({
        listTypeCylinder: result.data.data
      })
    }
  }
  async getIndustryCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: "5f5b37b1bb976f2ba0cb9f90",
      customerType: "Industry",
    };
    let params = {
      reqListCustomer,
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then((res) => {
      console.log("khach hang cong nghiep", res.data);
      if (res.data) {
        if (res.data.success === true) {
          // this.setState({ listUsers: res.data.data });
          this.setState({
            options1: res.data.data.map((user) => {
              return {
                value: user.id,
                label: user.customerCode,
                name: user.name
              };
            }),
          });
        } else {
          showToast(
            res.data.message ? res.data.message : res.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }
  getAllOrder = async (id, token) => {
    let user_cookies = await getUserCookies();
    let parmas = {
      orderCreatedBy: user_cookies.user.id,
    };
    await callApi("POST", GETALLORDER, parmas, token).then((res) => {
      let temp = [];
      // console.log("data order", res.data);
      let i = 0;
      for (let item of res.data.order) {
        temp.push({
          key: i,
          orderCode: item.orderCode,
          customerId: item.customerId ? item.customerId : "no name",
          agencyId: item.agencyId,
          // warehouseId: item.warehouseId
          valve: item.valve ? item.valve : "no name",
          color: item.color ? item.color : "no name",
          // time: moment(item.time).format("HH:mm:ss"),
          cylinderType: item.cylinderType ? item.cylinderType : "no name",
          manufacturer: item.manufacturer ? item.manufacturer : "no name",
          // listCylinder: item.listCylinder,
          // listCylinder: item.listCylinder,
          note: item.note,
          status: item.status === "INIT" ? "Khởi tạo" : item.status,

          // idCustomer: item.idCustomer.name,
          // idBranch: item.idBranch.name,
          numberCylinders: item.numberCylinders,
          warehouseId: item.warehouseId ? item.warehouseId : "no name",
          // date: moment(item.orderDate).format("DD/MM/YYYY"),
          expected_DeliveryDate: item.expected_DeliveryDate,
          // expected_DeliveryDate: moment(item.expected_DeliveryDate).format("DD/MM/YYYY"),
          expected_DeliveryTime: moment(item.expected_DeliveryTime).format(
            "HH:mm:ss"
          ),
          // status: item.status === "INIT" ? "Khởi tạo" : item.status,
        });
        i++;
      }
      this.setState({
        listAllOrder: temp,
      });
    });
  };
  sendNotification = async (title, message, playerID, iddata) => {
    await sendNotification(title, message, playerID, iddata)
  };

  onChangeCompany = async (value, playerID) => {
    console.log("iddddd", value)
    await this.setState(
      {
        warehouseId: value,
        playerID: playerID.props.playerID,
        idDestination: value
      }
    );
  };
  onChangeCompanyFilterProp = async (value) => {
    // console.log(this.state.warehouseId)
    this.setState(
      {
        customerId: value,
      }
    );
    await this.getListBr(value);
    console.log("this.state.customerId", value)
  };

  selectOptionHandler = (e) => {
    // console.log('duc', e.target.value)
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]: value,
    });
  };

  onChangeTitle = (e) => {
    // console.log('madonhang', e.target.value)
    let date = new Date();
    let formattedDate = moment(date).format("DDMMYYYY");
    let dateString = formattedDate.toString().slice(0, 6);
    let dateNowString = Date.now().toString().slice(7, 13);
    let madonhang = ("DH" + dateString + "-" + dateNowString).toString();
    this.setState({
      maDH: madonhang,
    });
  };

  onChangeCommon = (e) => {
    // console.log('note', e.target.value)
    this.setState({
      // listCylinder: e.target.value
      note: e.target.value,
    });
  };
  getList() {
    return new Promise(function (resolve) {
      setTimeout(() => resolve([1, 2, 3]), 3000);
    });
  }
  onCreate = async (e) => {
    // alert('sdssd')
    // console.log('onsubmit', this.state)
    let user_cookies = await getUserCookies();
    e.preventDefault();
    let {
      maDH,

      // valueCompany,

      valueCompany,
      // cylinderType,
      idCustomer,
      countOrder,
      note,
      startDate,
      startHour,
      idAccount,
      listAllOrder,
      invoiceAddress,
      customerId,
      agencyId,
      warehouseId,
      orderId,
      orderCode,
      date,
      time,
      idBranch,

      cylinderType,
      valve,
      color,
      manufacturer,
      userId,
      sumnumber,
      numberCylinder,
      listCylinder,
      idManufacturers
    } = this.state;

    let dateNow = new Date();
    let dateChose = startDate;
    let d1 = Date.parse(dateNow);
    let d2 = Date.parse(dateChose);

    let listCylinderBegin = [];
    listCylinder.map((item, index) => {
      console.log("itemmm", item)
      listCylinderBegin.push(
        {
          cylinderType: item.cylinderType,
          valve: item.valve,
          color: item.color,
          numberCylinders: item.numberCylinders,
          manufacturers: item.manufacturer
        }
      )
    });
    console.log("valve", valve);
    console.log("color", color);
    console.log("cylinderType", cylinderType);
    console.log("countOrder", countOrder);

    if (!valve || !color || !countOrder || customerId === "Chọn") {
      alert("Vui lòng nhập đầy đủ thông tin");
      return false;
    }

    let index = await listAllOrder.findIndex(
      (order) => order.orderCode === maDH
    );
    // console.log('sdsere', index)
    if (moment(d2).format("YYYY-MM-DD") < moment(d1).format("YYYY-MM-DD")) {
      alert("Ngày bạn chọn phải lớn hơn hoặc bằng ngày hiện tại");
    } else if (
      moment(d2).format("YYYY-MM-DD") >= moment(d1).format("YYYY-MM-DD")
    ) {
      console.log("new Date(startHour.toISOString()", startDate);
      let date = moment(startDate).format("YYYY-MM-DD");
      if (index === -1) {
        console.log("time2222222", typeof this.state.startHour);
        // const _time = this.state.checkDeliveryTime === false? " " : new Date(startHour.toISOString());
        const _time = this.state.checkDeliveryTime === false ? " " : this.state.startHour;
        console.log("time2222222", _time)
        // const hour =
        //   this.state.checkDeliveryTime === false ? "" : _time.getHours();
        // const minute =
        //   this.state.checkDeliveryTime === false ? "" : _time.getMinutes();
        this.setState({
          startHour: _time,
        });
        let createOrder = {
          // invoiceAddress: invoiceAddress,
          orderCode: maDH,
          agencyId: agencyId,
          // warehouseId: warehouseId,
          // time: time,

          customerId: this.state.idCustomers,
          warehouseId: warehouseId,
          // listCylinder: listCylinder,
          // Typecylinder: cylinderType,

          note: note,

          listCylinder: listCylinderBegin,

          // status: status,
          // numberCylinders: numberCylinders,
          // nameCopany: nameCopany,

          expected_DeliveryDate: date,
          expected_DeliveryTime: this.state.startHour,
          type: this.state.type
          // createdBy: idAccount,startHour
        };

        console.log("creatde", createOrder);
        console.log("time", this.state.startHour);

        let parmas = {
          createOrder,
          userId: user_cookies.user.id,
        };
        this.setState({ Loading: true });
        //console.log('ca;;', callApi)
        await callApi("POST", CREATEORDER, parmas, this.state.tokenAPI)
          .then(
            (res) => {
              console.log("Tao don hang", res.data.data.id);
              if (res.data.success === true) {
                this.setState({
                  Loading: false,
                  note: "",
                  color: "",
                  listCylinder: [
                    { color: '', cylinderType: '', numberCylinders: '', valve: '', manufacturer: '' }],
                  startDate: new Date(),
                  startHour: new Date(),
                  agencyId: "",
                });
                this.onChangeTitle();
                alert("Tạo thành công");
                console.log(this.state.idAccount, this.state.tokenAPI)
                this.sendNotification(
                  "Thông báo đơn hàng",
                  "Bạn đã nhận được 1 đơn hàng",
                  this.state.playerID,
                  res.data.data.id
                );
                this.getAllOrder(this.state.idAccount, this.state.tokenAPI);
              } else {
                alert("Tạo thất bại: " + res.data.message);
              }

              // this.getAllOrder(this.state.idAccount, this.state.tokenAPI);
              // window.location.reload()
            }
          )
          .catch((err) => {
            console.log(err);
            alert("Gặp lỗi khi tạo đơn hàng");
          });


      } else {
        alert("Mã đơn hàng đã bị trùng vui lòng nhập lại");
      }
    } else {
      alert("Mã đơn hàng đã bị trùng vui lòng nhập lại");
    }
    // }
  };
  async handleOnchangeType(e) {
    let user_cookies = await getUserCookies();
    let data = []
    const result = await getAllCustomerReceive()
    if (user_cookies.user.userRole === "Owner" && user_cookies.user.userType === "Factory") {
      if (e === false) {

        this.setState({
          orderType: e,
          type: "V",
        });
        if (result) {
          result.data.data.map((item) => {
            if (item.userType === "Fixer" && item.userRole === "SuperAdmin") {
              data.push(item);
            }
          })
        }
        this.setState({
          listCompany: data
        })
      }
      else {
        await this.setState({
          orderType: e,
          type: "B",
          listCompany: [user_cookies.user]
        });
      }
    }
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
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
  handleChangeDate = (date) => {
    // console.log('ngày', date)
    this.setState({
      startDate: date,
    });
  };

  handleChangeHour = (time) => {
    console.log("gio", time);
    const _time = new Date(time.toISOString());
    const hour = _time.getHours();
    const minute = _time.getMinutes();

    this.setState({
      startHour: hour + ":" + minute,
    });
  };

  async getListFixer() {
    const dataUsers = await getDestinationUserAPI(
      "",
      "",
      Constants.OWNER
    );
    console.log("dataUsers", dataUsers)
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        // console.log('getListFixer', dataUsers);
        let listFactoryBacks = [];
        for (let i = 0; i < dataUsers.data.length; i++) {
          listFactoryBacks.push({
            value: dataUsers.data[i].id,
            label: dataUsers.data[i].name,
            playerID: dataUsers.data[i].playerID,
            ...dataUsers.data[i],
          });
        }

        this.setState({ listUserFixer: listFactoryBacks });
      } else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  async getListBr(id) {
    // console.log(" vao getlistbr");
    // console.log("id ", id);
    const dataApi = await getListBranchAPI("5f5b37b1bb976f2ba0cb9f90");
    console.log("dataApi", dataApi);
    if (dataApi.data.success) {
      this.setState({
        listBrand: dataApi.data.data,
        customerId: id,
      });
    } else {
      this.setState({
        customerId: id,
      });
    }
  }

  onradioChange = (e) => {
    e.preventDefault();
    this.setState({
      distributionAgent: e.target.value,
      restaurantBuilding: e.target.value,
      industrialCustomers: e.target.value,
    });
  };
  onChangeIdBranch = (e) => {
    e.preventDefault();
    this.setState({
      idBranch: e.target.value,
    });
  };
  onChangeChinhanh = (e) => {
    // console.log('mchinhanh', e.target.value)
    this.setState({
      agencyId: e.target.value,
    });
  };
  handleDataChange = (checkDeliveryTime) => {
    this.setState({ checkDeliveryTime: checkDeliveryTime });
  };
  async getAllManufacturer() {
    let user_cookies = await getUserCookies();
    const dataUsers = await getListManufacturer(user_cookies.user.id);
    console.log("dataUsers11111", dataUsers);
    if (dataUsers.data.status === true) {
      this.setState({ listManufacturers: dataUsers.data.data });
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  };

  handleCustomer = async (value) =>{
    this.setState({
      idCustomers: value
    })
  }
  handleTypeCustomer = async (value) => {
    let result = await getListCustomerByType(this.state.idDestination, value)
    if (result.data.success === true) {
      this.setState({
        listCustomer: result.data.data
      })
    }
  }
  handleManufacturers = async (value, index) => {
    const val = [...this.state.listCylinder];
    (val[index].manufacturer = value),
      this.setState({
        listCylinder: val,
        manufacturer: value,
      });
  }

  render() {
    console.log("checkDeliveryTime", this.state.checkDeliveryTime);
    const { loadings, Loading } = this.state;
    console.log("customerId", this.state.customerId);
    console.log("customerId1", this.state.customerId, this.state.checkDeliveryTime)
    let {
      name,
      listCylinder,
      agencyId,
      note,
      invoiceAddress,
      cities1,
      customerId,
      cities2,
      maDH,
      idCustomer,
      idBranch,
      maCN,
      maKh,
      countOrder,
      comment,
      listAllOrder,
      selectedRowKeys,
      isSelectedDistribution,
      orderType
    } = this.state;
    const defaultPageSize = {
      defaultPageSize: 10,
    };
    const columns = [
      {
        title: "Mã ĐH",
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
      },
      {
        title: "Mã khách hàng",
        dataIndex: "customerId",
        key: "customerId",
        ...this.getColumnSearchProps("customerId"),
      },
      {
        title: "AGENCY_ID",
        dataIndex: "agencyId",
        key: "agencyId",
        ...this.getColumnSearchProps("agencyId"),
      },
      {
        title: "Số lượng",
        dataIndex: "numberCylinders",
        key: "numberCylinders",
        ...this.getColumnSearchProps("numberCylinders"),
      },
      {
        title: "Mã kho",
        dataIndex: "warehouseId",
        key: "warehouseId",
        ...this.getColumnSearchProps("warehouseId"),
      },
      // {
      //   title: "Ngày bảo trì",
      //   dataIndex: "maintenanceDate",
      //   key: "maintenanceDate",
      //   ...this.getColumnSearchProps("maintenanceDate"),
      // },
      {
        title: "Ngày giao hàng",
        dataIndex: "expected_DeliveryDate",
        key: "expected_DeliveryDate",
        ...this.getColumnSearchProps("expected_DeliveryDate"),
      },
      {
        title: "Giờ giao",
        dataIndex: "expected_DeliveryTime",
        key: "expected_DeliveryTime",
        ...this.getColumnSearchProps("expected_DeliveryTime"),
      },
      // {
      //   title: "Loại bình",
      //   dataIndex: "cylinderType",
      //   key: "cylinderType",
      //   ...this.getColumnSearchProps("cylinderType")
      // },
      // {
      //   title: "Màu Sắc",
      //   dataIndex: "color",
      //   key: "color",
      //   ...this.getColumnSearchProps("color")
      // },
      // {
      //   title: "Loại van",
      //   dataIndex: "valve",
      //   key: "valve",
      //   ...this.getColumnSearchProps("valve")
      // },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        ...this.getColumnSearchProps("note"),
      },
    ];
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const { value } = this.state;
    //console.log(this.state.valueCompany);
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <h4>Tạo mới đơn hàng</h4>
          </div>
          <div>
            <Row>
              <Col xs={1}></Col>
              <Col xs={22}>
                <Form
                  id="create-course-form"
                >
                  <Row>
                    <Col xs={14} md={6}>
                      <Form.Item label={orderType === false ? "Loại(Vỏ)" : "Loại(Bình)"}>
                        <Switch
                          checked={orderType}
                          onChange={(e) => this.handleOnchangeType(e)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={14} md={6}>
                      <Form.Item
                        label="Nơi nhận"
                        style={{ display: "block", width: "200px" }}
                      >
                        <Select
                          placeholder={"Chọn"}
                          showSearch
                          optionFilterProp="children"
                          onChange={this.onChangeCompany}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listCompany.map((value, index) => {
                            return (
                              <Option key={index} value={value.id} playerID={value.playerID}>
                                {value.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>

                    </Col>
                  </Row>
                  <Row>
                    {/* <Col xs={14} md={6}>
                      <div className="form-group group">
                        <Form.Item
                          label="Mã khách hàng"
                          style={{
                            display: "block",
                            width: "200px",
                            height: "170px",
                          }}
                        >
                          <Select
                            placeholder={"Chọn"}
                            showSearch
                            optionFilterProp="children"
                            onChange={this.onChangeCompanyFilterProp}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            value={customerId}
                          >
                               {this.state.options1.map((item, index) => {
                              return (
                                <Option key={index} value={item.value}>
                                  {item.label}
                                </Option>
                              );
                            })}
                              </Select>
                        </Form.Item>
                      </div>
                    </Col> */}



                    <Col xs={14} md={6}>
                    </Col>
                    <Col xs={14} md={1}></Col>
                    <Col xs={14} md={6}>
                      {/* <Form.Item
                        label="Mã đơn hàng"
                        style={{ display: "block", width: "200px" }}
                      >
                        <Input onChange={this.onChangeTitle} value={maDH} />
                      </Form.Item> */}
                    </Col>
                  </Row>

                  {/* <Col xs={2}></Col>
                  <Col xs={24} md={11}>
                  <Form.Item label="Ngày tạo" style={{ display: "block" }}>
                    <DatePicker
                      selected={moment(this.state.startDate)}
                      onChange={this.handleChangeDate}
                      dateFormat="DD/MM/YYYY"
                      // readOnly={true}
                    />
                  </Form.Item>
                  </Col> */}
                  {/* </Row> */}

                  <Row style={{ paddingTop: "20px" }}>
                    <Col xs={14} md={6}>
                      <Form.Item
                        label="Ngày giao"
                        style={{ width: "200px" }}
                      >
                        <DatePicker
                          // selected={moment(this.state.startDate)}
                          defaultValue={moment()}
                          onChange={this.handleChangeDate}
                          //dateFormat="DD/MM/YYYY"
                          format="DD/MM/YYYY"
                          style={{ width: "260px" }}
                        // readOnly={true}
                        />
                        {/* <div className="input-group"
                          style={{ display: "flex", flexWrap: "nowrap" }}
                        >
                          <Input style={{ width: '80px' }} ref={this.expiration_dateRef} type="text"
                            className="form-control"
                            // value={this.state.checkedDate}
                            // autocomplete="off"
                            selected={moment(this.state.startDate)}
                            defaultValue={moment()}
                            onChange={this.handleChangeDate}
                            dateFormat="DD/MM/YYYY"
                            // format="DD/MM/YYYY"
                            className="date"
                            validations={[required]}
                            name="checkedDate" id="checkedDate"
                            data-date-format="dd/mm/yyyy"
                            data-provide="datepicker" />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="fa fa-calendar"></i>
                            </span>
                          </div>
                        </div> */}
                      </Form.Item>
                    </Col>
                    <Col xs={1}></Col>
                    <Col xs={14} md={5}>
                      <Form.Item label="Giờ giao">
                        <Row>
                          <Col md={4}>
                            <Switch
                              checked={this.state.checkDeliveryTime}
                              onChange={this.handleDataChange}
                            />
                          </Col>
                          <Col md={4}></Col>
                          <Col md={12}>
                            {this.state.checkDeliveryTime === false ? (
                              ""
                            ) : (
                                <TimePicker
                                  open={this.state.open}
                                  selected={moment(this.state.startHour)}
                                  defaultValue={moment()}
                                  onChange={this.handleChangeHour}
                                  format="HH:mm"
                                  minuteStep={1}
                                  onOpenChange={this.handleOpenChange}
                                  className="time"
                                  style={{ width: "200px", fontWeight: "bold" }}
                                  renderExtraFooter={() => (
                                    <Button
                                      size="small"
                                      type="primary"
                                      onClick={this.handleClose}
                                    >
                                      Ok
                                    </Button>
                                  )}
                                />
                              )}
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    {this.state.type === "B" && this.state.idDestination ?
                      (<Fragment>
                        <Col xs={14} md={6}>
                          <Form.Item label="Loại khách hàng">
                            <Row>
                              <Select
                                class="custom-select custom-select-lg mb-3"
                                placeholder="Chọn"
                                onChange={
                                  this.handleTypeCustomer}
                                validations={[required]}
                              >
                                <Option
                                  value=""
                                  style={{ color: "rgba(125, 125, 125, 0.7)" }}
                                >
                                  Bỏ chọn
                                </Option>
                                {typeCustomer.map((value) => (
                                  <Option value={value.type}>{value.name}</Option>
                                ))}
                              </Select>
                            </Row>
                          </Form.Item>
                        </Col>
                        <Col xs={14} md={6}>
                          <Form.Item label="Khách hàng">
                            <Row>
                              <Select
                                class="custom-select custom-select-lg mb-3"
                                placeholder="Chọn"
                                onChange={
                                  (value, name) => this.handleCustomer(value, name)}
                                validations={[required]}
                              >
                                <Option
                                  value=""
                                  style={{ color: "rgba(125, 125, 125, 0.7)" }}
                                >
                                  Bỏ chọn
                                </Option>
                                {this.state.listCustomer.length !== 0 ? this.state.listCustomer.map((value) => {
                                  return (
                                    <Option value={value.id}>{value.name}</Option>
                                  )
                                }
                                ) : ""}
                              </Select>
                            </Row>
                          </Form.Item>
                        </Col>
                      </Fragment>
                      ) : ""
                    }

                    <Col xs={14} md={1}></Col>
                    <Col xs={14} md={3}>
                      {/* <Form.Item label="Loại">
                        <Row>
                          <Radio.Group
                            onChange={(e) => this.handleOnchangeType(e)}
                            defaultValue="V" buttonStyle="solid">
                            <Radio.Button value="V">Vỏ</Radio.Button>
                            <Radio.Button value="B">Bình</Radio.Button>

                          </Radio.Group>
                        </Row>
                      </Form.Item> */}
                    </Col>
                  </Row>
                  <div className="border_form">
                    {listCylinder.map((item, index) => (
                      <div className="chon" id="modal_form" key={index}>
                        <Row>
                          <Col xs={14} md={4}>
                            {Loading === false ? (
                              <Form.Item
                                label="Loại bình"
                                style={{ display: "block", width: "200px" }}
                              >
                                <Select
                                  class="custom-select custom-select-lg mb-3"
                                  name="cylinderType"
                                  id="cylinderType"
                                  placeholder="Chọn"
                                  onChange={(e) =>
                                    this.handleProvinceChange(e, index)
                                  }
                                  validations={[required]}
                                >
                                  <Option
                                    value=""
                                    style={{ color: "rgba(125, 125, 125, 0.7)" }}
                                  >
                                    Bỏ chọn
                                </Option>
                                  {this.state.listTypeCylinder.map((province) => (
                                    <Option key={province.name}>{province.name}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            ) : (
                                <Form.Item
                                  label="Loại bình"
                                  style={{ display: "block", width: "200px" }}
                                >
                                  <Input
                                    className="input"
                                    value=""

                                  ></Input>
                                </Form.Item>
                              )}

                          </Col>
                          <Col xs={1}></Col>
                          <Col
                            xs={12}
                            md={4}
                            style={{ display: "block", width: "200px" }}
                          >
                            {Loading === false ? (
                              <Form.Item
                                label="Loại van"
                                style={{ display: "block", width: "200px" }}
                              >
                                <Input
                                  className="input"
                                  type="text"
                                  name="valve"
                                  id="valve"
                                  // value={item.countOrder}
                                  // onChange={this.onChangeCountOrder}
                                  onChange={(e) =>
                                    this.onSecondCityChange2(e, index)
                                  }
                                />
                              </Form.Item>
                            ) : (
                                <Form.Item
                                  label="Loại van"
                                  style={{ display: "block", width: "200px" }}
                                >
                                  <Input
                                    className="input"
                                    value=""
                                  // onChange={this.onChangeCountOrder}
                                  />

                                </Form.Item>
                              )}

                          </Col>
                          <Col xs={1}></Col>
                          <Col xs={12} md={4}>
                            {Loading === false ? (
                              <Form.Item label="Màu">
                                <Input
                                  className="input"
                                  type="text"
                                  name="color"
                                  id="color"
                                  // value={item.countOrder}
                                  // onChange={this.onChangeCountOrder}
                                  onChange={(e) =>
                                    this.onSecondCityChange1(e, index)
                                  }
                                />

                              </Form.Item>
                            ) : (
                                <Form.Item
                                  label="Màu"
                                >
                                  <Input
                                    className="input"
                                    value=""
                                  // onChange={this.onChangeCountOrder}
                                  />

                                </Form.Item>
                              )}
                          </Col>
                          <Col xs={1}></Col>
                          <Col xs={12} md={4}>
                            {Loading === false ? (
                              <div className="form-group">
                                <Form.Item
                                  label="Số lượng bình"
                                  style={{ display: "block", width: "200px" }}
                                >
                                  <Input
                                    className="input"
                                    type="number"
                                    id="countOrder"
                                    name="countOrder"
                                    // value={item.countOrder}
                                    // onChange={this.onChangeCountOrder}
                                    onChange={(e) =>
                                      this.handleAgencyChange(e, index)
                                    }
                                  />
                                </Form.Item>
                              </div>
                            ) : (
                                <div className="form-group">
                                  <Form.Item
                                    label="Số lượng bình"
                                    style={{ display: "block", width: "200px" }}
                                  >
                                    <Input
                                      className="input"
                                      type="number"
                                      id="countOrder"
                                      name="countOrder"
                                      value=""
                                    // onChange={this.onChangeCountOrder}
                                    />
                                  </Form.Item>
                                </div>
                              )}
                          </Col>
                          <Col xs={1}></Col>
                          <Col xs={12} md={4}>
                            {Loading === false ?
                              (<Form.Item label="Thương hiệu">
                                <Row>
                                  <Select
                                    class="custom-select custom-select-lg mb-3"
                                    name="manufacturer"
                                    id="manufacturer"
                                    placeholder="Chọn"
                                    onChange={
                                      (e) => this.handleManufacturers(e, index)}
                                    validations={[required]}
                                  >
                                    <Option
                                      value=""
                                      style={{ color: "rgba(125, 125, 125, 0.7)" }}
                                    >
                                      Bỏ chọn
                                </Option>
                                    {this.state.listManufacturers.map((manufacturers) => (
                                      <Option key={manufacturers.name}>{manufacturers.name}</Option>
                                    ))}
                                  </Select>
                                </Row>
                              </Form.Item>) :
                              (
                                <Form.Item
                                  label="Thương hiệu"
                                  style={{ display: "block", width: "200px" }}
                                >
                                  <Input
                                    className="input"
                                    value=""

                                  ></Input>
                                </Form.Item>
                              )
                            }

                          </Col>
                          {/* <Col>
                          <div className="">
                          <a className="btn btn-danger del" id="duy"
                              onClick={
                                (e) => {
                                  this.handleDelClick(e, index)
                                }
                              }
                            ><i className="fa fa-minus"></i></a>
                          </div>
                        </Col> */}
                        </Row>
                      </div>
                    ))}
                    {/* <div className="form-group">
                        <button
                          style={{ marginRight: "5px" }}
                          type="button"
                          class="btn btn-success"
                          onClick={e => this.handleAddClick(e)}
                        >Thêm chi nhánh
                                  </button>
                      </div> */}
                    {/* <FormCreate  
                  /> */}
                    {/* ahihiiiiiiiii */}
                    <div className="widthAdd">
                      <a
                        className="btn btn-danger long"
                        id="duy"
                        onClick={(e) => {
                          // this.handleAddClick(e)
                          // this.setState({
                          //   arrayLength: this.state.arrayLength + 1,
                          // listCylinder: [...this.state.listCylinder, { cylinderType: "", valve: "", color: "", numberCylinder: "" }]
                          this.handleAddClick(e);
                          // });
                          // this.gethandclick
                        }}
                      >
                        <i className="fa fa-plus"></i>
                      </a>
                      <a
                        className="btn btn-danger del"
                        id="duy"
                        onClick={(e) => {
                          this.handleDelClick(e);
                        }}
                      >
                        <i className="fa fa-minus"></i>
                      </a>
                      <span style={{ color: "rgb(255,99,71)" }}>
                        {"Vui lòng chọn 'Bỏ chọn' để có thể xóa bình"}
                      </span>
                    </div>
                  </div>
                  {/* ahihiiiiiiiii */}

                  <Row>
                    <Col xs={1} md={8}></Col>
                    <Col xs={22} md={8}>
                      {Loading === false ? (
                        <Form.Item label="Ghi chú">
                          <div class="form-group">
                            <textarea
                              class="form-control"
                              rows="2"
                              id="comment"
                              value={note}
                              name="comment"
                              onChange={this.onChangeCommon}
                            ></textarea>

                            {/* <textarea class="form-control" rows="2" id="comment" value={common} onChange={this.onChangeCommon} name="common"></textarea> */}
                          </div>
                        </Form.Item>
                      ) : (
                          <Form.Item label="Ghi chú">
                            <div class="form-group">
                              <textarea
                                class="form-control"
                                rows="2"
                                id="comment"
                                value={note}
                                name="comment"
                              ></textarea>
                              {/* <textarea class="form-control" rows="2" id="comment" value={common} onChange={this.onChangeCommon} name="common"></textarea> */}
                            </div>
                          </Form.Item>

                        )}
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={1} md={8}></Col>
                    <Col xs={22} md={8}>
                      <Form.Item>
                        <Button
                          style={{ width: "100%", backgroundColor: "#ED383C" }}
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                          onClick={this.onCreate}
                          disabled={this.state.Loading}
                        >
                          {this.state.Loading === true
                            ? "Loading..."
                            : "Tạo Đơn Hàng"}
                          {/* {this.props.t("Tạo Đơn Hàng")} */}
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col xs={1} md={8}></Col>
                  </Row>
                  <Row>
                    <Col xs={1}></Col>
                    <Col xs={22}>
                      {/* <Table columns={columns} dataSource={listAllOrder} pagination={defaultPageSize} /> */}
                    </Col>
                    <Col xs={1}></Col>
                  </Row>
                </Form>
              </Col>
              <Col xs={1}></Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
export default (CreateOrder);
