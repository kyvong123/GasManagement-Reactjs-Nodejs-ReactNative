import React from 'react';
import AddReportPopup from "./AddReportPopup";

import getAllUserApi from 'getAllUserApi';
import { push } from "react-router-redux";
import showToast from "showToast";
import addReport from "addReport";
import { connect } from "react-redux";
import Constants from "Constants";


class AddReportPopupContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company_profile: { images: [], featured_image_url: null },
            categories_list: [],
            uploadLogoResult: false,
            image_link: null,
            listUsers: [],

        };
    }

    componentDidMount() {
        this.getAllUser();
    }


    async getAllUser() {
        //const jobMetaData = await this.getJobMetaData();

        const dataUsers = await getAllUserApi();
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({ listUsers: dataUsers.data });
            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }

    async addReport(userId, productId, content) {

        // Call api
        this.setState({ isLoading: true });
        const report = await addReport(userId, productId, content);
        this.setState({ isLoading: false });
        //console.log('register',user);
        if (report) {
            if (report.status === Constants.HTTP_SUCCESS_BODY) {
                showToast('Tạo mới thành công!', 3000);
                this.props.refresh();
            }
            else {
                showToast(report.data.message ? report.data.message : report.data.err_msg, 2000);
            }
        }
        else {
            showToast("Xảy ra lỗi trong quá trình tạo bình ");
        }
        return;
        //this.setState({registerSuccessful: false});
    }

    render() {
        return (
            <AddReportPopup
                listProducts={this.props.listProducts}
                listUsers={this.state.listUsers}
                addReport={this.addReport.bind(this)}
            />
        );
    }
}

export default connect()(AddReportPopupContainer);;