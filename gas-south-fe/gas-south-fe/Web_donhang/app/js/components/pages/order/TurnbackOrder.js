
import React, { Component } from 'react';
import { Button, Table, Tooltip, Row, Col, Form, Switch, DatePicker } from "antd";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import getUserCookies from "getUserCookies";
import getDestinationUserAPI from "getDestinationUserAPI";
import Constants from "Constants";
//import ReactToPrint from 'react-to-print';
//import ImportPrinterTurnback from "./importPrinterTurnback";
import getDataAction from '../../../../api/getDataAction';
import getTurnbacktDataPrint from '../../../../api/getTurnbacktDataPrint';
const { RangePicker } = DatePicker;
class TurnbackOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: "default",
      exportDataPrint: [],
      dataGetAction: [],
      listBrand: [],
      customerId: "",
      TurnBackDataPrint: [],
      editingKey: "",
      text: "AAA",
      ListTurnBackBeginNowDay: [],
      ListTurnBackBeginOldDay: [],
      listAllDriveShipBeginOldDayBegin: [],
      enableFilter: false,
      statusTime: false,
      startDate: "",
      endDate: "",
    }
  }
  async componentDidMount() {

    let listIdWareHouse = await this.getListFixer();
    console.log("listIdWareHouse", listIdWareHouse);
    // await this.getDataPrint();

  }
  async getListFixer() {
    var user_cookies = await getUserCookies();
    let actionType = "TURN_BACK";
    let endDate = "";
    let startDate = "";
    let page = 1;
    let limit = 10;
    let ListTurnBack = [];
    const dataUsers = await getDestinationUserAPI(
      "",
      "",
      Constants.OWNER
    );
    //console.log("dataUsers", dataUsers.data);
    for (let i = 0; i < dataUsers.data.length; i++) {
     console.log("dataUsers", dataUsers.data[i].id);
      if (dataUsers.data[i].id) {
        let targets = dataUsers.data[i].id;
        let data = await getDataAction(
          targets,
          actionType,
          page,
          limit,
          startDate,
          endDate,

        );
        let key = 1;
        data.data.data.map((item, index) => {
          console.log("item", item)
          ListTurnBack.push(
            {
              date: item.date,
              idTurnback: item.idTurnback,
              nameAgency: item.nameAgency,
              nameCustomer: item.nameCustomer,
              nameWarehouse: item.nameWarehouse,
              numberCylinder: item.numberCylinder,
            }
          );
        })

      }
    }
    let key = 1;
    let ListTurnBackBegin = [];
    ListTurnBack.map((item, index) => {
      ListTurnBackBegin.push(
        {
          key: key++,
          date: item.date,
          idTurnback: item.idTurnback,
          nameAgency: item.nameAgency,
          nameCustomer: item.nameCustomer,
          nameWarehouse: item.nameWarehouse,
          numberCylinder: item.numberCylinder,
        }
      );
    })
    console.log("ListTurnBack", ListTurnBackBegin);
    let ListTurnBackBeginNowDay = [];
    let ListTurnBackBeginOldDay = [];
    ListTurnBackBegin.map((item, index) => {
      console.log("item[index]", Date.parse((item.date)));
      let createdAtDate = item.date;
      let endDay = new Date().setHours(23, 59, 59, 999);
      let start = new Date().setHours(0, 0, 0, 0);
      if (Date.parse((createdAtDate)) >= start) {
        ListTurnBackBeginNowDay.push(item);
      } else if (Date.parse((createdAtDate)) < start) {
        ListTurnBackBeginOldDay.push(item);
      }

    })
    this.setState({
      ListTurnBack: ListTurnBackBegin,
      ListTurnBackBeginOldDay: ListTurnBackBeginOldDay,
      ListTurnBackBeginNowDay: ListTurnBackBeginNowDay
    })
  }
  getDataPrint = async (record, key) => {
    console.log('record', record)

    const result = await getTurnbacktDataPrint(record.
      idTurnback);
    console.log('result', result.data.data)
    if (result.status === 200) {
      this.setState({
        // enablePrint: true,
        editingKey: key,
        TurnBackDataPrint: result.data.data,
      });
    }


  };
  handleDataChange = enableFilter => {
    this.setState({ enableFilter });
    if (this.state.enableFilter === false) {
      this.setState(
        {
          statusTime: false
        }
      )
    }
  };
  isEditing = (record) => record.key === this.state.editingKey;
  onChangeTime = (dates, dateStrings) => {
    // console.log("dates",dates);
    // console.log("dates",dateStrings);
    this.setState(
      {
        startDate: dates[0] ? moment(dates[0]).toDate() : "",
        endDate: dates[0] ? moment(dates[1]).toDate() : "",
      },
      this.filterData(dates, dateStrings)
    );
  }
  filterData = (dates, dateStrings) => {
    const { ListTurnBackBeginOldDay } = this.state;
    let startDate = dates[0] ? moment(dates[0]).toDate() : "";
    let endDate = dates[1] ? moment(dates[1]).toDate() : "";
    if (startDate && endDate) {
      console.log('startDate && endDate', ListTurnBackBeginOldDay);
      let data = ListTurnBackBeginOldDay;
      let tempData = data.filter((order) => {
        // console.log("tartDate && endDate",Date.parse((endDate)));
        // console.log("tartDate && endDate",Date.parse((moment(order.createdAt))));
        return (
          Date.parse((startDate)) <= Date.parse((moment(order.date))) &&
          Date.parse((moment(order.date))) <= Date.parse((endDate))

        );
      });
      this.setState({
        listAllDriveShipBeginOldDayBegin: tempData,
        numberPagesOldBegin: Math.ceil(
          tempData.length / this.state.itemsPerPages
        ),
        statusTime: true,
      });
      console.log("tempData", tempData);
    }
  }

  render() {
    const { size, ListTurnBack, enableFilter, ListTurnBackBeginNowDay, ListTurnBackBeginOldDay, statusTime, listAllDriveShipBeginOldDayBegin
      // enablePrint
    } = this.state;
    const defaultPageSize = {
      defaultPageSize: 10,
    };
    const columns = [
      {
        title: "STT",
        dataIndex: "key",
        key: "key",
        // ...this.getColumnSearchProps("nameWarehouse"),
        // fixed: 'left',
        // width: 125
      },
      {
        title: "Tên kho nhập",
        dataIndex: "nameWarehouse",
        key: "nameWarehouse",
        // ...this.getColumnSearchProps("nameWarehouse"),
        // fixed: 'left',
        // width: 125
      },
      {
        title: "Ngày hồi lưu",
        dataIndex: "date",
        key: "date",
        // ...this.getColumnSearchProps("createdAt"),
        sortDirections: ["descend", "ascend"],
        sorter: (a, b) => {
          return moment(a.date) - moment(b.date);
        },
        render: (text) => {
          return <div>{moment(text).format("DD/MM/YYYY - HH:mm")}</div>;
        },
      },
      {
        title: "Tên khách hàng",
        dataIndex: "nameCustomer",
        key: "nameCustomer",
        // ...this.getColumnSearchProps("customerId"),
      },
      {
        title: "Tên chi nhánh",
        dataIndex: "nameAgency",
        key: "nameAgency",
        // ...this.getColumnSearchProps("agencyId"),
      },
      {
        title: "Số lượng",
        dataIndex: "numberCylinder",
        key: "numberCylinder",
        // ...this.getColumnSearchProps("warehouseId"),
      },
      {
        title: "Thao tác",
        key: "operation",
        width: 150,
        align: "center",
        fixed: "right",
        render: (record, index) => {
          const editable = this.isEditing(record);
          return (
            <div title="">
              {editable ? (
                <Tooltip title="PRINT">
                  <ReactToPrint
                    style={{ marginLeft: 5 }}
                    copyStyles={true}
                    // onBeforeGetContent={this.handleOnBeforeGetContent}
                    trigger={() => <Button type="primary" icon="printer" />}
                    content={() => this.componentRef}
                  />
                </Tooltip>

              ) : (
                  "")}
              {!editable ? (
                <Tooltip title="DOWNLOAD">
                  <Button
                    type="primary"
                    style={{ marginRight: 5 }}
                    onClick={() =>
                      this.getDataPrint(record, record.key)
                    }
                    icon="download"
                  />
                </Tooltip>
              ) : (
                  "")}

            </div>
          )
        }
      }
    ]
    return (
      <div >
        <Row style={{ marginTop: 20 }}>
          <Col xs={1}></Col>
          <Col xs={22}>
            <h4>Danh Sách Hồi Lưu</h4>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={12}>
            <Form.Item label='Bộ lọc'>
              <Switch checked={enableFilter} onChange={this.handleDataChange} />
            </Form.Item>
          </Col>
          <Col xs={10}>
            {enableFilter === true && (
              <RangePicker
                ranges={{
                  "Hôm nay": [moment().startOf("day"), moment().endOf("day")],
                  "Tháng hiện tại": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                }}
                showTime={{
                  format: "HH:mm",
                  defaultValue: [
                    moment("07:00", "HH:mm"),
                    moment("22:00", "HH:mm"),
                  ],
                }}
                format="DD/MM/YYYY HH:mm"
                onChange={this.onChangeTime}
              />
            )}
          </Col>
          <Col xs={1}></Col>

          {/*  */}
        </Row>
        <Row>
          <Table
            //className="components-table-demo-nested"
            scroll={{ x: 1500, y: 420 }}
            // loading={isLoading}
            bordered={true}
            size={size}
            columns={columns.map((col) => {
              return {
                ...col,
                onCell: (record) => ({
                  key: record.idTurnback,
                  dataIndex: col.dataIndex,
                  title: col.title,
                }),
              };
            })}
            dataSource={enableFilter === false && statusTime === false ? ListTurnBackBeginNowDay
              :
              enableFilter === true && statusTime === true ? listAllDriveShipBeginOldDayBegin
                :
                ListTurnBackBeginOldDay
              // enableFilter ? this.state.listOrderOld : this.state.listOrderNow
            }
            pagination={defaultPageSize}
          // expandedRowRender={(record, index) =>
          //   this.expandedRowRender(record, index)
          // }
          // onRow={(record, index) => (
          // //     console.log('record, index', record, index)
          //     // this.setState('')
          //   )}
          />
          {/* <ImportPrinterTurnback
          ref={(el) => (this.componentRef = el)}
          dataPrint={this.state.TurnBackDataPrint}
          text={this.state.text}
          /> */}
        </Row>

      </div>

    );
  }

}
export default (TurnbackOrder);