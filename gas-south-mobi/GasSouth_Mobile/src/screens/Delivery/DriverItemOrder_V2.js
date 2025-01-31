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
import { Button } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { driverStoreCurrentOrder, changeTypeDeliveryAction } from '../../actions/DeliveryActions';
import saver from '../../utils/saver';
import { SHIPPING_TYPE } from '../../constants';
import DeliveryHistoryOrderItem from './HistoryDelivery/DeliveryHistoryOrderItem';

// Render item order
export default ItemOrder = ({ item, index }) => {
    const tw = useTailwind();
    const dispatch = useDispatch();

    const [isDropdown, setDropdown] = useState(false);
    const [orderDetail, setOrderDetail] = useState();
    const [deliveryHistorys, setDeliveryHistorys] = useState();

    const [totalGasCylinderNotDelivery, setTotalGasCylinderNotDelivery] = useState(null);

    useEffect(() => {
        if (orderDetail) {
            getHistoryOrders(item.id)
                .then(data => {
                    if (data.success && data.data.length > 0) {
                        console.log("PPPPP======>", data.data)
                        setDeliveryHistorys(data.data);
                    } else {
                        setDeliveryHistorys(null);
                    }
                    return getTotalGasCylinderNotDelivery(data.data);
                })
                .then(quantity => {
                    setTotalGasCylinderNotDelivery(quantity);
                })
                .catch(err => {
                    console.log("LỖI ", err)
                })
        };
    }, [orderDetail]);

    const getTotalGasCylinder = () => orderDetail ? orderDetail.reduce((acc, { quantity }) => acc + quantity, 0) : null;

    const getTotalGasCylinderNotDelivery = async data => {
        const arrDetailHistoryOrderItem = await Promise.all(data.map(item => getDetailHistoryOrderItem(item.id, item.shippingType)))
        const totalGasCylinderDeliveryed = arrDetailHistoryOrderItem.filter(item => item.shippingType === SHIPPING_TYPE.GIAO_HANG || item.shippingType === SHIPPING_TYPE.GIAO_VO).reduce((sum, item) => sum + item.data.reduce((sum, item) => sum + item.count, 0), 0)
        return getTotalGasCylinder() - (totalGasCylinderDeliveryed || 0);
    }


    const handleClickOrderItem = () => {
        setDropdown(!isDropdown);
        getOrderDetail(item.id)
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

    const handleDelivery = () => {
        dispatch(driverStoreCurrentOrder({
            orderDetail: orderDetail,
            orderOverview: item
        }));
        dispatch(changeTypeDeliveryAction(
            item.orderType === 'KHONG' ? SHIPPING_TYPE.GIAO_HANG : SHIPPING_TYPE.GIAO_VO
        ))
        saver.setTypeCamera(false);
        Actions.push('driverDeliveryScan');
    }

    return (
        <TouchableOpacity onPress={handleClickOrderItem} style={styles.container}>
            <View style={styles.itemOrder}>
                <View style={styles.itemOrderLeft}>
                    <Text style={[styles.itemIdOrderText, { marginBottom: 5 }]}>
                        {item.orderCode}
                    </Text>
                    <Text style={[styles.itemIdOrderText, { marginBottom: 5 }]}>
                        {item.customers.name}
                    </Text>
                    {/* CreateTime */}
                    <View style={[styles.flexRow, { marginBottom: 5 }]}>
                        <AntDesign
                            name="calendar"
                            size={15}
                            style={{ marginRight: 5, color: "#000000" }}
                        />
                        <Text style={[styles.itemOrderLeftText]}>
                            Ngày tạo: {moment(item.createdAt).format("MM:HH DD/MM")}
                        </Text>
                    </View>

                    {/* Place */}
                    <View style={styles.flexRow}>
                        <FontAwesome5
                            name="map-marker-alt"
                            size={15}
                            style={{ marginRight: 5, color: "#000000" }}
                        />
                        <Text style={styles.itemOrderLeftText}>{item.customers.address}</Text>
                    </View>
                </View>
                <View style={styles.itemOrderRight}>
                    <Text style={{ color: `${ORDER_STATUS.get(item.status).color}`, fontWeight: 'bold' }}>
                        {ORDER_STATUS.get(item.status).name}
                    </Text>
                    <Text style={[styles.itemOrderRightText, { marginTop: 5 }]}>
                        Ngày giao: {'\n'}
                        {item.delivery.map(({ deliveryDate }) => `${deliveryDate}\n`
                        )}
                    </Text>

                </View>
            </View>

            {isDropdown ?
                <View>
                    {/* Thông tin overview đơn hàng */}
                    <View style={styles.listGas}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 14, color: '#e80909' }}>Thông tin đặt hàng:</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000' }}>Tổng số lượng: {getTotalGasCylinder()}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10, marginHorizontal: 10 }}>
                            <Text style={{ fontWeight: "bold", fontSize: 14, color: '#000000' }}>Chưa giao: {totalGasCylinderNotDelivery}</Text>
                        </View>

                        {orderDetail ? orderDetail.map((item, index) =>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ marginLeft: 10, marginTop: 10, fontWeight: "bold", fontSize: 14, color: '#000000' }}>
                                    {item.manufacture.name} - Loại {item.categoryCylinder.name}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Text>Màu: {item.colorGas.name}</Text>
                                    <Text>Van: {item.valve.name}</Text>
                                    <Text>Số lượng: {item.quantity}</Text>
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
                    {/* Lịch sử đơn hàng */}
                    <View>
                        <View style={[tw('flex-row ml-5 items-center'), { marginLeft: 10 }]}>
                            <FontAwesome5
                                name="truck"
                                size={15}
                                style={{ marginRight: 5, color: "#000000" }}
                            />
                            <Text style={{ fontWeight: 'bold', marginLeft: 2, color: "#000000" }}>Lịch sử giao nhận</Text>
                        </View>
                        {deliveryHistorys != null && deliveryHistorys != undefined ?
                            <View>
                                {(deliveryHistorys ? deliveryHistorys : []).map(item => <DeliveryHistoryOrderItem {...item} />)}
                            </View> :
                            deliveryHistorys == null ?
                                <Text style={{ textAlign: 'center', marginVertical: 10 }}>Không có lịch sử giao nhận</Text> : null
                        }
                    </View>
                    <View style={tw('items-center')}>
                        <Button
                            width="45%"
                            isDisabled={orderDetail ? false : true} onPress={handleDelivery}
                            colorScheme={item.orderType === "KHONG" ? "green" : "orange"}>
                            {orderDetail === null ? "Lỗi lấy đơn hàng" : (item.orderType === "KHONG" ? "Giao hàng" : "Giao vỏ")}
                        </Button>
                    </View>
                </View>
                :
                null
            }
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

    headerList: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemHeader: (index, isChooseType) => {
        return {
            backgroundColor: index === isChooseType ? COLOR.ORANGE : '#fff',
            flexDirection: 'row',
            borderWidth: index === isChooseType ? 0 : 1,
            borderColor: '#ccc',
            borderRadius: 15,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
        };
    },
    itemSeparatorHeader: {
        width: 5,
    },
    itemHeaderText: (index, isChooseType) => {
        return {
            fontWeight: '600',
            color: index === isChooseType ? '#FFF' : COLOR.GRAY,
            textAlign: 'center',
        };
    },
    createOrderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    calendarCreateOrder: {
        flexDirection: 'row',
        flex: 1,
    },
    txtGray: {
        color: COLOR.GRAY,
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
    },
    itemOrderLeftText: {},
    itemOrderRightText: {},
    itemOrderRight: {
        flex: 0.3,
        marginLeft: '10%',
    },
    itemStatistics: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 2,
        borderColor: '#ccc',
    },
    itemStatisticsText: {
        color: COLOR.DARKGRAY,
        fontWeight: 'bold',
    },
    GroupSearch: {
        flexDirection: 'row',
        paddingTop: 10,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    ViewSearch: {
        borderColor: COLOR.GRAY,
        borderWidth: 0.5,
        borderRadius: 10,
        flex: 4.5,
        backgroundColor: COLOR.WHITE
    },
    inputNote: {
        height: 160,
        borderWidth: 1,
        borderColor: COLOR.GRAY,
        textAlignVertical: 'top',
        marginHorizontal: 5,
        borderRadius: 10,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 15,
        marginHorizontal: 15
    },
    btnText: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLOR.WHITE
    },
    btnXN: {
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 15,
        marginHorizontal: 15,
        backgroundColor: COLOR.GREEN_MAIN,
        alignItems: 'center',
        marginTop: 10
    }
});