import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getLstChilds } from "../../actions/OrderActions";
import { getToken, getUserInfo } from '../../helper/auth';
import { Actions } from 'react-native-router-flux';
import statisticsApi from '../../api/statistics2';
import Images from "../../constants/image";
import Icon from 'react-native-vector-icons/Ionicons';
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import { COLOR } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDeliveryStatistics, getRevenue } from '../../api/orders_new';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);

const StatisticRevenue = (props) => {

    const statistics = useSelector(deliveryStatistics => deliveryStatistics);

    // itemStatistic data
    const [dataStatistic, setDataStatistic] = useState()
    const [dataStatisticTemp, setDataStatisticTemp] = useState()

    const [date, setDate] = useState({
        firstDay: null,
        lastDay: null
    })
    const now = new Date();

    //formmat date
    const formatDate = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        const text = year + '-' + month + '-' + dt
        return text
    }

    //formmat date
    const formatDateIncreaseDay = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate() + 1;

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        const text = year + '-' + month + '-' + dt
        return text
    }

    //formmat date
    const formatDate2 = (date) => {
        const newDate = date.split('-')
        const text = newDate[2] + '/' + newDate[1] + '/' + newDate[0]
        return text
    }
    const compare = (a, b) => {
        if (a._id.name < b._id.name) {
            return -1;
        }
        if (a._id.name > b._id.name) {
            return 1;
        }
        return 0;
    }
    const formatPrice = (price) => {
        const text = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " VNĐ";

        return text
    }


    const getStatistic = async () => {

        try {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
            const response = await getRevenue(formatDate(firstDay), formatDateIncreaseDay(lastDay))
            if (response.success) {
                setDataStatistic(response.data);
                setDataStatisticTemp(response.data)
            } else {
                setDataStatistic([]);
                setDataStatisticTemp([])
            }
        } catch (err) {
            console.log("LỖI FETCH API,", err);
        }
    }

    const getStatisticFilter = (arr) => {
        setDate({ ...date, firstDay: props.date.firstDay, lastDay: props.date.lastDay })
        setDataStatistic(arr)
        setDataStatisticTemp(arr)
    }

    const sum = (arr) => {
        var quantity = 0
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                // if (arr[i].price != null) {
                quantity += arr[i]._id.mass * arr[i].count
                // }
            }
        }
        return quantity
    }

    const sumQuantity = (arr) => {
        var quantity = 0
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                // if (arr[i].price != null) {
                quantity += arr[i].count
                // }
            }
        }
        return quantity
    }

    const handleSearch = async (text) => {
        //  setDataStatistic(dataStatisticTemp)
        // if (text) {
        setDataStatistic(dataStatisticTemp.filter(item => item.customerName.toLowerCase().includes(text.toLowerCase())))
        // } else {
        //     setDataStatistic(dataStatisticTemp)
        // }
    }

    useEffect(() => {
        props.date ? getStatisticFilter(props.list) : getStatistic()
        // props.date ? console.log(props.date) : console.log("111")
    }, [props]);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.Nav_container}>
                <TouchableOpacity
                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                    onPress={() => Actions['home']({})}
                >
                    <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
                </TouchableOpacity>
                <Text style={styles.Nav_title}>{translate('STATISTICAL_REVENUE')}</Text>
                <View style={{ marginRight: 5 }}>
                    <TouchableOpacity
                        onPress={() => { Actions['filterStatisticRevenue']({}) }}>
                        <FontAwesome5Icon
                            name="filter"
                            size={18}
                            style={{ color: COLOR.WHITE }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.articleSection}>
                <AntDesign
                    name="calendar"
                    size={20}
                    style={[{ marginRight: 5 }, styles.txtGray]}
                />
                {date.firstDay ? <Text style={{ fontSize: 16, }}>{formatDate2(date.firstDay)} - {formatDate2(date.lastDay)}</Text> : null}
            </View>
            {dataStatistic ? (dataStatistic.length == 0 ? null :
                <View style={styles.ViewSearch}>
                    <TextInput
                        placeholder="nhập tên khách hàng"
                        placeholderTextColor={COLOR.GRAY}
                        style={{ height: 40, paddingHorizontal: 10 }}
                        keyboardType={'default'}
                        onChangeText={async (e) => { handleSearch(e) }}
                    />
                </View>) : null}
            <ScrollView contentContainerStyle={styles.container}>

                {dataStatistic ? (dataStatistic.length == 0 ?
                    <View style={{ height: '100%', justifyContent: 'center', marginVertical: 20 }}>
                        <Text style={{ textAlign: 'center', color: COLOR.GRAY }}>Không tìm thấy</Text>
                    </View> : <>
                        {
                            dataStatistic.map((item, index) =>
                                <View style={{ marginBottom: 20, }}>
                                    <View style={{ padding: 10, backgroundColor: COLOR.GREEN_MAIN, alignItems: 'center' }}>
                                        <Text style={[styles.txtItemStatistic, { fontWeight: "bold", color: COLOR.WHITE }]}>{item.customerName}</Text></View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={styles.viewTitle}>
                                            <Text style={[styles.txtItemStatistic, { fontWeight: "bold" }]}>Ngày giao</Text>
                                        </View>
                                        <View style={styles.viewTitle}>
                                            <Text style={[styles.txtItemStatistic, { fontWeight: "bold" }]}>Đơn hàng</Text>
                                        </View>
                                        <View style={styles.viewTitle}>
                                            <Text style={[styles.txtItemStatistic, { fontWeight: "bold" }]}>Doang thu</Text>
                                        </View>
                                    </View>
                                    {item.orders.map((value) =>
                                        <TouchableOpacity style={styles.itemStatistic}
                                            onPress={() => { Actions['statisticRevenueDetails']({ date, orderID: value._id.orderId }) }}>
                                            <View style={[styles.viewTitle, { backgroundColor: COLOR.WHITE }]}>
                                                {value.shipping.map(e => <Text style={styles.txtItemStatistic}>{formatDate2(e.deliveryDate)}</Text>)}</View>
                                            <View style={[styles.viewTitle, { backgroundColor: COLOR.WHITE }]}>
                                                <Text style={styles.txtItemStatistic}>{value.orderCode}</Text></View>
                                            <View style={[styles.viewTitle, { backgroundColor: COLOR.WHITE, alignItems: 'flex-end' }]}>
                                                <Text style={styles.txtItemStatistic}>{formatPrice(value.revenue)}</Text></View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )
                        }
                    </>) : <View style={{ height: '100%', justifyContent: 'center', marginVertical: 20 }}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>}
            </ScrollView>
        </View >
    )
}
export default StatisticRevenue;

const styles = StyleSheet.create({
    container: {
        // flex: 1

    },
    articleSection: {
        flexDirection: 'row',
        padding: 10,
        paddingVertical: 10,
        backgroundColor: COLOR.GRAY_OPTION
    },
    Nav_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#009347',
        alignItems: 'center'
    },
    Nav_title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff'
    }, txtItemStatistic: {
        // fontSize: 1,
        color: COLOR.DARKGRAY
    }, viewTitle: {
        flex: 1,
        borderColor: COLOR.GRAY,
        borderWidth: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#54ad32"
    },
    itemStatistic: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // // padding: 20,
        // borderBottomColor: COLOR.GRAY_OPTION,
        // borderBottomWidth: 2,
    },
    ViewSearch: {
        borderWidth: 0.5,
        borderRadius: 10,
        // flex: 4.5,
        backgroundColor: COLOR.WHITE,
        margin: 10
    },
})


