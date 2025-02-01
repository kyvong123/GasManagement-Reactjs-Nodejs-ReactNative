import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import required from 'required';
import showToast from 'showToast';
import getInformationFromCylinders from 'getInformationFromCylinders'
import Constant from "Constants";
import TurnBackFactoryPopup from '../factory/TurnbackFactoryPopup'
import TurnBackDriverInCustomerPopup from '../factory/TurnBackDriverInCustomer'
var fileReader;

class TypeturnBackFactoryPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content: '',
            listProducts: [],
            error: "",
            product_parse: []
        };
    }


    async submit(event) {

        /*   event.preventDefault();
           // if (this.state.position.length === 0) {
           //     showToast('Chưa chọn vị trí!', 3000);
           //     return;
           // }
           let data= this.form.getValues();
           let result= await this.props.addUser(data.email,data.name,data.address,"",USERROLE_ENUM[parseInt(data.userRole)].key);
           if(result)
           {
               const modal = $("#create-staff");
               modal.modal('hide');

           }

           return;*/
    }

    async submitTextFile(event) {
        event.preventDefault();
        //await this.getAllCylenders();
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
    getListProducts(products) {
        this.setState({ product_parse: products });
    }
    render() {
        return (
            <div className="modal fade" id="type-turn-back-modal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chọn kiểu nhập bình</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center">
                                <button className="btn btn-primary"
                                    onClick={() => {
                                        const modal = $("#type-turn-back-modal");
                                        modal.modal('hide');
                                    }}
                                    type="submit" data-toggle="modal"

                                    data-target="#type-import-cylinder-modal-data">Nhập từ thị trường
                                </button>
                                <button className="btn btn-primary"
                                    onClick={() => {
                                        const modal = $("#type-turn-back-modal");
                                        modal.modal('hide');
                                    }}
                                    data-toggle="modal" type="submit"
                                    data-target="#import-cylinder-type-new"
                                    style={{ marginLeft: "10px" }}>Nhập trong hệ thống
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <TurnBackDriverInCustomerPopup
                    getListProducts={(products) => this.getListProducts(products)}
                />
            </div>
        );
    }
}

export default TypeturnBackFactoryPopup;