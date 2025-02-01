import React, { Fragment } from "react";
import AddProductTypePopup from "./AddProductTypePopup";
import CancelCylinder from "./CancelCylinder"
import getAllUserApi from "getAllUserApi";
import { push } from "react-router-redux";
import showToast from "showToast";
import addProductTypeAPI from "app/api/addProductTypeAPI";
import { connect } from "react-redux";
import Constants from "Constants";
import getAllManufacturer from "getAllManufacturer";

class AddProductTypePopupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async addProductType({ typeCode, typeName, mass }) {
    // Call api
    this.setState({ isLoading: true });
    const addProductTypePromise = await addProductTypeAPI(typeCode, typeName, mass);
    this.setState({ isLoading: false });
    // if OK -> reload
    // this.props.refresh();
    // window.location.reload();
    // window.location.reload();
  }

  render() {
    return (
      <Fragment>
        <AddProductTypePopup addProductType={this.addProductType.bind(this)} />
        <CancelCylinder />
      </Fragment>
    );
  }
}

export default connect()(AddProductTypePopupContainer);
