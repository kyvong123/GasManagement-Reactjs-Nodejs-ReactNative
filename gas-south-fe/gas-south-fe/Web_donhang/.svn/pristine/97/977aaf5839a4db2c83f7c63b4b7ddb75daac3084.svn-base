import React, { Component } from "react";
import getHistoryImportAPI from "./../../../../api/getHistoryImportAPI";
import getCylinderByHistoryId from "getCylinderByHistoryId";
import './index.scss';
import {Icon} from 'antd';
import moment from "moment";
export default class DatailHistoryDataImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyImport: [],
      searchKeyValue: "",
      keyword:'',
  
    };
  }
  async getImportHistory() {
    let historyImport = await getHistoryImportAPI("to", 0);
    console.log("lich su import", historyImport)
    let sortHistoryImportDecs = [];
    console.log(historyImport);
    let n = 0;
    for (let m = historyImport.data.length - 1; m >= 0; m--) {
      sortHistoryImportDecs[n] = historyImport.data[m];
      n++;
    }

    this.setState({
      historyImport: sortHistoryImportDecs,
    });
  }
  onChangeKeyValue = (e) => {
    this.setState({
      searchKeyValue: e.target.value,
    });
  };
  onGiveKeyValue = () => {
     let {searchKeyValue}=this.state;
    this.setState({
      keyword:searchKeyValue
    })
  };
  componentDidMount() {
    this.getImportHistory();
    window.scrollTo(0, 0);
  }
  render() {
    let { historyImport,keyword } = this.state;
    if (keyword) {
      historyImport = historyImport.filter((data) => {
        return (
          moment(data.createdAt)
            .format("DD/MM/YYYY HH:mm")
            .toLowerCase()
            .indexOf(keyword) !== -1
        );
      });
    }
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">
            <strong>Lịch Sử</strong> Nhập Hàng
          </h5>
          <div class="input-group md-form form-sm form-2 pl-0">
            <input
              class="form-control my-0 py-1 amber-border"
              type="text"
              placeholder="Search"
              aria-label="Search"
              name="searchKeyValue"
              onChange={this.onChangeKeyValue}
            />
            <div class="input-group-append">
              <span
                class="input-group-text amber lighten-3"
                id="basic-text1"
                onClick={this.onGiveKeyValue}
              >
                <Icon type="search" />
              </span>
            </div>
          </div>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="">Nhập Từ</th>
              <th className="">Ngày Giờ</th>
              <th className="">Loại</th>
              <th className="">Số Lượng Bình</th>
              <th className="">Xuất Excel</th>
            </tr>
          </thead>
          <tbody>
            {historyImport.map((item) => {
              return (
                <tr>
                  <td className="text-muted">
                    {typeof item.from !== "undefined" && item.from !== null
                      ? item.from.name
                      : "Người Dân"}
                  </td>
                  <td className="text-muted">
                    {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="text-muted">
                    {item.type === "IMPORT"
                      ? "Nhập Hàng"
                      : item.type === "TURN_BACK"
                      ? "Nhập Hồi Lưu"
                      : ""}
                  </td>
                  <td className="text-success">{item.numberOfCylinder} bình</td>
                  <td className="text-muted">
                    <a
                      className="btn btn-primary"
                      style={{ color: "white" }}
                      download
                      onClick={async () => {
                        await getCylinderByHistoryId(
                          item.id,
                          "Nhap_Hang_" + item.id
                        );
                      }}
                      type="submit"
                    >
                      Tải
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
