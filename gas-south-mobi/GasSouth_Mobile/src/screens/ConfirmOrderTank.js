import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getUserInfo } from '../helper/auth';
import IconAnt from 'react-native-vector-icons/AntDesign';
import tankTruckApi from '../api/tankTruck';
import Modal from 'react-native-modal';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export default function ConfirmOrderTank(props) {
  const data = props.data;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onCreateOrder = async () => {
    const userInfo = await getUserInfo(); 
    let code = 'DH'+data.dateStart.split('/')[0]+data.dateStart.split('/')[1]+data.dateStart.split('/')[2].substring(2,-1)+'-'+Math.floor(Math.random()*(99999 - 10000 + 1) +10000);
    await tankTruckApi.createOrderTank(
      {
        orderCode: code,
        customergasId: data.selectedCustomer.id,
        userId: userInfo.id,
        warehouseId: data.selectedWarehouse.id,
        quantity: data.weight,
        divernumber: '59-M1 8888',
        typeproduct: 'tank truck',
        fromdeliveryDate: data.dateStart,
        todeliveryDate: data.dateEnd,
        deliveryHours: data.timeStart,
        reminderschedule: "15/12/2020",
        note: data?.note,
        image: ["abc123", "123", "acb"]
      }
    ).then(data => {
      console.log('onCreateOrder--->',data.data);
      if (data.data.status) {
        Alert.alert(translate('notification'), translate('CREATE_NEW_ORDER_SUCCESS'));
        Actions.jump("_home");
      } else {
        Alert.alert(translate('notification'), translate('Problem'));
      }
    })
    setIsOpenModal(false);
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <TouchableOpacity 
        style={styles.closeStyle}>
          <IconAnt name="closecircle" size={20} color={'gray'}/>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.deleteStyle}>
          <Text> {translate('DELETE')} </Text>
        </TouchableOpacity>
        
        <View style={styles.article}>
          <Text style={styles.articleText}>{translate('ORDER_INFORMATION')}</Text>
        </View>
        <Text style={styles.screenText}>
          {translate('WAREHOUSE')}:{'  '}
          <Text style={styles.screenText2}>{data.selectedWarehouse.name}</Text>
        </Text>
        <Text style={styles.screenText}>
          {translate('CUSTOMER')}:{'  '} 
          <Text style={styles.screenText2}>{data.selectedCustomer.name}</Text>
        </Text>
        <Text style={styles.screenText}>
          {translate('ADDRESS')}:{'  '}
          <Text style={styles.screenText2}>{data.selectedCustomer.address}</Text>
        </Text>
        <Text style={styles.screenText}>
          {translate('DELIVERY_TIME')}:{'  '} 
          <Text style={styles.screenText2}>{data.dateStart} - {data.dateEnd}</Text>
        </Text>
        <Text style={styles.screenText}>
          {translate('WEIGHT')}:{'  '} 
          <Text style={styles.screenText2}>{data.weight} tấn</Text>
        </Text>
        <Text style={styles.screenText}>
          {translate('NOTE')}:{'  '} 
          <Text style={styles.screenText2}>{data?.note}</Text>
        </Text>
      </View>

      <TouchableOpacity 
      style={styles.btnStyle}
      onPress={() => setIsOpenModal(true)}>
        <View style={styles.cartIcon}>
          <IconAnt name="shoppingcart" size={25} color={'#fff'}/>
        </View>
        <Text style={styles.btnTextStyle}>{translate("CREATE_ORDERS")}</Text>
      </TouchableOpacity>

      <Modal
      isVisible={isOpenModal}
      onBackdropPress={() =>  setIsOpenModal(false)}
      modalStyle={{
        width: '100%',
      }}>
        <View style={styles.confirmOrderStyle}>
          <Text style={{fontSize: 17, textAlign: 'center', color: '#000', paddingBottom: 5}}>{translate("CONFIRM_ORDER")}</Text>
          <Text style={{textAlign: 'center'}}>
            {translate('DO_YOU_WANT_TO_CREAT_AN_ORDER')}{' '}{data.selectedCustomer.name}
            {' - '} {translate('WEIGHT')} {data.weight}
            {'.'} {translate('DELIVERY_TIME')} {data.dateStart} {data.timeStart!=translate("DELIVERY_TIME") ? ' - '+data.timeStart : ''}
          </Text>
          <View style={styles.buttonsStyle}>
            <TouchableOpacity
            style={styles.btn}
            onPress={onCreateOrder}>
              <Text>{translate('CONFIRM')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.btn}
            onPress={() =>  setIsOpenModal(false)}>
              <Text>{translate('CANCEL')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: { 
    margin: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  article: {
    justifyContent:'center',
    alignItems: 'center',
    marginBottom: 10
  },
  articleText: {
    fontSize: 17,
    color: '#009347'
  },
  screenText: {
    color: '#000',
    fontWeight: 'bold',
    paddingVertical: 5
  },
  screenText2: {
    color: 'gray',
    fontWeight: 'bold',
    paddingVertical: 5
  },
  closeStyle: {
    position: 'absolute',
    top: 5,
    left: 5
  },
  deleteStyle: {
    position: 'absolute',
    top: 5,
    right: 5 
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
  cartIcon: {
    position: 'absolute',
    top: 7.5,
    left: 10,
  },
  confirmOrderStyle: {
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonsStyle: {
    flexDirection: 'row',
    paddingTop: 30,
  },
  btn: {
    width: '45%',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
  }
})
