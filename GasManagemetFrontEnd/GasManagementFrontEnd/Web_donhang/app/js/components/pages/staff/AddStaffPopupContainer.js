import React from 'react';
import AddStaffPopup from "./AddStaffPopup";

import {push} from "react-router-redux";
import showToast from "showToast";
import addUserAPI from "addUserAPI";
import {connect} from "react-redux";
import Constants from "Constants";
import getUserCookies from "getUserCookies";


class AddStaffPopupContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_profile: {images: [],featured_image_url:null},
            categories_list: [],
            listUsers:[],

        };
    }

    componentDidMount() {
    }

    async addUser(email,name,address,password,userRole) {

        var user_cookies=await getUserCookies();
        console.log(user_cookies);
        let isChildOf='';
        if(user_cookies)
        {
            if(user_cookies.user.userRole==="SuperAdmin")
                isChildOf=user_cookies.user.id;
            else{
                isChildOf=user_cookies.user.isChildOf;
            }
        }
        // Call api
        this.setState({isLoading: true});
        const user = await addUserAPI(isChildOf,email,name,address,password,Constants.AGENCY,userRole,user_cookies.user.id);
        this.setState({isLoading: false});
        //console.log('register',user);
        if (user) {
            if(user.status===Constants.HTTP_SUCCESS_CREATED)
            {
                showToast('Tạo mới thành công!', 3000);
                this.props.refresh();
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
            showToast("Xảy ra lỗi trong quá trình tạo người dùng ");
            return false;
        }

        //this.setState({registerSuccessful: false});
    }


    render() {
        return (
            <AddStaffPopup
                listUsers={this.state.listUsers}
                addUser={this.addUser.bind(this)}
             />
        );
    }
}

export default connect()(AddStaffPopupContainer);;