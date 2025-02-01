import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Dimensions,
} from "react-native";
import React, { Component, createRef } from "react";
import CustomeTextInput from "../../components/CustomeTextInput";
import { styles } from "./styles";
import CustomeDropdownPicker from "../../components/CustomeDropdownPicker";
import TextButton from "../../components/TextButton";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import wareHouseApi from "../../api/wareHouseApi";
import { getToken } from "../../helper/auth";
import { fetchUsers } from "../../actions/AuthActions";

class WarehouseAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drives: [],
      driverCurrent: undefined,
      customers: [],
      customerCurrent: undefined,
    };

    this.scrollViewRef = createRef();
  }

  componentDidMount() {
    this.getDriver();
    this.getCustomers();
    console.log("==============> ", this.props);

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  handleKeyboardDidShow = () => {
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollTo({
        y: Dimensions.get("screen").height / 2,
        animated: true,
      });
    }
  };

  handleDataForDropdown = (data) => {
    if (data) {
      return data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  };

  getDriver = async () => {
    const token = await getToken();
    console.log("token: ", token);
    const { userInfo } = this.props;
    const response = await wareHouseApi.getDriver({ id: userInfo.id }, token);
    if (response && !response.data.error) {
      const drives = this.handleDataForDropdown(response.data.data);
      this.setState({ drives });
    }
  };

  getCustomers = async () => {
    const token = await getToken();
    const { userInfo } = this.props;
    const response = await wareHouseApi.getCustomers(
      "allKhachHang",
      userInfo.userType,
      token
    );
    if (response && response.data.success) {
      const customers = this.handleDataForDropdown(response.data.data);
      this.setState({ customers });
    }
  };

  render() {
    const { userInfo } = this.props;
    const { drives, driverCurrent, customers, customerCurrent } = this.state;

    return (
      <ScrollView
        ref={this.scrollViewRef}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.titleStyle}>Thông tin vận chuyển</Text>

        <CustomeDropdownPicker
          label={"Tài xế"}
          placeholder={"Chọn tài xế"}
          data={drives}
          value={driverCurrent}
          setValue={(value) => this.setState({ driverCurrent: value })}
          isSearch={true}
        />

        <CustomeTextInput
          label={"Biển số xe"}
          editable={false}
          value={userInfo.id}
          inputStyle={styles.styleForInputAvailable}
        />

        <CustomeDropdownPicker
          label={"Khách hàng"}
          placeholder={"Chọn khách hàng"}
          data={customers}
          value={customerCurrent}
          setValue={(value) => this.setState({ customerCurrent: value })}
          isSearch={true}
          searchPlaceholder={"Nhập tên khách hàng..."}
        />

        <CustomeTextInput
          label={"Mã đơn hàng"}
          placeholder="Nhập mã đơn hàng"
        />

        <View style={styles.footer}>
          <View style={styles.wrapBtn}>
            <TextButton
              onPress={() => Actions.push("ChooseCamera")}
              children={"Tiếp tục"}
              btnStyle={styles.btnStyle}
              style={styles.txtContinueStyle}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.auth.user,
  loading: state.auth.loading,
});

export default connect(mapStateToProps)(WarehouseAccount);
