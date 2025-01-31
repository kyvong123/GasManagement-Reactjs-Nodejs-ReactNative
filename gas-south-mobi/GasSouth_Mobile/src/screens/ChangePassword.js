import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { connect } from "react-redux";
import { COLOR } from "../constants";
import {
  TextField,
} from 'react-native-material-textfield';
import { getToken, getUserInfo } from "../helper/auth";
import Modal from 'react-native-modal';
import { changePassword, logOut } from '../actions/AuthActions';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  //Button,
  WingBlank,
  Flex,
  InputItem,
  Card,
  WhiteSpace
} from "@ant-design/react-native/lib";

const styles = StyleSheet.create({
  txtError: {
    fontSize: 13,
    color: COLOR.RED,
  },
  container: {
    paddingHorizontal: 20,
  }
});

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { Action } from 'rxjs/internal/scheduler/Action';
import { Actions } from 'react-native-router-flux';
import { ScrollView } from 'react-native-gesture-handler';

const translationGetters = {
  en: () => require('../languages/en.json'),
  vi: () => require('../languages/vi.json')
}

const chooseLanguageConfig = (lgnCode) => {
  let fallback = { languageTag: 'vi' }
  if (Object.keys(translationGetters).includes(lgnCode)) {
    fallback = { languageTag: lgnCode }
  }

  const { languageTag } = fallback

  translate.cache.clear()

  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.locale = languageTag
}

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)



class ChangePassword extends Component {

  constructor(props) {
    super(props);
    //chooseLanguageConfig('vi');
    this.passwordFieldRefs = React.createRef();
    this.newPasswordFieldRefs = React.createRef();
    this.confirmPasswordFieldRefs = React.createRef();

    this.state = {
      passWord: "",
      new_password: "",
      new_password_confirm: "",
      email: '',
      submitted: false,
      isModalVisible: false,
      isModalVisible2: false,
      msgError: '',
      msgSuccess: '',
      error: false


    };
  }



  // onChange = (e) => {
  //     let target = e.target;
  //     let name = target.name;
  //     let value = target.value;
  //     this.setState({
  //       [name]: value
  //     });
  //   };

