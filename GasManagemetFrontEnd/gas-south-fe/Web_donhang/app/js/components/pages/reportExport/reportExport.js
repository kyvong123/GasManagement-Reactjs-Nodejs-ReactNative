import { Button, Card, Col, DatePicker, Form, Row, Select, Table } from "antd";
import moment from "moment";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "./reportExport.scss";
import callApi from "./../../../util/apiCaller";
import getUserCookies from "getUserCookies";
import showToast from "showToast";
import { EXPORT_WAREHOUSE } from "../../../config/config";
import { data } from "jquery";
import getAllWareHouseAPI from "../../../../api/getAllWareHouseAPI";

class reportExport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataWareHouse: [],
      isLoading: false,
      startDate: "",
      endDate: "",
      ListTurnBackBeginNowDay: [],
      ListTurnBackBeginOldDay: [],
      listWareHouse: [],
      object: {
        wareHouseOption: "empty",
      },
    };
  }

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
  };

  filterData = (dates, dateStrings) => {
    const { ListTurnBackBeginOldDay } = this.state;
    let startDate = dates[0] ? moment(dates[0]).toDate() : "";
    let endDate = dates[1] ? moment(dates[1]).toDate() : "";
    if (startDate && endDate) {
      console.log("startDate && endDate", ListTurnBackBeginOldDay);
      let data = ListTurnBackBeginOldDay;
      let tempData = data.filter((order) => {
        // console.log("tartDate && endDate",Date.parse((endDate)));
        // console.log("tartDate && endDate",Date.parse((moment(order.createdAt))));
        return (
          Date.parse(startDate) <= Date.parse(moment(order.date)) &&
          Date.parse(moment(order.date)) <= Date.parse(endDate)
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
  };

  getDataWareHouse = async () => {
    if (this.state.startDate === "" || this.state.endDate === "") {
      showToast("Vui lòng nhập ngày bắt đầu hoặc ngày kết thúc");
    } else {
      let user_cookies = await getUserCookies();
      let token = "Bearer " + user_cookies.token;
      let params = {
        fromDate: this.state.startDate,
        toDate: this.state.endDate,
      };

      await callApi("POST", EXPORT_WAREHOUSE, params, token)
        .then((res) => {
          console.log("DATA", res.data);
          this.setState({ isLoading: true });
          if (res.data.WareHouseName === []) {
            this.setState({
              dataWareHouse: [{ tdk: 0, sln: 0, slx: 0, tck: 0 }],
              isLoading: false,
            });
          } else {

            // Phát --- Xem báo cáo theo từng kho ---
            let temp = [];
            res.data.WareHouseName.map((item, index) => {
              if (this.state.object.wareHouseOption === "empty") {
                temp.push({
                  key: index + 1,
                  name: item,
                  tdk: res.data.BeforeImport[index],
                  sln: res.data.Import[index],
                  slx: res.data.Export[index],
                  tck: res.data.AfterImportExport[index]
                })
              }
              if (this.state.object.wareHouseOption === item) {
                temp.push({
                  key: index + 1,
                  name: item,
                  tdk: res.data.BeforeImport[index],
                  sln: res.data.Import[index],
                  slx: res.data.Export[index],
                  tck: res.data.AfterImportExport[index],
                })
              }
            });
            this.setState({ dataWareHouse: temp, isLoading: false });
            // Phát --- Xem báo cáo theo từng kho ---

            // const temp = res.data.WareHouseName.map((item, index) => {
            //     return {
            //       key: index + 1,
            //       name: item,
            //       tdk: res.data.BeforeImport[index],
            //       sln: res.data.Import[index],
            //       slx: res.data.Export[index],
            //       tck: res.data.AfterImportExport[index],
            //     };
            // });
            // console.log("temp",temp)
            // this.setState({ dataWareHouse: temp, isLoading: false });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // Phát --- Xem báo cáo theo từng kho ---
  async getAllWareHouseAPI() {
    this.setState({ isLoading: true });
    const listWareHouse = await getAllWareHouseAPI();
    if (listWareHouse) {
      if (listWareHouse.data.status === true) {
        this.setState({
          listWareHouse: listWareHouse.data.WareHouse,
          isLoading: false,
        });
      } else {
        this.setState({ isLoading: false });
        showToast(
          listWareHouse.data.message
            ? listWareHouse.data.message
            : listWareHouse.data.err_msg
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
      this.setState({ isLoading: false });
    }
  }

  OnChangeOption = (value) => {
    this.setState((prevState) => ({
      object: { ...prevState.object, wareHouseOption: value },
    }));
  };

  // Phát --- Xem báo cáo theo từng kho ---

  async componentDidMount() {
    await this.getAllWareHouseAPI();
    //await this.getDataWareHouse();
  }

  render() {
    const { RangePicker } = DatePicker;
    const { Option } = Select;

    const column = [
      {
        title: "STT",
        dataIndex: "key",
        key: "1",
      },
      {
        title: "Kho",
        dataIndex: "name",
        key: "2",
      },
      {
        title: "Tồn đầu kỳ (tấn)",
        dataIndex: "tdk",
        key: "3",
      },
      {
        title: "Số lượng nhập",
        dataIndex: "sln",
        key: "4",
      },
      {
        title: "Số lượng xuất",
        dataIndex: "slx",
        key: "5",
      },
      {
        title: "Tồn cuối kỳ",
        dataIndex: "tck",
        key: "6",
      },
    ];
    //tdk: Tồn đầu kỳ, sln: Số lượng nhập, slx: Số lượng xuất, tck: Tồn cuối kỳ
    const total = this.state.dataWareHouse.reduce(
      (total, { tdk, sln, slx, tck }) => {
        total.ttdk += tdk;
        total.tsln += sln;
        total.tslx += slx;
        total.ttck += tck;
        return total;
      },
      {
        ttdk: 0,
        tsln: 0,
        tslx: 0,
        ttck: 0,
      }
    );
    console.log("ngày bắt đầu", this.state.startDate);
    console.log("ngày kết thúc", this.state.endDate);
    console.log("Kho", this.state.object.wareHouseOption);
    console.log("data", this.state.dataWareHouse);
    const data = this.state.dataWareHouse;

    return (
      <div id="reportExport">
        <div className="card-title">
          <Row style={{ marginTop: 20 }}>
            {/* <Col xs={1}></Col> */}
            <Col xs={22}>
              <h4>Báo cáo xuất/nhập/tồn</h4>
            </Col>
            <Col xs={1}></Col>
          </Row>
        </div>
        <div className="main-title">
          <div className="content">
            <h6>Xem dữ liệu theo</h6>
          </div>
          <Row>
            <Col xs={1}></Col>
            <Col xs={22}>
              <Form layout="inline" style={{ marginBottom: 15 }}>
                <Form.Item>
                  <RangePicker
                    ranges={{
                      "Hôm nay": [
                        moment().startOf("day"),
                        moment().endOf("day"),
                      ],
                      "Tháng hiện tại": [
                        moment().startOf("month"),
                        moment().endOf("month"),
                      ],
                    }}
                    format="DD/MM/YYYY"
                    onChange={this.onChangeTime}
                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={1}></Col>
          </Row>
          <div className="select">
            <Select
              name="wareHouseOption"
              style={{ width: "200px" }}
              className="ml-2"
              onChange={this.OnChangeOption}
              value={this.state.object.wareHouseOption}
            >
              <Option value="empty">Kho quản lý</Option>
              {this.state.listWareHouse.map((option) => (
                <Option key={option.id} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>

            {/* <Select
              style={{ width: "200px" }}
              className="ml-2"
              defaultValue="Nhà sản xuất"
            >
              <Option value="Nhà sản xuất">Nhà sản xuất</Option>
            </Select> */}

            <Button
              type="submit"
              className="buttonStyle"
              onClick={this.getDataWareHouse}
            >
              Xem báo cáo
            </Button>
          </div>
        </div>

        <div className="row-col-card">
          <Row gutter={16}>
            <Col lg={12} xs={12}>
              <Card>
                <div className="card-content-report">
                  <i
                    class="fa fa-cubes"
                    aria-hidden="true"
                    style={{ fontSize: "60px", color: "#7FFF00" }}
                    theme="outlined"
                  ></i>
                  <div className="card-text">
                    <div className="number">{total.ttdk}</div>
                    <h6>Tồn đầu kỳ</h6>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={12} xs={12}>
              <Card>
                <div className="card-content-report">
                  <i
                    class="fa fa-arrow-circle-up"
                    aria-hidden="true"
                    style={{ fontSize: "60px", color: "#40E0D0" }}
                    theme="outlined"
                  ></i>
                  <div className="card-text">
                    <div className="number">{total.tsln}</div>
                    <h6>SL Nhập</h6>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={12} xs={12} className="mt-2">
              <Card>
                <div className="card-content-report">
                  <i
                    class="fa fa-arrow-circle-down"
                    aria-hidden="true"
                    style={{ fontSize: "60px", color: "#FF8C00" }}
                    theme="outlined"
                  ></i>
                  <div className="card-text">
                    <div className="number">{total.tslx}</div>
                    <h6>SL Xuất</h6>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg={12} xs={12} className="mt-2">
              <Card>
                <div className="card-content-report">
                  <i
                    class="fa fa-cube"
                    aria-hidden="true"
                    style={{ fontSize: "60px", color: "#F00000" }}
                    theme="outlined"
                  ></i>
                  <div className="card-text">
                    <div className="number">{total.ttck}</div>
                    <h6>Tồn cuối kỳ</h6>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          <div className="table-responsive-xl">
            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
              <div className="row">
                <div className="col-sm-12">
                  <Table
                    className="TablereportExport"
                    loading={this.state.isLoading}
                    dataSource={data}
                    columns={column}
                    pagination={{ defaultPageSize: 5 }}
                  />
                </div>
                {/* table xuat excel */}
                <div className="table">
                  <table id="table" style={{ display: "none" }}>
                    <tr>
                      {column.map((item) => {
                        return <th>{item.title}</th>;
                      })}
                    </tr>
                    {data.length !== 0
                      ? data.map((item) => {
                        return (
                          <tr>
                            <td>{item.key}</td>
                            <td>{item.name}</td>
                            <td>{item.tdk}</td>
                            <td>{item.sln}</td>
                            <td>{item.slx}</td>
                            <td>{item.tck}</td>
                          </tr>
                        );
                      })
                      : ""}
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="export">
            <div className="Excel">
              <Form.Item>
                <ReactHTMLTableToExcel
                  id="TablereportExport"
                  className="btn btn-success"
                  table="table"
                  filename="Bao_cao_xuat_nhap_ton"
                  sheet="Bao_cao_xuat_nhap_ton"
                  buttonText="Xuất Excel"
                />
              </Form.Item>
            </div>
            <Button type="submit" className="buttonStyleIn">
              In Báo Cáo
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default reportExport;
