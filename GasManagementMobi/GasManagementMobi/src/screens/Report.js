import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Button,
  WingBlank,
  Flex,
  InputItem,
  Card,
  WhiteSpace,
  TextareaItem
} from "@ant-design/react-native/lib/";
import { reportCyclinder } from "../actions/CyclinderActions";

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
    alignItems: "flex-start"
  },
  btnSend: {
		backgroundColor: "#F6921E",
		height:50,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
  },
  txtSend: {
		fontSize: 18,
		textAlign: "center",
		color: 'white',
	}
});

class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
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
    //setLanguage(lgnCode);
    chooseLanguageConfig(lgnCode)
  }

  handleSubmit = e => {
    e.preventDefault();
    const { cyclinderId } = this.props;;
    const { description } = this.state;
    if (description && cyclinderId) {
      this.props.reportCyclinder(cyclinderId, description);;
    }
    // Alert.alert(
    //   'Gửi phản hồi thành công',
    //   'Phản hồi của bạn đã được gửi. Chân thành cảm ơn.',
    //   null,
    //   [
    //     {text: 'Ok'},
    //   ],
    //   { cancelable: false }
    // )
  };
  render() {
    return (
      <Flex style={styles.container}>
        <Flex.Item>
          <Card>
            <Card.Body>
              <WingBlank>
                <TextareaItem
                  // value={this.state.val}
                  onChange={description => {
                    this.setState({
                      description
                    });
                  }}
                  rows={5}
                  placeholder={translate('MESSAGE_CONTENT')}
                />
              </WingBlank>
              <WingBlank>
                <WhiteSpace size="lg" />
                <TouchableOpacity
                  onPress={this.handleSubmit}
                  style={styles.btnSend}
                >
                  <Text style={styles.txtSend}>{translate('SEND')}</Text>
                </TouchableOpacity>
              </WingBlank>
            </Card.Body>
          </Card>
        </Flex.Item>
      </Flex>

    );
  }
}

export const mapStateToProps = state => ({
  cyclinderId: state.cylinders.cyclinder.id,
  error: state.cylinders.error,
  isLoading: state.cylinders.loading
});;
export default connect(
  mapStateToProps,
  { reportCyclinder }
)(Report);

