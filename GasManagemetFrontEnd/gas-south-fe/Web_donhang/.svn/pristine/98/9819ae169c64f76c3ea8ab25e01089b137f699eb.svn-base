// Nhập hồi lưu - Thương nhân sở hữu + Nhập vỏ bình - Cty con
import React from "react";
import ExportTypeCylinderPopup from "./ExportTypeCylinderPopup";
import Constant from "Constants";
import "./TypeExportCylinderPopup.scss";
import getUserCookies from "getUserCookies";
class TypeExportCylinderPopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      error: "",
      product_parse: [],
      type: "",
      user_type: "",
      user_role: "",
    };
  }

  async componentDidMount() {
    let user_cookies = await getUserCookies();
    this.setState({
      user_cookies,
      user_type: user_cookies.user.userType,
      user_role: user_cookies.user.userRole,
    });
  }

  async submit(event) {
    /*   event.preventDefault();
           // if (this.state.position.length === 0) {
           //     showToast('Chưa chọn vị trí!', 3000);
           //     return;
           // }
           let data= this.form.getValues();
           let result= await this.props.addUser(data.email,data.name,data.address,"",USERROLE_ENUM[parseInt(data.userRole)].key);
           if(result)
           {
               const modal = $("#create-staff");
               modal.modal('hide');

           }

           return;*/
  }

  async submitTextFile(event) {
    event.preventDefault();
    //await this.getAllCylenders();
    /* if (!file) showToast('Vui lòng chọn file!', 3000);
         this.setState({isLoading: true});
         const result = await importProductsFromExcelAPI(file);
         this.setState({isLoading: false});
         console.log(result);
         if (result && result.status === 200) {
             if (typeof (result) !== 'undefined') {
                 showToast('Đưa vào thành công!', 3000);
                 this.props.refresh();
             }
             else {
                 //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
             }
             return;
         } else {
             showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
         }
         return;
         $("#import-product").modal('hide');
         return;*/
  }
  getListProducts(products) {
    this.setState({ product_parse: products });
  }
  render() {
    return (
      <div
        className="modal fade"
        id="type-import-cylinder-modal-data"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chọn kiểu nhập từ thị trường</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="text-center">
                {this.state.user_type === "Factory" &&
                  this.state.user_role === "Owner" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const modal = $("#type-import-cylinder-modal-data");
                        this.setState({ type: Constant.BUY }, () =>
                          this.props.handleChangeTypeExportCylinder(
                            this.state.type
                          )
                        );
                        modal.modal("hide");
                      }}
                      data-target="#import-cylinder-information"
                      type="submit"
                      data-toggle="modal"
                      style={{ marginBottom: "10px" }}
                    >
                      Công ty mẹ
                    </button>
                  )}
                {this.state.user_type === "Factory" &&
                  this.state.user_role === "Owner" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const modal = $("#type-import-cylinder-modal-data");
                        this.setState({ type: Constant.BUY }, () =>
                          this.props.handleChangeTypeExportCylinder(
                            this.state.type
                          )
                        );
                        modal.modal("hide");
                      }}
                      data-target="#import-cylinder-information"
                      type="submit"
                      data-toggle="modal"
                      style={{ marginLeft: "10px", marginBottom: "10px" }}
                    >
                      Công ty con - Chi nhánh trực thuộc
                    </button>
                  )}
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const modal = $("#type-import-cylinder-modal-data");
                    this.setState({ type: Constant.BUY }, () =>
                      this.props.handleChangeTypeExportCylinder(this.state.type)
                    );
                    modal.modal("hide");
                  }}
                  data-target="#import-cylinder-information"
                  type="submit"
                  data-toggle="modal"
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                >
                  Đối tác bán đứt
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const modal = $("#type-import-cylinder-modal-data");
                    modal.modal("hide");
                    this.setState({ type: Constant.RENT }, () =>
                      this.props.handleChangeTypeExportCylinder(this.state.type)
                    );
                  }}
                  data-toggle="modal"
                  type="submit"
                  data-target="#import-cylinder-information"
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                >
                  Đối tác cho thuê
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const modal = $("#type-import-cylinder-modal-data");
                    modal.modal("hide");
                    this.setState({ type: Constant.TO_FIX }, () =>
                      this.props.handleChangeTypeExportCylinder(this.state.type)
                    );
                  }}
                  data-toggle="modal"
                  type="submit"
                  data-target="#import-cylinder-information"
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                >
                  Sửa chữa
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const modal = $("#type-import-cylinder-modal-data");
                    modal.modal("hide");
                    this.setState({ type: Constant.BUY }, () =>
                      this.props.handleChangeTypeExportCylinder(this.state.type)
                    );
                  }}
                  data-toggle="modal"
                  type="submit"
                  data-target="#import-cylinder-information"
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                >
                  Nhập từ trạm
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const modal = $("#type-import-cylinder-modal-data");
                    modal.modal("hide");
                  }}
                  data-toggle="modal"
                  type="submit"
                  data-target="#export-cylinder-type-new"
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                >
                  Nhập hồi lưu
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const modal = $("#type-import-cylinder-modal-data");
                    modal.modal("hide");
                  }}
                  data-toggle="modal"
                  type="submit"
                  data-target="#export-cylinder-type-full"
                  style={{ marginLeft: "10px", marginBottom: "10px" }}
                >
                  Hồi lưu bình đầy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TypeExportCylinderPopup;
