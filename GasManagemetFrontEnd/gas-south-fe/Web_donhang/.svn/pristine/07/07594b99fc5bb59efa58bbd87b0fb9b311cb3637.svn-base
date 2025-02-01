import React from 'react';
import {Link} from 'react-router';
import ProTypes from "prop-types";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import required from "required";
import isUppercase from 'isUppercase';
import isEqual from "isEqual";
import Button from 'react-validation/build/button';
import ReactCustomLoading from 'ReactCustomLoading';

class RegisterForm extends React.Component
{
    constructor(props) {
        super(props);
        this.form = null;
    }

    render() {
        return (

            <Form ref={c => this.form = c } className="form-type-material" >
                <ReactCustomLoading isLoading={this.props.isLoading}/>
                <div className="form-group">
                    <label htmlFor="email">Họ tên</label>
                    <br/>
                    <Input
                        type="text"
                        name="name"
                        className="seednet-input-block"
                        placeholder="Nhập họ tên"
                        id="name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <br/>
                    <Input
                        type="text"
                        name="email"
                        className="seednet-input-block"
                        placeholder="Nhập địa chỉ Email"
                        id="email"
                        validations={[required, isUppercase]}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <br/>
                    <Input
                        name="password"
                        type="password"
                        className="seednet-input-block"
                        placeholder="Nhập mật khẩu"
                        id="password"
                        validations={[required,isEqual]}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="repassword">Nhập lại mật khẩu</label>
                    <br/>
                    <Input
                        name="confirm"
                        type="password"
                        className="seednet-input-block"
                        placeholder="Nhập mật khẩu"
                        id="confirm"
                        validations={[required,isEqual]}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Địa chỉ</label>
                    <br/>
                    <Input
                        type="text"
                        name="address"
                        className="seednet-input-block"
                        placeholder="Nhập địa chỉ"
                        id="address"
                    />
                </div>

                <div className={this.props.registerSuccessful ? "alert alert-danger d-none" : "alert alert-danger"} role="alert">
                    Đăng ký tài khoản thất bại
                </div>
                <p className="text-center text-muted fs-13 mt-20">Bạn đã có tài khoản? <Link to='/login'><a
                    className="text-primary fw-500" >Bấm vào đây để đăng nhập</a></Link></p>

                <div className="form-group">
                    <Button className="btn btn-bold btn-block btn-primary" type="submit" onClick={(event) => {this.props.register(this.form.getValues().email, this.form.getValues().password,this.form.getValues().address,this.form.getValues().name,);event.preventDefault();}}>ĐĂNG KÝ
                    </Button>
                </div>
            </Form>
        );
    }
}

RegisterForm.proTypes  = {
    register: ProTypes.func.isRequired,
    registerSuccessful: ProTypes.bool.isRequired,
    isLoading: ProTypes.bool.isRequired,
};

export default RegisterForm;