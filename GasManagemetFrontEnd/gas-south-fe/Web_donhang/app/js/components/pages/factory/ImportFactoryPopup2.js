import React from "react";
import showToast from "showToast";
import getInformationFromCylinders from "getInformationFromCylinders";
import Constant from "Constants";
import ReactCustomLoading from "ReactCustomLoading";
import getCylinderDuplicate from "../../../../api/getCylinderDuplicate";
import autoCreateCylinder from "../../../../api/autoCreateCylinder"
import getUserCookies from "getUserCookies";
import { Select, Tabs, Progress, Button, Icon } from "antd";
import { useState } from "react";

import * as FaIcon from "react-icons/fa";
import styles from './ExportFactoryPopup2.module.scss';
import classNames from "classnames/bind";
import { GETLISTMANUFACTURE } from "../../../config/config";
import callApi from "../../../util/apiCaller";
import getAllTypeGas from "getAllTypeGas";
import ImportFactoryPopup2a from "./ImportFactoryPopup2a";
import "./ImportFactoryPopup2.scss"

class ImportFactoryPopup2 extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      userType: "",
      userRole: "",
      listManufacturers: [],
      listTypeGas: [],
      open: false,
      sum: 0,
      isClick: false,
      ischeck: false,
      newOrder: [
        {
          manufacture: "",
          manufactureName: "",
          cylinderType: "",
          cylinderTypeName: "",
          quantity: 0
        }
      ],
      newMesseage: 'message',

    };
  }
  handleClose = () => this.setState({ open: false })

  async componentDidMount() {
    let user_cookie = await getUserCookies()
    this.setState({
      userType: user_cookie.user.userType,
      userRole: user_cookie.user.userRole
    })
    let token = "Bearer " + user_cookie.token;
    let param = {
      isChildOf: user_cookie.user.isChildOf
    }

    await callApi("POST", GETLISTMANUFACTURE, param, token).then((res) => {
      if (res.data) {
        if (res.data.status === true) {
          // console.log("dang test: ", res.data.data)
          this.setState({
            listManufacturers: res.data.data,
          });
        } else {
          showToast(
            res.data.data.message
              ? res.data.data.message
              : res.data.data.err_msg,
            2000
          );
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
      }

    });

    const data = await getAllTypeGas();

    if (data.data) {
      if (data.data.status === true) {
        console.log('lay loai thanh cong: ', data.data.data);
        this.setState({
          listTypeGas: data.data.data,
        });
      }
    }
  }




  //add data
  handleAddOrder = () => {
    let cloneArr = this.state.newOrder;
    let item = { manufacture: "", manufactureName: "", cylinderType: "", cylinderTypeName: "", quantity: 0 }
    cloneArr.push(item)
    this.setState({
      newOrder: cloneArr
    })
  }
  handleOnClickXoa = (idx) => {
    let cloneArr = this.state.newOrder;
    cloneArr.splice(idx, 1);
    this.setState({
      newOrder: cloneArr
    })

  }
  handleCloseModal = () => {
    let check = true;
    for (let i = 0; i < this.state.newOrder.length; i++) {
      if (this.state.newOrder[i].manufacture == "" || this.state.newOrder[i].cylinderType == "" || this.state.newOrder[i].quantity == 0) {
        check = false;
        break;
      }
    }
    if (check) {
      $("#import-modalpopup2").modal("hide");
      let sum = 0;
      for (let i = 0; i < this.state.newOrder.length; i++) {
        if (this.state.newOrder[i])
          sum = sum + parseInt(this.state.newOrder[i].quantity)
      }
      this.setState({ sum: sum })
      this.setState({ open: true })
    } else {
      this.setState({
        isClick: true
      })
    }
  }

  handleOnchangInput = (e, i) => {
    let newArr = this.state.newOrder;
    newArr[i].quantity = e.target.value;
    this.setState({ newOrder: newArr })
  }

  handleSelectChangeManufacture = (e, i, type) => {
    if (this.validate(e, i, type) == false) {
      e.target.value = ''
      this.setState({
        newMesseage: 'message message-active'
      })
      setTimeout(() => {
        this.setState({
          newMesseage: 'message'
        })
      }, 3000);
    }
    if (type == "cylindertype") {
      let newArr = this.state.newOrder;
      var index = e.nativeEvent.target.selectedIndex;
      newArr[i].cylinderType = e.target.value;
      newArr[i].cylinderTypeName = e.nativeEvent.target[index].text;
      this.setState({ newOrder: newArr })
    }
    let newArr = this.state.newOrder;
    // var index = e.nativeEvent.target.selectedIndex;
    newArr[i].manufacture = this.props.typeImportCylinder;
    newArr[i].manufactureName = this.props.typeImportCylinder == 'Other' ? 'Vỏ khác' : 'Vỏ GasSouth';;
    this.setState({ newOrder: newArr })

  };

  validate = (e, i, type) => {
    if (this.state.newOrder.length >= 1) {
      for (var j = 0; j < this.state.newOrder.length; j++) {
        if (type == "manufacture") {
          if (i !== j && this.state.newOrder[i].cylinderType &&
            e.target.value == this.state.newOrder[j].manufacture &&
            this.state.newOrder[i].cylinderType == this.state.newOrder[j].cylinderType) {
            return false
          }
        }
        else {
          if (i !== j && this.state.newOrder[i].manufacture &&
            e.target.value == this.state.newOrder[j].cylinderType &&
            this.state.newOrder[i].manufacture == this.state.newOrder[j].manufacture) {
            return false
          }
        }

      }
    }
    return true
  }
  handleSelectChangeCylinderType = (e, i) => {
    if (this.validate(e, i) == true) {
      let newArr = this.state.newOrder;
      newArr[i].cylinderType = e.target.value;
      this.setState({ newOrder: newArr })
      console.log(e.target.value);
    }
  }
  handleDong = () => {
    this.setState({
      newOrder: [
        {
          manufacture: "",
          manufactureName: "",
          cylinderType: "",
          cylinderTypeName: "",
          quantity: 0
        }
      ],
    })
  }
  render() {
    return (

      <div className="modal fade" id="import-modalpopup2" tabIndex="-1">

        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{`Bước 1 - ${this.props.typeImportCylinder == 'Other' ? 'Nhập vỏ khác 1' : 'Nhập vỏ GasSouth'}`}</h5>
              <div className={this.state.newMesseage}>
                <h3>Vui lòng không chọn trùng loại sản phẩm</h3>
              </div>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="content-popup2">
                <div className="content-heading">
                  {/* <h5 className="heading1">Thương hiệu</h5> */}
                  <h5 className="heading1">Loại bình</h5>
                  <h5>Số lượng</h5>
                </div>
                {this.state.newOrder.map((items, idx) => (
                  <div key={idx} className="content-body">

                    {/* <div className="wrapper-manufacture">
                      <select
                        onChange={(e) => this.handleSelectChangeManufacture(e, idx, "manufacture")}
                        className={items.manufacture == "" && this.state.isClick == true ? "input-form err" : "input-form"} value={items.manufacture} >
                        <option value="" >chọn....</option>
                        {this.state.listManufacturers && this.state.listManufacturers.map((item, idx) =>
                          <option key={idx} value={item.id}>{item.name}</option>
                        )}
                      </select>
                      <p className={items.manufacture == "" && this.state.isClick == true ? "mess error" : "mess"}>Vui lòng chọn thương hiệu</p>
                    </div> */}
                    <div className="wrapper-cylindeType">
                      <select
                        onChange={(e) => this.handleSelectChangeManufacture(e, idx, "cylindertype")}
                        className={items.cylinderType == "" && this.state.isClick == true ? "input-form err" : "input-form"} value={items.cylinderType}>
                        <option value="" >chọn....</option>
                        {this.state.listTypeGas && this.state.listTypeGas.map((item, idx) =>
                          <option key={idx} value={item.id}>{item.name}</option>)}
                      </select>
                      <p className={items.cylinderType == "" && this.state.isClick == true ? "mess error" : "mess"}>Vui lòng chọn loại bình</p>
                    </div>
                    <div className="wrapper-quantity">
                      <input className={items.quantity == "" && this.state.isClick == true ? "input-form err" : "input-form"} value={items.quantity} placeholder="Số lượng" onChange={(e) => this.handleOnchangInput(e, idx)} />
                      <p className={items.quantity == 0 && this.state.isClick == true ? "mess error" : "mess"}>Vui lòng thêm số lượng</p>
                    </div>
                    <div className="icon-action-popup2">
                      {idx === 0 ? <FaIcon.FaPlusCircle className="icon-action icon-them" onClick={() => this.handleAddOrder()} /> :
                        <FaIcon.FaMinusCircle key={idx} className="icon-action icon-xoa" onClick={() => this.handleOnClickXoa(idx)} />}

                    </div>
                  </div>
                ))}
              </div>
              <div className="action-popup2">
                <Button
                  className="btn-tieptuc btn-action"
                  data-toggle="modal"
                  data-target="#import-modal2a"
                  onClick={() => this.handleCloseModal()}
                >
                  Tiếp tục
                </Button>
                <Button className="btn-dong btn-action" data-dismiss="modal" onClick={() => this.handleDong()}>Đóng</Button>
              </div>

            </div>

          </div>
        </div>
        <ImportFactoryPopup2a
          typeImport={this.props.typeImport}
          typeImportCylinder={this.props.typeImportCylinder} visible={this.state.open} onCancel={this.handleClose} sum={this.state.sum} newOrder={this.state.newOrder} />
      </div>
    );
  }
}

export default ImportFactoryPopup2;
