import React from 'react';
import loginApi from "loginApi";
import {push} from "react-router-redux";
import MyForm from './Form.js';
import {connect} from 'react-redux';
import {setCookie} from 'redux-cookie';
import showToast from 'showToast';
import Constants from "Constants";
class FormContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginResult: true,
            messageError: '',
            isLoading: false,

        };

    }

    async login(email, password) {
        // Call api
        this.setState({isLoading: true});
        const user = await loginApi(email, password);
        //this.props.fetchUserLogin(user);
        this.setState({isLoading: false});
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({loginResult: true});

                const {dispatch} = this.props;
                // Store user to cookie

                //sessionStorage.setItem('user',JSON.stringify(user.data));
  
                await dispatch(setCookie('user', user.data));
                //console.log('user11111',user.data.user)
                //console.log(user.data.user);
                if(user.data.user.userType==="Warehouse"&&user.data.user.userRole==="SuperAdmin"){
                    dispatch(push('/car'));
                }else if(user.data.user.userType==="Station"&&user.data.user.userRole==="SuperAdmin"){
                    dispatch(push('/reportExport'));
                }else if(user.data.user.userType==="Sales"&&user.data.user.userRole==="SuperAdmin"){
                    dispatch(push('/inventory'));
                }else if(user.data.user.userType==="Accounting"&&user.data.user.userRole==="SuperAdmin"){
                    dispatch(push('/customer'));
                }else if(user.data.user.userType==="Manager"&&user.data.user.userRole==="SuperAdmin"){
                    dispatch(push('/reportExport'));
                }else{
                    dispatch(push('/product'));
                }
               
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