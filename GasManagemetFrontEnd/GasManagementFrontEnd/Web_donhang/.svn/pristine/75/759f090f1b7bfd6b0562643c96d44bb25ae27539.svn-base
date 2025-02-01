import React from "react";
import AddUserPopup from "./AddUserPopup";
import { push } from "react-router-redux";
import showToast from "showToast";
import { connect } from "react-redux";
import Constants from "Constants";

import getUserCookies from "getUserCookies";
import updateUserAPI from "updateUserAPI";
import addUserAPI from "addUserAPI";

class AddUserPopupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company_profile: { images: [], featured_image_url: null },
      categories_list: [],
      listUsers: [],
    };
  }

  componentDidMount() {}

  async addUser(email, name, address, password, userType, child, userRole, owner, code, lat, lng, branch, prefix, customerType) {
    var user_cookies = await getUserCookies();
    let isChildOf = "";
    if (user_cookies) {
      isChildOf = user_cookies.user.id;
    }
    // Call api
    // Create user
    this.setState({ isLoading: true });
    const user = await addUserAPI(
      child,
      email,
      name,
      address,
      password,
      userType,
      userRole,
      owner === false ? owner : user_cookies.user.id,
      code,
      lat,
      lng,
      branch,
      prefix,
      customerType
    );
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      if (user.status === Constants.HTTP_SUCCESS_CREATED) {
        showToast("Tạo mới thành công!", 3000);
        this.props.refresh();
        // window.location.reload();
        return true;
      } else if (user.status === 400) {
        showToast("Vui lòng kiểm tra lại thông tin!");
        console.log(user);
        const modal = $("create-user");
        modal.modal("open");
      } else {
        showToast(user.data.message ? user.data.message : user.data.err_msg, showToast("Email này đã tạo tài khoản rồi. Mời bạn nhập lại!", 2000));
        // showToast('dsdsds',3000);
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình tạo mới người dùng ");
      return false;
    }
    this.setState({ registerSuccessful: false });
  }

  async updateUser(id, name, password, address, lat, lng, codebranch, prefix) {
    var user_cookies = await getUserCookies();

    // Call api
    // Update user
    this.setState({ isLoading: true });
    const user = await updateUserAPI(id, name, password, address, lat, lng, codebranch, prefix);
    this.setState({ isLoading: false });
    //console.log('register',user);
    if (user) {
      console.log(user);
      if (user.status === Constants.HTTP_SUCCESS_BODY) {
        if (!!user.data.err_msg) {
          showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
          return false;
        } else {
          showToast("Cập nhật thành công!", 3000);
          this.props.refresh();
          // window.location.reload();
          return true;
        }
      } else {
        showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
        return false;
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình tạo mới người dùng ");
      return false;
    }

    this.setState({ registerSuccessful: false });
  }

  async EditUser(email, name, address, password, userType, child, userRole, owner, code, lat, lng) {}

  render() {
    return (
      <AddUserPopup
        isEditForm={this.props.isEditForm}
        updateUser={this.updateUser.bind(this)}
        isAgencyPage={this.props.isAgencyPage}
        isStationPage={this.props.isStationPage}
        isGeneralPage={this.props.isGeneralPage}
        isIndustryPage={this.props.isIndustryPage}
        isFactoryPage={this.props.isFactoryPage}
        isFixerPage={this.props.isFixerPage}
        isFactoryChildPage={this.props.isFactoryChildPage}
        isDrivePage={this.props.isDrivePage}
        // isRegionPage={this.props.isRegionPage}
        listProducts={this.props.listProducts}
        listUsers={this.state.listUsers}
        addUser={this.addUser.bind(this)}
        isCreateMode={this.props.isCreateMode}
        isCreateThanhtra={this.props.isCreateThanhtra}
      />
    );
  }
}

export default connect()(AddUserPopupContainer);
