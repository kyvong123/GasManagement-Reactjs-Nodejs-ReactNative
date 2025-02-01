import React, { Component } from "react";
import { connect } from "react-redux";;
import { List, Button, Flex, WhiteSpace } from "@ant-design/react-native/lib/";
import { Actions } from "react-native-router-flux";
import isEmpty from "lodash/isEmpty";;
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { COLOR } from "../constants";
import { fetchCylinder } from "../actions/CyclinderActions";
import { getPosition } from "../helper/utils";;

import { setLanguage, getLanguage } from "../helper/auth";

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import CustomStatusBar  from '../components/CustomStatusBar'
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

const { width } = Dimensions.get("window");
const Item = List.Item;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLOR.WHITE
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
    backgroundColor: COLOR.LIGHTBLUE,
    color: COLOR.WHITE,
  },
  itemStyle: {
    color: COLOR.BLUE,
    fontSize: 18
  },
  btnScan: {
    backgroundColor: COLOR.LIGHTBLUE,
    width: width * 0.6,
    padding: 20,
    borderRadius: 6,
  },
  btnReport: {
    padding: 20,
  },
  txtEmpty: {
    textAlign: "center",
    color: COLOR.BLUE,
    fontSize: 20,
    padding: 20
  },
  txtScan: {
    textAlign: "center",
    color: COLOR.WHITE,
    fontSize: 20,
  },
  txtSerials: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
    padding: 20,
  },
  txtSerial: {
    color: COLOR.ORANGE
  },
});

// <Item extra={<Text style={styles.itemStyle}>12345</Text>}><Text style={styles.itemStyle}>Tên sản phẩm</Text></Item>
class Statistic extends Component {
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

  renderSampleInfo = () => {
    const { cyclinder } = this.props;;
    return (
      <View>
        <List
          renderHeader={() => (
            <Text style={styles.title}>{translate('STATISTICAL_INFORMATION')}</Text>
          )}
        >
          <Item extra={<Text style={styles.itemStyle}>1000</Text>}>
            <Text style={styles.itemStyle}>{translate('TOTAL_IMPORT')}</Text>
          </Item>
          <Item extra={<Text style={styles.itemStyle}>1000</Text>}>
            <Text style={styles.itemStyle}>{translate('TOTAL_EXPORT')}</Text>
          </Item>
        </List>
      </View>
    );;
  };
  renderInfo = () => {
    const { cyclinder } = this.props;;
    return (
      <View>
        <List
          renderHeader={() => (
            <Text style={styles.title}>{translate('STATISTICAL_INFORMATION')}</Text>
          )}
        >
          <Item extra={<Text style={styles.itemStyle}>Pacific petro</Text>}>
            <Text style={styles.itemStyle}>{translate('GENUINE_PRODUCTS_OF')}</Text>
          </Item>
          <Item
            extra={<Text style={styles.itemStyle}>{cyclinder.serial}</Text>}
          >
            <Text style={styles.itemStyle}>{translate('SERIAL_NUMBER')}</Text>
          </Item>
          <Item extra={<Text style={styles.itemStyle}>{cyclinder.color}</Text>}>
            <Text style={styles.itemStyle}>{translate('COLOR')}</Text>
          </Item>
          <Item
            extra={<Text style={styles.itemStyle}>{cyclinder.weight}</Text>}
          >
            <Text style={styles.itemStyle}>{translate('WEIGHT')}</Text>
          </Item>
          <Item
            extra={
              <Text style={styles.itemStyle}>
                {getPosition(cyclinder.placeStatus)}
              </Text>
            }
          >
            <Text style={styles.itemStyle}>{translate('POSITION')}</Text>
          </Item>
          <Item extra={<Text style={styles.itemStyle}>346.000 VND</Text>}>
            <Text style={styles.itemStyle}>{translate('PRICE')}</Text>
          </Item>
        </List>
      </View>
    );;
  };
  goToScanManual = () => Actions.replace("scanManual");
  renderEmpty = () => {
    const { scanResults } = this.props;;
    return (
      <ScrollView style={styles.container}>
        <Flex justify="center" direction="column">
          <Text style={styles.txtEmpty}>
            {translate('NO_SERIAL_FOUND')}:{" "}
          </Text>
          <View style={styles.txtSerials}>
            {scanResults.map((item, i) => (
              <Text style={styles.txtSerial} key={i}>
                {item.trim()};{" "}
              </Text>
            ))}
          </View>
        </Flex>
        <Flex justify="center" direction="column">
          <Flex.Item>
            <TouchableOpacity style={styles.btnScan} onPress={Actions.pop}>
              <Text style={styles.txtScan}>{translate('RETRY')}</Text>
            </TouchableOpacity>
          </Flex.Item>
          <WhiteSpace />
          <Flex.Item>
            <TouchableOpacity
              style={styles.btnScan}
              onPress={this.goToScanManual}
            >
              <Text style={styles.txtScan}>{translate('ENTER_THE_CODE_MANUALLY')}</Text>
            </TouchableOpacity>
          </Flex.Item>
        </Flex>
      </ScrollView>
    );;
  };
  renderButtons = () => {
    return (
      <View style={styles.btnReport}>
        <Button type="warning" onPress={Actions.report}>
          {translate('SEND_FEEDBACK')}
        </Button>
      </View>
    );;
  };
  render() {
    return this.renderSampleInfo();;
    // const { cyclinder, loading } = this.props
    // if(loading){
    //   return  <ActivityIndicator size="large" color={COLOR.BLUE} />
    // }
    // if(isEmpty(cyclinder)) {
    //   { return this.renderEmpty() }
    // }
    // return (
    //   <View style={styles.container}>
    //     {this.renderInfo()}
    //     {this.renderButtons()}
    //   </View>
    // );
  }
}
// export const mapStateToProps = state => ({
//   cyclinder: state.cylinders.cyclinder,
//   scanResults: state.cylinders.scanResults,
//   loading: state.cylinders.loading,
// })

export default connect(
  null,
  null
)(Statistic);

