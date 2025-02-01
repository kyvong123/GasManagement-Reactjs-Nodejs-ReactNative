import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import Constant from "Constants";
import showToast from "showToast";
import addUserAPI from "addUserAPI";

import createHistoryAPI from "createHistoryAPI";
import getAllCylinderAPI from "getAllCylinderAPI";
const USERROLE_ENUM = [
    {
        key: 'Owner',
        value: 'Chủ cửa hàng'
    },
    {
        key: 'Staff',
        value: 'Nhân viên'
    },
    {
        key: 'Deliver',
        value: 'Giao hàng'
    },
    {
        key: 'Inspect',
        value: 'Người kiểm tra, bảo trì'
    }
]
class ExportPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listProducts: []
        };
    }

    async addHistory(driver, license_plate, cylinders) {

        // Call api
        this.setState({ isLoading: true });
        const user = await createHistoryAPI(driver, license_plate, cylinders);
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (user) {
            if (user.status === Constant.HTTP_SUCCESS_CREATED || user.status === Constant.HTTP_SUCCESS_BODY) {
                showToast('Xuất hàng thành công!', 3000);
                const modal = $("#create-driver");
                modal.modal('hide');
                this.props.refresh();
                return true;
            }
            else {
                showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                return false;
            }
        }
        else {
            showToast("Xảy ra lỗi trong quá trình tạo bình ");
            return false;
        }

        //this.setState({registerSuccessful: false});
    }
    async getAllCylenders() {
        const dataProducts = await getAllCylinderAPI();
        if (dataProducts) {
            if (dataProducts.status === Constant.HTTP_SUCCESS_BODY) {
                this.setState({ listProducts: dataProducts.data });
                return dataProducts.data;
            }
            else {
                showToast(dataProducts.data.message ? dataProducts.data.message : dataProducts.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }

    async submit(event) {

        event.preventDefault();
        // var products=await this.getAllCylenders();
        var cylinders = [];
        for (let i = 0; i < this.props.product_parse.length; i++) {
            cylinders.push(this.props.product_parse[i].id);
        }

        let data = this.form.getValues();
        await this.addHistory(data.driver, data.license_plate, cylinders);
        // if (this.state.position.length === 0) {
        //     showToast('Chưa chọn vị trí!', 3000);
        //     return;
        // }
        /*  let data= this.form.getValues();
          let result= await this.props.addUser(data.email,data.name,data.address,"",USERROLE_ENUM[parseInt(data.userRole)].key);
          if(result)
          {
              const modal = $("#create-staff");
              modal.modal('hide');
  
          }
  */
        return;
    }

    async submitTextFile(event) {
        /* if (!file) showToast('Vui lòng chọn file!', 3000);
         this.setState({isLoading: true});
         const result = await importProductsFromExcelAPI(file);
         this.setState({isLoading: false});
         console.log(result);
         if (result && result.status === 200) {
             if (typeof (result) !== 'undefined') {
                 showToast('Đưa vào thành công!', 3000);
                 this.props.refresh();
             }
             else {
                 //showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
             }
             return;
         } else {
             showToast("Xảy ra lỗi trong quá trình import. Vui lòng kiểm tra lại dữ liệu", 2000);
         }
         return;
         $("#import-product").modal('hide');
         return;*/
    }

    handleFileUpload(event) {
        file = event.target.files[0]
    }

    render() {
        return (
            <div className="modal fade" id="create-driver" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xuất Hàng - Bước 2 - Thông Tin Tài Xế</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form ref={c => {
                                this.form = c
                            }} className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Tên tài xế</label>
                                                <Input className="form-control" type="text" name="driver" validations={[required]} />
                                            </div>
                                            <div className="form-group">
                                                <label>Biển số xe </label>
                                                <Input className="form-control" type="text" name="license_plate" id="license_plate" validations={[required]} />
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" type="submit">OK</Button>
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                        style={{ marginLeft: "10px" }}>Đóng
                                    </button>
                                </footer>
                            </Form>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ExportPopup;