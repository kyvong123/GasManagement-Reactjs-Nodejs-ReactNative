import React, { Component } from "react";
import getHistoryImportAPI from "./../../../../api/getHistoryImportAPI";
import getCylinderByHistoryId from "getCylinderByHistoryId";
import "./index.scss";
import { Icon } from "antd";
import moment from "moment";
export default class DetailDataExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyExport: [],
      searchKeyValue: "",
      keyword:'',
    };
  }
  async getImportHistory() {
    let historyExport = await getHistoryImportAPI("from", 0);
    let sortHistoryExportDecs = [];
    let n = 0;
    for (let m = historyExport.data.length - 1; m >= 0; m--) {
      sortHistoryExportDecs[n] = historyExport.data[m];
      n++;
    }

    this.setState({
      historyExport: sortHistoryExportDecs,
    });
    console.log("lich su export", historyExport);
  }
  componentDidMount() {
    this.getImportHistory();
    window.scrollTo(0, 0);
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
  render() {
    let { historyExport, keyword } = this.state;
    if (keyword) {
      historyExport = historyExport.filter((data) => {
        return (
          moment(data.createdAt)
            .format("DD/MM/YYYY HH:mm")
            .toLowerCase()
            .indexOf(keyword) !== -1
        );
      });
    }
    return (
      <div className="col-lg-12 col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">
              <strong>Lịch Sử</strong> Xuất Hàng
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
                <th className="">Ngày Giờ</th>
                <th className="">Loại</th>
                <th className="">Số Lượng Bình</th>
                <th className="">Xuất Excel</th>
              </tr>
            </thead>
            <tbody>
              {historyExport.map((item) => {
                let to_dest = "";
                if (typeof item.to !== "undefined" && item.to !== null) {
                  to_dest = item.to.name;
                } else {
                  if (
                    typeof item.toArray !== "undefined" &&
                    item.toArray !== null &&
                    item.toArray.length > 0
                  ) {
                    for (let i = 0; i < item.toArray.length; i++) {
                      to_dest +=
                        item.toArray[i].length > 0
                          ? item.toArray[i].name +
                            " " +
                            item.numberArray[i] +
                            " bình." +
                            `\n`
                          : "";
                      console.log("hahahah", to_dest);
                    }
                  } else {
                    if (
                      typeof item.customer !== "undefined" &&
                      item.customer !== null
                    ) {
                      to_dest = "Người Dân : " + item.customer.name;
                    }
                  }
                }

                return (
                  <tr>
                    {/*<td className="text-muted">{to_dest}</td>*/}
                    <td className="text-muted">
                      {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="text-muted">
                      {item.type === "EXPORT"
                        ? "Xuất Hàng"
                        : item.type === "SALE"
                        ? "Bán Hàng"
                        : ""}
                    </td>
                    <td className="text-success">
                      {item.numberOfCylinder} bình
                    </td>
                    <td className="text-muted">
                      <a
                        style={{ color: "white" }}
                        className="btn btn-success"
                        download
                        onClick={async () => {
                          await getCylinderByHistoryId(
                            item.id,
                            "Xuat_Hang_" + item.id
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
      </div>
    );
  }
}
