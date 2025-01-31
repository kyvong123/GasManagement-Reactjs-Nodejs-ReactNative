import React, { Component } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import PickerCustom from './../components/PickerCustom';

import * as RNLocalize from 'react-native-localize';
import { setLanguage, getLanguage } from "../helper/auth";
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import { COLOR } from '../constants';
import LineOrderItem from '../../src/components/LineOrderItem'
import { getLstWareHouses } from '../actions/OrderActions'
import { getListByCustomerType, getListBranch } from '../actions/CustomerActions'

import { getallchild, getallchildSuccess } from '../actions/InspectorActions';

import { changeLanguage } from "../actions/LanguageActions";
import moment from 'moment';
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

class StoreInfoScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      customerType: '',
      customerID: '',
      error: '',
      isDisable: true,
      isCustomerType: false,
      exportWareHouse: '',
      isCustommerID: false,
      CustommerCode: '',
      CustommerName: '',
      addressCompany: '',
      addressCompany1: '',
      showModal: false,
      orderCode: '',
    }

    this.CustomerpickerCustomRef = React.createRef();
    this.CustomerIDpickerCustomRef = React.createRef();
    this.AgencypickerCustomRef = React.createRef();
    this.ExportWareHousepickerCustomRef = React.createRef();
    this.NoteValueRef = React.createRef();
  }

  componentDidMount = async () => {
    const { userInfor, listWarehouse } = this.props;
    let a = await this.props.getLstWareHouses(userInfor.id);

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


  checkState() {
    const states = this.state
    if (states.name && states.code && states.color && states.number)
      return true
    return false
  }

  render() {
    const {
      customerType,
      customerID,
      agency,
      exportWareHouse,
      isCustomerType,
      isCustommerID,
      CustommerName,
      addressCompany,
      addressCompany1
    } = this.state;
    const {
      userInfor,
      listCustomer,
      listBranch,
      listWarehouse,
      numberOrder
    } = this.props;
    return (
      <View
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 15 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <LineOrderItem showLine={1} />
            <Text style={styles.title}>
              {translate('RECIPIENTS')}
            </Text>
            <PickerCustom
              placeholder={translate('CHOOSE_EXPORT_WAREHOUSE')}//chọn kho xuất
              value={exportWareHouse}
              //error={this.state.error}
              error={this.state.exportWareHouse ? '' : this.state.error}
              ref={this.ExportWareHousepickerCustomRef}
              listItem={listWarehouse.data?.map(item => ({
                value: item,
                label: item.name,
              }))}

              setValue={value => {
                if (value.value) {
                  this.setState({
                    exportWareHouse: value.value,
                  });
                }
              }}
            />
            <Text style={styles.title}>
              {translate("CUSTOMER_INFORMATION")}
            </Text>
            <PickerCustom
              placeholder={translate('CUSTOMER_TYPE')}//chon loại khách hàng
              value={this.state.customerType}
              // error={this.state.error}
              error={this.state.customerType ? '' : this.state.error}
              ref={this.CustomerpickerCustomRef}
              listItem={options?.map(type => ({
                value: type.value,
                label: type.name,
                //address: company.address
              }))}
              setValue={async (value) => {
                if (value.value) {
                  let a = await this.setState({
                    customerType: value.value,
                    customerID: "",
                    agency: "",
                    isCustomerType: true,
                    isCustommerID: false
                  });
                  const payload = {
                    customerType: value.value,
                    isChildOf: userInfor.parentRoot
                  }
                  this.props.getListByCustomerType(payload)
                  await this.CustomerIDpickerCustomRef.current.refresh()
                  await this.AgencypickerCustomRef.current.refresh()
                  await this.NoteValueRef.current.refresh()
                }
              }}
            />
            <PickerCustom
              placeholder={translate('CUSTOMER_ID_CHON')}//chọn khách hàng
              value={customerID}
              // error={this.state.error}
              error={this.state.customerID ? '' : this.state.error}
              ref={this.CustomerIDpickerCustomRef}
              listItem={listCustomer.data?.map(company => ({
                value: company,
                label: company.name,
              }))}

              setValue={async (value) => {

                if (value.value) {
                  const customerSelect = listCustomer.data[value.index];
                  this.setState({
                    customerID: value.value.id,
                    isCustommerID: true,
                    CustommerName: customerSelect.name,
                    CustommerCode: customerSelect.customerCode,
                    agency: "",
                    addressCompany: customerSelect.invoiceAddress
                  });
                  const pl = {
                    id: value.value.id
                  }

                  this.props.getListBranch(pl);
                  await this.AgencypickerCustomRef.current.refresh();
                  await this.NoteValueRef.current.clear();
                }
              }
              }
            />
            {/* {customerType && listCustomer.data.length > 0 && isCustomerType ? (
              
            ) : null} */}
            {/* && customerType != "Distribution_Agency" */}
            {customerID && listBranch.data.length > 0 && isCustommerID && customerType !== "Distribution_Agency" ? (
              <PickerCustom
                placeholder={translate('CHOOSE_AGENCY')}
                value={agency}
                error={''}
                ref={this.AgencypickerCustomRef}
                listItem={listBranch.data?.map(pany => ({
                  value: pany,
                  label: pany.name,
                  //address: company.address
                }))}
                setValue={value => {
                  if (value.value) {
                    const branchSelect = listBranch.data[value.index];
                    this.setState({
                      agency: value.value.id,
                      agencyCode: branchSelect.agencyCode,
                      agencyName: branchSelect.name,
                      addressCompany1: branchSelect.address
                    });
                  }
                }}
              />
            ) : null}
            <TextInput ref={this.NoteValueRef} style={styles.InputNote} placeholder={translate('ADDRESS')} multiline={true} editable={false} value={customerType !== "Distribution_Agency" ? this.state.addressCompany1 : this.state.addressCompany} />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.btnContinue}
          onPress={() => {
            // if (customerID && exportWareHouse) {
            let date = new Date();
            let formattedDate = moment(date).format('DDMMYYYY');
            let dateString = formattedDate.toString().slice(0, 6);
            let dateNowString = Date.now().toString().slice(7, 13);
            let madonhang = ("DH" + dateString + "-" + dateNowString).toString();

            Actions['userInfoScreen']({
              createOrder: {
                customerId: customerID,
                agencyId: agency || "",
                warehouseId: exportWareHouse.id,
                orderCode: madonhang,
                listCylinder: this.props.listCylinder,
              },
              nameCustomer: CustommerName,
              address: addressCompany
            })
            // }
            // else {
            //   this.setState({
            //     error: translate('THIS_FIELD_CANNOT_BE_LEFT_BLANK')
            //   })
            // }
          }}
        >
          <View
            style={styles.iconShoppingContainer}
          >
            <Icon
              name='shopping-cart'
              size={26}
              color={COLOR.WHITE} />
            <Text
              style={styles.textNotify}
            >
              {numberOrder}
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  title: {
    fontSize: 18,
    paddingVertical: 10,
    color: COLOR.LIGHTBLUE,
    fontWeight: 'bold'
  },
  inputBottom: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: (width / 2) - 25,
    borderRadius: 5
  },
  btnAdd: {
    width: (width / 2) - 25,
    paddingVertical: 5,
    borderRadius: 5,
    borderColor: COLOR.GRAY,
    borderWidth: 1,
    backgroundColor: COLOR.RED,
    alignItems: 'center'
  },
  btnContinue: {
    backgroundColor: COLOR.RED,
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
    paddingHorizontal: 3
  },
  iconShoppingContainer: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row'
  },
  textNotify: {
    color: COLOR.WHITE,
    fontSize: 14,
    textAlignVertical: 'top',
    top: -8,
    right: -3
  },
  inputAddress: {
    height: 70,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLOR.GRAY,
    padding: 5,
    textAlignVertical: 'top',
    borderRadius: 5
  },
  InputNote: {
    height: 70,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 8
  }
})


const options = [
  {
    name: 'Đại lý phân phối',
    value: "Distribution_Agency"

  },
  {
    name: 'Khách hàng công nghiệp',
    value: "Industry"

  },
  {
    name: 'Nhà hàng và chung cư',
    value: "Restaurant_Apartment"

  },
]
const dataDefault = [
  {
    label: 'Khách Hàng Công Nghiệp', value: {
      id: 1,
      name: 'Distribution_Agency'
    }
  },
  {
    label: 'Nhà Hàng, Tòa Nhà', value: {
      id: 2,
      name: 'Industry'
    }
  },
  {
    label: 'Đại Lý Phân Phối', value: {
      id: 3,
      name: 'Restaurant_Apartment'
    }
  }
]

export const mapStateToProps = state => ({
  user: state.auth.user,
  listChildCompany: state.inspector.listChildCompany,
  listCustomer: state.customer.resulListCustomer,
  listBranch: state.customer.resulListBranch,
  userInfor: state.auth.user,
  listWarehouse: state.order.result_getWareHouse
});

export default connect(
  mapStateToProps,
  {
    getallchild,
    getallchildSuccess,
    getListByCustomerType,
    getListBranch,
    getLstWareHouses,
  }
)(StoreInfoScreen);
