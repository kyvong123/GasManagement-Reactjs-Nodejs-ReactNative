import React, { Fragment } from "react";
import { Button } from "antd";
import ImportFactoryPopup2 from "./ImportFactoryPopup2";
import styles from './ExportFactoryPopup2.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

class ImportFactorySelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeImportCylinder: 'GasSouth'
    }
  }
  chooseImportGS = () => {
    this.setState({ typeImportCylinder: 'GasSouth' });
    $("#import-modal-selection").modal("hide");
  }
  chooseImportOther = () => {
    this.setState({ typeImportCylinder: 'Other' });
    $("#import-modal-selection").modal("hide");
  }
  render() {
    return (
      <Fragment>
        <div className="modal fade" id="import-modal-selection" tabIndex="-1">

          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nhập Vỏ Không Mã</h5>
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
                    data-target="#import-modalpopup2"
                    onClick={() => this.chooseImportGS()}
                  >
                    Nhập vỏ GasSouth
                  </Button>
                  <Button className="btn-tieptuc btn-action"
                    data-toggle="modal"
                    data-target="#import-modalpopup2"
                    onClick={() => this.chooseImportOther()}
                  >Nhập vỏ khác</Button>
                </div>

              </div>
            </div>
          </div>
        </div>
        <ImportFactoryPopup2
          typeImportCylinder={this.state.typeImportCylinder}
        />
      </Fragment>

    );
  }
}

export default ImportFactorySelection;
