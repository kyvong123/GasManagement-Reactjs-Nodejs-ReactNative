import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { OutlinedTextField } from 'react-native-material-textfield';
import { Actions } from 'react-native-router-flux';
import { getToken } from "../helper/auth";
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from "react-native-vector-icons/AntDesign";
import tankTruckApi from '../api/tankTruck';
import memoize from 'lodash.memoize';
import moment from 'moment';
import i18n from 'i18n-js';

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export default function createOrderTank() {
  const [listWarehouse, setListWarehouse] = useState([]);
  const [listCustomer, setListCustomer] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [weight, setWeight] = useState();
  const [note, setNote] = useState();
  const [dateStart, setDateStart] = useState(translate("START_DATE"));
  const [dateEnd, setDateEnd] = useState(translate("END_DATE"));
  const [timeStart, setTimeStart] = useState(translate("DELIVERY_TIME"));
  const [isVisible, setIsVisible] = useState(false);
  const [mode ,setMode] = useState();
  const [type ,setType] = useState();

  useEffect(() => {
    getExportWareHouse()
    getAllCustomer()
  },[])

  const getExportWareHouse = async () => {
    await tankTruckApi.getExportWarehouse()
    .then(data => {
      if (data.data.status) {
        setListWarehouse(data.data.WareHouse)
      }
    })
  }

  const getAllCustomer = async () => {
    const token = await getToken();
    await tankTruckApi.getAllCustomer(token)
    .then(data => {
      if (data.data) {
        setListCustomer(data.data.GetCustomer)
      }
    })
  }
  
  const onNext = () => {
    if (selectedWarehouse && selectedCustomer && weight 
      && dateStart !=translate("START_DATE") 
      && dateEnd !=translate("END_DATE") ) {  
      Actions['ConfirmOrderTank']({
        data: {
          selectedWarehouse,
          selectedCustomer,
          weight,
          dateStart,
          dateEnd,
          timeStart,
          note,
        }
      })
    } else {
      Alert.alert(translate('notification'), translate('REQUIRED_FIELDS'))
    }
  }

  const timePickerBtn = (type, mode, dataType) => {
    let iconName = type == 'timeStart' ? 'clockcircleo' : 'calendar';
    return(
      <TouchableOpacity 
        style={styles.timePickerStyle}
        onPress={() => {
          setIsVisible(true);
          setMode(mode);
          setType(type);
        }}>
        <Icon name={iconName} size={20} color="gray"/>
        <Text style={{color: '#000', paddingHorizontal: 5}}>{dataType}</Text>
      </TouchableOpacity>
    )
  }
  
  return (
    <View>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.textStyle}>{translate("WAREHOUSE")}</Text>
          <View style={styles.pickerStyle}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedWarehouse(value)}
              placeholder={{
                label: translate('CHOOSING_EXPORT_WAREHOUSE'),
                value: null,
              }}
              style={{
                inputIOS: {
                  fontSize: 16,
                  color: 'black',
                },
                inputAndroid: {
                  fontSize: 16,
                  color: 'black',
                },
              }}
              items={listWarehouse.map(warehouse => {
                return(
                  {
                    label: warehouse.name,
                    value: warehouse
                  }
                )
              })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.textStyle}>{translate("CUSTOMER")}</Text>
          <View style={styles.pickerStyle}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCustomer(value)}
              placeholder={{
                label: translate('CUSTOMER'),
                value: null,
              }}
              style={{
                inputIOS: {
                  fontSize: 16,
                  color: 'black',
                },
                inputAndroid: {
                  fontSize: 16,
                  color: 'black',
                },
              }}
              items={listCustomer.map(customer => {
                return(
                  {
                    label: customer.name,
                    value: customer
                  }
                )
              })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.textStyle}>{translate("ENTER_WEIGHT")}</Text>
          <OutlinedTextField 
          label={translate("WEIGHT")}
          keyboardType='phone-pad'
          onChangeText={text => setWeight(text)}/>
        </View>

        <View style={styles.section}>
          <Text style={styles.textStyle}>{translate("DELIVERY_TIME")}</Text>
          <View style={styles.datePickStyle}>
            {timePickerBtn('dateStart', 'date', dateStart)}
            {timePickerBtn('dateEnd', 'date', dateEnd)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.textStyle}>{translate("TIME_DELIVER")}</Text>
          <View style={styles.datePickStyle}>
            {timePickerBtn('timeStart', 'time', timeStart)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.textStyle}>{translate("NOTES")}</Text>
          <OutlinedTextField 
          label={translate("NOTES")}
          multiline
          onChangeText={text => setNote(text)}/>
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        locale={'vi'}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setIsVisible(false);
          switch(type){
            case 'dateStart':
              setDateStart(moment(date).format('DD/MM/YYYY'));
              break;
            case 'dateEnd':
              setDateEnd(moment(date).format('DD/MM/YYYY'));
              break;
            default:
              setTimeStart(moment(date).format('HH:mm'));
              break;
          }
        }}
        onCancel={() => setIsVisible(false)}
        confirmTextIOS="Chọn"
        cancelTextIOS="Bỏ chọn"
        headerTextIOS="Chọn thời gian"
        pickerContainerStyleIOS={{
          backgroundColor: 'grey',
          styleLabel: {
            color: '#fff'
          }
        }}
      />
      <TouchableOpacity 
      style={styles.btnStyle}
      onPress={onNext}>
        <View style={styles.cartIcon}>
          <Icon name="shoppingcart" size={25} color={'#fff'}/>
        </View>
        <Text style={styles.btnTextStyle}>{translate("CONTINUE")}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 40
  },
  section: {
    marginBottom: 10
  },
  textStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#009347',
    paddingBottom: 10
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    paddingHorizontal: 10
  },
  pickerStyle: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5
  },
  datePickStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timePickerStyle: {
    width: '45%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal:10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5
  },
  customerNameBtn: {
    height: 57.5,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa'
  },
  customerNameBtnText: {
    marginLeft: 10,
    fontSize: 15,
  },
  btnStyle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    width: '100%',
    height: 40,
    backgroundColor: '#F6921E',
  },
  btnTextStyle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  },
  searchInput: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '80%',
    height: 40,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    color: '#000',
  },
  searchIcon: {
    justifyContent:'center',
    height: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 5
  },
  cartIcon: {
    position: 'absolute',
    top: 7.5,
    left: 10,
  }
})

