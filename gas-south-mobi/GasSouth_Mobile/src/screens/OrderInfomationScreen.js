import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native'
import { setLanguage, getLanguage } from "../helper/auth";
import Icon from 'react-native-vector-icons/FontAwesome'
import LineOrderItem from '../../src/components/LineOrderItem'
import { setListOrder } from '../actions/OrderActions'
import { Actions } from 'react-native-router-flux';
import { COLOR } from '../constants';
import Img from '../constants/image'
import { connect } from "react-redux";
import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-datepicker'
import Images from "../constants/image"
import { createOrderNew, getPrice, sendNotification } from '../api/orders_new';
import { DDTM, TNL, TONG_CONG_TY } from '../types';
import Checkbox from './../components/CheckBox';

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

let num = 0;

class OrderInfomationScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      listOrder: [{
        colorGas: '',
        categoryCylinder: '',
        manufacture: '',
        quantity: '',
        type: '',
        valve: '',
        price: null,
      }],
      delivery: [{
        deliveryAddress: this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == TNL ||
          this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == DDTM ?
          this.props.address : this.props.userinfo.address,
        deliveryDate: null,
      }],
      date: null,
      date2: null,
      numberOrder: props.numberOrder,
      customerID: '',//id của khách hàng vi gộp chung nên 3 id sẽ giống nhau
      agencyId: '',//id của chi nhánh
      warehouseId: '',//id của kho sản xuât
      type: '',
      error: null,
      isShow: false,
      selectedDonMuonCoc: "",
      selectedDonCoc: "",
      selectedDonBinh: "don binh",
      orderType: "KHONG",
      cylinderType: "BINH",
      isSelected: false,
      createdAtDate: new Date()
    }
    // this.CustomerIDpickerCustomRef = React.createRef();
    // this.AgencypickerCustomRef = React.createRef();
    // this.ExportWareHousepickerCustomRef = React.createRef();
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
    if (this.props.listCylinder) {
      let sum = 0
      let checkListOrder = []
      this.props.listCylinder.map((item) => {
        sum += +item.quantity
        let check = false
        checkListOrder.map((e) => {
          if (item.categoryCylinder === e.categoryCylinder &&
            e.colorGas === item.colorGas && e.valve === item.valve &&
            e.manufacture === item.manufacture) {
            check = true
            e.quantity = +e.quantity + +(item.quantity)
          }
        })
        if (!check) {
          checkListOrder.push({
            ...item
          })
        }
        this.setState({
          customerID: this.props.userinfo.id, agencyId: item.manufacture.id,
          warehouseId: item.manufacture.id, type: item.type
        })
      }

      )
      this.setState({ numberBtn: sum, listOrder: checkListOrder })
    }
  }

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
    }
  }
  //linh them
  OrderType(type) {

    let Type_ = 'Sản phẩm'
    switch (type) {
      case 'V':
        Type_ = 'Vỏ'
        break
      case 'B':
        Type_ = 'Bình'
        break
    }
    return <View>

      <Text style={[styles.tittle, { marginLeft: -50 }]}>
        Loại : {Type_}
      </Text>
    </View>
  }

  getFullTime(text, isTiming) {
    if (!isTiming) {
      const newDate = text.split('-')
      return newDate[0] + '/' + newDate[1] + '/' + newDate[2]
    }
    return text
  }

  render() {
    const visibilityTime = 2000;

    // changeAmount
    const changeAmountPlus = (item, index) => {
      var element = 0
      var number = item.quantity + 1
      let array = [...this.state.listOrder]
      array[index].quantity = number
      //update numberOrder
      for (let index = 0; index < array.length; index++) {
        element += array[index].quantity;
      }
      this.setState({
        listOrder: array,
        numberOrder: element
      });
    }
    // changeAmount
    const changeAmountMinus = (item, index) => {
      var element = 0
      var number = item.quantity - 1
      if (number < 2) {
        let array = [...this.state.listOrder]
        array[index].quantity = 1
        //update numberOrder
        for (let index = 0; index < array.length; index++) {
          element += array[index].quantity;
        }
        this.setState({
          listOrder: array,
          numberOrder: element
        });
      } else {
        let array = [...this.state.listOrder]
        array[index].quantity = number
        //update numberOrder
        for (let index = 0; index < array.length; index++) {
          element += array[index].quantity;
        }
        this.setState({
          listOrder: array,
          numberOrder: element
        });
      }
    }

    //lấy đơn giá 
    const getListPrice = async (date, cylinderType) => {
      //lấy id theo id khách hàng hoặc id của khách hàng mà tổ nhận lệnh đã chọn
      let temID = null
      this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == TNL ||
        this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == DDTM ?
        temID = this.props.inforCustomers.idCustomersGetPrice : temID = this.props.userinfo.id

      const response = await getPrice(date, temID, cylinderType)
      console.log(response)
      let arrTemp = this.state.listOrder// danh sách sản phẩm khi chưa có đơn giá
      for (let i = 0; i < arrTemp.length; i++) {
        if (response.success) {
          // console.log(response.data[0].priceDetail)

          for (let j = 0; j < response.data.length; j++) {
            const obj = response.data[j].priceDetail.find(e => e.manufacture === arrTemp[i].manufacture &&
              e.categoryCylinder === arrTemp[i].categoryCylinder);
            if (obj !== undefined) {
              arrTemp[i].price = obj.price;
              // console.log("######1",obj.price )
              break;
            } else {
              arrTemp[i].price = null
              // console.log("######2",obj.price )
            }
          }
          // response.data.map(q => {
          //   // console.log("@@@@@@@@",q)
          //   const obj = q.priceDetail.find(e => e.manufacture === arrTemp[i].manufacture &&
          //     e.categoryCylinder === arrTemp[i].categoryCylinder);
          //   if (obj !== undefined) {
          //     arrTemp[i].price = obj.price;
          //     // console.log("######1",obj.price )
          //   } else {
          //     arrTemp[i].price = null
          //     // console.log("######2",obj.price )
          //   }
          // })
        } else {
          console.log(response.message)
          arrTemp[i].price = null
        }
      }
      this.setState({ ...this.state, listOrder: arrTemp })
    }

    //formmat date
    const formatDate = (date) => {
      const newDate = date.split('-')
      const text = newDate[2] + '-' + newDate[1] + '-' + newDate[0]
      return text
    }

    //formmat String to date
    const format_String_to_Date = (date) => {
      const temp = date.split('-')
      const text = new Date(temp[0], temp[1], temp[2])
      return text
    }

    //formatPrice
    const formatPrice = (price) => {
      const text = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " VNĐ";

      return text
    }
    //tính tổng tiền
    const sum = (arr) => {
      var money = 0
      if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          money += arr[i].price * arr[i].quantity
        }
      }
      return money
    }
    //kiễm tra khi chưa chọn ngày
    const checkDate = this.state.delivery.some(el => el.deliveryDate === null)
    //kiểm tra khi chưa có đơn giá
    const checkPrice = this.state.listOrder.some(el => el.price === null)

    //Render item
    const renderlistOder = ({ item, index }) => {
      return (
        <View style={{ marginVertical: 15, paddingHorizontal: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1.5, paddingRight: 20, }}>
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', color: COLOR.BLACK }}>
                {item.manufactureName} - {item.categoryCylinderName}</Text>
            </View>
            <View style={styles.viewPrice}>
              {/* {item.price ? */}
              <Text style={styles.titleItem}>{translate('UNIT_PRICE')}: {item.price ? formatPrice(item.price) :
                <Text style={{ color: COLOR.ORANGE }}>{translate('EMPTY_UNIT_PRICE')}</Text>}</Text>
              {/* : null} */}
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleItem}>{translate('COLOR')}: {item.colorGasName}</Text>
            </View>
            <View style={{ flex: 1.5, flexDirection: 'row', }}>
              <View style={{ paddingLeft: 5, marginRight: 10 }}>
                <Text style={styles.titleItem}>{translate('NUMBERS_OF')}:</Text>
              </View>
              <View style={styles.viewPrice}>
                <TouchableOpacity
                  onPress={() => { changeAmountPlus(item, index) }}>
                  <AntDesign
                    name="pluscircleo"
                    size={20}
                    color={COLOR.GREEN_MAIN}
                  />
                </TouchableOpacity>
                <Text style={
                  [styles.titleItem, {
                    marginHorizontal: 10,
                    color: COLOR.GREEN_MAIN
                  }]}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => { changeAmountMinus(item, index) }}>
                  <AntDesign
                    name="minuscircleo"
                    size={20}
                    color={COLOR.ORANGE}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleItem}>{translate('VALVE_TYPE')}: {item.valveName}</Text>
            </View>
            <View style={{ flex: 1.5, paddingLeft: 5 }}>
              {item.price ? <Text style={styles.titleItem}>
                {translate('INTO_MONEY')}: {formatPrice(item.quantity * item.price)}
              </Text> : null}
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity onPress={() => { DelProduct(index) }}>
              <FontAwesome5
                name="trash-alt"
                size={18}
                style={{ color: COLOR.ORANGE }}
              /></TouchableOpacity>
          </View>
        </View >
      );
    };

    //thêm ngày giao
    const setAddDate = () => {
      const array = [...this.state.delivery]
      const temp = {
        deliveryAddress: this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == TNL ||
          this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == DDTM ?
          this.props.address : this.props.userinfo.address,
        deliveryDate: null,
      }
      array.push(temp)
      this.setState({ delivery: array })
    }
    //xóa ngày giao
    const setDelDate = (index) => {
      let array = [...this.state.delivery]
      array.pop()
      this.setState({ delivery: array })
    }
    //xóa sản phẩm
    const DelProduct = (index) => {
      let array = [...this.state.listOrder]
      array.splice(index, 1)
      this.setState({ listOrder: array })
    }
    //item chọn ngày giao hàng
    const createDateItem = (item, index) => {
      return <View style={{ flexDirection: 'row', marginVertical: 1, alignItems: 'center', }}>
        {this.state.delivery.length < 2 ? null :
          <TouchableOpacity style={{ padding: 5, alignItems: 'center', marginBottom: 5 }}
            onPress={() => {
              setDelDate(index)
            }}>
            <FontAwesome5
              name="minus-circle"
              size={20}
              style={styles.txtGray}
            />
          </TouchableOpacity>
        }
        <View style={{ marginHorizontal: 5 }}>
          <View
            style={styles.inputContainer}
          >
            <Text
              style={{
                paddingVertical: 10,
                paddingHorizontal: 5,
                color: COLOR.GRAY,
                fontSize: 12,

              }}
              numberOfLines={1}
            >
              {item.deliveryDate == null ? translate("Delivery_date") : formatDate(item.deliveryDate)}
            </Text>
            <View
              style={{ flexDirection: 'row', }}
            >
              <View
                style={{
                  width: 1,
                  backgroundColor: COLOR.GRAY
                }}
              />
              <View
                style={[styles.dtpickerContainer]}
              >
                <DatePicker
                  date={this.state.date}
                  mode={"date"}
                  format={"YYYY-MM-DD"}
                  minDate={new Date()}
                  placeholder={null}
                  confirmBtnText="Chọn"
                  cancelBtnText="Bỏ chọn"
                  locale={'vi'}
                  iconSource={Images.iconCalendar}
                  style={{
                    width: 40
                  }}
                  customStyles={{
                    dateText: {
                      width: 0,
                      color: 'transparent'
                    },
                    dateIcon: {
                      position: 'absolute',
                      right: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      borderColor: 'white'
                    }
                  }}
                  onDateChange={(date) => {
                    let date1 = new Date();
                    let date2 = new Date(date);
                    //check date
                    const checkDate2 = this.state.delivery.some(el => el.deliveryDate == date)
                    //kiem tra trùng ngày
                    if (checkDate2 != true) {
                      const arrTemp = [...this.state.delivery]
                      //format
                      arrTemp[index].deliveryDate = date
                      this.setState({ delivery: arrTemp })
                      if (index == 0) {
                        this.setState({ date2: date })
                        getListPrice(date, this.state.cylinderType)
                      }
                    } else {
                      Toast.show({
                        text1: translate('time_has_existed'),
                      })
                    }

                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={{ padding: 5, alignItems: 'center', marginBottom: 5 }}
          onPress={() => {
            this.state.delivery[0].deliveryDate != null ? setAddDate() :
              Toast.show({
                text1: translate('PLEASE_CHOOSE_A_DELIVERY_DATE'),
              })
          }}
        >
          <FontAwesome5
            name="plus-circle"
            size={20}
            style={styles.txtGray}
          />
        </TouchableOpacity>
      </View >
    }
    // const {

    //   customerID,
    //   agency,
    //   exportWareHouse,

    // } = this.state;
    // const {
    //   listCylinder,
    // } = this.props
    return (
      <SafeAreaView
        style={styles.container}
      >
        <LineOrderItem showLine={0} />
        <ScrollView style={{ flex: 9, paddingHorizontal: 15 }}>
          {this.state.listOrder.length > 0 ?
            <>
              {this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == TNL ||
                this.props.userinfo.userType == TONG_CONG_TY && this.props.userinfo.userRole == DDTM ? <>
                <Text style={styles.textBlue}>Ngày tạo đơn</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={[styles.inputContainer, { backgroundColor: !this.state.isSelected ? "#eeeeee" : 'white' }]}
                  >
                    <Text
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 5,
                        color: COLOR.GRAY,
                        fontSize: 12,
                      }}
                      numberOfLines={1}
                    >
                      {/* {this.state.createdAtDate == null ? 'Ngày hiện tại' : formatDate(this.state.createdAtDate)} */}
                      {moment(this.state.createdAtDate).format('DD-MM-YYYY')}
                    </Text>
                    <View
                      style={{ flexDirection: 'row', }}
                    >
                      <View
                        style={{
                          width: 1,
                          backgroundColor: COLOR.GRAY
                        }}
                      />
                      <View
                        style={[styles.dtpickerContainer]}
                      >
                        <DatePicker
                          date={this.state.createdAtDate}
                          disabled={!this.state.isSelected}
                          mode={"date"}
                          format={"YYYY-MM-DD"}
                          minDate={new Date()}
                          placeholder={null}
                          confirmBtnText="Chọn"
                          cancelBtnText="Bỏ chọn"
                          locale={'vi'}
                          iconSource={Images.iconCalendar}
                          style={{
                            width: 40
                          }}
                          customStyles={{
                            dateText: {
                              width: 0,
                              color: 'transparent'
                            },
                            dateIcon: {
                              position: 'absolute',
                              right: 0,
                              top: 4,
                              marginLeft: 0
                            },
                            dateInput: {
                              borderColor: 'white'
                            }
                          }}
                          onDateChange={(date) => {
                            this.setState({ createdAtDate: date })
                          }}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={{ paddingLeft: 10 }}>
                    <Checkbox
                      // color={COLOR.GREEN_MAIN}
                      status={this.state.isSelected ? 'checked' : 'unchecked'}
                      onPress={() => {
                        this.setState({ isSelected: !this.state.isSelected });
                        if (!this.state.isSelected) {
                          console.log('ngày mói', this.state.createdAtDate)
                        } else {
                          this.setState({ createdAtDate: new Date() });
                          console.log('ngày hienj tại', this.state.createdAtDate)
                        }
                      }} />
                  </View>
                </View></> : null}
              <Text style={styles.textBlue}> {translate('DATE_DELIVER')} </Text>
              {this.state.delivery.map((data, index) => createDateItem(data, index))}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.ViewCheckBox(this.state.selectedDonBinh)}
                    onPress={() => {
                      this.setState({ selectedDonCoc: "", selectedDonBinh: "don binh", orderType: "KHONG", cylinderType: "BINH", selectedDonMuonCoc: "" })
                      // this.setState({ selectedDonMuonCoc: "" })
                      this.state.date2 ? getListPrice(this.state.date2, "BINH") : null
                    }} />
                  <Text style={[styles.title, {
                    fontSize: 14,
                    paddingVertical: 2,
                    color: '#009347',
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginLeft: 5
                  }]}>Đơn đổi vỏ</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.ViewCheckBox(this.state.selectedDonCoc)}
                    onPress={() => {
                      this.setState({ selectedDonCoc: "ĐCV", orderType: "COC_VO", cylinderType: "VO", selectedDonMuonCoc: "", selectedDonBinh: "" })
                      // this.setState({ selectedDonMuonCoc: "" })
                      this.state.date2 ? getListPrice(this.state.date2, "VO") : null
                    }} />
                  <Text style={[styles.title, {
                    fontSize: 14,
                    paddingVertical: 2,
                    color: '#009347',
                    fontWeight: 'bold',
                    marginTop: 10,
                    marginLeft: 5
                  }]}>{translate('Shell_pile_Order')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <TouchableOpacity style={styles.ViewCheckBox(this.state.selectedDonMuonCoc)}
                    onPress={() => {
                      // setSelectedDonMuonCoc("ĐMV")
                      // setSelectedDonCoc("")
                      // this.setState({ selectedDonCoc: "" })
                      this.setState({ selectedDonMuonCoc: "ĐMV", orderType: "MUON_VO", cylinderType: "VO", selectedDonCoc: "", selectedDonBinh: "" })
                      this.state.date2 ? getListPrice(this.state.date2, "VO") : null
                    }} />
                  <View>
                    <Text style={[styles.title, {
                      fontSize: 14,
                      paddingVertical: 2,
                      color: '#009347',
                      fontWeight: 'bold',
                      marginTop: 10,
                      marginLeft: 5
                    }]}>{translate('Borrow_Shell_Order')}</Text>
                  </View>
                </View>
              </View>
              <View
                style={styles.infoContainer}
              >
                <View style={{ flex: 0.5, flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}></View>
                  <View style={{ flex: 3, alignItems: 'center' }}>
                    <Text style={styles.title}>
                      {translate('INFORMATION_ORDER')}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      onPress={() => { this.setState({ listOrder: [], numberOrder: 0 }) }}
                    >
                      <Text style={styles.txtDelete}>{translate('DELETE_ALL')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flex: 4, marginHorizontal: 10 }}>
                  <FlatList
                    data={this.state.listOrder}
                    renderItem={renderlistOder}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
            </> : null}
        </ScrollView>
        <View style={{}}>
          {this.state.listOrder?.length > 0 ?
            <View>
              {checkPrice != true ?
                <Text style={styles.Sum}>{translate('TOTAL2')}: {formatPrice(sum(this.state.listOrder))}</Text> : null}
            </View>
            : null}
          {!this.state.isShow ? <TouchableOpacity
            style={styles.btnContinue}
            onPress={async () => {
              if (this.state.listOrder?.length > 0) {
                if (checkDate != true) {
                  if (checkPrice != true) {
                    // Actions['storeInfo']({
                    //   listCylinder: this.props.listOrder,
                    //   numberOrder: this.state.numberOrder
                    // })
                    let date = new Date();
                    let formattedDate = moment(date).format('DDMMYYYY');
                    let dateString = formattedDate.toString().slice(0, 6);
                    let dateNowString = Date.now().toString().slice(7, 13);
                    let madonhang = ("DH" + dateString + "-" + dateNowString).toString();

                    //temp
                    let arrayTemp = [...this.state.listOrder]
                    const Temp = arrayTemp.map((
                      { colorGasName, manufactureName, categoryCylinderName, valveName, ...temp }) => ({ ...temp }));
                    //   linh
                    // phân biệt người dùng tạo đơn hàng:
                    // Cua_hang_thuoc_tram, To_nhan_lenh, Tong_dai_ly,Khach_hang
                    const userRole = this.props.userinfo.userRole
                    const userType = this.props.userinfo.userType
                    if (userType == TONG_CONG_TY && userRole == TNL ||
                      userType == TONG_CONG_TY && userRole == DDTM) {
                      this.setState({ isShow: true })
                      let body = {
                        orderDetails: Temp,
                        area: "625e74ba76fcc80f2c2504c2",//this.props.inforCustomers.area,
                        supplier: this.props.inforCustomers.supplier,
                        orderType: this.state.orderType,
                        note: this.props.inforCustomers.note,
                        customers: this.props.inforCustomers.customers,
                        delivery: this.state.delivery,
                        dateCreated: this.state.createdAtDate,
                        placeOfDelivery: this.props.placeOfDelivery
                      };
                      // console.log(body)
                      const response = await createOrderNew(body)
                      if (response.success) {
                        //thông báo
                        const body2 = {
                          title: "Bạn có đơn hàng mới",
                          data: `Đơn hàng số : ${response.data.orderCode}`,
                          device: `${this.props.inforCustomersDetail.playerID},${this.props.inforCustomersDetail.playerIDWeb ?? ''}`,
                          appname: "Gassouth",
                          iddata: response.data.id
                        }
                        const response2 = await sendNotification(body2)
                        Actions['CreateNewOrderSuccessFull']({})
                      } else {
                        this.setState({ isShow: false })
                        Toast.show({
                          text1: "Thất bại",
                        })
                      }
                    } else {
                      Actions['userInfoScreen']({
                        createOrder: {
                          customers: this.state.customerID,//userRole === "SuperAdmin" ? this.state.customerID : this.props.userinfo.isChildOf,
                          // agencyId: this.state.agency || "",
                          // warehouseId: this.state.warehouseId,
                          // orderCode: madonhang,
                          orderDetails: Temp,
                          orderType: this.state.orderType,
                        },
                        playerid: this.state.warehouseId?.playerId,
                        delivery: this.state.delivery,
                        // nameCustomer: CustommerName,
                        // address: addressCompany
                      })
                    }
                  } else {
                    Toast.show({
                      text1: translate('EMPTY_UNIT_PRICE'),
                    })
                  }
                } else {
                  Toast.show({
                    text1: translate('PLEASE_CHOOSE_A_DELIVERY_DATE'),
                  })
                }
              } else {
                Toast.show({
                  text1: translate('ORDER_EMPTY'),
                })
              }
            }}
          >
            <View
              style={styles.shoppingContainer}
            >
              <Icon
                name='shopping-cart'
                size={26}
                color={COLOR.WHITE} />
              <Text
                style={styles.textNotify}
              >
                {this.state.numberOrder}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: COLOR.WHITE
              }}
            >
              {translate('CONTINUE')}
            </Text>
          </TouchableOpacity> :
            <View style={{ paddingVertical: 15, flex: 1 }}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>}
        </View>
        <Toast
          backgroundColor="#fffff"
          autoHide={true}
          visibilityTime={visibilityTime}
          ref={(ref) => {
            Toast.setRef(ref);
          }}
        />
      </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  infoContainer: {
    flex: 1,
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLOR.GRAY,
    padding: 5
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 30,
    paddingLeft: 5
  },
  title: {
    fontSize: 18,
    color: COLOR.GREEN_MAIN,
    fontWeight: 'bold'
  },

  tittle: {
    fontSize: 14,
    color: COLOR.GRAY,
    marginTop: 10
  },
  iconAdd: {
    fontSize: 16,
    color: COLOR.RED,
    fontWeight: 'bold'
  },
  btnContinue: {
    backgroundColor: COLOR.ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  btnAdd: {
    borderColor: COLOR.RED,
    borderWidth: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textNotify: {
    color: COLOR.WHITE,
    fontSize: 14,
    textAlignVertical: 'top',
    top: -8,
    right: -3
  },
  shoppingContainer: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row'
  },
  titleItem: {
    color: COLOR.BLACK
  },
  Sum: {
    color: COLOR.BLACK,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20
  },
  viewPrice: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end'
  },
  txtDelete: {
    color: COLOR.ORANGE,
    fontWeight: 'bold',
    marginTop: 5,
    marginRight: 5
  },
  textBlue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009347',
    marginVertical: 10
  },
  txtGray: {
    color: COLOR.GRAY,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    overflow: 'hidden',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  dtpickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  ViewCheckBox: (isChoosing) => {
    return {
      marginTop: 10,
      width: 20,
      height: 20,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: '#009347',
      backgroundColor: !isChoosing ? COLOR.WHITE : '#81ad61',
    };
  },
})

export const mapStateToProps = state => {
  return ({
    listOrder: state.order.listOrder,
    userinfo: state.auth.user,
  })
}

export default connect(
  mapStateToProps, {
  setListOrder
}
)(OrderInfomationScreen)
