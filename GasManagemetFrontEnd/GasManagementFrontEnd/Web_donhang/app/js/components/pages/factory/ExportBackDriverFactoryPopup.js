import React from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import SelectMulti from 'react-select';
import Button from 'react-validation/build/button';
import required from 'required';
import Constant from "Constants";
import showToast from "showToast";
import TagAutocomplete from "TagAutoComplete";

import createHistoryAPI from "createHistoryAPI";

class ExportBackDriverFactoryPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content:'',
            listProducts:[],
            isShowNumber:false,

           

        };
    }
   

    async addHistory(driver,license_plate,cylinders,to) {

        // Call api
        this.setState({isLoading: true});
        const user = await createHistoryAPI(driver,license_plate,cylinders,Constant.EXPORT_BACK_FACTORY,to);
        this.setState({isLoading: false});
        //console.log('register',user);
        if (user) {
            if(user.status===Constant.HTTP_SUCCESS_CREATED || user.status===Constant.HTTP_SUCCESS_BODY)
            {
                showToast('Xuất hàng thành công!', 3000);
                const modal = $("#export-driver-back-factory");
                modal.modal('hide');
                //this.props.refresh();
                return true;
            }
            else
            {
                showToast(user.data.message?user.data.message:user.data.err_msg,2000);
                return false;
            }
        }
        else
        {
            showToast("Xảy ra lỗi trong quá trình tạo bình ");
            return false;
        }

        //this.setState({registerSuccessful: false});
    }
    componentDidMount()
    {

    }
    async submit(event) {

        event.preventDefault();
        // var products=await this.getAllCylenders();
         var cylinders=[];
         for(let i=0;i<this.props.product_parse.length;i++)
         {
             cylinders.push(this.props.product_parse[i].id);
         }

        let data= this.form.getValues();
        // let toArray=[];
        // let numberArray=[];

        // if(agencyList.length ===0 && generalList.length===0)
        // {
        //     showToast("Hãy chọn nơi cần xuất bình");
        //     return;
        // }
        // else {
        //     for(let i=0;i<generalList.length;i++)
        //     {
        //         toArray.push(generalList[i].value);
        //         numberArray.push(data['numberGeneral'+i]);
        //     }
        //     for(let i=0;i<agencyList.length;i++)
        //     {
        //         toArray.push(agencyList[i].value);
        //         numberArray.push(data['numberAgency'+i]);
        //     }

        // }

        await this.addHistory(data.driver,data.license_plate,cylinders,data.factory);


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


    render() {

        return (
            <div className="modal fade" id="export-driver-back-factory" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xuất Bình Về Thương Nhân Sở Hữu - Bước 2 - Thông Tin Tài Xế</h5>
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
                                                <Input className="form-control" type="text" name="driver" validations={[required]}/>
                                            </div>


                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Biển số xe </label>
                                                <Input className="form-control"  type="text" name="license_plate" id="license_plate" validations={[required]} />
                                            </div>
                                        </div>

                                       {/* <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Loại xuất </label>
                                                <Select onClick={()=>{this.setState({isShowDropdown:this.form.getValues().type_export})}} className="form-control"
                                                        name="type_export"
                                                        validations={[required]}>
                                                    <option value="0">-- Chọn --</option>
                                                    <option value="2">Xuất cho thương nhân mua bán</option>
                                                    <option value="3">Xuất cho đại lý</option>
                                                </Select>
                                            </div>
                                        </div>*/}

<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Thương Nhân Sở Hữu</label>
                                                <Select className="form-control"
                                                        name="factory"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listFactoryBacks.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}
                                                </Select>
                                            </div>
                                        </div>



                                        {/*   {this.state.isShowDropdown==='1' && (<div className="col-md-6">
                                            <div className="form-group">
                                                <label>Trạm chiết nạp</label>
                                                <Select className="form-control"
                                                        name="station"
                                                        validations={[required]}>
                                                    <option value="">-- Chọn --</option>
                                                    {this.props.listStationUser.map((item, index) => <option value={item.id}>{item.name}</option>)}
                                                </Select>
                                            </div>
                                        </div>)}*/}

                                    </div>
                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary" type="submit">Lưu</Button>
                                    <button className="btn btn-secondary" type="reset" data-dismiss="modal"
                                            style={{marginLeft: "10px"}}>Đóng
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

export default ExportBackDriverFactoryPopup;