import React, { Component, Fragment } from "react";
import "./DashBoard.scss";
import "./Header.scss";
import "antd/dist/antd.css";

import ExcelTable from "./ExcelTable";

//libary
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { DatePicker, Space } from "antd";

//api
import orderManagement from "../../../../api/orderManagementApi";
import getAreaByStationId from "../../../../api/getAreaByStationId";
import getUserCookies from "../../../helpers/getUserCookies";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  div: {
    textAlign: "left"
  }
}));
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeCustomer: [],
      station: [],
      customers: [],
      data: [],
      valueStation: "",
      valueArea: "",
      valueCustomerType: "",
      valueCustomer: "",
      userType: "",
      userRole: "",

      index: 2,
      isActive: true,

      dateStart: moment().startOf("months"),
      dateEnd: moment().endOf("months"),
    };
  }
  dateFormat = "DD/MM/YYYY";

  handleClickFilter = (index) => {
    if (index === this.state.index && this.state.isActive) {
      this.setState({
        index: null,
        isActive: false,
      });
    } else {
      this.setState({
        index: index,
        isActive: true,
      });
    }

    if (index === 0) {
      if (!this.state.isActive) {
        this.setState({
          dateStart: moment()
            .format()
            .slice(0, 10),
          dateEnd: moment().add(1, "days"),
        });
      }
    }
    if (index === 1) {
      if (this.state.isActive) {
        this.setState({
          dateStart: moment()
            .startOf("isoWeeks")
            .format()
            .slice(0, 10),
          dateEnd: moment().endOf("isoWeeks"),
        });
      }
    }
    if (index === 2) {
      if (this.state.isActive) {
        this.setState({
          dateStart: moment()
            .startOf("months")
            .format()
            .slice(0, 10),
          dateEnd: moment().endOf("months"),
        });
      }
    }
    if (index === 0) {
      if (this.state.isActive) {
        this.setState({
          dateStart: moment()
            .format()
            .slice(0, 10),
          dateEnd: moment().add(1, "days"),
        });
      }
    }
    if (index === 3) {
      if (this.state.isActive) {
        this.setState({
          dateStart: moment()
            .add(-1, "months")
            .startOf("months")
            .format()
            .slice(0, 10),
          dateEnd: moment()
            .add(-1, "months")
            .endOf("months"),
        });
      }
    }
  };
  handleChangeDateStart = (e) => {
    let dateEnd = moment(e)
      .endOf("months")
      .format()
      .slice(0, 10);
    this.setState({
      dateStart: e,
      dateEnd: dateEnd,
    });
  };
  handleChangeDateEnd = (e) => {
    this.setState({
      dateEnd: e,
    });
  };
  handleStation = (e) => {
    this.setState({
      valueStation: e,
    });
    if (e === "") {
      this.setState({
        valueArea: "",
      });
    }
  };
  handleArea = (e) => {
    this.setState({
      valueArea: e,
    });
  };
  handleCustomerType = (e) => {
    this.setState({
      valueCustomerType: e,
    });
  };
  handleCustomer = (e) => {
    this.setState({
      valueCustomer: e,
    });
  };
  getStation = async () => {
    try {
      let res = await orderManagement.getStation();
      if (res && res.data) {
        this.setState({
          station: res.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  getArea = async (e) => {
    try {
      let res = await getAreaByStationId(e);
      if (res && res.data) {
        this.setState({
          area: res.data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  async componentDidMount() {
    const user = await getUserCookies();
    if (user) {
      const role = user.user.userRole;
      const type = user.user.userType;

      this.state.userRole = role;
      this.state.userType = type;

      if (type === "Tram") {
        this.state.valueStation = user.user.isChildOf;
      }
    }
    this.getStation();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.valueStation !== prevState.valueStation) {
      this.getArea(this.state.valueStation);
    }
    if (
      this.state.dateEnd !== prevState.dateEnd ||
      this.state.valueArea !== prevState.valueArea ||
      this.state.valueCustomerType !== prevState.valueCustomerType ||
      this.state.valueStation !== prevState.valueStation
    ) {
    }
    if (
      this.state.valueCustomerType !== prevState.valueCustomerType ||
      this.state.valueStation !== prevState.valueStation
    ) {
      if (
        this.state.valueStation !== "" &&
        this.state.valueCustomerType !== ""
      ) {
        const res = await orderManagement.getTypeCustomer({
          isChildOf: this.state.valueStation,
          customerType: this.state.valueCustomerType,
        });
        if (res.success && res.data) {
          this.setState({ customers: res.data });
        }
      }
    }
  }

  render() {
    let { station, area, userType } = this.state;

    return (
      <div className="dashboard">
        <div className="content">
          <div className="header-content container">
            <div className="filter-group">
              <div className="header">
                <div className="btn-group container">
                  <div className="row align-center justify-content-md-start">
                    <button
                      onClick={() => this.handleClickFilter(0)}
                      className={`btn-item col ${
                        this.state.index === 0 && this.state.isActive
                          ? "active"
                          : null
                      }`}
                    >
                      <span>Hôm nay</span>
                    </button>
                    <button
                      onClick={() => this.handleClickFilter(1)}
                      className={`btn-item col ${
                        this.state.index === 1 && this.state.isActive
                          ? "active"
                          : null
                      }`}
                    >
                      <span>Tuần này</span>
                    </button>
                    <button
                      onClick={() => this.handleClickFilter(2)}
                      className={`btn-item col ${
                        this.state.index === 2 && this.state.isActive
                          ? "active"
                          : null
                      }`}
                    >
                      <span>Tháng này</span>
                    </button>
                    <button
                      onClick={() => this.handleClickFilter(3)}
                      className={`btn-item col ${
                        this.state.index === 3 && this.state.isActive
                          ? "active"
                          : null
                      }`}
                    >
                      <span>Tháng trước</span>
                    </button>
                    <div className="date-picker col-6">
                      <form className={useStyles.container} noValidate>
                        <div className={useStyles.div}>Ngày báo cáo</div>
                        <DatePicker
                          value={this.state.dateEnd}
                          onChange={(e) => {
                            this.handleChangeDateEnd(e);
                          }}
                        />
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Ngày báo cáo"
                            value={this.state.dateEnd}
                            onChange={(e) => {
                              this.handleChangeDateEnd(e);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tram_container container">
                <div className="tram_content">
                  {userType !== "Tram" ? (
                    <Fragment>
                      <div className="item col-2">
                        <label>Trạm</label>
                        <select
                          onChange={(e) => this.handleStation(e.target.value)}
                        >
                          <option value="">Tất cả</option>
                          {station &&
                            station.length > 0 &&
                            station.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="item col-2">
                        <label>Vùng</label>
                        <select
                          onChange={(e) => this.handleArea(e.target.value)}
                        >
                          <option value="">Tất cả</option>
                          {area &&
                            area.length > 0 &&
                            area.map((item, i) => (
                              <option key={i} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </Fragment>
                  ) : null}
                  <div className="item col-2">
                    <label>Loại KH</label>
                    <select
                      onChange={(e) => this.handleCustomerType(e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="Industry">
                        Khách hàng công nghiệp bình
                      </option>
                      <option value="Distribution">Tổng đại lý</option>
                      <option value="Agency">Đại lý</option>
                    </select>
                  </div>
                  <div className="item col-2">
                    <label>Khách hàng</label>
                    <select
                      onChange={(e) => this.handleCustomer(e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      {
                        this.state.customers.map((item, index) => (<option key={index} value={item.id}>{item.name}</option>))
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() =>
                  document.getElementById("test-table-xls-button").click()
                }
                className="btn btn-success"
              >
                <div>
                  <img
                    className="image"
                    src="../../../../icon/excel.png"
                    alt=""
                  />
                  <span>Xuất Excel</span>
                </div>
              </button>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                table="table-to-xls"
                filename="tablexls"
                sheet="tablexls"
              />
            </div>
          </div>
          <div className="data-excel mb-30">
            <ExcelTable
              station={this.state.valueStation}
              area={this.state.valueArea}
              customerType={this.state.valueCustomerType}
              customer={this.state.valueCustomer}
              dateStart={this.state.dateStart}
              dateEnd={this.state.dateEnd}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DashBoard;
