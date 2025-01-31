import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, Platform, Picker, PickerIOS } from "react-native";
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
  btnReport: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
});

class AlertComponent extends Component {
  constructor(props) {
    super(props);
    //chooseLanguageConfig('vi');
    this.state = {
      alertTo: "all",
      //languageCode: ""
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

  handleSubmit = () => {
    Alert.alert(
      translate('FEEDBACK_SENT_SUCCESSFULLY'),
      translate('YOUR_FEEDBACK_HAS_BEEN_SENT_SINCERE_THANKS'),
      [{ text: "Ok" }],
      { cancelable: false }
    );
    Actions.home();;
  };

  render() {
    return (
      <Flex style={styles.container}>
        <Flex.Item>
          <Card>
            <Card.Body>
              {Platform.OS === 'ios'
                ?
                <PickerIOS
                  selectedValue={this.state.alertTo}
                  style={{ height: 50, width: 300 }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ alertTo: itemValue })
                  }
                >
                  <Picker.Item label={translate('SEND_ALL')} value="all" />
                  <Picker.Item label="Pacific petro" value="pacific" />
                  <Picker.Item label="Petrolimex" value="petro" />
                </PickerIOS>
                :
                <Picker
                  selectedValue={this.state.alertTo}
                  style={{ height: 50, width: 300 }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ alertTo: itemValue })
                  }
                >
                  <Picker.Item label={translate('SEND_ALL')} value="all" />
                  <Picker.Item label="Pacific petro" value="pacific" />
                  <Picker.Item label="Petrolimex" value="petro" />
                </Picker>
              }
              <WingBlank>
                <TextareaItem
                  // value={this.state.val}
                  onChange={this.onChange}
                  rows={5}
                  placeholder={translate('MESSAGE_CONTENT')}
                />
              </WingBlank>
              <WingBlank>
                <WhiteSpace size="lg" />
                <Button
                  type="primary"
                  onPress={this.handleSubmit}
                  style={styles.btnReport}
                >
                  {translate('SEND')}
                </Button>
              </WingBlank>
            </Card.Body>
          </Card>
        </Flex.Item>
      </Flex>
    );
  }
}

export default AlertComponent;