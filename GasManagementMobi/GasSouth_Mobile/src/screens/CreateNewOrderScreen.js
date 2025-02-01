import React, { Component } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  Animated, Platform
} from 'react-native'
import { getLanguage, setLanguage } from "../helper/auth";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import LineOrderItem from '../components/LineOrderItem'
import PickerCustom from './../components/PickerCustom';

import { connect } from "react-redux";

import { getallchild, getallchildSuccess } from '../actions/InspectorActions';
import { createOrder } from '../actions/OrderActions';
import { changeLanguage } from "../actions/LanguageActions";
import { setListOrder } from "../actions/OrderActions";

import { Actions } from "react-native-router-flux";
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { COLOR } from '../constants';
import { getListByCustomerType, getListBranch } from '../actions/CustomerActions'
import { getLstWareHouses, setOrder } from '../actions/OrderActions'
import * as RNLocalize from 'react-native-localize'


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
  //this.setState({languageCode: lgnCode});

  chooseLanguageConfig(lgnCode)
}

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
)

class CreateNewOrderScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valveType: '',
      cylindersType: '',
      colorType: '',
      error: '',
      numberof: 0,
      date: new Date(),
      showDate: false,
      showTime: false,
      isAddModal: true,
      danhsachdonhang: [],
      ArrayColor: [],
      ArrayValve: [],
      numberOrder: 0,
      marginLeftAnim: new Animated.Value(180),
      marginTopAnim: new Animated.Value(25),
      isShowAnimation: false
    };
    this.CylinderpickerCustomRef = React.createRef();
    this.ValvepickerCustomRef = React.createRef();
    this.ColorpickerCustomRef = React.createRef();
    this.NumberpickerCustomRef = React.createRef();
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listOrder?.length != this.props.listOrder?.length) {
      let sum = 0
      this.props.listOrder.map((item) => sum += +item.numberCylinders)
      this.setState({ danhsachdonhang: this.props.listOrder, numberOrder: sum })
    }
  }

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
    }
  }

  checkState() {
    if (this.state.valveType && this.state.cylindersType && this.state.colorType && this.state.numberof) {
      if (this.state.numberof >= 0) {
        return true;
      }
      Alert.alert(translate('notification'), translate("QUANTITY_CANNOT_BE_LESS_THAN_0"))
      return false
    }
    return false;


  }

  onAdd() {
    if (this.checkState()) {
      let donhang = {
        cylinderType: this.state.cylindersType,
        valve: this.state.valveType,
        color: this.state.colorType,
        numberCylinders: this.state.numberof
      }
      this.setState({
        isShowAnimation: true
      })
      this.setState({
        danhsachdonhang: [...this.state.danhsachdonhang, donhang],
        numberOrder: this.state.numberOrder + this.state.numberof
      });
      this.setState({ valveType: "", cylindersType: "", colorType: "", numberof: "", error: "" });
      this.ColorpickerCustomRef.current.refresh()
      this.CylinderpickerCustomRef.current.refresh()
      this.ValvepickerCustomRef.current.refresh()
      this.NumberpickerCustomRef.current.clear()

      Animated.parallel([
        Animated.timing(
          this.state.marginLeftAnim,
          {
            duration: 600,
            toValue: 7,
            // useNativeDriver: true
          }
        ),
        Animated.timing(
          this.state.marginTopAnim,
          {
            duration: 1000,
            toValue: 120,
            // useNativeDriver: true
          }
        ),
      ]).start(() => {
        this.setState({
          isShowAnimation: false,
          marginLeftAnim: new Animated.Value(180),
          marginTopAnim: new Animated.Value(25),
        })
      })
    }
    else {
      // Alert.alert(
      //   'Thông báo',
      //   'Vui lòng nhập đầy đủ các trường',
      //   [
      //     { text: 'Ok' },
      //   ],
      //   { cancelable: false }
      // )
      this.setState({
        error: translate('THIS_FIELD_CANNOT_BE_LEFT_BLANK')
      })
    }
  }

  render() {
    const {
      valveType,
      cylindersType,
      colorType,
      ArrayColor,
      ArrayValve,
    } = this.state;
    return (
      <View
        style={styles.container}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.container,
          { justifyContent: 'space-between' }]}
          automaticallyAdjustContentInsets={true}
        >
          <View style={{ paddingHorizontal: 15 }}>
            <LineOrderItem showLine={0} />
            <Text style={styles.title}>
              {translate('ORDER_INFORMATION')}
            </Text>
            <PickerCustom
              placeholder={translate('CHOOSE_CYLINDERS_TYPE')}
              value={cylindersType}
              // error={this.state.error}
              error={this.state.cylindersType ? '' : this.state.error}
              ref={this.CylinderpickerCustomRef}
              listItem={TypeofCylinder?.map(type => ({
                value: type.value,
                label: type.name,
                //address: company.address
              }))}
              setValue={async (value) => {
                if (value.value) {
                  let array1 = TypeofCylinder[value.index].Valve;
                  let array2 = TypeofCylinder[value.index].colorValve;
                  let a = await this.setState({
                    valveType: "",
                    cylindersType: value.value,
                    colorType: "",
                    numberof: "",
                    ArrayValve: array1,
                    ArrayColor: array2
                  });
                  this.ValvepickerCustomRef.current.refresh();
                  this.ColorpickerCustomRef.current.refresh()
                  this.NumberpickerCustomRef.current.refresh()
                }
              }}
            />
            <PickerCustom
              disable={this.state.valveType == "" && ArrayValve.length == 0 ? true : false}
              placeholder={translate('CHOOSE_VALVE_TYPE')}
              value={this.state.valveType}
              // error={this.state.error}
              error={this.state.valveType ? '' : this.state.error}
              ref={this.ValvepickerCustomRef}
              listItem={ArrayValve?.map(type => ({
                value: type.value,
                label: type.name,
                //address: company.address
              }))}
              setValue={async (value) => {
                if (value.value) {
                  let a = await this.setState({
                    valveType: value.value,
                  });
                  this.ColorpickerCustomRef.current.refresh()
                  this.NumberpickerCustomRef.current.clear()
                }
              }}
            />
            <PickerCustom
              disable={valveType == "" && ArrayColor.length == 0 ? true : false}
              placeholder={translate("CHOOSE_COLOR")}
              value={colorType}
              //error={this.state.error}
              error={this.state.colorType ? '' : this.state.error}
              ref={this.ColorpickerCustomRef}
              listItem={ArrayColor?.map(type => ({
                value: type.value,
                label: type.name,
                //address: company.address
              }))}
              setValue={async (value) => {
                if (value.value) {
                  let a = await this.setState({
                    colorType: value.value,
                  });
                  this.NumberpickerCustomRef.current.clear();
                }
              }}
            />
          </View>
          <View style={{ marginBottom: Platform.OS === 'ios' ? 40 : 0 }}>
            <Text
              style={[styles.title, { paddingLeft: 15 }]}
            >
              {translate('ENTER_THE_AMOUNT')}
            </Text>

            {
              this.state.isShowAnimation ?
                <Animated.View style={{ marginLeft: this.state.marginLeftAnim, marginTop: this.state.marginTopAnim, position: 'absolute', zIndex: 1 }}>
                  <Icon name="add" size={28} color="red" />
                </Animated.View>
                : null
            }

            <Text style={{ color: 'red', fontSize: 11, paddingHorizontal: 10 }}>{this.state.numberof ? null : this.state.error}</Text>
            <View
              style={styles.textInputContainer}
            >
              <View style={{ flex: 1, paddingBottom: 18, paddingRight: '5%', }}>
                <TextInput
                  ref={this.NumberpickerCustomRef}
                  editable={valveType == "" ? false : true}
                  keyboardType="number-pad"
                  onChangeText={(text) => this.setState({ numberof: parseInt(text) })}
                  value={this.state.numberof} style={styles.inputBottom}
                  placeholder={translate("NUMBERS_OF")} />
              </View>

              <TouchableOpacity
                style={styles.btnAdd}
                onPress={() => this.onAdd()}
              >
                <Text
                  style={styles.textAdd}
                >
                  {translate('ADD')}
                </Text>
              </TouchableOpacity>

            </View>

            <TouchableOpacity
              style={styles.btnContinue}
              onPress={() => {

                if (this.checkState()) {
                  let donhang = {
                    cylinderType: this.state.cylindersType,
                    valve: this.state.valveType,
                    color: this.state.colorType,
                    numberCylinders: this.state.numberof
                  }

                  this.setState({
                    isShowAnimation: true,
                    danhsachdonhang: [...this.state.danhsachdonhang, donhang],
                    numberOrder: this.state.numberOrder + this.state.numberof,
                    valveType: "", cylindersType: "", colorType: "", numberof: "", error: ""
                  }, () => {
                    this.ColorpickerCustomRef.current.refresh()
                    this.CylinderpickerCustomRef.current.refresh()
                    this.ValvepickerCustomRef.current.refresh()
                    this.NumberpickerCustomRef.current.clear()

                    Animated.parallel([
                      Animated.timing(
                        this.state.marginLeftAnim,
                        {
                          duration: 300,
                          toValue: 7,
                          // useNativeDriver: true
                        }
                      ),
                      Animated.timing(
                        this.state.marginTopAnim,
                        {
                          duration: 500,
                          toValue: 133,
                          // useNativeDriver: true
                        }
                      ),
                    ]).start(() => {
                      this.setState({
                        isShowAnimation: false,
                        marginLeftAnim: new Animated.Value(180),
                        marginTopAnim: new Animated.Value(25),
                      })

                      this.props.setListOrder(this.state.danhsachdonhang)
                      Actions['orderInfoScreen']({
                        listCylinder: this.state.danhsachdonhang,
                        numberOrder: this.state.numberOrder
                      })
                    })


                  });
                }
                else {
                  if (this.state.danhsachdonhang.length > 0) {
                    this.props.setListOrder(this.state.danhsachdonhang)
                    Actions['orderInfoScreen']({
                      listCylinder: this.state.danhsachdonhang,
                      numberOrder: this.state.numberOrder
                    })
                  } else {
                    this.setState({
                      error: translate('THIS_FIELD_CANNOT_BE_LEFT_BLANK')
                    })
                  }
                }

              }
              }
            >
              <View
                style={styles.shoppingContainer}
              >
                <Icon
                  name='shopping-cart'
                  size={26}
                  color={COLOR.WHITE} />
                <Text
                  style={styles.numberNotify}
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
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLOR.WHITE
  },
  title: {
    fontSize: 18,
    paddingVertical: 10,
    color: COLOR.LIGHTBLUE,
    fontWeight: 'bold',
    marginTop: 10
  },
  inputBottom: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  btnAdd: {
    flex: 1,
    marginBottom: 18,
    borderRadius: 5,
    borderColor: COLOR.GRAY,
    borderWidth: 1,
    backgroundColor: COLOR.RED,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnContinue: {
    backgroundColor: COLOR.RED,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    color: COLOR.GRAY,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 3
  },
  textAdd: {
    color: COLOR.WHITE,
    fontSize: 14,
    fontWeight: 'bold'
  },
  numberNotify: {
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
  textInputContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  }
})

