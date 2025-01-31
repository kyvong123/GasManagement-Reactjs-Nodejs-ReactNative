import React from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
// import Button from 'react-validation/build/button';
import required from "required";
import showToast from "showToast";
import getInformationFromCylinders from "getInformationFromCylinders";
import Constant from "Constants";
import {
  AUTOCREATECYLYNDER,
  CHECKCYLINDERSFORORDER,
} from "./../../../config/config";
import callApi from "../../../util/apiCaller";
import getUserCookies from "getUserCookies";
import openNotificationWithIcon from "./../../../helpers/notification";

var fileReader;
import { Table, Button, Row, Col } from "antd";

const defaultPageSize = {
  defaultPageSize: 10,
};

const columns = [
  {
    title: "Serial",
    dataIndex: "serial",
    key: "serial",
    // ...this.getColumnSearchProps("status"),
  },
  {
    title: "Màu sắc",
    dataIndex: "color",
    key: "color",
    // ...this.getColumnSearchProps("content"),
  },
  {
    title: "Loại van",
    dataIndex: "valve",
    key: "valve",
    // ...this.getColumnSearchProps("createdBy"),
  },
  {
    title: "Cân nặng",
    dataIndex: "weight",
    key: "weight",
    // ...this.getColumnSearchProps("createdAt"),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    // ...this.getColumnSearchProps("createdAt"),
  },
  {
    title: "Thao tác",
    key: "operation",
    render: () => (
      <div>
        <Button
          type="primary"
          style={{ marginLeft: 5 }}
          //data-toggle="modal"
          //data-target="#view-order-histories-modal"
          // onClick={() => this.setState({ selectedOrderId: listAllOrder.id })}
        >
          Thao tác
        </Button>
      </div>
    ),
  },
  // {
  //     title:this.props.t("ACTION"),
  //     key: 'operation',
  //     width: 120,
  //     align: 'center',
  //     fixed: "right",
  //     render: (record, index) => {
  //         // const { enablePrint } = this.state;
  //         const editable = this.isEditing(record);
  //         return (
  //             <div>
  //             <Button
  //                 type="primary"
  //                 style={{ marginRight: 5 }}
  //                 data-toggle="modal"
  //                 data-target="#view-order-histories-modal"
  //                 onClick={() => this.getOrderHistories(record, index)}
  //                 icon='history'
  //             />
  //             {
  //                 !editable ?
  //                     <Button
  //                         type="primary"
  //                         // style={{ marginRight: 5 }}
  //                         onClick={() => this.getDataPrint(record.orderId, record.key)}
  //                         icon='download'
  //                     />
  //                     : ''
  //             }
  //             {
  //                 editable ?
  //                     <ReactToPrint
  //                         style={{ marginLeft: 5 }}
  //                         copyStyles={true}
  //                         // onBeforeGetContent={this.handleOnBeforeGetContent}
  //                         trigger={() => <Button type="primary" icon="printer" />}
  //                         content={() => this.componentRef}
  //                     />
  //                     : ''
  //             }
  //             {/* <ImportPrinter ref={el => (this.componentRef = el)} data={record} text={this.state.text}/> */}
  //         </div>
  //         )
  //     }
  // },
];

class EditOrder extends React.Component {
  constructor(props) {
    super(props);
    this.form = null;
    this.state = {
      content: "",
      listProducts: [],
      error: "",
      inputKey: Date.now(),
      file: null,
      statusExisted: true,
      listAutoCreate: [],
      orderHistories: [],
      // detailDataExport: [],
      dataSource: [],
    };
  }

