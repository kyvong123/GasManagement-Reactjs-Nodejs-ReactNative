import React, { Fragment } from "react";
import { Button } from "antd";
import styles from "./ExportFactoryPopup2.module.scss";
import classNames from "classnames/bind";
import ImportFactoryStationPopup from "./ImportFactoryStationPopup";
import ImportFactoryPopup2 from "./ImportFactoryPopup2";
const cx = classNames.bind(styles);

class ExportBackFactorySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeExportCylinder: "GasSouth",
    };
  }
  chaigs = () => {
    this.setState({ typeExportCylinder: "GasSouth" });
    $("#export-back-modal-selection").modal("hide");
  };
  chaikhac = () => {
    this.setState({ typeExportCylinder: "Other" });
    $("#export-back-modal-selection").modal("hide");
  };
  render() {
    return (
      <Fragment>
        <div
          className="modal fade"
          id="export-back-modal-selection"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nhập hồi lưu</h5>
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
                    data-target="#import-cylinder-type-new"
                    onClick={() => this.chaigs()}
                  >
                    Chai GS
                  </Button>
                  <Button
                    className="btn-tieptuc btn-action-1"
                    data-toggle="modal"
                    data-target="#import-modalpopup2"
                    onClick={() => this.chaikhac()}
                  >
                    Chai khác
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ImportFactoryStationPopup
          getListProducts={this.props.getListProducts}
          getSuccessIdCylinders={this.props.getSuccessIdCylinders}
          getListCylinderDuplicate={this.props.getListCylinderDuplicate}
          cylinderNotPass={this.props.cylinderNotPass}
        />
        <ImportFactoryPopup2
          typeImportCylinder={this.state.typeImportCylinder}
          typeImport="TURNBACK"
        />
      </Fragment>
    );
  }
}
export default ExportBackFactorySelection;
