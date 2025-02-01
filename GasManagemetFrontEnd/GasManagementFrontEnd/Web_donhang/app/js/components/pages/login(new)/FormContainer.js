import React from 'react';
import loginApi from "loginApi";
import {push} from "react-router-redux";
import MyForm from './Form.js';
import {connect} from 'react-redux';
import {setCookie} from 'redux-cookie';
import showToast from 'showToast';
import Constants from "Constants";
import loginSystemUserAPI from "./../../../../api/loginSystemUserAPI";

class FormContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginResult: true,
            messageError: '',
            isLoading: false,
        };

    }

    // async onChangeChecked (e) {
    //     console.log(e)
    // }

    async login(email, password, isSystemUser) {
        // Call api
        this.setState({isLoading: true});
        let user = "";
        if(isSystemUser){
            console.log(email, password)
            user = await loginSystemUserAPI(email, password)
        }
        else{ 
            user = await loginApi(email, password) 
        }
        //this.props.fetchUserLogin(user);
        this.setState({isLoading: false});
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({loginResult: true});

                const {dispatch} = this.props;
                // Store user to cookie

                //sessionStorage.setItem('user',JSON.stringify(user.data));
  
                await dispatch(setCookie('user', user.data));
                console.log("user",user)
                dispatch(push('/blank-page'));
                return;
            } else {
                // showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
            }

        } else {
            showToast("Xảy ra lỗi khi đăng nhập hệ thống", 2000);
        }

        this.setState({loginResult: false});
    }

    render() {
        return (
            <MyForm isLoading={this.state.isLoading} login={this.login.bind(this)} loginResult={this.state.loginResult}
                    messageError={this.state.messageError} loginErrorMessage={this.state.messageError}/>
        );
    }
}

// const mapDispatchToProps=(dispatch)=>{
//     return {
//       fetchUserLogin:(user)=>{
//         dispatch(actFetUserLogin(user));
//       }
//     }
//   }
export default connect()(FormContainer);