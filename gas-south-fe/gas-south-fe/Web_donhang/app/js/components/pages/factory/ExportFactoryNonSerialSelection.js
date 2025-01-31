import React, { Fragment } from "react";
import { Button } from "antd";
import ExportFactoryPopup2 from "./ExportFactoryPopup2";
import styles from './ExportFactoryPopup2.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

class ExportFactoryNonSerialSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeExportCylinder: 'GasSouth'
    }
  }
  chooseExportGS = () => {
    this.setState({ typeExportCylinder: 'GasSouth' });
    $("#export-nonserial-modal-selection").modal("hide");
  }
  chooseExportOther = () => {
    this.setState({ typeExportCylinder: 'Other' });
    $("#export-nonserial-modal-selection").modal("hide");
  }
  render() {
    return (
      <Fragment>
        <div className="modal fade" id="export-nonserial-modal-selection" tabIndex="-1">

          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xuất Vỏ Không Mã</h5>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className={cx('modal-body')}>
                <div className="content-popup2">

                </div>
                <div className="action-popup2">
                  <Button
                    className="btn-tieptuc btn-action-1"
                    data-toggle="modal"
                    data-target="#export-modalabc"
                    onClick={() => this.chooseExportGS()}
                  >
                    Xuất vỏ đi bảo dưỡng
                  </Button>
                  <Button className="btn-tieptuc btn-action"
                    data-toggle="modal"
                    data-target="#export-modalabc"
                    onClick={() => this.chooseExportOther()}
                  >Xuất vỏ khác</Button>
                </div>

              </div>
            </div>
          </div>
        </div>
        <ExportFactoryPopup2
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

export default ExportFactoryNonSerialSelection;
