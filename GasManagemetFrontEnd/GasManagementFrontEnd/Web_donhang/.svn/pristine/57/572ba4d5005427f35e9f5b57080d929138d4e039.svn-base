import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import PropType from "prop-types";
import required from "required";
import isUppercase from "isUppercase";
import showToast from "showToast";
import moment from "moment";
import getUserCookies from "./../../../helpers/getUserCookies";
import callApi from "./../../../util/apiCaller";
import { Table, Icon, Button, Input, Form } from "antd";
import {
  GETREQIMPORT,
  ACCEPTREQUEST,
  DELETEREQUEST,
  ADDCYLINDERCANCEL,
} from "../../../config/config";
import axios from "axios";

class ListRequest extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      listRequest: [],
      tempListRequest: [],
      listCylinderCancel: [],
      txtidCancel: "",
      txtuserId: "",
      count: 0,
      task: "",
      serial: "",
      tasks: [],
    };

    this.handleClickIndex = this.handleClickIndex.bind(this);
  }

  handleClick = (event) => {
    event.preventDefault();
    this.onChangeSerial();
    if (!this.state.task) return;
    if (this.state.task.length > 10) {
      showToast("Vui lòng nhập số serial từ 1 đến 10 số");
    } else {
      const tasks = this.state.tasks || [];
      tasks.push(this.state.task);
      this.setState({ tasks: tasks, task: "" });
    }
  };
  handleClickIndex(index, event) {
    eval(this[event.target.name]).bind(this)(index, event);
  }
  handleChange = (e) => {
    this.setState({ task: e.target.value });
  };
  onChangeSerial = (e) => {
    // console.log('madonhang', e.target.value)
    let date = new Date();
    let formattedDate = moment(date).format("DDMMYYYY");
    let dateString = formattedDate.toString().slice(0, 6);
    let dateNowString = Date.now()
      .toString()
      .slice(7, 13);
    let serial = (dateString + dateNowString).toString();
    this.setState({ serial: serial });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const user_cookies = await getUserCookies();
    let params = {
      idCancel: Date.now(),
      cylinders: this.state.tasks,
      userId: user_cookies.user.id,
    };
    let token = "Bearer " + user_cookies.token;
    await callApi("POST", ADDCYLINDERCANCEL, params, token).then((res) => {
      if (res.data.status == false) {
        showToast("Quá trình thanh lý bình gas thất bại");
      } else showToast("Quá trình thanh lý bình gas thành công");
    });
  };
  task(event) {
    this.setState({ task: event.target.value });
  }

  removeTask(index, event) {
    const tasks = this.state.tasks;
    tasks.splice(index, 1);
    this.setState({ tasks });
  }

  //cmt

  async componentDidMount() {
    const user_cookies = await getUserCookies();
    let params = {
      id: user_cookies.user.id,
    };
    let token = "Bearer " + user_cookies.token;
    await callApi("POST", GETREQIMPORT, params, token).then((res) => {
      this.setState({
        tempListRequest: res.data.data,
      });
      // Đảo mảng lại cho mới nhất lên cùng
      let resLength = res.data.data.length;
      for (let i = 0; i < resLength; i++) {
        this.state.listRequest[i] = this.state.tempListRequest[
          resLength - 1 - i
        ];
      }
    });
    this.onChangeSerial();
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
      listCylinde: [],
      displayTable: false,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  onGiveListCylinde = (tags) => {
    this.setState({
      listCylinde: tags,
      displayTable: true,
    });
  };

  // Hàm xác nhận yêu cầu
  onAcceptRequest = async (idRequest) => {
    const user_cookies = await getUserCookies();
    let params = {
      idUser: user_cookies.user.id,
      idReq: idRequest,
    };
    let token = "Bearer " + user_cookies.token;
    var answer = window.confirm("Bạn có chắc chắn xác nhận đơn hàng này ?");
    if (answer) {
      await callApi("POST", ACCEPTREQUEST, params, token).then((res) => {
        if (res.data.message === "Co loi khi tao binh") {
          alert("Có bình đã bị trùng");
        } else {
          alert("Duyệt đơn hàng thành công");
          const modal = $("#list-request");
          modal.modal("hide");
        }
      });
    }
  };

  // Hàm xóa
  onDeleteRequest = async (idRequest) => {
    const user_cookies = await getUserCookies();
    let params = {
      idReq: idRequest,
    };
    let token = "Bearer " + user_cookies.token;
    var answer = window.confirm("Bạn có chắc chắn xóa đơn hàng này ?");
    if (answer) {
      await callApi("POST", DELETEREQUEST, params, token).then((res) => {
        if (res.data.message === "Co loi khi tao binh") {
          alert("Không xóa được.");
        } else {
          alert("Xóa yêu cầu thành công!");
          const modal = $("#list-request");
          modal.modal("hide");
          window.location.reload();
        }
      });
    }
  };

  render() {
    const tasks = (this.state.tasks || []).map((task, index) => (
      <tr style={{ textAlign: "center" }}>
        <td>{index + 1}</td>
        <td>{task}</td>
        <td>
          <button
            className="btn btn-danger"
            data-toggle="modal"
            data-target={"#modelDelete" + index}
            data-dismiss="modal"
          >
            Xóa
          </button>
        </td>
      </tr>
    ));
    const { name, address, occupation } = this.state;
    const columns = [
      {
        title: "Tên công ty",
        dataIndex: "id_ReqFrom.name",
        key: "id_ReqFrom.name",
      },
      {
        title: "Danh sách các bình",
        dataIndex: "detail_Req",
        render: (tags) => (
          <Button
            style={{ background: "#2E64FE", color: "white" }}
            onClick={() => this.onGiveListCylinde(tags)}
          >
            Xem
          </Button>
        ),
      },
      {
        title: "Hành động",
        dataIndex: "id",
        key: "id",
        render: (id) => (
          <React.Fragment>
            <Button
              style={{ background: "#01DF74", color: "#fff" }}
              onClick={() => this.onAcceptRequest(id)}
            >
              Xác nhận
            </Button>
            <Button
              style={{ background: "#e50000", color: "#fff" }}
              onClick={() => this.onDeleteRequest(id)}
            >
              Xóa
            </Button>
          </React.Fragment>
        ),
      },
    ];
    const columnsCylinder = [
      {
        title: "Mã bình",
        dataIndex: "serial",
        key: "serial",
      },

      {
        title: "Màu",
        dataIndex: "color",
        key: "color",
      },
      {
        title: "Ngày kiểm định",
        dataIndex: "checkedDate",
        key: "checkedDate",
      },
      {
        title: "Cân nặng",
        dataIndex: "weight",
        key: "weight",
      },
      {
        title: "Mã thương hiệu",
        dataIndex: "manufacture",
        key: "manufacture",
      },
      {
        title: "Thời gian tạo yêu cầu",
        dataIndex: "createdAt",
        key: "createdAt",
      },
    ];
    return (
      <div>
        {(this.state.tasks || []).map((task, index) => (
          <div
            className="modal fade"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="modelTitleId"
            aria-hidden="true"
            id={"modelDelete" + index}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Xoá bình thanh lí theo serial</h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  Bạn có muốn xoá bình thanh lí có số serial : {task}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    name="removeTask"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={(event) => this.handleClickIndex(index, event)}
                    data-toggle="modal"
                    data-target="#list-request1"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="modal fade" id="list-request" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Danh sách các yêu cầu tạo bình</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Form className="card">
                  <div className="card-body">
                    <div className="row">
                      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Table
                          columns={columns}
                          dataSource={this.state.listRequest}
                        />
                        {this.state.displayTable && (
                          <Table
                            columns={columnsCylinder}
                            dataSource={this.state.listCylinde}
                            scroll={{ x: 1300 }}
                            pagination={{ defaultPageSize: 5 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="list-request1" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tạo thanh lý bình</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="card-body">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="row">
                        <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                          Số biên bản
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                          <input
                            type="number"
                            value={this.state.serial}
                            class="form-control"
                            disabled
                            placeholder="Nhập số biên bản"
                          />
                        </div>
                        <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2">
                          Số serial
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                          <input
                            type="number"
                            value={this.state.task}
                            class="form-control"
                            onChange={this.handleChange}
                            placeholder="Nhập số serial"
                            required
                          />
                        </div>
                      </div>

                      <button
                        className="btn btn-xl btn-create float-right mt-3"
                        style={{ float: "right" }}
                        onClick={this.handleSubmit}
                        type="submit"
                      >
                        Thanh lý
                      </button>
                      <button
                        className="btn btn-xl btn-create float-right mt-3 mr-1"
                        style={{ float: "right" }}
                        onClick={this.handleClick}
                      >
                        Lưu
                      </button>
                      <table
                        className="table table-striped table-bordered seednet-table-keep-column-width"
                        cellSpacing="0"
                      >
                        <thead className="table__head">
                          <tr>
                            <th className="text-center w-70px align-middle">
                              #STT
                            </th>
                            <th className="text-center w-70px align-middle">
                              Số Serial
                            </th>
                            <th className="text-center w-70px align-middle">
                              Chức năng
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks}

                          <div></div>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListRequest;
