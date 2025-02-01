import React from "react";
import PropType from "prop-types";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import Button from "react-validation/build/button";
import required from "required";
import Constant from "Constants";
import showToast from "showToast";
import { Radio } from "antd";
import getAllTypeGas from "getAllTypeGas";

var fileReader;
const options = [
  { label: "Bình sản xuất mới", value: "New" },
  { label: "Bình sửa chữa", value: "Old" },
];

class ViewProductPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    let a = {}
    a = this.props.product.category
    this.state = {
      color: "",
      weight: "",
      checkedDate: "",
      status: "",
      //emptyOrFull: "",
      valve: "",
      currentImportPrice: 0,
      product: "",
      image: "",
      usingType: this.props.product.classification,
      manufacture: [],
      listTypeGas: [],
      category: this.props.product.category,
      selected: "",
      // productId:this.props.product_id,
    };
  }

  fileChangedHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  onChangeType = (e) => {
    this.setState({
      usingType: e.target.value,
    });
  };

  async getAllTypeGas() {
    const dataUsers = await getAllTypeGas(Constant.GENERAL);
    // console.log("daaaaaaaaaaaa",dataUsers)
    if (dataUsers) {
      if (dataUsers.status === Constant.HTTP_SUCCESS_BODY) {
        let listArrTypeGas = [];
        for (let i = 0; i < dataUsers.data.data.length; i++) {
          listArrTypeGas.push({
            value: dataUsers.data.data[i].id,
            label: dataUsers.data.data[i].name,
            ...dataUsers.data.data[i],
          });
        }

        this.setState({
          listTypeGas: listArrTypeGas,
        });
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


  async submit(event) {
    event.preventDefault();
    // if (this.state.position.length === 0) {
    //     showToast('Chưa chọn vị trí!', 3000);
    //     return;
    // }
    let data = this.form.getValues();
    // let updateGeneral=null,updateAgency=null;
    // if(data.general===null||data.general==="")
    // {
    //     updateGeneral=null;
    // }
    // else
    // {
    //     updateGeneral=this.props.listGeneralUser[parseInt(data.general)].id;
    // }
    // if(data.agency===null||data.agency==="")
    // {
    //     updateAgency=null;
    // }
    // else
    // {
    //     updateAgency=this.props.listAgencyUser[parseInt(data.agency)].id;
    // }
    console.log("state.product", this.state.product);
    console.clear();
    console.log(data);
    if (data.classification === "") {
      showToast("Vui lòng nhập input phân loại");
    } else if (
      data.color === "" ||
      data.color.length > 20 ||
      data.color.length < 3
    ) {
      showToast("Vui lòng nhập input màu sắc từ 3 tới 20 ký tự");
    } else if (
      data.weight === "" ||
      data.weight.length > 10 ||
      data.weight.length < 1
    ) {
      showToast("Vui lòng nhập input trọng lượng từ 1 tới 10 ký tự");
    } else if (
      data.valve === "" ||
      data.valve.length > 20 ||
      data.valve.length < 3
    ) {
      showToast("Vui lòng nhập input loại van từ 3 tới 20 ký tự");
    } else {
      let weight = parseFloat(data.weight);
      await this.props.editProduct(
        data.serial,
        data.color,
        this.state.image,
        data.checkedDate,
        weight,
        Constant.PLACESTATUS_ENUM[parseInt(data.status)].key,
        //Constant.STATUS_ENUM[parseInt(data.emptyOrFull)].key,
        // this.state.product.manufacture.id,
        this.state.listTypeGas[parseInt(data.category)] ? this.state.listTypeGas[parseInt(data.category)].id : "",
        this.props.listManufacturers[parseInt(data.manufacture)] ? this.props.listManufacturers[parseInt(data.manufacture)].id : "",
        data.valve,
        this.state.usingType,
      );
      const modal =
        $("#view-product");
      modal.modal("hide");
      return;
    }
  }

  async componentDidMount() {
    await this.getAllTypeGas();
  }


  componentWillReceiveProps(nextprops) {
    if (nextprops.product !== this.props.product && nextprops.product !== "") {
      this.setState({
        product: nextprops.product,
        usingType: nextprops.product.classification,
      });
    }
  }

  componentWillMount() {
    this.props.product;
  }
  reset = () => {
    this.setState({
      selected: "",
    })
  }
  onChange = (e) => {
    this.setState({
      [selected]: e.target.value
    })
  }
  render() {
    console.log("status", Constant.PLACESTATUS_ENUM);
    return (
      <div className="modal fade" id="view-product" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thông tin sản phẩm</h5>
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
                        <label>Mã</label>
                        <Input
                          disabled={true}
                          className="form-control"
                          value={this.props.productDetail.serial}
                          type="text"
                          name="serial"
                          validations={
                            this.state.product.factory !== this.props.parentRoot
                              ? ""
                              : [required]
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Phân loại</label>
                        <div className="form-group">
                          <Radio.Group
                            options={options}
                            onChange={this.onChangeType}
                            value={this.state.usingType}
                          />

                        </div>
                      </div>

                      <div className="form-group">
                        <label>Trọng lượng</label>
                        <Input
                          className="form-control"
                          type="number"
                          name="weight"
                          id="weight"
                          value={this.props.productDetail.weight}
                          disabled={
                            this.state.product.factory !== this.props.parentRoot
                          }
                          onKeyDown={(e) =>
                            (e.keyCode === 69 ||
                              e.keyCode === 107 ||
                              e.keyCode === 109 ||
                              e.keyCode === 190) &&
                            e.preventDefault()
                          }
                          validations={
                            this.state.product.factory !== this.props.parentRoot
                              ? ""
                              : [required]
                          }
                        />
                      </div>
                      {/*<div className="form-group">
                                                <label>Giá bán</label>
                                                <Input className="form-control" type="number" name="currentImportPrice"
                                                       id="currentImportPrice"
                                                       disabled={this.state.product.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.currentSalePrice}
                                                       validations={this.state.product.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>*/}
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Màu sắc</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="color"
                          id="color"
                          disabled={
                            this.state.product.factory !== this.props.parentRoot
                          }
                          value={this.props.productDetail.color}
                          validations={
                            this.state.product.factory !== this.props.parentRoot
                              ? ""
                              : [required]
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Loại van</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="valve"
                          id="valve"
                          disabled={
                            this.state.product.factory !== this.props.parentRoot
                          }
                          value={this.props.productDetail.valve}
                          validations={
                            this.state.product.factory !== this.props.parentRoot
                              ? ""
                              : [required]
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6"></div>
                    {/*<div className="col-md-6">
                                            <div>Hình ảnh</div>
                                            <input type="file" name="logo" data-provide="dropify"
                                                   disabled={this.state.product.factory !== this.props.parentRoot}
                                                   onChange={(event) => this.fileChangedHandler(event)}
                                                   validations={this.state.product.factory !== this.props.parentRoot ? "" : [required]}/>
                                        </div>*/}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Ngày kiểm định</label>
                        <div
                          className="input-group"
                          style={{ display: "flex", flexWrap: "nowrap" }}
                        >
                          <Input
                            ref={this.expiration_dateRef}
                            type="text"
                            className="form-control"
                            value={this.props.productDetail.checkedDate}
                            name="checkedDate"
                            id="checkedDate"
                            data-date-format="dd/mm/yyyy"
                            disabled={
                              this.state.product.factory !== this.props.parentRoot
                            }
                            data-provide="datepicker"
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="fa fa-calendar"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Thương Hiệu </label>
                        <Select
                          className="form-control"
                          name="manufacture"
                          value={this.state.selected}
                          onChange={this.onChange}
                        >
                          <option value="" disabled="disabled" hidden={true}>
                            {typeof this.state.product.manufacture !== "undefined"
                              && this.state.product.manufacture !== null
                              ? this.state.product.manufacture.name
                              : ""}
                          </option>
                          {this.props.listManufacturers.map((item, index) => (
                            <option
                              // key={index}
                              value={index}
                            >{item.name}</option>
                          ))}
                        </Select>
                      </div>
                      {/* <div className="form-group">
                                                <label>Thương Hiệu </label>
                                                <Input className="form-control" 
                                                        type="text" 
                                                        name="category"
                                                        disabled={true} 
                                                        id="category"
                                                        value={this.state.product.hasOwnProperty("category") 
                                                        ? this.state.product.category.name : ""}/>
                                            </div> */}
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Vị trí hiện tại</label>
                        <Select
                          className="form-control"
                          name="status"
                          value={
                            Constant.PLACESTATUS_ENUM.find(
                              (o) =>
                                o.key === this.props.productDetail.placeStatus
                            ) !== undefined
                              ? Constant.PLACESTATUS_ENUM.findIndex(
                                (o) =>
                                  o.key ===
                                  this.props.productDetail.placeStatus
                              )
                              : ""
                          }
                          disabled={true}
                        >
                          <option value="">-- Chọn --</option>
                          {Constant.PLACESTATUS_ENUM.map((item, index) => (
                            <option value={index} key={index}>
                              {item.value}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="form-group">
                        <label>Loại bình</label>
                        <Select
                          className="form-control"
                          name="category"
                          value={this.state.selected}
                          onChange={this.onChange}
                        >
                          <option value="" disabled="disabled" hidden={true}>
                            {typeof this.props.product.category !== "undefined"
                              && this.props.product.category !== null ? this.props.product.category.name : ""}
                          </option>
                          {this.state.listTypeGas.map((item, index) => (
                            <option value={index}>{item.name}</option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    {/*<div className="col-md-6">*/}
                    {/*</div>*/}
                  </div>
                </div>

                <footer className="card-footer text-center">
                  <Button type="submit" className="btn btn-primary">
                    Lưu
                  </Button>
                  <button
                    className="btn btn-secondary"
                    type="reset"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={this.reset}
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

ViewProductPopup.propType = {
  addStore: PropType.func.isRequired,
  jobMetaData: PropType.object.isRequired,
  updateStoreImage: PropType.func.isRequired,
};

export default ViewProductPopup;
