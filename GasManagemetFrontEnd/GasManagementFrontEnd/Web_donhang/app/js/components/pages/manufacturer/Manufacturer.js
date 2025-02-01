// Hien thi table thuong hieu
import React from "react";
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllManufacturer from "getAllManufacturer";
import deleteManufacturer from "deleteManufacturer";
import AddManufacturerPopup from "./AddManufacturerPopup";
import addManufacturer from "addManufacturer";
import { Icon } from 'antd';
import SeeInforItem from './../../seeInforItem/index';
class Manufacturer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listManufacturers: [],
      itemGas: {}
    };
  }
  refresh() {
    this.forceUpdate(async () => {
      await this.getAllManufacturer();
    });
  }
  async deleteManufacturer(id) {
    var answer = window.confirm("Bạn có chắc chắn muốn xóa");
    let user;
    if (answer) {
      user = await deleteManufacturer(id);
      if (user) {
        if (user.status === Constants.HTTP_SUCCESS_BODY) {
          showToast("Xóa Thành Công!", 3000);
          this.refresh();
          return true;
        } else {
          showToast(
            user.data.message ? user.data.message : user.data.err_msg,
            2000
          );
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
        return false;
      }
    }
    //console.log('register',user);
  }

  async addManufacturer(
    name,
    phone,
    address,
    logo,
    origin,
    mass,
    ingredient,
    preservation,
    appliedStandard,
    optionSafetyInstructions,
    safetyInstructions
  ) {
    const user = await addManufacturer(
      name,
      phone,
      address,
      logo,
      origin,
      mass,
      ingredient,
      preservation,
      appliedStandard,
      optionSafetyInstructions,
      safetyInstructions
    );

    //console.log('register',user);
    if (user) {
      if (user.status === Constants.HTTP_SUCCESS_CREATED) {
        showToast("Tạo Thành Công!", 3000);
        this.refresh();
        return true;
      } else {
        showToast(
          user.data.message ? user.data.message : user.data.err_msg,
          2000
        );
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
      return false;
    }
  }
  seeInformationGas = (store) => {
    this.setState({
      itemGas: store
    })

  }
  componentDidMount() {
    this.getAllManufacturer();

  }
  async getAllManufacturer() {
    //const jobMetaData = await this.getJobMetaData();

    const dataUsers = await getAllManufacturer(Constants.GENERAL);
    if (dataUsers) {
      if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ listManufacturers: dataUsers.data });
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
  render() {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title" >
            <div className="flexbox">
              <h4>Thương Hiệu</h4>
              <div className="row">
                <button
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-manufacturer"
                >
                  Tạo Thương Hiệu - Nhãn Hàng
                </button>
                {/*   <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#create-location-store">Tạo mới
                                </button>*/}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12" 
                  // style={{paddingLeft:'45px', paddingRight:'45px'}}
                  >
                    <table
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-70px align-middle">#STT</th>
                          <th className="text-center w-70px align-middle">Mã Id Để Nhập Excel</th>
                          {/*<th className="w-120px text-center">Mã </th>*/}
                          <th className="w-120px text-center align-middle">Tên </th>
                          <th className="w-120px text-center align-middle">Điện Thoại </th>
                          <th className="w-120px text-center align-middle">Khu vực </th>
                          <th className="w-120px text-center align-middle">Hình Ảnh</th>
                          <th className="w-100px text-center align-middle">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listManufacturers.map((store, index) => {
                          return (
                            <tr key={index}>
                              <td scope="row" className="text-center">
                                {index + 1}
                              </td>
                              <td scope="row" className="text-center">
                                {store.id}
                              </td>
                              {/*<td scope="row" className="text-center">{store.id}</td>*/}
                              <td scope="row" className="text-center">
                                {store.name}
                              </td>
                              <td scope="row" className="text-center">
                                {store.phone}
                              </td>
                              <td scope="row" className="text-center">
                                {store.address}
                              </td>
                              <td scope="row" className="text-center">
                                <img
                                  className="logo-manufacturer"
                                  src={store.logo}
                                />
                              </td>
                              <td className="text-center table-actions">
                                {/*<a
                                  className="table-action hover-primary"
                                  data-toggle="modal"
                                  data-target="#view-report"
                                  onClick={() => {
                                    this.deleteManufacturer(store.id);
                                  }}
                                >
                                  <i className="ti-trash"></i>
                                </a>*/}
                                <a className="table-action hover-primary" data-toggle="modal" data-target="#see-information"
                                  onClick={() => { this.seeInformationGas(store) }}
                                >
                                  <Icon type="info-circle" /></a>
                              </td>
                              {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                              {/*     <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.setState({content:store.description,user:store.user?store.user.name:'',cylinder:store.cylinder?store.cylinder.serial:''})}}>
                                                            <i className="ti-eye"></i></a>

                                                    </td>*/}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddManufacturerPopup
          addManufacturer={this.addManufacturer.bind(this)}
        />
        <SeeInforItem itemGas={this.state.itemGas} />
      </div>
    );
  }
}

export default Manufacturer;
