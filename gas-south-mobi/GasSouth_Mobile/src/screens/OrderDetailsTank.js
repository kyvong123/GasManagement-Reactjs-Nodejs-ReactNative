import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux';
import IconAnt from 'react-native-vector-icons/AntDesign';
import tankTruckApi from '../api/tankTruck';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export default function OrderDetailsTank(props) {
  const item = props.data;

  const translateStatus = (status) => {
    switch (status) {
      case 'INIT':
        return translate('INIT')
      case 'PROCESSING':
        return translate('PROCESSING')
      case 'DELIVERING':
        return translate('DELIVERING')
      case 'DONE':
        return translate('DONE')
      case 'CANCEL':
        return translate('CANCEL')
    }
  }

  const onSendNotify = async () => {
    Alert.alert(
      translate('notification'),
      translate('SEND_NOTIFICATION_TO_WAREHOUSE'),
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: async () => {
            tankTruckApi.sendNotification(
              {
                title: 'Xác nhận đơn hàng',
                data: 'Đơn hàng của bạn đã được xác nhận',
                appname: "GasSouth",
                device: item.warehouse_playerID,
                iddata: null
              }
            ).then(data => {
              if (data.data.status) {
                Alert.alert(translate('notification'), translate('SEND_NOTIFICATION_SUCCESS'))
              } else {
                Alert.alert(translate('notification'), translate('Problem'))
              }
            })
          },
        },
      ],
      { cancelable: false },
    )
  }

  const onDeleteOrder = async (id) => {
    Alert.alert(
      translate('notification'),
      translate('CANCEL_ORDER'),
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: async () => {
            console.log(id);
            await tankTruckApi.deleteOrderTank({
              ordertankId: id
            })
              .then(data => {
                console.log(data.data);
                if (!data.data.status) {
                  Alert.alert(translate('notification'), translate('CANCEL_ORDER_SUCCESS'));
                  Actions.jump("_home");
                }
              })
          },
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <View style={{ backgroundColor: '#eee' }}>
      <View style={styles.container1}>
        <View>
          <Text style={styles.orderText}>{item.order.orderCode}</Text>
          <Text style={{ fontSize: 12 }}>
            <IconAnt name="clockcircleo" size={10} />
            {' '}{item.order.todeliveryDate} - {item.order.deliveryHours}</Text>
        </View>
        <Text style={styles.orderText}>{item.order.customergasId?.branchname}</Text>
      </View>

      <View style={styles.container2}>
        <Text style={{ fontSize: 15, color: '#000' }}>{translate('STATUS')}: {translateStatus(item.order.status)}</Text>
        <Text style={{ fontSize: 15, color: '#000' }}>{translate('WAREHOUSE')}: {item.order.warehouseId.name}</Text>
      </View>

      <View style={styles.container3}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onSendNotify()}>
          <Text style={styles.btnText}>{translate('CONFIRM')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onDeleteOrder(item.order.id)}>
          <Text style={styles.btnText}>{translate('CANCEL_DETAIL')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container1: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container2: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  container3: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderStyle: {
    height: 70,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    paddingBottom: 5
  },
  btn: {
    width: 110,
    height: 50,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6921E',
    borderRadius: 5,
  },
  btnText: {
    fontWeight: 'bold',
    color: '#fff'
  }
})
