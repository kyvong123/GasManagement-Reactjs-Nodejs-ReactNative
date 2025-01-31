import React from "react";
import PropType from "prop-types";
import getAllCylinderAPI from "getAllCylinderAPI";
import getAllUserApi from "getAllUserApi";

import showToast from "showToast";
import Constants from "Constants";
import getAllReportNewAPI from "getAllReportNewAPI";
import AddReportPopupContainer from "./AddReportPopupContainer";
import ViewReportPopup from "./ViewReportPopup";
class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProducts: [],
      dataReports: [],
    };
  }
  refresh() {
    this.forceUpdate(() => {
      this.getAllReports();
    });
  }

  async getAllReports() {
    const dataReports = await getAllReportNewAPI();
    if (dataReports) {
      if (dataReports.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ dataReports: dataReports.data });
      } else {
      }

      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  async getAllCylenders() {
    const dataProducts = await getAllCylinderAPI();
    if (dataProducts) {
      if (dataProducts.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({ dataProducts: dataProducts.data });
      } else {
      }
      //this.setState({image_link: profile.data.company_logo});
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    }
  }
  async componentDidMount() {
    //const jobMetaData = await this.getJobMetaData();
    this.getAllReports();
    this.getAllCylenders();
  }

  render() {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-title">
            <div className="flexbox">
              <h4>Phản Hồi</h4>
              
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive-xl">
              <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      className="table table-striped table-bordered seednet-table-keep-column-width"
                      cellSpacing="0"
                    >
                      <thead className="table__head">
                        <tr>
                          <th className="text-center w-70px align-middle">#STT</th>
                          <th className="w-120px text-center align-middle">Người Phản Hồi</th>
                          <th className="w-70px text-center align-middle">Bình gas</th>
                          <th className="w-70px text-center align-middle">Nội dung</th>
                          <th className="w-100px text-center align-middle">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.dataReports.map((store, index) => {
                          return (
                            <tr key={index}>
                              <td scope="row" className="text-center">
                                {index + 1}
                              </td>

                              <td scope="row" className="text-center">
                                {store.user ? store.user.name : ""}
                              </td>
                              <td scope="row" className="text-center">
                                {store.cylinder ? store.cylinder.serial : ""}
                              </td>
                              <td scope="row" className="text-center">
                                {store.description}
                              </td>
                              <td className="text-center table-actions">
                                <a
                                  className="table-action hover-primary"
                                  data-toggle="modal"
                                  data-target="#view-report"
                                  onClick={() => {
                                    this.setState({
                                      content: store.description,
                                      user: store.user ? store.user.name : "",
                                      cylinder: store.cylinder
                                        ? store.cylinder.serial
                                        : "",
                                    });
                                  }}
                                >
                                  <i className="ti-eye"></i>
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddReportPopupContainer
          listProducts={this.state.dataProducts}
          refresh={this.refresh.bind(this)}
        />
        <ViewReportPopup
          content={this.state.content}
          user={this.state.user}
          cylinder={this.state.cylinder}
        />
      </div>
    );
  }
}

export default Report;
