import React, { Component } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  Animated,
  FlatList,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { getLanguage, setLanguage } from '../../../helper/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LineOrderItem from '../../../components/LineOrderItem';
import PickerCustom from '../../../components/PickerCustom';
import { OutlinedTextField } from 'react-native-material-textfield';
import { connect } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../../constants';
import {
  getallchild,
  getallchildSuccess,
} from '../../../actions/InspectorActions';
import { createOrder } from '../../../actions/OrderActions';
import { changeLanguage } from '../../../actions/LanguageActions';
import { setListOrder } from '../../../actions/OrderActions';
import { Actions } from 'react-native-router-flux';
import { getToken } from '../../../helper/auth';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { COLOR } from '../../../constants';
import {
  getListByCustomerType,
  getListBranch,
} from '../../../actions/CustomerActions';
import { getLstWareHouses, setOrder } from '../../../actions/OrderActions';
import * as RNLocalize from 'react-native-localize';
import handleChangeLanguage, { translate } from '../../../utils/changeLanguage';
import { width } from '../../../utils/sizeScreen';

const branch = [
  {
    name: 'VT GAS',
    code: '001',
  },
  {
    name: 'JP GAS',
    code: '002',
  },
  {
    name: 'AGAS',
    code: '003',
  },
  {
    name: 'DAKGAS',
    code: '004',
  },
  {
    name: 'ĐẶNG PHƯỚC',
    code: '005',
  },
  {
    name: 'GAS DẦU KHÍ',
    code: '006',
  },
];

const TypeofGasTank = [
  {
    name: 'Bình 6',
    code: 'b6',
  },
  {
    name: 'Bình 12',
    code: 'b12',
  },
  {
    name: 'Bình 20',
    code: 'b20',
  },
  {
    name: 'Bình 45',
    code: 'b45',
  },
];

const typeOfColor = [
  {
    name: 'Xám',
    code: '001X',
  },
  {
    name: 'Hồng',
    code: '002H',
  },
  {
    name: 'Đỏ',
    code: '003D',
  },
  {
    name: 'Xanh VT',
    code: '004XVT',
  },
  {
    name: 'Cam',
    code: '005C',
  },
  {
    name: 'Xanh Shell',
    code: '006XS',
  },
  {
    name: 'Xanh Petro',
    code: '007XP',
  },
  {
    name: 'Khác',
    code: '008K',
  },
];

const typeValve = [
  {
    name: 'POL',
    code: '001',
  },
  {
    name: 'COM',
    code: '002',
  },
  {
    name: 'Đỏ',
    code: '003',
  },
];

class CreateNewOrderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valveType: '',
      valveTypeName: '',
      cylindersTypeName: '',
      colorType: '',
      colorTypeName: '',
      error: '',
      type: '',
      exportWareHouse: '',
      exportWareHouseName: '',
      danhsachnoinhan: [],
      numberof: 0,
      date: new Date(),
      showDate: false,
      showTime: false,
      isAddModal: true,
      danhsachdonhang: [],
      ArrayColor: [],
      ArrayValve: [],
      ArrayCylinder: [],
      numberOrder: 0,
      marginLeftAnim: new Animated.Value(180),
      marginTopAnim: new Animated.Value(25),
      isShowAnimation: false,
      manufacture: '',
      listManufacture: [],
      isChooseBranch: -1,
      isChooseGasTank: -1,
      isChooseColor: -1,
      isChooseValve: -1,
    };
    this.TypepickerCustomRef = React.createRef();
    this.CylinderpickerCustomRef = React.createRef();
    this.ValvepickerCustomRef = React.createRef();
    this.ColorpickerCustomRef = React.createRef();
    this.NumberpickerCustomRef = React.createRef();
    //noinhan
    this.ExportWareHousepickerCustomRef = React.createRef();
  }

  getListManufacture = async () => {
    const token = await getToken();
    try {
      const response = await axios.get(`${API_URL}/manufacture/ShowList`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const Manufacture = response.data.data;
      this.setState({ listManufacture: Manufacture })
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  getListCylinder = async () => {
    const token = await getToken();
    try {
      const response = await axios.get(`${API_URL}/categoryCylinder/getAll`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const cylinder = response.data.data;
      this.setState({ ArrayCylinder: cylinder })
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  getListColorGas = async () => {
    const token = await getToken();
    try {
      const response = await axios.get(`${API_URL}/colorGas`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const color = response.data.data;
      this.setState({ ArrayColor: color })
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  getListValve = async () => {
    const token = await getToken();
    try {
      const response = await axios.get(`${API_URL}/valve/showListValve`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const valve = response.data.data;
      this.setState({ ArrayValve: valve })
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  componentDidMount = async () => {
    this.getListManufacture();
    this.getListColorGas();
    this.getListValve();
    this.getListCylinder();
    this.props.getLstWareHouses(this.props.user.id);
    try {
      const languageCode = await getLanguage();
      if (languageCode) {
        RNLocalize.addEventListener(
          'change',
          handleChangeLanguage(languageCode),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listOrder?.length != this.props.listOrder?.length) {
      let sum = 0;
      this.props.listOrder.map((item) => (sum += +item.numberCylinders));
      this.setState({ danhsachdonhang: this.props.listOrder, numberOrder: sum });
    }
    if (this.props.listWarehouse !== prevProps.listWarehouse) {
      this.setState({ danhsachnoinhan: this.props.listWarehouse });
    }
  }

  componentWillUnmount = async () => {
    const languageCode = await getLanguage();
    if (languageCode) {
      RNLocalize.addEventListener('change', handleChangeLanguage(languageCode));
    }
  };

  checkState() {
    if (
      // this.state.isChooseBranch &&
      // this.state.cylindersType &&
      // this.state.colorType &&
      // this.state.numberof &&
      // this.state.exportWareHouse
      this.state.isChooseBranch > -1 &&
      this.state.isChooseColor > -1 &&
      this.state.isChooseGasTank > -1 &&
      this.state.isChooseValve > -1 &&
      this.state.numberof
    ) {
      if (this.state.numberof >= 0) {
        return true;
      }
      Alert.alert(
        translate('notification'),
        translate('QUANTITY_CANNOT_BE_LESS_THAN_0'),
      );
      return false;
    }
    return false;
  }

  onAdd() {
    if (this.checkState()) {
      let donhang = {
        // type: this.state.type,
        categoryCylinder: this.state.cylindersType,
        categoryCylinderName: this.state.cylindersTypeName,
        valve: this.state.valveType,
        valveName: this.state.valveTypeName,
        colorGas: this.state.colorType,
        colorGasName: this.state.colorTypeName,
        manufacture: this.state.exportWareHouse,
        manufactureName: this.state.exportWareHouseName,
        quantity: this.state.numberof,
        price: null,
      };
      this.setState({
        isShowAnimation: true,
      });
      this.setState({
        danhsachdonhang: [...this.state.danhsachdonhang, donhang],
        numberOrder: this.state.numberOrder + this.state.numberof,
      });
      this.setState({ numberof: '', error: '' });
      // this.ValvepickerCustomRef.current.refresh()
      // this.TypepickerCustomRef.current.refresh()
      // this.CylinderpickerCustomRef.current.refresh()
      // this.ColorpickerCustomRef.current.refresh()
      // this.NumberpickerCustomRef.current.clear()

      Animated.parallel([
        Animated.timing(this.state.marginLeftAnim, {
          duration: 600,
          toValue: 7,
          // useNativeDriver: true
        }),
        Animated.timing(this.state.marginTopAnim, {
          duration: 1000,
          toValue: 240,
          // useNativeDriver: true
        }),
      ]).start(() => {
        this.setState({
          isShowAnimation: false,
          marginLeftAnim: new Animated.Value(180),
          marginTopAnim: new Animated.Value(25),
        });
      });
    } else {
      // Alert.alert(
      //   'Thông báo',
      //   'Vui lòng nhập đầy đủ các trường',
      //   [
      //     { text: 'Ok' },
      //   ],
      //   { cancelable: false }
      // )
      this.setState({
        error: translate('THIS_FIELD_CANNOT_BE_LEFT_BLANK'),
      });
    }
  }

  //Render item choose
  renderItem(item, index, numCol, isChoose) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ [isChoose]: index })
          switch (isChoose) {
            case 'isChooseBranch':
              this.setState({ exportWareHouse: item.id, exportWareHouseName: item.name })
              break;
            case 'isChooseGasTank':
              this.setState({ cylindersType: item.id, cylindersTypeName: item.name })
              break;
            case 'isChooseColor':
              this.setState({ colorType: item.id, colorTypeName: item.name })
              break;
            case 'isChooseValve':
              this.setState({ valveType: item.id, valveTypeName: item.name })
              break;
            default:
              break;
          }
        }}
        style={styles.itemChoose(index, this.state[isChoose], numCol)}>
        <Text style={styles.txtItemChoose(index, this.state[isChoose])}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  renderItemChooseColor(item, index, numCol, isChoose) {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ [isChoose]: index, colorType: item.name })}
        style={styles.itemChoose(index, this.state[isChoose], numCol)}>
        <Text style={styles.txtItemChoose(index, this.state[isChoose])}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      valveType,
      colorType,
      exportWareHouse,
      ArrayColor,
      ArrayValve,
      type,
      listManufacture,
      manufacture,
      // listWarehouse,
      isChooseBranch,
      isChooseGasTank,
      isChooseColor,
      isChooseValve,
    } = this.state;
    const { listWarehouse } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 9 }}>
          <ScrollView>
            <View style={{ paddingHorizontal: 2, }}>
              <LineOrderItem showLine={0} />
              {/* <Text
              style={{
                fontSize: 18,
                paddingVertical: 10,
                color: '#009347',
                fontWeight: 'bold',
                marginTop: 10,
              }}>
              {' '}
              Hình thức đặt hàng
            </Text>
            <PickerCustom
              placeholder={translate('CHOOSE_TYPE')}
              value={type}
              //error={this.state.error}
              error={this.state.type ? '' : this.state.error}
              ref={this.TypepickerCustomRef}
              listItem={Type?.map((type) => ({
                value: type.value,
                label: type.name,
                //address: company.address
              }))}
              setValue={async (value) => {
                if (value.value) {
                  let array1 = Type[value.index].Valve;
                  let array2 = Type[value.index].colorValve;
                  let a = await this.setState({
                    // valveType: "",
                    cylindersType: value.value,
                    //colorType: "",
                    // numberof: "",
                    type: value.value,
                    // ArrayValve: array1,
                    // ArrayColor: array2
                  });
                  //  this.TypepickerCustomRef.current.refresh()
                }
              }}
            /> */}
              {/* THƯƠNG HIỆU */}
              <Text style={styles.title}>{translate('TRADEMARK')}</Text>
              {/* <PickerCustom
              placeholder={translate('TRADEMARK')}
              value={manufacture}
              error={this.state.error}
              ref={this.CylinderpickerCustomRef}
              listItem={listManufacture?.map((type) => ({
                value: type.name,
                label: type.name,
                //address: company.address
              }))}
              setValue={async (value) => {
                this.setState({manufacture: value});
              }}
            /> */}
              <FlatList
                //contentContainerStyle={{marginHorizontal: 5}}
                numColumns={3}
                data={this.state.listManufacture}
                renderItem={({ item, index }) =>
                  this.renderItem(item, index, 3, 'isChooseBranch')
                }
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              {/* LOẠI BÌNH */}
              <Text style={styles.title}>{translate('CYLINDERS_TYPE')}</Text>
              <FlatList
                //contentContainerStyle={{marginHorizontal: 5}}
                numColumns={4}
                data={this.state.ArrayCylinder}
                renderItem={({ item, index }) =>
                  this.renderItem(item, index, 4, 'isChooseGasTank')
                }
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              {/* <PickerCustom
              placeholder={translate('CHOOSE_CYLINDERS_TYPE')}
              value={cylindersType}
              //error={this.state.error}
              error={this.state.cylindersType ? '' : this.state.error}
              ref={this.CylinderpickerCustomRef}
              listItem={TypeofCylinder?.map((type) => ({
                value: type.name,
                label: type.name,
                //address: company.address
              }))}
              setValue={async (value) => {
                if (value.value) {
                  let array1 = TypeofCylinder[value.index].Valve;
                  let array2 = TypeofCylinder[value.index].colorValve;
                  let a = await this.setState({
                    valveType: '',
                    cylindersType: value.value,
                    colorType: '',
                    numberof: '',
                    ArrayValve: array1,
                    ArrayColor: array2,
                  });
                  // this.ValvepickerCustomRef.current.refresh()
                  // this.ColorpickerCustomRef.current.refresh()
                  // this.NumberpickerCustomRef.current.refresh()
                }
              }}
            /> */}

              {/* MÀU SẮC */}
              <Text style={styles.title}>{translate('COLOR')}</Text>
              <FlatList
                //contentContainerStyle={{marginHorizontal: 5}}
                numColumns={4}
                data={this.state.ArrayColor}
                renderItem={({ item, index }) =>
                  this.renderItem(item, index, 4, 'isChooseColor')
                }
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              {/* <OutlinedTextField
              label={translate('CHOOSE_COLOR')}
              onChangeText={(text) => {
                this.setState({
                  colorType: text,
                });
              }}
            /> */}

              {/* LOẠI VAN */}
              <Text style={styles.title}>{translate('VALVE_TYPE')}</Text>
              <FlatList
                //contentContainerStyle={{marginHorizontal: 5}}
                numColumns={4}
                data={this.state.ArrayValve}
                renderItem={({ item, index }) =>
                  this.renderItem(item, index, 4, 'isChooseValve')
                }
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
              {/* <OutlinedTextField
              label={translate('CHOOSE_VALVE_TYPE')}
              onChangeText={(text) => {
                this.setState({
                  valveType: text,
                });
              }}
            /> */}

              {/* <Text style={styles.title}>{translate('RECIPIENTS')}</Text>
            <PickerCustom
              disable={
                valveType == '' && this.state.danhsachnoinhan.length == 0
                  ? true
                  : false
              }
              // placeholder={translate('CHOOSE_EXPORT_WAREHOUSE')}//chọn kho xuất
              placeholder="CHỌN NƠI NHẬN"
              value={exportWareHouse}
              // error={this.state.error}
              error={this.state.exportWareHouse ? '' : this.state.error}
              ref={this.ExportWareHousepickerCustomRef}
              listItem={this.state.danhsachnoinhan.data?.map((item) => ({
                value: item,
                label: item.name,
              }))}
              setValue={(value) => {
                if (value.value) {
                  this.setState({
                    exportWareHouse: value.value,
                  });
                }
              }}
            /> */}
              <Text style={[styles.title, { paddingLeft: 5 }]}>
                {translate('ENTER_THE_AMOUNT')}
              </Text>
              {/* {this.state.isShowAnimation ? (
                <Animated.View
                  style={{
                    marginLeft: this.state.marginLeftAnim,
                    marginTop: this.state.marginTopAnim,
                    position: 'absolute',
                    zIndex: 1,
                  }}>
                  <Icon name="add" size={28} color="#F6921E" />
                </Animated.View>
              ) : null} */}
              <Text
                style={{ color: '#F6921E', fontSize: 11, paddingHorizontal: 10 }}>
                {this.state.numberof ? null : this.state.error}
              </Text>

              <View style={styles.textInputContainer}>
                <View style={{ flex: 1, paddingBottom: 18, paddingRight: 5 }}>
                  <TextInput
                    ref={this.NumberpickerCustomRef}
                    editable={this.state.isChooseValve === -1 ? false : true}
                    keyboardType="number-pad"
                    onChangeText={(text) =>
                      this.setState({ numberof: parseInt(text) })
                    }
                    value={this.state.numberof}
                    style={styles.inputBottom}
                    placeholder={translate('NUMBERS_OF')}
                  />
                </View>
                <TouchableOpacity
                  style={styles.btnAdd}
                  onPress={() => this.onAdd()}>
                  <Text style={styles.textAdd}>{translate('ADD')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{ flex: 0.5 }}>
          <TouchableOpacity
            style={styles.btnContinue}
            onPress={() => {
              if (this.checkState()) {
                let donhang = {
                  //manufacture: this.state.manufacture,
                  categoryCylinder: this.state.cylindersType,
                  categoryCylinderName: this.state.cylindersTypeName,
                  valve: this.state.valveType,
                  valveName: this.state.valveTypeName,
                  colorGas: this.state.colorType,
                  colorGasname: this.state.colorTypeName,
                  quantity: this.state.numberof,
                  manufacture: this.state.exportWareHouse,
                  manufactureName: this.state.exportWareHouseName,
                  // type: this.state.type,
                  price: null,
                };

                this.setState(
                  {
                    isShowAnimation: true,
                    danhsachdonhang: [...this.state.danhsachdonhang, donhang],
                    numberOrder: this.state.numberOrder + this.state.numberof,
                    numberof: '',
                    error: '',
                  },
                  () => {
                    // this.ColorpickerCustomRef.current.refresh()
                    // this.CylinderpickerCustomRef.current.refresh()
                    // this.ValvepickerCustomRef.current.refresh()
                    // this.NumberpickerCustomRef.current.clear()

                    Animated.parallel([
                      Animated.timing(this.state.marginLeftAnim, {
                        duration: 300,
                        toValue: 7,
                        // useNativeDriver: true
                      }),
                      Animated.timing(this.state.marginTopAnim, {
                        duration: 500,
                        toValue: 133,
                        // useNativeDriver: true
                      }),
                    ]).start(() => {
                      this.setState({
                        isShowAnimation: false,
                        marginLeftAnim: new Animated.Value(180),
                        marginTopAnim: new Animated.Value(25),
                      });

                      this.props.setListOrder(this.state.danhsachdonhang);
                      Actions['orderInfoScreen']({
                        listCylinder: this.state.danhsachdonhang,
                        numberOrder: this.state.numberOrder,
                        // inforCustomers: this.props.user.userType == "Tong_cong_ty" && this.props.user.userRole == "To_nhan_lenh" ||
                        //   this.props.user.userType == "Tong_cong_ty" && this.props.user.userRole == "phongKD" ?
                        //   this.props.inforCustomers : null,
                        inforCustomers: this.props.inforCustomers || "",
                        address: this.props.address || ""
                      });
                    });
                  },
                );
              } else {
                if (this.state.danhsachdonhang.length > 0) {
                  this.props.setListOrder(this.state.danhsachdonhang);
                  Actions['orderInfoScreen']({
                    listCylinder: this.state.danhsachdonhang,
                    numberOrder: this.state.numberOrder,
                    // inforCustomers: this.props.user.userType == "Tong_cong_ty" && this.props.user.userRole == "To_nhan_lenh" ||
                    //   this.props.user.userType == "Tong_cong_ty" && this.props.user.userRole == "phongKD" ?
                    //   this.props.inforCustomers : null,
                    inforCustomers: this.props.inforCustomers || "",
                    inforCustomersDetail: this.props.inforCustomersDetail || "",
                    address: this.props.address || ""
                  });
                } else {
                  this.setState({
                    error: translate('THIS_FIELD_CANNOT_BE_LEFT_BLANK'),
                  });
                }
              }
            }}
          >
            <View style={styles.shoppingContainer}>
              <Icon name="shopping-cart" size={26} color={COLOR.WHITE} />
              <Text style={styles.numberNotify}>
                {this.state.numberOrder}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                color: COLOR.WHITE,
              }}>
              {translate('CONTINUE')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  title: {
    fontSize: 18,
    paddingVertical: 10,
    color: '#009347',
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 5
  },
  inputBottom: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 15,
    color: COLOR.GREEN_MAIN,
    fontWeight: 'bold'
  },
  btnAdd: {
    flex: 1,
    marginBottom: 18,
    borderRadius: 5,
    borderColor: COLOR.GRAY,
    borderWidth: 1,
    backgroundColor: '#F6921E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContinue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F6921E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    color: COLOR.GRAY,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  textAdd: {
    color: COLOR.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  numberNotify: {
    color: COLOR.WHITE,
    fontSize: 14,
    textAlignVertical: 'top',
    top: -8,
    right: -3,
  },
  shoppingContainer: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row',
  },
  textInputContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 10
  },
  itemChoose: (idx, isChoosing, numCol) => {
    return {
      marginHorizontal: 2,
      width: (width - 20) / numCol,
      alignItems: 'center',
      paddingVertical: 5,
      borderWidth: 0.5,
      borderColor: COLOR.GREEN_MAIN,
      borderRadius: 5,
      backgroundColor: idx === isChoosing ? COLOR.ORANGE : COLOR.GRAY_OPTION,
    };
  },
  txtItemChoose: (idx, isChoosing) => {
    return {
      color: COLOR.BLACK,
      fontWeight: idx === isChoosing ? 'bold' : 'normal',
    };
  },
  separator: {
    height: 5,
  },
});

