import React from 'react';
import ExportPopup from "./AddStaffPopup";

import {push} from "react-router-redux";
import showToast from "showToast";
import addUserAPI from "addUserAPI";
import {connect} from "react-redux";
import Constants from "Constants";
import getUserCookies from "getUserCookies";


class ExportPopupContainer extends React.Component {
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

    async addUser(email,name,address,password,userRole,owner) {

        var user_cookies=await getUserCookies();
        let isChildOf='';
        if(user_cookies)
        {
             isChildOf=user_cookies.user.id;
        }
        // Call api
        this.setState({isLoading: true});
        const user = await addUserAPI(isChildOf,email,name,address,password,Constants.AGENCY,userRole,!owner ? owner : user_cookies.user);
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
            <ExportPopup
                listUsers={this.state.listUsers}
                addUser={this.addUser.bind(this)}
             />
        );
    }
}

export default connect()(ExportPopupContainer);;
