import React from 'react';
import registerAPI from "registerAPI";
import {push} from "react-router-redux";
import RegisterForm from './Form.js';
import {connect} from 'react-redux';
import showToast from 'showToast';
import Constants from 'Constants';

class FormContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            registerSuccessful: true,
            isLoading: false
        };
    }

    async register(username, password,address,name) {

        // Call api
        this.setState({isLoading: true});
        const user = await registerAPI(username, password,address,name);
        this.setState({isLoading: false});
        //console.log('register',user);
        if (user) {

            if(user.status===Constants.HTTP_SUCCESS_CREATED)
            {
                this.setState({registerSuccessful: true});
                const {dispatch} = this.props;
                dispatch(push('/register-success'));
            }
            else
            {
                showToast(user.data.message?user.data.message:user.data.err_msg,2000);
            }
            return;
        }
        else {
            showToast("Xảy ra lỗi trong quá trình đăng ký",2000);
        }
        return;
        //this.setState({registerSuccessful: false});
    }

    render() {
        return (
            <RegisterForm isLoading={this.state.isLoading} register={this.register.bind(this)}
                          registerSuccessful={this.state.registerSuccessful}/>
        );
    }
}

export default connect()(FormContainer);