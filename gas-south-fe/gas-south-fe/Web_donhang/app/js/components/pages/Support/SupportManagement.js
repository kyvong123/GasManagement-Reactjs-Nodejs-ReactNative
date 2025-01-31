import React from "react";
import FormSupport from "./../Support/FormSupport";
import getAllSupport from "../../../../api/getAllSupport";
import showToast from "showToast";
import { DELETESUPPORT, DELETEDCONTENT } from "../../../config/config";
import getUserCookies from "getUserCookies";
import callApi from "./../../../util/apiCaller";
import { Popconfirm, Icon, Table, Collapse, Select } from "antd";
import "./Support.scss";

class supportmanagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: false, //khi mode=true thì form tạo mode = false thì form update
      listData: [],
      id: "", //id theo user
      supportedit: {
        title: "",
        content: "",
      },
      listData2: {},
    };
    this.openForm = this.openForm.bind(this);
  }
  //chế độ của form: tạo hoặc chỉnh sửa
  async openForm() {
    await this.setState({
      mode: true,
    });
  }

  async componentDidMount() {
    await this.getAll();
  }
  //function:lấy data
  async getAll() {
    const data = await getAllSupport();
    if (data) {
      if (data.data.success === true) {
        this.setState({
          listData: data.data.Result,
        });
      }
    } else {
      showToast("Có lỗi lấy dữ liệu");
    }
  }
  refresh() {
    this.forceUpdate(async () => {
      await this.getAll();
    });
  }
  //function:delete
  async deleteSupport(id) {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let params = {
      id: id,
    };
    await callApi("POST", DELETESUPPORT, params, token).then((res) => {
      if (res.data.success === "xóa thành công") {
        this.refresh();
        alert(res.data.success);
      } else {
        alert("Xóa không thành công");
        return;
      }
    });
  }
  //function: edit
  async editSupport(id) {
    for (let i = 0; i < this.state.listData.length; i++) {
      if (this.state.listData[i].Support.id === id) {
        this.setState({
          listData2: this.state.listData[i],
          mode: false,
        });
      }
    }
  }
  async deletedContent(id) {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    let paramdeletedContent = {
      id: id,
      deletedBy: user_cookies ? user_cookies.user.id : "",
    };
    await callApi("POST", DELETEDCONTENT, paramdeletedContent, token).then(
      (res) => {
        console.log("ss", res);
        if (res.data.success === "xóa thành công") {
          this.refresh();
          alert(res.data.success);
        } else {
          alert("Xóa không thành công");
          return;
        }
      }
    );
  }
  //data Table
  data = () => {
    let arr = [];
    for (let i = 0; i < this.state.listData.length; i++) {
      arr.push({
        key: i + 1,
        title: this.state.listData[i].Support.title,
        content: this.state.listData[i].Content,
        id: this.state.listData[i].Support.id,
      });
    }
    return arr;
  };
  render() {
    const column = [
      {
        title: "STT",
        dataIndex: "key",
        key: "key",
        align: "center",
      },
      {
        title: "Câu Hỏi",
        dataIndex: "title",
        key: "title",
        width: 200,
        align: "center",
      },
      {
        title: "Trả Lời",
        dataIndex: "content",
        key: "content",
        width: 700,
        align: "justify",
        render: (item) => {
          return item.map((itemm, index) => {
            return (
              <div key={index} className="colap">
                <p>
                  <a
                    className="content"
                    data-toggle="collapse"
                    data-target={"#" + itemm.id}
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      color: "#fff",
                      height: "37px",
                    }}
                  >
                    <div>Nội dung {item.length > 1 ? index + 1 : ""}</div>
                  </a>
                  {item.length > 1 ? (
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa nội dung này?"
                      icon={
                        <Icon
                          type="question-circle-o"
                          style={{ color: "red" }}
                        />
                      }
                      onConfirm={() => this.deletedContent(itemm.id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <a className="delete">
                        <i class="fa fa-trash-o"></i>
                      </a>
                    </Popconfirm>
                  ) : (
                    ""
                  )}
                </p>
                <div
                  className={index === 0 ? "collapse show" : "collapse"}
                  id={itemm.id}
                >
                  <div className="text-content">
                    <p>{itemm.content}</p>
                    {itemm.support_img.map((itemmm, indexx) => {
                      return (
                        <div key={indexx} className="img">
                          <img src={itemmm.url_img} alt="" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          });
        },
      },
      {
        title: "Thao Tác",
        dataIndex: "id",
        key: "id",
        render: (store) => {
          return (
            <div className="text-center table-actions">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa câu hỏi này?"
                icon={
                  <Icon type="question-circle-o" style={{ color: "red" }} />
                }
                onConfirm={() => this.deleteSupport(store)}
                okText="Có"
                cancelText="Không"
              >
                <a className="table-action hover-primary">
                  <i className="ti-trash"></i>
                </a>
              </Popconfirm>
              <a
                className="table-action hover-primary"
                data-toggle="modal"
                data-target="#update-support"
                onClick={() => {
                  this.editSupport(store);
                }}
              >
                <i className="ti-pencil"></i>
              </a>
            </div>
          );
        },
      },
    ];
    return (
      <div className="main-content" id="supportmanagement">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Quản Lý Câu Hỏi Thường Gặp</h4>
              <div className="row">
                <button
                  onClick={this.openForm}
                  style={{ marginLeft: "20px" }}
                  className="btn btn-sm btn-create"
                  data-toggle="modal"
                  data-target="#create-support"
                >
                  Tạo mới câu hỏi thường gặp
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <Table
                      columns={column}
                      dataSource={this.data()}
                      bordered={true}
                      pagination={{ pageSize: 5, hideOnSinglePage: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FormSupport
          mode={this.state.mode}
          supportedit={this.state.supportedit}
          listData={this.state.listData2}
        />
      </div>
    );
  }
}
export default supportmanagement;
