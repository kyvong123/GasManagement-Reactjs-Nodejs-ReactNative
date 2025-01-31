import React from 'react';
import PropType from 'prop-types';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import required from 'required';
import showToast from "showToast";
const USERROLE_ENUM=[
    {
        key:'Owner',
        value:'Chủ cửa hàng'
    },
    {
        key:'Staff',
        value:'Nhân viên'
    },
    {
        key:'Deliver',
        value:'Giao hàng'
    }
]
class AddStaffPopup extends React.Component {

    constructor(props) {
        super(props);
        this.form = null;
        this.state = {
            content:'',

        };
    }


    async submit(event) {
        event.preventDefault();
        // if (this.state.position.length === 0) {
        //     showToast('Chưa chọn vị trí!', 3000);
        //     return;
        // }
        let data= this.form.getValues();
        if(data.email && data.email.search(/\S+@\S+\.\S+/)){
            showToast("Email không hợp lệ!")
        } else {
            let result= await this.props.addUser(data.email,data.name,data.address,data.password,USERROLE_ENUM[parseInt(data.userRole)].key);
            if(result)
            {
                const modal = $("#create-staff");
                modal.modal('hide');
            }
        }
        return;
    }

    render() {
        return (
            <div className="modal fade" id="create-staff" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tạo Mới Nhân Viên</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <Form ref={c => {this.form = c}}
                                  className="card" onSubmit={(event) => this.submit(event)}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="form-group">
                                                <label>Địa chỉ Email </label>
                                                <Input className="form-control" type="text" name="email" id="email" value={this.state.email} validations={[required]} />
                                            </div>
                                        </div>
                                       <div className="col-md-6">
                                           <div className="form-group">
                                               <label>Tên người dùng </label>
                                               <Input className="form-control" type="text" name="name" id="name" value={this.state.name} validations={[required]} />
                                           </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Địa chỉ </label>
                                                <Input className="form-control" type="text" name="address" id="address" value={this.state.address} validations={[required]} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Mật Khẩu </label>
                                                <Input className="form-control" type="text" name="password" id="password" value={this.state.password} validations={[required]} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Loại nhân viên </label>
                                                <Select className="form-control"
                                                        name="userRole"
                                                >
                                                    <option value="">-- Chọn --</option>
                                                    {USERROLE_ENUM.map((item, index) => <option value={index}>{item.value}</option>)}
                                                </Select>
                                                {/*<Input className="form-control" type="text" name="color" id="color" value={this.state.color} validations={[required]} />*/}
                                            </div>
                                        </div>
                                    </div>

                                    {/*<div className="form-group">*/}
                                    {/*<label>Các vị trí</label>*/}
                                    {/*<TagAutoComplete getPosition={this.getPosition.bind(this)}*/}
                                    {/*data={this.state.job_titles}/>*/}
                                    {/*</div>*/}

                                </div>

                                <footer className="card-footer text-center">
                                    <Button className="btn btn-primary">Lưu</Button>
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

export default AddStaffPopup;