import HomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { ORDER_STATUS } from '../Order/OrderManager/utils/statusType';

import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView,SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import { getOrders } from '../../api/orders_new';
import { COLOR } from '../../constants';
import { useTailwind } from 'tailwind-rn';
import { getOrderDetail, getHistoryOrders, getDetailHistoryOrderItem } from '../../api/orders_new';
import { getOrdersStatis,getOrdersStatisDetail } from '../../api/orders_statistical';
import { Button } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { truckStoreCurrentOrder, changeTypeDeliveryTruckAction } from '../../actions/TruckDeliveryActions';
import saver from '../../utils/saver';
import { SHIPPING_TYPE } from '../../constants';
import TruckDeliveryHistoryOrderItem from './HistoryTruck/TruckDeliveryHistoryOrderItem';
import { property } from 'lodash';

const TruckStatisticDetail = (props) => {
    const tw = useTailwind();
    //const [isDropdown, setDropdown] = useState(false);   
    const [orderDetail, setOrderDetail] = useState();
    //console.log("PROPS",props);
    const getOrdersDetail = () => {
        getOrdersStatisDetail({orderId: props.id,type: props.shippingType})
            .then(({ data }) => {
                if (data) {
                    setOrderDetail(data);
                } else {
                    throw new Error();
                }
            })
            .catch(err => {
                console.log("LỖI LẤY CHI TIẾT ĐƠN HÀNG", err);
                setOrderDetail(null);
            });
    }
    console.log("orderDetail",orderDetail);
    useEffect(() => {
        getOrdersDetail()
    },[]);

    // const getTotalGasCylinder = () => orderDetail ? orderDetail.reduce((acc, { quantity }) => acc + quantity, 0) : null;

    // const getTotalGasCylinderNotDelivery = async data => {
    //     const arrDetailHistoryOrderItem = await Promise.all(data.map(item => getDetailHistoryOrderItem(item.id, item.shippingType)))
    //     const totalGasCylinderDeliveryed = arrDetailHistoryOrderItem.filter(item => item.shippingType === SHIPPING_TYPE.GIAO_HANG || item.shippingType === SHIPPING_TYPE.GIAO_VO).reduce((sum, item) => sum + item.data.reduce((sum, item) => sum + item.count, 0), 0)
    //     return getTotalGasCylinder() - (totalGasCylinderDeliveryed || 0);
    // }

    return (
        <SafeAreaView>
            {/* _______START HEADER ________ */}
            <View style={tw('flex items-center justify-between flex-row bg-[#04aa6b] py-4 px-3')}>
                <View>
                    <BackIcon onPress={() => Actions.pop()} color={'#FFF'} size={30} name="ios-arrow-back" />
                </View>
                <Text style={tw('text-lg text-white font-black ')}>Chi tiết giao hàng</Text>
                <View>
                    <HomeIcon onPress={() => { Actions['home']({}) }} name="home-outline" size={30} color="#FFF" />
                </View>
            </View>
            {/* _______END HEADER ________ */}
            <View>              
                <TouchableOpacity style={styles.container}>
                    <View style={styles.itemOrder}>
                        <View style={styles.itemOrderLeft}>
                            <Text style={[styles.itemIdOrderText]}>
                                {props.orderCode}
                            </Text>
                            <Text style={[styles.itemIdOrderText]}>
                                {props.customerName}
                            </Text>
                            {/* Place */}
                            <View style={styles.flexRow}>
                                <FontAwesome5
                                    name="map-marker-alt"
                                    size={15}
                                    style={{ marginRight: 5, color: "#000000" }}
                                />
                                <Text style={styles.itemOrderLeftText}>{props.customerAddress}</Text>
                            </View>
                        </View>
                        <View style={styles.itemOrderRight}>
                            <Text style={[styles.itemOrderRightText, { marginTop: 5 }]}>
                                Ngày giao: {'\n'}
                                {props.date.map(_date => `${moment(_date).format('HH:mm MM/DD/YYYY')}\n`)}
                            </Text>

                        </View>
                        <View
                            hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                            style={styles.iconDropdown}
                        //onPress={() => setDropdown(!isDropdown)}
                        >
                            <AntDesign
                                name='down'
                                size={15}
                                color='#000'
                            />
                        </View>
                    </View>
                </TouchableOpacity >               
            </View>

                <View >
                    {/* Thông tin overview đơn hàng */}
                    <View style={{margin: 10}}>
                        <View style={[tw('flex-row ml-5 items-center'), { marginLeft: 10 }, { flexDirection: 'row' }]}>
                            <FontAwesome5
                                name="truck"
                                size={15}
                                style={{ marginRight: 5, color: "#000000" }}
                            />
                                <Text style={styles.historyText}> Lịch sử giao nhận</Text>
                        </View>

                    </View>

                    <View >
                        {orderDetail ? orderDetail.map((item, index) =>
                            <View style={styles.container}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 10 }}>
                                    <Text style={styles.contentText}>Ngày: {moment(item.deliveryDate).format('MM/DD/YYYY HH:mm')}</Text>
                                    <Text style={styles.contentText}>Tổng số lượng: {item.total} </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 10 }}>
                                    <Text style={styles.contentText}>Tài xế: {item.driverName}</Text>
                                    <Text style={styles.contentText}>Biển số xe: {item.licensePlate}</Text>
                                </View>
                                <View style={styles.listGas}>
                                    <View style={{ marginBottom: 10 }}>
                                        {item.cylinders.map((_cylinder => _cylinder.reasonReturnName)) ?
                                            <Text style={styles.informationText}>
                                                Hồi lưu bình lỗi
                                            </Text>
                                        :
                                        <Text style={styles.informationText}>
                                            Thông tin {props.shippingType == "GIAO_HANG" ? "giao hàng" : "hồi lưu"}
                                        </Text>
                                        }
                                        <Text style={styles.typeCylinderText}>
                                            {item.cylinders.map((_cylinder => _cylinder.manufactureName)).join("")} - Loại {item.cylinders.map((_cylinder => _cylinder.cylinderTypeName))}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <Text>Màu: {item.cylinders.map((_cylinder => _cylinder.color)).join("")}</Text>
                                            <Text>Van: {item.cylinders.map((_cylinder => _cylinder.valve)).join("")}</Text>
                                            <Text>Số lượng: {item.cylinders.map((_cylinder => _cylinder.count)).join("")}</Text>
                                        </View>
                                        {item.cylinders.map((_cylinder => _cylinder.reasonReturnName)) ?
                                            <Text style={styles.typeCylinderText}>
                                                Lý do: {item.cylinders.map((_cylinder => _cylinder.reasonReturnName)).join("")}
                                            </Text>
                                        :
                                        null
                                        }
                                    </View>
                                </View>
                            </View>
                                
                            ) : (
                                orderDetail === null ?
                                    <Text style={styles.orderErr}>Lỗi lấy thông tin đơn hàng này</Text>
                                    :
                                    <View style={{ marginBottom: 15 }}>
                                        <ActivityIndicator size="large" color="#00ff00" />
                                    </View>
                            )}
                    </View>
                </View>

        </SafeAreaView>
    )
}

export default TruckStatisticDetail

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        margin: 10,
    },

    orderErr: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 20
    },

    iconDropdown: {
        alignSelf: 'flex-end',
        paddingRight: 15,
        paddingBottom: 10,
    },

    listGas: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#bdbfbd',
        margin: 10,
        color: '#000000'
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
    historyText: {
        fontWeight: 'bold', 
        marginLeft: 2, 
        fontSize:15,
        color: "#000000"
    },
    contentText: {
        fontWeight: 'bold', 
        marginLeft: 2, 
        fontSize:14,
        color: "#000000"
    },
    totalDeliText: {
        fontWeight: 'bold', 
        fontSize: 14,
        color: "#04aa6b",
        marginLeft: 110
    },
    informationText: {
        marginLeft: 10, 
        marginTop: 10, 
        fontWeight: "bold", 
        fontSize: 16, 
        color: '#000000' 
    },
    typeCylinderText: {
        margin: 10,
        marginLeft: 25,
        fontWeight: "bold", 
        fontSize: 14, 
        color: '#000000' 
    },

});