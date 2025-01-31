import React, { Component } from 'react';
import Constants from "Constants";
import showToast from "showToast";
import { Avatar, Image, Icon, Popconfirm, Table, Card, Tooltip } from 'antd';
import getAllCarrierAPI from "./../../../../api/getAllCarrierAPI";
import cancelCarrierAPI from "./../../../../api/cancelCarrierAPI";
import CreateCarrier from "./create-carrier";
import UpdateCarrier from "./update-carrier";
import ChangePassword from "./change-password";
import "./index.scss"

class GasCarrier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      listCarrier: [],
      checkCreate: '',
      dataFromParent: {},
    };
    this.getAllCarrierAPI = this.getAllCarrierAPI.bind(this);
    this.cancelCarrierAPI = this.cancelCarrierAPI.bind(this);
    this.getDataRowUpdate = this.getDataRowUpdate.bind(this);
    this.getDataRowView = this.getDataRowView.bind(this);
    this.getDataRowChangePass = this.getDataRowView.bind(this);

  }

  componentWillMount() {
    this.getAllCarrierAPI()
  }

  componentDidMount() {

  }

  /* --------------------------------------------------------- API ---------------------------------------------------------------*/
  async getAllCarrierAPI() {
    this.setState({ isLoading: true });
    const listCarrier = await getAllCarrierAPI();
    if (listCarrier) {
      if (listCarrier.data.success === true) {
        this.setState({ listCarrier: listCarrier.data.Carrier });
        // showToast('Lấy dữ liệu thành công!');
      } else {
        showToast(
          listCarrier.data.message
            ? listCarrier.data.message
            : listCarrier.data.err_msg
        );
      }
      this.setState({ isLoading: false });
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
  }

  async cancelCarrierAPI(carrierId) {
    this.setState({ isLoading: true });
    const cancelCarrier = await cancelCarrierAPI(carrierId);
    if (cancelCarrier) {
      if (cancelCarrier.data.success === true) {
        showToast("Tài xế đã được hủy thành công!");
        this.getAllCarrierAPI();
      } else {
        showToast(
          cancelCarrier.data.message
            ? cancelCarrier.data.message
            : cancelCarrier.data.err_msg
        );
      }
      this.setState({ isLoading: false });
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
  }
  /*///////////////////////////////////////////////////////////API ---------------------------------------------------------------*/


  /* --------------------------------------------------------- Another Function --------------------------------------------------*/
  async getDataRowView(data, isView) {
    data = {...data, isView}
    await this.setState({
      dataFromParent: data
    })
  }

  async getDataRowUpdate(data,isView) {
    data = {...data, isView}
    await this.setState({
      dataFromParent: data
    })
  }

  async getDataRowChangePass(data){
    await this.setState({
      dataFromParent: data
    })
  }

  onCheckCreate = (checked) => {
    if (checked) {
      this.getAllCarrierAPI();
    }
  }

  onCheckUpdate = (checked) => {
    if (checked) {
      this.getAllCarrierAPI();
    }
  }
  /*///////////////////////////////////////////////////////////Another Function --------------------------------------------------*/

  render() {
    const columns = [
      {
        title: 'STT',
        key: "index",
        align: 'center',
        width: 100,
        render: (text, record, index) => <div style={{ color: 'black' }}>{index + 1}</div>,
        // fixed: 'left'
      },
      {
        title: 'Mã tài xế',
        align: 'center',
        dataIndex: 'code',
        width: 200,
        render: text => <div style={{ color: 'black' }}>{text}</div>,
        // fixed: 'left'
      },
      // {
      //   title: 'Hình đại diện',
      //   align: 'center',
      //   dataIndex: 'avatar',
      //   width: 200,
      //   className: "avt_columns",
      //   render: (text, record) => <Avatar size="large" src={record.avatar} />,
      //   // render:  (text, record) =><img alt={record.avatar} src={record.avatar} /> ,
      // }, 
      {
        title: 'Tên tài xế',
        dataIndex: 'name',
        align: 'center',
        width: 250,
        render: (text, record) => (<a className="update-carrier-link" data-toggle="modal" data-target="#update-carrier" onClick={this.getDataRowUpdate.bind(null, record)}>{text}</a>),
      }, {
        title: 'Biển số xe',
        align: 'center',
        dataIndex: 'driverNumber',
        width: 200,
        render: text => <div style={{ color: 'black' }}>{text}</div>,
      }, 
      // {
      //   title: 'Email',
      //   align: 'center',
      //   dataIndex: 'email',
      //   width: 250,
      //   render: text => <div style={{ color: 'black' }}>{text}</div>,
      // }, 
      // {
      //   title: 'Số điện thoại',
      //   align: 'center',
      //   dataIndex: 'phone',
      //   width: 150,
      //   render: text => <div style={{ color: 'black' }}>{text}</div>,
      // }, 
      // {
      //   title: 'Địa chỉ',
      //   align: 'center',
      //   dataIndex: 'address',
      //   width: 250,
      //   render: text => <div style={{ color: 'black' }}>{text}</div>,
      // },
      {
        title: 'Thao tác',
        align: 'center',
        key: 'thaotac',
        width: 200,
        // fixed: 'right',
        render: (text, record) => (
          <div className="action_columns">
            <Tooltip placement="top" title="Xem chi tiết">
              <a className="view_link"
                data-toggle="modal"
                data-target="#update-carrier"
                onClick={this.getDataRowView.bind(null, record, true)} >
                <i className="fa fa-info-circle view_icon" aria-hidden="true"></i>
              </a>
            </Tooltip>
            <Tooltip placement="top" title="Chỉnh sửa">
              <a className="update_link"
                data-toggle="modal"
                data-target="#update-carrier"
                onClick={this.getDataRowUpdate.bind(null, record, false)}>
                <i className="fa fa-edit update_icon"></i>
              </a>
            </Tooltip>
            <Tooltip placement="top" title="Đổi mật khẩu">
              <a className="changePass_link"
                data-toggle="modal"
                data-target="#changePass-carrier"
                onClick={this.getDataRowChangePass.bind(null, record)}>
                <i class="fa fa-key changePass_icon"></i>
              </a>
            </Tooltip>
            <Tooltip placement="top" title="Hủy">
              <Popconfirm
                title={'Xác nhận hủy tài xế "' + record.name + '"?'}
                onConfirm={this.cancelCarrierAPI.bind(null, record.id)}
                okText="Xác nhận"
                cancelText="Từ chối"
                placement="leftBottom">
                <a className="delete_link">
                  <i className="fa fa-trash delete_icon"></i>
                </a>
              </Popconfirm>
            </Tooltip>
          </div>
        ),
      }];
    console.log("listCarrier", this.state.listCarrier)
    return (
      <div className="main-content" id="GasCarrier">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Danh sách tài xế giao gas<a style={{ visibility: "hidden" }}><Icon type="left" /></a></h4>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <Table
                      rowKey={record => record.code}
                      loading={this.state.isLoading}
                      columns={columns}
                      dataSource={this.state.listCarrier}
                      bordered
                      pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
                      // scroll={{ x: 1700 }}
                    >
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
              <button
                className="btn btn-success"
                data-toggle="modal"
                data-target="#create-carrier"
              ><i className="fa fa-plus"></i>
                <span style={{ paddingLeft: '5px' }}>Tạo mới tài xế</span>
              </button>
            </div>
        </div>
        <CreateCarrier onChecked={this.onCheckCreate}></CreateCarrier>
        <UpdateCarrier onChecked={this.onCheckUpdate} dataFromParent={this.state.dataFromParent}></UpdateCarrier>
        <ChangePassword onChecked={this.onCheckUpdate} dataFromParent={this.state.dataFromParent}></ChangePassword>
      </div>
    );
  }
}

export default GasCarrier;