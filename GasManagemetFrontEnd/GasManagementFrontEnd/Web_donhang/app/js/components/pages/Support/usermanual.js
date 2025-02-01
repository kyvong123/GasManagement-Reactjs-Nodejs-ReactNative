import React from "react";
import "./Support.scss";
import PDFViewers from "pdf-viewer-reactjs";
import getUserCookies from "./../../../helpers/getUserCookies";
// import axios from 'axios'
// import fileDownload from 'js-file-download';

class usermanual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userRole: "",
      userType: "",
    };
    // this.handleExportUserManual = this.handleExportUserManual.bind(this)
  }

  // async handleExportUserManual (url, filename){
  //      this.setState({loading:true})
  //    await axios.get(url, {
  //         responseType: 'blob',
  //       })
  //       .then((res) => {
  //         fileDownload(res.data, filename)
  //       })

  // }
  async componentDidMount() {
    let user_cookies = await getUserCookies();
    if (user_cookies) {
      this.setState({
        userRole: user_cookies.user.userRole,
        userType: user_cookies.user.userType,
      });
    }
  }

  render() {
    return (
      <div className="main-content" id="usermanuall">
        <div className="card">
          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Factory" && (
              <div className="card-title">
                <div className="flexbox">
                  <h4>Hướng dẫn sử dụng</h4>
                  <div className="row">
                    <button
                      // onClick={()=>this.handleExportUserManual('https://arxiv.org/pdf/quant-ph/0410100.pdf','huong-dan.pdf')}
                      style={{ marginLeft: "20px" }}
                      className="btn btn-sm btn-create"
                    >
                      <a href="./../../../../assets/data/HDSD-update.pdf" download>
                        {" "}
                        Tải file tại đây{" "}
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            )}

          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "General" && (
              <div className="card-title">
                <div className="flexbox">
                  <h4>Hướng dẫn sử dụng</h4>
                  <div className="row">
                    <button
                      // onClick={()=>this.handleExportUserManual('https://arxiv.org/pdf/quant-ph/0410100.pdf','huong-dan.pdf')}
                      style={{ marginLeft: "20px" }}
                      className="btn btn-sm btn-create"
                    >
                      <a href="./../../../../assets/data/TONG-DAI-LY.pdf" download>
                        {" "}
                        Tải file tại đây{" "}
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            )}

          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Agency" && (
              <div className="card-title">
                <div className="flexbox">
                  <h4>Hướng dẫn sử dụng</h4>
                  <div className="row">
                    <button
                      // onClick={()=>this.handleExportUserManual('https://arxiv.org/pdf/quant-ph/0410100.pdf','huong-dan.pdf')}
                      style={{ marginLeft: "20px" }}
                      className="btn btn-sm btn-create"
                    >
                      <a href="./../../../../assets/data/CUA-HANG-BAN-LE.pdf" download>
                        {" "}
                        Tải file tại đây{" "}
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            )}

          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Fixer" && (
              <div className="card-title">
                <div className="flexbox">
                  <h4>Hướng dẫn sử dụng</h4>
                  <div className="row">
                    <button
                      // onClick={()=>this.handleExportUserManual('https://arxiv.org/pdf/quant-ph/0410100.pdf','huong-dan.pdf')}
                      style={{ marginLeft: "20px" }}
                      className="btn btn-sm btn-create"
                    >
                      <a href="./../../../../assets/data/CHI-NHANH-BK.pdf" download>
                        {" "}
                        Tải file tại đây{" "}
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            )}

          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Region" && (
              <div className="card-title">
                <div className="flexbox">
                  <h4>Hướng dẫn sử dụng</h4>
                  <div className="row">
                    <button
                      // onClick={()=>this.handleExportUserManual('https://arxiv.org/pdf/quant-ph/0410100.pdf','huong-dan.pdf')}
                      style={{ marginLeft: "20px" }}
                      className="btn btn-sm btn-create"
                    >
                      <a href="./../../../../assets/data/CHI-NHANH-KHAC.pdf" download>
                        {" "}
                        Tải file tại đây{" "}
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            )}

          {this.state.userRole === "Owner" &&
            this.state.userType === "Factory" && (
              <div className="dd">
                <div className="flexbox">
                  <h2>Hướng dẫn sử dụng</h2>
                </div>
                <div className="d">
                  <div className="row">
                    <div className="col-md-4 col-xm-12 col-sm-12 col-lg-4">
                      {" "}
                      <h4>Hướng dẫn sử dụng đầu đọc</h4>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create"
                      >
                        <a
                          href="./../../../../assets/data/HDSD-DAU-DOC-update.pdf"
                          download
                        >
                          Tải file{" "}
                        </a>
                      </button>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create n"
                      >
                        <a
                          target="blank"
                          href="https://www.youtube.com/playlist?list=PLZp1b96OudM97kg5OLpEdMv4JSPoXhuxg"
                        >
                          {" "}
                          Xem Video{" "}
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d">
                  <div className="row">
                    <div className="col-md-4 col-xm-12 col-sm-12 col-lg-4">
                      {" "}
                      <h4>Hướng dẫn sử dụng máy in</h4>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create"
                      >
                        <a
                          href="./../../../../assets/data/HDSDmayin-update.pdf"
                          download
                        >
                          Tải file{" "}
                        </a>
                      </button>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create n"
                      >
                        <a
                          target="blank"
                          href="https://www.youtube.com/playlist?list=PLZp1b96OudM_8SwLqKisa9vBQBaWBhW2c"
                        >
                          {" "}
                          Xem Video{" "}
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d">
                  <div className="row">
                    <div className="col-md-4 col-xm-12 col-sm-12 col-lg-4">
                      {" "}
                      <h4>Hướng dẫn sử dụng tài khoản trạm</h4>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create"
                      >
                        <a href="./../../../../assets/data/TRAM.pdf" download>
                          Tải file{" "}
                        </a>
                      </button>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create n d-none"
                        disabled
                      >
                        <a
                          target="blank"
                          // href="https://www.youtube.com/watch?v=av5YIBo-xZs"
                        >
                          {" "}
                          Xem Video{" "}
                        </a>
                      </button>
                    </div>
                  </div>
                </div>

                {/* <div className="d">
                  <div className="row">
                    <div className="col-md-4 col-xm-12 col-sm-12 col-lg-4">
                      {" "}
                      <h4>Hướng dẫn sử dụng web</h4>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create"
                      >
                        <a href="./../../../../assets/data/HDSD-update.pdf" download>
                          Tải file{" "}
                        </a>
                      </button>
                    </div>
                    <div className="col-md-4 col-xm-12 col-sm-6 col-lg-4">
                      <button
                        style={{ marginLeft: "20px" }}
                        className="btn btn-sm btn-create n"
                        disabled
                      >
                        <a
                          target="blank"
                          // href="https://www.youtube.com/watch?v=av5YIBo-xZs"
                        >
                          {" "}
                          Xem Video{" "}
                        </a>
                      </button>
                    </div>
                  </div>
                </div> */}

              </div>
            )}
          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Factory" && (
              <div className="card-view">
                <PDFViewers
                  document={{
                    url: "./../../../../assets/data/HDSD-update.pdf",
                  }}
                />
              </div>
            )}
            {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "General" && (
              <div className="card-view">
                <PDFViewers
                  document={{
                    url: "./../../../../assets/data/TONG-DAI-LY.pdf",
                  }}
                />
              </div>
            )}
            {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Agency" && (
              <div className="card-view">
                <PDFViewers
                  document={{
                    url: "./../../../../assets/data/CUA-HANG-BAN-LE.pdf",
                  }}
                />
              </div>
            )}

          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "General" && (
              <div className="card-view">
                <PDFViewers
                  document={{
                    url: "./../../../../assets/data/TONG-DAI-LY.pdf",
                  }}
                />
              </div>
            )}

            {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Fixer" && (
              <div className="card-view">
                <PDFViewers
                  document={{
                    url: "./../../../../assets/data/CHI-NHANH-BK.pdf",
                  }}
                />
              </div>
            )}

          {this.state.userRole === "SuperAdmin" &&
            this.state.userType === "Region" && (
              <div className="card-view">
                <PDFViewers
                  document={{
                    url: "./../../../../assets/data/CHI-NHANH-KHAC.pdf",
                  }}
                />
              </div>
            )}

        </div>
      </div>
    );
  }
}
export default usermanual;
