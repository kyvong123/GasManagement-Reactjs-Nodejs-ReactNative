import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { ORDER_STATUS } from '../Order/OrderManager/utils/statusType';

import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { getOrders } from '../../api/orders_new';
import { COLOR } from '../../constants';
import { useTailwind } from 'tailwind-rn';
import { getOrderDetail, getHistoryOrders, getDetailHistoryOrderItem } from '../../api/orders_new';
import { getOrdersStatis } from '../../api/orders_statistical';
import { Button } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { truckStoreCurrentOrder, changeTypeDeliveryTruckAction } from '../../actions/TruckDeliveryActions';
import saver from '../../utils/saver';
import { SHIPPING_TYPE } from '../../constants';
import TruckDeliveryHistoryOrderItem from './HistoryTruck/TruckDeliveryHistoryOrderItem';

// Render item order
const ItemOrderStatis = ({ item, type }) => {
    const tw = useTailwind();
    const dispatch = useDispatch();

    const [isDropdown, setDropdown] = useState(false);
    const [orderDetail, setOrderDetail] = useState("TONY123");
    const [deliveryHistorys, setDeliveryHistorys] = useState();

    const [totalGasCylinderNotDelivery, setTotalGasCylinderNotDelivery] = useState(null);


    const handleClickOrderItem = () => {
        Actions['TruckStatisticDetail']( {
            id: item.orderId,
            orderCode: item.orderCode,
            customerName: item.customerName,
            customerAddress: item.customerAddress,
            date: item.date,
            shippingType: type
          })
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handleClickOrderItem}>
            <View style={styles.itemOrder}>
                <View style={styles.itemOrderLeft}>
                    <Text style={[styles.itemIdOrderText]}>
                        {item.orderCode}
                    </Text>
                    <Text style={[styles.itemIdOrderText]}>
                        {item.customerName}
                    </Text>
                    {/* Place */}
                    <View style={styles.flexRow}>
                        <FontAwesome5
                            name="map-marker-alt"
                            size={15}
                            style={{ marginRight: 5, color: "#000000" }}
                        />
                        <Text style={styles.itemOrderLeftText}>{item.customerAddress}</Text>
                    </View>
                </View>
                <View style={styles.itemOrderRight}>
                    <Text style={[styles.itemOrderRightText, { marginTop: 5 }]}>
                        Ngày giao: {'\n'}
                        {item.date.map(_date => `${moment(_date).format('HH:mm MM/DD/YYYY')}\n`)}
                    </Text>

                </View>
            </View>


            <View
                hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                style={styles.iconDropdown}
                onPress={() => setDropdown(!isDropdown)}
            >
                <AntDesign
                    name={isDropdown ? 'up' : 'down'}
                    size={15}
                    color='#000'
                />
            </View>
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        margin: 10,
    },
    iconDropdown: {
        alignSelf: 'flex-end',
        paddingRight: 15,
        paddingBottom: 10,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    itemOrder: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    itemOrderLeft: {
        flex: 0.7,
    },
    itemIdOrderText: {
        fontWeight: 'bold',
        color: '#3d3d3d',
        marginBottom: 5,
        fontSize:20,
    },
    itemOrderLeftText: {
        fontSize:15,
    },
    itemOrderRightText: {
        fontSize:15,
    },
    itemOrderRight: {
        flex: 0.3,
        marginLeft: '10%',
    },
});

export default ItemOrderStatis;