import React, { Fragment } from "react";
import { Button } from "antd";
import ExportFactoryPopup from "./ExportFactoryPopup";
import ExportWarehousePopup from "./ExportWarehousePopup";
import styles from "./ExportFactoryPopup2.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

class ExportFactorySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeExportCylinder: "xuatthang",
    };
  }
  xuatkhoxe = () => {
    this.setState({ typeExportCylinder: "khoxe" });
    $("#export-modal-selection").modal("hide");
  };
  xuatthangkhachhang = () => {
    this.setState({ typeExportCylinder: "xuatthang" });
    $("#export-modal-selection").modal("hide");
  };
  render() {
    return (
      <Fragment>
        <div className="modal fade" id="export-modal-selection" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xuất chai thành phẩm</h5>
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
                    data-target="#export-modal-warehouse"
                    onClick={() => this.xuatkhoxe()}
                  >
                    {`Xuất kho xe (Bán lẻ)`}
                  </Button>
                  <Button
                    className="btn-tieptuc btn-action-2"
                    data-toggle="modal"
                    data-target="#export-modal"
                    onClick={() => this.xuatthangkhachhang()}
                  >
                    Xuất thẳng cho khách hàng{" "}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ExportFactoryPopup
          getListProducts={this.props.getListProducts}
          getListCylinderDuplicate={this.props.getListCylinderDuplicate}
          getSuccessIdCylinders={this.props.getSuccessIdCylinders}
          getCylindersNotCreate={this.props.getCylindersNotCreate}
          cylinderNotPass={this.props.cylinderNotPass}
          typeExportCylinder={this.state.typeExportCylinder}
        />
        <ExportWarehousePopup
          getListProducts={this.props.getListProducts}
          getListCylinderDuplicate={this.props.getListCylinderDuplicate}
          getSuccessIdCylinders={this.props.getSuccessIdCylinders}
          getCylindersNotCreate={this.props.getCylindersNotCreate}
          cylinderNotPass={this.props.cylinderNotPass}
          typeExportCylinder={this.state.typeExportCylinder}
        />
      </Fragment>
    );
  }
}
export default ExportFactorySelection;
