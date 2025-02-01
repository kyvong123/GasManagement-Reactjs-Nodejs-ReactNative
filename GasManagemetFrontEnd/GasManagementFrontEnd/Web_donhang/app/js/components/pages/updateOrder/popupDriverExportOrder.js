import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
//import Select from "react-select";
import SelectMulti from "react-select";

import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";
//import TagAutocomplete from "TagAutoComplete";
import getUserCookies from "./../../../helpers/getUserCookies";
import getAllUserApi from "getAllUserApi";
import { NAMEDRIVE, GETTYPECUSTOMER, CREATEEXPORTORDERHISTORY, GETDRIVE } from "../../../config/config";
import callApi from './../../../util/apiCaller';
import { Select, Checkbox } from "antd";
import createHistoryAPI from "createHistoryAPI";
import getListBranchAPI from "./../../../../api/getListBranchAPI";
//import openNotificationWithIcon from "./../../../helpers/notification";
import createShippingOrder from "../../../../api/createShippingOrder"
import getAllProvince from "../../../../api/getAllProvince"
import sendNotification from "./../../../../api/sendNotification";
import updateShippingOrder from "./../../../../api/updateShippingOrder";
const Option = Select.Option;


//var user_cookie = await getUserCookies();
//let token="Bearer " + user_cookie.token,
//"email": user_cookie.user.email,
class PopupDriverExportOrder extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      isShowNumber: false,
      AgencyResults: [],
      GeneralResults: "",
      listExportPlaceData: "",
      listExportPlaceDataID: "",
      driverName: "",
      idDriver: "",
      listDriver: [],
      listDistributionAgency: [],
      listIndustry: [],
      listRestaurant: [],
      typeCustomer: "",
      listCustomer: [],
      CustomerResults: [],
      listBranch: [],
      BranchResults: [],
      display: true,
      checked: false,
      textDriver: '',
      deliveryDate: "",
      selectedOrderIDs: [],
      customerCode: [],
      listProvince: [

      ],
      provinceCode: "",
      idCustomer: "",
      playerID: "",
      iddata: ""
    };
  }

  handleChangeGeneral = async (e) => {
    await this.setState({
      GeneralResults: e.target.value
    });
    // console.log("id general", this.state.GeneralResults);
    await this.getListBranch(this.state.GeneralResults);
  };

  handleChangeBranch = (langValue) => {
    // console.log("!!!!", langValue);
    this.setState({ BranchResults: langValue });
  };

  handleChangeCustomer = (langValue) => {
    this.setState({ CustomerResults: langValue });
  };
  handleChangeCustomer1 = (langValue) => {
    if (this.state.CustomerResults.length >= 1) {
      showToast("Chỉ được chọn một tài xế!", 3000);
      this.setState({ CustomerResults: [] });
    }
    else {
      this.setState({ CustomerResults: langValue });
    }

  }
  handleChangeAgency = (langValue) => {
    this.setState({ AgencyResults: langValue });
    // console.log("id agency", this.state.AgencyResults);
  };

  handleChangeDriver = (value, playerID) => {
    this.setState({
      idDriver: value,
      playerID: playerID.props.playerID
    });
  };
  handleTextDriver = (e) => {
    this.setState({
      textDriver: e.target.value,
      idDriver: ''
    })
    console.log("textDriver")
  }
  handleChangeTypeCustomer = (value) => {
    this.setState({
      typeCustomer: value,
    });
  };
  handleChangeListProvince = (value) => {

    this.setState({
      provinceCode: value,
    });
    console.log("handleChangeListProvince", value)

  };

  async getAllCustomer() {
    const dataUsers = await getAllUserApi(Constant.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constant.HTTP_SUCCESS_BODY) {
        let listCustomerTemp = [];
        for (let i = 0; i < dataUsers.data.length; i++) {
          listCustomerTemp.push({
            value: dataUsers.data[i].id,
            label: dataUsers.data[i].name,
            ...dataUsers.data[i],
          })
        }
        this.setState({
          listCustomer: listCustomerTemp
        })
      }
      else {
        showToast(
          dataUsers.data.message
            ? dataUsers.data.message
            : dataUsers.data.err_msg,
          2000
        );
      }
    }
    else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }

  async getDistributionAgencyCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: "5f5b37b1bb976f2ba0cb9f90",
      customerType: "Distribution_Agency"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang dai ly", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listDistributionAgencyTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listDistributionAgencyTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listDistributionAgency: listDistributionAgencyTemp
          })
        }
        else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg,
            2000
          );
          return false;
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }

  async getIndustryCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: "5f5b37b1bb976f2ba0cb9f90",
      customerType: "Industry"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang cong nghiep", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listIndustryTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listIndustryTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listIndustry: listIndustryTemp
          })
        }
        else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg,
            2000
          );
          return false;
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }

  async getRestaurantCustomer(id, token) {
    let reqListCustomer = {
      isChildOf: "5f5b37b1bb976f2ba0cb9f90",
      customerType: "Restaurant_Apartment"
    };
    let params = {
      reqListCustomer
    };
    await callApi("POST", GETTYPECUSTOMER, params, token).then(res => {
      // console.log("khach hang nha hang", res.data);
      if (res.data) {
        if (res.data.success === true) {
          let listRestaurantTemp = [];
          for (let i = 0; i < res.data.data.length; i++) {
            listRestaurantTemp.push({
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              ...res.data.data[i]
            })
          }
          this.setState({
            listRestaurant: listRestaurantTemp
          })
        }
        else {
          showToast(
            res.data.message
              ? res.data.message
              : res.data.err_msg,
            2000
          );
          return false;
        }
      }
      else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }
    });
  }

  async getListBranch(id) {
    let listBranchTemp = [];
    const dataBranch = await getListBranchAPI(id);
    // console.log("data branch", dataBranch.data.data);
    for (let i = 0; i < dataBranch.data.data.length; i++) {
      listBranchTemp.push({
        value: dataBranch.data.data[i].id,
        label: dataBranch.data.data[i].name,
        ...dataBranch.data.data[i]
      })
    }
    this.setState({
      listBranch: listBranchTemp
    })
  }
  async addHistoryTurnBack(
    driver,
    license_plate,
    cylinders,
    type,
    stationId,
    numberOfCylinder,
    idDriver,
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow,
    idCustomer
  ) {
    this.setState({ isLoading: true });
    // console.log(stationId);
    const user = await createHistoryAPI(
      driver,
      license_plate,
      cylinders,
      Constant.IMPORT_FACTORY,
      '',
      type,
      numberOfCylinder,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      idDriver,
      sign,
      cylinderImex,
      idImex,
      typeImex,
      flow,
      idCustomer
    );
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY && !user.data.hasOwnProperty("err_msg")) {
        // showToast('Nhập hàng thành công!', 3000);
        // const modal = $("#export-driver-order");
        // modal.modal('hide');
        //this.props.refresh();
        return {
          success: true,
          message: 'SUCCESS'
        }
      }
      else {
        openNotificationWithIcon('error', 'Nhập hàng thất bại')
        // const modal = $("#export-driver-order");
        // modal.modal('hide');
        //this.props.refresh();
        return {
          success: false,
          message: 'FALSE'
        }
      }
    }
    else {
      openNotificationWithIcon('error', 'Xảy ra lỗi trong quá trình nhập hàng');
      return {
        success: false,
        message: 'FALSE'
      }
    }
    //this.setState({registerSuccessful: false});

  };
  async addHistory(
    driverName,
    license_plate,
    cylinders,
    to_array,
    number_array,
    idDriver,
    sign,
    cylinderImex,
    idImex,
    typeImex,
    flow
  ) {

    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;

    let params = {
      userId: user_cookies.user.id,

      // Chi tiết export
      type: 'EXPORT',
      driver: driverName,
      license_plate,
      from: user_cookies.user.id,
      toArray: to_array,
      numberArray: number_array,
      cylinders,
      idDriver,
      signature: sign,
      cylinderImex,
      idImex,
      typeImex,
      flow,

      // Đơn hàng
      orderId: this.props.selectedOrderIDs,
    };


    const result = await callApi("POST", CREATEEXPORTORDERHISTORY, params, token).then((res) => {
      console.log('check_cylidners_for_order', res.data)
      const resData = res.data
      // const modal = $("#export-driver-order");
      // modal.modal("hide");
      if (resData.status && resData.resCode === 'SUCCESS-00002') {
        // return openNotificationWithIcon("success", resData.message)
        // openNotificationWithIcon("success", 'Xuất hàng thành công')
        return {
          success: true,
          message: 'SUCCESS'
        }
      }
      else {
        openNotificationWithIcon("error", 'Xuất hàng thất bại')
        return {
          success: false,
          message: 'FALSE'
        }
      }
    }).catch(function (error) {
      openNotificationWithIcon("error", 'Lỗi xuất hàng')
      return {
        success: false,
        message: error
      }
    });

    if (result.success) {
      return {
        success: true,
        message: result.message
      }
    }
    else {
      return {
        success: false,
        message: result.message
      }
    }

  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    let id;
    let token = "Bearer " + user_cookies.token;
    // console.log("user cookieess999", user_cookies.user);
    let params = {
      id: user_cookies.user.id,
    };
    if (user_cookies.user.userType === "Factory" && user_cookies.user.userRole === "Owner") {
      id = user_cookies.user.isChildOf
    }
    else {
      id = user_cookies.user.id;
    }

    await callApi("POST", GETDRIVE, params, token).then((res) => {
      console.log("NAMEDRIVENAMEDRIVE", res)
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [{
            name: "Bạn chưa có tài xế",
            id: "null"
          }],
        });
      }
      else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState(
          {
            listDriver: res.data.data,
          },
          () => console.log(this.state.listDriver)
        );
      }
    });
    await this.getAllCustomer();
    await this.getDistributionAgencyCustomer(id, token);
    await this.getIndustryCustomer(id, token);
    await this.getRestaurantCustomer(id, token);
    let data = await getAllProvince();
    this.setState({
      listProvince: data.data.Provinces
    })



  }


  submit = async (event) => {

    event.preventDefault();
    // console.log('submit event')
    let user_cookies = await getUserCookies();
    let data = this.form.getValues();
    let ShippingCustomerDetail = []
    let { listDriver, textDriver } = this.state;
    if (this.state.checked === false) {
      var index = listDriver.findIndex((l) => l.id === this.state.idDriver);
      var nameDriver = listDriver[index].name;
    }
    else if (this.state.checked === true) {
      var textDrivers = textDriver;
    }

    //// var products=await this.getAllCylenders();
    var cylinders = [];
    let cylinderImex = [];
    let cylinderImexTurnBack = [];
    for (let i = 0; i < this.props.product_parse.length; i++) {
      cylinders.push(this.props.product_parse[i].id);
      cylinderImex.push(
        {
          id: this.props.product_parse[i].id,
          status: "FULL",
          condition: "NEW"
        }
      )
      cylinderImexTurnBack.push(
        {
          id: this.props.product_parse[i].id,
          status: "FULL",
          condition: "NEW"
        }
      )
    }


    // console.log("data checkbox", this.state.checked);
    // console.log("data", data);
    // console.log("numberGeneral0", data.numberGeneral0);
    // console.log(data["numberGeneral1"]);
    let toArray = [];
    let numberArray = [];
    let generalList = this.state.GeneralResults;
    let branchList = this.state.BranchResults;
    let customerList = this.state.CustomerResults;
    let idImex = Date.now();
    let typeImex = "OUT";
    let flow = "EXPORT";
    let typeImexTurnBack = "IN";
    let flowTurnBack = "IMPORT";
    //let agencyList = this.state.AgencyResults;
    if (customerList.length === 0 && generalList.length === 0) {
      showToast("Hãy chọn nơi cần xuất bình");
      return;
    } else {
      // console.log(branchList)
      // console.log(customerList)
      for (let i = 0; i < branchList.length; i++) {
        toArray.push(branchList[i].value);
        // if (data["numberGeneral" + i])
        // {
        //   numberArray.push(data["numberGeneral" + i]);

        // }
        if (data["numberAgency" + i]) {

          numberArray.push(data["numberAgency" + i]);
          ShippingCustomerDetail.push({
            "numberCylinder": data["numberAgency" + i],
            "customerId": branchList[i].value
          })
        }
        else {
          numberArray.push(0);
        }
      }

      for (let i = 0; i < customerList.length; i++) {
        toArray.push(customerList[i].value);

        if (data["numberGeneral" + i]) {
          numberArray.push(data["numberGeneral" + i]);

          ShippingCustomerDetail.push({
            "numberCylinder": data["numberGeneral" + i],
            "customerId": customerList[i].value
          })
        }
        else
          numberArray.push(0);

      }

      ShippingCustomerDetail.map(v => {
        this.setState({
          idCustomer: v.customerId
        })
      })
    }

    this.props.selectedOrderInfor.map(v => {
      this.setState({
        deliveryDate: v.deliveryDate,
      })
    })
    let selectedOrderIDs = []
    this.props.selectedOrderInfor.map((item, index) => {

      this.props.selectedOrderIDs.map(v => {
        console.log("iddatas", v)
        this.setState({
          iddata: v
        })
        if (item.id === v) {
          selectedOrderIDs.push({
            "orderId": v,
            "provinceId": item.provinceId,
          });
        }
      });
    });
    console.log("selectedOrderIDs", selectedOrderIDs);
    console.log("this.props.selectedOrderInfor112", this.props.selectedOrderInfor);
    this.setState({
      selectedOrderIDs: selectedOrderIDs
    })
    console.log("selectedOrderIDs", selectedOrderIDs);
    //lấy ngày
    let date = new Date(this.state.deliveryDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    let deliverydate = dt + '/' + month + '/' + year
    // console.log(year + '-' + month + '-' + dt);
    //lấy giờ
    const _time = (new Date(this.state.deliveryDate));
    let startHour
    let hour = _time.getHours();
    let minute = _time.getMinutes();
    if (hour < 7) {
      hour = hour + 17
      startHour = hour + ":" + minute;
    } else {
      hour = hour - 7
      startHour = "0" + hour + ":" + minute;
    }
    // console.log(deliverydate, startHour)
    let ShippingOrder
    // console.log(this.state.checked, nameDriver, textDrivers)
    ShippingOrder = {
      "driverId": nameDriver !== undefined ? this.state.idDriver : null,
      "nameDriver": nameDriver == undefined ? textDrivers : nameDriver,
      "licensePlate": data.license_plate,
      "deliveryDate": deliverydate,
      "deliveryHours": startHour,
      // "provinceId": this.state.checked === true ? null : this.state.provinceCode,
      "createdBy": user_cookies.user.id

    }
    if (this.state.checked === false) {
      await this.addHistory(
        nameDriver,
        data.license_plate,
        cylinders,
        toArray,
        numberArray,
        this.state.idDriver,
        "Xuất đơn hàng trên WEB",
        cylinderImex,
        idImex,
        typeImex,
        flow
      );

      let resultShipping = await createShippingOrder
        (
          ShippingOrder,
          this.state.selectedOrderIDs,
          ShippingCustomerDetail,
          this.props.ShippingTextDetail
        )
      console.log("resultShipping", resultShipping.data.ShippingOrder.id)
      if (resultShipping.data.success === true) {
        let resultUpdateShipping = await updateShippingOrder
          (
            resultShipping.data.ShippingOrder.id,
            "2"
          )
        if (resultUpdateShipping.data.success === true) {
          let resultNotify = await sendNotification
            (
              "Thông báo đơn vận chuyển",
              "Bạn đã nhận được 1 đơn vận chuyển",
              this.state.playerID,
              resultShipping.data.ShippingOrder.id
            )
          console.log("resultNotify.data.status", resultNotify.data.status)
          const modal = $("#export-driver-order");
          modal.modal('hide');
          if (resultNotify.data.status === false) {
            showToast('Tài xế chưa nhận được thông báo đơn hàng')
          }

        }
        else {
          openNotificationWithIcon('error', resultUpdateShipping.message)
        }
      }
      else {
        openNotificationWithIcon('error', resultShipping.message)
      }
    }
    else if (this.state.checked === true) {

      try {
        // console.log('vao day roi ne xe ngoai this.state.idCustomer', this.state.idCustomer);
        // await Promise.all([
        //   this.addHistory(
        //     textDrivers,
        //     data.license_plate,
        //     cylinders,
        //     toArray,
        //     numberArray,
        //     this.state.idDriver,
        //     "Xuất đơn hàng trên WEB",
        //     cylinderImex,
        //     idImex,
        //     typeImex,
        //     flow
        //   ),
        //   //console.log('xong addHistory');
        //   this.addHistoryTurnBack(
        //     textDrivers,
        //     data.license_plate,
        //     cylinders,
        //     Constant.IMPORT_TYPE,
        //     data.station,
        //     numberArray,
        //     this.state.idDriver,
        //     "Nhập hàng trực tiếp",
        //     cylinderImexTurnBack,
        //     idImex,
        //     typeImexTurnBack,
        //     flowTurnBack,
        //     this.state.idCustomer

        //   ),
        //   createShippingOrder(ShippingOrder, this.state.selectedOrderIDs, ShippingCustomerDetail, this.props.ShippingTextDetail)

        // ])

        const resultExport = await this.addHistory(
          textDrivers,
          data.license_plate,
          cylinders,
          toArray,
          numberArray,
          this.state.idDriver,
          "Xuất đơn hàng trên WEB",
          cylinderImex,
          idImex,
          typeImex,
          flow
        )

        if (resultExport.success) {
          // openNotificationWithIcon('success', 'OK 11')
          const resultImport = await this.addHistoryTurnBack(
            textDrivers,
            data.license_plate,
            cylinders,
            Constant.IMPORT_TYPE,
            data.station,
            numberArray,
            this.state.idDriver,
            "Nhập hàng trực tiếp",
            cylinderImexTurnBack,
            idImex,
            typeImexTurnBack,
            flowTurnBack,
            this.state.idCustomer

          )

          if (resultImport.success) {
            // openNotificationWithIcon('success', 'OK 2222')
            let resultShipping = await createShippingOrder(
              ShippingOrder,
              this.state.selectedOrderIDs,
              ShippingCustomerDetail,
              this.props.ShippingTextDetail
            )

          }
          else {
            openNotificationWithIcon('error', resultImport.message)
          }
        }
        else {
          openNotificationWithIcon('error', resultExport.message)
        }
      }
      catch (error) {
        // console.log('LOOI', err.message)
        openNotificationWithIcon('error', error)
      }
    }
  }

  async submitTextFile(event) {
    // /* if (!file) showToast('Vui lòng chọn file!', 3000);
    //      this.setState({isLoading: true});
    //      const result = await importProductsFromExcelAPI(file);
    //      this.setState({isLoading: false});
    //      console.log(result);
    //      if (result && result.status === 200) {
    //          if (typeof (result) !== 'undefined') {
    //              showToast('Đưa vào thành công!', 3000);
    //              this.props.refresh();
    //          }
    //          else {
    //              //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
    //          }
    //          return;
    //      } else {
    //          showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
    //      }
    //      return;
    //      $("#import-product").modal('hide');
    //      return;*/
  }

  handleChangeExportType = (langValue) => {
    this.setState({
      listExportPlaceData: langValue,
      listExportPlaceDataID: langValue.id,
    });
  };
  // handleClickOutCar = (e) => {
  //   this.setState({
  //     display: !this.state.display,
  //     checked: !this.state.checked
  //   })
  // }
  handleOnChangeCheck = async (e) => {
    await this.setState({
      checked: e.target.checked
    })
    console.log("this.state.checked", this.state.checked)
    console.log("this.state.checked1", e.target.checked)
  }

  // resetForm() {
  //   this.form.reset()
  // }
  render() {
    console.log("selectedOrderIDs1111111111111111111", this.props.selectedOrderInfor);
    //console.log("hahahhahaha", this.props.listExportPlace);
    const display = this.state.display ? 'none' : '' // toggle css display: none
    const checked = this.state.checked ? true : false // toggle checked
    let ar = [];
    return (
      <div
        className="modal fade"
        id="export-driver-order"
        tabIndex="-1"
        style={{ overflowY: "auto" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Đơn Hàng: Xuất Bình - Bước 2 - Thông Tin Tài Xế
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                ref={(c) => {
                  this.form = c;
                }}
                className="card"
                onSubmit={(event) => this.submit(event)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="row col-12">
                      <div className="col-md-2">
                        <div className="form-group d-flex justify-content-between">
                          <Checkbox className="text-align-left"
                            name="checkCarOut"
                            id="checkCarOut"
                            checked={this.state.checked}
                            onChange={this.handleOnChangeCheck}

                          >
                            <label>Xe ngoài</label>
                          </Checkbox>
                          {/* <Checkbox className="text-align-right" 
                                  style={{display: display}}
                        >
                          <label>Tạo lệnh nhập kho</label>
                        </Checkbox> */}
                        </div>
                      </div>
                      {/* {this.props.userType === Constant.GENERAL || this.state.checked == true
                        ? ""
                        :
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Mã giao hàng</label>
                            <Select
                              style={{ width: "100%" }}
                              placeholder="Chọn mã giao hàng"
                              onChange={this.handleChangeListProvince}
                            >
                              {this.state.listProvince.map((l, index) => {
                                console.log("Provinces", l)
                                return (
                                  <Option key={index} value={l.id}>
                                    {l.nameProvince}
                                  </Option>
                                );
                              })}
                            </Select>
                          </div>
                        </div>

                      } */}
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        {this.state.checked === true ? (
                          <Input
                            className="form-control"
                            type="text"
                            placeholder="Nhập tài xế..."
                            value={this.state.textDriver}
                            onChange={this.handleTextDriver}
                            style={{ width: "100%" }}
                          />
                        ) : <Select
                          showSearch
                          style={{ width: "100%", display: this.state.display }}
                          placeholder="Chọn tài xế..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listDriver.map((l, index) => {
                            return (
                              <Option key={index} playerID={l.playerID} value={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select>
                        }
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="license_plate"
                          id="license_plate"
                          validations={[required]}
                        />
                        {/* <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Chọn xe..."
                          optionFilterProp="children"
                          onChange={this.handleChangeDriver}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listDriver.map((l, index) => {
                            return (
                              <Option key={index} value={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select> */}
                      </div>
                    </div>

                    {/*<div className="col-md-12">*/}
                    {/*    <div className="form-group">*/}
                    {/*        <label>Loại xuất </label>*/}
                    {/*        <Select onClick={() => {*/}
                    {/*            this.setState({isShowDropdown: this.form.getValues().type_export})*/}
                    {/*        }} className="form-control"*/}
                    {/*                name="type_export"*/}
                    {/*                validations={[required]}>*/}
                    {/*            <option value="0">-- Chọn --</option>*/}
                    {/*            <option value="2">Xuất cho thương nhân mua bán</option>*/}
                    {/*            <option value="3">Xuất cho đại lý</option>*/}
                    {/*        </Select>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*{this.props.userType === Constant.FACTORY && (*/}
                    {/*    <div className="col-md-12">*/}
                    {/*        <div className="form-group">*/}
                    {/*            <label>"Địa điểm xuất bình"</label>*/}
                    {/*            <Select*/}
                    {/*                options={this.props.listExportPlace}*/}
                    {/*                onChange={this.handleChangeExportType.bind(this)}*/}
                    {/*                placeholder="Chọn..."*/}
                    {/*                value={this.state.listExportPlaceData}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                    {this.props.userType === Constant.GENERAL
                      ? ("")
                      : (
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Chọn loại khách hàng</label>
                            <Select
                              style={{ width: "100%" }}
                              placeholder="Chọn loại khách hàng..."
                              onChange={this.handleChangeTypeCustomer}
                            >
                              <Option value="Distribution_Agency">Đại lý phân phối</Option>
                              <Option value="Industry">Khách hàng công nghiệp bình</Option>
                              <Option value="Restaurant_Apartment">Nhà hàng, tòa nhà</Option>
                            </Select>
                          </div>

                          {this.state.typeCustomer !== "Distribution_Agency" &&
                            <div className="form-group">
                              <label>Chọn khách hàng</label>
                              <select
                                className="form-control"
                                style={{ width: "100%" }}
                                placeholder="Chọn khách hàng..."
                                onChange={e => this.handleChangeGeneral(e)}
                                value={this.state.GeneralResults}
                              >
                                <option value="">Chọn khách hàng...</option>
                                {/* {this.state.typeCustomer === "Distribution_Agency" && 
                              this.state.listDistributionAgency.map((l, index) => {
                                return (
                                  <option key={index} value={l.id}>
                                    {l.name}
                                  </option>
                                );
                              })
                            } */}
                                {this.state.typeCustomer === "Industry" &&
                                  this.state.listIndustry.map((l, index) => {
                                    return (
                                      <option key={index} value={l.id}>
                                        {l.name}
                                      </option>
                                    );
                                  })
                                }
                                {this.state.typeCustomer === "Restaurant_Apartment" &&
                                  this.state.listRestaurant.map((l, index) => {
                                    return (
                                      <option key={index} value={l.id}>
                                        {l.name}
                                      </option>
                                    );
                                  })
                                }
                              </select>
                            </div>

                          }


                          {this.state.typeCustomer !== "Distribution_Agency" &&
                            <div className="form-group">
                              <label>Chọn các chi nhánh</label>
                              <SelectMulti.Creatable
                                multi={true}
                                options={this.state.listBranch}
                                onChange={this.handleChangeBranch.bind(this)}
                                placeholder='CHOOSE'
                                value={this.state.BranchResults}
                                promptTextCreator={() => {
                                  return;
                                }}
                              />
                            </div>}
                          {this.state.typeCustomer === "Distribution_Agency" &&
                            <div className="form-group">
                              <label>Chọn các khách hàng</label>
                              <SelectMulti.Creatable
                                multi={true}
                                options={this.state.listDistributionAgency}
                                onChange={checked ? this.handleChangeCustomer1.bind(this) : this.handleChangeCustomer.bind(this)}
                                placeholder='CHOOSE'
                                value={this.state.CustomerResults}
                                promptTextCreator={() => {
                                  return;
                                }}
                              />
                            </div>}
                        </div>
                      )}

                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label>Chọn các khách hàng</label>
                          <SelectMulti.Creatable
                            multi={true}
                            options={this.state.listCustomer}
                            onChange={this.handleChangeCustomer.bind(this)}
                            placeholder="Chọn..."
                            value={this.state.CustomerResults}
                            promptTextCreator={() => {
                              return;
                            }}
                          />

                         <label>Đại lý</label>

                        <SelectMulti.Creatable
                          multi={true}
                          options={this.props.listFactoryExports.filter(
                            (x) => x.userType === Constants.AGENCY
                          )}
                          onChange={this.handleChangeAgency.bind(this)}
                          placeholder="Chọn..."
                          value={this.state.AgencyResults}
                          promptTextCreator={() => {
                            return;
                          }}
                        /> 
                      </div>
                    </div> */}
                    {/* {this.state.typeCustomer === "Distribution_Agency"
                      ? ( */}
                    <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.CustomerResults.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"numberGeneral" + index}
                                    placeholder={"Nhập số lượng"}
                                    //validations={[required]}
                                    className="form-control"
                                    type="number"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* )
                      : ( */}
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.BranchResults.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"numberAgency" + index}
                                    placeholder={"Nhập số lượng"}
                                    //validations={[required]}
                                    className="form-control"
                                    type="number"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* )} */}
                    {/* <div className="col-md-6">
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <tbody className="display-block display-tbody">
                          {this.state.CustomerResults.map((store, index) => {
                            return (
                              <tr key={index}>
                                <td scope="row" className="text-center">
                                  {store.name}
                                </td>
                                <td scope="row" className="text-center">
                                  <Input
                                    name={"numberAgency" + index}
                                    placeholder={"Nhập số lượng"}
                                    className="form-control"
                                    type="number"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div> */}

                    {/* {this.state.isShowDropdown==='1' && (<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Trạm chiết nạp</label>
                                                <Select className="form-control"
                                                        name="station"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listStationUser.map((item, index) => <option value={item.id}>{item.name}</option>)}
                                                </Select>
                                            </div>
                                        </div>)} */}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button className="btn btn-primary" type="submit">
                    Lưu
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                  >
                    Đóng
                  </button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default (PopupDriverExportOrder);
