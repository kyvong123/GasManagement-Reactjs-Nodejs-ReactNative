import React from "react";
import showToast from "showToast";
import getInformationFromCylinders from "getInformationFromCylinders";
import getCylinderDuplicate from "../../../../api/getCylinderDuplicate";
import getUserCookies from "getUserCookies";
import { Select, Tabs, Progress, Button, Icon } from "antd";
import { useState } from "react";

import * as FaIcon from "react-icons/fa";
import { SHELLCYLINDER } from "../../../config/config";
import callApi from "../../../util/apiCaller";
import { GETLISTMANUFACTURE } from "../../../config/config";
import getAllTypeGas from "getAllTypeGas";
import axios from 'axios';



class ShellCylinder extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      error: "",
      inputKey: Date.now(),
      file: null,
      loading: false,
      listDuplicate: [],
      listCylinder: [],
      disableTab1: false,
      disableTab2: false,
      disableTab3: true,
      listErr: [],
      listOk: [],
      errCyl: [],
      errCyl_notCreated: [],
      userType: "",
      userRole: "",
      listManufacturers: [],
      listTypeGas: [],
      open: false,
      click: false,
      sum: 0,
      newOrder: [
        {
          numberContract: "",
          // manufacture: "",
          // manufactureName: "",
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
        this.setState({
          listTypeGas: data.data.data,
        });
      }
    }
  }

  handleFileUpload(event, isCheck) {
    this.setState({
      loading: true,
      disableTab1: true,
      disableTab2: true,
      disableTab3: true,
    });

    let that = this;
    let file = null;
    event.preventDefault();
    if (isCheck) {
      this.fileInput.value = null;
      this.setState({
        file,
        error: "",
        listProducts: [],
        loading: false,
      });
    } else {
      file = event.target.files[0];
      fileReader = new FileReader();
      fileReader.onload = async function (event) {
        let result = event.target.result;
        let arraynew = result
          .trim()
          .split("\n")
          .map((item) => item.replace(/\r|\n/gi, ""))
          .filter((item) => item != "");
        let cylinders_list = [];
        //
        let couting = {};
        let ab = [];
        arraynew.forEach((str) => {
          couting[str] = (couting[str] || 0) + 1;
        });
        if (Object.keys(couting).length !== arraynew.length) {
          let str;
          for (str in couting) {
            if (couting.hasOwnProperty(str)) {
              if (couting[str] > 1) {
                let a = str + ' có ' + couting[str] + ' lần trùng';
                ab.push(a);
              }
            }
          }
        }
        //ham loc bình trùng
        const array_id = Object.keys(couting);
        //
        let onePerCern = Math.floor(array_id.length / 100);
        let resultSearch,
          errCyl = [],
          err_msg = "",
          success = false,
          success_cylinders = [],
          success_idCylinders = [],
          errCyl_notCreated = [],
          errCyl_notInSystem = [],
          tempStatus = 200;

        if (array_id.length < 100) {
          let temp = await getInformationFromCylinders(array_id, "EXPORT");
          // console.log("temp", temp)
          if (temp.status !== 200) {
            showToast("Xảy ra rỗi khi kết nối tới máy chủ");
          }
          if (temp.data.err_msg) {
            errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
            errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);

            errCyl = errCyl.concat(temp.data.errCyl);
            success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
            success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
            if (temp.data.success) {
              success = temp.data.success;
            }
          } else {
            let tempIf = temp.data.map((item) => item.serial);
            success_cylinders = success_cylinders.concat(tempIf);

            let tempIf2 = temp.data.map((item) => item.id);
            success_idCylinders = success_idCylinders.concat(tempIf2);
          }
          tempStatus = temp.status;
        } else {
          for (let i = 0; i < 100; i += 10) {
            let array;

            if (i === 90) {
              array = array_id.slice(i * onePerCern, array_id.length);
            } else {
              array = array_id.slice(i * onePerCern, (i + 10) * onePerCern);
            }

            that.setState({ percent: i + 10 });

            let temp = await getInformationFromCylinders(array, "EXPORT");
            // console.log(temp);
            if (temp.status !== 200) {
              tempStatus = temp.status;
            }
            if (temp.data.err_msg) {
              errCyl_notCreated = errCyl_notCreated.concat(temp.data.errCyl_notCreated);
              errCyl_notInSystem = errCyl_notInSystem.concat(temp.data.errCyl_notInSystem);
              errCyl = errCyl.concat(temp.data.errCyl);
              success_cylinders = success_cylinders.concat(temp.data.success_cylinders);
              success_idCylinders = success_idCylinders.concat(temp.data.success_idCylinders);
              if (temp.data.success) {
                success = temp.data.success;
              }
            } else {
              let tempIf = temp.data.map((item) => item.serial);
              success_cylinders = success_cylinders.concat(tempIf);
              let tempIf2 = temp.data.map((item) => item.id);
              success_idCylinders = success_idCylinders.concat(tempIf2);
            }
          }
          that.setState({ percent: 0 });
        }

        resultSearch = {
          data: {
            errCyl: errCyl,
            err_msg: err_msg,
            success: success,
            success_cylinders: success_cylinders,
            success_idCylinders: success_idCylinders,
            errCyl_notCreated: errCyl_notCreated,
            errCyl_notInSystem: errCyl_notInSystem,
          },
          status: tempStatus,
        };

        if (resultSearch.status === 200) {
          that.props.getListProducts([]);

          that.setState({
            loading: false,
            listProducts: [],
          });

          if (errCyl.length || errCyl_notCreated.length || errCyl_notInSystem.length || ab.length) {
            let err1 = "",
              err2 = "",
              err3 = '',
              errorShow = "";
            const regex = /#/gi;

            if (errCyl.length) {
              err1 = `Có ${errCyl.length} mã đã bán hoặc đang không ở doanh nghiệp sở tại nên không thể xuất.#`;
            }
            if (errCyl_notCreated.length) {
              err2 = `Có ${errCyl_notCreated.length + errCyl_notInSystem.length} mã chưa khai báo.#`;
            }
            if (ab.length) {
              err3 = ab.toString();
            }
            errorShow = (err1 + err2 + err3).replace(regex, "\n").trim();
            that.setState({
              error: errorShow,
              listErr: errCyl.concat(errCyl_notCreated).concat(errCyl_notInSystem),
              disableTab2: false,
              errCyl: errCyl,
              errCyl_notCreated: errCyl_notCreated.concat(errCyl_notInSystem),
            });
          }

          //Kiểm tra và lấy mã bình không đạt
          if (resultSearch.data.success === false) {
            that.setState({
              listErr: resultSearch.data.errCyl,
              disableTab2: false,
            });
          }
          //Kiểm tra và lấy mã bình đạt
          if (resultSearch.data.success_cylinders.length !== 0) {
            that.setState({
              listOk: resultSearch.data.success_cylinders,
              disableTab1: false,
            });
            //lấy id bình đạt
            that.props.getSuccessIdCylinders(resultSearch.data.success_idCylinders);
          }
          //Gọi API lấy danh sách bình trùng

          let result = await getCylinderDuplicate(errCyl);
          let arr = [];
          result.data.listDuplicate.map((value) => {
            arr.push(value.id);
          });
          that.props.getListCylinderDuplicate(arr);
          if (result.data.listDuplicate.length !== 0) {
            that.setState({
              listDuplicate: result.data.listDuplicate,
              disableTab3: false,
            });
          }
          //showToast(resultSearch.data.err_msg)
        } else {
          that.setState({ loading: false });
          showToast("Lỗi đường truyền, vui lòng thử lại");
        }
      };
      fileReader.readAsText(file);
    }
  }


  //add data
  handleAddOrder = () => {
    let cloneArr = this.state.newOrder;
    let item = { numberContract: "", cylinderType: "", cylinderTypeName: "", quantity: 0 }
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
    // console.log(this.state.newOrder);

  }
  handleCloseModal = async () => {
    let check = true;
    for (let i = 0; i < this.state.newOrder.length; i++) {
      if (this.state.newOrder[i].numberContract == "" || this.state.newOrder[i].cylinderType == "" || this.state.newOrder[i].quantity == 0) {
        check = false;
        break
      }
    }
    if (check) {

      let sum = 0;
      for (let i = 0; i < this.state.newOrder.length; i++) {
        if (this.state.newOrder[i])
          sum = sum + parseInt(this.state.newOrder[i].quantity)
      }
      this.setState({ sum: sum })

      let user_cookies = await getUserCookies();
      let params = {
        objectId: user_cookies.user.id,
        quantity: this.state.sum,
        details: this.state.newOrder
      }
      // console.log('params', params)
      // return
      try {
        let res = await axios.post(SHELLCYLINDER, params,
          {
            headers: {
              "Authorization": "Bearer " + user_cookies.token
            }
          })
        // console.log(res.status, res.data.success)
        if ((res.status == 200 || res.status == 201) && res.data.success) {
          this.setState({
            newOrder: [
              {
                numberContract: "",
                cylinderType: "",
                cylinderTypeName: "",
                quantity: 0
              }
            ]
          })
          $("#shell-modalpopup2").modal("hide");
          alert("Thanh lý thành công")
          return
        }
        alert("Thanh lý thất bại")
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({ click: true })
    }

  }
  handleOnchangInput = (e, i) => {
    let newArr = this.state.newOrder;
    newArr[i].quantity = e.target.value;
    this.setState({ newOrder: newArr })
  }
  handleChangeContract = (e, i) => {
    let newArr = this.state.newOrder;
    newArr[i].numberContract = e.target.value;
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
    // let newArr = this.state.newOrder;
    // var index = e.nativeEvent.target.selectedIndex;
    // newArr[i].manufacture = e.target.value;
    // newArr[i].manufactureName = e.nativeEvent.target[index].text;
    // this.setState({ newOrder: newArr })
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
          // if (i !== j && this.state.newOrder[i].manufacture &&
          //   e.target.value == this.state.newOrder[j].cylinderType &&
          //   this.state.newOrder[i].manufacture == this.state.newOrder[j].manufacture) {
          //   return false
          // }
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
      // console.log(e.target.value);
    }
  }
  handleDong = () => {
    this.setState({
      newOrder: [
        {
          // manufacture: "",
          // manufactureName: "",
          numberContract: "",
          cylinderType: "",
          cylinderTypeName: "",
          quantity: 0
        }
      ]
    })
  }
  render() {
    return (

      <div className="modal fade" id="shell-modalpopup2" tabIndex="-1">

        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo thanh lý vỏ </h5>
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
                  <h5 className="heading1">Số văn bản chấp thuận thanh lý</h5>
                  <h5 className="heading1">Loại bình</h5>
                  <h5>Số lượng</h5>
                </div>
                {this.state.newOrder.map((items, idx) => (
                  <div key={idx} className="content-body">

                    <div className="wrapper-numberContract">
                      <input className={items.numberContract == 0 && this.state.click == true ? "input-form err" : "input-form"} value={items.numberContract} onChange={(e) => this.handleChangeContract(e, idx)} />
                      <p className={items.numberContract == "" && this.state.click == true ? "mess error" : "mess"}>Vui lòng điền số văn bản thanh lý</p>
                    </div>
                    <div className="wrapper-cylinder">
                      <select
                        onChange={(e) => this.handleSelectChangeManufacture(e, idx, "cylindertype")}
                        className={items.cylinderType == "" && this.state.click == true ? "input-form err" : "input-form"} value={items.cylinderType}>
                        <option value="" >chọn....</option>
                        {this.state.listTypeGas && this.state.listTypeGas.map((item, idx) =>
                          <option key={idx} value={item.id}>{item.name}</option>)}
                      </select>
                      <p className={items.cylinderType == "" && this.state.click == true ? "mess error" : "mess"}>Vui lòng chọn loại bình</p>
                    </div>
                    <div className="wrapper-quantity">
                      <input className={items.quantity == 0 && this.state.click == true ? "input-form err" : "input-form"} value={items.quantity} onChange={(e) => this.handleOnchangInput(e, idx)} />
                      <p className={items.quantity == 0 && this.state.click == true ? "mess error" : "mess"}>Vui lòng thêm số lượng</p>
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
                  // data-toggle="modal"
                  // data-target="#export-modal2a"
                  onClick={() => this.handleCloseModal()}
                >
                  Thanh lý
                </Button>
                <Button className="btn-dong btn-action" data-dismiss="modal" onClick={() => this.handleDong()} >Đóng</Button>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default ShellCylinder;
