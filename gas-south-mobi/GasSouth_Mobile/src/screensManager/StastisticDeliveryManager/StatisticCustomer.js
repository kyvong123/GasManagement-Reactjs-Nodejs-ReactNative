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
import memoize from 'lodash.memoize';
import i18n from 'i18n-js';
import { Table, Cols, Rows, Col, Row, Cell } from 'react-native-table-component';
import { COLOR } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDeliveryStatistics } from '../../api/orders_new';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
);

// const widthScreen = Dimensions.get('window').width;
const screenTextSize = 16;



const StatisticCustomer = (props) => {

    const statistics = useSelector(deliveryStatistics => deliveryStatistics);

    // Items data
    const [giaoHang, setGiaoHang] = useState([])
    const [giaoGiaoVo, setGiaoVo] = useState([])
    const [HLBD, setHLBD] = useState([])
    const [HLV, setHLV] = useState([])
    const [HLVK, setHLVK] = useState([])

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
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setDate({ ...date, firstDay: formatDate(firstDay), lastDay: formatDate(lastDay) })
            const response = await getDeliveryStatistics(formatDate(firstDay), formatDateIncreaseDay(lastDay), '', '', '', '')
            // console.log(response)
            if (response.status) {
                const temp = response.data.filter(data => data._id.shippingType === "GIAO_HANG")
                console.log("@@@@@@", response.data.filter(data => data._id.shippingType === "GIAO_HANG").sort((a, b) => (a._id.name > b._id.name) ? 1 : -1))
                setGiaoHang(response.data.filter(data => data._id.shippingType === "GIAO_HANG"))
                setGiaoVo(response.data.filter(data => data._id.shippingType === "GIAO_VO"))
                setHLBD(response.data.filter(data => data._id.shippingType === "TRA_BINH_DAY"))
                setHLV(response.data.filter(data => data._id.shippingType === "TRA_VO"))
                setHLVK(response.data.filter(data => data._id.shippingType === "TRA_VO_KHAC"))
                // console.log(response.data.filter(data => data._id.shippingType === "GIAO_HANG" && data._id.manufactureName == "VT GAS")
            }
        } catch (err) {
            console.log("LỖI FETCH API,", err);
        }
    }

    const getStatisticFilter = (arr) => {
        setDate({ ...date, firstDay: props.date.firstDay, lastDay: props.date.lastDay })
        setGiaoHang(arr.filter(data => data._id.shippingType === "GIAO_HANG"))
        setGiaoVo(arr.filter(data => data._id.shippingType === "GIAO_VO"))
        setHLBD(arr.filter(data => data._id.shippingType === "TRA_BINH_DAY"))
        setHLV(arr.filter(data => data._id.shippingType === "TRA_VO"))
        setHLVK(arr.filter(data => data._id.shippingType === "TRA_VO_KHAC"))

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

    useEffect(() => {
        // getThisMonth()
        // getStatistic()
        props.date ? getStatisticFilter(props.list) : getStatistic()
        // props.date ? console.log("@@@@@@") : console.log('###########') 
    }, [props]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.articleSection}>
                <AntDesign
                    name="calendar"
                    size={20}
                    style={[{ marginRight: 5 }, styles.txtGray]}
                />
                {date.firstDay ? <Text style={styles.articleText}>{formatDate2(date.firstDay)} - {formatDate2(date.lastDay)}</Text> : null}
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {giaoHang ? <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>đã giao hàng</Text>
                        </View>
                    </View>
                    <View style={styles.btnStyle}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Thương hiệu</Text>
                        </View>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>loại bình</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={styles.textTable}>Số lượng: {sumQuantity(giaoHang)}</Text>
                        </View>
                    </View>
                    {
                        giaoHang.sort((a, b) => (a._id.manufactureName > b._id.manufactureName) ? 1 : -1).map(item =>
                            <View style={styles.btnStyle}>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.manufactureName}</Text>
                                </View>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.name}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                                    <Text style={styles.textTable2}>{item.count}</Text>
                                </View>
                            </View>
                        )}
                    <View style={{ flexDirection: 'row', }}>
                        <View style={styles.btnText}>
                            <Text style={styles.textTable}>Tổng khối lượng (kg)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                            <Text style={styles.textTable}>{sum(giaoHang)}</Text>
                        </View>
                    </View>
                </View> : null}
                {giaoGiaoVo ? <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Đã giao vỏ</Text>
                        </View>
                    </View>
                    <View style={styles.btnStyle}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Thương hiệu</Text>
                        </View>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>loại bình</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={styles.textTable}>Số lượng: {sumQuantity(giaoGiaoVo)}</Text>
                        </View>
                    </View>
                    {
                        giaoGiaoVo.sort((a, b) => (a._id.manufactureName > b._id.manufactureName) ? 1 : -1).map(item =>
                            <View style={styles.btnStyle}>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.manufactureName}</Text>
                                </View>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.name}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                                    <Text style={styles.textTable2}>{item.count}</Text>
                                </View>
                            </View>
                        )}
                    <View style={{ flexDirection: 'row', }}>
                        <View style={styles.btnText}>
                            <Text style={styles.textTable}>Tổng khối lượng (kg)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                            <Text style={styles.textTable}>{sum(giaoGiaoVo)}</Text>
                        </View>
                    </View>
                </View> : null}
                {HLBD ? <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Hồi lưu bình đầy</Text>
                        </View>
                    </View>
                    <View style={styles.btnStyle}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Thương hiệu</Text>
                        </View>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>loại bình</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={styles.textTable}>Số lượng: {sumQuantity(HLBD)}</Text>
                        </View>
                    </View>
                    {
                        HLBD.sort((a, b) => (a._id.manufactureName > b._id.manufactureName) ? 1 : -1).map(item =>
                            <View style={styles.btnStyle}>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.manufactureName}</Text>
                                </View>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.name}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                                    <Text style={styles.textTable2}>{item.count}</Text>
                                </View>
                            </View>
                        )}
                    <View style={{ flexDirection: 'row', }}>
                        <View style={styles.btnText}>
                            <Text style={styles.textTable}>Tổng khối lượng (kg)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                            <Text style={styles.textTable}>{sum(HLBD)}</Text>
                        </View>
                    </View>
                </View> : null}
                {HLV ? <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Hồi lưu vỏ</Text>
                        </View>
                    </View>
                    <View style={styles.btnStyle}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Thương hiệu</Text>
                        </View>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>loại bình</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={styles.textTable}>Số lượng: {sumQuantity(HLV)}</Text>
                        </View>
                    </View>
                    {
                        HLV.sort((a, b) => (a._id.manufactureName > b._id.manufactureName) ? 1 : -1).map(item =>
                            <View style={styles.btnStyle}>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.manufactureName}</Text>
                                </View>
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.name}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                                    <Text style={styles.textTable2}>{item.count}</Text>
                                </View>
                            </View>
                        )}
                    <View style={{ flexDirection: 'row', }}>
                        <View style={styles.btnText}>
                            <Text style={styles.textTable}>Tổng khối lượng (kg)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                            <Text style={styles.textTable}>{sum(HLV)}</Text>
                        </View>
                    </View>
                </View> : null}
                {HLVK ? <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Hồi lưu vỏ khác</Text>
                        </View>
                    </View>
                    <View style={styles.btnStyle}>
                        {/* <View style={styles.agencySection}>
                            <Text style={styles.textTable}>Thương hiệu</Text>
                        </View> */}
                        <View style={styles.agencySection}>
                            <Text style={styles.textTable}>loại bình</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <Text style={styles.textTable}>Số lượng: {sumQuantity(HLVK)}</Text>
                        </View>
                    </View>
                    {
                        HLVK.sort((a, b) => (a._id.name > b._id.name) ? 1 : -1).map(item =>
                            <View style={styles.btnStyle}>
                                {/* <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.manufactureName}</Text>
                                </View> */}
                                <View style={styles.btnText}>
                                    <Text style={styles.textTable2}>{item._id.name}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                                    <Text style={styles.textTable2}>{item.count}</Text>
                                </View>
                            </View>
                        )}
                    <View style={{ flexDirection: 'row', }}>
                        <View style={styles.btnText}>
                            <Text style={styles.textTable}>Tổng khối lượng (kg)</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', paddingVertical: 5 }}>
                            <Text style={styles.textTable}>{sum(HLVK)}</Text>
                        </View>
                    </View>
                </View> : null}
            </ScrollView>
        </SafeAreaView >
    )
}
export default StatisticCustomer;

const styles = StyleSheet.create({
    container: {
        // flex: 1

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