  // componentDidUpdate()={
  //     orderHistories
  // }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.orderHistories !== prevProps.orderHistories) {
      // console.log('componentDidUpdate', this.props.orderHistories)
      this.setState({ orderHistories: this.props.orderHistories });
      // console.log('componentDidUpdate this.setState', this.state.orderHistories)
    }
    if (this.props.dataSource !== prevProps.dataSource) {
      // console.log('componentDidUpdate', this.props.orderHistories)
      this.setState({ dataSource: this.props.dataSource });
      // console.log('componentDidUpdate this.setState', this.state.orderHistories)
    }
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
  onAutoCreateCylinder = async () => {
    let user_cookies = await getUserCookies();
    let token = "Bearer " + user_cookies.token;
    // console.log("arr auto",this.state.listAutoCreate);
    let params = {
      listCylinders: this.state.listAutoCreate,
      userId: user_cookies.user.id,
    };
    await callApi("POST", AUTOCREATECYLYNDER, params, token).then((res) => {
      if (res.data.success) {
        openNotificationWithIcon(
          "success",
          "Tạo nhanh thành công, vui lòng nhấn Reset rồi chọn lại file"
        );
      } else {
        openNotificationWithIcon("error", "Đã có lỗi xảy ra");
      }
    });
  };

  handleFileUpload = async (event, isCheck) => {
    let that = this;
    let file = null;
    event.preventDefault();
    // console.log(isCheck);
    if (isCheck) {
      //event.target.value = null
      this.fileInput.value = null;
      this.setState({
        file,
        error: "",
        listProducts: [],
      });
    } else {
      file = event.target.files[0];
      fileReader = new FileReader();
      fileReader.onload = async function (event) {
        // The file's text will be printed here
        // console.log("event.target.result;", event.target.result, file);
        let result = event.target.result;

        let array_id = result.split("\n");
        let cylinders_list = [];

        for (let i = 0; i < array_id.length; i++) {
          if (array_id[i].trim() !== "") {
            array_id[i].replace("\r", "").replace("\n", "");
            cylinders_list.push(array_id[i].trim());
          }
        }

        // for (let i = 0; i < that.props.listProductsAll.length; i++) {
        //     for(let j=0;j<array_id.length;j++)
        //     {
        //         if (array_id[j].trim()===that.props.listProductsAll[i].serial.trim()) {
        //             cylinders_list.push(that.props.listProductsAll[i]);
        //         }
        //     }

        // }

        /*  //  --- Đóng
                 let resultSearch = await getInformationFromCylinders(cylinders_list, Constant.EXPORT_TYPE);
                 cylinders_list = resultSearch.data;
                 //console.log("list abc",resultSearch);
                 if (resultSearch.status === 200) {
                     if (resultSearch.data.hasOwnProperty("err_msg")) {
                         showToast(resultSearch.data.err_msg)
                         //console.log("list abc",resultSearch);
                         that.setState({ error: resultSearch.data.err_msg, listProducts: [],statusExisted:true,listAutoCreate:resultSearch.data.listErrCylinder })
                         return
                     }
                     that.setState({ listProducts: cylinders_list, error: "" });
                     
                     that.props.getListProducts(cylinders_list);
                 }
                 //  --- Đóng */
        //
        let user_cookies = await getUserCookies();
        let token = "Bearer " + user_cookies.token;

        let params = {
          userId: user_cookies.user.id,
          cylinderSerial: cylinders_list,
        };

        await callApi("POST", CHECKCYLINDERSFORORDER, params, token).then(
          (res) => {
            // console.log('check_cylidners_for_order', res.data)
            const resData = res.data;
            if (resData.status && resData.resCode === "SUCCESS-00001") {
              that.setState({
                listProducts: resData.listSuccessCylinder,
                error: "",
              });

              that.props.getListProducts(resData.listSuccessCylinder);
            } else {
              that.setState({
                error: resData.message,
                listProducts: [],
                statusExisted: false,
                listAutoCreate: resData.listErrCylinder,
              });
            }
          }
        );
      };
      fileReader.readAsText(file);
    }
  };

  reloadPopup() {
    // this.setState({listProducts: []})
    //window.location.reload()
  }

  getOrder = () => {
    const { detailDataExport } = this.state;

    let orders = [];
    if (detailDataExport.order) {
      detailDataExport.order.forEach((element) => {
        orders.push(element.orderCode);
      });
      return orders.join(", ");
    } else {
      return "";
    }
  };

  render() {
    const { orderHistories, detailDataExport, dataSource } = this.state;

    // console.log('viewOrderHistories', orderHistories)
    // console.log('viewOrderHistories props', this.props.orderHistories )
    // console.log('isLoadingViewOrderHistories props', this.props.isLoadingViewOrderHistories )

    return (
      <div className="modal fade" id="view-edit-order-modal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xem và chỉnh sửa</h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">&times;</span>
              </button>
              {/* <Row style={{ marginTop: 20 }}>
                                <Col xs={2}><h5 className="modal-title">{this.props.t('ORDER_HISTORY')}</h5></Col>
                                <Col xs={20}>

                                </Col>
                                <Col xs={2}></Col>
                            </Row> */}
            </div>
            <div className="modal-body">
              <Row style={{ marginBottom: 10 }}>
                <Col xs={2}>Biển số xe: </Col>
                <Col xs={4}>
                  {/* {detailDataExport.exportHistory ? detailDataExport.exportHistory.license_plate : ''} */}
                </Col>
                <Col xs={2}>Đơn hàng: </Col>
                <Col xs={16}>{/* {this.getOrder} */}</Col>
              </Row>

              <Table
                //loading={this.props.isLoadingViewOrderHistories}
                bordered
                columns={columns}
                dataSource={dataSource}
                pagination={defaultPageSize}
                // expandedRowRender={(record, index) => this.expandedRowRender(record, index)}
                // onRow={(record, index) => (
                //     console.log('record, index', record, index, listAllOrder)
                //   )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default (EditOrder);
