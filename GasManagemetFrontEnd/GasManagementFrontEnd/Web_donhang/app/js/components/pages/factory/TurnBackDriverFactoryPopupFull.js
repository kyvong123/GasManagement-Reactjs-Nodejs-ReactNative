import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
//import Select from 'react-validation/build/select';
import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";

import createHistoryAPI from "createHistoryAPI";
import { NAMEDRIVE, GETWAREHOUSE } from "./../../../config/config";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "./../../../helpers/getUserCookies";
import createHistoryReturn from "../../../../api/createHistoryReturn";
import { Select } from "antd";
import ReactCustomLoading from "ReactCustomLoading";
import turnbackCylinderDuplicate from "../../../../api/turnbackCylinderDuplicate";
const Option = Select.Option;
function getList() {
  return new Promise(function(resolve) {
    setTimeout(() => resolve([1, 2, 3]), 3000);
  });
}
class TurnBackDriverFactoryPopupFull extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      typeImport: "",
      nameDriver: "",
      idDriver: "",
      idKhoXe: "",
      license_plate: "",
      listTenKhoXe: [],
      listDriver: [],
      isLoading: false,
      show: false,
      list: [],
      loading: false,
      listDuplicate: [],
    };
  }
  onSubmit = (event) => {
    this.setState({ isLoading: true, loading: true });
    getList().then((list) => {
      this.setState({
        isLoading: false,
        loading: false,
        list,
        show: false,
      });
    });
  };
  handleChangeDriver = (value) => {
    this.setState({
      idDriver: value,
    });
  };

  async addHistory(actionType, driver, idDriver, license_plate, cylinder) {
    // Call api
    this.setState({ isLoading: true });

    if (this.props.listIdSuccess.length !== 0) {
      const result = await createHistoryReturn(
        actionType,
        driver,
        idDriver,
        license_plate,
        cylinder
      );
      await this.setState({ loading: false });
      this.setState({ isLoading: false });
      console.log("result", result);
      if (result) {
        if (
          result.status === Constant.HTTP_SUCCESS_CREATED ||
          (result.status === Constant.HTTP_SUCCESS_BODY &&
            !result.data.hasOwnProperty("err_msg"))
        ) {
          showToast("Nhập hàng thành công!", 3000);
          const modal = $("#turn-back-driver-full");
          modal.modal("hide");
          setTimeout(function() {
            window.location.reload();
          }, 2000);
          return true;
        } else {
          showToast(
            result.data.message ? result.data.message : result.data.err_msg,
            2000
          );
          const modal = $("#turn-back-driver-full");
          modal.modal("hide");
          setTimeout(function() {
            window.location.reload();
          }, 2000);
          return false;
        }
      } else {
        showToast("Xảy ra lỗi trong quá trình tạo bình ");
        return false;
      }
    }
    this.setState({ registerSuccessful: false });
  }

  async componentDidMount() {
    let user_cookie = await getUserCookies();
    let token = "Bearer " + user_cookie.token;
    let params = {
      id: user_cookie.user.id,
    };
    let params_khoxe = {
      id: "all",
    };
    let result = await callApi("POST", GETWAREHOUSE, params_khoxe, token);
    if (result)
      this.setState({
        listTenKhoXe: result.data.data.map((item) => {
          return { value: item.id, label: item.name };
        }),
      });
    await callApi("POST", NAMEDRIVE, params, token).then((res) => {
      if (res.data.data <= 0) {
        this.setState({
          listDriver: [
            {
              name: "Bạn chưa có tài xế",
              id: "null",
            },
          ],
        });
      } else {
        //console.log(user_cookie.user.id+""+res.data.data);
        this.setState(
          {
            listDriver: res.data.data,
          },
          () => console.log(this.state.listDriver)
        );
      }
    });
  }
  /*handleObjectDataChild = async (childValue) => {
        handleObjectDataChildCTC
    };*/

  submit = async (event) => {
    // this.setState({ loading: true })
    //console.log("data nhan lai", this.props.product_parse[0].histories[0].from.id);

    event.preventDefault();

    // var products=await this.getAllCylenders();
    let { listDriver } = this.state;
    let index = listDriver.findIndex((l) => l.id === this.state.idDriver);
    let nameDriver = listDriver[index].name;
    var cylinders = [];
    let cylinderImex = [];

    if (this.props.product_parse.length !== 0) {
      for (let i = 0; i < this.props.product_parse.length; i++) {
        cylinders.push(this.props.product_parse[i].id);
        cylinderImex.push({
          id: this.props.product_parse[i].id,
          status: "EMPTY",
          condition: "NEW",
        });
      }
    } else {
      if (this.props.listCylinderDuplicate) {
        for (let i = 0; i < this.props.listCylinderDuplicate.length; i++) {
          cylinderImex.push({
            id: this.props.listCylinderDuplicate[i],
            status: "EMPTY",
            condition: "NEW",
          });
        }
      }
      if (this.props.listIdSuccess) {
        for (let i = 0; i < this.props.listIdSuccess.length; i++) {
          cylinderImex.push({
            id: this.props.listIdSuccess[i],
            status: "EMPTY",
            condition: "NEW",
          });
        }
      }
    }

    let data = this.form.getValues();
    data.idDriver = listDriver[index].id;
    await this.addHistory(
      Constant.RETURN,
      nameDriver,
      data.idDriver,
      data.license_plate,
      this.props.listIdSuccess
    );
    return;
  };

  render() {
    console.log(this.props);
    return (
      <div className="modal fade" id="turn-back-driver-full" tabIndex="-1">
        <ReactCustomLoading isLoading={this.state.loading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Nhập Hồi Lưu - Bước 2 - Thông Tin Tài Xế
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên tài xế</label>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
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
                              <Option key={index} value={l.id}>
                                {l.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Biển số xe </label>
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="Biển số xe"
                          optionFilterProp="children"
                          onChange={(value) => {
                            this.setState({
                              license_plate: value,
                            });
                            this.setState({ idKhoXe: value });
                          }}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {this.state.listTenKhoXe &&
                            this.state.listTenKhoXe.map((l, index) => {
                              return (
                                <Option key={index} value={l.value}>
                                  {l.label}
                                </Option>
                              );
                            })}
                        </Select>
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Số Lượng</label>
                                                <Input className="form-control" type="text" name="number_cylinder"
                                                    id="number_cylinder" />
                                            </div>
                                        </div> */}
                    {/* <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Lý do</label>
                                                <Textarea className="form-control" type="text" name="reason" id="reason" />
                                            </div>
                                        </div> */}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button
                    className="btn btn-primary"
                    type="submit"
                    onClick={this.onSubmit}
                    disabled={this.state.isLoading}
                  >
                    {this.state.isLoading ? "Loading..." : "Lưu"}
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

export default TurnBackDriverFactoryPopupFull;
