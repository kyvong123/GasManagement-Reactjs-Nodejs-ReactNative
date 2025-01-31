import React from "react";
import "antd/dist/antd.css";
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
  label,
  message,
} from "antd";
import "./index.scss";
import updateUserTypeAPI from "./../../../../api/updateUserTypeAPI";
import showToast from "showToast";

class EditUserTypePopup extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.options = [];
    this.state = {
      name: "",
      orderNo: "",
      note: "",
      userTypeFromParent: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateUserType = this.updateUserType.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps && nextProps.dataFromParent){
      this.setState({
        userTypeFromParent: nextProps.dataFromParent ?  nextProps.dataFromParent : {},
        name: nextProps.dataFromParent.name ? nextProps.dataFromParent.name : "",
        orderNo: nextProps.dataFromParent.orderNo ? nextProps.dataFromParent.orderNo : "",
        note: nextProps.dataFromParent.note ? nextProps.dataFromParent.note : "",
      });
    }
  }

  async componentDidMount() {}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let usertypeId = this.state.userTypeFromParent.id;
        let name = values.name;
        let orderNo = values.orderNo;
        let note = values.note;
        this.updateUserType(usertypeId, name, orderNo, note);
      }
    });
  };

  async updateUserType(usertypeId, name, orderNo, note) {
    const updateUserType = await updateUserTypeAPI(
      usertypeId,
      name,
      orderNo,
      note
    );
    if (updateUserType) {
      if (updateUserType.data.success === true) {
        showToast("Cập nhật thành công!", 3000);
        this.onCheckUpdate(true);
        this.props.form.resetFields();
        let modal = $("#edit-user-type");
        modal.modal("hide");
        return true;
      } else {
        showToast(
          updateUserType.data.message
            ? updateUserType.data.message
            : updateUserType.data.err_msg,
          2000
        );
        this.props.form.resetFields();
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình cập nhật dữ liệu!");
      this.props.form.resetFields();
      return false;
    }
  }

  onCheckUpdate = (checked) => {
    this.props.onChecked(checked);
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="modal fade" id="edit-user-type" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <Icon className="icon_star" type="star" theme="filled" />
                Cập nhật loại người dùng
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Form
                form="form"
                onSubmit={this.handleSubmit}
                requiredMark={false}
              >
                <Form.Item className="lnd_input" required={false}>
                  <label style={{ color: "black" }}>Loại người dùng</label>
                  {getFieldDecorator("name", {
                    initialValue: this.state.userTypeFromParent.name,
                  })(<Input placeholder="Loại người dùng" disabled />)}
                </Form.Item>
                <Form.Item className="stt_input" required={false}>
                  <label style={{ color: "black" }}>STT</label>
                  <label style={{ color: "red" }}>*</label>
                  {getFieldDecorator("orderNo", {
                    rules: [
                      { required: true, message: "STT không được để trống!" },
                    ],
                    initialValue: this.state.userTypeFromParent.orderNo,
                  })(<Input placeholder="STT" />)}
                </Form.Item>
                <Form.Item className="ghichu_input" required={false}>
                  <label style={{ color: "black" }}>Ghi chú</label>
                  <label style={{ color: "red" }}>*</label>
                  {getFieldDecorator("note", {
                    rules: [
                      { required: true, message: "Ghi chú không được để trống!"},
                      { max: 256, message: 'Ghi chú tối đa 256 ký tự!' }
                    ],
                    initialValue: this.state.userTypeFromParent.note,
                  })(<Input.TextArea placeholder="Ghi chú" />)}
                </Form.Item>
                <footer className="card-footer text-center">
                  <Button type="primary" htmlType="submit">
                    <Icon type="save" /> Lưu
                  </Button>
                  <Button
                    type="reset danger"
                    data-dismiss="modal"
                    onClick={(e) => {
                      this.props.form.resetFields();
                    }}
                    style={{ marginLeft: "10px" }}
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
const HorizontalForm = Form.create({ name: "edit-user-type" })(
  EditUserTypePopup
);
export default HorizontalForm;