const TypeofCylinder = [
  {
    name: 'Bình 12 KG Thường',
    value: 'CYL12KG',
    Valve: [
      {
        name: "POL",
        value: "POL",
      }
    ],
    colorValve: [
      {
        name: "Xám",
        value: "Xám",
      },
      {
        name: "Đỏ",
        value: "Đỏ",
      },
      {
        name: "Vàng",
        value: "Vàng ",
      }
    ]

  },
  {
    name: 'Bình 12 KG Compact',
    value: 'CYL12KGCO',
    Valve: [
      {
        name: "COMPACT",
        value: "COMPACT",
      }
    ],
    colorValve: [
      {
        name: "Shell",
        value: "Shell",
      },
      {
        name: "VT",
        value: "VT",
      },
      {
        name: "Petro",
        value: "Petro ",
      },
      {
        name: "Cam",
        value: "Cam ",
      }
    ]


  },
  {
    name: 'Bình 45 KG',
    value: 'CYL45KG',
    Valve: [
      {
        name: "POL",
        value: "POL",
      },
    ],
    colorValve: [
      {
        name: "Xám",
        value: "Xám",
      }
    ]

  },
  {
    name: 'Bình 50 KG',
    value: 'CYL50KG',
    Valve: [
      {
        name: "POL",
        value: "POL",
      },
      {
        name: "2 VAN",
        value: "2 VAN",
      }

    ],
    colorValve: [
      { name: 'Xám', value: 'Xám' },
      { name: 'Đỏ', value: 'Đỏ' },
      { name: 'Vàng', value: 'Vàng' }
    ]
  },
]

