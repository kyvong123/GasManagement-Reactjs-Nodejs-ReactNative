import React, { Component } from "react";
import { Link } from "react-router";
import Axios from "axios";
import OrderTankTruck_item from "./OrderTankTruck_item";
import { DatePicker, TimePicker, Pagination, Divider, Spin } from "antd";
import "./OrderTankTruck_list.scss";
import getUserCookies from "getUserCookies";
import showToast from "showToast";
import getAllOrderTank from "../../../../api/getAllOrderTankAPI";
import deleteOrderTankTruck from "../../../../api/deleteOrderTankTruckAPI";
import getWareHouseById from "../../../../api/getWareHouseByIdAPI";
import { Tabs } from 'antd';

const { TabPane } = Tabs;

class orderTankTruck_list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderTankData: [],
      customerData: [],
      imageData: [],
      orderTankDataSort: [],
      orderTankDataSortStatus: false,
      itemsPerPages: 10,
      numberPages: 1,
      currentPage: 1,
      userType: "",
      userRole: "",
      loading: false,
      statusOrder: "",
    };
    this.onCheckApproval = this.onCheckApproval.bind(this)
  }

  // Lấy userId của warehouse theo warehouseId
  getUserIdWareHouseById = async (warehouseId) => {
    let data = await getWareHouseById(warehouseId);
    if (data.status === 200 && data.data.status === true) {
        return data.data.WareHouse.userId
    } else {
        return ""
    }
  };

  //Load danh sách đơn hàng
  getAllOrderTank = async () => {
    this.setState({loading: true})
    console.time("getOrderTank")
    const data = await getAllOrderTank();
    const user = await getUserCookies();

    console.log("user",user)

    // Lấy danh sách theo user đăng nhập
    let orderTank = [];
    if (data.status === 200 && data.data.status === true) {
      if (user.user.userRole === "SuperAdmin" && user.user.userType === "Sales") {
        let filter = data.data.OrderTank.filter(item => item.status === "INIT" || item.status === "PENDING" || item.status === "CONFIRMED")
        orderTank = orderTank.concat(filter)
        let filter_cancel = data.data.OrderTank.filter(item => item.status === "CANCELLED")
        orderTank = orderTank.concat(filter_cancel)
        // let filter = data.data.OrderTank.filter(item => item.status === status)
        // orderTank = orderTank.concat(filter)
        // console.log(orderTank)
      }
      else if (user.user.userRole === "SuperAdmin" && user.user.userType === "Accounting") {
        let filter = data.data.OrderTank.filter(item => item.status === "INIT" || item.status === "PENDING" || item.status === "CONFIRMED")
        orderTank = orderTank.concat(filter)
        let filter_cancel = data.data.OrderTank.filter(item => item.status === "CANCELLED")
        orderTank = orderTank.concat(filter_cancel)
      }
      else if (user.user.userRole === "SuperAdmin" && user.user.userType === "Manager") {
        let filter = data.data.OrderTank.filter(item => item.status === "PENDING" || item.status === "CONFIRMED")
        orderTank = orderTank.concat(filter)
        let filter_cancel = data.data.OrderTank.filter(item => item.status === "CANCELLED")
        orderTank = orderTank.concat(filter_cancel)
      }
      else if (user.user.userRole === "SuperAdmin" && user.user.userType === "Warehouse") {
        let filter = data.data.OrderTank.filter(item => item.status === "CONFIRMED" || item.status === "DELIVERING" || item.status === "DELIVERED" || item.status === "PROCESSING")
        let filterByWareHouse = filter.filter(item => item.warehouseId.code === user.user.warehouseCode && item.warehouseId.userId === user.user.isChildOf)
        orderTank = orderTank.concat(filterByWareHouse)
      }
      else if (user.user.userRole === "SuperAdmin" && user.user.userType === "Region") {
        let filter = data.data.OrderTank.filter(item => item.status === "CONFIRMED" || item.status === "DELIVERING" || item.status === "DELIVERED" || item.status === "PROCESSING")
        let filterByRegion = filter.filter(item => item.warehouseId.userId === user.user.id)
        orderTank = orderTank.concat(filterByRegion)
      }
      else {
        orderTank = orderTank.concat(data.data.OrderTank)
      }

      console.log(orderTank)
      this.setState({
        userType: user.user.userType,
        userRole: user.user.userRole,
        orderTankData: orderTank,
        imageData: data.data.Image,
        numberPages: Math.ceil(
          orderTank.length / this.state.itemsPerPages
        ),
        loading: false,
      });
      console.timeEnd("getOrderTank");
    } else {
      showToast(data.message);
    }
  };
  // Xoá đơn hàng theo id
  deleteOrderTankById = async (id) => {
    let data = await deleteOrderTankTruck(id);
    if (data.status === 200) {
      showToast("Xoá thành công");
    } else {
      showToast(data.message);
    }
  };
  //sự kiện Xoá item đơn hàng
  handleDelete = async (item) => {
    let deleteItem = item;
    await this.deleteOrderTankById(deleteItem);
    this.setState((prevState) => ({
      orderTankData: prevState.orderTankData.filter(
        (elm) => elm.id !== deleteItem
      ),
    }));
    this.getAllOrderTank();
  };

  async componentDidMount() {
    await this.getAllOrderTank();
  }
  renderOrder = () => {
    if (this.state.orderTankData !== []) {
      let data = [];
      // let orderTankData_temp = []
      // let filter = this.state.orderTankData.filter(item => item.status === String(status))
      // orderTankData_temp = orderTankData_temp.concat(filter)

      if (this.state.orderTankDataSortStatus === false) {
        data = this.state.orderTankData.slice(
          (this.state.currentPage - 1) * this.state.itemsPerPages,
          this.state.currentPage * this.state.itemsPerPages
        );
      } else if (this.state.orderTankDataSortStatus === true) {
        data = this.state.orderTankDataSort.slice(
          (this.state.currentPage - 1) * this.state.itemsPerPages,
          this.state.currentPage * this.state.itemsPerPages
        );
      }

      // this.setState({
      //   numberPages: Math.ceil(
      //     data.length / this.state.itemsPerPages
      //   )
      // })
     
      return data.map((order, index) => {
        return (
          <tr key={index}>
            <OrderTankTruck_item
              onChecked={this.onCheckApproval}
              imageArr={this.state.imageData[index]}
              order={order}
              index={index}
              handleDelete={this.handleDelete}
              // getAllOrderTank={this.getAllOrderTank}
            />
          </tr>
        );
      })
    }
  };
  Xoa_Dau_VN(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  }
  async onSearch(e) {
    let search=document.querySelector('#search');
    search.setAttribute("class","btn btn-success  w-100 btnTimKiem");
    
    let resetTable=document.querySelector('#resetTable');
    resetTable.setAttribute("class","btn   w-100 btnTimKiem");
    var select = document.getElementById("status").value;
    var orderCode = document.getElementById("oderCode").value;
    var customerCode = document.getElementById("customerCode").value;
    if (select.length === 0) alert("Vui lòng nhập vào ?");
    else if (select === "") alert("vui lòng chọn loại tìm kiếm!");
    else {
      if (select === "Trạng thái" && orderCode === "" && customerCode === "") {
        this.setState({
          orderTankDataSortStatus: false,
          numberPages: Math.ceil(
            this.state.orderTankData.length / this.state.itemsPerPages
          ),
        });
      } else if (select === "Trạng thái" && orderCode !== "") {
        if (customerCode === "") {
          if (select === "Trạng thái") {
            const temp = this.state.orderTankData.filter((item) => {
              let nameFix = this.Xoa_Dau_VN(item.orderCode).toLowerCase();
              let inputfix = this.Xoa_Dau_VN(orderCode).toLowerCase();
              return nameFix.includes(inputfix);
            });
            this.setState({
              orderTankDataSort: temp,
              orderTankDataSortStatus: true,
              numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
            });
          } else if (select !== "Trạng thái") {
            const temp = this.state.orderTankData.filter((item) => {
              let nameFix = this.Xoa_Dau_VN(item.orderCode).toLowerCase();
              let statusFix = this.Xoa_Dau_VN(item.status).toLowerCase();
              let inputfix = this.Xoa_Dau_VN(orderCode).toLowerCase();
              let selectfix = this.Xoa_Dau_VN(select).toLowerCase();
              return (
                nameFix.includes(inputfix) && statusFix.includes(selectfix)
              );
            });
            this.setState({
              orderTankDataSort: temp,
              orderTankDataSortStatus: true,
              numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
            });
          }
        } else if (customerCode !== "") {
          if (select === "Trạng thái") {
            const temp = this.state.orderTankData.filter((item) => {
              let nameFix = this.Xoa_Dau_VN(item.orderCode).toLowerCase();
              let codeFix =item.customergasId ? this.Xoa_Dau_VN(
                item.customergasId.code
              ).toLowerCase():"";
              let inputfix = this.Xoa_Dau_VN(orderCode).toLowerCase();
              let customerfix = this.Xoa_Dau_VN(customerCode).toLowerCase();
              return (
                nameFix.includes(inputfix) && codeFix.includes(customerfix)
              );
            });
            this.setState({
              orderTankDataSort: temp,
              orderTankDataSortStatus: true,
              numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
            });
          } else if (select !== "Trạng thái") {
            const temp = this.state.orderTankData.filter((item) => {
              let nameFix = this.Xoa_Dau_VN(item.orderCode).toLowerCase();
              let codeFix = item.customergasId ?this.Xoa_Dau_VN(
                item.customergasId.code
              ).toLowerCase():"";
              let statusFix = this.Xoa_Dau_VN(item.status).toLowerCase();
              let inputfix = this.Xoa_Dau_VN(orderCode).toLowerCase();
              let customerfix = this.Xoa_Dau_VN(customerCode).toLowerCase();
              let selectfix = this.Xoa_Dau_VN(select).toLowerCase();
              return (
                nameFix.includes(inputfix) &&
                codeFix.includes(customerfix) &&
                statusFix.includes(selectfix)
              );
            });
            this.setState({
              orderTankDataSort: temp,
              orderTankDataSortStatus: true,
              numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
            });
          }
        }
      } else if (select === "Trạng thái" && orderCode === "") {
        if (customerCode !== "") {
          const temp = this.state.orderTankData.filter((item) => {
            let nameFix = this.Xoa_Dau_VN(item.orderCode).toLowerCase();
            let statusFix = this.Xoa_Dau_VN(item.status).toLowerCase();
            let codeFix = item.customergasId ? this.Xoa_Dau_VN(
              item.customergasId.code
            ).toLowerCase() :"";
            

            let inputfix = this.Xoa_Dau_VN(orderCode).toLowerCase();
            let selectfix = this.Xoa_Dau_VN(select).toLowerCase();
            let customerfix = this.Xoa_Dau_VN(customerCode).toLowerCase();

            return codeFix.includes(customerfix);
          });
          this.setState({
            orderTankDataSort: temp,
            orderTankDataSortStatus: true,
            numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
          });
        }
      } else if (select !== "Trạng thái" && orderCode === "") {
        if (customerCode !== "") {
          const temp = this.state.orderTankData.filter((item) => {
            let statusFix = this.Xoa_Dau_VN(item.status).toLowerCase();
            let codeFix = item.customergasId ?this.Xoa_Dau_VN(
              item.customergasId.code
            ).toLowerCase():"";

            let customerfix = this.Xoa_Dau_VN(customerCode).toLowerCase();
            let selectfix = this.Xoa_Dau_VN(select).toLowerCase();
            return (
              codeFix.includes(customerfix) && statusFix.includes(selectfix)
            );
          });
          this.setState({
            orderTankDataSort: temp,
            orderTankDataSortStatus: true,
            numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
          });
        }
        if (customerCode === "") {
          const temp = this.state.orderTankData.filter((item) => {
            let selectfix = this.Xoa_Dau_VN(select).toLowerCase();
            let statusFix = this.Xoa_Dau_VN(item.status).toLowerCase();
            return statusFix.includes(selectfix);
          });
          this.setState({
            orderTankDataSort: temp,
            orderTankDataSortStatus: true,
            numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
          });
        }
      } else if (select !== "Trạng thái" && orderCode !== "") {
        if (customerCode === "") {
          const temp = this.state.orderTankData.filter((item) => {
            let nameFix = this.Xoa_Dau_VN(item.orderCode).toLowerCase();
            let statusFix = this.Xoa_Dau_VN(item.status).toLowerCase();
            let inputfix = this.Xoa_Dau_VN(orderCode).toLowerCase();
            let selectfix = this.Xoa_Dau_VN(select).toLowerCase();
            return nameFix.includes(inputfix) && statusFix.includes(selectfix);
          });
          this.setState({
            orderTankDataSort: temp,
            orderTankDataSortStatus: true,
            numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
          });
        } else if (customerCode !== "") {
          const temp = this.state.orderTankData.filter((item) => {
            let nameFix = this.Xoa_Dau_VN(item.orderCode).toLowerCase();
            let codeFix = item.customergasId ?this.Xoa_Dau_VN(
              item.customergasId.code
            ).toLowerCase():"";
            let statusFix = this.Xoa_Dau_VN(item.status).toLowerCase();

            let inputfix = this.Xoa_Dau_VN(orderCode).toLowerCase();
            let customerfix = this.Xoa_Dau_VN(customerCode).toLowerCase();
            let selectfix = this.Xoa_Dau_VN(select).toLowerCase();
            return (
              nameFix.includes(inputfix) &&
              codeFix.includes(customerfix) &&
              statusFix.includes(selectfix)
            );
          });
          this.setState({
            orderTankDataSort: temp,
            orderTankDataSortStatus: true,
            numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
          });
        }
      } else {
        const temp = this.state.orderTankData.filter((item) => {
          return item.status === select;
        });
        this.setState({
          orderTankDataSort: temp,
          orderTankDataSortStatus: true,
          numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
        });
      }
    }
  }
  resetOrderTable(e){
    // let select = document.getElementById("status").value;
    // let orderCode = document.getElementById("oderCode").value;
    // let customerCode = document.getElementById("customerCode").value;
    var selectElement = document.querySelectorAll('#status, #oderCode, #customerCode,#resetTable');
    // console.log("selectElement",selectElement);
    for(let i=0;i<selectElement.length;i++){
      // console.log("selectElement[i].value",selectElement[i].getAttribute("id"));
      if(selectElement[i].getAttribute("id")==="customerCode"){
        selectElement[i].value="";
      }
      if(selectElement[i].getAttribute("id")==="status"){
        selectElement[i].value="Trạng thái";
      }
      if(selectElement[i].getAttribute("id")==="oderCode"){
        selectElement[i].value="";
      }
      if(selectElement[i].getAttribute("id")==="resetTable"){
        // selectElement[i].removeAttribute("class");
        let search=document.querySelector('#search');
        // console.log("search",search);
        search.setAttribute("class","btn  w-100 btnTimKiem");
        selectElement[i].setAttribute("class","btn  btn-success w-100 btnNhapLai");
      }
      
    }
    const temp = this.state.orderTankData;
    this.setState({
      orderTankDataSortStatus: false,
      numberPages: Math.ceil(temp.length / this.state.itemsPerPages),
    })
    }
  handleChangePage(event) {
    this.setState({
      // listShippingText :data,
      currentPage: event,
    });
    // console.log("evnt1",currentPage);
  }

  // đang test
  onCheckApproval = async (checked) => {
    if (checked) {
      await this.getAllOrderTank();
    }
  }

  // renderOrderTableByStatus = (status) => {
  //   return (
  //     <React.Fragment>
  //       <Spin spinning={this.state.loading} tip="Đang tải dữ liệu..." size="default">
  //         <table class="table table-bordered">
  //           <thead>
  //             <tr className="text-center">
  //               <th className="font-weight-bold">STT</th>
  //               <th className="font-weight-bold">Mã khách hàng</th>
  //               <th className="font-weight-bold">Tên khách hàng</th>
  //               <th className="font-weight-bold">Kho xuất hàng</th>
  //               <th className="font-weight-bold">Mã đơn hàng</th>
  //               <th className="font-weight-bold">Ngày giao</th>
  //               <th className="font-weight-bold">Loại hàng</th>
  //               <th className="font-weight-bold">Khối lượng (tấn)</th>
  //               <th className="font-weight-bold">Ghi chú</th>
  //               <th className="font-weight-bold">Trạng thái</th>
  //               <th className="font-weight-bold" style={{ minWidth: "105px" }}>Thao tác</th>
  //             </tr>
  //           </thead>
  //           <tbody className="text-center">{() => this.renderOrder}</tbody>
  //         </table>
  //       </Spin>
  //       <div className="card" style={{ textAlign: "right" }}>
  //         <Divider orientation="center">
  //           <Pagination
  //             defaultCurrent={1}
  //             defaultPageSize={this.state.itemsPerPages}
  //             total={this.state.numberPages * this.state.itemsPerPages}
  //             onChange={(onPage) => this.handleChangePage(onPage)}
  //           // this.setState({ currentPage: onPage})
  //           />
  //         </Divider>
  //       </div>
  //     </React.Fragment>
  //   )
  // }
  // callback = async(key) => {
  //   await this.getAllOrderTank(key)
  // }

  render() {
    return (
      <div className="container-fluid bg-white mt-5" id="orderTank-truck">
        {/* Box option */}
        <div className="mt-4 mb-2" style={{ border: "1px solid #928b8b" }}>
          <div
            className="font-weight-bold"
            style={{ fontSize: "20px", borderBottomColor: "#928b8b" }}
          >
            <i
              className="fa fa-star"
              style={{ color: "orange", marginLeft: "15px" }}
            ></i>{" "}
            Đơn hàng
          </div>
          <div className="row pr-3 pl-3 mt-2 mb-2">
            <div className="col-xl-2 col-lg-4 col-md-6 col-sm-4 col-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control inputKhachHang"
                  name="customerCode"
                  id="customerCode"
                  placeholder="Mã khách hàng / Tên khách hàng"
                  style={{ borderColor: "#928b8b" }}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-6 col-sm-4 col-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control inputDonHang"
                  name="oderCode"
                  id="oderCode"
                  placeholder="Mã đơn hàng"
                  style={{
                    borderColor: "#928b8b",
                    color: "#928b8b",
                  }}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-6 col-sm-4 col-6">
              <div className="form-group">
                <select
                  className="custom-select inputTrangThai"
                  id="status"
                  name="status"
                  style={{
                    borderColor: "#928b8b",
                  }}
                >
                  <option selected>Trạng thái</option>
                  <option value="INIT">Khởi tạo</option>
                  <option value="PENDING">Đang chờ duyệt </option>
                  <option value="CONFIRMED">Đã duyệt</option>
                  <option value="PROCESSING">Đang xử lý </option>
                  <option value="DELIVERING">Đang giao</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-6 col-sm-4 col-6">
              <button
                type="button"
                id="search"
                className="btn btn-warning w-100 btnTimKiem"
                onClick={(e) => this.onSearch(e)}
              >
                Tìm kiếm <i className="fa fa-search"></i>
              </button>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-6 col-sm-4 col-6">
              <button
                type="button"
                id="resetTable"
                name="resetTable"
                className="btn btn-secondary w-100 btnNhapLai"
                onClick={(e)=>this.resetOrderTable(e)}
              >
                Nhập lại <i className="fa fa-refresh"></i>
              </button>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-6 col-sm-4 col-6">
              {!((this.state.userRole === "SuperAdmin" && this.state.userType === "Accounting")
                || (this.state.userRole === "SuperAdmin" && this.state.userType === "Manager")
                || (this.state.userRole === "SuperAdmin" && this.state.userType === "Warehouse")) 
              && (
                <Link
                  to="/orderTankTruck-create"
                  style={{ width: "100%", padding: "0" }}
                >
                  <button
                    type="button"
                    className="btn btn-warning w-100 btnTaoDonHang"
                  >
                    Tạo đơn hàng xe bồn
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* List order */}

        {/* <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="Tất cả" key="ALL">
            Danh sách tất cả đơn hàng
            {this.renderOrderTableByStatus("ALL")}
          </TabPane>
          <TabPane tab="Khởi tạo" key="INIT">
            Danh sách đơn hàng khởi tạo
            {this.renderOrderTableByStatus("INIT")}
          </TabPane>
          <TabPane tab="Đang xử lý" key="PROCESSING">
            Danh sách đơn hàng đang xử lý
            {this.renderOrderTableByStatus("PROCESSING")}
          </TabPane>
          <TabPane tab="Đang xử lý" key="CONFIRMED">
            Danh sách đơn hàng đã duyệt
            {this.renderOrderTableByStatus("CONFIRMED")}
          </TabPane>
          <TabPane tab="Đang xử lý" key="DELIVERING">
            Danh sách đơn hàng đang giao
            {this.renderOrderTableByStatus("DELIVERING")}
          </TabPane>
          <TabPane tab="Đang xử lý" key="DELIVERED">
            Danh sách đơn hàng đã giao
            {this.renderOrderTableByStatus("DELIVERED")}
          </TabPane>
          <TabPane tab="Đã hủy" key="CANCELLED">
            Danh sách đơn hàng đã hủy
            {this.renderOrderTableByStatus("CANCELLED")}
          </TabPane>
        </Tabs> */}
        <div id="orderTank-table">
        <Spin spinning={this.state.loading} tip="Đang tải dữ liệu..." size="default">
          <table className="table table-bordered">
            <thead>
              <tr className="text-center">
                <th className="font-weight-bold">STT</th>
                <th className="font-weight-bold">Mã khách hàng</th>
                <th className="font-weight-bold">Tên khách hàng</th>
                <th className="font-weight-bold">Kho xuất hàng</th>
                <th className="font-weight-bold">Mã đơn hàng</th>
                <th className="font-weight-bold">Ngày giao</th>
                <th className="font-weight-bold">Loại hàng</th>
                <th className="font-weight-bold">Khối lượng (tấn)</th>
                <th className="font-weight-bold">Ghi chú</th>
                <th className="font-weight-bold">Trạng thái</th>
                <th className="font-weight-bold" style={{ minWidth: "105px" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-center">{this.renderOrder()}</tbody>
          </table>
        </Spin>
        </div>
        <div className="card" style={{ textAlign: "right" }}>
          <Divider orientation="center">
            <Pagination
              defaultCurrent={1}
              defaultPageSize={this.state.itemsPerPages}
              total={this.state.numberPages * this.state.itemsPerPages}
              onChange={(onPage) => this.handleChangePage(onPage)}
            // this.setState({ currentPage: onPage})
            />
          </Divider>
        </div>
      </div>
    );
  }
}

export default orderTankTruck_list;
