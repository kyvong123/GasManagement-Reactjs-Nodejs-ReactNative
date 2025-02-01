import React from "react";
import showToast from "showToast";
import {
  Form,
  Input,
  InputNumber,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  message,
  Modal,
} from "antd";
import "./index.scss";
import createUserType from "./../../../../api/createUserTypeAPI";
class AddUserTypePopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.options = [];
    this.state = {
      name: "",
      orderNo: "",
      note: "",
      value: "",
      listUserType: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addUserType = this.addUserType.bind(this);
  }

  async componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== "" || nextProps !== []) {
      this.setState({
        listUserType: nextProps.listUserType,
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        console.log(this.state.listUserType);
        for (const element of this.state.listUserType) {
          if (element.name.toLowerCase() === values.name.toLowerCase()) {
            showToast("Loại người dùng đã tồn tại");
            return;
          }
        }
        this.addUserType(values.name, values.orderNo, values.note);
      }
    });
  };

  async addUserType(name, orderNo, note) {
    const addUserType = await createUserType(name, orderNo, note);
    if (addUserType) {
      console.log(addUserType);
      if (addUserType.data.success === true) {
        this.onCheckCreate(true);
        showToast("Tạo mới thành công!", 3000);
        this.props.form.resetFields();
        let modal = $("#add-user-type");
        modal.modal("hide");
        return true;
      } else {
        showToast(
          addUserType.data.message
            ? addUserType.data.message
            : addUserType.data.err_msg,
          2000
        );
        this.props.form.resetFields();
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình thêm dữ liệu!");
      this.props.form.resetFields();
      return false;
    }
  }
  onChange = (e) => {
    let temp = e.target.value;
    temp = temp.replace(/[!@#$%^&*(),.?":{}|<>]/g, "");
    this.setState({ value: temp });
  };

  onCheckCreate = (checked) => {
    this.props.onChecked(checked);
  };

  //validate start and end whitespace
  validator01 = (rules, value, callback) => {
    let check_string, check_string_2 = false;
    let string = /^[a-zA-Z0-9\.\'\-àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýĐÝ]{1,50}(?: [a-zA-Z0-9\.\'\-àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýĐÝ]{1,50})+$/
    let string_2 = /^([a-zA-Z0-9\.\'\-àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýĐÝ]{1,50})+$/
    check_string = string.test(value)
    check_string_2 = string_2.test(value)
    if (value) {
      if (check_string === true || check_string_2 === true) {

      } else {
        return Promise.reject("Loại người dùng không hợp lệ!")
      }
    }
    try {
      return Promise.resolve(value);
      // callback();
    } catch (error) {
      // callback(error);
      return Promise.reject(error);
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="modal fade" id="add-user-type" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <Icon className="icon_star" theme="filled" />
                Tạo mới loại người dùng
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form form="form" onSubmit={this.handleSubmit}>
                <Form.Item className="lnd_input" required={false}>
                  <label style={{ color: "black" }}>Loại người dùng</label>
                  <label style={{ color: "red" }}>*</label>
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "Loại người dùng không được để trống!",
                      },
                      { validator: this.validator01 }
                    ],
                  })(
                    <Input
                      placeholder="Loại người dùng"
                      type="text"
                      onChange={this.onChange}
                      value={this.state.value}
                    />
                  )}
                </Form.Item>
                <Form.Item className="stt_input" required={false}>
                  <label style={{ color: "black" }}>STT</label>
                  <label style={{ color: "red" }}>*</label>
                  {getFieldDecorator("orderNo", {
                    rules: [
                      { required: true, message: "STT không được để trống!" },
                      {
                        whitespace: true,
                        message: "STT không được để khoảng trắng!",
                      },
                    ],
                  })(<Input placeholder="STT" type="number" />)}
                </Form.Item>
                <Form.Item className="ghichu_input" required={false}>
                  <label style={{ color: "black" }}>Ghi chú</label>
                  <label style={{ color: "red" }}>*</label>
                  {getFieldDecorator("note", {
                    rules: [
                      {
                        required: true,
                        message: "Ghi chú không được để trống!",
                      },
                      { max: 256, message: "Ghi chú tối đa 256 ký tự!" },
                    ],
                  })(<Input.TextArea placeholder="Ghi chú" />)}
                </Form.Item>
                <footer className="card-footer text-center">
                  <Button type="primary" htmlType="submit">
                    <Icon type="save" /> Lưu
                  </Button>
                  <Button
                    type="reset danger"
                    data-dismiss="modal"
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => this.props.form.resetFields()}
                  >
                    Đóng
                  </Button>
                </footer>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const HorizontalForm = Form.create({ name: "add-user-type" })(AddUserTypePopup);
export default HorizontalForm;