const testData = [
  {
    id: 1,
    label: 'Bình 12 KG Thuờng',
    value: {
      id: 1,
      name: 'Bình 12 KG Thuờng',
      code: 'CYL12KG',
      van: [{
        label: 'POL',
        value: 'POL'
      }],
      color: [
        {
          label: 'Xám',
          value: 'Xám'
        },
        {
          label: 'Đỏ',
          value: 'Đỏ'
        },
        {
          label: 'Vàng',
          value: 'Vàng'
        }
      ]
    }
  }, {
    id: 2,
    label: 'Bình 12 KG Compact',
    value: {
      id: 2,
      name: 'Bình 12 KG Compact',
      code: 'CYL12KGCO',
      van: [{ label: 'COMBAT', value: 'COMBAT' }],
      color: [
        { label: 'Shell', value: 'Shell' },
        { label: 'VT', value: 'VT' },
        { label: 'Petro', value: 'Petro' },
        { label: 'Cam', value: 'Cam' }
      ]
    }
  }, {
    id: 3,
    label: 'Bình 45 KG',
    value: {
      id: 3,
      name: 'Bình 45 KG',
      code: 'CYL4545KG',
      van: [{ label: 'POL', value: 'POL' }],
      color: [
        { label: 'Xám', value: 'Xám' }
      ]
    }
  }, {
    id: 4,
    label: 'Bình 50 KG',
    value: {
      id: 4,
      name: 'Bình 50 KG',
      code: 'CYL50KG',
      van: [
        { label: 'POL', value: 'POL' },
        { label: '2 VAN', value: '2 VAN' }
      ],
      color: [
        { label: 'Xám', value: 'Xám' },
        { label: 'Đỏ', value: 'Đỏ' },
        { label: 'Vàng', value: 'Vàng' }
      ]
    }
  }
]

export const mapStateToProps = state => ({
  user: state.auth.user,
  listChildCompany: state.inspector.listChildCompany,
  listCustomer: state.customer.resulListCustomer,
  listBranch: state.customer.resulListBranch,
  userInfor: state.auth.user,
  listWarehouse: state.order.result_getWareHouse,
  listOrder: state.order.listOrder
})

export default connect(
  mapStateToProps,
  {
    getallchild,
    getallchildSuccess,
    createOrder,
    getListByCustomerType,
    getListBranch,
    getLstWareHouses,
    setOrder,
    setListOrder
  }
)(CreateNewOrderScreen)
