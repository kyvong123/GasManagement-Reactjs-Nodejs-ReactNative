// Xuất Vỏ Bình
import React from "react";
//import ExportTypeCylinderPopup from './ExportTypeCylinderPopup'
import Constant from "Constants";
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
        id="type-export-cylinder-modal-data"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chọn kiểu xuất vỏ bình</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-3">
                  <button
                    className="btn btn-primary"
                    data-target="#export-cylinder-information"
                    onClick={() => {
                      const modal = $("#type-export-cylinder-modal-data");
                      this.setState({ type: Constant.BUY }, () =>
                        this.props.handleChangeTypeExportCylinder(
                          this.state.type
                        )
                      );
                      modal.modal("hide");
                    }}
                    type="submit"
                    data-toggle="modal"
                    style={{ width: "100%" }}
                  >
                    <span className="test"> Xuất cho trạm </span>
                  </button>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-primary"
                    data-target="#export-cylinder-information"
                    onClick={() => {
                      const modal = $("#type-export-cylinder-modal-data");
                      this.setState({ type: Constant.BUY }, () =>
                        this.props.handleChangeTypeExportCylinder(
                          this.state.type
                        )
                      );
                      modal.modal("hide");
                    }}
                    type="submit"
                    data-toggle="modal"
                    style={{ width: "100%" }}
                  >
                    <span className="test"> Đối tác bán đứt</span>
                  </button>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const modal = $("#type-export-cylinder-modal-data");
                      modal.modal("hide");
                      this.setState({ type: Constant.RENT }, () =>
                        this.props.handleChangeTypeExportCylinder(
                          this.state.type
                        )
                      );
                    }}
                    data-toggle="modal"
                    type="submit"
                    data-target="#export-cylinder-information"
                    style={{ width: "100%" }}
                  >
                    <span className="test">Đối tác cho thuê</span>
                  </button>
                </div>
                <div className="col-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const modal = $("#type-export-cylinder-modal-data");
                      modal.modal("hide");
                      this.setState({ type: Constant.TO_FIX }, () =>
                        this.props.handleChangeTypeExportCylinder(
                          this.state.type
                        )
                      );
                    }}
                    data-toggle="modal"
                    type="submit"
                    data-target="#export-cylinder-information"
                    style={{ width: "100%" }}
                  >
                    <span className="test">Sửa chữa</span>
                  </button>
                </div>
                <div className="col-3"></div>
                <div className="col-6 mt-1">
                  {this.state.user_type === "Factory" && (
                    <button
                      className="btn btn-primary"
                      data-target="#export-cylinder-information"
                      onClick={() => {
                        const modal = $("#type-export-cylinder-modal-data");
                        this.setState({ type: Constant.BUY }, () =>
                          this.props.handleChangeTypeExportCylinder(
                            this.state.type
                          )
                        );
                        modal.modal("hide");
                      }}
                      type="submit"
                      data-toggle="modal"
                      style={{ width: "100%" }}
                    >
                      <span className="test">
                        Công ty con - Chi nhánh trực thuộc
                      </span>
                    </button>
                  )}
                </div>
                <div className="col-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TypeExportCylinderPopup;
