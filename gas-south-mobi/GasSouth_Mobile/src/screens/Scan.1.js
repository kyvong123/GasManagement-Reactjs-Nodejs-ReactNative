import React, { Component } from "react";
import { Button, WingBlank, WhiteSpace } from "@ant-design/react-native/lib/";
import { View, StyleSheet, Dimensions } from "react-native";
import { Actions } from "react-native-router-flux";
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

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: COLOR.WHITE
  },
  scanContainer: {
    width: width - 80,
    height: height * 0.5,
    backgroundColor: COLOR.LIGHTBLUE,
    marginTop: 10,
    marginLeft: 40,
    marginRight: 40,
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});

class Scan extends Component {
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scanContainer} />
        <WingBlank>
          <WhiteSpace size="lg" />
          <Button
            type="primary"
            onPress={Actions.product}
            style={styles.btnLogin}
          >
            {translate('SCAN')}
          </Button>
        </WingBlank>
      </View>
    );
  }
}

export default Scan;

