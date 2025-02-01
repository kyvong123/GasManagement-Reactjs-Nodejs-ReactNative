import React from "react";
import Form from "react-validation/build/form";
// import Input from 'react-validation/build/input';
// import Button from 'react-validation/build/button';
import required from "required";
import showToast from "showToast";
//import getInformationFromCylinders from "getInformationFromCylinders";
import Constant from "Constants";
import {
  AUTOCREATECYLYNDER,
  CHECKCYLINDERSFORORDER,
} from "../../../config/config";
import callApi from "../../../util/apiCaller";
import getUserCookies from "getUserCookies";
//import openNotificationWithIcon from "./../../../helpers/notification";
import { Table, Tabs, Icon, Button, Divider, Tag, Input, Select } from "antd";
import Highlighter from "react-highlight-words";
import PopupDriverExportOrder from "./PopupDriverExportOrder";
import moment from "moment";
import getAllProvince from "../../../../api/getAllProvince"
// Khi sử dụng prop animated trong Tabs thì phải bỏ file css ở dưới
// File css dùng để sửa lỗi giao diện của Tabs - TabPane thứ 2 trở đi không hiển thị đúng vị trí
// import './popupExportOrder.css';

var fileReader;
const { TabPane } = Tabs;
const Option = Select.Option;
class PopupExportOrder extends React.Component {
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
      //
      selectedOrderInfor: [],
      searchText: "",
      searchedColumn: "",
      filename: "",
      ShippingTextDetail: [],
      listProvince: [
      ],
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  async componentDidMount() {
    let data = await getAllProvince();
    console.log("getAllProvince", data)
    this.setState({
      listProvince: data.data.region
    })

  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.selectedOrderInfor !== prevProps.selectedOrderInfor) {
      // console.log('this.props.selectedOrderInfor', this.props.selectedOrderInfor)
      this.setState({ selectedOrderInfor: this.props.selectedOrderInfor });
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
    console.log("this.state.listProducts111", this.Form.getValue());
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
      this.setState({
        filename: file.name,
      });

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

        // this.props.handleInput("arr");
        await callApi("POST", CHECKCYLINDERSFORORDER, params, token).then(
          (res) => {
            console.log("check_cylidners_for_order", res.data);
            console.log("event.target.files[0]", file);
            const resData = res.data;
            if (resData.status && resData.resCode === "SUCCESS-00001") {
              that.setState({
                listProducts: resData.listSuccessCylinder,
                error: "",
              });

              that.props.getListProducts(resData.listSuccessCylinder);

              console.log("this.state.listProducts111", file);
              let arr = [];
              res.data.listSuccessCylinder.map((v) => {
                arr.push({
                  serial: v.serial,
                  fileName: file.name,
                });
              });
              // this.setState({
              //     ShippingTextDetail: arr
              // })
              console.log("this.state.ShippingTextDetail", arr);
              that.props.handleInput(arr);


              //     function sendData () {
              //         this.props.parentCallback(arr);
              //    }
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  expandedRowRender = (record, index) => {
    // console.log('expandedRowRender', record, index)
    const columnsNestedTables = [
      { title: "Loại bình", dataIndex: "cylinderType", key: "cylinderType" },
      { title: "Màu sắc", dataIndex: "color", key: "color" },
      { title: "Loại van", dataIndex: "valve", key: "valve" },
      {
        title: "Số lượng bình",
        dataIndex: "numberCylinders",
        key: "numberCylinders",
      },
      // { title: 'Đã giao', /* dataIndex: 'numberCylinders', key: 'numberCylinders' */ },
    ];

    const data = [];
    const lengthListCylinder = record.listCylinder.length;
    for (let i = 0; i < lengthListCylinder; i++) {
      data.push({
        key: i,
        cylinderType: record.listCylinder[i].cylinderType,
        color:
          record.listCylinder[i].colorcolor === "GRAY"
            ? "Xám"
            : record.listCylinder[i].color === "YELLOW"
              ? "Vàng"
              : record.listCylinder[i].color === "ORANGE"
                ? "Cam"
                : record.listCylinder[i].color === "RED"
                  ? "Đỏ"
                  : record.listCylinder[i].color,
        valve: record.listCylinder[i].valve,
        numberCylinders: record.listCylinder[i].numberCylinders,
      });
    }
    return (
      <Table
        columns={columnsNestedTables}
        dataSource={data}
        pagination={false}
      />
    );
  };
  handleChangeListProvince = (record, event) => {
    let arrayProvience = [];
    console.log("value111111", record);
    console.log("value", event.key);
    this.props.selectedOrderInfor.map(function (x) {
      if (event.key === x.id) {
        x.provinceId = record;
        return x
      }

    });
    console.log("2222222222222", this.props.selectedOrderInfor);
    arrayProvience.push
      (
        {
          value: record
        }
      );
    console.log("arrayProvience", arrayProvience);
    this.setState({
      provinceCode: record,
    });
    console.log("handleChangeListProvince", record)

  };
  // onSelectChange = (selectedRowKeys, selectedRows) => {
  //    console.log('selectedRowKeys changed: ', selectedRowKeys);
  //    console.log('selectedRows changed: ', selectedRows);
  //   this.setState({ selectedRowKeys, selectedRows });
  //   console.log("this.state.selectedRowKeys",this.state.selectedRowKeys);

  //             this.props.handleInput1(selectedRows);  
  // };
  // onSelectRowChange = (record, selected, selectedRows, nativeEvent) => {
  //   // console.log('onSelectChange_record: ', record);
  //   // console.log('onSelectChange_selected: ', selected);
  //   // console.log('onSelectChange_selectedRows: ', selectedRows);
  //   // console.log('onSelectChange_nativeEvent: ', nativeEvent);
  //   // this.setState({ selectedRowKeys });
  // }; 
  render() {
    let { selectedRowKeys } = this.state;
    console.log("this.props.selectedOrderInfor11111111", this.props.selectedOrderInfor);
    const settingPagination = {
      defaultPageSize: 5,
    };
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    //   onSelect: this.onSelectRowChange,
    // };

    const columns = [
      {
        title: "Mã đơn hàng",
        dataIndex: "orderCode",
        key: "orderCode",
        ...this.getColumnSearchProps("orderCode"),
      },
      // {
      //     title: "Thời gian tạo",
      //     dataIndex: "orderDate",
      //     key: "orderDate",
      //     ...this.getColumnSearchProps("orderDate"),
      // },
      // {
      //   title: "Mã khách hàng",
      //   dataIndex: "customerCode",
      //   key: "customerCode",
      //   ...this.getColumnSearchProps("customerCode"),
      // },
      {
        title: "Tên khách hàng",
        dataIndex: "customerName",
        key: "customerName",
        // ...this.getColumnSearchProps("customerName"),
      },
      // {
      //   title: "Mã chi nhánh",
      //   dataIndex: "agencyCode",
      //   key: "agencyCode",
      //   ...this.getColumnSearchProps("agencyCode"),
      // },
      {
        title: "Tên chi nhánh",
        dataIndex: "agencyName",
        key: "agencyName",
        // ...this.getColumnSearchProps("agencyName"),
      },
      {
        title: "Thời gian giao hàng",
        dataIndex: "deliveryDate",
        key: "deliveryDate",
        ...this.getColumnSearchProps("deliveryDate"),
        render: (text) => {
          return <div>{moment(text).format("DD/MM/YYYY - HH:mm:ss")}</div>;
        },
        // Thay đổi màu sắc của 1 cell trong table
        // render(text, record) {
        //   return {
        //     props: {
        //       style: { background: '#ddd' },
        //     },
        //     children: <div>{text}</div>,
        //   };
        // },
      },
      // {
      //   title: "Ngày giao hàng",
      //   dataIndex: "expected_DeliveryDate",
      //   key: "expected_DeliveryDate",
      //   ...this.getColumnSearchProps("expected_DeliveryDate"),
      // },
      // {
      //   title: "Giờ giao",
      //   dataIndex: "expected_DeliveryTime",
      //   key: "expected_DeliveryTime",
      //   ...this.getColumnSearchProps("expected_DeliveryTime"),
      // },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        // ...this.getColumnSearchProps("note"),
      },
      // {
      //     title: "Trạng thái",
      //     dataIndex: "status",
      //     key: "status",
      //     ...this.getColumnSearchProps("status"),
      //     render: (text) => {
      //         const txt = text === "INIT" ? "Khởi tạo"
      //             : text === "CONFIRMED" ? "Đã xác nhận đơn hàng"
      //                 : text === "DELIVERING" ? "Đang vận chuyển"
      //                     : text === "DELIVERED" ? "Đã giao"
      //                         : text === "COMPLETED" ? "Đã hoàn thành"
      //                             : text === "CANCELLED" ? "Đã bị hủy"
      //                                 : text
      //         return (
      //             <div>{txt}</div>
      //         )
      //     }
      // },
      // {
      //     title: "Cập nhật trạng thái",
      //     align: "center",
      //     key: "updateOrder",
      //     render: (order) => (
      //         <div>
      //             <Button
      //                 type="primary"
      //                 onClick={() => this.onChangeStatusOK(order.id, "CONFIRMED")}
      //             >
      //                 Đã nhận
      //       </Button>
      //             <Button
      //                 type="danger"
      //                 style={{ marginLeft: 5 }}
      //                 // onClick={() =>
      //                 //   this.onChangeStatusOK(order.id, "DELIVERING")
      //                 // }
      //                 data-toggle="modal"
      //                 data-target="#export-order-modal"
      //                 onClick={() => this.setState({ selectedOrderIDs: [order.id], selectedOrderInfor: [order] })}
      //             >
      //                 Vận chuyển
      //       </Button>
      //             <Button
      //                 type="danger"
      //                 style={{ marginLeft: 5 }}
      //                 onClick={() => this.onChangeStatusOK(order.id, "CANCELLED")}
      //             >
      //                 Hủy bỏ
      //       </Button>
      //             {/* <button
      //         className="btn btn-sm btn-primary"
      //         data-toggle="modal"
      //         data-target="#export-order-modal"
      //         style={{ backgroundColor: "#ED383C" }}
      //         onClick={() => this.setState({selectedOrderId: order.id})}
      //       >
      //         Export
      //       </button> */}
      //         </div>
      //     ),
      // },
      {
        title: "Mã giao hàng",
        dataIndex: "customerNameBoss",
        key: "customerNameBoss",
        ...this.getColumnSearchProps("customerNameBoss"),
        render: (text, record) => {
          return <div>
            <div className="form-group">
              <label>Mã giao hàng</label>
              <Select
                style={{ width: "100%" }}
                id="customerNameBoss"
                name="customerNameBoss"
                placeholder="Chọn mã giao hàng"
                onSelect={(record, event) => this.handleChangeListProvince(record, event)}
              >
                {this.state.listProvince.map((l, index) => {
                  console.log("Provinces", record)
                  return (
                    <Option key={record.id} value={l.id}>
                      {l.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>;
        },
      },
    ];

    const columns1 = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        render: (tags) => (
          <span>
            {tags.map((tag) => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "loser") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a>Invite {record.name}</a>
            <Divider type="vertical" />
            <a>Delete</a>
          </span>
        ),
      },
    ];

    const data1 = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
    ];

    return (
      <div className="modal fade" id="export-order-modal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Đơn Hàng: Xuất Bình - Bước 1 - Nhập File
              </h5>
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
                onSubmit={(event) => this.submitTextFile(event)}
              >
                <Tabs
                  defaultActiveKey="1"
                  type="card"
                  // Nếu không dùng props animated thì phải mở import file popupExportOrder.css ở trên
                  animated={true}
                >
                  <TabPane tab="Xem thông tin đơn hàng" key="1">
                    <Table
                      //title = {() => 'Here is title'}
                      bordered
                      columns={columns}
                      dataSource={this.props.selectedOrderInfor}
                      pagination={settingPagination}
                      // rowSelection={rowSelection}
                      expandedRowRender={(record, index) =>
                        this.expandedRowRender(record, index)
                      }
                    // dataSource={data1}
                    // expandedRowRender={(record, index) => this.expandedRowRender(record, index)}
                    // rowClassName={(record, index) => ((moment(record.deliveryDate, "DD/MM/YYYY - HH:MM:SS") - (new Date)) < ONE_DAY ? "red" : "blue")}
                    // rowSelection={rowSelection}
                    />
                  </TabPane>
                  <TabPane tab="Chọn bình" key="2">

                    <div className="card-body custom-scroll-table">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Hãy nhập tập tin từ đầu đọc</label>
                            <div style={{ display: "flex" }}>
                              <input
                                accept=".txt"
                                className="form-control"
                                type="file"
                                name="upload_file"
                                ref={(input) => {
                                  this.fileInput = input;
                                }}
                                onChange={(event) =>
                                  this.handleFileUpload(event)
                                }
                                validations={[required]}
                              />
                              <input
                                type="reset"
                                onClick={() => this.setState({ error: "" })}
                              />
                            </div>
                          </div>
                          {this.state.error !== "" ? (
                            <div>
                              <label style={{ color: "red" }}>
                                {this.state.error}
                              </label>
                            </div>
                          ) : null}
                        </div>
                        {!this.state.statusExisted && (
                          <div className="col-md-6" style={{ paddingTop: 35 }}>
                            {/* <button onClick={this.onAutoCreateCylinder}>Tự đông tạo</button> */}
                          </div>
                        )}
                        <table
                          className="table table-striped table-bordered seednet-table-keep-column-width"
                          cellSpacing="0"
                        >
                          <thead className="table__head">
                            <tr>
                              <th className="text-center w-70px align-middle">
                                #STT
                              </th>
                              {/*<th className="w-120px text-center align-middle">Id</th>*/}
                              <th className="w-120px text-center align-middle">
                                Mã bình
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {typeof this.state.listProducts !== "undefined" &&
                              this.state.listProducts.length > 0
                              ? this.state.listProducts.map((store, index) => {
                                // console.log("store", store);
                                return (
                                  <tr key={index}>
                                    <td scope="row" className="text-center">
                                      {index + 1}
                                    </td>
                                    {/*  <td scope="row" className="text-center">{store.id}</td>*/}
                                    <td scope="row" className="text-center">
                                      {store.serial}
                                    </td>
                                    {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                                    {/* <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.setState({content:store.description,user:store.user?store.user.name:'',cylinder:store.cylinder?store.cylinder.serial:''})}}>
                                                            <i className="ti-eye"></i></a>

                                                    </td>*/}
                                  </tr>
                                );
                              })
                              : null}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <footer className="card-footer text-center">
                      <button
                        disabled={
                          typeof this.state.listProducts === "undefined" ||
                          this.state.listProducts.length === 0
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          this.handleFileUpload(event, true);
                          const modal = $("#export-order-modal");
                          modal.modal("hide");
                        }}
                        type="submit"
                        data-toggle="modal"
                        data-target="#export-driver-order"
                      >
                        Tiếp tục
                      </button>
                      <button
                        onClick={(event) => this.handleFileUpload(event, true)}
                        className="btn btn-secondary"
                        type="reset"
                        data-dismiss="modal"
                        style={{ marginLeft: "10px" }}
                      >
                        Đóng
                      </button>
                    </footer>

                  </TabPane>

                </Tabs>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default (PopupExportOrder);
