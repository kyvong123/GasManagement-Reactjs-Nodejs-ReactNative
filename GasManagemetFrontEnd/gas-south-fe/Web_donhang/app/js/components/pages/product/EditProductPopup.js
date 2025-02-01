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
import { Fragment } from "react";
import moment from "moment";
import ReactCustomLoading from "ReactCustomLoading";
var fileReader;
const options = [
  { label: "Bình sản xuất mới", value: "New" },
  { label: "Bình sửa chữa", value: "Old" },
];

class EditProductPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    let a = {};
    a = this.props.product.category;
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
      usingType: "",
      manufacture: [],
      listTypeGas: [],
      category: this.props.product.category,
      selected: "",
      viewMode: false,
      isShowVongDoi: false,
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

  formatDate = (date) => {
    var datePart = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ].map(dateComponentPad);
    var timePart = [date.getHours(), date.getMinutes(), date.getSeconds()].map(
      dateComponentPad
    );

    return datePart.join("-") + " " + timePart.join(":");
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
    // console.log("props.product", this.props.product);
    console.clear();
    // console.log(data);
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
        // this.props.product.manufacture.id,
        this.state.listTypeGas[parseInt(data.category)]
          ? this.state.listTypeGas[parseInt(data.category)].id
          : "",
        this.props.listManufacturers[parseInt(data.manufacture)]
          ? this.props.listManufacturers[parseInt(data.manufacture)].id
          : "",
        data.valve,
        this.state.usingType
      );
      const modal = $("#edit-product");
      modal.modal("hide");
      return;
    }
  }

  async componentDidMount(preProps, preState) {
    await this.getAllTypeGas();
  }
  componentDidUpdate(preProps, preState) {
    if (preProps.isViewMode !== this.props.isViewMode) {
      this.setState({ viewMode: this.props.isViewMode });
    }
    if (preProps.product.classification !== this.props.product.classification) {
      this.setState({ usingType: this.props.product.classification });
    }
  }

  componentWillMount() {
    this.props.product;
  }
  reset = () => {
    this.setState({
      selected: "",
    });
  };
  onChange = (e) => {
    this.setState({
      [selected]: e.target.value,
    });
  };
  render() {
    let countREPAIRFixer = 0;
    let countREPAIRNotFixer = 0;
    let countEXPORT = 0;
    let countEXPORT_CELL = 0;
    let countTURN_BACK = 0;
    let countIMPORT = 0;
    let countIMPORT_CELL = 0;
    let countRETURN_FULLCYL = 0;
    let countSALE = 0;
    return (
      <div className="modal fade" id="edit-product" tabIndex="-1">
        <ReactCustomLoading isLoading={this.props.isLoading} />
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{`${
                this.props.isViewMode ? "Thông tin" : "Cập nhật"
              } sản phẩm`}</h5>
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
                    <label>Mã</label>
                    <div className="col-md-12">
                      <div className="form-group input-group mb-3">
                        <input
                          disabled={true}
                          className="form-control"
                          value={this.props.productDetail.serial}
                          type="text"
                          name="serial"
                          validations={
                            this.props.product.factory !== this.props.parentRoot
                              ? ""
                              : [required]
                          }
                        />
                        <div class="input-group-append">
                          <button
                            className="btn-md btn-outline-secondary"
                            type="button"
                            data-toggle="collapse"
                            data-target="#vong-doi"
                            onClick={() =>
                              this.setState({
                                isShowVongDoi: !this.state.isShowVongDoi,
                              })
                            }
                          >
                            <span>Vòng đời</span>
                            <i
                              class={
                                !this.state.isShowVongDoi
                                  ? "fa-solid fa-arrow-down"
                                  : "fa-solid fa-arrow-up"
                              }
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="form-group"></div>
                    </div> */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <div
                          className="border border-secondary p-3 collapse"
                          id="vong-doi"
                        >
                          <div className="mt-auto pl-3 d-block">
                            <ul
                              style={{
                                height: "300px",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* <li>
                                Ngày khởi tạo:{" "}
                                <span>
                                  {this.props.productDetail.createdAt
                                    ? moment(
                                        this.props.productDetail.createdAt
                                      ).format("DD/MM/YYYY")
                                    : ""}
                                </span>
                              </li> */}
                              {this.props.historyCylinderArr.map(
                                (data, index) => {
                                  if (
                                    data.type === "REPAIR" &&
                                    data.userType !== "Fixer"
                                  ) {
                                    countREPAIRNotFixer++;
                                  } else if (
                                    data.type === "REPAIR" &&
                                    data.userType === "Fixer"
                                  )
                                    countREPAIRFixer++;
                                  switch (data.type) {
                                    case "EXPORT":
                                      countEXPORT += 1;
                                      break;
                                    case "EXPORT_CELL":
                                      countEXPORT_CELL += 1;
                                      break;
                                    case "IMPORT":
                                      countIMPORT += 1;
                                      break;
                                    case "IMPORT_CELL":
                                      countIMPORT_CELL += 1;
                                      break;
                                    case "TURN_BACK":
                                      countTURN_BACK += 1;
                                      break;
                                    case "RETURN_FULLCYL":
                                      countRETURN_FULLCYL++;
                                      break;
                                    case "SALE":
                                      countSALE += 1;
                                  }
                                  return [
                                    "CREATE",
                                    "EXPORT",
                                    "EXPORT_CELL",
                                    "IMPORT",
                                    "IMPORT_CELL",
                                    "TURN_BACK",
                                    "RETURN_FULLCYL",
                                    "REPAIR",
                                  ].includes(data.type) ? (
                                    <li key={index}>
                                      {data.type === "CREATE"
                                        ? `Khai báo mới: `
                                        : data.type === "REPAIR" &&
                                          data.userType !== "Fixer"
                                        ? `In lại mã định danh lần ${countREPAIRNotFixer}: `
                                        : data.type === "REPAIR" &&
                                          data.userType === "Fixer"
                                        ? `Sơn sửa lần ${countREPAIRFixer}: `
                                        : data.type === "EXPORT"
                                        ? `Xuất bình lần ${countEXPORT}: `
                                        : data.type === "EXPORT_CELL"
                                        ? `Xuất vỏ lần ${countEXPORT_CELL}: `
                                        : data.type === "IMPORT"
                                        ? `Nhập bình lần ${countIMPORT}: `
                                        : data.type === "IMPORT_CELL"
                                        ? `Nhập vỏ lần ${countIMPORT_CELL}: `
                                        : data.type === "RETURN_FULLCYL"
                                        ? `Hồi lưu bình đầy lần ${countRETURN_FULLCYL}: `
                                        : data.type === "TURN_BACK"
                                        ? `Hồi lưu lần ${countTURN_BACK}: `
                                        : ""}
                                      {data.type !== "CREATE" &&
                                      data.type !== "REPAIR" &&
                                      data.type !== "SALE" ? (
                                        <b>
                                          {moment(data.createdAt).format(
                                            "DD/MM/YYYY HH:mm:ss"
                                          )}{" "}
                                          {(data.type === "EXPORT_CELL" ||
                                            data.type === "EXPORT" ||
                                            data.type === "IMPORT_CELL" ||
                                            data.type === "IMPORT" ||
                                            data.type === "RETURN_FULLCYL") &&
                                            `Từ ${data.from &&
                                              data.from.name} `}
                                          {data.type === "TURN_BACK" &&
                                            `về ${data.from &&
                                              data.from.name} `}
                                          {data.type !== "TURN_BACK" &&
                                            data.type !== "SALE" && (
                                              <i className="ti-arrow-right"></i>
                                            )}{" "}
                                        </b>
                                      ) : (
                                        data.type !== "SALE" &&
                                        `Ngày ${moment(data.createdAt).format(
                                          "DD/MM/YYYY HH:mm:ss"
                                        )}, Tại `
                                      )}
                                      <span>
                                        {data.type === "CREATE"
                                          ? data.from
                                            ? data.from.name
                                            : "Không xác định"
                                          : data.type === "EXPORT"
                                          ? data.to
                                            ? data.to.name + " "
                                            : "Không xác định"
                                          : data.type === "EXPORT_CELL"
                                          ? data.to
                                            ? data.to.name
                                            : "Không xác định"
                                          : data.type === "IMPORT"
                                          ? data.to
                                            ? data.to.name
                                            : "Không xác định"
                                          : data.type === "IMPORT_CELL"
                                          ? data.to
                                            ? data.to.name
                                            : "Không xác định"
                                          : data.type === "RETURN_FULLCYL"
                                          ? data.to && data.to.name
                                          : data.type === "REPAIR"
                                          ? data.from && data.from.name
                                          : data.type === "TURN_BACK"
                                          ? ""
                                          : "Không xác định"}
                                        {this.props.historyCylinderArr[
                                          index + 1
                                        ] &&
                                          this.props.historyCylinderArr[
                                            index + 1
                                          ].type === "SALE" && (
                                            <i className="ti-arrow-right"></i>
                                          )}
                                        {this.props.historyCylinderArr[
                                          index + 1
                                        ] &&
                                          this.props.historyCylinderArr[
                                            index + 1
                                          ].type === "SALE" &&
                                          " " +
                                            data.customerName +
                                            " - " +
                                            data.customerAddress}
                                      </span>
                                    </li>
                                  ) : (
                                    ""
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Phân loại</label>
                        <div className="form-group">
                          <Radio.Group
                            disabled={this.props.isViewMode}
                            options={options}
                            onChange={this.onChangeType}
                            value={this.state.usingType}
                          />
                        </div>
                      </div>
                      {this.state.viewMode ? (
                        <Fragment>
                          <div className="form-group">
                            <label>Trọng lượng</label>
                            <Input
                              className="form-control"
                              type="number"
                              name="weight"
                              id="weight"
                              value={this.props.productDetail.weight}
                              disabled={true}
                              onKeyDown={(e) =>
                                (e.keyCode === 69 ||
                                  e.keyCode === 107 ||
                                  e.keyCode === 109 ||
                                  e.keyCode === 190) &&
                                e.preventDefault()
                              }
                              validations={
                                this.props.product.factory !==
                                this.props.parentRoot
                                  ? ""
                                  : [required]
                              }
                            />
                          </div>
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
                                disabled={true}
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
                              disabled={true}
                              className="form-control"
                              name="manufacture"
                              value={this.state.selected}
                              onChange={this.onChange}
                            >
                              <option
                                value=""
                                disabled="disabled"
                                hidden={true}
                              >
                                {typeof this.props.product.manufacture !==
                                  "undefined" &&
                                this.props.product.manufacture !== null
                                  ? this.props.product.manufacture.name
                                  : ""}
                              </option>
                              {this.props.listManufacturers.map(
                                (item, index) => (
                                  <option
                                    // key={index}
                                    value={item.id}
                                  >
                                    {item.name}
                                  </option>
                                )
                              )}
                            </Select>
                          </div>
                        </Fragment>
                      ) : (
                        <div className="form-group">
                          <label>Trọng lượng</label>
                          <Input
                            className="form-control"
                            type="number"
                            name="weight"
                            id="weight"
                            value={this.props.productDetail.weight}
                            disabled={
                              this.props.product.factory !==
                              this.props.parentRoot
                            }
                            onKeyDown={(e) =>
                              (e.keyCode === 69 ||
                                e.keyCode === 107 ||
                                e.keyCode === 109 ||
                                e.keyCode === 190) &&
                              e.preventDefault()
                            }
                            validations={
                              this.props.product.factory !==
                              this.props.parentRoot
                                ? ""
                                : [required]
                            }
                          />
                        </div>
                      )}
                      {/*<div className="form-group">
                                                <label>Giá bán</label>
                                                <Input className="form-control" type="number" name="currentImportPrice"
                                                       id="currentImportPrice"
                                                       disabled={this.props.product.factory !== this.props.parentRoot}
                                                       value={this.props.productDetail.currentSalePrice}
                                                       validations={this.props.product.factory !== this.props.parentRoot ? "" : [required]}/>
                                            </div>*/}
                    </div>

                    {this.state.viewMode ? (
                      <div className="col-md-6">
                        <div className="row d-flex flex-column">
                          <div className="form-group">
                            <label>Vị trí hiện tại</label>
                            <Select
                              className="form-control"
                              name="status"
                              value={
                                Constant.PLACESTATUS_ENUM.find(
                                  (o) =>
                                    o.key ===
                                    this.props.productDetail.placeStatus
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
                              disabled={true}
                              className="form-control"
                              name="category"
                              value={this.state.selected}
                              onChange={this.onChange}
                            >
                              <option
                                value=""
                                disabled="disabled"
                                hidden={true}
                              >
                                {typeof this.props.product.category !==
                                  "undefined" &&
                                this.props.product.category !== null
                                  ? this.props.product.category.name
                                  : ""}
                              </option>
                              {this.state.listTypeGas.map((item, index) => (
                                <option value={index}>{item.name}</option>
                              ))}
                            </Select>
                          </div>
                          {this.state.viewMode ? (
                            <Fragment>
                              <div className="form-group">
                                <label>Màu sắc</label>
                                <Input
                                  className="form-control"
                                  type="text"
                                  name="color"
                                  id="color"
                                  disabled={this.props.isViewMode}
                                  value={this.props.productDetail.color}
                                  validations={
                                    this.props.product.factory !==
                                    this.props.parentRoot
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
                                  disabled={this.props.isViewMode}
                                  value={this.props.productDetail.valve}
                                  validations={
                                    this.props.product.factory !==
                                    this.props.parentRoot
                                      ? ""
                                      : [required]
                                  }
                                />
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div className="form-group">
                                <label>Ngày kiểm định</label>
                                <div
                                  className="input-group"
                                  style={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                  }}
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
                                      this.props.product.factory !==
                                      this.props.parentRoot
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
                                  disabled={true}
                                >
                                  <option
                                    value=""
                                    disabled="disabled"
                                    hidden={true}
                                  >
                                    {typeof this.props.product.manufacture !==
                                      "undefined" &&
                                    this.props.product.manufacture !== null
                                      ? this.props.product.manufacture.name
                                      : ""}
                                  </option>
                                  {this.props.listManufacturers.map(
                                    (item, index) => (
                                      <option
                                        // key={index}
                                        value={index}
                                      >
                                        {item.name}
                                      </option>
                                    )
                                  )}
                                </Select>
                              </div>
                            </Fragment>
                          )}
                          {/* <div className="font-weight-bold text-muted">Vòng đời</div> */}
                        </div>
                      </div>
                    ) : (
                      <Fragment>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Màu sắc</label>
                            <Input
                              className="form-control"
                              type="text"
                              name="color"
                              id="color"
                              disabled={
                                this.props.product.factory !==
                                this.props.parentRoot
                              }
                              value={this.props.productDetail.color}
                              validations={
                                this.props.product.factory !==
                                this.props.parentRoot
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
                                this.props.product.factory !==
                                this.props.parentRoot
                              }
                              value={this.props.productDetail.valve}
                              validations={
                                this.props.product.factory !==
                                this.props.parentRoot
                                  ? ""
                                  : [required]
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6"></div>
                      </Fragment>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6"></div>
                    <div className="col-md-6"></div>
                  </div>
                </div>

                <footer className="card-footer text-center">
                  {!this.props.isViewMode && (
                    <Button type="submit" className="btn btn-primary">
                      Lưu
                    </Button>
                  )}
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

EditProductPopup.propType = {
  addStore: PropType.func.isRequired,
  jobMetaData: PropType.object.isRequired,
  updateStoreImage: PropType.func.isRequired,
};

export default EditProductPopup;
