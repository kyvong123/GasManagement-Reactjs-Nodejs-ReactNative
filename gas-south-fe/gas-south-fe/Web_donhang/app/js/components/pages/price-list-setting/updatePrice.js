import React, { Component } from "react";
import {
  InputNumber,
  Input,
} from "antd";
import moment from "moment";

const iniState = {}

export default class UpdatePrice extends Component {
  state = {
    priceItem:'',
  }

  componentWillReceiveProps(nextProps){
    if(nextProps && nextProps.priceItem){
      this.setState({
        priceItem: nextProps.priceItem
       })
    }else{
      this.setState({ priceItem : iniState})
    }
  }

  render() {
    return (
        <div className="col-md-12">
          <div className="form-group row headerForm">
            <h4>Thông tin bảng giá</h4>
          </div>
          <div className="form-group row contentForm">
            <label
              htmlFor="input_namecontact"
              className="col-sm-4 col-form-label"
            >
              Loại
            </label>
            <div className="col-sm-8">
              <Input
                type="text"
                className="form-control"
                value={this.props.codeItem}
                disabled
              ></Input>
            </div>
          </div>
          <div className="form-group row contentForm">
            <label
              htmlFor="input_mobilecontact"
              className="col-sm-4 col-form-label"
            >
              Giá
            </label>
            <div className="col-sm-8">
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={this.props.changeValue}
                value={this.props.priceItem}
              />
            </div>
          </div>
          <div className="form-group row contentForm">
            <label
              htmlFor="input_emailcontact"
              className="col-sm-4 col-form-label"
            >
              Vùng Miền
            </label>
            <div className="col-sm-8">
              <Input
                type="text"
                className="form-control"
                value={this.props.regionNameItem}
                disabled
              ></Input>
            </div>
          </div>
          <div className="form-group row contentForm">
            <label htmlFor="input_note" className="col-sm-4 col-form-label">
              Ngày Áp Dụng
            </label>
            <div className="col-sm-8">
              <Input
                id="inut_note"
                type="text"
                value={moment(this.props.dateItem).format("l")}
                disabled
              ></Input>
            </div>
          </div>
        </div>
    );
  }
}
