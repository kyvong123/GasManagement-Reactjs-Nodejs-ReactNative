import React, { Component, useState } from 'react'
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Switch
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { setLanguage, getLanguage } from "../helper/auth";
import { WingBlank, WhiteSpace } from '@ant-design/react-native/lib';
import { connect } from "react-redux";
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getToken, getUserInfo } from "../helper/auth";
import { setNewOrder, setListOrder } from '../actions/OrderActions'
import LineOrderItem from '../../src/components/LineOrderItem'
import { COLOR } from '../constants';
import Images from "../constants/image"
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
//thu vien moi
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { Actions } from 'react-native-router-flux';
import { createOrderNew, getAddressStationClient, getPlayid, sendNotification } from '../api/orders_new';
import Toast from 'react-native-toast-message'

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

class UserInfomationScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      timing: null,
      date: null,
      note: null,
      isLoading: false,
      //isNeedTimeDeliver: false,
      // numberBtn: 0,
      //checksw: false,
      error: '',
      selectedDiaChiKH: this.props.userInfor.address,
      selectedDiaChiTram: "",
      placeOfDelivery: "CUSTOMER",
      orderType: "KHONG",
      listDate: this.props.delivery,
      adderssStation: this.props.userInfor.address
    }
    this.user = {};
    this.noteValueRef = React.createRef();
    this.dateDelivering = React.createRef();
    this.timeDelivering = React.createRef();

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
  }

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
    }
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.props.orderSuccess?.success && this.state.isLoading) {
      // this.props.setListOrder([])
      this.setState({ isLoading: false })
      Alert.alert(
        translate("notification"),
        translate('CREATE_NEW_ORDER_SUCCESS'),
        [
          { text: 'Ok' },
        ],
        { cancelable: false }
      )
      this.props.navigation.navigate('home');
    } else {

    }
  }
  showModal() {
    this.setState({ checksw: true });
  }
  HideModal = () => {
    this.setState({ checksw: false });
  };

  handleConfirm = (dateTime) => {
    this.HideModal();

    let time = new Date(dateTime);
    const date = new Date(time.getTime());
    let hour = date.getHours();
    let min = date.getMinutes();
    if (hour < 10) {
      hour = `0${hour}`
    }
    if (min < 10) {
      min = `0${min}`
    }
    const gio = `${hour}:${min}`
    this.setState({ timing: gio });

  };


  getFullTime(text, isTiming) {
    if (!isTiming) {
      const newDate = text.split('-')
      return newDate[0] + '/' + newDate[1] + '/' + newDate[2]
    }
    return text
  }

  render() {
    const { userInfor, address, nameCustomer } = this.props;
    const visibilityTime = 2000;

    //formmat date
    const formatDate = (date) => {
      const newDate = date.split('-')
      const text = newDate[2] + '-' + newDate[1] + '-' + newDate[0]
      return text
    }

    //danh địa chỉ trạm theo khách hàng
    const getAddressStation = async (isChildOf) => {
      const response = await getAddressStationClient(isChildOf)
      if (response.status) {
        const temp = this.props.delivery.map((e) => ({ deliveryAddress: response.data.address, deliveryDate: e.deliveryDate }))
        this.setState({
          selectedDiaChiTram: 'địa chỉ trạm', selectedDiaChiKH: '',
          placeOfDelivery: 'STATION', adderssStation: response.data.address,
          listDate: temp
        })
      }
    }

    const createDateItem = (item, index) => {
      return <View style={styles.viewDateItem}>
        <FontAwesome5
          name="calendar-alt"
          size={20}
          style={styles.txtGray}
        />
        <Text style={styles.txtDate} numberOfLines={1} > {formatDate(item.deliveryDate)} </Text>
      </View>
    }
    return (
      <SafeAreaView
        style={styles.container}
      >
        <Toast
          backgroundColor="#fffff"
          autoHide={true}
          visibilityTime={visibilityTime}
          ref={(ref) => {
            Toast.setRef(ref);
          }}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        >
          <ScrollView
            style={{ paddingHorizontal: 15, paddingBottom: 10 }}
          >
            <LineOrderItem showLine={2} />
            <Text style={[styles.textBlue, { marginBottom: 5 }]}>
              {translate('DELIVERY_INFORMATION')}
            </Text>
            <Text style={[styles.title, { color: COLOR.BLACK, fontWeight: 'bold' }]}>
              {this.props.userInfor.name.toUpperCase()}
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.ViewCheckBox(this.state.selectedDiaChiKH)}
                  onPress={() => {
                    this.setState({
                      selectedDiaChiTram: '', selectedDiaChiKH: this.props.userInfor.address,
                      placeOfDelivery: 'CUSTOMER', listDate: this.props.delivery, adderssStation: this.props.userInfor.address
                    })
                  }} />
                <Text style={[styles.title, {
                  fontSize: 14,
                  paddingVertical: 2,
                  color: '#009347',
                  fontWeight: 'bold',
                  marginTop: 10,
                  marginLeft: 5
                }]}>Địa chỉ khách hàng</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.ViewCheckBox(this.state.selectedDiaChiTram)}
                  onPress={() => {
                    getAddressStation(this.props.userInfor.isChildOf)
                  }} />
                <Text style={[styles.title, {
                  fontSize: 14,
                  paddingVertical: 2,
                  color: '#009347',
                  fontWeight: 'bold',
                  marginTop: 10,
                  marginLeft: 5
                }]}>Địa chỉ trạm</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', }}>
              <View style={{ flex: 1, flexDirection: 'row', }}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={15}
                  style={[styles.txtGray, { marginTop: 5 }]}
                />
                <Text style={[styles.title, { marginBottom: 5, paddingLeft: 3 }]}>
                  {translate('ADDRESS')}:
                </Text>
              </View>
              <View style={{ flex: 4, paddingLeft: 5 }}>
                <Text style={[styles.title,]}>
                  {this.state.adderssStation}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1.3, flexDirection: 'row', }}>
                <FontAwesome5
                  name="phone-alt"
                  size={14}
                  style={[styles.txtGray, { marginTop: 5 }]}
                />
                <Text style={[styles.title, { marginBottom: 5, paddingLeft: 3 }]}>
                  {translate('PHONE')}:
                </Text>
              </View>
              <View style={{ flex: 3.7, paddingLeft: 5 }}>
                <Text style={[styles.title,]}>
                  {this.props.userInfor.phone}
                </Text>
              </View>
            </View>
            <Text style={styles.textBlue}>
              {translate('DATE_DELIVER')}
            </Text>
            {/* {this.RenderItem(checkDate, false)} */}
            <View style={{}}>
              {this.props.delivery.map((data, index) => createDateItem(data, index))}
            </View>
            {/* {
              this.state.selectedDonCoc !== "" || this.state.selectedDonMuonCoc !== "" ? null
                : <Text style={{ color: 'red', fontSize: 11 }}>{this.state.error}</Text>
            } */}
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.ViewCheckBox(this.state.selectedDonCoc)}
                  onPress={() => {
                    this.setState({ selectedDonCoc: "ĐCV" })
                    this.setState({ selectedDonMuonCoc: "" })
                    this.setState({ orderType: "COC_VO" })
                  }} />
                <Text style={[styles.title2, { fontSize: 18 }]}>Đơn cọc vỏ</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity style={styles.ViewCheckBox(this.state.selectedDonMuonCoc)}
                  onPress={() => {
                    this.setState({ selectedDonMuonCoc: "ĐMV" })
                    this.setState({ selectedDonCoc: "" })
                    this.setState({ orderType: "MUON_VO" })
                  }} />
                <View>
                  <Text style={[styles.title2, { fontSize: 18 }]}>Đơn mượn vỏ</Text>
                </View>
              </View>
            </View> */}
            <Text style={styles.textBlue}>
              {translate('NOTE')}
            </Text>

            <TextInput
              onChangeText={(value) => this.setState({ note: value })}
              ref={this.noteValueRef}
              style={styles.textInput}
              multiline
              placeholder={translate('IMPORT_NOTES') + '...'}
              placeholderTextColor={COLOR.GRAY}
            />
          </ScrollView>
        </KeyboardAwareScrollView>
        {this.state.isLoading ? <ActivityIndicator size="large" color={COLOR.GREEN_MAIN} /> :
          <TouchableOpacity
            style={styles.btnContinue}
            onPress={async () => {
              this.setState({ isLoading: true })
              const data = {
                note: !this.state.note ? 'Không có ghi chú' : this.state.note,
              }

              const supplier = userInfor.isChildOf//userInfor.userRole === "SuperAdmin" ? userInfor.id : userInfor.isChildOf
              const area = userInfor.area || "625e74ba76fcc80f2c2504c2"
              // const orderType = this.state.orderType
              const delivery = this.state.listDate
              const placeOfDelivery = this.state.placeOfDelivery
              const body = {
                ...data, ...this.props.createOrder,
                supplier, area, delivery, placeOfDelivery
              }
              //tạo đơn hàng
              const response = await createOrderNew(body)
              // console.log(response.data)
              //await this.props.setNewOrder(userInfor.id, { ...data, ...this.props.createOrder })
              // response.success ? Actions['CreateNewOrderSuccessFull']({}) : null
              if (response.success) {
                //   //get playid
                const playid = await getPlayid('Tong_cong_ty', 'To_nhan_lenh')
                // console.log("playid", playid.data[0].playerID)
                for (let i = 0; i < playid.data.length; i++) {
                  //thông báo
                  const body2 = {
                    title: "Bạn có đơn hàng mới",
                    data: `Đơn hàng số : ${response.data.orderCode}`,
                    device: `${playid.data[i].playerID},${playid.data[i].playerIDWeb ?? ''}`,
                    appname: "Gassouth",
                    iddata: response.data.id
                  }
                  const response2 = await sendNotification(body2)
                }
                Actions['CreateNewOrderSuccessFull']({})
              }
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: COLOR.WHITE
              }}
            >
              {translate('ACCEPTED_ORDER')}
            </Text>
          </TouchableOpacity>}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  textBlue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009347',
    marginTop: 15,
    marginBottom: 15
  },
  txtDate: {
    marginLeft: 5,
    color: COLOR.GRAY,
    fontSize: 14
  },
  title: {
    fontSize: 16,
    marginTop: 5,
  },
  inputBottom: {
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: 5
  },
  btnContinue: {
    backgroundColor: COLOR.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15
  },
  textInput: {
    height: 150,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    padding: 5,
    textAlignVertical: 'top'
  },
  textNotify: {
    color: COLOR.WHITE,
    fontSize: 14,
    textAlignVertical: 'top',
    top: -8,
    right: -3
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  viewDateItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    borderColor: COLOR.DARKGRAY,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '40%',
  },
  title2: {
    fontSize: 15,
    paddingVertical: 2,
    color: '#009347',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 5
  },
  txtGray: {
    color: COLOR.GRAY,
  },
  ViewCheckBox: (isChoosing) => {
    return {
      marginTop: 10,
      width: 20,
      height: 20,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#009347',
      backgroundColor: isChoosing === "" ? COLOR.WHITE : '#81ad61',
    };
  },
})

export const mapStateToProps = state => {
  return ({
    orderSuccess: state.order.orderSuccess,
    userInfor: state.auth.user,
  })
};

export default connect(
  mapStateToProps,
  {
    setNewOrder,
    // setListOrder 
  }
)(UserInfomationScreen);
