import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { ORDER_STATUS } from '../Order/OrderManager/utils/statusType';

import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { getOrdersForDelivery } from '../../api/orders_new';
import { COLOR } from '../../constants';
import { useTailwind } from 'tailwind-rn';
import { getOrderDetail } from '../../api/orders_new';
import { useSelector, useDispatch } from 'react-redux';
import { DonHang } from './donHang';

import ItemOrder from './TruckItemOrder';

export default TruckListOrder = () => {
    const tw = useTailwind();
    const userInfo = useSelector(state => state.auth._userInfo);
    const [orders, setOrders] = useState();
    const [refreshing, setRefreshing] = useState(true);


    const _getOrdersForDelivery = () => {
        setRefreshing(false)
        //setOrders(DonHang)
        getOrdersForDelivery(userInfo.isChildOf, userInfo.id)
            .then(data => {
                setRefreshing(false);
                if (data.success) {
                    setOrders(data.data);
                } else {
                    setOrders(null);
                }
            })
            .catch(console.log);
    }

    useEffect(() => {
        _getOrdersForDelivery();
    }, []);

    const onRefresh = () => {
        _getOrdersForDelivery();
    };

    // ForFlatlist
    const renderItem = props => {
        return <ItemOrder {...props} />
    }

    return (
        <>
            <View style={tw('flex items-center justify-between flex-row bg-[#008a00] py-4 px-3')}>
                <View>
                    <BackIcon onPress={() => Actions['home']({})} color={'#FFF'} size={30} name="ios-arrow-back" />
                </View>
                <Text style={tw('text-lg text-white font-black ')}>Đơn hàng</Text>
                <View>
                    <HomeIcon onPress={() => Actions['home']({})} name="home-outline" size={30} color="#FFF" />
                </View>
            </View>
            {orders ?
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                :
                (orders === null ?
                    <View style={{ height: '60%', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}> Không có đơn hàng</Text>
                    </View>
                    :
                    <View style={{ height: '100%', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                )

            }
        </>
    )
}

