import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Button,
  WingBlank,
  Flex,
  InputItem,
  Card,
  WhiteSpace
} from "@ant-design/react-native/lib/";
import { loginUser } from "../actions/AuthActions";
import { COLOR } from "../constants";

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  txtError: {
    fontSize: 18,
    color: COLOR.RED,
  },
  btnLogin: {
    backgroundColor: "#F6921E",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  txtLogin: {
    fontSize: 18,
    textAlign: "center",
    color: 'white',
  }
});

class Customer extends Component {
  constructor(props) {
    super(props);
    //chooseLanguageConfig('vi');
    this.state = {
      name: "",
      address: "",
      submitted: false,
    };
  }

  componentDidMount = async () => {
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener('change', this.handleChangeLanguage(languageCode));
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  handleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { name, address } = this.state;

    if (numberOfCylinder.length >= numberArrays.length) {
      Alert.alert('Thông báo', 'Không được nhập số', { cancelable: false });;
    }

    // if (name && address) {
    //   // TODO:
    //   // this.props.loginUser(name.trim(), address)
    //   Alert.alert(translate('SUCCESS'), translate('HANDLING_SUCCESS'), [{ text: "Ok" }], {
    //     cancelable: false
    //   });;
    //   Actions.home();;
    // }
  };
  renderError = error => {
    return (
      <WingBlank>
        <WhiteSpace size="lg" />
        <Text style={styles.txtError}>
          {translate('CUSTOMER_INFORMATION_IS_INCORRECT_PLEASE_TRY_AGAIN')}
        </Text>
      </WingBlank>
    );;
  };
  render() {
    const { name, address, submitted } = this.state;
    const { isLoading, error } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex.Item>
          <Card>
            <Card.Header title={translate('CUSTOMER_INFORMATION')} />
            <Card.Body>
              <InputItem
                onChange={name => {
                  this.setState({
                    name
                  });
                }}
                placeholder={translate('CUSTOMER_NAME')}
              />
              {submitted &&
                !name &&
                this.renderError(translate('CUSTOMER_NAME_IS_REQUIRED'))}
              <InputItem
                // clear
                onChange={address => {
                  this.setState({
                    address
                  });
                }}
                placeholder={translate('CUSTOMER_ADDRESS')}
              />
              {submitted &&
                !address &&
                this.renderError(translate('YOU_DID_NOT_ENTER_A_CUSTOMER_ADDRESS'))}
              {error ? this.renderError(error) : null}
              <WingBlank>
                <WhiteSpace size="lg" />
                {isLoading ? (
                  <ActivityIndicator size="large" color={COLOR.BLUE} />
                ) : (
                  <TouchableOpacity
                    onPress={this.handleSubmit}
                    style={styles.btnLogin}
                  >
                    <Text style={styles.txtLogin}>{translate('IMPORT')}</Text>
                  </TouchableOpacity>
                )}
              </WingBlank>
            </Card.Body>
          </Card>
        </Flex.Item>
      </Flex>

    );
  }
}

export const mapStateToProps = state => ({
  isLoading: state.auth.loading,
  error: state.auth.error,
});;

export default connect(
  mapStateToProps,
  { loginUser }
)(Customer);

