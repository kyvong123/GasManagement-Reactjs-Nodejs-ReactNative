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
    SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getLstChilds } from "../..//actions/OrderActions";
import { getToken, getUserInfo } from '../../helper/auth';
import { Actions } from 'react-native-router-flux';
import statisticsApi from '../../api/statistics2';
import Images from "../../constants/image";
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import { Table, Cols, Rows, Col, Row, Cell } from 'react-native-table-component';
import { COLOR, } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDeliveryStatistics, getRevenueDetails } from '../../api/orders_new';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { SHIPPING_TYPE_STATUS } from '../../screens/Order/OrderManager/utils/statusType';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);

// const widthScreen = Dimensions.get('window').width;
const screenTextSize = 16;



const StatisticRevenueDetails = (props) => {

    const statistics = useSelector(deliveryStatistics => deliveryStatistics);

    // Items data
    const [detailStatistics, setDetailStatistics] = useState()
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



    const getStatistic = async () => {
        try {
            const response = await getRevenueDetails(props.orderID)
            if (response.success) {
                setDetailStatistics(response.data)
            } else {
                setDetailStatistics([])
            }
        } catch (err) {
            console.log("LỖI FETCH API,", err);
        }
    }

    const getStatisticFilter = (arr) => {
        setDate({ ...date, firstDay: props.date.firstDay, lastDay: props.date.lastDay })
    }

    const sum = (arr) => {
        var quantity = 0
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                // if (arr[i].price != null) {
                quantity += arr[i].categoryMass * arr[i].total
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
                quantity += arr[i].total
                // }
            }
        }
        return quantity
    }

    useEffect(() => {
        // getThisMonth()
        getStatistic()
        // props.date ? getStatisticFilter(props.list) : getStatistic()
        // props.date ? console.log("@@@@@@") : console.log('###########') 
    }, [props]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.Nav_container}>
                <TouchableOpacity
                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                    onPress={() => Actions['statisticRevenue']({})}
                >
                    <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
                </TouchableOpacity>
                <Text style={styles.Nav_title}>chi tiết thống kê doanh thu</Text>
                <View style={{ marginRight: 5 }}>
                    {/* <TouchableOpacity
                        onPress={() => { Actions['filterStatisticRevenueDetails']({}) }}>
                        <FontAwesome5Icon
                            name="filter"
                            size={18}
                            style={{ color: COLOR.WHITE }}
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
            <View style={styles.articleSection}>
                <AntDesign
                    name="calendar"
                    size={20}
                    style={[{ marginRight: 5 }, styles.txtGray]}
                />
                <Text style={styles.articleText}>{formatDate2(props.date.firstDay)} - {formatDate2(props.date.lastDay)}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {detailStatistics ? (detailStatistics.length == 0 ?
                    <View style={{ height: '100%', justifyContent: 'center', marginVertical: 20 }}>
                        <Text style={{ textAlign: 'center', color: COLOR.GRAY }}>Không tìm thấy</Text>
                    </View> :
                    <>
                        {
                            detailStatistics.map((item) =>
                                <View style={styles.table}>
                                    <View style={styles.tableHeader}>
                                        <View style={styles.agencySection}>
                                            <Text style={styles.textTable}>{SHIPPING_TYPE_STATUS.get(item._id).name}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                                            <Text style={styles.textTable}>Số lượng: {sumQuantity(item.categories)}</Text>
                                        </View>
                                    </View>
                                    {item.categories.map((value) =>
                                        <View style={styles.btnStyle}>
                                            <View style={styles.agencySection}>
                                                <Text style={[styles.textTable, { color: COLOR.GRAY }]}>{value.categoryName}</Text>
                                            </View>
                                            <View style={styles.agencySection}>
                                                <Text style={[styles.textTable, { color: COLOR.GRAY }]}>{value.total}</Text>
                                            </View>
                                        </View>)}
                                    <View style={styles.btnStyle}>
                                        <View style={styles.agencySection}>
                                            <Text style={styles.textTable}>Khối lượng(kg) </Text>
                                        </View>
                                        <View style={styles.agencySection}>
                                            <Text style={styles.textTable}>{sum(item.categories)}</Text>
                                        </View>
                                    </View>
                                </View>)
                        }
                    </>) :
                    <View style={{ height: '100%', justifyContent: 'center', marginVertical: 20 }}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>}
            </ScrollView>
        </SafeAreaView >
    )
}
export default StatisticRevenueDetails;

const styles = StyleSheet.create({
    container: {
        // flex: 1

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
    },
    articleSection: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 10,
    },
    articleText: {
        fontSize: screenTextSize,
        color: 'grey',
        // paddingLeft:40,
    },
    agencySection: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderColor: COLOR.GRAY_OPTION,
        borderRightWidth: 2
    },
    selectionSection: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    btnStyle: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: COLOR.GRAY_OPTION,
    },
    btnText: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
        borderColor: COLOR.GRAY_OPTION,
        borderRightWidth: 2,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: COLOR.GREEN_MAIN,
    },
    textBold: {
        fontWeight: 'bold',
    },
    textTable: {
        fontWeight: 'bold',
        fontSize: 16,
        color: COLOR.BLACK
    },
    textTable2: {
        // fontWeight: 'bold',
        fontSize: 14,
        color: COLOR.GRAY
    },
    table: {
        borderColor: COLOR.GRAY_OPTION,
        marginBottom: 20,
        borderWidth: 2
    }
})


