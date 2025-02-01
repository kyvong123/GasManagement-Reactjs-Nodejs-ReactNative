import React, { Component, Fragment } from 'react';
import { List, Flex, WhiteSpace } from '@ant-design/react-native/lib/';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { COLOR } from '../constants';

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

const { height, width } = Dimensions.get('window');

const Item = List.Item;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLOR.WHITE,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    padding: 10,
    backgroundColor: COLOR.LIGHTBLUE,
    color: COLOR.WHITE
  },
  itemStyle: {
    color: COLOR.BLUE,
    fontSize: 18,
  },
  btn: {
    backgroundColor: COLOR.LIGHTBLUE,
    width: width*0.6,
    padding: 20,
    borderRadius: 6
  },
  txtButton: {
    textAlign: 'center',
    color: COLOR.WHITE,
    fontSize: 20
  },
});

class Product extends Component {
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
      <ScrollView style={styles.container}>
        <List renderHeader={() => <Text style={styles.title}>{translate('PRODUCT_INFORMATION')}</Text>}>
          <Item extra={<Text style={styles.itemStyle}>Pacific petro</Text>}><Text style={styles.itemStyle}>{translate('NAME_SHIPPER')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>Pacific petro</Text>}><Text style={styles.itemStyle}>{translate('SDT')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>Pacific petro</Text>}><Text style={styles.itemStyle}>{translate('GENUINE_PRODUCTS_OF')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>PA298617</Text>}><Text style={styles.itemStyle}>{translate('SERIAL_NUMBER')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>Xám</Text>}><Text style={styles.itemStyle}>{translate('COLOR')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>12 kg</Text>}><Text style={styles.itemStyle}>{translate('WEIGHT')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>Đang ở chủ sở hữu</Text>}><Text style={styles.itemStyle}>{translate('POSITION')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>346.000 VND</Text>}><Text style={styles.itemStyle}>{translate('PRICE')}</Text></Item>
        </List>
        <List renderHeader={() => <Text style={styles.title}>{translate('MANUFACTURER_INFORMATION')}</Text>}>
          <Item extra={<Text style={styles.itemStyle}></Text>}><Text style={styles.itemStyle}>Pacific petro</Text></Item>
          <Item extra={<Text style={styles.itemStyle}></Text>}><Text style={styles.itemStyle}>99 Ích Thạnh, Phường Trường Thạnh, Q9</Text></Item>
          <Item extra={<Text style={styles.itemStyle}></Text>}><Text style={styles.itemStyle}>{`Điện Thoại (+848) 373 00 896 - (848) 373 00 897`}</Text></Item>
        </List>
        <View>
          { this.props.productAction === 'importCyclinder' && 
            <Fragment>
              <Flex justify='center'>
                <TouchableOpacity style={styles.btn} onPress={Actions.pop} >
                  <Text style={styles.txtButton}>{translate('CONTINUE_IMPORT')}</Text>
                </TouchableOpacity>
              </Flex>
              <WhiteSpace />
              <Flex justify='center'>
                <TouchableOpacity style={styles.btn} onPress={Actions.importSummary} >
                  <Text style={styles.txtButton}>{translate('FINISH_IMPORT')}</Text>
                </TouchableOpacity>
              </Flex>
            </Fragment>
          }
          
          { this.props.productAction === 'exportCyclinder' && 
            <Fragment>
              <Flex justify='center'>
                <TouchableOpacity style={styles.btn} onPress={Actions.pop} >
                  <Text style={styles.txtButton}>{translate('CONTINUE_EXPORT')}</Text>
                </TouchableOpacity>
              </Flex>
              <WhiteSpace />
              <Flex justify='center'>
                <TouchableOpacity style={styles.btn} onPress={Actions.exportSummary} >
                  <Text style={styles.txtButton}>{translate('FINISH_EXPORT')}</Text>
                </TouchableOpacity>
              </Flex>
            </Fragment>
          }
        </View>
      </ScrollView>
    );
  }
}

export default Product;