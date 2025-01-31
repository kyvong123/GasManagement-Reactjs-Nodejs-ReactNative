import React, { Component } from 'react'
import {
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet
} from 'react-native'
import { setLanguage, getLanguage } from "../helper/auth";
import IconOcticons from 'react-native-vector-icons/Octicons'
import { Actions } from 'react-native-router-flux';
import { COLOR } from '../constants';
import Img from '../constants/image'

import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { ScrollView } from 'react-native-gesture-handler';

import {
  getCompletedOrderAndCylinders
} from '../actions/OrderActions';
import { connect } from "react-redux";
const { width } = Dimensions.get('window')

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
const handleChangeLanguage = (lgnCode) => {
  setLanguage(lgnCode);
  chooseLanguageConfig(lgnCode)
}

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

class OrderManagement extends Component {

  constructor(props) {
    super(props)
    this.state = {
      listCode: props.data.array
    }
  }

  componentDidMount = async () => {
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
      }
    } catch (error) {
      console.log(error);
    }

    // ---- Get Completed Order And Cylinder if status === 'complete'
    if (this.props.data.status == 'COMPLETED') {
      this.props.getCompletedOrderAndCylinders(this.props.data.id);
    }
  }

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
    }
  }

  onShowMore(index) {
    const states = this.state
    states.listCode[index].isChoose = states.listCode[index].isChoose ? false : true
    this.setState({ ...states.listCode })
  }

  render() {
    const {
      tittle,
      status,
      orderCode,
      customerId,
      listCylinder
    } = this.props.data
    const {
      start,
      end,
      number
    } = this.props
    const states = this.state
    let checkStatus = translate('INIT')
    switch (status) {
      case "CONFIRMED":
        checkStatus = translate("CONFIRMED")
        break;
      case "DELIVERING":
        checkStatus = translate('DELIVERING')
        break;
      case "DELIVERED":
        checkStatus = translate('DELIVERED')
        break;
      case "COMPLETED":
        checkStatus = translate("COMPLETED")
        break; case "CANCELLED":
        checkStatus = translate("CANCELLED")
        break;
      default:
        break;
    }

    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLOR.WHITE,
          padding: 15
        }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <Text
            style={styles.textGray}
          >
            {translate('ORDERS')}:
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: COLOR.BLACK,
              marginLeft: 5,
              fontWeight: 'bold'
            }}
            numberOfLines={1}
          >
            {orderCode}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <Text style={styles.textGray} numberOfLines={1}>
            {translate("CUSTOMER_NAME")}{": "}<Text style={{ color: COLOR.DARKGRAY }}> {customerId.invoiceName}</Text>
          </Text>

          <Text
            style={[styles.textGray]}
          >
            {start}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 5
        }}>
          <IconOcticons
            name='location'
            size={20}
            color={COLOR.DARKGRAY} />
          <Text style={{
            fontSize: 14,
            color: COLOR.GRAY,
            marginLeft: 5
          }}>
            {customerId.invoiceAddress}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
            marginBottom: 10,
            alignItems: 'center'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <IconOcticons
              name='clock'
              size={20}
              color={COLOR.DARKGRAY} />
            <Text
              style={{
                fontSize: 14,
                color: COLOR.DARKGRAY,
                marginLeft: 5
              }}
            >
              {end}
            </Text>
          </View>

          {
            status == "COMPLETED" ? (
              <Text
                style={styles.textGREEN}
              > {translate("STATUS")}{": "}{checkStatus}
              </Text>) : (<Text
                style={styles.textRED}
              > {translate("STATUS")}{": "}{checkStatus}
              </Text>)
          }
          <Text
            style={styles.textGray}
          >
            {number}{" "}{translate('CYLINDER')}
          </Text>
        </View>

        {
          listCylinder.map((item, index) => {
            return [
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: index > 0 ? 10 : 0
                }}
              >
                <Text
                  style={styles.textBlack}
                  numberOfLines={1}
                >
                  {`${item.cylinderType} - ${item.valve} - ${item.numberCylinders}`}
                </Text>

              </View>
              // , item.isChoose && <FlatList */}
              //   showsVerticalScrollIndicator={false}
              //   scrollEnabled
              //   data={item.listCode}
              //   contentContainerStyle={{ alignItems: 'center' }}
              //   keyExtractor={(item, index) => index.toString()}
              //   renderItem={({ item, index }) => { */}
              //     return <Text */}
              //       style={[styles.textBlack, {
              //         marginTop: index > 0 ? 5 : 15
              //       }]}
              //     >
              //       {item}
              //     </Text>
              //   }}
              // />
            ]
          })
        }
        {
          status == "COMPLETED" ? (<View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, color: COLOR.BLUE }}> {translate('DETAIL')}</Text>
            </View>
            <View>
              <FlatList data={this.props.result_CompletedOrderAndCylinders}
                keyExtractor={(item, index) => 'key' + item}
                renderItem={({ item, index }) => {
                  console.log('item.item', item)
                  console.log('index', index)
                  if (item.status == 'DELIVERED')
                    return (
                      <View style={{ marginBottom: 10 }}>
                        <Text style={{ color: COLOR.GREEN }}>{translate('LAN')} {index + 1} : {item.cylinders.length} {translate('CYLINDER')}</Text>
                        {
                          item.cylinders.map((cylinder) => {
                            return (
                              <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingHorizontal: 15 }}>
                                <Text>{cylinder.cylinderType}</Text>
                                <Text>{cylinder.color}</Text>
                                <Text>{cylinder.serial}</Text>
                              </View>
                            )
                          })
                        }
                      </View>
                    )
                }}
              />
            </View>

          </View>
          )
            : null
        }
      </ScrollView >
    )
  }
}

const styles = StyleSheet.create({
  textGray: {
    fontSize: 16,
    color: COLOR.GRAY,
  },
  textBlue: {
    fontSize: 16,
    color: COLOR.BLUE,
  },
  textGREEN: {
    fontSize: 16,
    color: COLOR.GREEN,
  },



  textORANGE: {
    fontSize: 16,
    color: COLOR.ORANGE,
  },
  textRED: {
    fontSize: 16,
    color: COLOR.RED,
  },

  textBlack: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR.BLACK,
    paddingLeft: 5
  }
})
export const mapStateToProps = state => {
  return ({
    result_CompletedOrderAndCylinders: state.order.result_GetCompletedOrderAndCylinders.data,
  })
}
export default connect(
  mapStateToProps,
  {
    getCompletedOrderAndCylinders
  }
)(OrderManagement)
