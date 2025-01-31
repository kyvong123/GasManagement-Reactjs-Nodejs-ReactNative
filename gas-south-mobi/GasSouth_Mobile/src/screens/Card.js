import React, { Component, Fragment } from 'react';
import { List, Flex, WhiteSpace } from '@ant-design/react-native/lib/';
import { View, Text, StyleSheet ,TouchableOpacity, Dimensions } from 'react-native';
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

class Card extends Component {
  constructor(props) {
    super(props);
    //chooseLanguageConfig('vi');
    this.state = {
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

  render() {
    
    return (
      <View style={styles.container}>
        <List renderHeader={() => <Text style={styles.title}>{translate('ORDER_INFORMATION')}</Text>}>
          <Item extra={<Text style={styles.itemStyle}>Pacific petro</Text>}><Text style={styles.itemStyle}>{translate('OWNER')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>PA298617</Text>}><Text style={styles.itemStyle}>{translate('SERIAL_NUMBER')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>12/2020</Text>}><Text style={styles.itemStyle}>{translate('DETERMINERS')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>Nguyễn Văn A</Text>}><Text style={styles.itemStyle}>{translate('FULL_NAME')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>12 CMT8, Phường 10, Quận 3, HCM</Text>}><Text style={styles.itemStyle}>{translate('ADDRESS')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>07/12/2018</Text>}><Text style={styles.itemStyle}>{translate('DELIVERY_DATE')}</Text></Item>
        </List>
        <List renderHeader={() => <Text style={styles.title}>{translate('RETAIL_STORE_INFORMATION')}</Text>}>
          <Item extra={<Text style={styles.itemStyle}>Cửa hàng gas số 1</Text>}><Text style={styles.itemStyle}>{translate('RETAIL_STORE_NAME')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>345 CMT8, Phường 10, Quận 3, HCM</Text>}><Text style={styles.itemStyle}>{translate('ADDRESS')}</Text></Item>
          <Item extra={<Text style={styles.itemStyle}>{`(+848) 373 00 373 - (848) 373 00 737`}</Text>}><Text style={styles.itemStyle}>{translate('PHONE')}</Text></Item>
        </List>
        <View>
            <Flex justify='center'>
                <TouchableOpacity style={styles.btn} onPress={Actions.pop} >
                  <Text style={styles.txtButton}>{translate('Confirm')}</Text>
                </TouchableOpacity>
            </Flex>
        </View>
      </View>
    );
  }
}

export default Card;