  componentDidMount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
    }
    try {
      const token = await getToken();
      const user = await getUserInfo();
      if (user) {
        this.setState({ email: user.email })
      }
    } catch (error) {
      console.log("Khong lay  duoc userInfo");
    }
  };

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
    }
  }

  handleChangeLanguage = (lgnCode) => {
    setLanguage(lgnCode);
    //this.setState({languageCode: lgnCode});

    chooseLanguageConfig(lgnCode)
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ submitted: true });

    const { email, password, new_password, new_password_confirm } = this.state;
    //Alert.alert(oldPassWord);
    if (!password || !new_password || !new_password_confirm) {
      this.setState({ msgError: translate('REQUIRED_FIELDS'), isModalVisible: true })
      // alert(translate('REQUIRED_FIELDS'));
    } else if (new_password !== new_password_confirm) {
      this.setState({ msgError: translate('NEW_PASSWORD_AND_CONFIRMATION_PASSWORD_NOT_MATCH'), isModalVisible: true })

      // alert(translate('NEW_PASSWORD_AND_CONFIRMATION_PASSWORD_NOT_MATCH'));
    } else {
      if (password, new_password, new_password_confirm) {
        this.props.changePassword(email, password, new_password, new_password_confirm);
        this.passwordFieldRefs.current.setValue(password);
        this.newPasswordFieldRefs.current.setValue(new_password);
        this.confirmPasswordFieldRefs.current.setValue(new_password_confirm);
      }
      console.log("bam nut OK - doi mat khau");
    }
  }
  renderError = error => {
    return (
      <WingBlank>
        <WhiteSpace size="lg" />
        <Text style={styles.txtError}>
          {error === "ajax error 500"
            ? translate('CONNECTION_ERROR')
            : error}
        </Text>
      </WingBlank>
    );
  };

  render() {
    const { password, new_password, new_password_confirm, submitted } = this.state;
    const { isLoading, error } = this.props;
    return (
      <SafeAreaView>
        <ScrollView>
          <KeyboardAvoidingView style={{ flex: 1, justifyContent: "space-between" }} behavior="padding" enabled>
            <View style={{ paddingHorizontal: "5%" }}>

              <TextField onChangeText={password => {
                this.setState({
                  password
                });
              }}
                onSubmitEditing={() => this.newPasswordFieldRefs.current.focus()}
                // value={this.state.oldPassword}
                label={translate('CURRENT_PASSWORD')}
                type="password"
                name="password"
                tintColor='#009347'
                secureTextEntry={true}
                error={(submitted &&
                  !password) ? translate('CURRENT_PASSWORD_IS_REQUIRED') : ''}
                ref={this.passwordFieldRefs}
              />


              <TextField onChangeText={new_password => {
                this.setState({
                  new_password
                });
              }}
                onSubmitEditing={() => this.confirmPasswordFieldRefs.current.focus()}
                tintColor='#009347'
                // value={this.state.oldPassword}
                label={translate('NEW_PASSWORD')}
                type="password"
                name="new_password"
                secureTextEntry={true}
                error={(submitted &&
                  !new_password) ? translate('NEW_PASSWORD_IS_REQUIRED') : ''}
                ref={this.newPasswordFieldRefs}
              />


              <TextField onChangeText={new_password_confirm => {
                this.setState({
                  new_password_confirm
                });
              }}
                tintColor='#009347'
                // value={this.state.oldPassword}
                label={translate('CONFIRM_PASSWORD')}
                type="password"
                name="new_password_confirm"
                secureTextEntry={true}
                error={(submitted &&
                  !new_password_confirm) ? translate('CONFIRM_PASSWORD_IS_REQUIRED') : ''}
                ref={this.confirmPasswordFieldRefs}
              />
              {error ? this.renderError(error) : null}

              {/* {isLoading ? (
                    <ActivityIndicator size="large" color={COLOR.BLUE} />
                  ) : (
                    <Button
                      type="primary"
                      onPress={this.handleSubmit}
                      //style={styles.btnLogin}
                      title="Sửa"
                    >Sửa</Button>
                  )} */}
              <View style={{ marginTop: 10, height: 70 }}>

                <TouchableOpacity
                  onPress={this.handleSubmit}
                  style={{ justifyContent: 'center', borderRadius: 5, alignItems: 'center', backgroundColor: '#009347', width: '100%', paddingVertical: 15, marginTop: 10 }}>
                  <Text style={{ color: '#FFF', fontSize: 15 }}>OK</Text>
                </TouchableOpacity>
              </View>



              <Modal
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackdropPress={() => { this.setState({ isModalVisible: false }) }}
                isVisible={this.state.isModalVisible}>
                {/* <View 
                    style={{ width: '100%', paddingVertical : 20, backgroundColor : '#FFF', justifyContent : 'center', alignItems : 'center',  }}>
                      <Text style={{fontSize : 20, fontWeight : 'bold', textAlign : 'center', color : '#ff9100'}}>{translate('ALERT')}</Text>
                      <Text style={{fontSize : 17, textAlign : 'center', marginVertical : 10}}>{this.state.msgError}</Text>
                      <View style={{width : 50, height : 50,justifyContent : 'center', alignItems : 'center', borderRadius : 25, backgroundColor : '#ff9100'}}>
                        <IconMa name='close' size={30} color={'#FFF'}></IconMa>
                      </View>
                      <TouchableOpacity 
                      onPress={() => {this.setState({isModalVisible : false})}}
                      style={{justifyContent : 'center', alignItems : 'center', backgroundColor : '#ff9100', width : '90%', paddingVertical : 10, marginTop : 10}}>
                        <Text style={{color : '#FFF', fontSize : 15}}>{translate('CLOSE')}</Text>
                      </TouchableOpacity>
                    </View> */}
              </Modal>
              {error === '.' && submitted ? (<Modal
                animationIn={'bounceIn'}
                animationOut={'bounceOut'}
                onBackdropPress={() => { this.setState({ isModalVisible2: false }) }}
                isVisible={true}>
                <View
                  style={{ width: '100%', paddingVertical: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{ fontSize: 20, fontWeight: 'black', textAlign: 'center', color: '#49bf1f' }}>{translate('notification')}</Text>
                  <Text style={{ fontSize: 17, textAlign: 'center', marginVertical: 10 }}>{translate("CHANGE_PASSWORD_IS_SUCCESSED")}</Text>
                  <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 25, backgroundColor: '#49bf1f' }}>
                    <IconMa name='check-circle' size={30} color={'#FFF'}></IconMa>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ isModalVisible2: false });
                      this.props.logOut();
                      Actions.application();
                    }}
                    style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#49bf1f', width: '90%', paddingVertical: 10, marginTop: 10 }}>
                    <Text style={{ color: '#FFF', fontSize: 15 }}>{translate('CLOSE')}</Text>
                  </TouchableOpacity>
                </View>
              </Modal>) : null}

            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>



    );
  }


}

export const mapStateToProps = state => ({
  // isLoading: state.auth.loading,
  error: state.auth.error,
  //email: state.email
});

export default connect(
  mapStateToProps,
  { changePassword, logOut }
)(ChangePassword);
