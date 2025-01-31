import React, { Fragment } from "react";
import { Button } from "antd";
import styles from "./ExportFactoryPopup2.module.scss";
import classNames from "classnames/bind";
import TypeExportCylinderPopup from "../factory/TypeExportCylinderPopup";
import callApi from "./../../../util/apiCaller";
import Cookies from "js-cookie";
const cx = classNames.bind(styles);

class ExportEmptyFactorySelectionFixer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeExportCylinder: "xuatthang",
    };
  }
  xuatkhoxe = () => {
    Cookies.set("khoXe", "khoXe");
    $("#export-empty-modal-selection-fixer").modal("hide");
  };
  xuatthangkhachhang = () => {
    Cookies.set("khoXe", "khachHang");
    this.setState({ typeExportCylinder: "xuatthang" });
    $("#export-empty-modal-selection-fixer").modal("hide");
  };

  // handleChangeTypeExportCylinder(data) {
  //   console.log("data", data);
  //   this.setState({ typeExportCylinder: data });
  // }

  render() {
    return (
      <Fragment>
        <div
          className="modal fade"
          id="export-empty-modal-selection-fixer"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xuất vỏ</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className={cx("modal-body")}>
                <div className="content-popup2"></div>
                <div className="action-popup2">
                  <Button
                    className="btn-tieptuc btn-action-1"
                    data-toggle="modal"
                    data-target="#export-cylinder-information-kho-xe"
                    onClick={() => this.xuatkhoxe()}
                  >
                    {`Xuất kho xe (Bán lẻ)`}
                  </Button>
                  <Button
                    className="btn-tieptuc btn-action-2"
                    data-toggle="modal"
                    data-target="#export-cylinder"
                    onClick={() => this.xuatthangkhachhang()}
                  >
                    Xuất thẳng cho khách hàng{" "}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <TypeExportCylinderPopup
          handleChangeTypeExportCylinder={(data) =>
            this.handleChangeTypeExportCylinder(data)
          }
          getListProducts={(products) => this.getListProducts(products)}
          khoXe={this.state.typeExportCylinder == "khoxe"}
        /> */}
      </Fragment>
    );
  }
}
export default ExportEmptyFactorySelectionFixer;
