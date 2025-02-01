import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useTailwind } from 'tailwind-rn';
import { SHIPPING_TYPE } from '../../../constants';
import moment from 'moment';
import { getDetailHistoryOrderItem, getOrderDetail, getHistoryOrders } from '../../../api/orders_new';
import { useState } from 'react';


const DeliveryHistoryOrderItem = props => {
    const { driverName, transport, createdAt, shippingType, id } = props;
    const tw = useTailwind();
    const [itemCylinders, setItemCylinders] = useState([]);
    useEffect(() => {
        getDetailHistoryOrderItem(id)
            .then(res => {
                if (res.success) {
                    setItemCylinders(res.data);
                } else {
                    setItemCylinders(null);
                }
            })
    }, []);

    return (
        <View style={styles.listGas}>
            <View style={{ padding: 10 }}>
                <Text style={{ color: "#000000" }}>Tên tài xế: {driverName.toUpperCase()} </Text>
                <Text style={{ color: "#757575" }}>Biển số xe: {transport} </Text>
                <Text style={{ color: "#757575" }}>Ngày giao: {moment(createdAt).format('h:mm MM/DD/YYYY')} </Text>
                <View style={[tw('flex-row'), { marginVertical: 15, fontWeight: 'bold' }]}>
                    <Text style={{ color: "#000000" }}>Thông tin </Text>
                    <Text style={{ color: "#000000", fontWeight: "bold" }}>{shippingType === SHIPPING_TYPE.GIAO_HANG ? "giao hàng" : (shippingType === SHIPPING_TYPE.GIAO_VO ? "giao vỏ" : shippingType)}:</Text>
                </View>
                <View>
                    {itemCylinders == null ?
                        <View>
                            <Text>Lỗi Lấy chi tiết bình</Text>
                        </View>
                        :
                        itemCylinders == undefined ?
                            <View style={{ marginBottom: 15 }}>
                                <ActivityIndicator size="large" color="#00ff00" />
                            </View>
                            :
                            itemCylinders.length > 0 ?
                                <View>
                                    <Text style={{ color: "#000000" }}> Số lượng {itemCylinders.reduce((sum, { count }) => sum + count, 0)}</Text>
                                    <Text></Text>
                                    {itemCylinders.map(({ _id, count }, index) =>
                                        <>
                                            <View style={tw('flex-row flex-wrap justify-between')}>
                                                <Text style={{ width: "30%" }}>{_id.manufactureName} - </Text>
                                                <Text style={{ width: "30%" }}>{_id.name} </Text>
                                                <Text style={{ width: "30%" }}>Màu: {_id.color} </Text>
                                                <Text style={{ width: "30%" }}>Van: {_id.valve} </Text>
                                                <Text style={{ width: "30%", marginLeft: 20 }}>Số lượng {count} </Text>
                                            </View>
                                            {index !== itemCylinders.length - 1 ?
                                                <Text style={{
                                                    borderBottomColor: 'black',
                                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                                    marginBottom: 10
                                                }}></Text> : null}
                                        </>
                                    )}
                                </View>
                                : <Text>
                                    Không có chi tiết giao hàng
                                </Text>
                    }
                </View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    listGas: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#bdbfbd',
        margin: 10,
        color: '#000000'
    },
});

export default DeliveryHistoryOrderItem