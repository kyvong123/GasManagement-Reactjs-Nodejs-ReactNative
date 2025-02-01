import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Button from "react-validation/build/button";
import required from "required";
import showToast from "showToast";
import "./product.scss";

class AddProductTypePopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      typeCode: "",
      typeName: "",
      mass: ""
    };
  }

  async submit(event) {
    event.preventDefault();
    let data = this.form.getValues();
    console.clear();
    console.log(data.typeName.length);
    if (
      (data.typeCode.length && data.mass.length) <= 15 &&
      data.typeName.length <= 256 &&
      data.typeName.length >= 3 
    ) {
      this.props.addProductType(data);
    } else {
      showToast(
        "Hãy nhập mã loại bình từ 0 tới 15 ký tự và tên loại bình từ 3 tới 256 ký tự"
      );
    }
  }

  render() {
    return (
      <div className="modal fade" id="create-product-type" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tạo mới loại bình</h5>
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
                onSubmit={this.submit.bind(this)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Mã loại</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="typeCode"
                          id="typeCode"
                          value={this.state.typeCode}
                          validations={[required]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Tên loại</label>
                        <Input
                          className="form-control"
                          type="text"
                          name="typeName"
                          id="typeName"
                          value={this.state.typeName}
                          validations={[required]}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Cân nặng</label>
                        <Input
                          className="form-control"
                          type="number"
                          name="mass"
                          id="mass"
                          value={this.state.mass}
                          validations={[required]}
                        />
                      </div>
                    </div>
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

export default AddProductTypePopup;
