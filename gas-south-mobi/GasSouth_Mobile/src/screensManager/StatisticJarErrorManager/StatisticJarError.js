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
import { getDeliveryStatistics, getListJarError } from '../../api/orders_new';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { FACTORY, OWNER, SALESMANAGER, TONG_CONG_TY, TRAM, TRUONG_TRAM } from '../../types';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);

const StatisticJarError = (props) => {

    const statistics = useSelector(deliveryStatistics => deliveryStatistics);
    const [checkAccountTruong_tram, setCheckAccountTruong_tram] = useState(false);//kiem tra tai khoản trưởng trạm
    const [checkAccountTPKD, setCheckAccountTPKD] = useState(false);//kiem tra tai khoản trưởng phòng kinh doanh

    // itemStatistic data
    const [dataStatistic, setDataStatistic] = useState([])

    const [date, setDate] = useState({ firstDay: null, lastDay: null })
    const [dateTemp, setDateTemp] = useState({ firstDay: null, lastDay: null })
    const now = new Date();

    const checAccount = async () => {
        const userinfor = await getUserInfo()
        //check account 
        if (userinfor.userType == TONG_CONG_TY&& userinfor.userRole == SALESMANAGER) {
            setCheckAccountTPKD(true)
        } else if (userinfor.userType == TRAM && userinfor.userRole == TRUONG_TRAM ||
            userinfor.userType == FACTORY && userinfor.userRole == OWNER) {
            setCheckAccountTruong_tram(true)
        }
    }

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
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
            setDateTemp({ ...dateTemp, firstDay: formatDate(firstDay), lastDay: formatDateIncreaseDay(lastDay) })

            const response = await getListJarError(formatDate(firstDay), formatDateIncreaseDay(lastDay))
            if (response.success) {
                if (checkAccountTPKD) {
                    // const temp = response.data.filter(e => e.cylinders.find(a => a?.reasonReturnStationchief != undefined))
                    setDataStatistic(response.data)
                } else {
                    setDataStatistic(response.data)
                }
            }
        } catch (err) {
            console.log("LỖI FETCH API,", err);
        }
    }

    const getStatisticFilter = (arr) => {
        setDate({ ...date, firstDay: props.date.firstDay, lastDay: props.date.lastDay })
        setDateTemp({ ...dateTemp, firstDay: props.date2.firstDay, lastDay: props.date2.lastDay })
        setDataStatistic(arr)
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
                quantity += arr[i].amount
                // }
            }
        }
        return quantity
    }

    useEffect(() => {
        checAccount()
        props.date ? getStatisticFilter(props.list) : getStatistic()
        // props.date ? console.log(props.date) : console.log("111")
    }, [props]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.Nav_container}>
                <TouchableOpacity
                    hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}
                    onPress={() => Actions['home']({})}
                >
                    <Icon size={30} color='#fff' name="ios-arrow-back"></Icon>
                </TouchableOpacity>
                <Text style={styles.Nav_title}>{translate('STATISTICAL_JAR_ERROR')}</Text>
                <View style={{ marginRight: 5 }}>
                    <TouchableOpacity
                        onPress={() => { Actions['filterStatisticJarError']({}) }}>
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
                {date.firstDay ? <Text style={styles.articleText}>{formatDate2(date.firstDay)} - {formatDate2(date.lastDay)}</Text> : null}
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {dataStatistic ? <>
                    {dataStatistic.map((item, index) =>
                        <TouchableOpacity style={styles.itemStatistic}
                            onPress={() => { Actions['statisticJarErrorDetails']({ detailStatistic: item, date: dateTemp }) }}
                        >
                            <Text style={styles.txtItemStatistic}>{item.name}</Text>
                            <Text style={styles.txtItemStatistic}>{item.amount}</Text>
                        </TouchableOpacity>
                    )}
                    <View style={[styles.itemStatistic, { backgroundColor: COLOR.GRAY_OPTION, marginTop: 2 }]}>
                        <Text style={styles.txtItemStatistic}>Tổng bình lỗi</Text>
                        <Text style={styles.txtItemStatistic}>{dataStatistic ? sumQuantity(dataStatistic) : 0}</Text>
                    </View>
                </> : null}
            </ScrollView>
        </SafeAreaView >
    )
}
export default StatisticJarError;

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
    },
    itemStatistic: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomColor: COLOR.GRAY_OPTION,
        borderBottomWidth: 2
    }, txtItemStatistic: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.DARKGRAY
    },
    articleText: {
        fontSize: 16,
        color: 'grey',
        // paddingLeft:40,
    },
})