const Type = [
  {
    name: 'Bình',
    value: 'B',
  },
  {
    name: 'Vỏ',
    value: 'V',
  },
];

const TypeofCylinder = [
  {
    name: 'Bình 6 kg',
    value: 'CYL12KG',
    Valve: [
      {
        name: 'POL',
        value: 'POL',
      },
    ],
    colorValve: [
      {
        name: 'Xám',
        value: 'Xám',
      },
      {
        name: 'Đỏ',
        value: 'Đỏ',
      },
      {
        name: 'Vàng',
        value: 'Vàng ',
      },
    ],
  },
  {
    name: 'Bình 12 kg',
    value: 'CYL12KGCO',
    Valve: [
      {
        name: 'COMPACT',
        value: 'COMPACT',
      },
    ],
    colorValve: [
      {
        name: 'Shell',
        value: 'Shell',
      },
      {
        name: 'VT',
        value: 'VT',
      },
      {
        name: 'Petro',
        value: 'Petro ',
      },
      {
        name: 'Cam',
        value: 'Cam ',
      },
    ],
  },
  {
    name: 'Bình 20 KG',
    value: 'CYL45KG',
    Valve: [
      {
        name: 'POL',
        value: 'POL',
      },
    ],
    colorValve: [
      {
        name: 'Xám',
        value: 'Xám',
      },
    ],
  },
  {
    name: 'Bình 45 KG',
    value: 'CYL50KG',
    Valve: [
      {
        name: 'POL',
        value: 'POL',
      },
      {
        name: '2 VAN',
        value: '2 VAN',
      },
    ],
    colorValve: [
      { name: 'Xám', value: 'Xám' },
      { name: 'Đỏ', value: 'Đỏ' },
      { name: 'Vàng', value: 'Vàng' },
    ],
  },
];

export const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    listChildCompany: state.inspector.listChildCompany,
    listCustomer: state.customer.resulListCustomer,
    listBranch: state.customer.resulListBranch,
    userInfo: state.auth.user,
    listWarehouse: state.order.result_getWareHouse,
    listOrder: state.order.listOrder,
  };
};

export default connect(mapStateToProps, {
  getallchild,
  getallchildSuccess,
  createOrder,
  getListByCustomerType,
  getListBranch,
  getLstWareHouses,
  setOrder,
  setListOrder,
})(CreateNewOrderScreen);
